import { Socket } from 'socket.io'
// import { universalHttpClient } from '~/srv.utils/universalHttpClient'
import { NEvent } from './types'
import {
  // getChannelName, getIsCorrectFormat, mws,
  state,
} from './utils'
import { historyReportService, standartReportService } from './services'

export const withSP = (io: Socket) => {
  io.on('connection', function (socket: Socket) {
    let ip: string | undefined
    let userAgent: string | undefined
    
    // -- MOTE: 1. Get IP adress exp
    // const ip = socket.handshake.address // NOTE: Doesnt work
    try {
      const possibleHeaders: {
        [key: string]: {
          converter: ({ val }: { val: any; }) => string | undefined;
        };
      } = {
        'x-real-ip': {
          converter: ({ val }) => val,
        },
        // 'x-forwarded-for': { converter: ({ val }) => typeof val === 'string' ? val.split(",")[0] : undefined },
        // 'cf-connecting-ip': { converter: ({ val }) => val },
        // 'fastly-client-ip': { converter: ({ val }) => val },
      }
      for (const header in possibleHeaders) {
        if (
          !!socket.handshake.headers?.[header]
          && typeof socket.handshake.headers?.[header] === 'string'
        ) {
          ip = possibleHeaders[header].converter({ val: socket.handshake.headers?.[header] })
          if (!!ip) break
        }
      }
    } catch (err) {
      // NOTE: Have no idea yet...
      console.log(err)
    }

    // NOTE: 2. Get user-agent from request
    try { userAgent = socket.handshake.headers?.['user-agent'] } catch (err) { console.log(err) }
    // --

    if (!!socket.handshake.query.roomId && typeof socket.handshake.query.roomId === 'string') {
      state.getStateInfo(socket.handshake.query.roomId)
        .then(({ isOk, message, items }) => {
          if (isOk) io
            .to(socket.id)
            .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPLACE_REPORTS, { items })

          if (!!message) io
            .to(socket.id)
            .emit(NEvent.ServerOutgoing.SP_TRADEIN_COMMON_MESSAGE, {
              message,
              notistackProps: {
                variant: isOk ? 'success' : 'error',
                autoHideDuration: 15000,
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
              },
            })
        })
        .catch((err: any) => {
          if (!!err?.message) io.to(socket.id).emit(NEvent.ServerOutgoing.SP_TRADEIN_COMMON_MESSAGE, {
            message: err.message,
            notistackProps: {
              variant: 'error',
              autoHideDuration: 30000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            },
          })
        })
    }

    socket.on(NEvent.ServerIncoming.SP_MX_EV, standartReportService({
      ip,
      io,
      socket,
      clientUserAgent: userAgent,
    }))

    socket.on(NEvent.ServerIncoming._SP_HISTORY_REPORT_EV_DEPRECATED, historyReportService({
      ip,
      io,
      socket,
      clientUserAgent: userAgent,
    }))

    socket.on(NEvent.ServerIncoming.SP_HISTORY_REPORT_EV, historyReportService({
      ip,
      io,
      socket,
      clientUserAgent: userAgent,
    }))

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
