import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { Request as IRequest, Response as IResponse } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { getNote, rules as singleNoteRules } from './[id]'
import { NCodeSamplesSpace } from '~/types'
import { NResponseLocal } from '~/srv.utils/errors/api/types'
import { defaultBg } from '~/srv.utils/local-mdx/readLocalMdxFallback'
import { testTextByAllWords } from '~/srv.utils/tools-string/testTextByAllWords'
// import { slugMapping } from '../../../../../src/constants/blog/slugMap'

const codeSamplesProxyApi = express()
const NOTES_BASE_API_URL = 'http://62.109.21.103' // http://code-samples.space

export const indexRules = {
  params: {
    query: {
      limit: {
        type: 'number',
        descr: 'Limit',
        required: false,
        validate: (val: any) => ({
          ok: !val || (typeof val === 'string' && !isNaN(Number(val))),
          reason: 'Should be number (optional)'
        }),
      },
      page: {
        type: 'number',
        descr: 'Current page',
        required: false,
        validate: (val: any) => ({
          ok: !val || (typeof val === 'string' && !isNaN(Number(val))),
          reason: 'Should be number (optional)'
        }),
      },
      q_title_all_words: {
        type: 'string',
        descr: 'Words',
        required: false,
        validate: (val: any) => ({
          ok: !val || typeof val === 'string',
          reason: 'Should be string (optional)'
        }),
      },
    },
  }
}

// Вспомогательная функция для быстрого поиска по объекту памяти slugMapping без обращения к диску
// const searchInSlugMapping = (qText: string): NCodeSamplesSpace.TNote[] => {
//   const matchedNotes: NCodeSamplesSpace.TNote[] = []
//   const normalizedQuery = qText.toLowerCase().trim().replace(/\s/g, '')

//   // Обходим объект в памяти O(N)
//   Object.entries(slugMapping).forEach(([slugKey, tools]) => {
//     // Формируем текстовое поле для поиска на основе слага (заменяем дефисы для гибкости поиска)
//     const humanReadableTitle = slugKey.replace(/-/g, ' ')
//     const briefText = tools.brief ? tools.brief.toLowerCase() : ''
    
//     // Проверяем вхождение: по слагу, по «очеловеченному» названию или по brief описанию
//     const isMatched = 
//       !normalizedQuery || 
//       slugKey.toLowerCase().includes(normalizedQuery) || 
//       humanReadableTitle.toLowerCase().includes(normalizedQuery) ||
//       briefText.includes(normalizedQuery)

//     if (isMatched) {
//       matchedNotes.push({
//         // Так как это поиск без чтения файлов, мапим id и метаданные в формат TNote
//         _id: String(tools.id || slugKey), 
//         title: !!tools.title ? `📁 ${tools.title}` : slugKey,
//         description: tools.brief || 'Локальное описание отсутствует',
//         isPrivate: false,
//         createdAt: new Date().toISOString(), // Фолбек даты, так как в карте её нет
//         updatedAt: new Date().toISOString(),
//         priority: tools.priority || 0,
//       })
//     }
//   })

//   return matchedNotes
// }

// Структура одной статьи внутри нашего нового JSON-файла
interface ILocalSlugItem {
  title: string
  brief: string
  bg?: { src: string; size: { w: number; h: number }; type: string }
  createdAt?: string
  updatedAt?: string
  priority?: number
  tags?: string[]
  category?: string
  isPrivate?: boolean
  author?: string
  _id?: string | number // на случай, если id прокинут из базы
}

// Типизация всего JSON-словаря, где ключом выступает строка (слаг статьи)
type TLocalSlugMap = Record<string, ILocalSlugItem>

