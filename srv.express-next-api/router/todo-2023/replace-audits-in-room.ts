import { Request as IRequest, Response as IResponse } from 'express'
import { IJob, TAudit, TSubJob } from '~/srv.socket-logic/types';
import { stateInstance } from '~/srv.utils/todo2023/stateInstance'

type TAnalysis = { isOk: boolean; message?: string }

const isSubjobListCorrect = ({ subjobs }: { subjobs: any[] }): TAnalysis => {
  const result: TAnalysis = {
    isOk: true,
  }
  const requiredFields: (keyof TSubJob)[] = ['name']
  
  for (const subjob of subjobs) {
    for (const requiredKey of requiredFields) {
      if (!subjob[requiredKey]) {
        result.isOk = false
        result.message = `Each subjob must have a key \`${requiredKey}\``
        break
      }
    }
    if (!result.isOk) return result
  }

  return result
}
const isJobListCorrect = ({ jobs }: { jobs: any[] }): TAnalysis => {
  const result: TAnalysis = {
    isOk: true,
  }
  const requiredFields: (keyof IJob)[] = ['id', 'name', 'subjobs', 'tsCreate', 'tsUpdate']

  for (const job of jobs) {
    for (const requiredKey of requiredFields) {
      if (!job[requiredKey]) {
        result.isOk = false
        result.message = `Каждая работа должна содержать ключ \'${requiredKey}\'`
        break
      }
    }
    if (!result.isOk) return result

    const subjobsAnalysis = isSubjobListCorrect({ subjobs: job.subjobs })

    switch (true) {
      case !Array.isArray(job.subjobs):
        result.isOk = false
        result.message = `job.subjobs shound be an Array, received: ${typeof job.subjobs} (!isArray)`
        break
      case !subjobsAnalysis.isOk:
        result.isOk = false
        result.message = `Subjobs analysis failed: ${subjobsAnalysis.message || 'No message'}`
        break
      default:
        break
    }
  }
  return result
}
const isAuditListCorrect = ({ audits }: { audits: any[] }): TAnalysis => {
  const result: TAnalysis = {
    isOk: true,
  }
  if (!audits) {
    result.isOk = false
    result.message = `Incorrect audit, received ${typeof audits}`
  }
  if (!result.isOk) return result

  const requiredFields: (keyof TAudit)[] = ['id', 'name', 'jobs', 'tsCreate', 'tsUpdate']

  for (const audit of audits) {
    for (const requiredKey of requiredFields) {
      if (!audit[requiredKey]) {
        result.isOk = false
        result.message = `Каждый аудит должен содержать ключ \'${requiredKey}\'`
        break
      }
    }
    if (!result.isOk) return result

    const jobsAnalysis = isJobListCorrect({ jobs: audit.jobs })

    switch (true) {
      case !Array.isArray(audit.jobs):
        result.isOk = false
        result.message = `audit.jobs shound be an Array, received: ${typeof audit.jobs} (!isArray)`
        break
      case !jobsAnalysis.isOk:
        result.isOk = false
        result.message = `Jobs analysis failed: ${jobsAnalysis.message || 'No message'}`
        break
      default:
        break
    }
  }

  return result
}

export const rules = {
  params: {
    body: {
      audits: {
        type: 'TAudit[]',
        descr: 'Audit list',
        required: true,
        validate: (val: any) => {
          const result: {
            ok: boolean;
            reason?: string;
          } = {
            ok: true,
          }
          const analysis = isAuditListCorrect({ audits: val })
          
          switch (true) {
            case !Array.isArray(val):
              result.ok = false
              result.reason = `req.body.audits should be an Array, received ${typeof val}`
              break
            case val.length === 0:
              result.ok = false
              result.reason = 'req.body.audits should not be empty Array'
              break
            case !analysis.isOk:
              result.ok = false
              result.reason = analysis.message || 'No analysis.message'
              break
            default:
              break
          }
          return result
        }
      },
      room: {
        type: 'number',
        descr: 'room',
        required: true,
        validate: (val: any) => {
          const result: {
            ok: boolean;
            reason?: string;
          } = {
            ok: true,
          }
          
          switch (true) {
            case Number.isNaN(val):
              result.ok = false
              result.reason = `Should be number, received ${typeof val}`
              break
            default:
              break
          }
          return result
        }
      },
    }
  }
}

export const replaceAuditsInRoom = (req: IRequest, res: IResponse) => {
  stateInstance.set(req.body.room, req.body.audits)
  res.status(200).send({
    ok: true,
    audits: stateInstance.get(req.body.room)
  })
}
