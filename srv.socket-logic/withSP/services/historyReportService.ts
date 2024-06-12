import { NEvent } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, mws, state } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const historyReportService = ({
  ip,
  io,
  socket,
  clientUserAgent: userAgent,
}: {
  ip?: string;
  io: Socket;
  socket: Socket;
  clientUserAgent?: string;
}) => (incData: NEvent.TReport) => {
  mws.checkAppVersion({ data: incData })
    .then(async (e) => {
      if (e.ok) {
        state.addReportToReestr({ roomId: incData.room, report: { ...incData, _ip: ip, _userAgent: userAgent } })
        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
            message: 'New report',
            report: { ...incData, _ip: ip, _userAgent: userAgent },
          })
        // -- NOTE: Report to Google Sheets
        try {
          const validated = getIsCorrectFormat(incData)
          if (validated.ok) {
            const result = await universalHttpClient.post(
              '/express-helper/sp/report/v2/offline-tradein/mtsmain2024/send',
              {
                eventCode: 'report-by-user:history',
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
                userAgent,
              },
            )

            if (!result?.isOk) {
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
                _message: 'Не удалось сохранить данные в Google Sheets (только в кэш)',
                message: 'Сомнительно, но Ok',
                result,
                yourData: incData,
              })

              const ts = new Date().getTime()
              universalHttpClient.post(
                'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
                {
                  resultId: ts,
                  chat_id: 432590698, // NOTE: Den Pol
                  ts,
                  eventCode: 'aux_service',
                  about: `⛔ ${incData.appVersion} -> (rep) -> withSP -> historyReportService -> e-helper: API ERR`,
                  targetMD: [
                    'Не удалось отправить event в Google Sheets:',
                    `${result.message || 'No message'}`,
                    '',
                    `\`IP: ${ip || 'No'}\``,
                    `\`IMEI: ${incData.imei || 'No'}\``,
                    '',
                    !!incData.stepDetails?.commentByUser
                      ? `\`\`\`\n${incData.stepDetails?.commentByUser}\`\`\``
                      : '(коммент не получен)',
                  ].join('\n'),
                },
              )
            } else {
              const uiMsg = result.response.id ? `Ok #${result.response.id}` : 'Ok'
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK, {
                _message: 'Данные сохранены в Google Sheets',
                message: uiMsg,
                result,
              })
            }
          }
          else throw new Error(validated.reason || 'No reason')
        } catch (err: any) {
          const message = `Не удалось нормально обработать ивент. Причина: ${err.message || 'No err.message'}`
          io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
            message,
            yourData: incData,
          })

          const ts = new Date().getTime()
          universalHttpClient.post(
            'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
            {
              resultId: ts,
              chat_id: 432590698, // NOTE: Den Pol
              ts,
              eventCode: 'aux_service',
              about: `⛔ ${incData.appVersion} -> withSP: ERR`,
              targetMD: [
                message,
                'Должно все еще быть в кэше сервера',
                '',
                `\`IP: ${ip || 'No'}\``,
                `\`IMEI: ${incData.imei || 'No'}\``,
              ].join('\n'),
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
}