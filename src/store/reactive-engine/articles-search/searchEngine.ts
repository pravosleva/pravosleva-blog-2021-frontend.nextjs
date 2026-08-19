import { ReactiveEngine } from '@pravosleva/reactive-engine'

export const searchEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    isCoreOptimizationDebugEnabled: false,
    instanceName: 'Articles Search',
  }
})
