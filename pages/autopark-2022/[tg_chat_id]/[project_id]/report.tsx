import * as React from 'react'
import Head from 'next/head'
import { Store } from 'redux'
import { NextPageContext } from 'next'
import axios from 'axios'
import { Button, Container, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Link from '~/components/Link'
import { Report } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { TUserCheckerResponse, setActiveProject, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { AuthorizationRequired401Svg } from '~/components/special-svg-content/error/AuthorizationRequired401Svg'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

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

interface IMyProjectReportProps {
  userCheckerResponse: TUserCheckerResponse;
  projectDataResponse: {
    name: string;
    description: string;
  } | null;
  errorMsg: string | null;
  chat_id: string;
  project_id: string;
  _pageService: TPageService;
  statusCode?: number;
}

export default function MyProjectReport({
  userCheckerResponse,
  projectDataResponse,
  errorMsg,
  chat_id,
  project_id,
  _pageService,
  statusCode
}: IMyProjectReportProps) {
  const isBrowser = typeof window !== 'undefined'
  const baseProps = useSelector((s: IRootState) => s.baseProps)

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
            message={_pageService?.message || `Пользователя ${chat_id} не существует. Требуется авторизация через Telegram-бот.`} 
          />
        </UniversalContainer>
      </>
    )
  }

  if (errorMsg || !_pageService?.isOk) {
    return (
      <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
        <AuthorizationRequired401Svg message={errorMsg || _pageService?.message || 'Неизвестная ошибка рантайма.'} />
      </UniversalContainer>
    )
  }

  return (
    <>
      <Head>
        <title>{projectDataResponse?.name || 'My Car'} | Отчет</title>
        {/* Жёсткий запрет индексации приватного отчёта в поисковиках */}
        <meta name="robots" content="noindex, nofollow" />
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_id=${project_id}&project_name=${encodeURIComponent(projectDataResponse?.name || 'My Car')}&project_type=autopark_report`} />
        <meta name="application-name" content={projectDataResponse?.name || 'My Car'} />
        <meta name="apple-mobile-web-app-title" content={projectDataResponse?.name || 'My Car'} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100dvh', width: '100%' }}>
        <Container maxWidth="xs" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2>{projectDataResponse?.name || 'ERR: Noname'}</h2>

          {isBrowser && <Report chat_id={chat_id} project_id={project_id} />}

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
            <Grid item xs={12}>
              <Button
                startIcon={<ArrowBackIcon />}
                endIcon={!_pageService.hasAuthenticated ? <LockIcon /> : <LockOpenIcon />}
                variant='contained'
                color='secondary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}/${project_id}?from=${encodeURIComponent(`/autopark-2022/${chat_id}/${project_id}/report`)}&to=${encodeURIComponent(`/autopark-2022/${chat_id}/${project_id}`)}`}
                shallow
                fullWidth
              >
                {projectDataResponse?.name || 'Project'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<ArrowBackIcon />}
                endIcon={!_pageService.hasAuthenticated ? <LockIcon /> : <LockOpenIcon />}
                variant='outlined'
                color='primary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}?from=${encodeURIComponent(`/autopark-2022/${chat_id}/${project_id}/report`)}&to=${encodeURIComponent(`/autopark-2022/${chat_id}`)}`}
                shallow
                fullWidth
              >
                Гараж
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}

