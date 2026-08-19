import { AbstractService } from '@pravosleva/reactive-engine'

export class StickyHeaderService extends AbstractService {
  public isStickyHeaderVisible = this.engine.signal<boolean>(false, 'article:is_sticky_header_visible')
}
