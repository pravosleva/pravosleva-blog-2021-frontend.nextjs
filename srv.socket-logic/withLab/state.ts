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

class Singleton {
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

  public incSocketInReestr ({ channelName, socketId }: { channelName: string, socketId: string }): TOperationResult {
    // console.log('- incSocketInReestr called...')

    // Step 1: Socket reestr
    const userChannels = this.state.socketReestr.get(socketId)
    if (!!userChannels) this.state.socketReestr.set(socketId, [...new Set([channelName, ...userChannels])])
    else this.state.socketReestr.set(socketId, [channelName])

    // Step 2: Counters
    const counter = this.state.counters[channelName]
    if (!counter) this.state.counters[channelName] = 1
    else this.state.counters[channelName] += 1

    return Promise.resolve({ isOk: true, instance: this, message: 'Added to reestr' })
  }
  public decSocketInReestr ({ socketId }: { socketId: string }): TOperationResult {
    const roomList = this.state.socketReestr.get(socketId)

    // Step 1: Socket reestr
    this.state.socketReestr.delete(socketId)

    // Step 2: Counters
    if (!!roomList) {
      for (const channelName of roomList) {
        const counter = this.state.counters[channelName]
        if (!counter || counter <= 0) {
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
