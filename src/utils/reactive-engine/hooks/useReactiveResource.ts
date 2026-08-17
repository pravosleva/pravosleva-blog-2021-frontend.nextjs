import { Resource, ResourceState } from '@pravosleva/reactive-engine'
import { useEffect, useState } from 'react'

export function useReactiveResource<T>(resource: Resource<T>): ResourceState<T> {
  // 1. ИСПРАВЛЕНО: При инициализации читаем .value у самого инстанса ресурса
  const [state, setState] = useState<ResourceState<T>>(() => ({
    data: resource.data, // У самого Resource текущее значение лежит в .value
    loading: resource.loading,
    error: resource.error,
    isRetrying: resource.isRetrying || false,
  }))

  useEffect(() => {
    if (!resource) return

    if (typeof resource.subscribe === 'function') {
      // 2. ИСПРАВЛЕНО: Коллбэк подписки принимает ResourceState, где данные уже лежат в .data
      const unsubscribe = resource.subscribe((nextState: ResourceState<T>) => {
        setState({
          data: nextState.data,
          loading: nextState.loading,
          error: nextState.error,
          isRetrying: nextState.isRetrying,
        })
      })
      
      return () => unsubscribe()
    }
  }, [resource])

  // 3. ИСПРАВЛЕНО: Возвращаем строго ResourceState<T>, чтобы работала деструктуризация
  return state
}
