import { AbstractService } from '@pravosleva/reactive-engine'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { TReport } from '~/components/Autopark2022/components/_Report/interfaces'

export type TProps = {
  project_id: string;
  chat_id: string;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true })

// Настройка экспоненциальных повторов сетевых запросов
axiosRetry(api, { retries: 100, retryDelay: axiosRetry.exponentialDelay })

// Типизируем структуру хранения пробегов в localStorage: { [chat_id]: { [project_id]: number } }
type TMileageState = Record<string, Record<string, number>>;

export class ReportLogic extends AbstractService {
  // Управляющие стейт-сигналы UI
  public isLoading = this.engine.signal<boolean>(false, 'report:is-loading')
  public apiErr = this.engine.signal<string>('', 'report:api-err')
  public isSubmitDisabled = this.engine.signal<boolean>(false, 'report:is-submit-disabled')
  public report = this.engine.signal<TReport[] | null>(null, 'report:data')

  // Реактивный сигнал пробегов со встроенной синхронизацией в localStorage (замена useStickyState)
  public mileageState = this.engine.signal<TMileageState>({}, 'report:mileage-state')

  private localStorageKey = 'autopark.current-mileage'

  /**
   * Инициализация кэша из localStorage при старте сервиса
   */
  public initCache() {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(this.localStorageKey)
      if (saved) {
        this.mileageState.value = JSON.parse(saved)
      }
    } catch (e) {
      console.error('❌ [ReportLogic:InitCacheError]:', e)
    }
  }

  /**
   * Безопасное получение пробега для конкретной связки чата и проекта
   */
  public getMileageValue(chat_id: string, project_id: string): number | '' {
    return this.mileageState.value[chat_id]?.[project_id] ?? ''
  }

  /**
   * Изменение пробега с глубоким иммутабельным копированием стейта и записью в localStorage
   */
  public changeMileage(chat_id: string, project_id: string, value: string) {
    const numericValue = parseInt(value, 10)
    const validValue = isNaN(numericValue) ? 0 : numericValue

    const currentState = { ...this.mileageState.value }
    const currentChatState = currentState[chat_id] ? { ...currentState[chat_id] } : {}

    currentChatState[project_id] = validValue
    currentState[chat_id] = currentChatState

    // Обновляем сигнал графа вычислений
    this.mileageState.value = currentState
    this.isSubmitDisabled.value = false

    // Пишем в localStorage синхронно
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.localStorageKey, JSON.stringify(currentState))
    }
  }

  /**
   * [COMPUTED]: Декларативная валидация наличия отчетов в стейте
   */
  public hasAnyReport = this.engine.computed<boolean>(() => {
    const currentReport = this.report.value
    return !!currentReport && Array.isArray(currentReport) && currentReport.length > 0
  }, 'report:computed:has-any-report')

  /**
   * Асинхронный метод получения отчета от бэкенда
   */
  public async fetchReport(chat_id: string, project_id: string) {
    const currentMileage = this.getMileageValue(chat_id, project_id)
    if (!currentMileage || this.isLoading.value) return

    this.apiErr.value = ''
    this.isLoading.value = true

    try {
      const payload = {
        chat_id,
        project_id,
        current_mileage: currentMileage,
      }

      interface TReportResponse {
        ok: boolean
        report?: TReport[]
        message?: string
      }

      const res = await api.post<TReportResponse>('/project/get-report', payload)
      const data = res.data

      if (data && data.ok && data.report) {
        this.report.value = data.report
      } else {
        throw new Error(data?.message || 'No message from backend')
      }
    } catch (err: any) {
      this.apiErr.value = typeof err === 'string' ? err : err.message || 'Network error'
    } finally {
      this.isLoading.value = false
      this.isSubmitDisabled.value = true
    }
  }
}
