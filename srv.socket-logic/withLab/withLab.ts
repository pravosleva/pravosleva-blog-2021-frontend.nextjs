import { Socket, DisconnectReason as TDisconnectReason } from 'socket.io'
import { Looper, NLooper } from '~/srv.utils/Looper'
import { state, Singleton as StateSingleton } from './state'
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

const quoteNotifIntervalInMinutes = 5
const quoteNotifAutoHideLimitInMinutes = 1

export const withLab = (io: Socket) => {
  io.on('connection', function (socket: Socket) {
    // console.log(socket.handshake.query.uniqueClientKey) // Socket-Lab-Unique-Client-Key
    // - NOTE: Discnnect cb
    const onDisconnect = ({ promiseResult, reason }: {
      promiseResult: {
        isOk: boolean;
        message?: string;
        instance: StateSingleton;
      };
      reason?: string;
      clientId?: string;
    }) => {
      const { isOk, message, instance } = promiseResult
      if (isOk) {
        const stateInfo = instance.getStateInfo()
        const channelsList = stateInfo.list

        for (const channelName of channelsList) {
          const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
          io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
            clientId: socket.handshake.query.uniqueClientKey,
            // message: `BACK: Somebody disconnected (${reason}) / ${connectionsMap.get(channelName)} connected`,
            message: `Somebody disconnected (${reason}) / conns: ${connsCounter}`,
            notistackProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
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
        clientId: socket.handshake.query.uniqueClientKey,
        message: 'BACK: Test event',
        yourData: data,
      })
    })

    socket.on(NEvent.ServerIncoming.WANNA_BE_CONNECTED_TO_ROOM, ({ roomId }: { roomId: string }, cb) => {
      const channelName = getChannelName(roomId)
      socket.join(channelName)
      const hasClientId = typeof socket.handshake.query.uniqueClientKey === 'string'

      if (hasClientId) state.incSocketInReestr({
        channelName,
        // @ts-ignore
        clientId: socket.handshake.query.uniqueClientKey,
      })
        .then(({ isOk, message, instance }) => {
          if (isOk) {
            // const stateInfo = instance.getStateInfo()
            // const connectionsMap = stateInfo.connectionsMap
            const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
            socket.broadcast.to(channelName).emit(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, {
              clientId: socket.handshake.query.uniqueClientKey,
              message: `Somebody connected to private channel / conns: ${connsCounter}`,
              notistackProps: {
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
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
                autoHideDuration: quoteNotifAutoHideLimitInMinutes * 60 * 1000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'center',
                },
              },
            })
          }
          if (isFirst) {
            if (!looper) {
              const looper = Looper(quoteNotifIntervalInMinutes * 60 * 1000)()
              loopers[channelName] = looper
              looper.start(notifRandomQuote)
              io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
                clientId: socket.handshake.query.uniqueClientKey,
                message: 'Looper created and started',
              })
            } else {
              looper.start(notifRandomQuote)
              // io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
              //   clientId: socket.handshake.query.uniqueClientKey,
              //   message: 'Looper started',
              // })
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
            msgList.push(`Take quote for each ${quoteNotifIntervalInMinutes} mins...`)

            cb({
              ok: true,
              message: `Added to reestr / ${msgList.join(' / ')}`,
              notistackProps: {
                variant: 'success',
                autoHideDuration: 35 * 1000,
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right',
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
                horizontal: 'right',
              },
            },
          })
        })
    })

    socket.on(NEvent.ServerIncoming.WANNA_BE_DISCONNECTED_FROM_ROOM, ({ roomId }: { roomId: string }, cb) => {
      const channelName = getChannelName(roomId)
      socket.leave(channelName)

      const hasClientId = typeof socket.handshake.query.uniqueClientKey === 'string'
      if (hasClientId) state.decSocketInReestr({
        // socketId: socket.id,
        // @ts-ignore
        clientId: socket.handshake.query.uniqueClientKey
      })
        .then(({ isOk, message, instance }) => {
          onDisconnect({
            promiseResult: { isOk, message, instance },
            reason: `Leave from channel: ${channelName}`,
            clientId: typeof socket.handshake.query.uniqueClientKey === 'string'
              ? socket.handshake.query.uniqueClientKey
              : undefined,
          })

          if (!!cb) cb({
            ok: isOk,
            message: `Disconnect from private room${!!message ? ` / ${message}` : ''}`,
            notistackProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
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
      const hasClientId = typeof socket.handshake.query.uniqueClientKey === 'string'
      if (hasClientId) state.decSocketInReestr({
        // @ts-ignore
        clientId: socket.handshake.query.uniqueClientKey,
      })
        .then((promiseResult) => {
          onDisconnect({
            promiseResult,
            reason,
            clientId: typeof socket.handshake.query.uniqueClientKey === 'string'
              ? socket.handshake.query.uniqueClientKey
              : undefined,
          })
        })
    })
  })
}
