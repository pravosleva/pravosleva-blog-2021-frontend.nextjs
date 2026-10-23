import { useMemo, useState, useDebugValue } from 'react'
import { useSyncExternalStore } from 'use-sync-external-store/shim' // Канонический шим для React 17
import { ISignalLike } from '@pravosleva/reactive-engine/dist/core/types'

export function useReactiveValue0<V>(signal: ISignalLike<V>): V;
export function useReactiveValue0<T extends object>(proxy: T): T;
export function useReactiveValue0<T>(primitive: T): T;
export function useReactiveValue0(signal: any): any {
  const isProxy = signal && typeof signal === 'object' && '__subscribe' in signal
  const isSignal = signal && typeof signal === 'object' && 'subscribe' in signal

  if (!isSignal && !isProxy) {
    return signal
  }

  const rawNode = signal._node || signal
  const engine = rawNode.engine || signal.engine

  const [ticket, setTicket] = useState(0)

  useSyncExternalStore(
    useMemo(() => (onStoreChange: () => void) => {
      const triggerStoreRerender = () => {
        setTicket((t) => t + 1)
        onStoreChange()
      }

      if (rawNode.type === 'computed' && typeof signal.__subscribe === 'function') {
        return signal.__subscribe(triggerStoreRerender)
      }

      if (rawNode.type !== 'computed' && '__subscribe' in signal && typeof signal.__subscribe === 'function') {
        return signal.__subscribe(triggerStoreRerender)
      }

      return signal.subscribe(triggerStoreRerender)
    }, [signal, rawNode]),

    () => ticket,
    () => 0
  )

  useDebugValue(ticket)

  if (engine && 'untrack' in engine) {
    return engine.untrack(() => (signal.value !== undefined ? signal.value : signal))
  }

  return signal.value !== undefined ? signal.value : signal
}
