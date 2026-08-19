import { ReactiveEngine } from '@pravosleva/reactive-engine'

export interface ICollapsibleItem {
  id: string;
  header: string;
  isVisible: boolean;
}

// 1. Инициализируем движок в соответствии с ReactiveEngineOptions
export const collapsibleEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Collapsible Pinned Boxes'
  }
})

// 2. Создаем глобальный сигнал, который будет хранить реестр блоков
// Сигнал — это встроенный примитив ReactiveEngine
export const collapsibleRegistrySignal = collapsibleEngine.signal<Record<string, ICollapsibleItem>>(
  {}, 
  'global:collapsible-boxes'
)
