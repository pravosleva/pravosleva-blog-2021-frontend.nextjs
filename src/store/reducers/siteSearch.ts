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
    sqt: NSiteSearchState.TSQTState[]
  }
}

export const initialState: NSiteSearchState.TState = {
  sqt: [],
}

const limits: {
  sqt: number;
} = {
  sqt: 3,
}

export const siteSearchSlice: any = createSlice({
  name: 'siteSearch',
  initialState,
  reducers: {
    addSQT: (state: NSiteSearchState.TState, action: { type: string; payload: NSiteSearchState.TSQTState }) => {
      if (!Array.isArray(state.sqt)) state.sqt = []
      else {
        if (state.sqt.length >= limits.sqt) {
          const newArr: any[] = []
          state.sqt.forEach((item, i) => {
            if (i < limits.sqt) newArr.push(item)
          })
          newArr.pop()
          state.sqt = newArr
        }

        const isExists = state.sqt.findIndex(({ normalized }) => normalized === action.payload.normalized) !== -1
        switch (true) {
          case isExists:
            state.sqt = [action.payload, ...state.sqt.filter(({ normalized }) => normalized !== action.payload.normalized)]
            break
          default:
            if (state.sqt.length >= limits.sqt) {
              state.sqt.pop()
            }
            state.sqt.unshift(action.payload)
            break
        }
      }
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
  addSQT,
} = siteSearchSlice.actions

export const reducer = siteSearchSlice.reducer
