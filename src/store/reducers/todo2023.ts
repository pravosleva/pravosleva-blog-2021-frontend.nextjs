import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
import { EJobStatus, ESubjobStatus, IJob, NTodo, TAudit } from '~/components/audit-helper';
import { getRandomString } from '~/utils/getRandomString';
// import { IRootState } from '~/store/IRootState'
// import { TAudit } from '~/components/ToDo2023/state'

type TLastVisitedPage = {
  tg_chat_id: number;
  tsVisit: number;
  // TOOD: label?
}
export type TState = {
  localAudits: TAudit[];
  online: {
    lastVisitedPages: TLastVisitedPage[];
    isAutoSyncWithLocalEnabled: boolean;
  };
  backupInfo?: {
    ts: number;
  };

  // -- NOTE: For local backup only
  // __lastTodosRoomState: NTodo.TRoomState | null;
  // --

  strapiTodos: NTodo.TTodo[];
  temporaryNamespaces: string[];
}
export const initialState: TState = {
  localAudits: [],
  online: {
    lastVisitedPages: [],
    isAutoSyncWithLocalEnabled: false,
  },
  // __lastTodosRoomState: null,
  strapiTodos: [],
  temporaryNamespaces: [],
}

const _getNextSubjobStatus = (prevStatus: ESubjobStatus): ESubjobStatus => {
  const keys = Object.values(ESubjobStatus)
  const currentIndex = keys.indexOf(prevStatus);
  const nextIndex = (currentIndex + 1) % keys.length;

  return keys[nextIndex]
}
// const _getNextJobStatus = (prevStatus: EJobStatus): EJobStatus => {
//   const keys = Object.values(EJobStatus)
//   const currentIndex = keys.indexOf(prevStatus);
//   const nextIndex = (currentIndex + 1) % keys.length;

//   return keys[nextIndex]
// }

const rememberPagesLimit: number = 20

