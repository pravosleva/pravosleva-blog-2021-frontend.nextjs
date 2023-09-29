import { Socket } from 'socket.io'
// import { getTstValue } from '~/srv.utils'
import { NEvent, NEventData } from './types'
// NOTE: Fake DB as cache
import {
  stateInstance,
  // connectionsInstance,
} from '~/srv.utils/todo2023'

export const withTodo2023SocketLogic = (io: Socket) => {
  io.on('connection', function (socket: any) {
    // 1.
    socket.on(NEvent.EServerIncoming.CLIENT_CONNECT_TO_ROOM, ({ room }: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM, cb: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM_CB) => {
      // console.log(`-- CLIENT_CONNECT_TO_ROOM -> ${room} (${typeof room})`)
      // if (connectionsInstance.has(socket.id)) {
      //   socket.leave(connectionsInstance.get(socket.id))
      // }

      socket.join(String(room))
      // connectionsInstance.set(socket.id, room)

      const pages = stateInstance.getKeys()
      // console.log(`-- keys -> ${keys.join(', ')}`)
      cb({ data: { room, audits: stateInstance.get(room) || [], message: `pages= ${pages.join(', ') || 'no yet'}` }})
    })
    // 2.
    socket.on(NEvent.EServerIncoming.AUDITLIST_REPLACE, ({ room, audits }: NEventData.NServerIncoming.TAUDITLIST_REPLACE, _cb: NEventData.NServerIncoming.TAUDITLIST_REPLACE_CB) => {
      stateInstance.set(room, audits)
      // cb({ data: { room, audits: stateInstance.get(room) || [], message: `stateInstance.size= ${stateInstance.size}` }})
      // NOTE: broadcast to all
      io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits: stateInstance.get(room) || [] });
    })
    // TODO?: /express-next-api/todo2023/auditlist.replace { room, audits }
    // 3.
    socket.on(NEvent.EServerIncoming.AUDIT_REMOVE, ({ room, auditId }: NEventData.NServerIncoming.TAUDIT_REMOVE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.removeAudit({ room, auditId })
        .then(({ audits }) => {
          // NOTE: broadcast to all
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
          // cb({ data: { room, isOk, audits, message: `stateInstance.size= ${stateInstance.size}` }})
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 4.
    socket.on(NEvent.EServerIncoming.JOB_ADD, ({ room, auditId, name, subjobs }: NEventData.NServerIncoming.TJOB_ADD, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.addJob({ room, auditId, name, subjobs })
        .then(({ audits }) => {
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 5.
    socket.on(NEvent.EServerIncoming.SUBJOB_ADD, ({ room, auditId, name, jobId }: NEventData.NServerIncoming.TSUBJOB_ADD, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.addSubjob({ room, auditId, name, jobId })
        .then(({ audits }) => {
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 5.
    socket.on(NEvent.EServerIncoming.JOB_TOGGLE_DONE, ({ room, auditId, jobId, }: NEventData.NServerIncoming.TJOB_TOGGLE_DONE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.toggleJobDone({ room, auditId, jobId })
        .then(({ audits }) => {
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 6.
    socket.on(NEvent.EServerIncoming.JOB_REMOVE, ({ room, auditId, jobId, }: NEventData.NServerIncoming.TJOB_REMOVE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.removeJob({ room, auditId, jobId })
        .then(({ audits }) => {
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 7.
    socket.on(NEvent.EServerIncoming.SUBJOB_TOGGLE_DONE, ({ room, auditId, jobId, subjobId, }: NEventData.NServerIncoming.TSUBJOB_TOGGLE_DONE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.toggleSubjobDone({ room, auditId, jobId, subjobId })
        .then(({ audits }) => {
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 8.
    socket.on(NEvent.EServerIncoming.AUDIT_ADD, ({ room, name, description, jobs }: NEventData.NServerIncoming.TAUDIT_ADD, cb?: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.addAudit({ room, name, description, jobs })
        .then(({ audits }) => {
          // console.log(`-- audit added: audits.len ${audits.length}`)
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          console.log(err)
          if (!!cb) cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 9.
    socket.on(NEvent.EServerIncoming.AUDIT_UPDATE_COMMENT, ({ room, auditId, comment }: NEventData.NServerIncoming.TAUDIT_UPDATE_COMMENT, cb?: NEventData.NServerIncoming.TAUDIT_UPDATE_COMMENT_CB) => {
      stateInstance.updateAuditComment({ room, auditId, comment })
        .then(({ audits }) => {
          // console.log(`-- audit added: audits.len ${audits.length}`)
          io.in(String(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          console.log(err)
          if (!!cb) cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })

    io.to(socket.id).emit('tst.action1', {
      data: {
        socketId: socket.id,
      }
    })

    // socket.on("disconnect", () => {
    //   connectionsInstance.delete(socket.id)
    // });
  })
}