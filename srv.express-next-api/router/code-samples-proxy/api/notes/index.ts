import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { Request as IRequest, Response as IResponse } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { getNote, rules as singleNoteRules } from './[id]'
import fs from 'fs'
import path from 'path'
import { NCodeSamplesSpace } from '~/types'
import { readLocalMdx } from '~/srv.utils/local-mdx/readLocalMdx' // Импортируем вашу утилиту

const codeSamplesProxyApi = express()
const NOTES_BASE_API_URL = 'http://62.109.21.103'

export const indexRules = {
  params: {
    query: {
      q_title_all_words: {
        type: 'string',
        descr: 'Words',
        required: false,
        validate: (val: any) => ({
          ok: !!val && typeof val === 'string',
          reason: 'Should be string'
        }),
      },
    },
  }
}

// Оптимизированная функция поиска локальных заметок через переиспользование утилиты
const searchLocalNotes = async (qText: string): Promise<NCodeSamplesSpace.TNote[]> => {
  try {
    const articlesDirectory = path.join(process.cwd(), '_articles')
    if (!fs.existsSync(articlesDirectory)) return []

    const files = fs.readdirSync(articlesDirectory)
    const matchedNotes: NCodeSamplesSpace.TNote[] = []
    const normalizedQuery = qText.toLowerCase().trim()

    // Проходим по всем файлам параллельно через Promise.all для максимальной скорости (Оптимизация!)
    await Promise.all(
      files.map(async (fileName) => {
        if (!fileName.endsWith('.mdx')) return

        const slug = fileName.replace(/\.mdx$/, '')
        
        // Переиспользуем нашу утилиту! Она сама проверит isDraft и распарсит метаданные
        const localArticle = await readLocalMdx(slug)
        if (!localArticle || !localArticle.original) return

        const note = localArticle.original
        const title = note.title.toLowerCase()
        const tags: string[] = (note as any).tags || []
        const isTagMatched = tags.some(tag => tag.toLowerCase().includes(normalizedQuery))

        // Проверяем условия поискового фильтра
        if (!normalizedQuery || title.includes(normalizedQuery) || slug.toLowerCase().includes(normalizedQuery) || isTagMatched) {
          matchedNotes.push(note)
        }
      })
    )

    // Сортируем: новые заметки всегда вверху списка
    return matchedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error('[API Local Search] Ошибка сканирования через утилиту:', error)
    return []
  }
}

const getNotes = async (req: IRequest, res: IResponse) => {
  const { q_title_all_words, limit, page } = req.query 
  
  let remoteNotes: NCodeSamplesSpace.TNote[] = []
  let localNotes: NCodeSamplesSpace.TNote[] = []
  let apiResponseMeta = null

  // 1. Сетевой запрос к API
  let url = `${NOTES_BASE_API_URL}/api/notes?limit=${limit || 60}&sort_by_create_date=1&page=${page || 1}`
  if (!!q_title_all_words && typeof q_title_all_words === 'string') { 
    const modifiedQueryTitleAllWords = q_title_all_words.replace(/\s/g, '')
    url = `${NOTES_BASE_API_URL}/api/notes?limit=${limit || 60}&q_title_all_words=${encodeURIComponent(modifiedQueryTitleAllWords)}&sort_by_create_date=1&page=${page || 1}`
  }

  const notesResult = await universalHttpClient.get(url)
  
  if (notesResult.isOk && notesResult.response?.success && Array.isArray(notesResult.response?.data)) {
    remoteNotes = notesResult.response.data
    apiResponseMeta = notesResult.response.pagination
  }

  // 2. Локальный поиск через оптимизированный метод
  const searchQuery = typeof q_title_all_words === 'string' ? q_title_all_words : ''
  localNotes = await searchLocalNotes(searchQuery)

  if (!notesResult.isOk && localNotes.length === 0) {
    return res.status(500).send({
      success: false,
      message: notesResult?.response?.message || 'Remote API error and no local fallbacks found',
      _original: notesResult?.response || null,
    })
  }

  // 3. Объединение без дубликатов
  const combinedData = [...remoteNotes]
  localNotes.forEach((lNote) => {
    const isDuplicate = combinedData.some((rNote) => rNote._id === lNote._id)
    if (!isDuplicate) {
      combinedData.push(lNote)
    }
  })

  const totalNotesCount = (apiResponseMeta?.totalNotes || 0) + localNotes.length
  const currentLimit = Number(limit) || 60

  return res.status(200).send({
    success: true,
    data: combinedData,
    pagination: {
      totalPages: Math.ceil(totalNotesCount / currentLimit) || 1,
      currentPage: Number(page) || 1,
      totalNotes: totalNotesCount
    }
  })
}

codeSamplesProxyApi.get('/notes', withReqParamsValidationMW({ rules: indexRules }), getNotes)
codeSamplesProxyApi.get('/notes/:id', withReqParamsValidationMW({ rules: singleNoteRules }), getNote)

export { codeSamplesProxyApi }
