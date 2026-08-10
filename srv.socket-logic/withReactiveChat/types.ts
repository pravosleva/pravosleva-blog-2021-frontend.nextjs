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
    RC_PING = 'from-client:reactive-chat:ping-join-room',
    RC_CHAT_MESSAGE = 'from-client:reactive-chat:message',
    RC_WEBRTC_SIGNAL = 'universal:reactive-chat:wertc-exp:signal',
  }
  export enum ServerOutgoing {
    RC_CHAT_MESSAGE = 'from-server:reactive-chat:message',

    RC_PONG_OK = 'from-server:reactive-chat:experimental-metrix:pong-ok',
    RC_PONG_ERR = 'from-server:reactive-chat:experimental-metrix:pong-err',
    RC_HISTORY = 'from-server:reactive-chat-2026:history',
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
    app: {
      name: string;
      version: string;
    };
    specialData: {
      message: string,
      userName: string;
    };
    // metrixEventType: string;
    reportType: EReportType;

    // uniquePageLoadKey?: string;
    gitSHA1?: string;
    specialClientKey?: string;
    _ip?: string;
    _geoip?: TGeoIpInfo;
    _userAgent?: string;
    _clientReferer?: string;
  }
}
