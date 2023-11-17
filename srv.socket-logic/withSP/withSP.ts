import {
  Socket,
  // DisconnectReason as TDisconnectReason,
} from 'socket.io'
// import { Looper, NLooper } from '~/srv.utils/Looper'
// import { state } from './state'
// import { getRandomElement } from '~/srv.utils/tools-array/getRandomElement'
import { NEvent } from './types'

// const getChannelName = (s: string): string => `lab-channel:${s}`

const mws = {
  checkAppVersion({ data }: {
    data: {
      appVersion: string;
      metrixEventType: string;
      stateValue: string;
      [key: string]: any;
    } | undefined;
  }): Promise<{ ok: boolean; reason?: string; _info?: any }> {
    const appVersionSupports = [
      '3.0.4-beta',
      '3.0.5-beta',
    ]
    if (!data?.appVersion || !appVersionSupports.includes(data.appVersion))
      return Promise.reject({
        ok: false,
        reason: 'Your appVersion not supported',
        _info: {
          supportedVersions: appVersionSupports
        },
      })

    return Promise.resolve({ ok: true })
  }
}

export const withLSP = (io: Socket) => {
  io.on('connection', function (socket: Socket) {

    socket.on(NEvent.ServerIncoming.SP_MX_EV, (data: any) => {
    
      mws.checkAppVersion({ data })
        .catch((err) => {
          io.to(socket.id).emit(NEvent.ServerOutgoing.DONT_RECONNECT, {
            socketId: socket.id,
            message: err?.reason || 'ERR',
            yourData: data,
            _info: err._info,
          })
          setTimeout(() => {
            socket.conn.close()
          }, 1000)
        })

      // io.in(getChannelName(room)).emit(NEvent.EServerOutgoing.AUDITLIST_REPLACE, { room, audits });
      // -- NOTE: For each incoming event (for testing)
      io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_EV, {
        socketId: socket.id,
        message: `Hello from backend / Test sp-mx event: ${NEvent.ServerOutgoing.SP_MX_EV}`,
        yourData: data,
      })
      // --
    })

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