export const todo2023Slice: any = createSlice({
  name: 'todo2023',
  initialState,
  reducers: {
    autoSyncToggle: (state: TState) => {
      state.online.isAutoSyncWithLocalEnabled = !state.online.isAutoSyncWithLocalEnabled
    },
    autoSyncDisable: (state: TState) => {
      state.online.isAutoSyncWithLocalEnabled = false
    },

    setLocalAudits: (state: TState, action: any) => {
      state.localAudits = action.payload
      const ts = new Date().getTime()

      state.backupInfo = {
        ts,
      }
    },
    fixVisitedPage: (state: TState, action: { payload: { tg_chat_id: number; } }) => {
      if (!state.online) {
        state.online = { ...initialState.online }
      }

      const isAlreadyExists = state.online.lastVisitedPages?.findIndex(({ tg_chat_id }) => tg_chat_id === action.payload.tg_chat_id) !== -1
      
      const newArr = state.online.lastVisitedPages?.filter(({ tg_chat_id }) => tg_chat_id !== action.payload.tg_chat_id) || []

      if (isAlreadyExists) {
        if (newArr.length >= rememberPagesLimit) newArr.pop()

        newArr.unshift({
          tg_chat_id: action.payload.tg_chat_id,
          tsVisit: new Date().getTime(),
        })
        state.online.lastVisitedPages = newArr
      } else {
        newArr.unshift({
          tg_chat_id: action.payload.tg_chat_id,
          tsVisit: new Date().getTime(),
        })
        state.online.lastVisitedPages = newArr
      }
    },
    updateAuditComment: (state: TState, action: { payload: { auditId: string; comment: string } }) => {
      const {
        payload : {
          auditId,
          comment,
        }
      } = action

      console.groupCollapsed(`UPDATE AUDIT COMMENT: ${auditId}, ${comment}`)
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)
    
        console.log(`targetAuditIndex ${targetAuditIndex}`)
    
        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
    
        const tsUpdate = new Date().getTime()
    
        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.localAudits[targetAuditIndex].comment = comment
        state.backupInfo = {
          ts: tsUpdate,
        }
      } catch (err) {
        console.warn(err)
      }
      console.groupEnd()
    },
    toggleJobDone: (state: TState, action: { payload: { auditId: string; jobId: string } }) => {
      const {
        payload : {
          auditId,
          jobId,
        }
      } = action
      console.groupCollapsed(`TGL JOB: ${auditId}, ${jobId}`)
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)
    
        console.log(`targetAuditIndex ${targetAuditIndex}`)
    
        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
    
        const targetAuditJobs: IJob[] = state.localAudits[targetAuditIndex].jobs
        const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
        const targetAuditJob = targetAuditJobs.find(({ id }) => id === jobId)
    
        console.log(`targetAuditJobIndex ${targetAuditJobIndex}`)
    
        if (targetAuditJobIndex === -1 || !targetAuditJob) throw new Error('Oops... Audit exists. But job not found!')
    
        const nextStatus = targetAuditJob.status === EJobStatus.IS_DONE ? EJobStatus.IN_PROGRESS : EJobStatus.IS_DONE
        const tsUpdate = new Date().getTime()
    
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = nextStatus
    
        if (nextStatus === EJobStatus.IS_DONE) {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IS_DONE }))
        } else {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.map((sj) => ({ ...sj, status: ESubjobStatus.IN_PROGRESS }))
        }
        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.backupInfo = {
          ts: tsUpdate,
        }
    
        console.log(`tsUpdate ${tsUpdate}`)
        console.log(`nextStatus ${nextStatus}`)
      } catch (err) {
        console.warn(err)
      }
      console.groupEnd()
    },
    toggleSubJobDone: (state: TState, action: { payload: {
      auditId: string;
      jobId: string;
      subjobId: string;
    } }) => {
      const {
        payload: {
          auditId,
          jobId,
          subjobId
        }
      } = action
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)
        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
    
        const targetAuditJobs = state.localAudits[targetAuditIndex].jobs
        const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
        if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')
    
        const targetSubjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs
        const targetAuditSubjobIndex = targetSubjobs.findIndex(({ id }) => id === subjobId)
        if (targetAuditSubjobIndex === -1) throw new Error('Oops... Audit & job exists. But subjob not found!')
        const targetAuditSubjob = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex]
        const nextStatus = _getNextSubjobStatus(targetAuditSubjob.status)
        const tsUpdate = new Date().getTime()
    
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].tsUpdate = tsUpdate
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs[targetAuditSubjobIndex].status = nextStatus
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
    
        if (state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.every(({ status }) => status === ESubjobStatus.IS_DONE)) {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IS_DONE
        } else {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
        }
        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.backupInfo = {
          ts: tsUpdate,
        }
      } catch (err) {
        console.warn(err)
      }
    },
    removeAudit: (state: TState, action: { payload: {
      auditId: string;
    } }) => {
      const {
        payload: {
          auditId,
        }
      } = action
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)

        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

        state.localAudits.splice(targetAuditIndex, 1)
        const ts = new Date().getTime()
        state.backupInfo = {
          ts,
        }
      } catch (err) {
        console.warn(err)
      }
    },
    addAudit: (state: TState, action: { payload: {
      name: string;
      description: string;
      jobs: IJob[];
    } }) => {
      const {
        payload: {
          name,
          description,
          jobs,
        }
      } = action

      try {
        if (!!state.localAudits.find(({ name: _name }) => _name === name)) throw new Error('Аудит с таким именем уже существует, придумайте что-то другое')

        const id = getRandomString(7)
        const tsCreate = new Date().getTime()
        
        state.localAudits.push({
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
        const ts = new Date().getTime()
        state.backupInfo = {
          ts,
        }
      } catch (err) {
        console.warn(err)
      }
    },
    addJob: (state: TState, action: { payload: {
      name: string;
      auditId: string;
      subjobs: { name: string; }[];
    } }) => {
      const {
        payload: {
          name,
          auditId,
          subjobs,
        }
      } = action

      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)

        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
        const tsCreate = new Date().getTime()
    
        state.localAudits[targetAuditIndex].jobs.push({
          id: getRandomString(5),
          name,
          status: EJobStatus.IN_PROGRESS,
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
        })
        state.localAudits[targetAuditIndex].tsUpdate = tsCreate
        state.backupInfo = {
          ts: tsCreate,
        }
      } catch (err) {
        console.warn(err)
      }
    },
    removeJob: (state: TState, action: { payload: {
      auditId: string;
      jobId: string;
    } }) => {
      const {
        payload: {
          auditId,
          jobId,
        }
      } = action

      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)

        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

        const targetAuditJobs = state.localAudits[targetAuditIndex].jobs
        const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
        
        if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')

        state.localAudits[targetAuditIndex].jobs = state.localAudits[targetAuditIndex].jobs.filter(({ id }) => id !== jobId)

        // NOTE: Если все jobs are completed, audit is done
        // const isAllJobsCompleted = state.localAudits[targetAuditIndex].jobs.every(({ status }) => status === EJobStatus.IS_DONE)
        // TODO: Should audit has status?

        const tsUpdate = new Date().getTime()

        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.backupInfo = { ts: tsUpdate }
      } catch (err) {
        console.warn(err)
      }
    },
    addSubjob: (state: TState, action: { payload: {
      name: string;
      auditId: string;
      jobId: string;
    } }) => {
      const {
        payload: {
          name,
          auditId,
          jobId,
        }
      } = action
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)

        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')

        const targetAuditJobs = state.localAudits[targetAuditIndex].jobs

        const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)

        if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')

        const tsUpdate = new Date().getTime()

        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.push({
          id: getRandomString(5),
          name,
          status: ESubjobStatus.IN_PROGRESS,
          tsCreate: tsUpdate,
          tsUpdate,
        })

        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.backupInfo = { ts: tsUpdate }
      } catch (err) {
        console.warn(err)
      }
    },
    removeSubjob: (state: TState, action: { payload: {
      auditId: string;
      jobId: string;
      subjobId: string;
    } }) => {
      const {
        payload: {
          auditId,
          jobId,
          subjobId,
        }
      } = action
  
      try {
        const targetAuditIndex = state.localAudits.findIndex(({ id }) => id === auditId)
        if (targetAuditIndex === -1) throw new Error('Oops... Audit not found!')
  
        const targetAuditJobs = state.localAudits[targetAuditIndex].jobs
        const targetAuditJobIndex = targetAuditJobs.findIndex(({ id }) => id === jobId)
        if (targetAuditJobIndex === -1) throw new Error('Oops... Audit exists. But job not found!')
  
        const targetAuditSubjobIndex = targetAuditJobs[targetAuditJobIndex].subjobs.findIndex(({ id }) => id === jobId)
        if (targetAuditSubjobIndex === -1) throw new Error('Oops... Audit exists. Job exists. But subjob not found!')
  
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.filter(({ id }) => id !== subjobId)
  
        // NOTE: Если все jubjobs are completed, job is done
        const isAllSubjobsCompleted = state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].subjobs.every(({ status }) => status === ESubjobStatus.IS_DONE)
        if (isAllSubjobsCompleted) {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IS_DONE
        } else {
          state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].status = EJobStatus.IN_PROGRESS
        }
  
        const tsUpdate = new Date().getTime()
  
        state.localAudits[targetAuditIndex].jobs[targetAuditJobIndex].tsUpdate = tsUpdate
        state.localAudits[targetAuditIndex].tsUpdate = tsUpdate
        state.backupInfo = { ts: tsUpdate }
      } catch (err) {
        console.warn(err)
      }
    },
    replaceAudits: (state: TState, action: { payload: {
      audits: TAudit[];
    } }) => {
      const {
        payload: {
          audits,
        }
      } = action

      state.localAudits = audits
      state.backupInfo = { ts: new Date().getTime() }
    },

    // NOTE: New 2023.11
    // replaceTodosRoomState: (state: TState, action: {
    //   payload: NTodo.TRoomState;
    // }) => {
    //   // console.log(action.payload)
    //   console.log('-action.payload')
    //   if (!!action.payload && Object.keys(action.payload || {}).length > 0) {
    //     console.log('-action.payload')
    //     console.log(action.payload)
    //     console.log('-case:ok')
    //     state.__lastTodosRoomState = action.payload || null
    //   } else {
    //     console.log(action.payload)
    //     console.log('-case:!ok')
    //   }
    // },

    // NOTE: v2 (todo strapi)
    addStrapiTodo: (state: TState, action: { payload: NTodo.TTodo; }) => {
      try {
        state.strapiTodos.push(action.payload)
      } catch (err) {
        state.strapiTodos = [action.payload]
      }
    },
    removeStrapiTodo: (state: TState, action: { payload: number; }) => {
      try {
        state.strapiTodos = state.strapiTodos.filter(({ id }) => id !== action.payload)
      } catch (err) {
        state.strapiTodos = []
      }
    },
    updateStrapiTodo: (state: TState, action: { payload: NTodo.TTodo; }) => {
      try {
        const targetIndex = state.strapiTodos.findIndex(({ id }) => id === action.payload.id)

        if (targetIndex === -1) {
          // throw new Error(`Нет такого id: ${action.payload.id}`)
          state.strapiTodos.push(action.payload)
        } else {
          state.strapiTodos[targetIndex] = action.payload
        }
      } catch (err) {
        console.warn(err)
        state.strapiTodos = [action.payload]
      }
    },
    replaceStrapiTodo: (state: TState, action: { payload: NTodo.TTodo[]; }) => {
      state.strapiTodos = action.payload
    },

    addTemporayNamespace: (state: TState, action: { payload: string; }) => {
      try {
        state.temporaryNamespaces.push(action.payload)
      } catch (err) {
        state.temporaryNamespaces = [action.payload]
      }
    },
    resetTemporayNamespaces: (state: TState) => {
      state.temporaryNamespaces = []
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.todo2023,
      };
    },
  },
})

export const {
  setLocalAudits,
  toggleJobDone,
  toggleSubJobDone,
  removeAudit,
  addAudit,
  addJob,
  removeJob,
  addSubjob,
  removeSubjob,
  updateAuditComment,

  replaceAudits,
  fixVisitedPage,
  autoSyncToggle,
  autoSyncDisable,

  // replaceTodosRoomState,
  addStrapiTodo,
  removeStrapiTodo,
  updateStrapiTodo,
  replaceStrapiTodo,

  addTemporayNamespace,
  resetTemporayNamespaces,
} = todo2023Slice.actions

export const reducer = todo2023Slice.reducer
