import { AbstractService } from '@pravosleva/reactive-engine'

export type TLoadingStatus = 'idle' | 'worker-delay' | 'fetching' | 'injecting' | 'polling-api' | 'success' | 'failed'

// Строковый код воркера для Blob URL
const WORKER_CODE = `
  self.onmessage = async function(e) {
    const { scriptUrl, delayMs } = e.data;
    await new Promise(resolve => setTimeout(resolve, delayMs));
    try {
      const response = await fetch(scriptUrl);
      if (!response.ok) throw new Error("Сервер вернул статус " + response.status);
      const scriptCode = await response.text();
      self.postMessage({ success: true, scriptCode });
    } catch (error) {
      self.postMessage({ success: false, error: error.message });
    }
  };
`

export class EdnaScriptService extends AbstractService {
  // Нативные сигналы вашего движка
  public status = this.engine.signal<TLoadingStatus>('idle', 'edna:signal:status')
  public error = this.engine.signal<string | null>(null, 'edna:signal:error')
  public warning = this.engine.signal<string | null>(null, 'edna:signal:warning')
  public isWidgetApiReady = this.engine.signal<boolean>(false, 'edna:signal:api-ready')

  /* =========================================================================
     НОВЫЕ СИГНАЛЫ ДЛЯ ОТОБРАЖЕНИЯ ВНУТРЕННЕГО СОСТОЯНИЯ ВИДЖЕТА В REACT
     ========================================================================= */
  public widgetBadge = this.engine.signal<number>(0, 'edna:signal:widget-badge')
  public widgetTheme = this.engine.signal<string>('dark', 'edna:signal:widget-theme')
  
  // Вычисляемое состояние (computed) для блокировки кнопки интерфейса
  public isActionDisabled = this.engine.computed<boolean>(() => {
    const currentStatus = this.status.value
    return currentStatus === 'success' || currentStatus === 'polling-api'
  }, 'edna:computed:action-disabled')

  private pollingIntervalId: any = null
  private pollingTimeoutId: any = null
  private worker: Worker | null = null
  private blobUrl: string | null = null

  /**
   * Запуск неблокирующей подгрузки
   */
  /**
   * Инициализация загрузки и инжекта скрипта
   */
  public loadScript = (scriptUrl: string, delayMs: number = 2000, pollIntervalMs: number = 2000, maxPollingTimeMs: number = 30000) => {
    // Проверка на идемпотентность (Пункт 5)
    if (this.status.value !== 'idle' && this.status.value !== 'failed') {
      this.warning.value = `⚠️ Попытка повторного инжекта! Скрипт уже обрабатывается. Текущий статус: ${this.status.value}`
      return
    }

    // Сброс состояния перед новым запуском
    this.status.value = 'worker-delay'
    this.error.value = null
    this.warning.value = null
    this.isWidgetApiReady.value = false

    // Сборка и запуск фонового воркера из Blob URL
    try {
      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' })
      this.blobUrl = URL.createObjectURL(blob)
      this.worker = new Worker(this.blobUrl)
    } catch (err: any) {
      this.status.value = 'failed'
      this.error.value = `Ошибка инициализации Web Worker: ${err.message}`
      return
    }

    this.worker.postMessage({ scriptUrl, delayMs })

    // Перевод статуса в режим скачивания (демонстрация изменения подстатусов в воркере)
    setTimeout(() => {
      if (this.status.value === 'worker-delay') {
        this.status.value = 'fetching'
      }
    }, delayMs / 2)

    this.worker.onmessage = (e) => {
      const { success, scriptCode, error } = e.data
      
      // Сразу утилизируем воркер, освобождая ОС-потоки
      this.cleanupWorker()

      if (!success) {
        this.status.value = 'failed'
        this.error.value = error || 'Фоновый воркер не смог скачать скрипт'
        return
      }

      this.status.value = 'injecting'
      this.injectAndExecuteScript(scriptCode, pollIntervalMs, maxPollingTimeMs)
    }

    this.worker.onerror = (err) => {
      this.status.value = 'failed'
      this.error.value = `Критический сбой потока воркера: ${err.message}`
      this.cleanupWorker()
    }
  }

  /**
   * Выполнение скачанного JS-кода в Main Thread документа
   */
  private injectAndExecuteScript(scriptCode: string, pollIntervalMs: number, maxPollingTimeMs: number) {
    try {
      // ИСПРАВЛЕНО: Перед инжектом проверяем, вдруг старый тег почему-то выжил, и удаляем его
      const existingScript = document.getElementById('edna-experimental-script')
      if (existingScript) {
        existingScript.remove()
      }

      const scriptElement = document.createElement('script')
      scriptElement.type = 'text/javascript'
      scriptElement.id = 'edna-experimental-script' // <-- ДОБАВЛЕНО: уникальный маркер тега
      scriptElement.text = scriptCode
      
      document.head.appendChild(scriptElement)

      // Переходим к фазе поллинга
      this.status.value = 'polling-api'
      this.startPollingWidgetApi(pollIntervalMs, maxPollingTimeMs)
    } catch (err: any) {
      this.status.value = 'failed'
      this.error.value = `Ошибка инжекта скрипта в Document head: ${err.message}`
    }
  }

