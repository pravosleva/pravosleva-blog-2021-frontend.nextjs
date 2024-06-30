import geoip from 'fast-geoip'
import clsx from 'clsx'
import { TGeoIpInfo } from '~/srv.socket-logic/withSP/types'

export class Logger {
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

  public async getGeoip(ip: string): Promise<TGeoIpInfo | null> {
    return await geoip.lookup(ip)
  }
  public getGeoipText(geoipData: TGeoIpInfo): string {
    if (!!geoipData) return clsx([geoipData.country, geoipData.region, geoipData.city])
    else return ''
  }
}
