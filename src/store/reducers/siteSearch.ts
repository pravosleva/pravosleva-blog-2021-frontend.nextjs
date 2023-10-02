import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

export namespace NSiteSearchState {
  export type TSQTState = {
    original: string;
    normalized: string;
    withoutSpaces: string;
  }
  export type TState = {
    sqt: NSiteSearchState.TSQTState
  }
}

export const initialState: NSiteSearchState.TState = {
  sqt: {
    original: '',
    normalized: '',
    withoutSpaces: '',
  },
}

export const siteSearchSlice: any = createSlice({
  name: 'siteSearch',
  initialState,
  reducers: {
    // setDelta: (state: TState, action: { type: string; payload: Partial<TState> }) => {
    //   for (const key in action.payload) {
    //     state[key] = action.payload[key]
    //   }
    // },
    setSQT: (state: NSiteSearchState.TState, action: { type: string; payload: NSiteSearchState.TSQTState }) => {
      state.sqt = action.payload
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.siteSearch,
      };
    },
  },
})

export const {
  setSQT,
} = siteSearchSlice.actions

export const reducer = siteSearchSlice.reducer
