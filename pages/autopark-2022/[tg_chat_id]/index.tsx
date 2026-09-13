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
import { autoparkHttpClient } from '~/utils/autoparkHttpClient'
import { getInitialPropsBase, setCommonStore } from '~/utils/next'
import { UniversalContainer } from '~/components/special-content/UniversalContainer'
import { AuthorizationRequired401Svg } from '~/components/special-content/error/AuthorizationRequired401Svg'

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
}

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  _pageService,
  statusCode
}: IMyProjectsProps) {
  const isBrowser = useMemo(() => typeof window !== 'undefined', [])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

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
        </UniversalContainer>
      </>
    )
  }

  // КЕЙС Б: Системная ошибка рантайма / падение базы данных
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
    
    // СНАЙПЕРСКАЯ ВАЛИДАЦИЯ: Проверяем, что пришла строка и она преобразуется в валидное число
    const isQueryValidNumber = typeof query?.tg_chat_id === 'string' && !Number.isNaN(Number(query.tg_chat_id))
    
    // Для логики и сетевых запросов используем чистую строку, если она валидна
    const tg_chat_id = isQueryValidNumber ? String(query?.tg_chat_id) : undefined
    
    let errorMsg: string | null = null
    let statusCode = 200
    let result = null

    if (!!tg_chat_id) {
      // 1. Делаем запрос к API-серверу для валидации существования аккаунта в ТГ-боте
      result = await autoparkHttpClient.getUserData({
        tg: {
          chat_id: Number(tg_chat_id), // Передаем число на бэкенд, как он и ожидает
        }
      })
      .then((res) => res)
      .catch((err) => err.message || 'Unknown err (GIPP)')

      if (result?.ok === true || result?.ok === false) {
        store.dispatch(setUserCheckerResponse(result))
      }
      
      // Если пользователя нет в базе данных бота
      if (result?.code === 'not_found') {
        if (ctx.res) ctx.res.statusCode = 401
        statusCode = 401
      }

      if (typeof result === 'string') {
        errorMsg = result
      }
    }

    // 2. Логика быстрой проверки JWT-токенов одноразового пароля
    const _pageService: TPageService = {
      isOk: true,
      hasAuthenticated: false,
    }
    
    const baseProps = await getInitialPropsBase(ctx)
    
    switch (true) {
      case !tg_chat_id:
        _pageService.isOk = false
        _pageService.hasAuthenticated = false
        _pageService.message = `Неверный параметр идентификатора (ожидалось число), получено: \`${query?.tg_chat_id}\``
        if (ctx.res) ctx.res.statusCode = 400
        statusCode = 400
        break
        
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

    setCommonStore({ store, baseProps })

    return {
      userCheckerResponse: result,
      errorMsg,
      isUserExists: result ? result.ok : false,
      chat_id: tg_chat_id || String(query?.tg_chat_id || ''), // Гарантируем тип string для UI-компонентов
      _pageService,
      statusCode
    }
  }
)
