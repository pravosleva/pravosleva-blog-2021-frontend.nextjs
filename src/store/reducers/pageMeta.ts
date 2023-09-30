import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

export type TState = {
  title: string;
};
export const initialState: TState = {
  title: 'Pravosleva',
}

export const pageMetaSlice: any = createSlice({
  name: 'pageMeta',
  initialState,
  reducers: {
    // setDelta: (state: TState, action: { type: string; payload: Partial<TState> }) => {
    //   for (const key in action.payload) {
    //     state[key] = action.payload[key]
    //   }
    // },
    setTitle: (state: TState, action: { type: string; payload: string }) => {
      state.title = action.payload
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.pageMeta,
      };
    },
  },
})

export const {
  // setDelta,
  setTitle,
} = pageMetaSlice.actions

export const reducer = pageMetaSlice.reducer
