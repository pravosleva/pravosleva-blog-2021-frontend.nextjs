import jwt from 'jsonwebtoken'
import { hasInSuppoerLocales } from '~/store/reducers/lang'
import { TBaseProps, TAuthData } from './types'
import Cookie from 'js-cookie' // Импортируем обратно для клиентской части

export const initialBaseProps: TBaseProps = {
  authData: {
    oneTime: { jwt: { isAuthorized: false, _service: { isErrored: false }, data: null } },
  },
  devTools: { isClientPerfWidgetOpened: false },
  langData: { fromCookies: undefined, default: 'ru-RU' },
  themeData: { fromCookies: undefined, default: 'light' },
  errors: [],
}

// Универсальный парсер кук для Next.js (Сервер + Клиент)
const getCookieValues = (ctx: any) => {
  // 1. Если мы на сервере (есть объект req)
  if (ctx.req) {
    if (ctx.req.cookies) return ctx.req.cookies

    const rawCookie = ctx.req.headers?.cookie
    if (!rawCookie) return {}

    return Object.fromEntries(
      rawCookie.split(';').map((v: string) => v.trim().split('='))
    )
  }

  // 2. Если мы на клиенте (переход по сайту через Next Link)
  if (typeof window !== 'undefined') {
    return {
      lang: Cookie.get('lang'),
      theme: Cookie.get('theme'),
      'autopark-2022.jwt': Cookie.get('autopark-2022.jwt')
    }
  }

  return {}
}

export const getInitialPropsBase = async (ctx: any): Promise<TBaseProps> => {
  const { query } = ctx
  const tg_chat_id = query?.tg_chat_id
  const open_clent_perf_widget = query?.open_clent_perf_widget

  // Получаем куки независимо от того, где вызван метод (SSR или клиентский переход)
  const cookies = getCookieValues(ctx)
  const errors: string[] = []

  // 1. Авторизация (работает только при наличии данных)
  let isAuthorized = false
  let jwtData = null
  let authMessage = 'Not authorized'

  const authCookieName = 'autopark-2022.jwt'
  const secretKey = 'super-secret'

  if (cookies[authCookieName]) {
    try {
      // Верификация JWT безопасна на сервере, на клиенте в SPA переходах 
      // лучше пропустить или обработать аккуратно, чтобы не тащить jsonwebtoken в клиентский бандл.
      // Next.js 11 может ругаться, если jwt импортируется на клиенте.
      if (ctx.req) {
        const decodedToken = jwt.verify(cookies[authCookieName], secretKey) as any
        if (decodedToken?.chat_id) {
          jwtData = { chat_id: decodedToken.chat_id }
          authMessage = `Authorized: chat_id detected from jwt: ${decodedToken.chat_id}`
          isAuthorized = String(decodedToken.chat_id) === String(tg_chat_id)
        }
      } else {
        // Если на клиенте — берем данные из стейта или куки без верификации секретным ключом
        authMessage = 'Client side routing: verification skipped'
      }
    } catch (err: any) {
      authMessage = err?.message || 'JWT verification failed'
      errors.push(`Ошибка авторизации #AUTH_001: ${authMessage}`)
    }
  }

  // 2. Язык
  let langFromCookie: string | undefined = undefined
  const langCookieName = 'lang'
  if (cookies[langCookieName] && hasInSuppoerLocales(cookies[langCookieName])) {
    langFromCookie = cookies[langCookieName]
  }

  // 3. Тема (Теперь гарантированно не теряется при переходах!)
  let themeFromCookie: string | undefined = undefined
  const themeCookieName = 'theme'
  if (cookies[themeCookieName]) {
    themeFromCookie = cookies[themeCookieName]
  }

  return {
    authData: {
      oneTime: {
        jwt: {
          isAuthorized,
          data: jwtData,
          _service: { isErrored: errors.length > 0, message: authMessage }
        }
      }
    },
    devTools: {
      isClientPerfWidgetOpened: open_clent_perf_widget === '1',
    },
    langData: { fromCookies: langFromCookie, default: 'ru-RU' },
    themeData: { fromCookies: themeFromCookie, default: 'light' },
    errors,
  }
}
