import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from "next-redux-wrapper"
import { IRootState } from '../IRootState';
import { TUserCheckerResponse } from '~/utils/autoparkHttpClient';

type TItem = {
  name: string;
  description: string;
}
type TProject = {
  name: string;
  description: string;
  items: TItem[];
}
type TProjects = {
  [key: string]: TProject;
} | undefined
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

export type TActiveProject = {
  [key: string]: any;
} | null
export type TState = {
  activeProject: TActiveProject;
  userCheckerResponse: TUserCheckerResponse | null;
  x: number;
  isOneTimePasswordCorrect: boolean;
}

export const initialState: TState = {
  activeProject: null,
  userCheckerResponse: null,
  x: 1,
  isOneTimePasswordCorrect: false,
}

export const autoparkSlice = createSlice({
  name: 'autopark',
  initialState,
  reducers: {
    setUserCheckerResponse: (state: TState, action: { payload: TUserCheckerResponse }) => {
      state.userCheckerResponse = action.payload
      state.x += 1
    },
    setActiveProject: (state: TState, action: { payload: TProject }) => {
      state.activeProject = action.payload
    },
    updateProjects: (state: TState, action: { payload: TUserCheckerResponse }) => {
      if (!state.userCheckerResponse) state.userCheckerResponse = action.payload
      else state.userCheckerResponse.projects = action.payload?.projects
    },
    setIsOneTimePasswordCorrect: (state: TState, action: { payload: boolean }) => {
      state.isOneTimePasswordCorrect = action.payload
    }
  },
  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action) => {
      // Явно приводим action к типу PayloadAction<TRootState>
      const hydrateAction = action as PayloadAction<IRootState>;
      
      return {
        ...state,
        ...hydrateAction.payload.autopark,
      };
    });
  },
})

export const {
  setUserCheckerResponse,
  setActiveProject,
  updateProjects,
  setIsOneTimePasswordCorrect,
} = autoparkSlice.actions

export const reducer = autoparkSlice.reducer
