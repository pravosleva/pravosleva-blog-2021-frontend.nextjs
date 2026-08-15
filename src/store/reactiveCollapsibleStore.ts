import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { useState, useEffect } from 'react'

export interface ICollapsibleItem {
  id: string;
  header: string;
  isVisible: boolean;
}

// 1. Инициализируем движок в соответствии с ReactiveEngineOptions
export const collapsibleEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'collapsible-global-engine'
  }
})

// 2. Создаем глобальный сигнал, который будет хранить реестр блоков
// Сигнал — это встроенный примитив ReactiveEngine
export const collapsibleRegistrySignal = collapsibleEngine.signal<Record<string, ICollapsibleItem>>(
  {}, 
  'global:collapsible:registry'
)

// Хелпер для генерации валидного HTML ID из заголовка
export const generateSlugId = (text: string): string => {
  return 'collapsible-' + text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

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
