import { Request as IRequest, Response as IResponse } from 'express'
// import axios from 'axios'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

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

export const getNote = async (req: IRequest, res: IResponse) => {
  const { id } = req.params

  let url = `http://code-samples.space/api/notes/${id}`

  const notesResult = await universalHttpClient.get(url)

  console.log('---')
  console.log(notesResult)
  console.log('---')

  if (notesResult.isOk && !!notesResult.response) {
    return res.status(200).send(notesResult.response)
  }

  return res.status(500).send({
    success: false,
    message: notesResult?.response?.message || 'No message from server',
    _original: notesResult?.response || null,
  })
}