  /**
   * Пингование window.ThreadsWidget.isReady с мгновенной синхронизацией состояния
   */
  private startPollingWidgetApi(intervalMs: number, maxTimeMs: number) {
    this.clearPollingTimers()

    this.pollingTimeoutId = setTimeout(() => {
      if (this.status.value === 'polling-api') {
        this.clearPollingTimers()
        this.status.value = 'failed'
        this.error.value = `Таймаут ожидания: внутреннее API виджета не ответило за ${maxTimeMs / 1000} сек.`
      }
    }, maxTimeMs)

    this.pollingIntervalId = setInterval(() => {
      const widget = (window as any).ThreadsWidget

      if (widget) {
        /* =========================================================================
           ИСПРАВЛЕНО: МГНОВЕННАЯ ПЕРВИЧНАЯ СИНХРОНИЗАЦИЯ (Решение бага)
           ========================================================================= */
        // 1. Прокидываем колбэк-слушатель для будущих изменений
        if (!widget.onStateChange) {
          widget.onStateChange = (updatedState: { badgeCount: number; theme: string }) => {
            this.widgetBadge.value = updatedState.badgeCount
            this.widgetTheme.value = updatedState.theme
          }

          // 2. СРАЗУ считываем текущее состояние из виджета в ReactiveEngine, не дожидаясь кликов
          if (widget.state) {
            this.widgetBadge.value = widget.state.badgeCount
            this.widgetTheme.value = widget.state.theme
            
            // 3. Заставляем виджет обновить свой Glassmorphism-фон прямо сейчас
            if (typeof widget._updateUI === 'function') {
              widget._updateUI()
            }
          }
        }

        // Проверяем статус внутренней готовности асинхронного API виджета
        if (widget.isReady === true) {
          this.clearPollingTimers()
          
          this.status.value = 'success'
          this.isWidgetApiReady.value = true
          
          // Финальное подтверждение стейта при успешной готовности
          if (widget.state) {
            this.widgetBadge.value = widget.state.badgeCount
            this.widgetTheme.value = widget.state.theme
          }
          console.log("🎯 [Reactive Engine]: Поллинг завершен. Виджет полностью готов и синхронизирован.")
        }
      } else {
        this.clearPollingTimers()
        this.status.value = 'failed'
        this.error.value = 'Скрипт успешно инжектирован, но глобальное поле window.ThreadsWidget отсутствует.'
      }
    }, intervalMs)
  }

  /* =========================================================================
     НОВЫЕ МЕТОДЫ-ПРОКСИ ДЛЯ УПРАВЛЕНИЯ ВИДЖЕТОМ ИЗ REACT КОМПОНЕНТА
     ========================================================================= */
  public callWidgetIncrement = () => {
    const widget = (window as any).ThreadsWidget
    if (widget && this.isWidgetApiReady.value) {
      widget.incrementBadge() // Вызываем нативный метод объекта window
    } else {
      this.warning.value = '⚠️ Невозможно вызвать метод: виджет еще не готов к работе!'
    }
  }

  public callWidgetToggleTheme = () => {
    const widget = (window as any).ThreadsWidget
    if (widget && this.isWidgetApiReady.value) {
      widget.toggleTheme() // Вызываем нативный метод объекта window
    } else {
      this.warning.value = '⚠️ Невозможно вызвать метод: виджет еще не готов к работе!'
    }
  }

  private clearPollingTimers() {
    if (this.pollingIntervalId) clearInterval(this.pollingIntervalId)
    if (this.pollingTimeoutId) clearTimeout(this.pollingTimeoutId)
  }

  /**
   * Ликвидация фонового потока воркера для предотвращения утечек памяти
   */
  private cleanupWorker() {
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    if (this.blobUrl) { URL.revokeObjectURL(this.blobUrl); this.blobUrl = null; }
  }

  /**
   * Сброс экспериментального стенда в исходное состояние
   */
  public reset = () => {
    this.clearPollingTimers()
    this.cleanupWorker()

    // ИСПРАВЛЕНО: Полностью удаляем сам тег <script> из head, чтобы не засорять DOM
    const scriptTag = document.getElementById('edna-experimental-script')
    if (scriptTag) {
      scriptTag.remove()
      console.log("🗑️ [Reactive Engine]: Тег <script> успешно удален из head.")
    }

    // Удаляем DOM-ноду плашки, созданную скриптом
    const oldWidget = document.getElementById('edna-threads-widget-root')
    if (oldWidget) oldWidget.remove()
    
    // Стираем мутацию window
    if ((window as any).ThreadsWidget) {
      delete (window as any).ThreadsWidget
    }

    this.status.value = 'idle'
    this.error.value = null
    this.warning.value = null
    this.isWidgetApiReady.value = false
    this.widgetBadge.value = 0
    this.widgetTheme.value = 'dark'
    console.log("🔄 [Reactive Engine]: Состояние сервиса полностью очищено.")
  }

}
