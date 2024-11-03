import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
import { initialBaseProps, TBaseProps } from '~/utils/next';
// import { IRootState } from '~/store/IRootState'

export const initialState: TBaseProps = initialBaseProps

export const basePropsSlice: any = createSlice({
  name: 'baseProps',
  initialState,
  reducers: {
    // setDelta: (state: TState, action: { type: string; payload: Partial<TState> }) => {
    //   for (const key in action.payload) {
    //     state[key] = action.payload[key]
    //   }
    // },
    //  @ts-ignore
    setBaseProps: (state: TBaseProps, action: { type: string; payload: TBaseProps }) => {
      state = action.payload
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.baseProps,
      };
    },
  },
})

export const {
  // setDelta,
  setBaseProps,
} = basePropsSlice.actions

export const reducer = basePropsSlice.reducer
