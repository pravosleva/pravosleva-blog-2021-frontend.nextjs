import express from 'express'

import { todo2023Api } from './todo2023'

const api = express()

api.use('/todo2023', todo2023Api)

export {
  api,
}
