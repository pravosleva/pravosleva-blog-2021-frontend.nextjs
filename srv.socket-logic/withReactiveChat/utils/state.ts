import { proxy } from 'valtio/vanilla'
// NOTE: See also https://valtio.pmnd.rs/docs/introduction/getting-started
import { NEvent } from '~/srv.socket-logic/withReactiveChat/types'

type TMessage = Pick<NEvent.TReport, 'ts' | 'room' | 'reportType' | 'specialData'>
type TRoomId = string
type TState = {
  roomsReestr: Map<TRoomId, TMessage[]>;
}
type TOperationResult = Promise<{
  ok: boolean;
  message?: string;
  instance: Singleton;
}>

const roomItemsLimit = 1000

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

  public addMessage({ channelName, message }: {
    channelName: string;
    message: TMessage;
  }): TOperationResult {
    console.log('- state:addMessage called...')
    console.log(message)
    console.log('-')

    // Step 1: Socket reestr
    const roomReports = this.state.roomsReestr.get(channelName)
    if (!!roomReports) {
      if (roomReports.length < roomItemsLimit) {
        this.state.roomsReestr.set(channelName, [...roomReports, message])
      } else {
        const newArr = [...roomReports.slice(1), message]
        this.state.roomsReestr.set(channelName, newArr)
      }
    }
    else this.state.roomsReestr.set(channelName, [message])

    return Promise.resolve({ ok: true, instance: this, message: 'Added to reestr' })
  }
  // public removeRoomFromReestr({ channelName }: { channelName: string }): TOperationResult {
  //   // const roomList = this.state.roomsReestr.get(channelName)

  //   // Step 1: Socket reestr
  //   this.state.roomsReestr.delete(channelName)

  //   return Promise.resolve({ ok: true, instance: this, message: 'Removed from reestr' })
  // }
  public getStateInfo(channelName: string): Promise<{
    ok: boolean;
    message?: string;
    items: TMessage[];
  }> {
    const items = this.state.roomsReestr.get(channelName)
    if (!!items) return Promise.resolve({ ok: true, items })
    else return Promise.reject({ ok: true, message: 'Not found', items: [] })
  }
}

export const state = Singleton.getInstance()
