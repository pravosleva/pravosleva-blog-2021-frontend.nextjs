import { Socket } from 'socket.io'

const getChannelName = (s: string): string => {
  return `lab-channel:${s}`
}

namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
  }
}

// const state = new Map()

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
      io.to(getChannelName(roomId)).emit(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, {
        socketId: socket.id,
        message: 'BACK: Somebody connected to private channel',
      })
      if (!!cb) cb({ ok: true, message: `You\'re connected to ${channelName}. Socket id ${socket.id}` })
    })
  })
}
