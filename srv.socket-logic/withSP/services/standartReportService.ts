import { NEvent } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, mws, state } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const standartReportService = ({
  ip,
  io,
  socket,
  clientUserAgent: userAgent,
  clientReferer,
}: {
  ip?: string;
  io: Socket;
  socket: Socket;
  clientUserAgent?: string;
  clientReferer?: string;
}) => (incData: NEvent.TReport, cb?: ({ message, ok }: { message: string, ok: boolean }) => void) => {
  const bigReportStateValues = [
    'tradein-final',
  ]
  mws.checkAppVersion({ data: incData })
    .then((e) => {
      if (e.ok) {
        state.addReportToReestr({ roomId: incData.room, report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer } })
        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
            message: 'New report',
            report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer },
          })
        // -- NOTE: Report to Google Sheets
        try {
          const validated = getIsCorrectFormat(incData)
          if (validated.ok) {
            universalHttpClient.post(
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
                userAgent,
                clientReferer,
                isObviouslyBig: bigReportStateValues.includes(incData.stateValue),
              },
            )
            if (typeof cb === 'function') cb({ message: 'Ok: Отправлено. Результат не проверял', ok: true })
          }
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
              about: `⛔ ${incData.appVersion} (mx) -> withSP: ERR`,
              targetMD: [
                `Не удалось отправить event: ${err.message || 'NO ERR'}`,
                'Должно все еще быть в кэше сервера',
                '',
                `\`IP: ${ip || 'No'}\``,
                `\`IMEI: ${incData.imei || 'No'}\``,
                `\`Client referer: ${clientReferer || 'No'}\``,
              ].join('\n'),
            },
          )
          if (typeof cb === 'function') cb({ message: err?.message || 'No err.message', ok: false })
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
      if (typeof cb === 'function') cb({ ok: false, message: `Dont reconnect. Reason: ${err?.reason || 'No reason'}` })
      setTimeout(() => {
        socket.conn.close()
      }, 1000)
    })
}
