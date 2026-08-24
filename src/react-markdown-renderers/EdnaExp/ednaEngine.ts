import { ReactiveEngine } from '@pravosleva/reactive-engine' // Подставьте ваш точный путь экспорта движка

export const ednaEngine = new ReactiveEngine({
  logger: {
    instanceName: 'EDNA exp',
    isEnabled: true,
  }
})
