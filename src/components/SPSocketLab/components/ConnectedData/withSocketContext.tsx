// import { Socket } from 'socket.io-client'
import createFastContext from '~/context/createFastContext'
import {
  OptionsObject as IOptionsObject,
} from 'notistack'

export type TSocketMicroStore = {
  isConnected: boolean;
  isConnectedToPrivateRoom: boolean;
  reportItems: any[];
  
  imeiFilter: string | null;
}
export const initialState = {
  isConnected: false,
  isConnectedToPrivateRoom: false,
  reportItems: [],

  imeiFilter: null,
}
const { Provider, useStore } = createFastContext<TSocketMicroStore>(initialState);

export const WithSocketContext = ({ children }: any) => {
  return (
    <Provider>
      {children}
    </Provider>
  )
}

export namespace NEvent {
  export enum ServerIncoming {
    TEST = 'lab:client:tst-action',
    WANNA_BE_CONNECTED_TO_ROOM = 'lab:client:wanna-be-connected-to-room',
    WANNA_BE_DISCONNECTED_FROM_ROOM = 'lab:client:wanna-be-disconnected-from-room',
  }
  export enum ServerOutgoing {
    TEST = 'lab:server:tst-action',
    SOMEBODY_CONNECTED_TO_ROOM = 'lab:server:somebody-connected',
    COMMON_MESSAGE = 'lab:server:common-message',
    SP_TRADEIN_REPORT_EV = 'sp-tradein-report:s:event',
    SP_TRADEIN_REPLACE_REPORTS = 'sp-tradein-report:s:replace-reports',
    SP_TRADEIN_COMMON_MESSAGE = 'sp-tradein-report:s:common-message',
  }

  type TPerfInfoItem = {
    name: string;
    descr: string;
    p: number;
    ts: number;
    data?: {
      __eType: string;
      // name: string;
      input: {
        room: string;
        appVersion: string;
        metrixEventType: string;
        stateValue: string;
      };
    };
  }
  export enum EReportType {
    DEFAULT = 'default',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
    SUCCESS = 'success',
  }
  export type TReport = {
    imei?: string;
    ts: number;
    room: number;
    appVersion: string;
    metrixEventType: string;
    reportType: EReportType;
    stateValue: string;

    stepDetails?: {
      [key: string]: any;
    };
    _wService?: {
      _perfInfo: {
        tsList: TPerfInfoItem[];
      };
    };
  }
  export type TIncomingDataFormat = {
    report: TReport;
    message?: string;
    notistackProps?: Partial<IOptionsObject>;
  }
}

export {
  useStore,
}
