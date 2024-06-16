import { NEvent } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, mws, state } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

const getArrayFromSet = (set: Set<string>): string[] => Array.from(set)
const getLogsAsMultilineText = (set: Set<string>): string => getArrayFromSet(set).map((msg, _i) => `• \`${msg}\``).join('\n')
const getLogsAsSingleLineText = (set: Set<string>): string => getArrayFromSet(set).join(' // ')

export const historyReportService = ({
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
  let googleSheetRowNumber: number | undefined
  mws.checkAppVersion({ data: incData })
    .then(async (e) => {
      console.log('-- EV LOG:historyReportService')
      console.log(e)
      console.log(incData)
      console.log('-- /EV')

      // const resultMsgs = []
      const log = new Set<string>()

      if (!!e.reason) log.add(`[Version validation result] ok: ${String(e.ok)}; reason: ${e.reason || 'Empty'})`)
      
      if (e.ok) {
        state.addReportToReestr({ roomId: incData.room, report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer } })
        io
          .in(getChannelName(incData.room))
          .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
            message: 'New report',
            report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer },
          })
        // -- NOTE: Report to Google Sheets
        const ts = new Date().getTime()
        try {
          const validated = getIsCorrectFormat(incData)
          log.add(`[Inc data validation result] ok: ${String(validated.ok)}; reason: ${validated.reason || 'Empty'})`)
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
              },
            )

            log.add(`[Result of sending to /express-helper/sp/report/v2/offline-tradein/mtsmain2024/send] isOk: ${String(result?.isOk)}; message: ${result.message || 'Empty'})`)

            if (!result?.isOk) {
              log.add('[Cur result] Cant save data to Google Sheets (cache only)')
              const ts = new Date().getTime()
              const tgNotifResult = await universalHttpClient.post(
                'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
                {
                  resultId: ts,
                  chat_id: 432590698, // NOTE: Den Pol
                  ts,
                  eventCode: 'aux_service',
                  about: `⛔ ${incData.appVersion} (rep) -> withSP -> historyReportService -> e-helper: API ERR`,
                  targetMD: [
                    'Cant send to Google Sheets:',
                    `${result.message || 'No message'}`,
                    '',
                    `\`IP: ${ip || 'No'}\``,
                    `\`IMEI: ${incData.imei || 'No'}\``,
                    `\`Client referer: ${clientReferer || 'No'}\``,
                    '',
                    !!incData.stepDetails?.commentByUser
                      ? `\`\`\`\n${incData.stepDetails?.commentByUser}\`\`\``
                      : '(no comment)',
                    // '',
                    // 'Log:',
                    // `\`\`\`\n${resultMsgs.map((msg, i) => `${i + 1}. ${msg}`).join('\n')}\`\`\``,
                  ].join('\n'),
                },
              )
              log.add(`[Send err tg notif] isOk: ${String(tgNotifResult?.isOk)}; message: ${tgNotifResult?.message || 'Empty'}`)
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
                _message: getLogsAsSingleLineText(log),
                message: 'Сомнительно, но Ok',
                result,
                yourData: incData,
              })
              log.add('[Final msg for client] Сомнительно, но Ok')
            } else {
              if (!!result?.response?.id) googleSheetRowNumber = result.response.id
              log.add('[Cur result] Data saved to Google Sheets')
              const uiMsg = result.response.id ? `Ok #${result.response.id}` : 'Ok'
              if (typeof cb === 'function') cb({ message: uiMsg, ok: true })
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK, {
                _message: getLogsAsSingleLineText(log),
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
            _message: getLogsAsSingleLineText(log),
            yourData: incData,
          })
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
                'Не все пошло по плану. Скорее всего, решение вопроса все еще в кэше сервера',
                '',
                `\`IP: ${ip || 'No'}\``,
                `\`IMEI: ${incData.imei || 'No'}\``,
                `\`Client referer: ${clientReferer || 'No'}\``,
                // '',
                // 'Log:',
                // `\`\`\`\n${resultMsgs.map((msg, _i) => `• ${msg}`).join('\n')}\`\`\``,
              ].join('\n'),
            },
          )
        } finally {
          universalHttpClient.post(
            'http://pravosleva.pro/tg-bot-2021/notify/kanban-2021/reminder/send',
            {
              resultId: ts,
              chat_id: 432590698, // NOTE: Den Pol
              ts,
              eventCode: 'aux_service',
              about: !!googleSheetRowNumber ? `#report${googleSheetRowNumber} Details` : 'Experience',
              targetMD: [
                'Last report log:',
                getLogsAsMultilineText(log),
              ].join('\n'),
            },
          ).finally(() => {
            log.clear()
          })
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
