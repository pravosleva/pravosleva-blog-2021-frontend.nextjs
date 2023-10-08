import { Socket, DisconnectReason as TDisconnectReason } from 'socket.io'

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
    COMMON_MESSAGE = 'lab:server:common-message',
  }
}

type TChannelId = string
type TRoomList = string[]
const state = new Map<TChannelId, TRoomList>()
const incConnectionsCounter = ({ channelName, socketId }: { channelName: string, socketId: string }) => {
  const userData = state.get(socketId)
  if (!!userData) state.set(socketId, [...new Set([channelName, ...userData])])
  else state.set(socketId, [channelName])
}
const decConnectionsCounter = ({ socketId }: { socketId: string }) => {
  state.delete(socketId)
}
const getStateInfo = (state: Map<TChannelId, TRoomList>): {
  list: string[];
  connectionsMap: Map<string, number>;
} => {
  const roomlistSet = new Set<string>()
  const connectionsMap = new Map<string, number>()
  for (const item of state) {
    const [_socketId, _roomList] = item

    for (const _room of _roomList) {
      roomlistSet.add(_room)
      const _connCounter = connectionsMap.get(_room) || 0
      connectionsMap.set(_room, _connCounter + 1)
    }
  }
  return {
    list: Array.from(roomlistSet),
    connectionsMap,
  }
}

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
      incConnectionsCounter({ channelName, socketId: socket.id })
      const stateInfo = getStateInfo(state)
      const connectionsMap = stateInfo.connectionsMap
      socket.broadcast.to(channelName).emit(NEvent.ServerOutgoing.SOMEBODY_CONNECTED_TO_ROOM, {
        socketId: socket.id,
        message: `BACK: Somebody connected to private channel (${connectionsMap.get(channelName)} connected)`,
      })
      if (!!cb) cb({ ok: true, message: `You\'re connected to ${channelName}. Socket id ${socket.id}` })
    })

    socket.on('disconnect', (reason: TDisconnectReason) => {
      decConnectionsCounter({ socketId: socket.id })

      const stateInfo = getStateInfo(state)
      const channelsList = stateInfo.list
      const connectionsMap = stateInfo.connectionsMap
      console.log(channelsList)    
      for (const channelName of channelsList) {
        io.to(channelName).emit(NEvent.ServerOutgoing.COMMON_MESSAGE, {
          socketId: socket.id,
          message: `BACK: Somebody disconnected (${reason}); ${connectionsMap.get(channelName)} connected`,
        })
      }
    });
  })
}
