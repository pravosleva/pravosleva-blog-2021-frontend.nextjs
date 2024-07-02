import { NEvent, TGeoIpInfo } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, mws, state } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

export const standartReportService = ({
  ip,
  geoip,
  io,
  socket,
  clientUserAgent: userAgent,
  clientReferer,
}: {
  ip?: string;
  geoip?: TGeoIpInfo | null;
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
        const modifiedReport = { ...incData }
        if (!!ip) modifiedReport._ip = ip
        if (!!geoip) modifiedReport._geoip = geoip
        if (!!userAgent) modifiedReport._userAgent = userAgent
        if (!!clientReferer) modifiedReport._clientReferer = clientReferer
        state.addReportToReestr({ roomId: incData.room, report: modifiedReport })
        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
            message: 'New report',
            report: modifiedReport,
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
                geoip,
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
