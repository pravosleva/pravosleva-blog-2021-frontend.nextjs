import { NEvent } from '~/srv.socket-logic/withReactiveChat/types'
import { getChannelName, state } from '~/srv.socket-logic/withReactiveChat/utils'
import { Socket, Server } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const chatMessageService = ({
  io,
  socket: _socket,
}: {
  io: Server;
  socket: Socket;
}) => (incData: Pick<NEvent.TReport, 'ts' | 'room' | 'specialData' | 'reportType'>, cb?: ({ message, ok }: { message: string, ok: boolean }) => void) => {
  state.addMessage({
    channelName: getChannelName(incData.room),
    message: incData
  })

  io
    .in(getChannelName(incData.room))
    .emit(NEvent.ServerOutgoing.RC_CHAT_MESSAGE, {
      report: {
        reportType: 'default',
        specialData: incData.specialData,
        ts: incData.ts,
        room: incData.room,
      }
    })
  // const socketsInRoomLen = io.sockets.adapter.rooms.get(getChannelName(incData.room))?.size || 0
  if (typeof cb === 'function') cb({
    message: '',
    ok: true,
  })
}
