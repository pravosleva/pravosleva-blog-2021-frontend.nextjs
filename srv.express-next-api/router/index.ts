import express from 'express'
import bodyParser from 'body-parser'
import { todo2023Api } from './todo-2023'
import { codeSamplesProxyApi } from './code-samples-proxy/api/notes'

const api = express()

const jsonParser = bodyParser.json()
api.use(jsonParser)

api.use(
  '/todo-2023',
  todo2023Api,
)
api.use(
  '/code-samples-proxy/api',
  codeSamplesProxyApi,
)
// Others...

export {
  api,
}