const searchInSlugMapping = async (qText: string): Promise<({
  original : NCodeSamplesSpace.TNote;
  slug: string;
  bg?: { src: string; size: { w: number; h: number }; type: string }
  brief?: string;
})[]> => {
  const matchedNotes: { original : NCodeSamplesSpace.TNote; slug: string; bg?: { src: string; size: { w: number; h: number }; type: string }; brief?: string }[] = []
  const normalizedQuery = qText.toLowerCase().trim().replace(/\s/g, '')

  try {
    // 1. Делаем сетевой GET-запрос строго с указанием нашего типа TLocalSlugMap
    const responseResult = await universalHttpClient.getNoApiErr<TLocalSlugMap>(`${process.env.SRV_CODE_SAMPLES_PROXY_API_BASE_URL}/static/local.slug-map.json`)

    // console.log(responseResult)
    /* NOTEL Example
    {
      isOk: true,
      response: {
        'what-where-when': {
          title: 'Что? Где? Когда?',
          brief: 'Музыка из шоу',
          bg: [Object],
          createdAt: '2025-01-18T15:42:41.219Z',
          updatedAt: '2026-09-02T11:47:07.178Z',
          priority: 5,
          tags: [Array],
          isPrivate: false,
          _id: '678bcbf18c79264aa7fd53b6',
          author: 'Den Pol',
          category: 'resume'
        }
      }
    }
    */

    // Проверяем, что запрос прошел успешно и данные вернулись в нужном формате
    if (!responseResult.isOk || !responseResult.response) {
      console.warn(`Не удалось загрузить local.slug-map.json по сети; ${responseResult.message || 'No message'}`)
      return Promise.resolve([])
    }

    // Вытаскиваем чистый типизированный объект словаря
    const slugMapping: TLocalSlugMap = responseResult.response

    // 2. Обходим объект в памяти
    Object.entries(slugMapping).forEach(([slugKey, tools]) => {
      const humanReadableTitle = slugKey.replace(/-/g, ' ')
      const briefText = tools.brief ? tools.brief.toLowerCase() : ''
      const titleText = tools.title ? tools.title.toLowerCase() : ''
      const isPrivate = tools.isPrivate || false
      // Расширяем поиск: ищем совпадение также по массиву тегов, если они прописаны
      const tags: string[] = Array.isArray(tools.tags) ? tools.tags : []
      const isTagMatched = tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      const isTitleMatched = testTextByAllWords({ text: tools.title, words: normalizedQuery.split(',') })

      const isMatched = !isPrivate && (
        !normalizedQuery || 
        slugKey.toLowerCase().includes(normalizedQuery) || 
        humanReadableTitle.toLowerCase().includes(normalizedQuery) ||
        isTitleMatched ||
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
  } catch (error) {
    console.error('[SlugMap Search] Критическая ошибка при обработке поиска:', error)
  }

  return Promise.resolve(matchedNotes)
}

const getNotes = async (req: IRequest, res: IResponse) => {
  const isLocalSearchEnabled = process.env.NOTES_IS_LOCAL_SEARCH_ENABLED === '1'
  const iRemoteSearchEnabled = process.env.NOTES_IS_REMOTE_SEARCH_ENABLED === '1'
  
  const { q_title_all_words, limit, page } = req.query
  const currentLimit = Number(limit) || 60
  const currentPage = Number(page) || 1

  let remoteNotes: { original: NCodeSamplesSpace.TNote; slug: string }[] = []
  let localNotes: { original: NCodeSamplesSpace.TNote; slug: string; brief?: string; }[] = []
  let notesResult: NResponseLocal.IResult<NCodeSamplesSpace.TNotesListResponse> | undefined = undefined

  // 1. СТРАТЕГИЯ: Поиск на удаленном ресурсе СУБД
  if (iRemoteSearchEnabled) {
    // Возвращаем надежный лимит 9999 и жестко запрашиваем 1-ю страницу у API.
    // Это нужно, чтобы выкачать всю базу для сквозной гибридной пагинации.
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
  }

  // 2. СТРАТЕГИЯ: Поиск в локальном объекте slugMapping
  if (isLocalSearchEnabled) {
    const searchQuery = typeof q_title_all_words === 'string' ? q_title_all_words : ''
    localNotes = await searchInSlugMapping(searchQuery)
  }

  // Защита: если вообще ничего не найдено ни в сети, ни в памяти
  if (remoteNotes.length === 0 && localNotes.length === 0) {
    return res.status(200).send({
      success: true,
      data: [],
      pagination: { totalPages: 1, currentPage: currentPage, totalNotes: 0 },
      message: notesResult?.message || 'Поиск не дал результатов или удаленный server недоступен',
      _original: notesResult?.response || null,
    })
  }

  // 3. ОБЪЕДИНЕНИЕ С ИЗМЕНЕННЫМ ПРИОРИТЕТОМ:
  // Локальные заметки закладываются первыми. Они главные!
  const allCombinedNotes = [...localNotes]

  // Добавляем сетевые статьи только если их _id еще нет в локальном пуле
  remoteNotes.forEach((rNote) => {
    const isDuplicate = allCombinedNotes.some((lNote) => String(lNote.original._id) === String(rNote.original._id))
    
    if (!isDuplicate) {
      allCombinedNotes.push(rNote)
    } else {
      console.log(`[API Search Sync] Удаленная заметка с ID ${rNote.original._id} заменена локальной версией из JSON.`)
    }
  })

  // 4. МНОГОУРОВНЕВАЯ СОРТИРОВКА: Приоритет 1 (priority) -> Приоритет 2 (date)
  allCombinedNotes.sort((a, b) => {
    const priorityA = typeof a.original.priority === 'number' ? a.original.priority : 0
    const priorityB = typeof b.original.priority === 'number' ? b.original.priority : 0

    if (priorityB !== priorityA) {
      return priorityB - priorityA
    }

    const timeA = new Date(a.original.createdAt || 0).getTime()
    const timeB = new Date(b.original.createdAt || 0).getTime()
    
    return timeB - timeA
  })

  // 5. ЧЕСТНАЯ НАРЕЗКА (Сквозной Limit и Page):
  // Вычисляем индексы среза для текущей страницы от полного объединенного массива
  const totalNotesCount = allCombinedNotes.length
  const startIndex = (currentPage - 1) * currentLimit
  const endIndex = startIndex + currentLimit
  
  // Нарезаем данные. Теперь локальные файлы займут свои строгие места на конкретных страницах!
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

  return res.status(200).send(responseData)
}

codeSamplesProxyApi.get('/notes', withReqParamsValidationMW({ rules: indexRules }), getNotes)
codeSamplesProxyApi.get('/notes/:id', withReqParamsValidationMW({ rules: singleNoteRules }), getNote)

export { codeSamplesProxyApi }
