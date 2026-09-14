import React, { useMemo } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Store } from 'redux'
import { NextPageContext } from 'next'
import axios from 'axios'
import { Alert, Button, Container, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Link from '~/components/Link'
import { TheProject } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { IRootState } from '~/store/IRootState'
import { setActiveProject, setIsOneTimePasswordCorrect, setUserCheckerResponse } from '~/store/reducers/autopark'
import { CreateNewItem } from '~/components/Autopark2022/components/TheProject/components/CreateNewItem'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { AuthorizationRequired401Svg } from '~/components/special-svg-content/error/AuthorizationRequired401Svg'
import { Layout } from '~/components/Layout/Layout'
import { NoInternetConnectionSvg } from '~/components/special-svg-content/error/NoInternetConnectionSvg'
import { autoparkHttpClient, EAPIUserCode } from '~/utils/autoparkHttpClient'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true })

type TPageService = {
  isOk: boolean;
  message?: string;
  hasAuthenticated: boolean;
}

interface IMyProjectDetailProps {
  userCheckerResponse: any;
  projectDataResponse: any | null;
  errorMsg: string | null;
  chat_id: string;
  project_id: string;
  _pageService: TPageService;
  statusCode?: number;
  isOffline: boolean;
}

export default function MyProjectDetail({
  userCheckerResponse,
  projectDataResponse,
  errorMsg,
  chat_id,
  project_id,
  _pageService,
  statusCode,
  isOffline
}: IMyProjectDetailProps) {
  const items = useSelector((state: IRootState) => state.autopark.activeProject?.items || [])
  const hasItems = useMemo(() => items.length > 0, [items])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const baseProps = useSelector((s: IRootState) => s.baseProps)

  // =========================================================================
  // 🚨 ЖЕСТКИЙ БАРЬЕР ПРИВАТНОСТИ ДЛЯ ИНКОГНИТО (АНТИ-ОБХОД)
  // =========================================================================
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
        </UniversalContainer>
      </Layout>
    )
  }

  // =========================================================================
  // 🛡️ ЗАЩИТНЫЙ БАРЬЕР UI-СЛОЯ ОШИБОК И АВТОРИЗАЦИИ (Стандартизация под SVG 401)
  // =========================================================================
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
          }}>{JSON.stringify({ _pageService, baseProps }, null, 2)}</pre>
        </UniversalContainer>
      </>
    )
  }

  if (errorMsg || !_pageService?.isOk) {
    return (
      <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
        <AuthorizationRequired401Svg message={errorMsg || _pageService?.message || 'Неизвестная ошибка рантайма.'} />
        <pre style={{
          fontSize: 'x-small',
          whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
          wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
        }}>{JSON.stringify({ _pageService, baseProps }, null, 2)}</pre>
      </UniversalContainer>
    )
  }

  return (
    <>
      <Head>
        <title>{projectDataResponse?.name || 'My Car'}</title>
        {/* Жесткий запрет индексации приватного проекта в Google / Яндекс */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_id=${project_id}&project_type=autopark`} />
      </Head>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100dvh' }}>
        <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2>{projectDataResponse?.name || 'ERR: Noname'}</h2>

          <TheProject chat_id={chat_id} project_id={project_id} />

          {!hasItems && (
            <Alert sx={{ p: 2, mt: 2 }} variant="standard" severity="error">
              Пока нет расходников
            </Alert>
          )}

          <pre style={{ fontSize: 'x-small',
            whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
            wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
          }}>{JSON.stringify({ _pageService, baseProps }, null, 2)}</pre>
        </Container>
        
        <div
          style={{
            marginTop: 'auto',
            position: 'sticky',
            bottom: '0px',
            zIndex: 2,
            padding: '16px',
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            borderTop: '1px solid lightgray',
          }}
          className='backdrop-blur--lite'
        >
          <Grid container spacing={2}>
            {isOneTimePasswordCorrect && (
              <Grid item xs={12}>
                <CreateNewItem chat_id={chat_id} project_id={project_id} />
              </Grid>
            )}
            <Grid item xs={hasItems ? 6 : 12}>
              <Button
                startIcon={<ArrowBackIcon />}
                endIcon={!_pageService.hasAuthenticated ? <LockIcon /> : <LockOpenIcon />}
                variant='outlined'
                color='primary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}?from=${encodeURIComponent(`/autopark-2022/${chat_id}/${project_id}`)}&to=${encodeURIComponent(`/autopark-2022/${chat_id}`)}`}
                shallow
                fullWidth
              >
                Гараж
              </Button>
            </Grid>
            {hasItems && (
              <Grid item xs={6}>
                <Button
                  endIcon={<ArrowForwardIcon />}
                  variant='contained'
                  color='secondary'
                  component={Link}
                  noLinkStyle
                  href={`/autopark-2022/${chat_id}/${project_id}/report`}
                  shallow
                  fullWidth
                >
                  Отчет
                </Button>
              </Grid>
            )}
          </Grid>
        </div>
      </div>
    </>
  )
}

