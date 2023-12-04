import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

export type TState = {
  isEnabled: boolean;
};
export const initialState: TState = {
  isEnabled: false,
}

export const cookieOfferSlice: any = createSlice({
  name: 'cookieOffer',
  initialState,
  reducers: {
    enable: (state) => {
      state.isEnabled = true
    },
    disable: (state: any) => {
      state.isEnabled = false
    },
    reset: (state: any) => {
      state.isEnabled = false
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.cookieOffer,
      };
    },
  },
})

export const {
  enable,
  disable,
  reset,
} = cookieOfferSlice.actions

export const reducer = cookieOfferSlice.reducer
