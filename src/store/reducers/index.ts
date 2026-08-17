import { combineReducers } from 'redux'
import { reducer as langReducer } from './lang'
import { reducer as autoparkReducer } from './autopark'
import { reducer as todo2023Reducer } from './todo2023'
import { reducer as todo2023NotPersistedReducer } from './todo2023NotPersisted'
import { reducer as globalThemeReducer } from './globalTheme'
import { reducer as cookieOfferReducer } from './cookieOffer'
import { reducer as scrollDisablingComponentsReducer } from './scrollDisablingComponents'
import { reducer as pageMetaReducer } from './pageMeta'
import { reducer as siteSearchReducer } from './siteSearch'
import { reducer as customDevToolsReducer } from './customDevTools'
import { reducer as basePropsReducer } from './baseProps'

export const rootReducer = combineReducers({
  lang: langReducer,
  autopark: autoparkReducer,
  todo2023: todo2023Reducer,
  todo2023NotPersisted: todo2023NotPersistedReducer,
  globalTheme: globalThemeReducer,
  cookieOffer: cookieOfferReducer,
  scrollDisablingComponents: scrollDisablingComponentsReducer,
  pageMeta: pageMetaReducer,
  siteSearch: siteSearchReducer,
  customDevTools: customDevToolsReducer,
  baseProps: basePropsReducer,
})
