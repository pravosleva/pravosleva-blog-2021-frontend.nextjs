import { withDebounce, AbstractService } from '@pravosleva/reactive-engine'
import { NCodeSamplesSpace } from '~/types'
import { universalHttpClient } from '~/utils/universalHttpClient'

const STORAGE_KEY_QUERY = 'search:ls:query'
// Вспомогательная утилита для безопасного чтения QUERY на этапе SSR
const getInitialQuery = (): string => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(STORAGE_KEY_QUERY) || ''
    } catch (e) {
      console.error(e)
    }
  }
  return ''
}

export class SearchArticlesService extends AbstractService {
  // 1. Инициализируем реактивные сигналы-зависимости. searchQuery сразу получает значение из LocalStorage
  public searchQuery = this.engine.signal<string>(getInitialQuery(), 'search:query')
  public currentPage = this.engine.signal<number>(1, 'search:current_page')

  // Дополнительные сигналы для хранения пагинации от бэкенда
  public totalPages = this.engine.signal<number>(1, 'search:total_pages')
  public totalNotes = this.engine.signal<number>(0, 'search:total_notes')
  public limit = this.engine.signal<number>(5, 'search:limit')

  // #SEARCH_PANEL_EXP 1/3
  public isSearchPanelOpen = this.engine.signal<boolean>(false, 'search:is_panel_open')

  private resourceDeps = this.engine.computed(
    () => [
      this.searchQuery.value,
      this.currentPage.value,
      this.limit.value,
    ],
    'search:resource_deps'
  )

  /**
   * ✅ BUGFIX: Явный публичный метод для изменения строки поиска.
   * Он вызывается только тогда, когда ПОЛЬЗОВАТЕЛЬ вводит текст в инпут.
   * Никакие внутренние тики дебаунса ресурса его не затриггерят.
   */
  public changeQuery(newQuery: string): void {
    this.searchQuery.value = newQuery
    // Если мы ушли на дальние страницы, принудительно возвращаем пользователя на 1-ю
    if (this.currentPage.value !== 1) {
      this.resetPagination()
    }
  }

  /**
   * АВТОМАТИЧЕСКИЙ РЕСУРС ПОИСКА
   * Реагирует на любые изменения searchQuery и currentPage.
   * Дебаунс накладывается прямо на асинхронную функцию фетчинга.
   */
  public searchResource = this.engine.resource(
    withDebounce(
      async ([queryValue, page, limit], _abortSignal) => {
        if (!queryValue || typeof queryValue !== 'string') {
          throw new Error('Empty queryValue!')
          // return []
        }

        /**
         * НОВАЯ ЛОГИКА НОРМАЛИЗАЦИИ:
         * 1. .trim() — убираем пробелы по краям
         * 2. .toLowerCase() — приводим всю строку к нижнему регистру
         * 3. .replace(/\s+/g, ' ') — заменяем любые группы пробелов (двойные, тройные, табы) на один пробел
         * 4. .split(' ') — бьем строку на массив отдельных слов
         * 5. .join(',') — склеиваем слова через запятую для API
         */
        const normalizedWords = queryValue
          .trim()
          .toLowerCase()
          .replace(/\s+/g, ' ')
          .split(' ')
          .join(',')

        const endpoint = `/express-next-api/code-samples-proxy/api/notes?q_title_all_words=${encodeURIComponent(normalizedWords)}&page=${page}&limit=${limit}`
        const response = await universalHttpClient.get(endpoint)

        if (response.ok && response.response?.success && Array.isArray(response.response.data)) {
          const { data, pagination } = response.response
          
          // Синхронизируем мета-данные пагинации
          this.totalPages.value = pagination.totalPages || 1
          this.totalNotes.value = pagination.totalNotes || 0
          
          return data as NCodeSamplesSpace.TNote[]
        }

        if (!response.response?.success) throw new Error(response.message || 'API ERR (no mgs)')
        
        return [] as NCodeSamplesSpace.TNote[]
      },
      { delay: 400 } // Задержка дебаунса 400 мс
    ),
    this.resourceDeps, // Отслеживаем изменения строки поиска и текущей запрашиваемой страницы
    {
      name: 'search:resource:fetch',
      // Запрещаем отправку запроса на сервер, если инпут пустой или состоит из пробелов
      validateBeforeFetch: ([queryValue, _page]) =>
        typeof queryValue !== 'string'
        ? 'queryValue ERR: Expected string!'
        : !(queryValue as string).trim()
          ? false // 'queryValue ERR: Expected NOT EMPTY string!'
          : true
    }
  )

  /**
   * 2. ПРИВАТНЫЙ ЭФФЕКТ ДЛЯ СОХРАНЕНИЯ QUERY В LOCALSTORAGE
   * Создается как свойство класса. Движок подхватит его автоматически при старте.
   */
  private persistEffect = this.engine.effect(() => {
    if (typeof window === 'undefined') return
    const query = this.searchQuery.value

    try {
      if (query) {
        localStorage.setItem(STORAGE_KEY_QUERY, query)
      } else {
        localStorage.removeItem(STORAGE_KEY_QUERY)
      }
    } catch (e) {
      console.error('Ошибка записи QUERY в localStorage:', e)
    }
  }, 'effect:persist-search-query')

  /**
   * ⛔ 3. ПРИВАТНАЯ ПОДПИСКА ДЛЯ СБРОСА ПАГИНАЦИИ
   * Автоматически сбрасывает страницу на 1 при изменении строки поиска.
   */
  // private __resetPageSubscription = this.searchQuery.subscribe((_queryValue) => {
  //   if (this.currentPage.value !== 1) {
  //     this.resetPagination()
  //   }
  // })

  public resetPagination(): void {
    this.currentPage.value = 1
    this.totalPages.value = 1
    this.totalNotes.value = 0
  }

  // Метод полной очистки стейта
  public reset(): void {
    this.searchQuery.value = ''
    this.currentPage.value = 1
    this.totalPages.value = 1
    this.totalNotes.value = 0
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(STORAGE_KEY_QUERY) } catch (e) { console.error(e) }
    }

    // #SEARCH_PANEL_EXP 2/3
    this.isSearchPanelOpen.value = false
  }
}
