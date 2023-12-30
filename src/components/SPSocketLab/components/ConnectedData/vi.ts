import { proxy } from 'valtio/vanilla'
import { NEvent } from './withSocketContext'

export const vi = proxy<{
  FOR_EXAMPLE: {
    items: NEvent.TReport[];
    activeReport: NEvent.TReport | null;
  };
}>({
  FOR_EXAMPLE: {
    items: [],
    activeReport: null,
  },
  // NOTE: Other rooms...
})
