import { Request as IRequest } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { TEnhancedResponse } from '~/srv.utils/types'
import { readLocalMdx } from '~/srv.utils/local-mdx/readLocalMdx' // Импортируем вашу утилиту

const NOTES_BASE_API_URL = 'http://62.109.21.103'

export const rules = {
  params: {
    params: {
      id: {
        type: 'string',
        descr: '_id',
        required: true,
        validate: (val: any) => ({
          ok: !!val && typeof val === 'string',
          reason: 'Should be string'
        }),
      },
    },
  }
}

export const getNote = async (req: IRequest, res: TEnhancedResponse) => {
  const { id } = req.params
  res.startTime('css_get_note', `code-samples.space: Get note ${id}`)

  // --- СТРАТЕГИЯ 1: Чтение из локального MDX через общую утилиту ---
  try {
    const localArticle = await readLocalMdx(id)
    
    if (localArticle && localArticle.original) {
      res.endTime('css_get_note')
      console.log(`[API Single Note] Перехвачено утилитой readLocalMdx: ${id}.mdx`)
      
      // Отдаем фронтенд-клиенту структуру ответа TSingleNoteResponse
      return res.status(200).send({
        success: true,
        data: localArticle.original // Достаем чистый TNote из утилиты
      })
    }
  } catch (fsError) {
    console.error(`[API Single Note] Ошибка при вызове readLocalMdx для ID ${id}:`, fsError)
  }

  // --- СТРАТЕГИЯ 2: Сетевой фолбек ---
  const url = `${NOTES_BASE_API_URL}/api/notes/${id}`
  const noteResult = await universalHttpClient.get(url)
  res.endTime('css_get_note')

  if (noteResult.isOk && !!noteResult.response) {
    return res.status(200).send(noteResult.response)
  }

  return res.status(500).send({
    success: false,
    message: noteResult?.response?.message || 'No message from server',
    _original: noteResult?.response || null,
  })
}
