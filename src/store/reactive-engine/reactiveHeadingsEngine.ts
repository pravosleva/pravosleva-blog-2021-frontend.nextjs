import { ReactiveEngine, withThrottleComputed } from '@pravosleva/reactive-engine'

// 1. Инициализируем движок в соответствии с ReactiveEngineOptions
export const reactiveHeadingsEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Reactive Headings'
  }
})

// Интерфейс для левого меню (теперь содержит готовый префикс)
export interface IHeadingStoredItem {
  id: string;
  text: string;
  tagName: string;
  isVisible: boolean;
  isActiveProgress: boolean;
  prefix: string; // Храним префикс дерева здесь
  levelDiff: number; // Храним уровень глубины здесь
}

// Новый сигнал для глобального хранения и расчетов левого меню содержания
// Сигнал — это встроенный примитив ReactiveEngine
export const headingsRegistrySignal = reactiveHeadingsEngine.signal<IHeadingStoredItem[]>(
  [], 
  'global:article-headings:[IS_OPTIMIZED=0]'
)
export const throttledHeadingsSignal = withThrottleComputed(
  reactiveHeadingsEngine,
  () => headingsRegistrySignal.value,
  { limit: 300 },
  'throttled-headings-300:[IS_OPTIMIZED=1]',
)

// Нам также понадобится утилита перевода тега в число
export const getLevelNum = (tagName: string) => parseInt(tagName.replace('h', ''), 10) || 1
