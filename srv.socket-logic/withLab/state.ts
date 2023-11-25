import {
  proxy,
  // subscribe,
  // snapshot,
} from 'valtio/vanilla'
// NOTE: See also https://valtio.pmnd.rs/docs/introduction/getting-started

type TSocketId = string
type TRoomList = string[]
type TState = { socketReestr: Map<TSocketId, TRoomList>; counters: {[key: string]: number} }

type TOperationResult = Promise<{ isOk: boolean; message?: string; instance: Singleton }>

export class Singleton {
  private static instance: Singleton
  public state: TState

  private constructor() {
    this.state = proxy({
      socketReestr: new Map(),
      counters: {},
    })
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton()

    return Singleton.instance;
  }

  public incSocketInReestr ({ channelName, clientId }: { channelName: string, clientId: string }): TOperationResult {
    // console.log('- incSocketInReestr called...')

    // Step 1: Socket reestr
    const userChannels = this.state.socketReestr.get(clientId)
    if (!!userChannels) this.state.socketReestr.set(clientId, [...new Set([channelName, ...userChannels])])
    else this.state.socketReestr.set(clientId, [channelName])

    // Step 2: Counters
    const counter = this.state.counters[channelName]
    if (!counter) this.state.counters[channelName] = 1
    else this.state.counters[channelName] += 1

    return Promise.resolve({ isOk: true, instance: this, message: 'Added to reestr' })
  }
  public decSocketInReestr ({ clientId }: { clientId: string }): TOperationResult {
    const roomList = this.state.socketReestr.get(clientId)

    console.log('---roomList')
    console.log(roomList)
    console.log('---')

    // Step 1: Socket reestr
    this.state.socketReestr.delete(clientId)

    // Step 2: Counters
    if (!!roomList) {
      for (const channelName of roomList) {
        const counter = this.state.counters[channelName]
        if (typeof counter !== 'number' || counter < 0) {
          // NOTE: Wtf?
          delete this.state.counters[channelName]
          break
        } else {
          this.state.counters[channelName] -= 1
          break
        }
      }
    }

    return Promise.resolve({ isOk: true, instance: this, message: 'Removed from reestr' })
  }
  public getStateInfo (): {
    list: string[];
    connectionsMap: Map<string, number>
  } {
    const roomlistSet = new Set<string>()
    const connectionsMap = new Map<string, number>()
    for (const [_socketId, _roomList] of this.state.socketReestr) {
      for (const channelName of _roomList) {
        roomlistSet.add(channelName)
        const _connCounter = connectionsMap.get(channelName) || 0
        connectionsMap.set(channelName, _connCounter + 1)
      }
    }
    return {
      list: Array.from(roomlistSet),
      connectionsMap,
    }
  }
  public getConnectionsCounterByChannelName({ channelName }: { channelName: string }): number {
    return this.state.counters[channelName] || 0
  }
}

export const state = Singleton.getInstance()
