import { EJobStatus, ESubjobStatus, NEventData, TAudit, NTodo } from '~/srv.socket-logic/withAuditListSocketLogic/types'
import { getRandomString } from '~/srv.utils/getRandomString'
import { strapiHttpClient } from '~/srv.utils'

// const isProd = process.env.NODE_ENV === 'production'
// const STRAPI_API_BASE_URL = isProd ? 'http://pravosleva.pro/strapi/api' : 'http://localhost:1337/api'

// if (!STRAPI_API_BASE_URL) throw new Error('⛔ process.env.STRAPI_API_BASE_URL was not provided, check .env file plz')

type TOwnerTGChatId = number;

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
  _todo: Map<TOwnerTGChatId, {
    [key: string]: {
      state: NTodo.TTodo[];
      tsCreate: number;
      tsUpdate: number;
    }
  }>;

  private constructor() {
    this._state = new Map()
    // this._connections = new Map()
    this._todo = new Map()
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
  // public set(key: number, value: TAudit[]) {
  //   return this._state.set(key, value)
  // }
  public initRoomAudits({ room, audits }: { room: number; audits: TAudit[] }) {
    this._state.set(room, audits)
  }
  public initRoomTodos({ room }: { room: number; }) {
    this._todo.set(room, {})
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

  public addAudit ({ room, name, description, jobs }: { room: number; name: string; description: string; jobs: { name: string; subjobs: { name: string }[] }[] }): Promise<{ isOk: boolean; message?: string; audits: TAudit[]; newAudit: TAudit; }> {
    try {
      const targetAudits = this._state.get(room) || []
      if (!targetAudits) throw new Error(`Room ${room} not found`)

      if (!!targetAudits.find(({ name: _name }) => _name === name)) throw new Error('Аудит с таким именем уже существует, придумайте что-то другое')

      const id = getRandomString(7)
      const tsCreate = new Date().getTime()
      const newAudit = {
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
      }

      targetAudits.push(newAudit)

      this._state.set(room, targetAudits)
      return Promise.resolve({ isOk: true, audits: targetAudits, newAudit })
    } catch (err) {
      // @ts-ignore
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
  public updateAuditComment({ room, auditId, comment }: { room: number; auditId: string; comment: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[]; updatedAudit: TAudit; }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: `Audit not found` })

    const tsUpdate = new Date().getTime()

    targetAudits[targetAuditIndex].comment = comment
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, message: 'Audit comment updated', audits: targetAudits, updatedAudit: targetAudits[targetAuditIndex] })
  }
  public removeAudit({ room, auditId }: { room: number; auditId: string; }): Promise<{ isOk: boolean; message?: string; audits: TAudit[] }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const newAudits = targetAudits.filter(({ id }) => id !== auditId)
    this._state.set(room, newAudits)
    return Promise.resolve({ isOk: true, message: `New audits len= ${newAudits.length}`, audits: newAudits })
  }
  public updateAudit({ room, auditId, newAuditData }: { room: number; auditId: string; newAuditData: { name: string; description?: string; } }): Promise<{
    isOk: boolean;
    message?: string;
    audits: TAudit[];
    updatedAudit?: TAudit;
  }> {
    const targetAudits = this._state.get(room)
    if (!targetAudits) return Promise.reject({ isOk: false, message: `Room ${room} not found` })

    const targetAuditIndex = targetAudits.findIndex(({ id }) => id === auditId)
    if (targetAuditIndex === -1) return Promise.reject({ isOk: false, message: `Audit not found` })

    const tsUpdate = new Date().getTime()

    targetAudits[targetAuditIndex].name = newAuditData.name
    if (!!newAuditData.description) targetAudits[targetAuditIndex].description = newAuditData.description
    if (!newAuditData.description && !!targetAudits[targetAuditIndex].description) targetAudits[targetAuditIndex].description = ''
    targetAudits[targetAuditIndex].tsUpdate = tsUpdate

    this._state.set(room, targetAudits)
    return Promise.resolve({ isOk: true, message: 'Audit params updated', audits: targetAudits, updatedAudit: targetAuditIndex !== -1 ? targetAudits[targetAuditIndex] : undefined })
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

  // --- NOTE: New 2023.11
  // public addNamespace ({ room, name }: { room: number; name: string }): Promise<{ isOk: boolean; message?: string; roomState: NTodo.TRoomState | undefined }> {
  //   try {
  //     // NOTE: 1.1 Есть ли комната для пользователя?
  //     let targetNamespacesOfRoom: { [key: string]: { state: NTodo.TTodo[]; tsCreate: number; tsUpdate: number; } } | never | undefined = this._todo.get(room)
      
  //     if (!targetNamespacesOfRoom) {
  //       // throw new Error(`Room ${room} not found!`)
  //       const tsCreate = new Date().getTime()
  //       targetNamespacesOfRoom = {
  //         [name]: {
  //           state: [],
  //           tsCreate,
  //           tsUpdate: tsCreate,
  //         },
  //       }
  //     } else {
  //       // NOTE: 1.2 Есть ли такой неймспейс?
  //       const targetNamespaceTodos: NTodo.TTodo[] | undefined = targetNamespacesOfRoom[name]?.state
  //       if (!!targetNamespaceTodos) throw new Error(`Namespace с именем ${name} уже существует! Придумайте другое имя`)
  //     }

  //     const tsCreate = new Date().getTime()
  //     const newRoomState = {
  //       ...targetNamespacesOfRoom,
  //       [name]: {
  //         state: [],
  //         tsUpdate: tsCreate,
  //         tsCreate,
  //       }
  //     }
  //     this._todo.set(room, newRoomState)
  //     return Promise.resolve({ isOk: true, roomState: newRoomState })
  //   } catch (err: any) {
  //     return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room) })
  //   }
  // }
  // public removeNamespace ({ room, name }: { room: number; name: string }): Promise<{ isOk: boolean; message?: string; roomState: NTodo.TRoomState | undefined }> {
  //   try {
  //     // NOTE: 1.1 Есть ли комната для пользователя?
  //     const targetNamespacesOfRoom: { [key: string]: { state: NTodo.TTodo[]; tsCreate: number; tsUpdate: number; } } | never | undefined = this._todo.get(room)
      
  //     if (!targetNamespacesOfRoom) throw new Error(`Room ${room} not found!`)
  //     else {
  //       // NOTE: 1.2 Есть ли такой неймспейс?
  //       const targetNamespaceTodos: NTodo.TTodo[] | undefined = targetNamespacesOfRoom[name]?.state
  //       if (!targetNamespaceTodos) throw new Error(`Namespace с именем ${name} не существует!`)
  //     }

  //     delete targetNamespacesOfRoom[name]

  //     this._todo.set(room, targetNamespacesOfRoom)
  //     return Promise.resolve({ isOk: true, roomState: targetNamespacesOfRoom })
  //   } catch (err: any) {
  //     return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room) })
  //   }
  // }
  public async addTodo ({ room, todoItem, namespace }: {
    room: number;
    todoItem: NTodo.TItem;
    namespace: string;
  }): Promise<{
    isOk: boolean;
    message?: string;
    data?: {
      id: number;
      attributes: {
        label: string;
        priority: number;
        tg_chat_id: string;
        namespace: string;
        status: NTodo.EStatus;
        description: string;
        createdAt: string; // "2023-11-19T01:13:03.482Z",
        updatedAt: string; // "2023-11-19T01:13:03.482Z",
        createdBy: any;
      };
    };
  }> {
    // NOTE: v1
    // try {
    //   // NOTE: 1.1 Есть ли комната для пользователя?
    //   const targetNamespacesOfRoom: { [key: string]: { state: NTodo.TTodo[]; tsCreate: number; tsUpdate: number; } } | never | undefined = this._todo.get(room)
    //   if (!targetNamespacesOfRoom) throw new Error(`Room ${room} not found`)
    //   // NOTE: 1.2 Есть ли такой неймспейс?
    //   const targetNamespaceTodos: NTodo.TTodo[] | undefined = targetNamespacesOfRoom[namespace]?.state
    //   if (!targetNamespaceTodos) throw new Error(`Namespace ${namespace} не найден! Создайте сначала namespace с таким именем`)

    //   const tsUpdate = new Date().getTime()
    //   const newRoomState = {
    //     ...targetNamespacesOfRoom,
    //     [namespace]: {
    //       state: [...targetNamespaceTodos, { id: tsUpdate, ...todoItem }],
    //       tsUpdate,
    //       tsCreate: targetNamespacesOfRoom[namespace].tsCreate,
    //     }
    //   }
    //   this._todo.set(room, newRoomState)
    //   return Promise.resolve({ isOk: true, roomState: newRoomState })
    // } catch (err: any) {
    //   return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room) })
    // }

    // NOTE: v2
    try {
      const result = await strapiHttpClient.createTodo<{
        data: {
          id: number;
          attributes: {
            label: string;
            priority: number;
            tg_chat_id: string;
            namespace: string;
            status: NTodo.EStatus;
            description: string;
            createdAt: string; // "2023-11-19T01:13:03.482Z",
            updatedAt: string; // "2023-11-19T01:13:03.482Z",
            createdBy: any;
          };
        };
        meta: any;
      }>({
        room,
        todoItem,
        namespace,
      })

      // console.log('-- stateInstance:addTodo:result')
      // console.log(result)
      // console.log('--')

      if (result.ok && !!result.res?.data) {
        return Promise.resolve({ isOk: true, data: result.res?.data })
      } else {
        // console.log(result) // NOTE: { isOk: false, msg: 'Http Error 404: Not Found' }
        throw new Error(result.message || 'ERR')
      }
    } catch (err: any) {
      console.log(err)
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
  public async removeTodo ({ todoId }: {
    todoId: number;
  }): Promise<{
    isOk: boolean;
    message?: string;
    removedTodoId?: number;
  }> {
    // NOTE: v1
    // try {
    //   // NOTE: 1.1 Есть ли комната для пользователя?
    //   const targetNamespacesOfRoom: { [key: string]: { state: NTodo.TTodo[]; tsCreate: number; tsUpdate: number; } } | never | undefined = this._todo.get(room)
    //   if (!targetNamespacesOfRoom) throw new Error(`Room ${room} not found`)
    //   // NOTE: 1.2 Есть ли такой неймспейс?
    //   const targetNamespaceTodos: NTodo.TTodo[] | undefined = targetNamespacesOfRoom[namespace]?.state
    //   if (!targetNamespaceTodos) throw new Error(`Namespace ${namespace} не найден! Не сможем удалить todo by id= ${todoId}`)

    //   const tsUpdate = new Date().getTime()
    //   const newRoomState = {
    //     ...targetNamespacesOfRoom,
    //     [namespace]: {
    //       state: targetNamespaceTodos.filter(({ id }) => id !== todoId),
    //       tsUpdate,
    //       tsCreate: targetNamespacesOfRoom[namespace].tsCreate,
    //     }
    //   }
    //   this._todo.set(room, newRoomState)
    //   return Promise.resolve({ isOk: true, roomState: newRoomState })
    // } catch (err: any) {
    //   return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room) })
    // }

    // NOTE: v2
    try {
      const result = await strapiHttpClient.deleteTodo<{
        data: {
          id: number;
          attributes: {
            label: string;
            priority: number;
            createdAt: string; // "2023-11-19T01:13:03.482Z",
            updatedAt: string; // "2023-11-19T01:13:03.482Z",
            tg_chat_id: string;
            namespace: string;
            status: NTodo.EStatus;
            description: string;
          }
        },
        meta: any;
      }>({ todoId })

      if (result.ok && !!result.res?.data?.id) {
        return Promise.resolve({
          isOk: true,
          removedTodoId: result.res?.data?.id,
        })
      } else {
        // console.log(result) // NOTE: { isOk: false, msg: 'Http Error 404: Not Found' }
        throw new Error(result.message || 'ERR')
      }
    } catch (err: any) {
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
  public async updateTodo({
    room,
    namespace,
    todoId,
    newTodoItem,
  }: {
    room: number;
    todoId: number;
    namespace: string;
    newTodoItem: NTodo.TItem;
  }): Promise<{
    isOk: boolean;
    message?: string;
    updatedTodo: {
      id: number;
      attributes: {
        label: string;
        priority: number;
        createdAt: string; // "2023-11-19T01:13:03.482Z",
        updatedAt: string; // "2023-11-19T01:13:03.482Z",
        tg_chat_id: string;
        namespace: string;
        status: NTodo.EStatus;
        description: string;
      };
    };
  }> {
    // NOTE: v1
    // try {
    //   // NOTE: 1.1 Есть ли комната для пользователя?
    //   const targetNamespacesOfRoom: { [key: string]: { state: NTodo.TTodo[]; tsCreate: number; tsUpdate: number; } } | never | undefined = this._todo.get(room)
    //   if (!targetNamespacesOfRoom) throw new Error(`Room ${room} not found`)
    //   // NOTE: 1.2 Есть ли такой неймспейс?
    //   const targetNamespaceTodos: NTodo.TTodo[] | undefined = targetNamespacesOfRoom[namespace]?.state
    //   if (!targetNamespaceTodos) throw new Error(`Namespace ${namespace} не найден! Создайте сначала namespace с таким именем`)

    //   const targetIndex = targetNamespaceTodos.findIndex(({ id }) => id === todoId)
    //   if (targetIndex === -1) throw new Error('Странно, но такой todo не нашлось')

    //   const tsUpdate = new Date().getTime()
    //   const oldTodoState = targetNamespaceTodos[targetIndex]

    //   targetNamespaceTodos[targetIndex] = { ...oldTodoState, ...newTodoItem }

    //   const newRoomState = {
    //     ...targetNamespacesOfRoom,
    //     [namespace]: {
    //       state: targetNamespaceTodos,
    //       tsUpdate,
    //       tsCreate: targetNamespacesOfRoom[namespace].tsCreate,
    //     }
    //   }
    //   this._todo.set(room, newRoomState)
    //   return Promise.resolve({ isOk: true, roomState: newRoomState })
    // } catch (err: any) {
    //   return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room) })
    // }

    // NOTE: v2
    try {
      const result = await strapiHttpClient.updateTodo<{
        data: {
          id: number;
          attributes: {
            label: string;
            priority: number;
            createdAt: string;
            updatedAt: string;
            tg_chat_id: string;
            namespace: string;
            status: NTodo.EStatus;
            description: string;
          }
        };
        meta: any;
      }>({
        todoId,
        todoItem: newTodoItem,
        room,
        namespace,
      })
      // const result = await strapiHttpClient.gqlUpdateTodo({
      //   todoId,
      //   todoItem: newTodoItem,
      //   namespace,
      //   tg_chat_id: room,
      // })

      console.log('-- stateInstance:updateTodo:result')
      console.log(result)
      console.log('--')

      if (result.ok && !!result.res?.data?.id) {
        return Promise.resolve({
          isOk: true,
          updatedTodo: result.res?.data,
        })
      } else {
        // console.log(result) // NOTE: { isOk: false, msg: 'Http Error 404: Not Found' }
        throw new Error(result.message || 'ERR')
      }
      // if (result.ok && !!result.res?.data?.id) {
      //   return Promise.resolve({
      //     isOk: true,
      //     updatedTodo: {
      //       id: Number(result.res?.data.id),
      //       attributes: result.res?.data.attributes,
      //     },
      //   })
      // } else {
      //   // console.log(result) // NOTE: { isOk: false, msg: 'Http Error 404: Not Found' }
      //   throw new Error(result.message || 'ERR')
      // }
    } catch (err: any) {
      return Promise.reject({ isOk: false, message: err?.message || 'No err.message' })
    }
  }
  // public replaceRoomState({ room, roomState }: { room: number; roomState: NTodo.TRoomState }): Promise<{ isOk: boolean; message?: string; roomState: NTodo.TRoomState | undefined }> {
  //   try {
  //     // NOTE: 1.1 Есть ли комната для пользователя?
  //     const targetNamespacesOfRoom: NTodo.TRoomState | never | undefined = this._todo.get(room)
  //     if (!!targetNamespacesOfRoom) throw new Error(`Room ${room} already exists!`)

  //     this._todo.set(room, roomState)
  //     return Promise.resolve({ isOk: true, roomState, yourData: { room, roomState } })
  //   } catch (err: any) {
  //     return Promise.reject({ isOk: false, message: err?.message || 'No err.message', roomState: this._todo.get(room), yourData: { room, roomState } })
  //   }
  // }
  // ---
}

export const stateInstance = Singleton.getInstance()
