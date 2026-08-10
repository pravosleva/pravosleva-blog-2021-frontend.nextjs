import { Socket, Server } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { NEvent, TGeoIpInfo } from './types'
// import {
//   getChannelName, getIsCorrectFormat, mws,
//   // geoHelper,
//   // state,
// } from './utils'
import {
  experimentalService,
  // historyReportService,
  // standartReportService,
} from './services'

export const withExperimental = (io: Server) => {
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
      // const possibleHeadersForHaveIP: {
      //   [key: string]: {
      //     converter: ({ val }: { val: any; }) => string | undefined;
      //   };
      // } = {
      //   'x-real-ip': {
      //     converter: ({ val }) => val,
      //   },
      // }
      // for (const header in possibleHeadersForHaveIP) {
      //   if (
      //     !!socket.handshake.headers?.[header]
      //     && typeof socket.handshake.headers?.[header] === 'string'
      //   ) {
      //     ip = possibleHeadersForHaveIP[header].converter({ val: socket.handshake.headers?.[header] })
      //     if (!!ip) {
      //       geoip = await geoHelper.getGeoip(ip)
      //       break
      //     }
      //   }
      // }

      if (typeof socket.handshake.headers.referer === 'string')
        clientReferer = socket.handshake.headers.referer
    } catch (err) {
      // NOTE: Have no idea yet...
      console.log(err)
    }

    // NOTE: 2. Get user-agent from request
    try { userAgent = socket.handshake.headers?.['user-agent'] } catch (err) { console.log(err) }
    // --

    // socket.prependAny((eventName, ...args) => {
    //   console.log('-- prependAny LOG')
    //   console.log(eventName)
    //   console.log(args)
    //   console.log('-- /prependAny LOG')
    // })

    // -- NOTE: Experimental
    socket.on(
      NEvent.ServerIncoming.EXPERIMENTAL_METRIX_PING,
      experimentalService({
        ip,
        geoip,
        io,
        socket,
        clientUserAgent: userAgent,
        clientReferer,
      }),
    )
    // --

    // socket.onAny((eventName, ...args) => {
    //   console.log('-- onAny LOG')
    //   console.log(eventName)
    //   console.log(args)
    //   console.log('-- /onAny LOG')
    // })

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
