import jwt from 'jsonwebtoken'

type TAuthData = {
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
type TBaseProps = {
  authData: TAuthData;
  devTools: {
    isClientPerfWidgetOpened: boolean;
  },
}

export const getInitialPropsBase = async (ctx: any): Promise<TBaseProps> => {
  // const { req, query } = ctx
  const { query: { tg_chat_id, open_clent_perf_widget } } = ctx
  const authData: TAuthData = {
    oneTime: {
      jwt: {
        isAuthorized: false,
        _service: {
          isErrored: false,
        },
      },
    }
  }

  try {
    const { cookies } = ctx.req
    const authCookieName = 'autopark-2022.jwt'
    const secretKey = 'super-secret'
    if (!!cookies[authCookieName]) {
      const decodedToken: any = jwt.verify(cookies[authCookieName], secretKey)
      if (decodedToken?.chat_id === tg_chat_id) {
        authData.oneTime.jwt.isAuthorized = true
      } else {
        authData.oneTime.jwt.isAuthorized = false
      }
    }
  } catch (err: any) {
    console.log(err)
    authData.oneTime.jwt.isAuthorized = false
    authData.oneTime.jwt._service.message = err?.message || 'No err.message'
  }

  return {
    // NOTE: custom props...
    // req,
    // query,
    // baseProp1: 1,
    // baseProp2: 1,
    // baseProp3: 1,

    authData,
    devTools: {
      isClientPerfWidgetOpened: open_clent_perf_widget === '1',
    },
  };
}
