import { ReactiveEngine, withCache, Resource } from '@pravosleva/reactive-engine'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export interface ILocalSlugItem {
  title: string
  brief: string
  id?: string | number
  isPrivate?: boolean
  isDraft?: boolean
  createdAt?: string
  updatedAt?: string
  priority?: number
  tags?: string[]
  category?: string
  author?: string
  _id?: string | number
  bg?: { src: string; size: { w: number; h: number }; type: string }
}

export type TLocalSlugMap = Record<string, ILocalSlugItem>

declare global {
  var __slugMapCacheServiceInstance: SlugMapCacheService | undefined;
  // Добавляем глобальную ссылку для таймера, чтобы он не плодился при Hot Reload
  var __slugMapCacheInterval: NodeJS.Timeout | undefined;
}

class SlugMapCacheService {
  public engine: ReactiveEngine
  public slugMapResource: Resource<TLocalSlugMap>
  private lastUpdatedTimestamp: number = 0

  private constructor() {
    this.engine = new ReactiveEngine({
      logger: { isEnabled: false, instanceName: 'ServerSlugsSingletonClass' }
    })

    const cacheTriggerSignal = this.engine.signal<number>(0, 'cacheTrigger')
    const cacheDeps = this.engine.computed<[number]>(() => [cacheTriggerSignal.value])

    this.slugMapResource = this.engine.resource(
      withCache(
        async ([triggerValue], _abortSignal) => {
          console.log(`📡 [SlugMapCacheService:${triggerValue}] Движок пошел по сети к local.slug-map.json...`)
          const mapResult = await universalHttpClient.getNoApiErr<TLocalSlugMap>('/static/local.slug-map.json')
          if (!mapResult.isOk || !mapResult.response) {
            throw new Error(mapResult.message || 'Не удалось загрузить local.slug-map.json')
          }
          return mapResult.response
        },
        { ttl: 1 * 60 * 60 * 1000 } // TTL 1h
      ),
      cacheDeps,
      'resource:/static/local.slug-map.json'
    )

    // Эффект №1: Отслеживает успешное наполнение кэша и фиксирует время
    this.engine.effect(() => {
      const state = this.slugMapResource.value
      if (state && state.data && Object.keys(state.data).length > 0) {
        this.lastUpdatedTimestamp = Date.now()
        console.log(`✨ [SlugMapCacheService Cache-Hit] Таймстамп кэша обновлен движком: ${new Date(this.lastUpdatedTimestamp).toLocaleTimeString()}`)
      }
    }, 'eff:lastUpdatedTimestamp')

    // ОПТИМИЗАЦИЯ 1: Безопасный интервал. Чистим старый таймер, если он остался от Hot Reload в Next.js
    if (global.__slugMapCacheInterval) {
      clearInterval(global.__slugMapCacheInterval)
    }

    // Запускаем регулярный Heartbeat для пинания реактивного сигнала раз в 30 секунд
    global.__slugMapCacheInterval = setInterval(() => {
      cacheTriggerSignal.value += 1
    }, 30 * 60 * 1000) // NOTE: Every 30min
  }

  public static getInstance(): SlugMapCacheService {
    if (!global.__slugMapCacheServiceInstance) {
      global.__slugMapCacheServiceInstance = new SlugMapCacheService()
    }
    return global.__slugMapCacheServiceInstance
  }

  public getMapping(): TLocalSlugMap | null {
    const state = this.slugMapResource.value
    return (state && state.data && Object.keys(state.data).length > 0) ? state.data : null
  }

  public updateTimestampDirectly(): void {
    this.lastUpdatedTimestamp = Date.now()
  }

  public getHumanReadableAge(): string {
    if (this.lastUpdatedTimestamp === 0) return 'never'
    
    const diffInSeconds = Math.floor((Date.now() - this.lastUpdatedTimestamp) / 1000)
    
    if (diffInSeconds >= 30) {
      return `expired (${diffInSeconds} sec ago)`
    }

    if (diffInSeconds < 5) return 'just now'
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`
    
    const minutes = Math.floor(diffInSeconds / 60)
    const seconds = diffInSeconds % 60
    
    if (seconds === 0) return `${minutes} min ago`
    return `${minutes} min ${seconds} sec ago`
  }
}

export const slugMapCacheInstance = SlugMapCacheService.getInstance()
