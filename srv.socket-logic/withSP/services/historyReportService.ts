import { NEvent, TGeoIpInfo } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, Logger, mws, state, geoHelper } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

const logger = new Logger({ counterLimit: 999 })

export const historyReportService = ({
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
  let googleSheetRowNumber: number | undefined
  mws.checkAppVersion({ data: incData })
    .then(async (e) => {
      // console.log('-- EV LOG:historyReportService')
      // console.log(e)
      // console.log(incData)
      // console.log('-- /EV')

      if (!!ip) logger.add({ message: `[IP] ${ip}` })
      if (!!geoip) logger.add({ message: `[geoip exp] ${geoHelper.getGeoipText(geoip)}` })

      if (!!e.reason) logger.add({ message: `[Client app version validation result] ok: ${String(e.ok)}${!!e.reason ? `; ${e.reason}` : ''}` })
      
      if (e.ok) {
        const validated = getIsCorrectFormat(incData)
        logger.add({ message: `[Inc data validation result] ok: ${String(validated.ok)}${!!validated.reason ? `; ${validated.reason}` : ''}` })

        // -- NOTE: Report to Google Sheets
        const ts = new Date().getTime()
        try {
          const modifiedReport = { ...incData }
          if (!!ip) modifiedReport._ip = ip
          if (!!geoip) modifiedReport._geoip = geoip
          if (!!userAgent) modifiedReport._userAgent = userAgent
          if (!!clientReferer) modifiedReport._clientReferer = clientReferer

          const addToReestrResult = await state.addReportToReestr({ roomId: incData.room, report: modifiedReport })
          logger.add({ message: `[Add data to reestr result] isOk: ${String(addToReestrResult.isOk)}${!!addToReestrResult.message ? `; ${addToReestrResult.message}` : ''}` })
          
          if (addToReestrResult.isOk) io
            .in(getChannelName(incData.room))
            .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
              message: 'New report',
              report: modifiedReport,
            })
          else throw new Error(addToReestrResult.message || 'No message')
          
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
                clientReferer,
                isObviouslyBig: true,
                geoip,
              },
            )

            logger.add({
              message: `[Result of sending to /express-helper/sp/report/v2/offline-tradein/mtsmain2024/send] isOk: ${String(result?.isOk)}${!!result?.message ? `; ${result.message}` : ''}`,
            })

            if (!result?.isOk) {
              logger.add({ message: '[Result] Cant save data to Google Sheets (server cache only)' })
              const ts = new Date().getTime()
              const tgNotifResult = await universalHttpClient.post(
                'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
                {
                  resultId: ts,

                  // NOTE: Den Pol
                  // chat_id: 432590698,

                  // NOTE: SP Report group (Offline Trade-In)
                  chat_id: -1002189284187,
                  // message_thread_id: 1,
                  // message_thread_id: 2,

                  ts,
                  eventCode: 'aux_service',
                  header: 'SP | History report WARN',
                  about: `🚫 ${incData.appVersion} report -> withSP mw -> historyReportService -> e-helper: API ERR`,
                  targetMD: [
                    'Cant send to Google Sheets:',
                    `${result.message || 'No message'}`,
                    '',
                    `\`\`\`\nIP: ${ip || 'No'}\nIMEI: ${incData.imei || 'No'}\nClient referer: ${clientReferer || 'No'}\`\`\``,
                    '',
                    'Comment:',
                    !!incData.stepDetails?.comment
                      ? `\`\`\`\n${incData.stepDetails?.comment}\`\`\``
                      : '\`(no incData.stepDetails?.comment)\`',
                  ].join('\n'),
                },
              )
              logger.add({ message: `[Send err TG notif] isOk: ${String(tgNotifResult?.isOk)}${!!tgNotifResult?.message ? `; ${tgNotifResult.message}` : ''}` })
              const msgForClient = 'Сомнительно, но Ok'
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
                _message: logger.logsAsSingleLineText,
                message: msgForClient,
                result,
                yourData: incData,
              })
              logger.add({ message: `[Final msg for client] ${msgForClient}` })
            } else {
              if (!!result?.response?.id) googleSheetRowNumber = result.response.id
              logger.add({ message: `[Result] Data saved to Google Sheets (${result.response?.id || 'No response.id'})` })
              const uiMsg = result.response?.id ? `Ok #${result.response.id}` : 'Ok'
              if (typeof cb === 'function') cb({ message: uiMsg, ok: true })
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK, {
                _message: logger.logsAsSingleLineText,
                message: uiMsg,
                result,
              })
            }
          }
          else throw new Error(validated.reason || 'No reason')
        } catch (err: any) {
          const message = `Event handling err. Reason: ${err.message || 'No err.message'}`
          if (typeof cb === 'function') cb({ message, ok: false })
          io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
            message,
            _message: logger.logsAsSingleLineText,
            yourData: incData,
          })
          universalHttpClient.post(
            'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
            {
              resultId: ts,
              
              // NOTE: Den Pol
              // chat_id: 432590698,

              // NOTE: SP Report group (Offline Trade-In)
              chat_id: -1002189284187,
              // message_thread_id: 1,
              // message_thread_id: 2,

              ts,
              eventCode: 'aux_service',
              header: 'SP | History report ERR',
              about: `⛔ ${incData.appVersion} report -> withSP mw -> historyReportService ERR`,
              targetMD: [
                message,
                'Не все пошло по плану. Скорее всего, решение вопроса все еще в кэше сервера',
                '',
                `\`\`\`\nIP: ${ip || 'No'}\nIMEI: ${incData.imei || 'No'}\nClient referer: ${clientReferer || 'No'}\`\`\``,
              ].join('\n'),
            },
          )
        } finally {
          setTimeout(() => {
            universalHttpClient
              .post(
                'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
                {
                  resultId: ts,
                  
                  // NOTE: Den Pol
                  // chat_id: 432590698,

                  // NOTE: SP Report group (Offline Trade-In)
                  chat_id: -1002189284187,
                  // message_thread_id: 1,
                  // message_thread_id: 2,

                  ts,
                  eventCode: 'aux_service',
                  header: `SP | ${!!googleSheetRowNumber ? `#report${googleSheetRowNumber} log details` : 'Report log details'}`,
                  // about: 'Additional debug',
                  targetMD: [
                    'Last report log:',
                    `\`\`\`\n${logger.logsAsMultilineText}\`\`\``,
                    '',
                    'Comment:',
                    !!incData.stepDetails?.comment
                      ? `\`\`\`\n${incData.stepDetails?.comment}\`\`\``
                      : '\`(no incData.stepDetails?.comment)\`',
                  ].join('\n'),
                },
              ).finally(() => {
                logger.clear()
              })
            }, 1000)
        }
        // --
      }
      else throw new Error(e.reason || 'ERR (no reason)')
    })
    .catch((err) => {
      if (typeof cb === 'function') cb({ ok: false, message: `Dont reconnect. Reason: ${err?.reason || err?.message || 'No message'}` })
      io.to(socket.id).emit(NEvent.ServerOutgoing.DONT_RECONNECT, {
        socketId: socket.id,
        message: err?.reason || err?.message || 'No reason',
        yourData: incData,
        _info: err?._info,
      })
      setTimeout(() => {
        socket.conn.close()
      }, 1000)
    })
}
