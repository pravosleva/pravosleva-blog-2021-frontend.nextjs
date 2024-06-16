import { NEvent } from '~/srv.socket-logic/withSP/types'
import { getChannelName, getIsCorrectFormat, mws, state } from '~/srv.socket-logic/withSP/utils'
import { Socket } from 'socket.io'
import { universalHttpClient } from '~/srv.utils/universalHttpClient'

class Logger {
  private logs: Set<string>
  private globalCounter: number
  private counterLimit: number
  constructor({ counterLimit }: { counterLimit: number }) {
    this.counterLimit = counterLimit
    this.globalCounter = 0
    this.logs = new Set<string>()
  }
  add({ message }: { message: string }) {
    if (this.counterLimit > this.globalCounter) this.globalCounter += 1
    else this.globalCounter = 1

    this.logs.add(`${this.getZero2(this.globalCounter)}. ${message}`)
  }
  clear() {
    this.logs.clear()
  }
  get msgs(): string[] {
    return Array.from(this.logs)
  }
  get logsAsSingleLineText(): string {
    return this.msgs.join(' // ')
  }
  get logsAsMultilineText(): string {
    return this.msgs.join('\n')
  }

  getZero(n: number): string { return n < 10 ? `0${n}` : `${n}` }
  getZero2(n: number): string { return n < 10 ? `00${n}` : n < 100 ? `0${n}` : `${n}` }
}

const logger = new Logger({ counterLimit: 10000 })

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

      if (!!e.reason) logger.add({ message: `[Version validation result] ok: ${String(e.ok)}${!!e.reason ? `; ${e.reason}` : ''}` })
      
      if (e.ok) {
        const validated = getIsCorrectFormat(incData)
        logger.add({ message: `[Inc data validation result] ok: ${String(validated.ok)}${!!validated.reason ? `; ${validated.reason}` : ''}` })

        // -- NOTE: Report to Google Sheets
        const ts = new Date().getTime()
        try {
          const addToReestrResult = await state.addReportToReestr({ roomId: incData.room, report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer } })
          logger.add({ message: `[Add data to reestr result] isOk: ${String(addToReestrResult.isOk)}${!!addToReestrResult.message ? `; ${addToReestrResult.message}` : ''}` })
          
          if (addToReestrResult.isOk) io
            .in(getChannelName(incData.room))
            .emit(NEvent.ServerOutgoing.SP_TRADEIN_REPORT_EV, {
              message: 'New report',
              report: { ...incData, _ip: ip, _userAgent: userAgent, _clientReferer: clientReferer },
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
              },
            )

            logger.add({
              message: `[Result of sending to /express-helper/sp/report/v2/offline-tradein/mtsmain2024/send] isOk: ${String(result?.isOk)}${!!result?.message ? `; ${result.message}` : ''}`,
            })

            if (!result?.isOk) {
              logger.add({ message: '[Cur result] Cant save data to Google Sheets (cache only)' })
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
                  about: `⛔ ${incData.appVersion} (rep) -> withSP -> historyReportService -> e-helper: API ERR`,
                  targetMD: [
                    'Cant send to Google Sheets:',
                    `${result.message || 'No message'}`,
                    '',
                    `\`\`\`\nIP: ${ip || 'No'}\nIMEI: ${incData.imei || 'No'}\nClient referer: ${clientReferer || 'No'}\`\`\``,
                    '',
                    !!incData.stepDetails?.commentByUser
                      ? `\`\`\`\n${incData.stepDetails?.commentByUser}\`\`\``
                      : '(no comment)',
                  ].join('\n'),
                },
              )
              logger.add({ message: `[Send err tg notif] isOk: ${String(tgNotifResult?.isOk)}${!!tgNotifResult?.message ? `; ${tgNotifResult.message}` : ''}` })
              io.to(socket.id).emit(NEvent.ServerOutgoing.SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR, {
                _message: logger.logsAsSingleLineText,
                message: 'Сомнительно, но Ok',
                result,
                yourData: incData,
              })
              logger.add({ message: '[Final msg for client] Сомнительно, но Ok' })
            } else {
              if (!!result?.response?.id) googleSheetRowNumber = result.response.id
              logger.add({ message: `[Cur result] Data saved to Google Sheets (${result.response?.id || 'No response.id'})` })
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
              about: `⛔ ${incData.appVersion} -> withSP: ERR`,
              targetMD: [
                message,
                'Не все пошло по плану. Скорее всего, решение вопроса все еще в кэше сервера',
                '',
                `\`\`\`\nIP: ${ip || 'No'}\nIMEI: ${incData.imei || 'No'}\nClient referer: ${clientReferer || 'No'}\`\`\``,
              ].join('\n'),
            },
          )
        } finally {
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
              about: !!googleSheetRowNumber ? `#report${googleSheetRowNumber} Details` : 'Experience',
              targetMD: [
                'Last report log:',
                `\`\`\`\n${logger.logsAsMultilineText}\`\`\``,
                '',
                !!incData.stepDetails?.commentByUser
                  ? `\`\`\`\n${incData.stepDetails?.commentByUser}\`\`\``
                  : '\`(no incData.stepDetails?.commentByUser)\`',
              ].join('\n'),
            },
          ).finally(() => {
            logger.clear()
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
