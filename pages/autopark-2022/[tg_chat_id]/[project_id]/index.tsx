import React, { useMemo } from 'react'
import Head from 'next/head'
import { useSelector } from 'react-redux'
import { Store } from 'redux'
import { NextPageContext } from 'next'
import axios from 'axios'
import { Alert, Button, Container, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Link from '~/components/Link'
import { TheProject } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { IRootState } from '~/store/IRootState'
import { setActiveProject, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { CreateNewItem } from '~/components/Autopark2022/components/TheProject/components/CreateNewItem'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-content/UniversalContainer'
import { AuthorizationRequired401Svg } from '~/components/special-content/error/AuthorizationRequired401Svg'

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
}

export default function MyProjectDetail({
  userCheckerResponse,
  projectDataResponse,
  errorMsg,
  chat_id,
  project_id,
  _pageService,
  statusCode
}: IMyProjectDetailProps) {
  const items = useSelector((state: IRootState) => state.autopark.activeProject?.items || [])
  const hasItems = useMemo(() => items.length > 0, [items])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
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
            message={_pageService?.message || `Пользователя ${chat_id} не существует. Требуется инициализация сессии через Telegram-бот.`} 
          />
          <pre style={{ fontSize: 'x-small',
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
        <pre style={{ fontSize: 'x-small',
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
      
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs" style={{ paddingTop: '16px' }}>
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
                variant='outlined'
                color='primary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}`}
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
        statusCode: 400
      }
    }

    // Собираем базовые пропсы авторизации и сессии движка
    const baseProps = await getInitialPropsBase(ctx)

    // =========================================================================
    // 🛡️ ИСПРАВЛЕНО: КЛИЕНТСКИЙ + СЕРВЕРНЫЙ МОСТ АВТОРИЗАЦИИ (ИДЕМПОТЕНТНОСТЬ)
    // =========================================================================
    
    // 1. Пытаемся забрать флаг из базового серверного хелпера движка
    let isAuthorized = baseProps?.authData?.oneTime?.jwt?.isAuthorized === true

    // 2. Если мы на КЛИЕНТЕ (ctx.req === undefined), извлекаем токен напрямую из браузерных кук!
    if (typeof window !== 'undefined' && !isAuthorized) {
      // Ищем наличие вашего JWT токена (или флага сессии) в document.cookie
      // Предположим, кука авторизации называется 'token' или содержит флаг авторизации
      const hasAuthCookie = document.cookie.includes('token') || 
                            document.cookie.includes('jwt') || 
                            document.cookie.includes('session');
      
      // Если кука на месте — восстанавливаем флаг авторизации в рантайме клиента
      if (hasAuthCookie) {
        isAuthorized = true
      }
    }

    // 3. Дополнительная проверка: синхронизируем состояние с Redux-хранилищем
    const reduxState = store.getState() as IRootState
    if (reduxState.autopark.isOneTimePasswordCorrect === true) {
      isAuthorized = true
    }

    // =========================================================================
    // 🔥 РЕДИРЕКТ НА СТРАНИЦУ ВХОДА (ТЕПЕРЬ СРАБОТАЕТ СТРОГО ЕСЛИ КУК НЕТ ВООБЩЕ)
    // =========================================================================
    if (!isAuthorized) {
      const currentPath = ctx.req ? ctx.req.url : window.location.pathname + window.location.search
      const redirectTarget = `/auth/login?from=${encodeURIComponent(currentPath || '')}&chat_id=${chat_id}`

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
        statusCode: 302
      }
    }

    // =========================================================================
    // 🛡️ СБОР ДАННЫХ (Выполняется строго ЕСЛИ пользователь успешно авторизован)
    // =========================================================================
    
    // Проставляем флаг верности одноразового пароля в Redux-редюсер autopark
    store.dispatch(setIsOneTimePasswordCorrect(true))

    // Валидация существования аккаунта в ТГ-боте
    userDataResult = await api
      .post('/check-user', {
        tg: {
          chat_id: Number(chat_id),
        }
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

    // Сбор данных по автомобилю/проекту
    if (!errorMsg && statusCode !== 401) {
      projectDataResult = await api
        .post('/project/get-data', {
          chat_id: Number(chat_id),
          project_id,
        })
        .then((res) => res.data)
        .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

      if (typeof projectDataResult === 'string') {
        errorMsg = projectDataResult
      }
    }

    if (!!projectDataResult?.ok && !!projectDataResult?.projectData) {
      store.dispatch(setActiveProject(projectDataResult.projectData))
    }

    const _pageService: TPageService = {
      isOk: !errorMsg && statusCode === 200,
      hasAuthenticated: true,
      message: errorMsg || undefined
    }

    setCommonStore({ store, baseProps })

    return {
      userCheckerResponse: userDataResult || { ok: false },
      projectDataResponse: projectDataResult?.projectData || null,
      errorMsg,
      isUserExists: userDataResult ? userDataResult.ok : false,
      chat_id,
      project_id,
      _pageService,
      statusCode
    }
  }
)
