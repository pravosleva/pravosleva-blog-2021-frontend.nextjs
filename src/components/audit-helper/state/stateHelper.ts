// import { proxy } from 'valtio';
import { TAudit, EJobStatus, ESubjobStatus, IJob } from '~/components/audit-helper/types'
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
      console.log('- 1')
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

  _linear({ x, x1, y1, x2, y2 }: { x: number; x1: number; y1: number; x2: number; y2: number; }): number {
    if (x1 === x2) return (y1 + y2) / 2
    
    return ((x - x1) * (y2 - y1)) / (x2 - x1) + y1
  }

  getCompleteJobsPercentage({
    audit,
  }: {
    audit: TAudit;
  }): {
    value: number;
  } {
    const totalJobsCounter = audit.jobs.length
    let completeJobsCounter = 0

    try {
      for (const job of audit.jobs) if (job.status === EJobStatus.IS_DONE) completeJobsCounter += 1
    } catch (err) {
      console.warn(err)
    }

    return {
      value: this._linear({
        x: completeJobsCounter, x1: 0, y1: 0, x2: totalJobsCounter, y2: 100
      }),
    }
  }

  getIncompletedAuditsCounter({
    audits,
  }: {
    audits: TAudit[];
  }): {
    value: number;
    percentage: number;
  } {
    const totalAuditsCounter = audits.length
    let completeAuditsCounter = 0

    try {
      for (const audit of audits) {
        if (this.getCompleteJobsPercentage({ audit }).value === 100) completeAuditsCounter += 1
      }
    } catch (err) {
      console.warn(err)
    }

    return {
      value: completeAuditsCounter,
      percentage: this._linear({
        x: completeAuditsCounter, x1: 0, y1: 0, x2: totalAuditsCounter, y2: 100
      }),
    }
  }
  // --
}

export const stateHelper = SingletoneState.getInstance()
