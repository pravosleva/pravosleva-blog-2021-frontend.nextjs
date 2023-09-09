import { proxy } from 'valtio';
import { TAudit, EJobStatus, ESubjobStatus, IJob } from './types'
import { getRandomString } from '~/utils/getRandomString'
import { standardJobList as _standardJobList } from './constants'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'

// NOTE: Example https://github.com/pravosleva/express-helper/blob/master/src/server/utils/gcsUsersMapInstance.ts
class SingletoneState {
  private static instance: SingletoneState;
  _state: { audits: TAudit[]; };

  constructor() {
    this._state = proxy<{ audits: TAudit[] }>({
      audits: [],
    })

    // TODO: Get audits from LS -> Put to this._state
    try {
      // @ts-ignore
      const audits = JSON.parse(localStorage.getItem('todo-2023.audits'))

      if (!this.validateAudits(audits)) throw new Error('Incorrect data in LS')

      this._state.audits = audits
    } catch (err) {
      console.log(err)
    }
  }

  validateAudits(audits: any): boolean {
    return audits.every((audit: any) => {
      switch (true) {
        case !!audit?.jobs && Array.isArray(audit.jobs):
        case audit.jobs.every(({ subjobs }: any) => Array.isArray(subjobs)):
          return true
        default: return false
      }
    })
  }
  saveDataToLS() {
    localStorage.setItem('todo-2023.audits', JSON.stringify(this.state.audits))
  }

  get state() {
    return this._state
  }

  public static getInstance(): SingletoneState {
    if (!SingletoneState.instance) SingletoneState.instance = new SingletoneState();

    return SingletoneState.instance;
  }

  public async addAudit({
    name,
    description,
  }: {
    name: string;
    description: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    if (!!this._state.audits.find(({ name: _name }) => _name === name)) return Promise.reject({
      isOk: false,
      message: 'Аудит с таким именем уже существует, придумайте что-то другое',
    })

    // NOTE: Get remote standardJobList -> Put to jobs
    const remoteData = await todo2023HttpClient.getJobs()
      .then((res) => res)
      .catch(() => [])
    let standartJobs: IJob[] = []

    // console.log(remoteData)

    // @ts-ignore
    if (!!remoteData?.jobs) {
      // @ts-ignore
      standartJobs = remoteData?.jobs
    } else return Promise.reject({
      isOk: false,
      message: 'Incorrect response'
    })
    
    const id = getRandomString(7)
    const tsCreate = new Date().getTime()
    
    this._state.audits.push({
      id,
      name,
      description: description || '',
      jobs: [...standartJobs.map((job) => {
        const jobId = getRandomString(5)
        return {
          ...job,

          tsCreate,
          tsUpdate: tsCreate,
          status: EJobStatus.IN_PROGRESS,

          id: jobId,
          subjobs: job.subjobs?.map((sj) => {
            const sjId = getRandomString(5)
            return {
              ...sj,
              id: sjId,
              status: ESubjobStatus.IN_PROGRESS,
              tsCreate,
              tsUpdate: tsCreate,
            }}) || [],
        }
      })],

      tsCreate,
      tsUpdate: tsCreate,
    })

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }

  public addAuditJob({
    name,
    auditId,
  }: {
    name: string;
    auditId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })
    const tsUpdate = new Date().getTime()

    this._state.audits[targetAuditIndex].jobs.push({
      id: getRandomString(5),
      name,
      status: EJobStatus.IN_PROGRESS,
      subjobs: [],

      tsCreate: tsUpdate,
      tsUpdate,
    })
    this._state.audits[targetAuditIndex].tsUpdate = tsUpdate

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }

  public addSubJob({
    name,
    auditId,
    jobId,
  }: {
    name: string;
    auditId: string;
    jobId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })

