import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { Request as IRequest, Response as IResponse } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { getNote, rules as singleNoteRules } from './[id]'
import { NCodeSamplesSpace } from '~/types'
import { NResponseLocal } from '~/srv.utils/errors/api'
import { TLocalSlugMap } from '~/srv.utils/cahce/slug-map/slugMap.cahe'
import { defaultBg } from '~/srv.utils/local-mdx/readLocalMdxFallback'
import { testTextByAllWords } from '~/srv.utils/tools-string/testTextByAllWords'

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
const searchInSlugMapping = ({ slugMapping, qText, isPrivatePagesIncluded }: { slugMapping: TLocalSlugMap, qText: string, isPrivatePagesIncluded: boolean }): {
  original: NCodeSamplesSpace.TNote;
  slug: string;
  bg?: { src: string; size: { w: number; h: number }; type: string }
  brief?: string;
}[] => {
  const matchedNotes: { original: NCodeSamplesSpace.TNote; slug: string; bg?: { src: string; size: { w: number; h: number }; type: string }; brief?: string; }[] = []
  const normalizedQuery = qText.toLowerCase().trim().replace(/\s/g, '')

  Object.entries(slugMapping).forEach(([slugKey, tools]) => {
    const humanReadableTitle = slugKey.replace(/-/g, ' ')
    const briefText = tools.brief ? tools.brief.toLowerCase() : ''
    const titleText = tools.title ? tools.title.toLowerCase() : ''
    
    const tags: string[] = Array.isArray(tools.tags) ? tools.tags : []
    const isTagMatched = tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
    const isPrivate = typeof tools.isPrivate === 'boolean' ? tools.isPrivate : false

    const isMatched = !(isPrivate && !isPrivatePagesIncluded) && (
      testTextByAllWords({ words: normalizedQuery.split(','), text: tools.title }) ||
      !normalizedQuery || 
      slugKey.toLowerCase().includes(normalizedQuery) || 
      humanReadableTitle.toLowerCase().includes(normalizedQuery) || 
      titleText.includes(normalizedQuery) ||
      briefText.includes(normalizedQuery) ||
      isTagMatched
    )

    if (isMatched) {
      matchedNotes.push({
        original: {
          // Берем id из JSON, если его нет — подставляем сам slugKey в качестве уникального ID
          _id: String(tools._id || slugKey), 
          // Если в файле был красивый title, выводим его с иконкой папки, иначе — slugKey
          title: tools.title ? `📁 ${tools.title}` : slugKey,
          description: tools.brief || 'Локальное описание отсутствует',
          isPrivate,
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
  const { q_title_all_words, limit, page } = req.query
  const currentLimit = Number(limit) || 60
  const currentPage = Number(page) || 1

  let remoteNotes: { original: NCodeSamplesSpace.TNote; slug: string }[] = []
  let localNotes: { original: NCodeSamplesSpace.TNote; slug: string }[] = []
  let notesResult: NResponseLocal.IResult<NCodeSamplesSpace.TNotesListResponse> | undefined = undefined

  // === МЕТКА 1: Замеряем общее время выполнения всего гибридного поиска ===
  res.startTime('hybrid_search_total', 'Total Hybrid Search Execution Time')

  // 1. СТРАТЕГИЯ: Поиск на удаленном ресурсе DB
  if (req.isRemoteSearchEnabled) {
    // МЕТКА 2: Время, затраченное на поход в сеть к удаленной базе данных
    res.startTime('db_remote_fetch', `Fetch 9999 notes from remote DB: ${NOTES_BASE_API_URL}`)
    
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
  const cacheService = req.slugMapCacheInstance
  const currentCacheAge = cacheService?.getHumanReadableAge() || 'No cacheService in req ctx'
  console.log(`-- req.isLocalSearchEnabled is ${typeof req.isLocalSearchEnabled}`)
  if (req.isLocalSearchEnabled) {
    let slugMapping
    const activeData = req.slugMap
    console.log(`-- typeof activeData (from req.slugMap) is ${typeof activeData}`)
    if (activeData) {
      res.startTime('slug_map', 'activeData taken from req.slugMap')
      slugMapping = activeData
      res.endTime('slug_map')
    } else {
      // МЕТКА 3: Замеряем время работы с синглтон-кэшем и фильтрацию в оперативной памяти
      res.startTime('reactive_cache_local_search', `Memory cache-hit search; Last update: ${currentCacheAge}`)
      try {
        const mapResult = await universalHttpClient.getNoApiErr<TLocalSlugMap>('/static/local.slug-map.json')
        if (mapResult.isOk && mapResult.response) {
          slugMapping = mapResult.response
          cacheService?.updateTimestampDirectly()
        }
      } catch (directMapError) {
        console.error('[API Search List] Direct SlugMap fallback fetch failed:', directMapError)
      }
      res.endTime('reactive_cache_local_search')
    }

    // ОПТИМИЗАЦИЯ: Выносим вызов фильтрации наружу! 
    // Теперь поиск и отсечение приватных заметок сработают в любом случае.
    if (slugMapping) {
      const searchQuery = typeof q_title_all_words === 'string' ? q_title_all_words : ''
      res.startTime('search_in_slug_mapping', 'Local fn called')
      localNotes = searchInSlugMapping({ slugMapping, qText: searchQuery, isPrivatePagesIncluded: req.isPrivatePagesIncluded || false })
      res.endTime('search_in_slug_mapping')
    }
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

  // 3. ОБЪЕДИНЕНИЕ С ИЗМЕНЕННЫМ ПРИОРИТЕТОМ И ЖЕСТКИМ СКРЫТИЕМ ПРИВАТНЫХ СТАТЕЙ
  // Инициализируем массив отфильтрованными локальными заметками (в них приватных уже гарантированно нет)
  const allCombinedNotes = [...localNotes]

  remoteNotes.forEach((rNote) => {
    // Безопасно проверяем флаг приватности у статьи, пришедшей из удаленной БД API
    const isRemoteNotePrivate = typeof rNote.original?.isPrivate === 'boolean' 
      ? rNote.original.isPrivate 
      : false

    // ОПТИМИЗАЦИЯ: Если статья из базы помечена как приватная, мы ЕЁ ИГНОРИРУЕМ СРАЗУ
    if (isRemoteNotePrivate) {
      console.log(`[API Search Sync] Удаленная приватная заметка ${rNote.original._id} отсечена на этапе слияния.`)
      return // Переходим к следующему элементу цикла, не добавляя в общий список
    }

    // Проверяем на дубликаты с локальным кэшем
    const isDuplicate = allCombinedNotes.some((lNote) => String(lNote.original._id) === String(rNote.original._id))
    
    if (!isDuplicate) {
      allCombinedNotes.push(rNote)
    } else {
      console.log(`[API Search Sync] Сетевая копия заметки ${rNote.original._id} пропущена. Заменена локальной версией.`)
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
