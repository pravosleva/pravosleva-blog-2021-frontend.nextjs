// NOTE: fast-geoip@1.1.88
export type TGeoIpInfo = {
  range: [number, number];
  country: string;
  region: string;
  eu: '0' | '1';
  timezone: string;
  city: string;
  ll: [number, number];
  metro: number;
  area: number;
}

export namespace NEvent {
  export enum ServerIncoming {
    SP_MX_EV = 'sp-mx:offline-tradein:c:event',
    SP_HISTORY_REPORT_EV = 'sp-history:offline-tradein:c:report',
    _SP_HISTORY_REPORT_EV_DEPRECATED = 'sp-xhr-history:offline-tradein:c:report',
  }
  export enum ServerOutgoing {
    SP_MX_EV = 'sp-mx:offline-tradein:s:event',
    SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_OK = 'sp-mx:history-report:s:ok',
    SP_MX_SERVER_ON_HISTORY_REPORT_ANSWER_ERR = 'sp-mx:history-report:s:err',
    
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

      // -- NOTE: New report exp
      comment?: string;
      network?: NViDevtools.TNetwork;
      // --
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
    gitSHA1?: string;
    specialClientKey?: string;
    _ip?: string;
    _geoip?: TGeoIpInfo;
    _userAgent?: string;
    _clientReferer?: string;
  }
}



export namespace NViDevtools {
  // -- NOTE: This is the remote Front-end
  // See also src/utils/httpClient/API/types.ts
  export type TReqStateCode = 'pending' | 'rejected_req' | 'rejected_res' | 'fulfilled';
  export type TResponseDetailsInfo = {
    status?: number;
    res?: any;
  }
  export type TRequestDetailsInfo = {
    req?: any;
    comment?: string;
  }
  // --

  export type TNetworkXHR = {
    couldTheFullHistoryReportBeSent: boolean;
    total: {
      [key in TReqStateCode]: number;
    };
    state: {
      [key: string]: { // NOTE: url as key
        [key: string]: { // NOTE: ts as key
          code: TReqStateCode;
          __resDetails?: TResponseDetailsInfo;
          __reqDetails?: TRequestDetailsInfo;
        };
      };
    };
  };
  export type TNetwork = {
    xhr: TNetworkXHR;
  };
}
