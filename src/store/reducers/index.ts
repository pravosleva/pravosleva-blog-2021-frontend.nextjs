import { combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
// import { counter, initialState as countInitialState } from './counter'
import { lang } from './lang'
// import {
//   scrollDisablingComponents,
//   initialState as scrollDisablingComponentsInitialState,
// } from './scroll-disabling-components'
// import { userInfo, initialState as userInfoInitialState } from './userInfo'
// import { users, initialState as usersInitialState } from './users'
// import { toaster, initialState as toasterInitialState } from './toaster'
import { reducer as autoparkReducer } from './autopark'
import { reducer as todo2023Reducer } from './todo2023'

export const rootReducer = combineReducers({
  // counter,
  lang,
  // scrollDisablingComponents,
  // userInfo,
  // users,
  // form: formReducer,
  // toaster,
  autopark: autoparkReducer,
  todo2023: todo2023Reducer,
  // Others...
})

// export type TRootState = ReturnType<typeof reducer>
