import { NextPageContext as INextPageContext } from 'next'

export type TAuthData = {
  oneTime: {
    jwt: {
      isAuthorized: boolean;
      _service: {
        isErrored: boolean;
        message?: string;
      };
    };
  };
}
export type TBaseProps = {
  authData: TAuthData;
  devTools: {
    isClientPerfWidgetOpened: boolean;
  };
  langData: {
    fromCookies: string | undefined;
    default: string;
  };
  themeData: {
    fromCookies: string | undefined;
    default: string;
  };
  errors: string[];
}

export interface IPageContext extends INextPageContext {
  req: any;
}
