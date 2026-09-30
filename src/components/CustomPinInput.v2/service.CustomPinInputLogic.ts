import { AbstractService } from '@pravosleva/reactive-engine'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { groupLog } from '~/utils/groupLog'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev ? 'http://localhost:2021' : 'http://pravosleva.pro/tg-bot-2021'

const api = axios.create({ baseURL, validateStatus: (_s: number) => true })

let interceptorCount = 0
api.interceptors.response.use((config) => {
  interceptorCount += 1
  groupLog({ spaceName: `API interceptor: ${interceptorCount}`, items: [interceptorCount, config] })
  return config
})

axiosRetry(api, { retries: 10, retryDelay: axiosRetry.exponentialDelay })

export class CustomPinInputLogic extends AbstractService {
  public errMsg = this.engine.signal<string | null>(null, 'pin:err-msg')
  public successMsg = this.engine.signal<string | null>(null, 'pin:success-msg')
  
  // Разделяем лоадеры: один для отправки кода в ТГ, второй для проверки пина
  public isSending = this.engine.signal<boolean>(false, 'pin:is-sending')
  public isVerifying = this.engine.signal<boolean>(false, 'pin:is-verifying')

  /**
   * Шаг А: Отправка секретного кода в Telegram пользователю
   */
  public async sendPasswordToUser(chat_id: string) {
    this.errMsg.value = null
    this.successMsg.value = null
    this.isSending.value = true

    try {
      const res = await api.post<{ ok: boolean; message?: string }>('/autopark-2022/send-code', { chat_id })
      const data = res.data

      if (data && data.ok) {
        this.successMsg.value = 'Пароль отправлен в Telegram бота @pravosleva_bot. Найдите его и введите код ниже.'
      } else {
        this.errMsg.value = data?.message || 'Не удалось отправить пароль'
      }
    } catch (err: any) {
      this.errMsg.value = err.message || 'Ошибка сети при отправке кода'
    } finally {
      this.isSending.value = false
    }
  }
}
