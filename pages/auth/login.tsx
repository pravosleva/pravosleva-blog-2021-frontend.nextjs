// pages/auth/login.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Stack, Typography } from '@mui/material'
import Head from 'next/head'
import Link from '~/components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// import TelegramIcon from '@mui/icons-material/Telegram' // НОВОЕ: Иконка Telegram для рекомендаций
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { CustomPinInput } from '~/components/CustomPinInput'
import { useDebounce } from '~/hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { updateProjects, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'

import axios from 'axios'
import axiosRetry from 'axios-retry'
import { UniversalContainer } from '~/components/special-svg-content/UniversalContainer'
import { PageNotFound404Svg } from '~/components/special-svg-content/error/PageNotFound404Svg'
import { AuthSuccessSvg } from '~/components/special-svg-content/success/AuthSuccessSvg'
// import { Layout } from '~/components/Layout'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'https://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

const api = axios.create({
  baseURL,
  validateStatus: (_s: number) => true,
  withCredentials: true,
})

axiosRetry(api, { retries: 10, retryDelay: axiosRetry.exponentialDelay })

const fetchCheckPassword = async ({ chat_id, password }: { chat_id: string, password: string }) => {
  return api
    .post('/check-password', { chat_id, password })
    .then((res: any) => res.data)
    .catch((err: any) => typeof err === 'string' ? err : err.message || 'No err.message')
}

export default function AuthLogin() {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const returnUrl = typeof router.query.from === 'string' ? decodeURIComponent(router.query.from) : null
  
  // ИСПРАВЛЕНО: Строго проверяем наличие chat_id в query-параметрах
  const chat_id = typeof router.query.chat_id === 'string' ? router.query.chat_id : undefined

  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = useRef<string>('')
  const debouncedCounter = useDebounce(count, 1000)
  const [apiErr, setApiErr] = useState<string>('')
  
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const isBrowser = useMemo(() => typeof window !== 'undefined', [])

  // Идемпотентная проверка куки при холодной перезагрузке
  useEffect(() => {
    if (typeof window !== 'undefined' && !isOneTimePasswordCorrect) {
      const hasAuthCookie = document.cookie.includes('token') || 
                            document.cookie.includes('jwt') || 
                            document.cookie.includes('session')
      
      if (hasAuthCookie) {
        dispatch(setIsOneTimePasswordCorrect(true))
      }
    }
  }, [isOneTimePasswordCorrect, dispatch])

  // Асинхронный хук валидации пароля
  useEffect(() => {
    if (!passwordRef.current || !chat_id) return

    setIsLoading(true)
    setApiErr('')

    fetchCheckPassword({ chat_id, password: passwordRef.current })
      .then((data) => {
        if (data?.ok) {
          dispatch(setIsOneTimePasswordCorrect(true))
          if (data?.projects) {
            dispatch(updateProjects(data.projects))
          }

          if (returnUrl) {
            setTimeout(() => {
              router.push(returnUrl)
            }, 800)
          }
        } else {
          setApiErr(data?.message || 'Неверный PIN-код доступа. Доступ заблокирован.')
        }
      })
      .catch((err) => {
        setApiErr(err?.message || 'Сбой сетевого шлюза при проверке токена.')
      })
      .finally(() => setIsLoading(false))
  }, [debouncedCounter, chat_id, returnUrl, dispatch])

  const handlePinInputComplete = useCallback((value: string) => {
    setIsLoading(true)
    passwordRef.current = value
    setCount((s) => s + 1)
  }, [])

  if (!isBrowser) return null

  // =========================================================================
  // 🚨 КРИТИЧЕСКИЙ UX-КЕЙС: ОТСУТСТВИЕ CHAT_ID (ОШИБКА ДАННЫХ С РЕКОМЕНДАЦИЯМИ)
  // =========================================================================
  if (!chat_id && !isOneTimePasswordCorrect) {
    return (
      <>
        <Head>
          <title>Ошибка авторизации | Не указан аккаунт</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
          {/* Рендерим лупу-радар с нашими рекомендациями */}
          <PageNotFound404Svg 
            message="Вход в личный кабинет Autopark-2022 должен выполняться по персональной ссылке, сгенерированной Telegram-ботом (или чем-то вроде него)." 
          />

          <Stack spacing={2} sx={{ mt: 4, width: '100%', maxWidth: '320px', mx: 'auto' }}>
            {/* Рекомендация 1: Перейти в бот */}
            {/* <Button
              startIcon={<TelegramIcon />}
              variant="contained"
              color="secondary"
              component="a"
              href="https://t.me" // Ссылка на вашего бота
              target="_blank"
              style={{ fontFamily: 'Montserrat', fontWeight: 'bold', borderRadius: '12px', padding: '10px 0' }}
            >
              Открыть Telegram-бот
            </Button> */}

            {/* Рекомендация 2: Вернуться в безопасное место */}
            <Button 
              startIcon={<ArrowBackIcon />} 
              variant="outlined" 
              color="primary" 
              component={Link} 
              noLinkStyle 
              href="/blog" 
              fullWidth
              style={{ fontFamily: 'Montserrat', fontWeight: 'bold', borderRadius: '12px', padding: '10px 0' }}
            >
              Вернуться в Блог
            </Button>
          </Stack>
        </UniversalContainer>
      </>
    )
  }

  // КЕЙС 1: Пользователь успешно авторизован (Сессия активна)
  if (isOneTimePasswordCorrect) {
    return (
      <>
        <Head>
          <title>Доступ разрешен | PravoSleva</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <UniversalContainer isForLayout={false} hasBreadcrumbs={false}>
          <AuthSuccessSvg />
          
          <Box sx={{ mt: 3, width: '100%', maxWidth: '280px', mx: 'auto' }}>
            {returnUrl ? (
              <Button 
                endIcon={<ArrowForwardIcon />} 
                variant="contained" 
                color="primary" 
                component={Link} 
                noLinkStyle 
                href={returnUrl}
                fullWidth
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold', borderRadius: '12px', padding: '10px 0' }}
              >
                Продолжить чтение
              </Button>
            ) : (
              <Button 
                startIcon={<ArrowBackIcon />} 
                variant="outlined" 
                color="primary" 
                component={Link} 
                noLinkStyle 
                href="/blog" 
                fullWidth
                style={{ fontFamily: 'Montserrat', fontWeight: 'bold', borderRadius: '12px', padding: '10px 0' }}
              >
                В Блог
              </Button>
            )}
          </Box>
        </UniversalContainer>
      </>
    )
  }

  // КЕЙС 2: Стандартный рабочий ввод PIN-кода (Параметры валидны)
  return (
    <>
      <Head>
        <title>Авторизация | Личный кабинет</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ResponsiveBlock isLimited isPaddedMobile>
        <Box sx={{ py: 6, maxWidth: '360px', mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" component="h1" fontFamily="Montserrat" fontWeight="bold" gutterBottom>
            Вход в систему
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, fontFamily: 'Montserrat' }}>
            Для получения доступа к скрытым материалам или панели Autopark введите ваш PIN-код.
          </Typography>

          <CustomPinInput
            handlePinInputComplete={handlePinInputComplete}
            isLoading={isLoading}
            apiErr={apiErr}
            onCancel={() => router.push('/blog')}
            chat_id={chat_id!}
          />
        </Box>
      </ResponsiveBlock>
    </>
  )
}