    const targetAuditJobs = this.state.audits[targetAuditIndex].jobs

    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)

    if (targetAuditJobIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit exists. But job not found!',
    })

    const tsUpdate = new Date().getTime()

    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.push({
      id: getRandomString(5),
      name,
      status: ESubjobStatus.IN_PROGRESS,
      tsCreate: tsUpdate,
      tsUpdate,
    })
    this._state.audits[targetAuditIndex].tsUpdate = tsUpdate

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }

  public _getNextSubjobStatus(prevStatus: ESubjobStatus): ESubjobStatus {
    const keys = Object.values(ESubjobStatus)

    const currentIndex = keys.indexOf(prevStatus);
    const nextIndex = (currentIndex + 1) % keys.length;

    console.log(keys[nextIndex])

    return keys[nextIndex]
  }
  public _getNextJobStatus(prevStatus: EJobStatus): EJobStatus {
    const keys = Object.values(EJobStatus)

    const currentIndex = keys.indexOf(prevStatus);
    const nextIndex = (currentIndex + 1) % keys.length;

    console.log(keys[nextIndex])

    return keys[nextIndex]
  }
  public toggleSubJob({
    auditId,
    jobId,
    subjobId,
  }: {
    auditId: string;
    jobId: string;
    subjobId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })

    const targetAuditJobs = this.state.audits[targetAuditIndex].jobs
    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    if (targetAuditJobIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit exists. But job not found!',
    })

    const targetSubjobs = this.state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs
    const targetAuditSubjobIndex = targetSubjobs.findIndex(({ id }) => id === subjobId)
    if (targetAuditSubjobIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit & job exists. But subjob not found!',
    })
    const targetAuditSubjob = this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex]
    const nextStatus = this._getNextSubjobStatus(targetAuditSubjob.status)
    const tsUpdate = new Date().getTime()

    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].tsUpdate = tsUpdate
    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].status = nextStatus
    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate

    if (this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.every(({ status }) => status === ESubjobStatus.IS_DONE)) {
      this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IS_DONE
    } else {
      this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
    }

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }
  public toggleJobStatus({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    console.groupCollapsed(`TGL JOB: ${auditId}, ${jobId}`)

    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

    console.log(`targetAuditIndex ${targetAuditIndex}`)

    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })

    const targetAuditJobs = this.state.audits[targetAuditIndex].jobs

    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    const targetAuditJob = targetAuditJobs.find(({ id }) => id === jobId)

    console.log(`targetAuditJobIndex ${targetAuditJobIndex}`)

    if (targetAuditJobIndex === -1 || !targetAuditJob) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit exists. But job not found!',
    })

    const nextStatus = this._getNextJobStatus(targetAuditJob.status)
    const tsUpdate = new Date().getTime()

    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].status = nextStatus

    if (nextStatus === EJobStatus.IS_DONE) {
      this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IS_DONE }))
    }

    console.log(`tsUpdate ${tsUpdate}`)
    console.log(`nextStatus ${nextStatus}`)

    console.groupEnd()

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }

  public toggleJobDone({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    console.groupCollapsed(`TGL JOB: ${auditId}, ${jobId}`)

    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

    console.log(`targetAuditIndex ${targetAuditIndex}`)

    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })

    const targetAuditJobs = this.state.audits[targetAuditIndex].jobs
    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    const targetAuditJob = targetAuditJobs.find(({ id }) => id === jobId)

    console.log(`targetAuditJobIndex ${targetAuditJobIndex}`)

    if (targetAuditJobIndex === -1 || !targetAuditJob) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit exists. But job not found!',
    })

    const nextStatus = targetAuditJob.status === EJobStatus.IS_DONE ? EJobStatus.IN_PROGRESS : EJobStatus.IS_DONE
    const tsUpdate = new Date().getTime()

    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].status = nextStatus

    if (nextStatus === EJobStatus.IS_DONE) {
      this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IS_DONE }))
    } else {
      this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = this._state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IN_PROGRESS }))
    }

    console.log(`tsUpdate ${tsUpdate}`)
    console.log(`nextStatus ${nextStatus}`)

    console.groupEnd()

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }

  getIncompleteSubjobsCounter({
    auditId,
    jobId,
  }: {
    auditId: string;
    jobId: string;
  }): number {
    let counter = 0

    try {
      const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)
      if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

      const targetAuditJobs = this.state.audits[targetAuditIndex].jobs
      const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
      if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')

      const targetSubjobs = this.state.audits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs
      for (let subjob of targetSubjobs) {
        if (subjob.status !== ESubjobStatus.IS_DONE) counter += 1
      }
    } catch (err) {
      console.warn(err)
    }

    return counter
  }
  getIncompleteJobsCounter({
    auditId,
  }: {
    auditId: string;
  }): number {
    let counter = 0

    try {
      const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

      if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

      const targetAuditJobs = this.state.audits[targetAuditIndex].jobs

      for (let job of targetAuditJobs) {
        if (job.status !== EJobStatus.IS_DONE) counter += 1
      }
    } catch (err) {
      console.warn(err)
    }

    return counter
  }

  public removeAudit({
    auditId,
  }: {
    auditId: string;
  }): Promise<{ isOk: boolean; message?: string }> {
    const targetAuditIndex = this.state.audits.findIndex(({ id }) => id === auditId)

    if (targetAuditIndex === -1) return Promise.reject({
      isOk: false,
      message: 'Oops... Audit not found!',
    })

    if (targetAuditIndex > -1) this._state.audits.splice(targetAuditIndex, 1)

    this.saveDataToLS()

    return Promise.resolve({ isOk: true })
  }
}

export const stateInstance = SingletoneState.getInstance()
