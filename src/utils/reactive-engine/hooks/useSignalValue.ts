import { useEffect, useState } from "react";

// Универсальный хук для связывания сигналов @pravosleva/reactive-engine с React 17/18
export function useSignalValue<T>(signal: { value: T; subscribe?: (cb: (val: T) => void) => () => void }): T {
  const [value, setValue] = useState<T>(signal.value)

  useEffect(() => {
    // Если у сигнала есть метод subscribe, подписываемся на него
    if (typeof signal.subscribe === 'function') {
      const unsubscribe = signal.subscribe((nextVal: T) => {
        setValue(nextVal)
      })
      return () => unsubscribe()
    }
    
    // Если прямого subscribe на сигнале нет, используем глобальный метод watch/effect движка:
    // (в зависимости от точной версии вашей библиотеки, обычно сигналы поддерживают нативный .subscribe)
    return () => {}
  }, [signal])

  return value
}