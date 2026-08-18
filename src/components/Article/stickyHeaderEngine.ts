import { ReactiveEngine, AbstractService } from '@pravosleva/reactive-engine'

export class SearchArticlesService extends AbstractService {
  public isStickyHeaderVisible = this.engine.signal<boolean>(false, 'article:is_sticky_header_visible')
}

export const stickyHeaderEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    isCoreOptimizationDebugEnabled: true,
    instanceName: 'Sticky Header',
  }
})
