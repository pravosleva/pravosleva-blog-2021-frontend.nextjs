import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

export type TState = {
  theme: 'light' | 'light-gray' | 'dark-gray' | 'dark';
};
export const initialState: TState = {
  theme: 'light',
}

export const globalThemeSlice: any = createSlice({
  name: 'globalTheme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    resetTheme: (state: any) => {
      // @ts-ignore
      for (const key in state) state[key] = initialState[key]
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.globalTheme,
      };
    },
  },
})

export const {
  resetTheme,
  setTheme,
} = globalThemeSlice.actions

export const reducer = globalThemeSlice.reducer
