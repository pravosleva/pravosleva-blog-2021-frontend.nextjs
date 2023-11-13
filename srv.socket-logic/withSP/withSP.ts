import {
  Socket,
  // DisconnectReason as TDisconnectReason,
} from 'socket.io'
// import { Looper, NLooper } from '~/srv.utils/Looper'
// import { state } from './state'
// import { getRandomElement } from '~/srv.utils/tools-array/getRandomElement'
import { NEvent } from './types'

// const getChannelName = (s: string): string => `lab-channel:${s}`

export const withLSP = (io: Socket) => {
  io.on('connection', function (socket: Socket) {

    socket.on(NEvent.ServerIncoming.SP_MX_EV, (data: any) => {
      // io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
      io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_EV, {
        socketId: socket.id,
        message: 'BACK: Test spmx event tst',
        yourData: data,
      })
    })

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
