import { Request as IRequest } from 'express'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { TEnhancedResponse } from '~/srv.utils/types'
import path from 'path'
import { readLocalMdxFallback } from '~/srv.utils/local-mdx/readLocalMdxFallback'
import { slugMapping } from '../../../../../src/constants/blog/slugMap'

const NOTES_BASE_API_URL = 'http://62.109.21.103' // http://code-samples.space

export const rules = {
  params: {
    params: {
      id: {
        type: 'string',
        descr: 'One of two: _id || slug',
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
  const isLocalSearchEnabled = process.env.NOTES_IS_LOCAL_SEARCH_ENABLED === '1'
  const iRemoteSearchEnabled = process.env.NOTES_IS_REMOTE_SEARCH_ENABLED === '1'
  const { id: slugOrId } = req.params
  const logs = []
  const possibleId = slugMapping[slugOrId] ? slugMapping[slugOrId]?.id : slugOrId
  logs.push(`id -> ${slugOrId} -> ${possibleId}`)
  logs.push(`isLocalSearchEnabled -> ${String(isLocalSearchEnabled)}; process.env.NOTES_IS_LOCAL_SEARCH_ENABLED=${(String(process.env.NOTES_IS_LOCAL_SEARCH_ENABLED))} (${typeof process.env.NOTES_IS_LOCAL_SEARCH_ENABLED}))`)
  // -- 1. ФОЛБЕК КЕЙС: Идем проверять локальные файлы
  if (isLocalSearchEnabled) {
    const articlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')
    let localArticleJson
    res.startTime('db_proxy_local_fallback', `${articlesDirectory} for [id]=${slugOrId}`)
    try {
      logs.push('🚀 read file START')
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
    } else logs.push(`🚫 localArticleJson is NOT OK`)
  }
  // --
  logs.push(`iRemoteSearchEnabled -> ${String(iRemoteSearchEnabled)}; process.env.NOTES_IS_REMOTE_SEARCH_ENABLED=${(String(process.env.NOTES_IS_REMOTE_SEARCH_ENABLED))} (${typeof process.env.NOTES_IS_REMOTE_SEARCH_ENABLED}))`)
  // -- 2. Пробуем сделать запрос к удаленному сервису
  if (iRemoteSearchEnabled) {
    res.startTime('db_proxy_get_note', `${NOTES_BASE_API_URL}/api/notes/${possibleId}`)
    const url = `${NOTES_BASE_API_URL}/api/notes/${possibleId}`
    let noteResult
    try {
      noteResult = await universalHttpClient.get(url)
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
  // --
  // 3. Если и на диске ничего нет, отдаем финальную ошибку
  return res.status(500).send({
    logs,
    success: false,
  })
}
