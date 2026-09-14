// src/react-markdown-renderers/EdnaExp/EdnaScriptService.ts
import { AbstractService } from '@pravosleva/reactive-engine'

export type TLoadingStatus = 'idle' | 'worker-delay' | 'fetching' | 'injecting' | 'polling-api' | 'success' | 'failed'

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
  public status = this.engine.signal<TLoadingStatus>('idle', 'edna:signal:status')
  public error = this.engine.signal<string | null>(null, 'edna:signal:error')
  public warning = this.engine.signal<string | null>(null, 'edna:signal:warning')
  public isWidgetApiReady = this.engine.signal<boolean>(false, 'edna:signal:api-ready')

  public widgetBadge = this.engine.signal<number>(0, 'edna:signal:widget-badge')
  public widgetTheme = this.engine.signal<string>('dark', 'edna:signal:widget-theme')
  
  public isActionDisabled = this.engine.computed<boolean>(() => {
    const currentStatus = this.status.value
    return currentStatus === 'success' || currentStatus === 'polling-api'
  }, 'edna:computed:action-disabled')

  private pollingIntervalId: any = null
  private pollingTimeoutId: any = null
  private worker: Worker | null = null
  private blobUrl: string | null = null

  public loadScript = (scriptUrl: string, delayMs: number = 2000, pollIntervalMs: number = 2000, maxPollingTimeMs: number = 30000) => {
    if (this.status.value !== 'idle' && this.status.value !== 'failed') {
      this.warning.value = `⚠️ Не пытайтесь делать повторный инжект! Скрипт уже обрабатывается. Текущий статус: ${this.status.value}`
      return
    }

    this.status.value = 'worker-delay'
    this.error.value = null
    this.warning.value = null
    this.isWidgetApiReady.value = false

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

    setTimeout(() => {
      if (this.status.value === 'worker-delay') {
        this.status.value = 'fetching'
      }
    }, delayMs / 2)

    this.worker.onmessage = (e) => {
      const { success, scriptCode, error } = e.data
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

  private injectAndExecuteScript(scriptCode: string, pollIntervalMs: number, maxPollingTimeMs: number) {
    try {
      const existingScript = document.getElementById('edna-experimental-script')
      if (existingScript) existingScript.remove()

      const scriptElement = document.createElement('script')
      scriptElement.type = 'text/javascript'
      scriptElement.id = 'edna-experimental-script'
      scriptElement.text = scriptCode
      
      document.head.appendChild(scriptElement)

      this.status.value = 'polling-api'
      this.startPollingWidgetApi(pollIntervalMs, maxPollingTimeMs)
    } catch (err: any) {
      this.status.value = 'failed'
      this.error.value = `Ошибка инжекта скрипта в Document head: ${err.message}`
    }
  }

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
        if (!widget.onStateChange) {
          // 🔥 ИСПРАВЛЕНО: Добавлен снайперский перехват сигнала ликвидации _isDestroyed
          widget.onStateChange = (updatedState: { badgeCount: number; theme: string; _isDestroyed?: boolean }) => {
            if (updatedState?._isDestroyed === true) {
              console.log("🔌 [Reactive Service]: Пойман внутренний сигнал деструкции.")
              this.reset()
              return
            }
            this.widgetBadge.value = updatedState.badgeCount
            this.widgetTheme.value = updatedState.theme
          }

          if (widget.state) {
            this.widgetBadge.value = widget.state.badgeCount
            this.widgetTheme.value = widget.state.theme
            if (typeof widget._updateUI === 'function') widget._updateUI()
          }
        }

        if (widget.isReady === true) {
          this.clearPollingTimers()
          this.status.value = 'success'
          this.isWidgetApiReady.value = true
          
          if (widget.state) {
            this.widgetBadge.value = widget.state.badgeCount
            this.widgetTheme.value = widget.state.theme
          }
          console.log("🎯 [Reactive Engine]: Поллинг завершен. Виджет синхронизирован.")
        }
      } else {
        this.clearPollingTimers()
        this.status.value = 'failed'
        this.error.value = 'Скрипт успешно инжектирован, но глобальное поле window.ThreadsWidget отсутствует.'
      }
    }, intervalMs)
  }

  public callWidgetIncrement = () => {
    const widget = (window as any).ThreadsWidget
    if (widget && this.isWidgetApiReady.value) {
      widget.incrementBadge()
    } else {
      this.warning.value = '⚠️ Невозможно вызвать метод: виджет еще не готов к работе!'
    }
  }

  public callWidgetToggleTheme = () => {
    const widget = (window as any).ThreadsWidget
    if (widget && this.isWidgetApiReady.value) {
      widget.toggleTheme()
    } else {
      this.warning.value = '⚠️ Невозможно вызвать метод: виджет еще не готов к работе!'
    }
  }

  private clearPollingTimers() {
    if (this.pollingIntervalId) clearInterval(this.pollingIntervalId)
    if (this.pollingTimeoutId) clearTimeout(this.pollingTimeoutId)
  }

  private cleanupWorker() {
    if (this.worker) { this.worker.terminate(); this.worker = null; }
    if (this.blobUrl) { URL.revokeObjectURL(this.blobUrl); this.blobUrl = null; }
  }

  public reset = () => {
    this.clearPollingTimers()
    this.cleanupWorker()

    const scriptTag = document.getElementById('edna-experimental-script')
    if (scriptTag) scriptTag.remove()

    const oldWidget = document.getElementById('edna-threads-widget-root')
    if (oldWidget) oldWidget.remove()
    
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
