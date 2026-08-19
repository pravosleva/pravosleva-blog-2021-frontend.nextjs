import { AbstractService } from '@pravosleva/reactive-engine'

export class SearchArticlesService extends AbstractService {
  public isStickyHeaderVisible = this.engine.signal<boolean>(false, 'article:is_sticky_header_visible')
}
