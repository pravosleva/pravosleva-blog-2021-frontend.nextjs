import { useState, useEffect, useRef, useMemo } from 'react'
import { untrack } from '@pravosleva/reactive-engine' // Используем легитимный untrack ядра!

type CleanupFn = () => void;

interface ObservableItem<T> {
  readonly value: T
  readonly valueWithoutTracking?: T
  subscribe: (cb: (val: T) => void) => CleanupFn
  destroy?: () => void
}

type ReactiveInput<T> = ObservableItem<T> | (() => ObservableItem<T>)

export const useReactiveValue0 = <T>(input: ReactiveInput<T>): T => {
  const isFactory = typeof input === 'function'

  const factoryRef = useRef(input)
  useEffect(() => {
    factoryRef.current = input
  }, [input])

  const reactiveItem = useMemo(() => {
    if (typeof input === 'function') {
      return input() 
    }
    return input
  }, [isFactory ? undefined : input])

  // Безопасно получаем начальное значение без трекинга зависимостей на рендере через untrack
  const getSafeValue = (item: ObservableItem<T>) => {
    if (item.valueWithoutTracking !== undefined) return item.valueWithoutTracking;
    try {
      // Оборачиваем чтение в untrack ядра, чтобы гарантированно изолировать фазу рендера React 17
      return untrack(() => item.value);
    } catch {
      return (item as any)._value;
    }
  };

  const [state, setState] = useState<T>(() => getSafeValue(reactiveItem))
  const setStateRef = useRef(setState)

  useEffect(() => {
    setStateRef.current = setState
  }, [setState])

  // БЕЗОПАСНАЯ СИНХРОНИЗАЦИЯ НА ОПЕРЕЖЕНИЕ
  const currentSafeValue = getSafeValue(reactiveItem)
  if (state !== currentSafeValue) {
    setState(currentSafeValue)
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    // Выносим подписку через стандартный .subscribe() в макротаску.
    // Это полностью очищает глобальный контекст зависимостей движка от влияния рендера
    // и асинхронных микротаск, которые выполняются прямо сейчас.
    const timer = setTimeout(() => {
      if (!isMounted) return;

      try {
        let isFirstCall = true;
        unsubscribe = reactiveItem.subscribe((newValue) => {
          if (isFirstCall) {
            isFirstCall = false; // Игнорируем синхронный вызов при подписке, стейт уже актуален
            return;
          }
          if (isMounted) {
            setStateRef.current(newValue);
          }
        });
      } catch (err) {
        console.warn("Ошибка при подписке на сигнал во вне-рендеровом контексте:", err);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (unsubscribe) {
        unsubscribe();
      }

      if (isFactory && reactiveItem && typeof reactiveItem.destroy === 'function') {
        reactiveItem.destroy()
      }
    }
  }, [reactiveItem, isFactory])

  return state
}