MyProjectReport.getInitialProps = wrapper.getInitialPageProps(
  (store: Store) => async (ctx: NextPageContext): Promise<IMyProjectReportProps | any> => {
    const { query } = ctx
    
    // Снайперская валидация параметра: проверяем, что пришла строка и она парсится в число
    const isQueryValidNumber = typeof query?.tg_chat_id === 'string' && !Number.isNaN(Number(query.tg_chat_id))
    const chat_id = isQueryValidNumber ? String(query?.tg_chat_id) : undefined
    const project_id = typeof query?.project_id === 'string' ? query.project_id : ''
    
    let errorMsg: string | null = null
    let statusCode = 200
    let userDataResult = null
    let projectDataResult = null

    // 1. Быстрая проверка JWT-сессии одноразового пароля
    const _pageService: TPageService = { isOk: true, hasAuthenticated: false }
    const baseProps = await getInitialPropsBase(ctx)

    // =========================================================================
    // 🛡️ КЛИЕНТСКИЙ + СЕРВЕРНЫЙ МОСТ АВТОРИЗАЦИИ НА СТРАНИЦЕ ОТЧЕТА
    // =========================================================================
    let isAuthorized = baseProps?.authData?.oneTime?.jwt?.isAuthorized === true

    // >>>>>>> [МАРКЕР НАЧАЛА]: ВТОРОЙ ВАРИАНТ (ФРОНТЕНД-ПАТЧ КЛИЕНТСКИХ КУК) >>>>>>>
    // КОГДА ЗАХОТИТЕ ПОПРОБОВАТЬ ПЕРВЫЙ ВАРИАНТ (БЭКЕНД ПАТЧ PATH=/), ПОЛНОСТЬЮ ЗАКОММЕНТИРУЙТЕ БЛОК НИЖЕ:
    if (typeof window !== 'undefined' && !isAuthorized) {
      const hasAuthCookie = document.cookie.includes('token') || 
                            document.cookie.includes('jwt') || 
                            document.cookie.includes('session')
      if (hasAuthCookie) {
        isAuthorized = true
      }
    }

    const reduxState = store.getState() as IRootState
    if (reduxState.autopark.isOneTimePasswordCorrect === true) {
      isAuthorized = true
    }
    // <<<<<<< [МАРКЕР КОНЦА]: КОНЕЦ БЛОКА КЛИЕНТСКОГО ПАТЧА ФРОНТЕНДА <<<<<<<

    /* -- NOTE: На случай когда захотим попробовать патч на стороене бэка:
    // В коде Express-бэкенда (pravosleva-bot-2021) при успешном check-password:
      res.cookie('your_jwt_cookie_name', token, {
        maxAge: 1000 * 60 * 60 * 24, // 24 часа
        httpOnly: true, // Защита от XSS
        secure: true, // Только по HTTPS
        sameSite: 'lax',
        path: '/', // 🔥 КРИТИЧЕСКИЙ ФИКС: Делает куку доступной для всего сайта!
      });
    -- */

    // Единый, оптимизированный блок сбора данных (Выполняется без дублирования!)
    if (!!chat_id) {
      // Синхронизируем флаг с Redux, чтобы соседние роуты знали об успешном входе
      if (isAuthorized) {
        store.dispatch(setIsOneTimePasswordCorrect(true))
      }

      // Проверяем существование аккаунта в ТГ-боте
      userDataResult = await api
        .post('/check-user', {
          tg: { chat_id: Number(chat_id) }
        })
        .then((res) => res.data)
        .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

      if (typeof userDataResult === 'string') {
        errorMsg = userDataResult
      }
      
      if (userDataResult?.code === 'not_found') {
        if (ctx.res) ctx.res.statusCode = 401
        statusCode = 401
      }

      // Сбор данных по автомобилю для шапки отчёта
      if (!errorMsg && statusCode !== 401) {
        projectDataResult = await api
          .post('/project/get-data', { chat_id: Number(chat_id), project_id })
          .then((res) => res.data)
          .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

        if (typeof projectDataResult === 'string') {
          errorMsg = projectDataResult
        }
      }
    }

    if (!!projectDataResult?.ok && !!projectDataResult.projectData) {
      store.dispatch(setActiveProject(projectDataResult.projectData))
    }

    switch (true) {
      case !chat_id:
        _pageService.isOk = false
        _pageService.message = `Incorrect page param (number expected), received: \`${query?.tg_chat_id}\``
        if (ctx.res) ctx.res.statusCode = 400
        statusCode = 400
        break
        
      case baseProps.authData.oneTime.jwt.isAuthorized:
        store.dispatch(setIsOneTimePasswordCorrect(true))
        break
        
      case baseProps.authData.oneTime.jwt._service.isErrored:
        _pageService.isOk = false
        _pageService.message = baseProps.authData.oneTime.jwt._service.message || 'ERR1 (No err.message)'
        if (ctx.res) ctx.res.statusCode = 401
        statusCode = 401
        break
        
      default:
        break
    }

    if (isAuthorized) _pageService.hasAuthenticated = true

    setCommonStore({ store, baseProps })

    return {
      userCheckerResponse: userDataResult || { ok: false },
      projectDataResponse: projectDataResult?.projectData || null,
      errorMsg,
      isUserExists: userDataResult ? userDataResult.ok : false,
      chat_id: chat_id || String(query?.tg_chat_id || ''), // Гарантируем тип string для UI шаблонов
      project_id,
      _pageService,
      statusCode
    }
  }
)
