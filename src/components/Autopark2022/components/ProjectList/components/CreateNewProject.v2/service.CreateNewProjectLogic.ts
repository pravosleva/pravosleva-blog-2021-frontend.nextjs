import { AbstractService, withCache } from '@pravosleva/reactive-engine'
import { Dispatch } from 'redux'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import axios from 'axios'
import { TUserCheckerResponse } from '~/utils/autoparkHttpClient'
import { marks } from '~/components/Autopark2022/components/CarSelectSample/2025-car-marks-list-by-uremont.json'

export type TProps = {
  chat_id: string
}

interface TSubmitArgs {
  chat_id: string
  dispatch: Dispatch
  updateProjects: ActionCreatorWithPayload<TUserCheckerResponse, string>
  // setActiveProject: ActionCreatorWithPayload<any, string>
}

// Контракты данных Uremont API
export type TSpecialImage = { id: number; thumb_140_140: string; thumb_34_34: string; file_url: string; }
export type TUremontGeneration = { id: number; mark_name: string; model_name: string; generation_name: string; start_year: number; finish_year: number; image: string; images: TSpecialImage[]; }
export type TUremontModel = { id: number; name: string; mark_id: number; sort_id: number; rating: number; is_seo_active: number; rgs_code: any; generations: TUremontGeneration[]; }
export type TUremontModelsData = { success: number; models: TUremontModel[] }
export type TModelsFetchResult = { models: string[]; byUremont: TUremontModelsData | null; message?: string; }

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: () => true })

export class CreateNewProjectLogic extends AbstractService {
  // Выпадающие опции брендов из локального JSON
  public brandsOptions = marks.map((m) => ({ label: m.name, ...m }))

  // Реактивные сигналы формы
  public selectedBrand = this.engine.signal<string | null>(null, 'project:brand')
  public selectedModel = this.engine.signal<string | null>(null, 'project:model')
  public selectedTransmission = this.engine.signal<'MT' | 'AT' | 'AMT' | 'CVT' | ''>('', 'project:transmission')
  public selectedGeneration = this.engine.signal<string | null>(null, 'project:generation')
  public selectedYear = this.engine.signal<number | null>(null, 'project:year')
  public description = this.engine.signal<string>('', 'project:description')

  // Стейт-менеджмент UI для процесса сохранения проекта
  public isOpened = this.engine.signal<boolean>(false, 'project:is-opened')
  public isLoading = this.engine.signal<boolean>(false, 'project:is-loading')
  public apiErr = this.engine.signal<string>('', 'project:api-err')

  /**
   * [COMPUTED DEPS]: Мост зависимостей для ресурса подбора моделей.
   */
  private triggerDeps = this.engine.computed(
    () => [this.selectedBrand.value],
    'project:computed:trigger-deps'
  )

  /**
   * [RESOURCE + withCache]: Реактивный декларативный ресурс моделей.
   * Автоматически реагирует на изменение triggerDeps, кэширует ответы на 2 часа
   * и оркестрирует AbortSignal из коробки при быстром переключении брендов.
   */
  public fetchModelsResource = this.engine.resource(
    withCache(
      async ([vendor], abortSignal) => {
        const baseURL2 = isDev
          ? 'http://localhost:5000/car-service'
          : 'http://pravosleva.pro/express-helper/car-service'
        
        const res = await fetch(`${baseURL2}/get-models?vendor=${vendor}`, {
          signal: abortSignal,
        })
        
        if (!res.ok) throw new Error(`${res.status}: Ошибка загрузки данных моделей`)
        return res.json() as Promise<TModelsFetchResult>
      },
      { ttl: 2 * 60 * 60 * 1000 }
    ),
    this.triggerDeps,
    {
      name: 'resource:cached-models',
      // Валидируем, чтобы пустой запрос не улетал в сеть, если бренд сброшен в null
      validateBeforeFetch: ([vendor]) => !!vendor
    }
  )

  public additionalServiceErr = this.engine.computed<string | null>(() => {
    const resError = this.fetchModelsResource.error;
    
    // Если ошибка вызвана нашей валидацией pre-fetch — мягко её игнорируем, 
    // чтобы не пугать пользователя красным алертом на пустой форме
    if (resError?.message?.includes('Pre-fetch validation failed')) {
      return null;
    }
    
    // Возвращаем строго текстовую строку, а не объект!
    return resError ? resError.message : null
  }, 'project:computed:service-error-string')

