import { AbstractService } from '@pravosleva/reactive-engine'
import { Dispatch } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUserCheckerResponse } from '~/utils/autoparkHttpClient'

export type TProps = {
  chat_id: string
  project_id: string
}

interface TSubmitArgs {
  chat_id: string
  project_id: string
  dispatch: Dispatch
  updateProjects: ActionCreatorWithPayload<TUserCheckerResponse, string>
  setActiveProject: ActionCreatorWithPayload<any, string>
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: () => true })

export class CreateNewItemLogic extends AbstractService {
  // Локальные сигналы полей ввода
  public name = this.engine.signal<string>('', 'create-item:name')
  public description = this.engine.signal<string>('', 'create-item:description')
  public mileageLast = this.engine.signal<number>(0, 'create-item:mileage-last')
  public mileageDelta = this.engine.signal<number>(0, 'create-item:mileage-delta')

  // Управляющие стейт-сигналы UI
  public isOpened = this.engine.signal<boolean>(false, 'create-item:is-opened')
  public isLoading = this.engine.signal<boolean>(false, 'create-item:is-loading')
  public apiErr = this.engine.signal<string>('', 'create-item:api-err')

  /**
   * [COMPUTED]: Декларативная валидация формы.
   */
  public isFormCorrect = this.engine.computed<boolean>(() => {
    return (
      !!this.name.value.trim() &&
      !!this.description.value.trim() &&
      this.mileageLast.value >= 0 &&
      this.mileageDelta.value > 0
    )
  }, 'create-item:computed:is-form-correct')

  /**
   * 🔥 УНИВЕРСАЛЬНЫЙ МЕТОД: Извлекает данные полей из HTML-формы за один проход.
   * Работает нативно и плавно без посимвольного перерендерирования инпутов.
   */
  public updateFieldsFromForm(formElement: HTMLFormElement) {
    const formData = new FormData(formElement)
    
    this.name.value = String(formData.get('name') || '')
    this.description.value = String(formData.get('description') || '')
    
    const last = parseInt(String(formData.get('mileageLast')), 10)
    this.mileageLast.value = isNaN(last) ? 0 : last

    const delta = parseInt(String(formData.get('mileageDelta')), 10)
    this.mileageDelta.value = isNaN(delta) ? 0 : delta
  }

  public handleOpen = () => {
    this.isOpened.value = true
  }

  public handleClose = () => {
    this.isOpened.value = false
  }

  public resetAll = () => {
    this.name.value = ''
    this.description.value = ''
    this.mileageLast.value = 0
    this.mileageDelta.value = 0
    this.apiErr.value = ''
    this.handleClose()
  }

  /**
   * Асинхронный метод создания записи на сервере с обновлением Redux
   */
  public async handleSubmit(args: TSubmitArgs) {
    if (!this.isFormCorrect.value || this.isLoading.value) return

    this.isLoading.value = true
    this.apiErr.value = ''

    try {
      const payload = {
        chat_id: args.chat_id,
        project_id: args.project_id,
        item: {
          name: this.name.value,
          description: this.description.value,
          mileage: {
            last: this.mileageLast.value,
            delta: this.mileageDelta.value,
          }
        }
      }

      const res = await api.post<TUserCheckerResponse>('/project/add-item', payload)
      const data = res.data

      if (data && data.ok) {
        if (data.projects) {
          args.dispatch(args.updateProjects(data))
          const targetProject = data.projects[args.project_id]
          if (targetProject) {
            args.dispatch(args.setActiveProject(targetProject))
          }
        }
        this.resetAll()
      } else if (data) {
        this.apiErr.value = `${res.status}: ${String(data.message || 'Что-то пошло не так (v2)')}`
      }
    } catch (err: any) {
      this.apiErr.value = typeof err === 'string' ? err : err.message || 'Unknown network error'
    } finally {
      this.isLoading.value = false
    }
  }
}
