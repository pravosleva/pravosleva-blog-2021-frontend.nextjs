import { NEvent, TGeoIpInfo } from '~/srv.socket-logic/withReactiveChat/types'
import { getChannelName, mws, state } from '~/srv.socket-logic/withReactiveChat/utils'
import { Socket, Server } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const joinService = ({
  ip,
  geoip,
  io,
  socket,
  clientUserAgent: userAgent,
  clientReferer,
}: {
  ip?: string;
  geoip?: TGeoIpInfo | null;
  io: Server;
  socket: Socket;
  clientUserAgent?: string;
  clientReferer?: string;
}) => (incData: Pick<NEvent.TReport, 'app' | 'room' | '_ip' | '_geoip' | '_userAgent' | '_clientReferer'>, cb?: ({ message, ok }: { message: string, ok: boolean }) => void) => {
  mws.checkAppVersion({ data: incData })
    .then((e) => {
      if (e.ok) {
        // -- NOTE: Exp
        socket.join(getChannelName(incData.room))
        // --
        const modifiedReport = { ...incData }
        if (!!ip) modifiedReport._ip = ip
        if (!!geoip) modifiedReport._geoip = geoip
        if (!!userAgent) modifiedReport._userAgent = userAgent
        if (!!clientReferer) modifiedReport._clientReferer = clientReferer
        // state.addReportToReestr({ roomId: incData.room, report: modifiedReport })

        state.getStateInfo(getChannelName(incData.room))
          .then(({ items }) => {
            socket.emit(
              NEvent.ServerOutgoing.RC_HISTORY,
              { history: items }
            )
          })
          .catch((err) => {
            console.log('-- withReactiveChat:joinService')
            console.log(err?.message || 'No err?.message')
            console.log('--')
          })

        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.RC_PONG_OK, {
            message: `socket.id ${socket.id} joined to room ${getChannelName(incData.room)}`,
            report: modifiedReport,
          })
        const socketsInRoomLen = io.sockets.adapter.rooms.get(getChannelName(incData.room))?.size || 0
        if (typeof cb === 'function') cb({
          message: [
            'by Server: Протестировано (withReactiveChat:experimentalService)',
            [
              `Версия ${incData.app.name}@${incData.app.version} поддерживается`,
              `Подключенные к каналу ${getChannelName(incData.room)} сокеты получили оповещение EXPERIMENTAL_METRIX_PONG_OK`,
              'Лог НЕ добавлен в реестр',
              `Сокет ${socket.id} добавлен в комнату ${getChannelName(incData.room)} (в комнате ${socketsInRoomLen} сокетов)`,
            ].map((msg, i) => `${i + 1}. ${msg}`).join('; ')
          ].join(' <- '),
          ok: true,
        })
      }
      else throw new Error(e.reason || 'ERR (no reason)')
    })
    .catch((err) => {
      // io.to(socket.id).emit(NEvent.ServerOutgoing.DONT_RECONNECT, {
      //   socketId: socket.id,
      //   message: err?.reason || 'ERR',
      //   yourData: incData,
      //   _info: err?._info,
      // })
      if (typeof cb === 'function') cb({ ok: false, message: `by Server: Dont reconnect. Reason: ${err?.reason || 'No reason'}` })
      setTimeout(() => {
        socket.conn.close()
      }, 1000)
    })
}
