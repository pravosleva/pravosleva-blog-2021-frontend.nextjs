import { AbstractService } from '@pravosleva/reactive-engine'
import { Dispatch } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUserCheckerResponse } from '~/utils/autoparkHttpClient'

export interface TProjectItem {
  id: number;
  name: string;
  description: string;
  mileage: {
    last: number;
    delta: number;
  };
}

export type TProps = {
  chat_id: string;
  project_id: string;
  isOpened: boolean;
  onClose?: () => void;
  initialState: TProjectItem;
}

interface TSubmitArgs {
  chat_id: string;
  project_id: string;
  dispatch: Dispatch;
  updateProjects: ActionCreatorWithPayload<TUserCheckerResponse, string>;
  setActiveProject: ActionCreatorWithPayload<any, string>;
  onClose?: () => void;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true })

export class EditModalLogic extends AbstractService {
  public id = this.engine.signal<number | null>(null, 'edit-modal:id')
  public name = this.engine.signal<string>('', 'edit-modal:name')
  public description = this.engine.signal<string>('', 'edit-modal:description')
  public mileageLast = this.engine.signal<number>(0, 'edit-modal:mileage-last')
  public mileageDelta = this.engine.signal<number>(0, 'edit-modal:mileage-delta')
  public isSubmitting = this.engine.signal<boolean>(false, 'edit-modal:is-submitting')
  public apiErr = this.engine.signal<string>('', 'edit-modal:api-err')

  public isFormCorrect = this.engine.computed<boolean>(() => {
    return (
      !!this.name.value.trim() &&
      !!this.id.value &&
      !!this.description.value.trim() &&
      this.mileageLast.value >= 0 &&
      this.mileageDelta.value > 0
    )
  }, 'edit-modal:computed:is-form-correct')

  public syncInitialState(initialState: TProps['initialState']) {
    this.id.value = initialState.id
    this.name.value = initialState.name
    this.description.value = initialState.description
    this.mileageLast.value = initialState.mileage.last
    this.mileageDelta.value = initialState.mileage.delta
  }

  /**
   * 🔥 УНИВЕРСАЛЬНЫЙ МЕТОД: Извлекает данные всех полей из HTML-формы за один проход.
   * Работает нативно без посимвольного перерендерирования инпутов.
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

  public async submitForm(args: TSubmitArgs) {
    if (!this.isFormCorrect.value || this.isSubmitting.value) return

    this.apiErr.value = ''
    this.isSubmitting.value = true

    try {
      const payload = {
        chat_id: args.chat_id,
        project_id: args.project_id,
        item: {
          id: this.id.value!,
          name: this.name.value,
          description: this.description.value,
          mileage: {
            last: this.mileageLast.value,
            delta: this.mileageDelta.value,
          },
        },
      }

      const res = await api.post<TUserCheckerResponse>('/project/update-item', payload)
      const data = res.data

      if (data && data.ok && data.projects) {
        args.dispatch(args.updateProjects(data))
        
        const targetProject = data.projects[args.project_id]
        if (targetProject) {
          args.dispatch(args.setActiveProject(targetProject))
        }
        
        if (args.onClose) args.onClose()
      } else if (data) {
        this.apiErr.value = `${res.status}: ${String(data.message || 'Что-то пошло не так (v2)')}`
      }
    } catch (err: unknown) {
      console.error('❌ [EditModalLogic:SubmitError]:', err)
      this.apiErr.value = String((err as Error)?.message || 'Что-то пошло не так (v2)')
    } finally {
      this.isSubmitting.value = false
    }
  }
}
