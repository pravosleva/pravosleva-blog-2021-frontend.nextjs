import { NEvent } from '~/srv.socket-logic/withSP/types'

export const getIsCorrectFormat = (val: any): { ok: boolean; reason?: string } => {
  const result: { ok: boolean; reason?: string } = {
    ok: true,
  }
  switch (true) {
    case !val:
      result.ok = false
      result.reason = `value should not be empty, received: "${val}" (${typeof val})`
      break
    case !val.app?.name:
      result.ok = false
      result.reason = `app.name not be empty, received: "${val.app?.name}" (${typeof val.app?.name})`
      break
    case !val.app?.version:
      result.ok = false
      result.reason = `app.version not be empty, received: "${val.app?.version}" (${typeof val.app?.version})`
      break
    case !val.room:
      result.ok = false
      result.reason = `room (name) is required, received: "${val.room}" (${typeof val.room})`
      break
    case !val.metrixEventType:
      result.ok = false
      result.reason = 'metrixEventType is required (unique key: event indicator)'
      break
    case !val.stateValue:
      result.ok = false
      result.reason = 'stateValue is required (unique key: current state indicator)'
      break
    case !val.reportType:
      result.ok = false
      result.reason = `reportType is required (possible values: ${Object.values(NEvent.EReportType).join(', ')})`
      break
    default: break
  }
  return result
}
