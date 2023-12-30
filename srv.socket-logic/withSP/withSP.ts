import { Socket } from 'socket.io'
import { NEvent } from './types'
import { state } from './state'

const getChannelName = (s: string): string => `lab-channel:${s}`

const mws = {
  checkAppVersion({ data }: {
    data: NEvent.TReport | undefined;
  }): Promise<{
    ok: boolean;
    reason?: string;
    _info?: any;
  }> {
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

export const withSP = (io: Socket) => {
  io.on('connection', function (socket: Socket) {
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
              autoHideDuration: 25000,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
              },
            },
          })
        })
    }

    socket.on(NEvent.ServerIncoming.SP_MX_EV, (incData: NEvent.TReport) => {
      mws.checkAppVersion({ data: incData })
        .then((e) => {
          if (e.ok) {
            state.addReportToReestr({ roomId: incData.room, report: incData })
            io
              .in(getChannelName(incData.room))
              .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
                message: 'New report',
                report: incData,
              })
          }
          else throw new Error(e.reason || 'ERR (no reason)')
        })
        .catch((err) => {
          io.to(socket.id).emit(NEvent.ServerOutgoing.DONT_RECONNECT, {
            socketId: socket.id,
            message: err?.reason || 'ERR',
            yourData: incData,
            _info: err._info,
          })
          setTimeout(() => {
            socket.conn.close()
          }, 1000)
        })
    })

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
