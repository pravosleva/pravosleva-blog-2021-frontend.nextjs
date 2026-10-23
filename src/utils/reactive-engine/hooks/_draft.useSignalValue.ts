import { useEffect, useState, useRef } from "react";
import { ISignalLike } from "@pravosleva/reactive-engine/dist/core/types";

// Безопасный хук для связывания сигналов и computed с React 17
export function useSignalValue<T>(signal: ISignalLike<T>): T {
  // Сохраняем ссылку на актуальный сигнал, чтобы избежать лишних перезапусков эффекта
  const signalRef = useRef(signal);
  signalRef.current = signal;

  // Чтобы рендер React 17 не упал при первом обращении,
  // пробуем безопасно прочитать начальное значение.
  const [value, setValue] = useState<T>(() => {
    try {
      return signal.value;
    } catch (err) {
      // Если движок падает на рендере даже при чтении .value, 
      // возвращаем внутреннее сырое значение (каст к any для обхода прокси)
      const raw = signal as any;
      return raw._value !== undefined ? raw._value : raw.rawValue;
    }
  });

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    // Выносим подписку из синхронного потока React в макротаску (setTimeout).
    // Это очистит глобальный контекст зависимостей движка от влияния рендера.
    const timer = setTimeout(() => {
      if (!isMounted) return;

      const currentSignal = signalRef.current;
      if (typeof currentSignal.subscribe === 'function') {
        try {
          // Подписываемся на изменения. Теперь коллбэк будет обновлять стейт
          unsubscribe = currentSignal.subscribe((nextVal: T) => {
            if (isMounted) setValue(nextVal);
          });
        } catch (err) {
          console.warn("Ошибка при подписке на сигнал во вне-рендеровом контексте:", err);
        }
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [signal]); // Перезапускаем подписку только при смене инстанса сигнала

  return value;
}
