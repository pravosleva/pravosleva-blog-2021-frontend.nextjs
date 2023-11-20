import { Socket } from 'socket.io'
// import { getTstValue } from '~/srv.utils'
import { NEvent, NEventData, NTodo } from './types'
// NOTE: Fake DB as cache
import {
  stateInstance,
  // connectionsInstance,
} from '~/srv.socket-logic/audit-list/utils'
import { strapiHttpClient } from '~/srv.utils'

const getChannelName = (tg_chat_id: number): string => `audit-list:${tg_chat_id}`

export const withAuditListSocketLogic = (io: Socket) => {
  io.on('connection', function (socket: any) {
    // 1.
    socket.on(NEvent.EServerIncoming.CLIENT_CONNECT_TO_ROOM, async ({ room }: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM, cb: NEventData.NServerIncoming.TCLIENT_CONNECT_TO_ROOM_CB) => {
      // console.log(`-- CLIENT_CONNECT_TO_ROOM -> ${room} (${typeof room})`)
      // if (connectionsInstance.has(socket.id)) {
      //   socket.leave(connectionsInstance.get(socket.id))
      // }

      socket.join(getChannelName(room))
      // connectionsInstance.set(socket.id, room)

      // const pages = stateInstance.getKeys()
      // console.log(`-- keys -> ${keys.join(', ')}`)
      // const strapiTodos = await strapiHttpClient.getTodos<{
      //   data?: {
      //     id: number;
      //     attributes: {
      //       label: string;
      //       priority: number;
      //       createdAt: string;
      //       updatedAt: string;
      //       tg_chat_id: string;
      //       namespace: string;
      //       status: NTodo.EStatus;
      //       description: string;
      //     }
      //   }[];
      //   meta: any;
      // }>()

      const strapiTodos = await strapiHttpClient.gqlGetTodos({
        tg_chat_id: room,
      })

      console.log('--server-logic:strapiTodos')
      console.log(strapiTodos)
      console.log('--')

      cb({
        data: {
          room,
          // message: `pages= ${pages.join(', ') || 'no yet'}`,

          // -- NOTE: Init anything (server 1/2)
          audits: stateInstance.get(room) || [],
          // roomState: stateInstance._todo.get(room) || undefined,
          strapiTodos:
            !!strapiTodos.res?.data && Array.isArray(strapiTodos.res.data)
              ? strapiTodos.res.data.reduce((acc: any, item) => {
                const normalizedTodo: NTodo.TTodo = {
                  id: Number(item.id),
                  label: item.attributes?.label,
                  description: item.attributes?.description,
                  status: item.attributes?.status,
                  priority: item.attributes?.priority,
                  tg_chat_id: Number(item.attributes?.tg_chat_id),
                  namespace: item.attributes?.namespace,
                }
                acc.push(normalizedTodo)
                return acc
              }, [])
            : []
          // --
        }})
    })
    // 2.
    socket.on(NEvent.EServerIncoming.AUDITLIST_REPLACE, ({ room, audits }: NEventData.NServerIncoming.TAUDITLIST_REPLACE, _cb: NEventData.NServerIncoming.TAUDITLIST_REPLACE_CB) => {
      stateInstance.initRoomAudits({ room, audits })
      // cb({ data: { room, audits: stateInstance.get(room) || [], message: `stateInstance.size= ${stateInstance.size}` }})
      // NOTE: broadcast to all
      io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits: stateInstance.get(room) || [] })
    })
    // TODO?: /express-next-api/todo2023/auditlist.replace { room, audits }
    // 3.
    socket.on(NEvent.EServerIncoming.AUDIT_REMOVE, ({ room, auditId }: NEventData.NServerIncoming.TAUDIT_REMOVE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.removeAudit({ room, auditId })
        .then(({ audits }) => {
          // NOTE: broadcast to all
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
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
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 5.
    socket.on(NEvent.EServerIncoming.SUBJOB_ADD, ({ room, auditId, name, jobId }: NEventData.NServerIncoming.TSUBJOB_ADD, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.addSubjob({ room, auditId, name, jobId })
        .then(({ audits }) => {
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 5.
    socket.on(NEvent.EServerIncoming.JOB_TOGGLE_DONE, ({ room, auditId, jobId, }: NEventData.NServerIncoming.TJOB_TOGGLE_DONE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.toggleJobDone({ room, auditId, jobId })
        .then(({ audits }) => {
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 6.
    socket.on(NEvent.EServerIncoming.JOB_REMOVE, ({ room, auditId, jobId, }: NEventData.NServerIncoming.TJOB_REMOVE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.removeJob({ room, auditId, jobId })
        .then(({ audits }) => {
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
        })
        .catch((err) => {
          cb({ data: { room, isOk: err?.isOk || false, message: err?.message || 'No err.message' }})
        })
    })
    // 7.
    socket.on(NEvent.EServerIncoming.SUBJOB_TOGGLE_DONE, ({ room, auditId, jobId, subjobId, }: NEventData.NServerIncoming.TSUBJOB_TOGGLE_DONE, cb: NEventData.NServerIncoming.TAUDIT_REMOVE_CB) => {
      stateInstance.toggleSubjobDone({ room, auditId, jobId, subjobId })
        .then(({ audits }) => {
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
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
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
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
          io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
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

    // NOTE: New 2023.11
    socket.on(NEvent.EServerIncoming.TODO2023_ADD_NAMESPACE, (ev: NEventData.NServerIncoming.TAddNamespace, cb?: (e: NEventData.NServerIncoming.TAddNamespaceCB) => void) => {
      // stateInstance.addNamespace({ room: ev.room, name: ev.name })
      //   .then((e) => {
      //     io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, { roomState: e.roomState });
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     if (!!cb) cb({ room: ev.room, isOk: err?.isOk || false, message: err?.message || 'No err.message', roomState: err?.roomState || stateInstance._todo.get(ev.room) })
      //   })
      if (!!cb) cb({ room: ev.room, isOk: false, message: 'Not supported' })
    })
    socket.on(NEvent.EServerIncoming.TODO2023_REMOVE_NAMESPACE, (ev: NEventData.NServerIncoming.TRemoveNamespace, cb?: (e: NEventData.NServerIncoming.TRemoveNamespaceCB) => void) => {
      // stateInstance.removeNamespace({ room: ev.room, name: ev.name })
      //   .then((e) => {
      //     io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, { roomState: e.roomState });
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     if (!!cb) cb({ room: ev.room, isOk: err?.isOk || false, message: err?.message || 'No err.message', roomState: err?.roomState || stateInstance._todo.get(ev.room) })
      //   })
      if (!!cb) cb({ room: ev.room, isOk: false, message: 'Not supported' })
    })
    socket.on(
      NEvent.EServerIncoming.TODO2023_ADD_TODO_ITEM,
      (
        ev: NEventData.NServerIncoming.TAddTodo,
        cb?: (
          e: NEventData.NServerIncoming.TAddTodoCB
        ) => void
      ) => {
        stateInstance.addTodo({ room: ev.room, namespace: ev.namespace, todoItem: ev.todoItem })
          .then((e) => {
            if (!!cb) cb({
              isOk: true,
              message: 'Created',
              room: ev.room,
              // roomState: stateInstance._todo.get(ev.room) || {},
            })
            // NOTE: v1
            // io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, { roomState: e.roomState });
            // NOTE: v2
            if (e.isOk) io.in(getChannelName(ev.room)).emit<NEvent.EServerOutgoing>(
              NEvent.EServerOutgoing.TODO2023_TODO_ITEM_ADDED,
              {
                newTodo: {
                  id: e.data?.id,
                  label: e.data?.attributes.label,
                  description: e.data?.attributes.description,
                  namespace: e.data?.attributes.namespace,
                  status: e.data?.attributes.status,
                  tg_chat_id: e.data?.attributes.tg_chat_id,
                  priority: e.data?.attributes.priority,
                }
              }
            )
            else throw new Error(e.message || 'ERR.194')
          })
          .catch((err) => {
            console.log(err)
            if (!!cb) cb({
              room: ev.room,
              isOk: err?.isOk || false,
              message: err?.message || 'No err.message',
              // roomState: err?.roomState || stateInstance._todo.get(ev.room),
            })
          })
      }
    )
    socket.on(
      NEvent.EServerIncoming.TODO2023_REMOVE_TODO_ITEM,
      (
        ev: NEventData.NServerIncoming.TRemoveTodo,
        cb?: (e: NEventData.NServerIncoming.TRemoveTodoCB) => void,
      ) => {
        stateInstance.removeTodo({ todoId: ev.todoId })
          .then((e) => {
            if (e.isOk) io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_REMOVED, { removedTodoId: e.removedTodoId })
            else throw new Error(e.message || 'ERR.216')
          })
          .catch((err) => {
            console.log(err)
            if (!!cb) cb({ room: ev.room, isOk: err?.isOk || false, message: err?.message || 'No err.message', roomState: err?.roomState || stateInstance._todo.get(ev.room) })
          })
    })
    socket.on(NEvent.EServerIncoming.TODO2023_UPDATE_TODO_ITEM, (ev: NEventData.NServerIncoming.TUpdateTodo, cb?: (e: NEventData.NServerIncoming.TUpdateTodoCB) => void) => {
      stateInstance.updateTodo({
        room: ev.room,
        namespace: ev.namespace,
        newTodoItem: ev.newTodoItem,
        todoId: ev.todoId,
      })
        .then((e) => {
          if (e.isOk) io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_TODO_ITEM_UPDATED, {
            updatedTodo: {
              id: e.updatedTodo.id,
              label: e.updatedTodo.attributes.label,
              description: e.updatedTodo.attributes.description,
              priority: e.updatedTodo.attributes.priority,
              status: e.updatedTodo.attributes.status,
              namespace: e.updatedTodo.attributes.namespace,
              tg_chat_id: Number(e.updatedTodo.attributes.tg_chat_id),
            },
          })
          else throw new Error(e.message || 'ERR.242')
        })
        .catch((err) => {
          console.log(err)
          if (!!cb) cb({ room: ev.room, isOk: err?.isOk || false, message: err?.message || 'No err.message', roomState: err?.roomState || stateInstance._todo.get(ev.room) })
        })
    })
    socket.on(NEvent.EServerIncoming.TODO2023_REPLACE_ROOM_STATE, (ev: NEventData.NServerIncoming.TReplaceRoomState, cb?: (e: NEventData.NServerIncoming.TReplaceRoomStateCB) => void) => {
      // stateInstance.replaceRoomState({
      //   room: ev.room,
      //   roomState: ev.roomState,
      // })
      //   .then((e) => {
      //     io.in(getChannelName(ev.room)).emit(NEvent.EServerOutgoing.TODO2023_REPLACE_ROOM_STATE, { roomState: e.roomState });
      //   })
      //   .catch((err) => {
      //     console.log(err)
      //     if (!!cb) cb({ room: ev.room, isOk: err?.isOk || false, message: err?.message || 'No err.message', roomState: err?.roomState || stateInstance._todo.get(ev.room) })
      //   })
      if (!!cb) cb({ room: ev.room, isOk: false, message: 'Not supported' })
    })

    // socket.on("disconnect", () => {
    //   connectionsInstance.delete(socket.id)
    // });
  })
}
