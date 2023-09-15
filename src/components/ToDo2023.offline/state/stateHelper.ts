// import { proxy } from 'valtio';
import { TAudit, EJobStatus, ESubjobStatus, IJob } from './types'
import { standardJobList as _standardJobList } from './constants'

// NOTE: Example https://github.com/pravosleva/express-helper/blob/master/src/server/utils/gcsUsersMapInstance.ts
class SingletoneState {
  private static instance: SingletoneState;
  // _state: { audits: TAudit[]; };

  constructor() {
    // this._state = proxy<{ audits: TAudit[] }>({
    //   audits: [],
    // })

    // TODO: Get audits from LS -> Put to this._state
    // try {
    //   // @ts-ignore
    //   const audits = JSON.parse(localStorage.getItem('todo-2023.audits'))

    //   if (!this.validateAudits(audits)) throw new Error('Incorrect data in LS')

    //   this._state.audits = audits
    // } catch (err) {
    //   console.log(err)
    // }
  }

  // validateAudits(audits: any): boolean {
  //   return audits.every((audit: any) => {
  //     switch (true) {
  //       case !!audit?.jobs && Array.isArray(audit.jobs):
  //       case audit.jobs.every(({ subjobs }: any) => Array.isArray(subjobs)):
  //         return true
  //       default: return false
  //     }
  //   })
  // }

  // get state() {
  //   return this._state
  // }

  public static getInstance(): SingletoneState {
    if (!SingletoneState.instance) SingletoneState.instance = new SingletoneState();

    return SingletoneState.instance;
  }

  // public addSubJob({
  //   name,
  //   auditId,
  //   jobId,
  // }: {
  //   name: string;
  //   auditId: string;
  //   jobId: string;
  // }): Promise<{ isOk: boolean; message?: string }> {
  //   const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

  //   if (targetAuditIndex === -1) return Promise.reject({
  //     isOk: false,
  //     message: 'Oops... Audit not found!',
  //   })

  //   const targetAuditJobs = this.state.audits[targetAuditIndex].jobs

  //   const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)

  //   if (targetAuditJobIndex === -1) return Promise.reject({
  //     isOk: false,
  //     message: 'Oops... Audit exists. But job not found!',
  //   })

  //   const tsUpdate = new Date().getTime()

  //   this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.push({
  //     id: getRandomString(5),
  //     name,
  //     status: ESubjobStatus.IN_PROGRESS,
  //     tsCreate: tsUpdate,
  //     tsUpdate,
  //   })
  //   this._state.audits[targetAuditIndex].tsUpdate = tsUpdate

  //   this.saveDataToLS()

  //   return Promise.resolve({ isOk: true })
  // }

  // -- NOTE: New way
  getIncompleteSubjobsCounter({
    job,
  }: {
    job: IJob;
  }): number {
    let counter = 0

    try {
      for (const subjob of job.subjobs) if (subjob.status !== ESubjobStatus.IS_DONE) counter += 1
    } catch (err) {
      console.warn(err)
    }

    return counter
  }
  getIncompleteJobsCounter({
    audit,
  }: {
    audit: TAudit;
  }): number {
    let counter = 0

    try {
      for (const job of audit.jobs) if (job.status !== EJobStatus.IS_DONE) counter += 1
    } catch (err) {
      console.warn(err)
    }

    return counter
  }
  // --
}

export const stateHelper = SingletoneState.getInstance()
