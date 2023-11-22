type TRoomId = number
type TConnectionsCounter = number
type TSocketId = string

class Singleton {
  private static instance: Singleton;
  _counters: Map<TRoomId, TConnectionsCounter>;
  _socketIds: Map<TSocketId, TRoomId>;

  private constructor() {
    this._counters = new Map()
    this._socketIds = new Map()
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton();

    return Singleton.instance;
  }

  get counters() {
    return this._counters
  }
  get socketIds() {
    return this._socketIds
  }

  public addConnection({ tg_chat_id, socketId }: {
    tg_chat_id: number;
    socketId: string;
  }): Promise<{
    ok: boolean;
    instance: Singleton;
  }> {
    if (!this._counters.has(tg_chat_id)) {
      this._counters.set(tg_chat_id, 1)

      this._socketIds.set(socketId, tg_chat_id)
    } else {
      const counter: number = this._counters.get(tg_chat_id) || 0
      this._counters.set(tg_chat_id, counter + 1)

      this._socketIds.set(socketId, tg_chat_id)
    }
    return Promise.resolve({ ok: true, instance: this })
  }
  public removeConnection({ socketId }: {
    // tg_chat_id: number;
    socketId: string;
  }): Promise<{
    ok: boolean;
    instance: Singleton;
    tg_chat_id?: number;
  }> {
    const tgChatId = this._socketIds.get(socketId)

    if (!!tgChatId) {
      if (this._counters.has(tgChatId)) {
        let counter: number = this._counters.get(tgChatId) || 1
        if (counter < 0) counter = 1

        this._counters.set(tgChatId, counter - 1)
      } // else this._counters.set(tgChatId, 0)
    }
    this._socketIds.delete(socketId)

    return Promise.resolve({
      ok: true,
      instance: this,
      tg_chat_id: tgChatId,
    })
  }
}

export const connectionsInstance = Singleton.getInstance()
