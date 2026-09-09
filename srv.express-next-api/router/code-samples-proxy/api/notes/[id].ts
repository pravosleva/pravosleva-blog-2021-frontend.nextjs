import { Request as IRequest, Response as IResponse } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
// import { TEnhancedResponse } from '~/srv.utils/types'
import path from 'path'
import { readLocalMdxFallback } from '~/srv.utils/local-mdx/readLocalMdxFallback'
import { TLocalSlugMap } from '~/srv.utils/cahce/slug-map/slugMap.cahe'

const NOTES_BASE_API_URL = 'http://62.109.21.103' // http://code-samples.space

export const rules = {
  params: {
    params: {
      id: {
        type: 'string',
        descr: 'One of two: _id || slug',
        required: true,
        validate: (val: unknown) => ({
          ok: !!val && typeof val === 'string',
          reason: 'Should be string'
        }),
      },
    },
  }
}

export const getNote = async (req: IRequest, res: IResponse) => {
  const isLocalSearchEnabled = process.env.NOTES_IS_LOCAL_SEARCH_ENABLED === '1'
  const iRemoteSearchEnabled = process.env.NOTES_IS_REMOTE_SEARCH_ENABLED === '1'
  const { id: slugOrId } = req.params
  const logs: string[] = []

  let possibleId = slugOrId
  let isTargetArticlePrivate = false

  // Вытаскиваем инстанс кэша, переданный через глобальный проброс в run.ts
  const cacheService = req.slugMapCacheInstance

  // --- ШАГ 0: ПОЛУЧЕНИЕ АКТУАЛЬНОЙ КАРТЫ ИЗ СИНГЛТОН-КЛАССА КЭША ---
  if (isLocalSearchEnabled) {
    let slugMapping: TLocalSlugMap | {} | null = null
    
    // Вызываем умный метод класса. Замыкание побеждено!
    const activeData = req.slugMap  // cacheService?.getMapping()

    if (activeData) {
      // КЭШ-ХИТ: Данные успешно взяты из памяти синглтона
      slugMapping = activeData
    } else {
      // КЭШ-МИСС: Если в памяти пусто — делаем один прямой сетевой запрос
      res.startTime('db_proxy_get_slug_map_direct', 'Fallback call directly to local network json')
      try {
        const mapResult = await universalHttpClient.getNoApiErr<TLocalSlugMap>('/static/local.slug-map.json')
        if (mapResult.isOk && mapResult.response) {
          slugMapping = mapResult.response
          
          // Синхронно и принудительно выставляем время апдейта в памяти Node.js
          if (!!cacheService) cacheService.updateTimestampDirectly()
        }
      } catch (directMapError) {
        logs.push(`⚠️ Direct SlugMap fetch failed: ${(directMapError as Error).message}`)
      }
      res.endTime('db_proxy_get_slug_map_direct')
    }

    // Опрашиваем честный возраст, очищенный от замыканий
    const currentCacheAge = !!cacheService ? cacheService.getHumanReadableAge() : 'No data in request context'
    res.startTime('reactive_cache_get_slug_map', `Read from shared singleton cache state; Last update: ${currentCacheAge}`)
    res.endTime('reactive_cache_get_slug_map')

    logs.push(`[Cache Info] Время с момента последнего обновления: ${currentCacheAge}`)

    // 3. БЕЗОПАСНАЯ ОБРАБОТКА ОБЪЕКТА СЛАГОВ
    if (slugMapping && Object.keys(slugMapping).length > 0) {
      const activeMapping = slugMapping as TLocalSlugMap

      if (activeMapping[slugOrId]) {
        const matchedMeta = activeMapping[slugOrId]
        if (matchedMeta.id) possibleId = String(matchedMeta.id)
        if (matchedMeta.isPrivate) isTargetArticlePrivate = true
      } else {
        const foundSlugEntry = Object.entries(activeMapping).find(
          ([_, meta]) => String(meta.id) === String(slugOrId)
        )
        if (foundSlugEntry) {
          const metaData = foundSlugEntry[1]
          if (metaData.isPrivate) isTargetArticlePrivate = true
        }
      }
    }
  }

  logs.push(`id -> ${slugOrId} -> ${possibleId}`)
  logs.push(`isLocalSearchEnabled -> ${String(isLocalSearchEnabled)}; process.env.NOTES_IS_LOCAL_SEARCH_ENABLED=${String(process.env.NOTES_IS_LOCAL_SEARCH_ENABLED)}`)

  // --- ШАГ 1: ФОЛБЕК КЕЙС (Чтение локального файла .mdx) ---
  if (isLocalSearchEnabled && !isTargetArticlePrivate) {
    const articlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')
    let localArticleJson: any = null
    
    res.startTime('db_proxy_local_fallback', `${articlesDirectory} for [id]=${slugOrId}`)
    try {
      logs.push('🚀 read file START')
      // Передаем слаг в метод чтения. Он отработает из папки public.
      localArticleJson = await readLocalMdxFallback(slugOrId)
      logs.push('👍 read file END')
    } catch (err: unknown) {
      logs.push(`👎 read file ERROR: ${(err as Error)?.message || 'No err?.message'}`)
    }
    res.endTime('db_proxy_local_fallback')

    if (localArticleJson && !localArticleJson?.isPrivate) {
      logs.push(`✅ localArticleJson is OK`)
      return res.status(200).send({
        logs,
        success: true,
        data: localArticleJson,
      })
    } else {
      logs.push(`🚫 localArticleJson is NOT OK`)
    }
  }

  logs.push(`iRemoteSearchEnabled -> ${String(iRemoteSearchEnabled)}; process.env.NOTES_IS_REMOTE_SEARCH_ENABLED=${String(process.env.NOTES_IS_REMOTE_SEARCH_ENABLED)}`)

  // --- ШАГ 2: СЕТЕВОЙ ЗАПРОС К УДАЛЕННОМУ API ---
  if (iRemoteSearchEnabled) {
    res.startTime('db_proxy_get_note', `${NOTES_BASE_API_URL}/api/notes/${possibleId}`)
    const url = `${NOTES_BASE_API_URL}/api/notes/${possibleId}`
    
    try {
      const noteResult = await universalHttpClient.get(url)
      res.endTime('db_proxy_get_note')
      
      if (noteResult.isOk && !!noteResult.response) {
        logs.push(`✅ noteResult (remote API) is OK`)
        return res.status(200).send({ logs, ...noteResult.response })
      }
      throw new Error(`API: Err noteResult.isOk -> ${String(noteResult.isOk)}, !!noteResult.response -> ${String(!!noteResult.response)}`)
    } catch (err: unknown) {
      logs.push(`🚫 noteResult (remote API) is NOT OK, ${(err as Error)?.message || 'No err?.message'}`)
    }
  }

  // --- ШАГ 3: ФИНАЛЬНЫЙ ОТВЕТ ОБ ОШИБКЕ ---
  return res.status(500).send({
    logs,
    success: false,
  })
}
