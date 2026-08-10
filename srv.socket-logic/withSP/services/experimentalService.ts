import { NEvent, TGeoIpInfo } from '~/srv.socket-logic/withSP/types'
import {
  getChannelName, mws,
  // state,
} from '~/srv.socket-logic/withSP/utils'
import { Socket, Server } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const experimentalService = ({
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
}) => (incData: NEvent.TReport, cb?: ({ message, ok }: { message: string, ok: boolean, report: NEvent.TReport }) => void) => {
  mws.checkAppVersion({ data: incData })
    .then((e) => {
      if (e.ok) {
        const modifiedReport = { ...incData }
        if (!!ip) modifiedReport._ip = ip
        if (!!geoip) modifiedReport._geoip = geoip
        if (!!userAgent) modifiedReport._userAgent = userAgent
        if (!!clientReferer) modifiedReport._clientReferer = clientReferer
        // state.addReportToReestr({ roomId: incData.room, report: modifiedReport })
        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.EXPERIMENTAL_METRIX_PONG_OK, {
            message: 'Experimental PONG (OK)',
            report: modifiedReport,
          })
        if (typeof cb === 'function') cb({
          message: [
            'by Server: Протестировано',
            [
              `Версия ${incData.app.name}@${incData.app.version} поддерживается`,
              `Подключенные к каналу ${getChannelName(incData.room)} сокеты получили оповещение EXPERIMENTAL_METRIX_PONG_OK`,
              'Лог НЕ добавлен в реестр',
            ].map((msg, i) => `${i + 1}. ${msg}`).join('; ')
          ].join(' <- '),
          ok: true,
          report: modifiedReport,
        })
      }
      else throw new Error(e.reason || 'ERR (no reason)')
    })
    .catch((err) => {
      io.to(socket.id).emit(NEvent.ServerOutgoing.DONT_RECONNECT, {
        socketId: socket.id,
        message: err?.reason || 'ERR',
        yourData: incData,
        _info: err?._info,
      })
      if (typeof cb === 'function') cb({
        ok: false,
        message: `by Server: Dont reconnect. Reason: ${err?.reason || 'No reason'}`,
        report: incData,
      })
      setTimeout(() => {
        socket.conn.close()
      }, 1000)
    })
}
