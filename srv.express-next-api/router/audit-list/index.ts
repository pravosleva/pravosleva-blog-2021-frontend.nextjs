import express from 'express'
import { withReqParamsValidationMW } from '~/srv.utils/mws/withReqParamsValidationMW'
import { replaceAuditsInRoom, rules as replaceAuditsInRoomRules } from './replace-audits-in-room'

const auditListApi = express()

auditListApi.post(
  '/replace-audits-in-room',
  withReqParamsValidationMW({
    rules: replaceAuditsInRoomRules,
  }),
  replaceAuditsInRoom,
)

export {
  auditListApi,
}