  /**
   * [COMPUTED]: Вычисляемый список доступных опций моделей для выпадающего списка MUI.
   * Строится на основе стабильных данных реактивного ресурса.
   */
  public modelsOptions = this.engine.computed(() => {
    const resData = this.fetchModelsResource.data
    if (!resData || !resData.models) return []
    return resData.models.map((str) => ({ label: str, value: str }))
  }, 'project:computed:models-options')

  /**
   * [COMPUTED]: Вычисляемый список поколений для выбранной модели.
   */
  public generationOptions = this.engine.computed(() => {
    const resData = this.fetchModelsResource.data
    const modelName = this.selectedModel.value
    
    if (!resData || !resData.byUremont || resData.byUremont.success !== 1 || !modelName) return []
    const byUremont = resData.byUremont

    const result: { label: string; image: string; descr: string }[] = []
    for (const model of byUremont.models) {
      if (model.name === modelName) {
        model.generations.forEach((g) => {
          result.push({
            label: g.generation_name,
            // image: g.image,
            descr: `${g.start_year} - ${g.finish_year || 'Now'}`,
            ...g,
          })
        })
      }
    }
    return result
  }, 'project:computed:generation-options')

  /**
   * [COMPUTED]: Вычисляемая сетка годов выпуска на основе выбранного поколения.
   */
  public yearsOptions = this.engine.computed<number[]>(() => {
    const resData = this.fetchModelsResource.data
    const modelName = this.selectedModel.value
    const genName = this.selectedGeneration.value
    
    if (!resData || !resData.byUremont || resData.byUremont.success !== 1 || !modelName || !genName) return []
    const byUremont = resData.byUremont

    return byUremont.models.reduce((acc: number[], model) => {
      if (model.name === modelName) {
        const targetIndex = model.generations.findIndex((gen) => gen.generation_name === genName)
        if (targetIndex !== -1) {
          const min = model.generations[targetIndex].start_year
          const max = model.generations[targetIndex].finish_year || new Date().getFullYear()
          
          const length = max + 1 - min
          const years = Array.from({ length }, (_, idx) => idx + min)
          return [...acc, ...years]
        }
      }
      return acc
    }, [])
  }, 'project:computed:years-options')

  /**
   * Вспомогательный генератор дефолтного набора годов (1980 - Текущий)
   */
  public getDefaultYears(): number[] {
    const max = new Date().getFullYear()
    return Array.from({ length: max + 1 - 1980 }, (_, idx) => idx + 1980)
  }

  public handleOpen = () => { this.isOpened.value = true }
  
  public handleClose = () => {
    this.resetFormFields()
    this.isOpened.value = false
  }

  public resetFormFields() {
    this.selectedBrand.value = null
    this.selectedModel.value = null
    this.selectedGeneration.value = null
    this.selectedYear.value = null
    this.selectedTransmission.value = ''
    this.description.value = ''
    this.apiErr.value = ''
  }

  /**
   * Асинхронная сборка и отправка сущности нового проекта на сервер
   */
  public async handleSubmit(args: TSubmitArgs) {
    this.isLoading.value = true
    this.apiErr.value = ''

    try {
      const transmissionLabel = this.selectedTransmission.value || '[Выберите тип трансмиссии]'
      const generationPrefix = this.selectedGeneration.value ? `${this.selectedGeneration.value} ` : ''

      const payload = {
        chat_id: args.chat_id,
        name: `${this.selectedBrand.value} ${this.selectedModel.value}, ${transmissionLabel}, ${this.selectedYear.value}`,
        description: `${generationPrefix}${this.description.value}`.trim()
      }

      const res = await api.post<TUserCheckerResponse>('/project/create', payload)
      const data = res.data

      if (data && data.ok) {
        if (data.projects) {
          args.dispatch(args.updateProjects(data))
          // const targetProject = data.projects[args.project_id]
          // if (targetProject) {
          //   args.dispatch(args.setActiveProject(targetProject))
          // }
        }
        this.resetFormFields()
        this.isOpened.value = false
      } else if (data && data.message) {
        this.apiErr.value = `${res.status}: ${String(data.message || 'Что-то пошло не так (v2)')}`
      }
    } catch (err: unknown) {
      this.apiErr.value = (err as Error)?.message || 'Network error on creating project'
    } finally {
      this.isLoading.value = false
    }
  }
}
