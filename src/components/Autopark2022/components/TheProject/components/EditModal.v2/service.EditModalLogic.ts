import { AbstractService } from '@pravosleva/reactive-engine'
import { Dispatch } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import axios from 'axios'

// 1. ИМПОРТИРУЕМ ОРИГИНАЛЬНЫЕ ТИПЫ ИЗ ВАШЕЙ КОДОВОЙ БАЗЫ
// Пути восстановлены на основе логов ошибок вашей сборки
import { TUserCheckerResponse } from '~/utils/autoparkHttpClient'

// Вытаскиваем точную структуру проекта, которую ожидает initialState вашего компонента
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

// 2. СТРОГО ТИПИЗИРУЕМ АРГУМЕНТЫ НА БАЗЕ ЭТАЛОННЫХ ТИПОВ
interface TSubmitArgs {
  chat_id: string;
  project_id: string;
  dispatch: Dispatch;
  // Передаем точный импортированный тип из Redux Toolkit createSlice
  updateProjects: ActionCreatorWithPayload<TUserCheckerResponse, string>;
  // Для activeProject используем any или точный тип экшена, если он известен
  setActiveProject: ActionCreatorWithPayload<any, string>;
  onClose?: () => void;
}

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true })

export class EditModalLogic extends AbstractService {
  // Локальное реактивное состояние формы для управления Material UI
  public id = this.engine.signal<number | null>(null, 'edit-modal:id')
  public name = this.engine.signal<string>('', 'edit-modal:name')
  public description = this.engine.signal<string>('', 'edit-modal:description')
  public mileageLast = this.engine.signal<number>(0, 'edit-modal:mileage-last')
  public mileageDelta = this.engine.signal<number>(0, 'edit-modal:mileage-delta')
  public isSubmitting = this.engine.signal<boolean>(false, 'edit-modal:is-submitting')
  public apiErr = this.engine.signal<string>('', 'edit-modal:api-err')

  public isFormCorrect = this.engine.computed<boolean>(() => {
    return (
      !!this.name.value &&
      !!this.id.value &&
      !!this.description.value &&
      !!this.mileageLast.value &&
      !!this.mileageDelta.value
    )
  }, 'edit-modal:computed:is-form-correct')

  public syncInitialState(initialState: TProps['initialState']) {
    this.id.value = initialState.id
    this.name.value = initialState.name
    this.description.value = initialState.description
    this.mileageLast.value = initialState.mileage.last
    this.mileageDelta.value = initialState.mileage.delta
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

      // Запрос типизируем оригинальным TUserCheckerResponse
      const res = await api.post<TUserCheckerResponse>('/project/update-item', payload)
      const data = res.data

      if (data && data.ok && data.projects) {
        // Диспатчим объект, который идеально совпадает по структуре
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
