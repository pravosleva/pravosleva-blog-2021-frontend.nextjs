import express from 'express'

import { auditlistReplace } from './auditlist.replace'

const todo2023Api = express()

todo2023Api.post('/auditlist.replace', auditlistReplace)

export {
  todo2023Api,
}
