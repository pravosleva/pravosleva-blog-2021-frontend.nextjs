export type TReqStateCode = 'pending' | 'rejected_req' | 'rejected_res' | 'fulfilled';
export type TResponseDetailsInfo = {
  status?: number;
  res?: any;
}
export type TRequestDetailsInfo = {
  req?: any;
  comment?: string;
}


export namespace NViDevtools {
  export type TNetworkXHR = {
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
    __reportsLimit: number;
    socket: {
      __isConnectionIgnoredForUI: boolean,
      isConnected: boolean;
    };
    xhr: TNetworkXHR;
  };
}
