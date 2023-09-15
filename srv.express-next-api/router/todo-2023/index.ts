import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { replaceAuditsInRoom, rules as replaceAuditsInRoomRules } from './replace-audits-in-room'

const todo2023Api = express()

todo2023Api.post(
  '/replace-audits-in-room',
  withReqParamsValidationMW({
    rules: replaceAuditsInRoomRules,
  }),
  replaceAuditsInRoom,
)

export {
  todo2023Api,
}
