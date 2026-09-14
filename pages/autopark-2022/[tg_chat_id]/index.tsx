import React, { useMemo } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Store } from 'redux'
import { Container } from '@mui/material'
import { wrapper } from '~/store'
import { IRootState } from '~/store/IRootState'
import { NextPageContext } from 'next'
import { Autopark2022 } from '~/components/Autopark2022'
import { OneTimeLoginFormBtn } from '~/components/Autopark2022/components/OneTimeLoginFormBtn'
import { CreateNewProject } from '~/components/Autopark2022/components/ProjectList/components/CreateNewProject'
import { setUserCheckerResponse, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { autoparkHttpClient, EAPIUserCode } from '~/utils/autoparkHttpClient'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { AuthorizationRequired401Svg } from '~/components/special-svg-content/error/AuthorizationRequired401Svg'
import { Layout } from '~/components/Layout/Layout'
import { NoInternetConnectionSvg } from '~/components/special-svg-content/error/NoInternetConnectionSvg'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

type TPageService = {
  isOk: boolean;
  message?: string;
  hasAuthenticated: boolean;
}

interface IMyProjectsProps {
  userCheckerResponse: any;
  errorMsg: string | null;
  chat_id: string;
  _pageService: TPageService;
  statusCode?: number;
  isOffline: boolean;
}

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  _pageService,
  statusCode,
  isOffline,
}: IMyProjectsProps) {
  const isBrowser = useMemo(() => typeof window !== 'undefined', [])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  // =========================================================================
  // 🚨 ЖЕСТКИЙ БАРЬЕР ПРИВАТНОСТИ ДЛЯ ИНКОГНИТО (АНТИ-ОБХОД)
  // =========================================================================
  // Если сервер или клиент выдали статус редиректа 302, либо авторизация ложна,
  // принудительно гасим рендер, пресекая Ghost-рендеринг приватных элементов!
  if (statusCode === 302 || !_pageService?.hasAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', fontFamily: 'Montserrat' }}>
        <span>Перенаправление на страницу авторизации...</span>
      </div>
    )
  }

  // =========================================================================
  // 📡 НОВОЕ: ВЕРХНИЙ ИЗОЛИРОВАННЫЙ ОФФЛАЙН-РУБЕЖ (Эффект No Internet)
  // =========================================================================
  if (isOffline) {
    return (
      <Layout>
        <UniversalContainer isForLayout={true} hasBreadcrumbs={false}>
          <NoInternetConnectionSvg 
            message="Не удалось загрузить данные профиля Autopark из-за отсутствия стабильного интернет-соединения. Проверьте сотовую связь." 
          />
          <pre style={{
            fontSize: 'x-small',
            whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
            wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
          }}>{JSON.stringify({ _pageService }, null, 2)}</pre>
        </UniversalContainer>
      </Layout>
    )
  }

  // =========================================================================
  // 🛡️ ЗАЩИТНЫЙ БАРЬЕР UI-СЛОЯ ОШИБОК И АВТОРИЗАЦИИ (Стандартизация под SVG 401)
  // =========================================================================
  // КЕЙС A: Пользователь не найден в базе данных бота Autopark
  if (userCheckerResponse?.code === 'not_found' || statusCode === 401) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </Head>
        <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
          <AuthorizationRequired401Svg 
            message={_pageService?.message || `Пользователя ${chat_id} не существует. Требуется инициализация сессии через Telegram-бот.`} 
          />
          <pre style={{
            fontSize: 'x-small',
            whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
            wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
          }}>{JSON.stringify({ _pageService }, null, 2)}</pre>
        </UniversalContainer>
      </>
    )
  }
  // КЕЙС Б: Системная ошибка рантайма / падение базы данных
  if (errorMsg || !_pageService?.isOk) {
    return (
      <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
        <AuthorizationRequired401Svg message={errorMsg || _pageService?.message || 'Неизвестная ошибка рантайма.'} />
        <pre style={{
          fontSize: 'x-small',
          whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
          wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
        }}>{JSON.stringify({ _pageService }, null, 2)}</pre>
      </UniversalContainer>
    )
  }

  return (
    <>
      <Head>
        <title>AutoPark | Панель управления</title>
        {/* Жёсткий запрет индексации приватной панели роботами */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_type=autopark`} />
      </Head>
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs" style={{ paddingTop: '24px' }}>
          <Autopark2022 chat_id={chat_id} />
        </Container>
        
        {isBrowser && (
          <div
            style={{
              marginTop: 'auto',
              position: 'sticky',
              bottom: '0px',
              zIndex: 2,
              padding: '16px',
              paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            }}
            className='backdrop-blur--lite'
          >
            {isOneTimePasswordCorrect ? (
              <CreateNewProject chat_id={chat_id} />
            ) : (
              <OneTimeLoginFormBtn chat_id={chat_id} />
            )}
          </div>
        )}
      </div>
    </>
  )
}

MyProjects.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IMyProjectsProps | any> => {
    const { query } = ctx
    
    // Проверяем, что пришла строка и она преобразуется в валидное число
    const isQueryValidNumber = typeof query?.tg_chat_id === 'string' && !Number.isNaN(Number(query.tg_chat_id))

    // Для логики и сетевых запросов используем чистую строку, если она валидна
    const chat_id = isQueryValidNumber ? String(query?.tg_chat_id) : undefined
    
    let errorMsg: string | null = null
    let statusCode = 200
    let result = null
    let isOffline = false

    // Базовый рубеж защиты: если chat_id невалиден — сразу выкидываем ошибку 400
    if (!chat_id) {
      if (ctx.res) ctx.res.statusCode = 400
      return {
        userCheckerResponse: { ok: false },
        errorMsg: null,
        isUserExists: false,
        chat_id: String(query?.tg_chat_id || ''),
        _pageService: {
          isOk: false,
          hasAuthenticated: false,
          message: `Неверный параметр идентификатора (ожидалось число), получено: \`${query?.tg_chat_id}\``
        },
        statusCode: 400,
        isOffline: false
      }
    }

    let baseProps = null
    try {
      // Собираем базовые пропсы авторизации и сессии движка
      baseProps = await getInitialPropsBase(ctx)
    } catch (baseErr: any) {
      // Если упал метод ядра — сеть полностью отсутствует
      console.error('🚨 [getInitialProps]: Сбой ядра из-за отсутствия сети.', baseErr)
      isOffline = true
    }

    // КЛИЕНТСКИЙ + СЕРВЕРНЫЙ МОСТ АВТОРИЗАЦИИ (ИДЕМПОТЕНТНОСТЬ)
    let isAuthorized = baseProps?.authData?.oneTime?.jwt?.isAuthorized === true
    
    // TODO [SECURITY]: 2/2 Текущая проверка через .includes() является поверхностной 
    // и уязвимой для подделки (XSS / манипуляции в консоли).
    // Необходима доработка на строгий парсинг токена или вызов валидатора.
    if (typeof window !== 'undefined' && !isAuthorized) {
      // 🔥 КРИТИЧЕСКИЙ ФИКС: Синхронизируем имя куки 'autopark-2022.jwt' с кодом карточки машины!
      const hasAuthCookie = document.cookie.includes('token') || 
                            document.cookie.includes('jwt') || 
                            document.cookie.includes('autopark-2022.jwt') || 
                            document.cookie.includes('session');
      if (hasAuthCookie) isAuthorized = true
    }

    const reduxState = store.getState() as IRootState
    if (reduxState.autopark.isOneTimePasswordCorrect === true) {
      isAuthorized = true
    }

    // РЕДИРЕКТ НА СТРАНИЦУ ВХОДА (Если сети нет — редирект блокируется, уступая место оффлайн экрану)
    if (!isAuthorized && !isOffline) {
      const currentPath = ctx.req ? ctx.req.url : window.location.pathname + window.location.search
      const backUrl = typeof query.from === 'string' ? query.from : currentPath
      const successUrl = typeof query.to === 'string' ? query.to : currentPath
      const redirectTarget = [
        '/auth/login',
        '?',
        [
          !!backUrl ? `from=${encodeURIComponent(backUrl)}` : '',
          (!!backUrl && !successUrl) ? 'back_is_locked_when_unlogged=1' : '',
          !!successUrl ? `to=${encodeURIComponent(successUrl)}` : '',
          `chat_id=${chat_id}`
        ].join('&')
      ].join('')

      if (ctx.res) {
        ctx.res.writeHead(302, { Location: redirectTarget })
        ctx.res.end()
      } else {
        const Router = require('next/router').default
        Router.push(redirectTarget)
      }

      return {
        userCheckerResponse: { ok: false },
        projectDataResponse: null,
        errorMsg: 'Redirecting to login...',
        chat_id,
        // project_id,
        _pageService: { isOk: false, hasAuthenticated: false },
        statusCode: 302,
        isOffline: false
      }
    }

    // БЕЗОПАСНЫЙ СБОР ДАННЫХ И ПЕРЕХВАТ ИСКЛЮЧЕНИЙ СЕТИ (TRY / CATCH)
    if (!isOffline) {
      try {
        // 1. Делаем запрос к строго типизированному API-клиенту
        result = await autoparkHttpClient.getUserData({
          tg: {
            chat_id: Number(chat_id),
          }
        })

        // 2. ИСПРАВЛЕНО: Проверяем маркер сетевого сбоя, который сгенерировал сам клиент
        if (result?.code === EAPIUserCode.ServerError) {
          throw new Error(result.message || 'Network Error')
        }

        // Синхронизируем ответ с Redux-хранилищем
        if (result?.ok === true || result?.ok === false) {
          store.dispatch(setUserCheckerResponse(result))
        }
        
        // Если пользователя физически нет в базе данных Telegram-бота
        if (result?.code === EAPIUserCode.NotFound) {
          if (ctx.res) ctx.res.statusCode = 401
          statusCode = 401
        }

      } catch (netError: any) {
        // Ловим любые падения сокетов, тайм-ауты или ENOTFOUND
        console.error('🚨 [getInitialProps]: Ошибка интернет-соединения при запросе профиля.', netError)
        isOffline = true
        statusCode = 503 // Статус Service Unavailable для поисковых ботов
      }
    }

    // 2. Логика быстрой проверки JWT-токенов одноразового пароля
    const _pageService: TPageService = {
      isOk: !errorMsg && statusCode === 200 && !isOffline,
      hasAuthenticated: isAuthorized,
    }
    
    // Блок switch(true) выполняется строго если мы в сети
    if (!isOffline && baseProps) {
      switch (true) {
        case baseProps.authData.oneTime.jwt.isAuthorized:
          _pageService.hasAuthenticated = true
          store.dispatch(setIsOneTimePasswordCorrect(true))
          break
          
        case baseProps.authData.oneTime.jwt._service.isErrored:
          _pageService.hasAuthenticated = false
          _pageService.message = baseProps.authData.oneTime.jwt._service.message || 'Ошибка авторизации сессии (JWT Errored)'
          if (ctx.res) ctx.res.statusCode = 401
          statusCode = 401
          break
          
        default:
          break
      }
    }

    if (baseProps) {
      setCommonStore({ store, baseProps })
    }

    return {
      userCheckerResponse: result || { ok: false },
      errorMsg,
      isUserExists: result ? result.ok : false,
      chat_id,
      _pageService,
      statusCode,
      isOffline,
    }
  }
)
