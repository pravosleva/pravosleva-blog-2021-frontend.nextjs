import { Response as IResponse } from 'express'
// import axios from 'axios'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { TEnhancedRequest } from '~/srv.utils/types'

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

export const getNote = async (req: TEnhancedRequest, res: IResponse) => {
  const { id } = req.params
  req.startTime('css_get_note', `code-samples.space: Get remote note ${id}`)

  let url = `http://code-samples.space/api/notes/${id}`

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
