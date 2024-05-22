export namespace NEvent {
  export enum ServerIncoming {
    SP_MX_EV = 'sp-mx:offline-tradein:c:event',
  }
  export enum ServerOutgoing {
    SP_MX_EV = 'sp-mx:offline-tradein:s:event',
    DONT_RECONNECT = 'custom:dont-reconnect',
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
        // ts: string;
        room: string;
        // reportType: EReportType;
        appVersion: string;
        metrixEventType: string;
        stateValue: string;
        // imei: string;
        stepDetails?: {
          [key: string]: any;
        };
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
    ts: string;
    room: string;
    appVersion: string;
    metrixEventType: string;
    reportType: EReportType;
    stateValue: string;
    stepDetails?: {
      [key: string]: any;
    };
    imei: string;
    tradeinId?: number | null;
    _wService?: {
      _perfInfo: {
        tsList: TPerfInfoItem[];
      };
    };
    uniquePageLoadKey?: string;
    uniqueUserDataLoadKey?: string;
  }
}
