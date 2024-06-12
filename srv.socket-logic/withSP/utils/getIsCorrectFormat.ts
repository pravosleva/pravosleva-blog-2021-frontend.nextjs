export const getIsCorrectFormat = (val: any): { ok: boolean; reason?: string } => {
  const result: { ok: boolean; reason?: string } = {
    ok: true,
  }
  switch (true) {
    case !val:
      result.ok = false
      result.reason = 'Should not be empty'
      break
    case !val.appVersion:
      result.ok = false
      result.reason = 'appVersion not be empty'
      break
    case !val.room:
      result.ok = false
      result.reason = 'room is required'
      break
    case !val.metrixEventType:
      result.ok = false
      result.reason = 'metrixEventType is required'
      break
    case !val.stateValue:
      result.ok = false
      result.reason = 'stateValue is required'
      break
    case !val.reportType:
      result.ok = false
      result.reason = 'reportType is required'
      break
    default: break
  }
  return result
}
