import geoip from 'fast-geoip'
import clsx from 'clsx'
import { TGeoIpInfo } from '~/srv.socket-logic/withSP/types'

class Singleton {
  private static instance: Singleton
  // public state: TState

  private constructor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()

    return Singleton.instance;
  }

  public async getGeoip(ip: string): Promise<TGeoIpInfo | null> {
    return await geoip.lookup(ip)
  }
  public getGeoipText(geoipData: TGeoIpInfo): string {
    if (!!geoipData) return clsx([geoipData.country, geoipData.region, geoipData.city])
    else return ''
  }
}

export const geoHelper = Singleton.getInstance()
