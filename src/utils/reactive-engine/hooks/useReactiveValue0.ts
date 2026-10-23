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
  }, [input]) // Сбрасываем мемоизацию при смене инпута

  // 🛡️ АБСОЛЮТНО БЕЗОПАСНЫЙ ГВАРД ВЫЧИТКИ ЗНАЧЕНИЯ НА ЭТАПЕ РЕНДЕРА
  const getRawValueWithoutTriggeringGettter = (item: ObservableItem<T>): T => {
    if (item.valueWithoutTracking !== undefined) return item.valueWithoutTracking;
    
    const raw = item as any;
    const node = raw._node || raw;

    // Читаем сырые скрытые поля ядра, полностью игнорируя опасные геттеры .value
    if (node.valueWithoutTracking !== undefined) return node.valueWithoutTracking;
    if (node._value !== undefined) return node._value;
    if (node.rawValue !== undefined) return node.rawValue;
    
    // Если это computed из core.method.computed.ts, значение лежит в замыкании, 
    // но в инстансе ноды оно кешируется или пересчитывается через run()
    if (node.type === 'computed' && typeof node.run === 'function') {
      try {
        // Вызываем внутренний метод выполнения графа без подписки
        node.run();
      } catch {}
    }

    // Крайний фолбек: пробуем прочесть поле value, только если мы полностью защищены
    try {
      const localUntrack = raw.engine?.untrack || node.engine?.untrack;
      if (typeof localUntrack === 'function') {
        return localUntrack(() => item.value);
      }
      return item.value;
    } catch {
      return raw._value;
    }
  };

  // Инициализируем стейт гарантированно безопасным значением
  const initialValue = getRawValueWithoutTriggeringGettter(reactiveItem);
  const [state, setState] = useState<T>(initialValue)
  
  const stateRef = useRef<T>(initialValue)
  stateRef.current = state

  const setStateRef = useRef(setState)
  useEffect(() => {
    setStateRef.current = setState
  }, [setState])

  // СИНХРОНИЗАЦИЯ НА ЭТАПЕ РЕНДЕРА ЧЕРЕЗ СЫРЫЕ ДАННЫЕ
  const currentSafeValue = getRawValueWithoutTriggeringGettter(reactiveItem)
  if (state !== currentSafeValue) {
    stateRef.current = currentSafeValue
    setState(currentSafeValue)
  }

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const node = (reactiveItem as any)._node || reactiveItem;
    const localUntrack = (reactiveItem as any).engine?.untrack || node.engine?.untrack;

    const setupSubscription = () => {
      try {
        let isFirstCall = true;
        unsubscribe = reactiveItem.subscribe((newValue) => {
          if (isFirstCall) {
            isFirstCall = false; 
            return;
          }
          if (isMounted) {
            stateRef.current = newValue;
            setStateRef.current(newValue);
          }
        });
        
        // Как только эффект успешно прикоммитился к DOM — вычитываем актуальное 
        // состояние из ядра плеера и прокидываем в стейт, завершая холодный старт.
        const freshValue = getRawValueWithoutTriggeringGettter(reactiveItem);
        if (isMounted && stateRef.current !== freshValue) {
          stateRef.current = freshValue;
          setStateRef.current(freshValue);
        }
      } catch (err) {
        console.warn("Предупреждение реактивного графа при подписке:", err);
      }
    };

    // Оформляем подписку строго изолированно от контекста сборщика Next.js
    if (typeof localUntrack === 'function') {
      localUntrack(setupSubscription);
    } else {
      setupSubscription();
    }

    return () => {
      isMounted = false;
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
