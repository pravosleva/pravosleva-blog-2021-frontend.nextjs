import express from 'express'
import bodyParser from 'body-parser'
import { auditListApi } from './audit-list'
import { codeSamplesProxyApi } from './code-samples-proxy/api/notes'

const api = express()

const jsonParser = bodyParser.json()
api.use(jsonParser)

api.use(
  '/audit-list',
  auditListApi,
)
api.use(
  '/code-samples-proxy/api',
  codeSamplesProxyApi,
)
// Others...

export {
  api,
}
