class Singleton {
  private static instance: Singleton;
  _state: Map<string, number>;

  private constructor() {
    this._state = new Map()
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton();

    return Singleton.instance;
  }

  public get keys() {
    return this._state.keys()
  }
  public getKeys() {
    return [...this._state.keys()]
  }
  public get size() {
    return this._state.size
  }
  public set(key: string, value: number) {
    return this._state.set(key, value)
  }
  public get(key: string) {
    return this._state.get(key)
  }
  public delete(key: string) {
    return this._state.delete(key)
  }
  public has(key: string) {
    return this._state.has(key)
  }

  public get state() {
    return Object.fromEntries(this._state)
  }
}

export const connectionsInstance = Singleton.getInstance()
