import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { Request as IRequest, Response as IResponse } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { getNote, rules as singleNoteRules } from './[id]'
import { NCodeSamplesSpace } from '~/types'
import { NResponseLocal } from '~/srv.utils/errors/api'
import { TLocalSlugMap } from '~/srv.utils/cahce/slug-map/slugMap.cahe'
import { defaultBg } from '~/srv.utils/local-mdx/readLocalMdxFallback'

const codeSamplesProxyApi = express()
const NOTES_BASE_API_URL = 'http://62.109.21.103' // http://code-samples.space

export const indexRules = {
  params: {
    query: {
      limit: {
        type: 'number', descr: 'Limit', required: false,
        validate: (val: any) => ({
          ok: !val || (typeof val === 'string' && !isNaN(Number(val))),
          reason: 'Should be number (optional)'
        }),
      },
      page: {
        type: 'number', descr: 'Current page', required: false,
        validate: (val: any) => ({
          ok: !val || (typeof val === 'string' && !isNaN(Number(val))),
          reason: 'Should be number (optional)'
        }),
      },
      q_title_all_words: {
        type: 'string', descr: 'Words', required: false,
        validate: (val: any) => ({
          ok: !val || typeof val === 'string',
          reason: 'Should be string (optional)'
        }),
      },
    },
  }
}

// Обновленная функция быстрого поиска: теперь принимает готовую карту из кэша синглтона
const searchInSlugMapping = (slugMapping: TLocalSlugMap, qText: string): {
  original: NCodeSamplesSpace.TNote;
  slug: string;
  bg?: { src: string; size: { w: number; h: number }; type: string }
  brief?: string;
}[] => {
  const matchedNotes: { original: NCodeSamplesSpace.TNote; slug: string; bg?: { src: string; size: { w: number; h: number }; type: string }; brief?: string }[] = []
  const normalizedQuery = qText.toLowerCase().trim().replace(/\s/g, '')

  Object.entries(slugMapping).forEach(([slugKey, tools]) => {
    const humanReadableTitle = slugKey.replace(/-/g, ' ')
    const briefText = tools.brief ? tools.brief.toLowerCase() : ''
    const titleText = tools.title ? tools.title.toLowerCase() : ''
    
    const tags: string[] = Array.isArray(tools.tags) ? tools.tags : []
    const isTagMatched = tags.some(tag => tag.toLowerCase().includes(normalizedQuery))

    const isMatched = 
      !normalizedQuery || 
      slugKey.toLowerCase().includes(normalizedQuery) || 
      humanReadableTitle.toLowerCase().includes(normalizedQuery) || 
      titleText.includes(normalizedQuery) ||
      briefText.includes(normalizedQuery) ||
      isTagMatched

    if (isMatched) {
        matchedNotes.push({
          original: {
            // Берем id из JSON, если его нет — подставляем сам slugKey в качестве уникального ID
            _id: String(tools._id || slugKey), 
            // Если в файле был красивый title, выводим его с иконкой папки, иначе — slugKey
            title: tools.title ? `📁 ${tools.title}` : slugKey,
            description: tools.brief || 'Локальное описание отсутствует',
            isPrivate: typeof tools.isPrivate === 'boolean' ? tools.isPrivate : false,
            // Берем оригинальные даты создания и обновления из JSON-файла!
            createdAt: tools.createdAt || new Date().toISOString(), 
            updatedAt: tools.updatedAt || new Date().toISOString(),
            // Подставляем приоритет из файла, либо 0 по умолчанию
            priority: typeof tools.priority === 'number' ? tools.priority : 0,
          },
          bg: tools.bg || defaultBg,
          slug: String(slugKey || tools._id),
          brief: tools.brief,
        })
      }
  })

  return matchedNotes
}

