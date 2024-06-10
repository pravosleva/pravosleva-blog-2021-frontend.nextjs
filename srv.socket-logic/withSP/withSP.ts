import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'
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
      '3.0.9-beta',
      '3.0.10-beta',
      '3.0.11-beta',
      '3.0.11',
      '3.0.12-beta',
      '3.0.12',
      '3.0.13-beta',
      '3.0.13',
      '4.0.6',
      '4.0.6-fix',
      '4.0.7-beta',
      '4.0.7',
      '4.0.7-fix',
      '4.0.8-beta',
      '4.0.8',
      '4.0.8-fix',
      '4.0.9-beta',
      '4.0.9',
      '4.0.9-fix',
      '4.0.10-beta',
      '4.0.10',
      '4.0.10-fix',
      '4.0.11-beta',
      '4.0.11',
      '4.0.11-fix',
      '4.0.12-beta',
      '4.0.12',
      '4.0.12-fix',
      '4.0.13-beta',
      '4.0.13',
      '4.0.13-fix',
      '4.0.14-beta',
      '4.0.14',
      '4.0.14-fix',
      '4.0.15-beta',
      '4.0.15',
      '4.0.15-fix',
      '4.0.16-beta',
      '4.0.16',
      '4.0.16-fix',
      '4.0.17-beta',
      '4.0.17',
      '4.0.17-fix',
      '4.0.18-beta',
      '4.0.18',
      '4.0.18-fix',
      '4.0.19-beta',
      '4.0.19',
      '4.0.19-fix',
      '4.0.20-beta',
      '4.0.20',
      '4.0.20-fix',
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
    let ip: string | undefined
    
    // -- MOTE: Get IP adress exp
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
        // 'x-forwarded-for': {
        //   converter: ({ val }) => typeof val === 'string' ? val.split(",")[0] : undefined,
        // },
        // 'cf-connecting-ip': {
        //   converter: ({ val }) => val,
        // },
        // 'fastly-client-ip': {
        //   converter: ({ val }) => val,
        // },
      }
      for (const header in possibleHeaders) {
        if (
          !!socket.handshake.headers?.[header]
          && typeof socket.handshake.headers?.[header] === 'string'
        ) {
          ip = possibleHeaders[header].converter({ val: socket.handshake.headers?.[header] })
          if (!!ip) break;
        }
      }
      // if (!ip && !!socket.conn.remoteAddress) {
      //   // ip = socket.conn.remoteAddress
      //   // ip = socket.manager.handshaken[socket.id].address
      // }
    } catch (err) {
      // NOTE: Have no idea yet...
      console.log(err)
    }
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
            // -- NOTE: Report to Google Sheets
            try {
              const getIsCorrectFormat = (val: any): { ok: boolean; reason?: string } => {
                const result: { ok: boolean; reason?: string } = {
                  ok: true,
                }
                switch (true) {
                  case !val:
                    result.ok = false
                    result.reason = 'Should not be empty'
                    break
                  case !val.appVersion:
                    result.ok = false
                    result.reason = 'appVersion not be empty'
                    break
                  case !val.room:
                    result.ok = false
                    result.reason = 'room is required'
                    break
                  case !val.metrixEventType:
                    result.ok = false
                    result.reason = 'metrixEventType is required'
                    break
                  case !val.stateValue:
                    result.ok = false
                    result.reason = 'stateValue is required'
                    break
                  case !val.reportType:
                    result.ok = false
                    result.reason = 'reportType is required'
                    break
                  default: break
                }
                return result
              }
              const validated = getIsCorrectFormat(incData)
              if (validated.ok) universalHttpClient.post(
                '/express-helper/sp/report/v2/offline-tradein/mtsmain2024/send',
                {
                  eventCode: 'common',
                  appVersion: incData.appVersion,
                  room: incData.room,
                  metrixEventType: incData.metrixEventType,
                  stateValue: incData.stateValue,
                  reportType: incData.reportType,
                  stepDetails: incData.stepDetails || undefined,
                  imei: incData.imei,
                  ts: incData.ts,
                  tradeinId: incData.tradeinId,
                  uniquePageLoadKey: incData.uniquePageLoadKey,
                  uniqueUserDataLoadKey: incData.uniqueUserDataLoadKey,
                  gitSHA1: incData.gitSHA1,
                  specialClientKey: incData.specialClientKey,
                  ip,
                },
              )
              else throw new Error(validated.reason || 'No reason')
            } catch (err: any) {
              const ts = new Date().getTime()
              universalHttpClient.post(
                'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
                {
                  resultId: ts,
                  chat_id: 432590698, // NOTE: Den Pol
                  ts,
                  eventCode: 'aux_service',
                  about: `⛔ withSP mw Errored (${incData.appVersion})`,
                  targetMD: `Не удалось отправить event: ${err.message || 'NO ERR'}`,
                },
              )
            }
            // --
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
          setTimeout(() => {
            socket.conn.close()
          }, 1000)
        })
    })

    // socket.on('disconnect', (reason: TDisconnectReason) => {})
  })
}