MyProjectDetail.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IMyProjectDetailProps | any> => {
    const { query } = ctx
    
    // 1. Снайперская валидация входящих параметров
    const isQueryValidNumber = typeof query?.tg_chat_id === 'string' && !Number.isNaN(Number(query.tg_chat_id))
    const chat_id = isQueryValidNumber ? String(query?.tg_chat_id) : undefined
    const project_id = typeof query?.project_id === 'string' ? query.project_id : ''
    
    let errorMsg: string | null = null
    let statusCode = 200
    let userDataResult = null
    let projectDataResult = null
    let isOffline = false

    // Базовый рубеж защиты: если chat_id невалиден — сразу выкидываем ошибку 400
    if (!chat_id) {
      if (ctx.res) ctx.res.statusCode = 400
      return {
        userCheckerResponse: { ok: false },
        projectDataResponse: null,
        errorMsg: null,
        chat_id: String(query?.tg_chat_id || ''),
        project_id,
        _pageService: { isOk: false, hasAuthenticated: false, message: `Incorrect page param (number expected), received: \`${query?.tg_chat_id}\`` },
        statusCode: 400,
        isOffline: false
      }
    }

    let baseProps = null
    try {
      // Собираем базовые пропсы авторизации и сессии движка
      baseProps = await getInitialPropsBase(ctx)
    } catch (baseErr: any) {
      // Если упал даже базовый метод — интернет полностью отсутствует
      isOffline = true
    }

    // КЛИЕНТСКИЙ + СЕРВЕРНЫЙ МОСТ АВТОРИЗАЦИИ (ИДЕМПОТЕНТНОСТЬ)
    let isAuthorized = baseProps?.authData?.oneTime?.jwt?.isAuthorized === true
    
    // =========================================================================
    // 🛡️ КЛИЕНТСКИЙ МОСТ АВТОРИЗАЦИИ (ИДЕМПОТЕНТНОСТЬ SPA-РОУТИНГА)
    // =========================================================================
    // TODO [SECURITY]: 1/2 Текущая проверка через .includes() является поверхностной 
    // и уязвимой для подделки (XSS / манипуляции в консоли).
    // Необходима доработка на строгий парсинг токена или вызов валидатора.
    if (typeof window !== 'undefined' && !isAuthorized) {
      const hasAuthCookie = document.cookie.includes('token') || document.cookie.includes('autopark-2022.jwt') || document.cookie.includes('session');
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
        project_id,
        _pageService: { isOk: false, hasAuthenticated: false },
        statusCode: 302,
        isOffline: false
      }
    }

    // =========================================================================
    // 📡 БЕЗОПАСНЫЙ СБОР ДАННЫХ И ПЕРЕХВАТ ИСКЛЮЧЕНИЙ СЕТИ (TRY / CATCH)
    // =========================================================================
    if (!isOffline) {
      try {
        store.dispatch(setIsOneTimePasswordCorrect(true))

        // 1. Делаем запрос к строго типизированному API-клиенту для валидации пользователя
        userDataResult = await autoparkHttpClient.getUserData({
          tg: {
            chat_id: Number(chat_id),
          }
        })
        
        // Перехват маркера сетевого сбоя, сгенерированного клиентом
        if (userDataResult?.code === EAPIUserCode.ServerError) {
          throw new Error(userDataResult.message || 'Network Error')
        }

        if (userDataResult?.ok === true || userDataResult?.ok === false) {
          store.dispatch(setUserCheckerResponse(userDataResult))
        }
        
        // Если пользователя физически нет в базе данных Telegram-бота
        if (userDataResult?.code === EAPIUserCode.NotFound) {
          if (ctx.res) ctx.res.statusCode = 401
          statusCode = 401
        }

        // 2. Сбор данных по автомобилю/проекту (Только если пользователь существует)
        if (!errorMsg && statusCode !== 401) {
          // Здесь мы пока оставляем прямой вызов axios.post, но оборачиваем в безопасную проверку
          const projectRes = await api.post('/project/get-data', { chat_id: Number(chat_id), project_id })
          
          if (projectRes.status === 0 || !projectRes.data || projectRes.data?.code === 'server_error') {
            throw new Error('Network Error or Upstream Server Error')
          }
          
          projectDataResult = projectRes.data

          if (typeof projectDataResult === 'string') {
            errorMsg = projectDataResult
          }
        }

        if (!!projectDataResult?.ok && !!projectDataResult?.projectData) {
          store.dispatch(setActiveProject(projectDataResult.projectData))
        }

      } catch (netError: any) {
        // Ловим любые падения сокетов, тайм-ауты или ENOTFOUND
        console.error('🚨 [getInitialProps]: Сбой сетевого соединения на странице машины.', netError)
        isOffline = true
        statusCode = 503 // Статус Service Unavailable для поисковых ботов
      }
    }

    const _pageService: TPageService = {
      isOk: !errorMsg && statusCode === 200 && !isOffline,
      hasAuthenticated: isAuthorized,
      message: errorMsg || undefined
    }

    if (baseProps) {
      setCommonStore({ store, baseProps })
    }

    return {
      userCheckerResponse: userDataResult || { ok: false },
      projectDataResponse: projectDataResult?.projectData || null,
      errorMsg,
      isUserExists: userDataResult ? userDataResult.ok : false,
      chat_id,
      project_id,
      _pageService,
      statusCode,
      isOffline,
    }
  }
)