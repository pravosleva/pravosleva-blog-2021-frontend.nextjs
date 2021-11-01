import { createSymbiote } from 'redux-symbiote'

export const initialState = {
  fromServer: null,
  isLoadedSuccessfully: false,
  isLoading: false,
}

export const { actions: userInfoActions, reducer: userInfo } = createSymbiote(
  initialState,
  {
    fillDelta: (state, payload) => ({ ...state, ...payload }),
    setUser: (state, fromServer) => ({ ...state, fromServer }),
    reset: (state, payload) => ({ ...initialState }),
  },
  'userInfo'
)
