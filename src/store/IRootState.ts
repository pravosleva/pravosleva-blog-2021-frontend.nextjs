import { Store } from 'redux'
// import { IToast } from '@/actions'
import { TState as TTodo2023State } from './reducers/todo2023'

type TProject = {
  name: string;
  description: string;
  items: any[];
}

export interface IRootState extends Store {
  [x: string]: any;
  // toaster: {
  //   items: IToast[];
  // };
  autopark: {
    activeProject: {
      [key: string]: any;
    } | null;
    userCheckerResponse: {
      ok: boolean;
      message?: string;
      password?: number;
      projects?: {
        [key: string]: TProject;
      }
    } | null;
    x: number;
    isOneTimePasswordCorrect: boolean;
  };
  todo2023: TTodo2023State;
}
