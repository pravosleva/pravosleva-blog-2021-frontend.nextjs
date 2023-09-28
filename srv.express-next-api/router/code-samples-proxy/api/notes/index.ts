import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
// import { replaceAuditsInRoom, rules as replaceAuditsInRoomRules } from ''
import { Request as IRequest, Response as IResponse } from 'express'
// import axios from 'axios'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { getNote, rules as singleNoteRules } from './[id]'

const codeSamplesProxyApi = express()

export const indexRules = {
  params: {
    query: {
      // limit: {
      //   type: 'number',
      //   descr: 'Limit',
      //   required: false,
      //   validate: (val: any) => ({
      //     ok: !!val && typeof val === 'string' && !isNaN(Number(val)),
      //     reason: 'Should be number'
      //   }),
      // },
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

const getNotes = async (req: IRequest, res: IResponse) => {
  const { q_title_all_words } = req.query 
  let url = 'http://code-samples.space/api/notes?limit=60'
  if (!!q_title_all_words && typeof q_title_all_words === 'string') { 
    const modifiedQueryTitleAllWords = q_title_all_words.replace(/\s/g, '')
    url = `http://code-samples.space/api/notes?limit=60&q_title_all_words=${modifiedQueryTitleAllWords}`
  }

  const notesResult = await universalHttpClient.get(url)

  if (notesResult.isOk && !!notesResult.response) {
    return res.status(200).send(notesResult.response)
  }

  return res.status(500).send({
    success: false,
    message: notesResult?.response?.message || 'No message from server',
    _original: notesResult?.response || null,
  })
}

codeSamplesProxyApi.get(
  '/notes',
  withReqParamsValidationMW({
    rules: indexRules,
  }),
  getNotes,
)
codeSamplesProxyApi.get(
  '/notes/:id',
  withReqParamsValidationMW({
    rules: singleNoteRules,
  }),
  getNote,
)

export {
  codeSamplesProxyApi,
}
