import jwt from 'jsonwebtoken'
import { hasInSuppoerLocales } from '~/store/reducers/lang'
import Cookie from 'js-cookie'
import { TBaseProps, TAuthData } from './types'

export const initialBaseProps = {
  authData: {
    oneTime: {
      jwt: {
        isAuthorized: false,
        _service: {
          isErrored: false,
        },
      },
    },
  },
  devTools: {
    isClientPerfWidgetOpened: false,
  },
  langData: {
    fromCookies: undefined,
    default: 'ru-RU',
  },
  themeData: {
    fromCookies: undefined,
    default: 'light',
  },
  errors: [],
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
  const langData = {
    fromCookies: undefined,
    default: 'ru-RU',
  }
  const themeData = {
    fromCookies: undefined,
    default: 'light',
  }
  const errors = []
  
  // NOTE: 1. Auth
  const authCookieName = 'autopark-2022.jwt'
  const secretKey = 'super-secret'
  try {
    const { cookies } = ctx.req
    if (!!cookies[authCookieName]) {
      const decodedToken: any = jwt.verify(cookies[authCookieName], secretKey)
      if (decodedToken?.chat_id === tg_chat_id) {
        authData.oneTime.jwt.isAuthorized = true
      } else {
        authData.oneTime.jwt.isAuthorized = false
      }
    }
  } catch (err: any) {
    authData.oneTime.jwt.isAuthorized = false
    authData.oneTime.jwt._service.message = err?.message || 'No err.message'
    errors.push(`Ошибка авторизаии #AUTH_001: ${err?.message || 'No err.message'}`)
  }

  // NOTE: 2. Lang
  const langCookieName = 'lang'
  try {
    const { cookies } = ctx.req
    if (!!cookies[langCookieName] && hasInSuppoerLocales(cookies[langCookieName])) {
      langData.fromCookies = cookies[langCookieName]
    }
  } catch (err: any) {
    errors.push(`Ошибка определения языка #LANG_001: ${err?.message || 'No err.message'}`)
  }

  // NOTE: 3. Theming
  const themeCookieName = 'theme'
  try {
    switch (true) {
      case typeof ctx.req !== 'undefined':
        let { cookies } = ctx.req
        if (!!cookies[themeCookieName]) {
          themeData.fromCookies = cookies[themeCookieName]
        }
        break
      case typeof window !== 'undefined':
        try {
          const theme = Cookie.get(themeCookieName)

          // @ts-ignore
          if (typeof theme === 'string') themeData.fromCookies = theme
        } catch (err: any) {
          throw new Error(
            [
              'Тема не определена на клиенте',
              err?.message || 'No err?.message'
            ].join(' / ')
          )
        }
        break
      default:
        break
    }
    
  } catch (err: any) {
    errors.push(`Ошибка определения темы #THEME_001: ${err?.message || 'No err.message'}`)
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
    langData,
    themeData,
    errors,
  };
}
