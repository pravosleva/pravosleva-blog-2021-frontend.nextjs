import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
// import { IRootState } from '~/store/IRootState'

type TItem = {
  name: string;
  description: string;
}
type TProject = {
  name: string;
  description: string;
  items: TItem[];
}
enum EAPIUserCode {
  UserExists = 'already_exists',
  IncorrecrParams = 'incorrect_params',
  IncorrecrBody = 'incorrect_body',
  Updated = 'updated',
  Created = 'created',

  NotFound = 'not_found',
  IncorrectUserName = 'incorrect_username',
  Removed = 'removed',
  ServerError = 'server_error'
}

// enum EAPIRoomCode {
//   RoomExists = 'room_exists',
//   IncorrecrParams = 'incorrect_params',
//   NotFound = 'not_found'
// }
export type TUserCheckerResponse = {
  ok: boolean;
  code: EAPIUserCode; // 'not_found' | 'server_error' | 'already_exists' | 'incorrect_params';
  message?: string;
  password?: number;
  projects?: {
    [key: string]: TProject;
  }
} | null
export type TActiveProject = {
  [key: string]: any;
} | null
export type TState = {
  activeProject: TActiveProject;
  userCheckerResponse: TUserCheckerResponse;
  x: number;
  isOneTimePasswordCorrect: boolean;
}

export const initialState: TState = {
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
