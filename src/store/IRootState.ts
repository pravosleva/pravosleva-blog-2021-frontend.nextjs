import { Store } from 'redux'
// import { IToast } from '@/actions'
import { TAudit } from '~/components/ToDo2023.offline/state'

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
  todo2023: {
    localAudits: TAudit[];
    // TODO: remoteAudits: TAudit[];
  };
}
