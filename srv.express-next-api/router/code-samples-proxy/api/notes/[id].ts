import { Request as IRequest } from 'express'
// import axios from 'axios'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { TEnhancedResponse } from '~/srv.utils/types'

const NOTES_BASE_API_URL = 'http://62.109.21.103' // http://code-samples.space

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
  res.startTime('css_get_note', `code-samples.space: Get remote note ${id}`)

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
