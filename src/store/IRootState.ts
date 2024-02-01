import { Store } from 'redux'
// import { IToast } from '@/actions'
import { TState as TTodo2023State } from './reducers/todo2023'
import { TState as TTodo2023NotPersistedState } from './reducers/todo2023NotPersisted'
import { TState as TGlobalThemingState } from './reducers/globalTheme'
import { TState as TCookieOfferState } from './reducers/cookieOffer'
import { TState as TPageMetaState } from './reducers/pageMeta'
import { NSiteSearchState } from './reducers/siteSearch'
import { TState as TCustomDevToolsState } from './reducers/customDevTools'
import { TState as TAutoparkState } from './reducers/autopark'

export interface IRootState extends Store {
  [x: string]: any;
  // toaster: {
  //   items: IToast[];
  // };
  autopark: TAutoparkState;
  todo2023: TTodo2023State;
  todo2023NotPersisted: TTodo2023NotPersistedState;
  globalTheme: TGlobalThemingState;
  cookieOffer: TCookieOfferState;
  pageMeta: TPageMetaState;
  siteSearch: NSiteSearchState.TState;
  customDevTools: TCustomDevToolsState;
}
