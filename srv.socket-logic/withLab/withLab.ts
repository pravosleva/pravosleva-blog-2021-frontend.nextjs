import { Socket, DisconnectReason as TDisconnectReason } from 'socket.io'
import { Looper, NLooper } from '~/srv.utils/Looper'
import { state } from './state'
import { quotesData } from './quotesData'
import { getRandomElement } from '~/srv.utils/tools-array/getRandomElement'

const getChannelName = (s: string): string => `lab-channel:${s}`

namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
    WANNA_BE_DISCONNECTED_FROM_ROOM = 'lab:client:wanna-be-disconnected-from-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
    COMMON_MESSAGE = 'lab:server:common-message',
  }
}

const loopers: {
  [key: string]: NLooper.TResut;
} = {}

export const withLab = (io: Socket) => {
  io.on('connection', function (socket: Socket) {
    // - NOTE: Discnnect cb
    const onDisconnect = ({ promiseResult, reason }: any) => {
      const { isOk, message, instance } = promiseResult
      if (isOk) {
        const stateInfo = instance.getStateInfo()
        const channelsList = stateInfo.list

        for (const channelName of channelsList) {
          const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
          io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
            socketId: socket.id,
            // message: `BACK: Somebody disconnected (${reason}) / ${connectionsMap.get(channelName)} connected`,
            message: `Somebody disconnected (${reason}) / conns: ${connsCounter}`,
            notistackProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            },
          })
        }

        // -- NOTE: LOOPER_EXP 2/2 Stop looper -> Delete looper
        for (const channelName in loopers) {
          const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
          if (connsCounter < 1) {
            loopers[channelName].stop()
            io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
              message: 'Looper stoped',
            })
          }
        }
        // --
      } else console.log(`- !isOk (wtf#1): ${message || 'No message'}`)
    }
    // -

    socket.on(NEvent.ServerIncoming.TEST, (data: any) => {
      // io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
      io.to(socket.id).emit(NEvent.ServerOutgoing.TEST, {
        socketId: socket.id,
        message: 'BACK: Test event',
        yourData: data,
      })
    })

    socket.on(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, ({ roomId }: { roomId: string }, cb) => {
      const channelName = getChannelName(roomId)
      socket.join(channelName)

      state.incSocketInReestr({ channelName, socketId: socket.id })
        .then(({ isOk, message, instance }) => {
          if (isOk) {
            const stateInfo = instance.getStateInfo()
            const connectionsMap = stateInfo.connectionsMap
            socket.broadcast.to(channelName).emit(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, {
              socketId: socket.id,
              message: `Somebody connected to private channel / conns: ${connectionsMap.get(channelName)}`,
              notistackProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
              },
            })
          } else console.log(`-- !isOk (wtf#2): ${message || 'No message'}`)

          // -- NOTE: LOOPER_EXP 1/2 Create looper -> Run looper
          const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
          const isFirst = connsCounter === 1
          const looper = loopers[channelName]
          const notifRandomQuote = () => {
            const data = getRandomElement({ items: quotesData })
            const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
            io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
              message: `${data.quote} (${data.author}) / conns: ${connsCounter}`,
              notistackProps: {
                variant: 'default',
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
              },
            })
          }
          if (isFirst) {
            if (!looper) {
              const looper = Looper(10 * 1000)()
              loopers[channelName] = looper
              looper.start(notifRandomQuote)
              io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
                socketId: socket.id,
                message: 'Looper created and started',
              })
            } else {
              looper.start(notifRandomQuote)
              io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
                socketId: socket.id,
                message: 'Looper started',
              })
            }
          } else console.log(`-- !isFirst`)
          // --
          if (!!cb) {
            // const looper = loopers[channelName]
            // const isLooperExists = !!looper
            const msgList = [`You\'re connected to ${channelName}`]
            if (isFirst) msgList.push('You\'re first in room')
            // if (isLooperExists) msgList.push(looper.getIsStated() ? 'Looper started' : 'Looper wasnt started')
            // else msgList.push('Looper not exists (wtf?)')
            msgList.push('Take quote for each 10 seconds...')

            cb({
              ok: true,
              message: `Added to reestr / ${msgList.join(' / ')}`,
              notistackProps: {
                variant: 'success',
                autoHideDuration: 15000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
              },
            })
          }
        })
        .catch((err) => {
          const message = err?.message
          if (!!cb) cb({
            ok: false,
            message: `Add to reestr ERR / ${message || 'No err.message'}`,
            notistackProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            },
          })
        })
    })

    socket.on(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, ({ roomId }: { roomId: string }, cb) => {
      const channelName = getChannelName(roomId)
      socket.leave(channelName)

      state.decSocketInReestr({ socketId: socket.id })
        .then(({ isOk, message, instance }) => {
          onDisconnect({
            promiseResult: { isOk, message, instance },
            reason: `Leave from channel: ${channelName}`,
            socketId: socket.id,
          })

          if (!!cb) cb({
            ok: isOk,
            message: `Disconnect from private room${!!message ? ` / ${message}` : ''}`,
            notistackProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
            },
          })
        })
        .catch((err) => {
          const message = err?.message
          if (!!cb) cb({ ok: false, message: `Disconnect from private room ERR${!!message ? ` / ${message}` : 'No err.message'}` })
        })
    })

    socket.on('disconnect', (reason: TDisconnectReason) => {
      const socketId = socket.id
      state.decSocketInReestr({ socketId })
        .then((promiseResult) => {
          onDisconnect({
            promiseResult,
            reason,
            socketId,
          })
        })
    })
  })
}
