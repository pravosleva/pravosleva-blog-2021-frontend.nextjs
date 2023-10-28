import { Socket, DisconnectReason as TDisconnectReason } from 'socket.io'
import { Looper, NLooper } from '~/srv.utils/Looper'
import { state } from './state'
import { quotesData } from './quotesData'
import { getRandomElement } from '~/srv.utils/tools-array/getRandomElement'

// const state = proxy({ count: 0, text: 'hello' })

// const loopersMap: {[key: string]: NLooper.TResut} = {}

const getChannelName = (s: string): string => `lab-channel:${s}`

namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
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

    socket.on(NEvent.ServerIncoming.TEST, () => {
      // io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
      io.to(socket.id).emit(NEvent.ServerOutgoing.TEST, {
        socketId: socket.id,
        message: 'BACK: Test event',
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
              message: `BACK: Somebody connected to private channel / ${connectionsMap.get(channelName)} connected`,
            })
          } else console.log(`-- !isOk (wtf#2): ${message || 'No message'}`)

          // -- NOTE: LOOPER_EXP 1/2 Create looper -> Run looper
          const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
          const isFirst = connsCounter === 1
          const looper = loopers[channelName]
          const notifRandomQuote = () => {
            const data = getRandomElement({ items: quotesData })
            io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
              message: `${data.quote} (${data.author})`
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
            const looper = loopers[channelName]
            cb({ ok: true, message: `You\'re connected to ${channelName}, isFirst= ${isFirst}, looper.getIsStated= ${!!looper ? looper.getIsStated() : '!looper'}` })
          }
        })
        .catch((err) => {
          console.log('- err#1')
          console.log(err)
          if (!!cb) cb({ ok: false, message: err.message })
        })
    })

    socket.on('disconnect', (reason: TDisconnectReason) => {
      state.decSocketInReestr({ socketId: socket.id })
        .then(({ isOk, instance, message }) => {
          if (isOk) {
            const stateInfo = instance.getStateInfo()
            const channelsList = stateInfo.list

            for (const channelName of channelsList) {
              const connsCounter = instance.getConnectionsCounterByChannelName({ channelName })
              io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
                socketId: socket.id,
                // message: `BACK: Somebody disconnected (${reason}) / ${connectionsMap.get(channelName)} connected`,
                message: `BACK (v2): Somebody disconnected (${reason}) / ${connsCounter} connected`,
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
        })
    })
  })
}
