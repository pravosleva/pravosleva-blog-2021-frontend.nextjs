import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

export type TState = {
  browserMemoryMonitor: {
    isEnabled: boolean;
  };
};
export const initialState: TState = {
  browserMemoryMonitor: {
    isEnabled: false,
  },
}

export const customDevToolsSlice: any = createSlice({
  name: 'customDevTools',
  initialState,
  reducers: {
    enableBrowserMemoryMonitor: (state) => {
      state.browserMemoryMonitor.isEnabled = true
    },
    disableBrowserMemoryMonitor: (state: any) => {
      state.browserMemoryMonitor.isEnabled = false
    },
    resetBrowserMemoryMonitor: (state: any) => {
      state.browserMemoryMonitor.isEnabled = false
    },
    toggleBrowserMemoryMonitor: (state: any) => {
      state.browserMemoryMonitor.isEnabled = !state.browserMemoryMonitor.isEnabled
    },
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.customDevTools,
      };
    },
  },
})

export const {
  enableBrowserMemoryMonitor,
  disableBrowserMemoryMonitor,
  resetBrowserMemoryMonitor,
  toggleBrowserMemoryMonitor,
} = customDevToolsSlice.actions

export const reducer = customDevToolsSlice.reducer