const getNotes = async (req: IRequest, res: IResponse) => {
  const isLocalSearchEnabled = process.env.NOTES_IS_LOCAL_SEARCH_ENABLED === '1'
  const iRemoteSearchEnabled = process.env.NOTES_IS_REMOTE_SEARCH_ENABLED === '1'
  
  const { q_title_all_words, limit, page } = req.query
  const currentLimit = Number(limit) || 60
  const currentPage = Number(page) || 1

  let remoteNotes: { original: NCodeSamplesSpace.TNote; slug: string }[] = []
  let localNotes: { original: NCodeSamplesSpace.TNote; slug: string }[] = []
  let notesResult: NResponseLocal.IResult<NCodeSamplesSpace.TNotesListResponse> | undefined = undefined

  const cacheService = req.slugMapCacheInstance

  // === МЕТКА 1: Замеряем общее время выполнения всего гибридного поиска ===
  res.startTime('hybrid_search_total', 'Total Hybrid Search Execution Time')

  // 1. СТРАТЕГИЯ: Поиск на удаленном ресурсе СУБД
  if (iRemoteSearchEnabled) {
    // МЕТКА 2: Время, затраченное на поход в сеть к удаленной базе данных
    res.startTime('db_remote_fetch', `Fetch 9999 notes from remote СУБД: ${NOTES_BASE_API_URL}`)
    
    const remoteFetchLimit = 9999
    let url = `${NOTES_BASE_API_URL}/api/notes?limit=${remoteFetchLimit}&sort_by_create_date=1&page=1`
    
    if (!!q_title_all_words && typeof q_title_all_words === 'string') { 
      const modifiedQueryTitleAllWords = q_title_all_words.replace(/\s/g, '')
      url = `${NOTES_BASE_API_URL}/api/notes?limit=${remoteFetchLimit}&q_title_all_words=${encodeURIComponent(modifiedQueryTitleAllWords)}&sort_by_create_date=1&page=1`
    }
    
    notesResult = await universalHttpClient.get<NCodeSamplesSpace.TNotesListResponse>(url)
    
    if (notesResult.isOk && notesResult.response?.success && Array.isArray(notesResult.response?.data)) {
      remoteNotes = notesResult.response.data.map((n) => ({ original: n, slug: n._id }))
    }

    res.endTime('db_remote_fetch')
  }

  // 2. СТРАТЕГИЯ: Поиск в локальном объекте (из синглтона в памяти)
  if (isLocalSearchEnabled && cacheService) {
    // МЕТКА 3: Замеряем время работы с синглтон-кэшем и фильтрацию в оперативной памяти
    const currentCacheAge = cacheService.getHumanReadableAge()
    res.startTime('reactive_cache_local_search', `Memory cache-hit search; Last update: ${currentCacheAge}`)

    let slugMapping = cacheService.getMapping()

    if (!slugMapping) {
      // МЕТКА 4: Жесткий фолбек (сработает только при холодном старте, если в памяти пусто)
      res.startTime('db_proxy_get_slug_map_direct', 'Fallback call directly to local network json file')
      try {
        const mapResult = await universalHttpClient.get<TLocalSlugMap>('/static/local.slug-map.json')
        if (mapResult.isOk && mapResult.response) {
          slugMapping = mapResult.response
          cacheService.updateTimestampDirectly()
        }
      } catch (directMapError) {
        console.error('[API Search List] Direct SlugMap fallback fetch failed:', directMapError)
      }
      res.endTime('db_proxy_get_slug_map_direct')
    }

    if (slugMapping) {
      const searchQuery = typeof q_title_all_words === 'string' ? q_title_all_words : ''
      localNotes = searchInSlugMapping(slugMapping, searchQuery)
    }

    res.endTime('reactive_cache_local_search')
  }

  // Защита: если ничего не найдено
  if (remoteNotes.length === 0 && localNotes.length === 0) {
    res.endTime('hybrid_search_total') // Не забываем закрыть общую метку перед выходом
    return res.status(200).send({
      success: true,
      data: [],
      pagination: { totalPages: 1, currentPage: currentPage, totalNotes: 0 },
      message: notesResult?.message || 'Поиск не дал результатов или удаленный сервер недоступен',
      _original: notesResult?.response || null,
    })
  }

  // МЕТКА 5: Время, затраченное процессором на объединение и многоуровневую сортировку массивов
  res.startTime('data_merge_and_sort', 'Data Merge and Multi-level Sorting')

  // 3. ОБЪЕДИНЕНИЕ
  const allCombinedNotes = [...localNotes]
  remoteNotes.forEach((rNote) => {
    const isDuplicate = allCombinedNotes.some((lNote) => String(lNote.original._id) === String(rNote.original._id))
    if (!isDuplicate) {
      allCombinedNotes.push(rNote)
    }
  })

  // 4. СОРТИРОВКА
  allCombinedNotes.sort((a, b) => {
    const priorityA = typeof a.original.priority === 'number' ? a.original.priority : 0
    const priorityB = typeof b.original.priority === 'number' ? b.original.priority : 0

    if (priorityB !== priorityA) return priorityB - priorityA

    const timeA = new Date(a.original.createdAt || 0).getTime()
    const timeB = new Date(b.original.createdAt || 0).getTime()
    return timeB - timeA
  })

  res.endTime('data_merge_and_sort')

  // 5. ПАГИНАЦИЯ БЕЗ НАРЕЗКИ
  const totalNotesCount = allCombinedNotes.length
  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = startIndex + currentLimit
  
  const pagedNotes = allCombinedNotes.slice(startIndex, endIndex)
  const totalPagesCount = Math.ceil(totalNotesCount / currentLimit) || 1

  const responseData: NCodeSamplesSpace.TNotesListResponseModified = {
    success: true,
    data: pagedNotes,
    pagination: {
      totalPages: totalPagesCount,
      currentPage: currentPage,
      totalNotes: totalNotesCount
    }
  }

  // Закрываем глобальную метку перед отправкой ответа
  res.endTime('hybrid_search_total')

  return res.status(200).send(responseData)
}

codeSamplesProxyApi.get('/notes', withReqParamsValidationMW({ rules: indexRules }), getNotes)
codeSamplesProxyApi.get('/notes/:id', withReqParamsValidationMW({ rules: singleNoteRules }), getNote)

export { codeSamplesProxyApi }
