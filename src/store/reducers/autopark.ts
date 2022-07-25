import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

export const initialState = {
  activeProject: null,
  userCheckerResponse: null,
  x: 1,
  isOneTimePasswordCorrect: false,
}

export const autoparkSlice: any = createSlice({
  name: 'autopark',
  initialState,
  reducers: {
    setUserCheckerResponse: (state: any, action: any) => {
      // console.log('CALLED: setUserCheckerResponse')
      // console.log(action.payload)
      state.userCheckerResponse = action.payload
      state.x += 1
    },
    setActiveProject: (state: any, action: any) => {
      // console.log('CALLED: setActiveProject')
      state.activeProject = action.payload
    },
    updateProjects: (state: any, action: any) => {
      // console.log('CALLED: updateProjects')
      if (!state.userCheckerResponse) state.userCheckerResponse = { projects: action.payload }
      else state.userCheckerResponse.projects = action.payload
    },
    setIsOneTimePasswordCorrect: (state: any, action: any) => {
      // console.log('CALLED: setIsOneTimePasswordCorrect')
      state.isOneTimePasswordCorrect = action.payload
    }
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.autopark,
      };
    },
  },
})

export const {
  setUserCheckerResponse,
  setActiveProject,
  updateProjects,
  setIsOneTimePasswordCorrect,
} = autoparkSlice.actions

export const reducer = autoparkSlice.reducer
