import { ReactiveEngine } from '@pravosleva/reactive-engine'

export const podcastEngine = new ReactiveEngine(
  {
    logger: {
      isEnabled: true,
      isCoreOptimizationDebugEnabled: false,
      instanceName: 'Podcast Engine',
    }
  }
)
