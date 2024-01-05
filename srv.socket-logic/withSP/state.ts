import {
  proxy,
  // subscribe,
  // snapshot,
} from 'valtio/vanilla'
// NOTE: See also https://valtio.pmnd.rs/docs/introduction/getting-started
import { NEvent } from './types'

type TRoomId = string
type TState = {
  roomsReestr: Map<TRoomId, NEvent.TReport[]>;
}
type TOperationResult = Promise<{
  isOk: boolean;
  message?: string;
  instance: Singleton;
}>

const roomItemsLimit = 250

export class Singleton {
  private static instance: Singleton
  public state: TState

  private constructor() {
    this.state = proxy({
      roomsReestr: new Map(),
    })
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()

    return Singleton.instance;
  }

  public addReportToReestr ({ roomId, report }: {
    roomId: string;
    report: NEvent.TReport;
  }): TOperationResult {
    // console.log('- incSocketInReestr called...')

    // Step 1: Socket reestr
    const roomReports = this.state.roomsReestr.get(roomId)
    if (!!roomReports) {
      if (roomReports.length < roomItemsLimit) {
        this.state.roomsReestr.set(roomId, [report, ...roomReports])
      } else {
        const newArr = [report, ...roomReports.slice(0, -1)]
        this.state.roomsReestr.set(roomId, newArr)
      }
    }
    else this.state.roomsReestr.set(roomId, [report])

    return Promise.resolve({ isOk: true, instance: this, message: 'Added to reestr' })
  }
  public removeRoomFromReestr ({ roomId }: { roomId: string }): TOperationResult {
    // const roomList = this.state.roomsReestr.get(roomId)

    // Step 1: Socket reestr
    this.state.roomsReestr.delete(roomId)

    return Promise.resolve({ isOk: true, instance: this, message: 'Removed from reestr' })
  }
  public getStateInfo (roomId: string): Promise<{
    isOk: boolean;
    message?: string;
    items: NEvent.TReport[];
  }> {
    const items = this.state.roomsReestr.get(roomId)
    if (!!items) return Promise.resolve({ isOk: true, items })
    else return Promise.reject({ isOk: true, message: 'Not found', items: [] })
  }
}

export const state = Singleton.getInstance()
