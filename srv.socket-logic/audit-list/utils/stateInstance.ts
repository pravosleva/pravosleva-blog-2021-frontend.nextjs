import { EJobStatus, ESubjobStatus, NEventData, TAudit } from '~/srv.socket-logic/audit-list/types'
import { getRandomString } from '~/srv.utils/getRandonString'

type TOwnerTGChatId = number

const _getNextSubjobStatus = (prevStatus: ESubjobStatus): ESubjobStatus => {
  const keys = Object.values(ESubjobStatus)
  const currentIndex = keys.indexOf(prevStatus);
  const nextIndex = (currentIndex + 1) % keys.length;

  return keys[nextIndex]
}

class Singleton {
  private static instance: Singleton;
  _state: Map<TOwnerTGChatId, TAudit[]>;
  // _connections: Map<string, TOwnerTGChatId>;

  private constructor() {
    this._state = new Map()
    // this._connections = new Map()
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton();

    return Singleton.instance;
  }

  public get keys() {
    return this._state.keys()
  }
  public getKeys() {
    return [...this._state.keys()]
  }
  public get size() {
    return this._state.size
  }
  public set(key: number, value: TAudit[]) {
    return this._state.set(key, value)
  }
  public get(key: number) {
    return this._state.get(key)
  }
  public delete(key: number) {
    return this._state.delete(key)
  }
  public has(key: number) {
    return this._state.has(key)
  }

  public getRoomState(room: number): TAudit[] | undefined {
    return this._state.get(room)
  }
  public get state() {
    return Object.fromEntries(this._state)
  }

  public addAudit ({ room, name, description, jobs }: { room: number; name: string; description: string; jobs: { name: string; subjobs: { name: string }[] }[] }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    try {
      const targetAudits = this._state.get(room) || []
      if (!targetAudits) throw new Error(`Room ${room} not found`)

      if (!!targetAudits.find(({ name: _name }) => _name === name)) throw new Error('Аудит с таким именем уже существует, придумайте что-то другое')

      const id = getRandomString(7)
      const tsCreate = new Date().getTime()
      
      targetAudits.push({
        id,
        name,
        description: description || '',
        jobs: [...jobs.map((job) => {
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

      this._state.set(room, targetAudits)
      return Promise.resolve({ isOk: true, audits: targetAudits })
    } catch (err) {
      // @ts-ignore
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
  public updateAuditComment({ room, auditId, comment }: { room: number; auditId: string; comment: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: `Audit not found` })

    const tsUpdate = new Date().getTime()

    targetAudits[targetAuditIndex].comment = comment
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, message: 'Audit comment updated', audits: targetAudits })
  }
  public removeAudit({ room, auditId }: { room: number; auditId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const newAudits = targetAudits.filter(({ id }) => id !== auditId)
    this._state.set(room, newAudits)
    return Promise.resolve({ isOk: true, message: `New audits len= ${newAudits.length}`, audits: newAudits })
  }
  public addJob({ room, auditId, name, subjobs }: NEventData.NServerIncoming.TJOB_ADD): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: `Audit not found` })

    const targetAuditJobs = targetAudits[targetAuditIndex].jobs
    const tsCreate = new Date().getTime()
    const newAuditJobs = [...targetAuditJobs, {
      id: getRandomString(5),
      status: EJobStatus.IN_PROGRESS,
      name,
      // description?: string;
      subjobs: subjobs.map((sj) => {
        const sjId = getRandomString(5)
        return {
          ...sj,
          id: sjId,
          status: ESubjobStatus.IN_PROGRESS,
          tsCreate,
          tsUpdate: tsCreate,
        }}) || [],
      tsCreate,
      tsUpdate: tsCreate,
    }]

    targetAudits[targetAuditIndex].jobs = newAuditJobs
    targetAudits[targetAuditIndex].tsUpdate = tsCreate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, message: `New audits len= ${newAuditJobs.length}`, audits: targetAudits })
  }
  public toggleJobDone({ room, auditId, jobId }: { room: number; auditId: string; jobId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: 'Audit not found' })

