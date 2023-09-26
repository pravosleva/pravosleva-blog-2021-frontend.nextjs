import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

export type TState = {
  list: string[];
};
export const initialState: TState = {
  list: [],
}

export const scrollDisablingComponentsSlice: any = createSlice({
  name: 'scrollDisablingComponents',
  initialState,
  reducers: {
    add: (state, action) => {
      state.list.push(action.payload)
    },
    remove: (state, action) => {
      state.list = state.list.filter((e) => e !== action.payload)
    },
    reset: (state) => {
      state.list = initialState.list
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.scrollDisablingComponents,
      };
    },
  },
})

export const {
  add,
  remove,
  reset,
} = scrollDisablingComponentsSlice.actions

export const reducer = scrollDisablingComponentsSlice.reducer
