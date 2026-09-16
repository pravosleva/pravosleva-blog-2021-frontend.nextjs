import { ReactiveEngine } from '@pravosleva/reactive-engine'

export const searchEngine = new ReactiveEngine({
  logger: {
    isEnabled: false,
    isCoreOptimizationDebugEnabled: false,
    instanceName: 'Articles Search',
  }
})