    const targetAuditJobs = targetAudits[targetAuditIndex].jobs
    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    if (targetAuditJobIndex === -1) return Promise.reject({ isOk: false, message: 'Oops... Audit exists. But job not found!' })

    const targetAuditJob = targetAuditJobs.find(({ id }) => id === jobId)
    if (!targetAuditJob) return Promise.reject({ isOk: false, message: 'Oops... Audit exists. But job not found! #2' })

    const nextStatus = targetAuditJob.status === EJobStatus.IS_DONE ? EJobStatus.IN_PROGRESS : EJobStatus.IS_DONE
    const tsUpdate = new Date().getTime()

    // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = nextStatus
    targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = nextStatus
    if (nextStatus === EJobStatus.IS_DONE) {
      // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IS_DONE }))
      targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IS_DONE }))
    } else {
      // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IN_PROGRESS }))
      targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IN_PROGRESS }))
    }
    // state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, audits: targetAudits })
  }
  public removeJob ({ room, auditId, jobId }: { room: number; auditId: string; jobId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: 'Audit not found' })

    const targetAuditJobs = targetAudits[targetAuditIndex].jobs
    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    if (targetAuditJobIndex === -1) return Promise.reject({ isOk: false, message: 'Oops... Audit exists. But job not found!' })

    const targetAuditJob = targetAuditJobs.find(({ id }) => id === jobId)
    if (!targetAuditJob) return Promise.reject({ isOk: false, message: 'Oops... Audit exists. But job not found! #2' })

    const tsUpdate = new Date().getTime()

    targetAudits[targetAuditIndex].jobs = targetAudits[targetAuditIndex].jobs.filter(({ id }) => id !== jobId)
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, audits: targetAudits })
  }

  public addSubjob({ room, auditId, name, jobId }: { room: number; auditId: string; name: string; jobId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }>  {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: 'Audit not found' })

    const targetAuditJobs = targetAudits[targetAuditIndex].jobs
    const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
    if (targetAuditJobIndex === -1) return Promise.reject({ isOk: false, message: 'Oops... Audit exists. But job not found!' })

    const tsUpdate = new Date().getTime()

    // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.push({
    //   id: getRandomString(5),
    //   name,
    //   status: ESubjobStatus.IN_PROGRESS,
    //   tsCreate: tsUpdate,
    //   tsUpdate,
    // })
    targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.push({
      id: getRandomString(5),
      name,
      status: ESubjobStatus.IN_PROGRESS,
      tsCreate: tsUpdate,
      tsUpdate,
    })

    // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
    targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
    // state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    // state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, audits: targetAudits })
  }
  // public removeSubjob (): Promise<{ isOk: boolean; message?: string; audits: TAudit[] } {}
  public toggleSubjobDone ({ room, auditId, jobId, subjobId }: { room: number; auditId: string; jobId: string; subjobId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    try {
      // const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)
      // if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
  
      // const targetAuditJobs = state.localAudits[targetAuditIndex].jobs
      // const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
      // if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')

      const targetAudits = this._state.get(room)
      if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

      const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
      if (targetAuditIndex === -1) throw new Error('Audit not found')

      const targetAuditJobs = targetAudits[targetAuditIndex].jobs
      const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
      if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')

      const targetSubjobs = targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs
      const targetAuditSubjobIndex = targetSubjobs.findIndex(({ id }) => id === subjobId)
      if (targetAuditSubjobIndex === -1) throw new Error('Oops... Audit & job exists. But subjob not found!')
      const targetAuditSubjob = targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex]
      const nextStatus = _getNextSubjobStatus(targetAuditSubjob.status)
      const tsUpdate = new Date().getTime()
  
      targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].tsUpdate = tsUpdate
      targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].status = nextStatus
      targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
  
      if (targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.every(({ status }) => status === ESubjobStatus.IS_DONE)) {
        targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IS_DONE
      } else {
        targetAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
      }
      targetAudits[targetAuditIndex].tsUpdate = tsUpdate

      this._state.set(room, targetAudits)
      return Promise.resolve({ isOk: true, audits: targetAudits })
    } catch (err) {
      // @ts-ignore
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
}

export const stateInstance = Singleton.getInstance()
