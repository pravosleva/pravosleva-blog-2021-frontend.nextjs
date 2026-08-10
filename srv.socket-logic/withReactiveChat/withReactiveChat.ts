import { Socket, Server } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { NEvent, TGeoIpInfo } from './types'
// import {
//   getChannelName,
//   // getIsCorrectFormat,
//   mws,
//   // geoHelper,
//   // state,
// } from './utils'
import {
  chatMessageService,
  joinService,
} from './services'

export const withReactiveChat = (io: Server) => {
  io.on('connection', async function (socket: Socket) {
    let ip: string | undefined
    let geoip: TGeoIpInfo | null | undefined
    let userAgent: string | undefined
    let clientReferer: string | undefined

    // console.log('- EV LOG: socket connection: socket.handshake.headers')
    // console.log(socket.handshake.headers)
    // console.log('- /EV')

    // -- MOTE: 1. Get IP adress exp
    // const ip = socket.handshake.address // NOTE: Doesnt work
    try {
      if (typeof socket.handshake.headers.referer === 'string')
        clientReferer = socket.handshake.headers.referer
    } catch (err) {
      // NOTE: Have no idea yet...
      console.log(err)
    }

    // NOTE: 2. Get user-agent from request
    try { userAgent = socket.handshake.headers?.['user-agent'] } catch (err) { console.log(err) }
    // --

    // mws.checkAppVersion({ data: incData })

    // -- NOTE: Experimental
    socket.on(
      NEvent.ServerIncoming.RC_PING,
      joinService({
        ip,
        geoip,
        io,
        socket,
        clientUserAgent: userAgent,
        clientReferer,
      }),
    )
    socket.on(
      NEvent.ServerIncoming.RC_CHAT_MESSAGE,
      chatMessageService({
        io,
        socket,
      }),
    )

    // NOTE: Это для сигналов WebRTC
    socket.on(
      NEvent.ServerIncoming.RC_WEBRTC_SIGNAL,
      (data) => {
        // Отправляем сообщение всем, КРОМЕ отправителя
        socket.broadcast.emit('universal:reactive-chat:wertc-exp:signal', data)
      }
    )
    socket.on('disconnect', () => {
      socket.broadcast.emit('universal:reactive-chat:wertc-exp:signal', { type: 'hangup' })
    })
    // --
  })
}
