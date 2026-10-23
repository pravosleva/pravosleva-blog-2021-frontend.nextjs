import { useState, useEffect, useRef, useMemo } from 'react'

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

  // Безопасно получаем начальное значение без трекинга зависимостей на рендере
  const getSafeValue = (item: ObservableItem<T>) => {
    if (item.valueWithoutTracking !== undefined) return item.valueWithoutTracking;

    // Пытаемся динамически найти инстанс движка, к которому привязан этот сигнал
    const rawItem = item as any;
    
    // В зависимости от того, Signal это или Computed, ищем ссылку на движок в приватных полях ноды
    const node = rawItem._node || rawItem;
    // В исходниках `core.ts` у движка есть уникальные свойства, например `computedCache` или `pendingEffects`
    // Если мы можем найти метод untrack в контексте объекта — вызываем его локально
    const localUntrack = rawItem.engine?.untrack || node.engine?.untrack;

    if (typeof localUntrack === 'function') {
      try {
        return localUntrack(() => item.value);
      } catch {
        // Фоллбэк, если локальный untrack почему-то дал сбой
      }
    }

    // Если это computed из файла `core.method.computed.ts`, у него есть node.run
    if (node && typeof node.run === 'function' && node.type === 'computed') {
      return node.verifiedInEpoch !== undefined ? rawItem.valueWithoutTracking : node.run();
    }

    return item.value;
  };

  const [state, setState] = useState<T>(() => getSafeValue(reactiveItem))
  const setStateRef = useRef(setState)

  useEffect(() => {
    setStateRef.current = setState
  }, [setState])

  // БЕЗОПАСНАЯ СИНХРОНИЗАЦИЯ НА ОПЕРЕЖЕНИЕ (с поддержкой локального инстанса)
  const currentSafeValue = getSafeValue(reactiveItem)
  if (state !== currentSafeValue) {
    setState(currentSafeValue)
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    // Изолируем подписку в макротаску, чтобы полностью развязать локальные 
    // транзакции конкретного инстанса движка и жизненный цикл React 17
    const timer = setTimeout(() => {
      if (!isMounted) return;

      try {
        let isFirstCall = true;
        unsubscribe = reactiveItem.subscribe((newValue) => {
          if (isFirstCall) {
            isFirstCall = false; 
            return;
          }
          if (isMounted) {
            setStateRef.current(newValue);
          }
        });
      } catch (err) {
        console.warn("Ошибка при подписке на сигнал локального инстанса:", err);
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
