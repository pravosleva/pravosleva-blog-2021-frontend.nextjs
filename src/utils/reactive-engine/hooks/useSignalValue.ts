import { useEffect, useState, useRef } from "react";
import { ISignalLike } from "@pravosleva/reactive-engine/dist/core/types";

export function useSignalValue<T>(signal: ISignalLike<T>): T {
  const signalRef = useRef(signal);
  signalRef.current = signal;

  // Инициализируем стейт начальным значением.
  // Используем valueWithoutTracking, если оно доступно, чтобы гарантировать 
  // отсутствие побочных эффектов во время фазы рендеринга React.
  const [value, setValue] = useState<T>(() => {
    if (signal.valueWithoutTracking !== undefined) {
      return signal.valueWithoutTracking;
    }
    return signal.value;
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const currentSignal = signalRef.current;

    // Функция обновления стейта
    const handleUpdate = () => {
      if (!isMounted) return;
      // Читаем актуальное значение. Внутри эффекта/коллбэка это безопасно.
      setValue(signalRef.current.value);
    };

    // Проверяем, является ли узел computed-свойством со скрытым __subscribe
    if (typeof (currentSignal as any).__subscribe === 'function') {
      // Испольуем приватный безопасный метод подписки ядра
      unsubscribe = (currentSignal as any).__subscribe(handleUpdate);
    } else if (typeof currentSignal.subscribe === 'function') {
      // Для обычных Сигналов используем стандартный subscribe, но изолируем
      // первый синхронный вызов от вызова handleUpdate, так как значение уже в стейте
      let isFirstCall = true;
      unsubscribe = currentSignal.subscribe((nextVal: T) => {
        if (isFirstCall) {
          isFirstCall = false;
          return;
        }
        if (isMounted) setValue(nextVal);
      });
    }

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [signal]); // Перезапускается строго при смене инстанса сигнала (например, при смене статьи)

  return value;
}
