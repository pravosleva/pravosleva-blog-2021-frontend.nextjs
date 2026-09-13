// pages/auth/login.tsx
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Stack, Typography } from '@mui/material'
import Head from 'next/head'
import Link from '~/components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { CustomPinInput } from '~/components/CustomPinInput'
import { useDebounce } from '~/hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { updateProjects, setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { UniversalContainer } from '~/components/special-content/error/UniversalContainer'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { AuthSuccessSvg } from '~/components/special-content/success/AuthSuccessSvg'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

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
  
  // Вытаскиваем Return URL параметр ?from=... из адресной строки Next.js роутера
  const returnUrl = typeof router.query.from === 'string' ? decodeURIComponent(router.query.from) : null

  // По умолчанию для авторизации используем системный ID админа, если чат не проброшен
  const chat_id = typeof router.query.chat_id === 'string' ? router.query.chat_id : '112502329'

  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const passwordRef = useRef<string>('')
  const debouncedCounter = useDebounce(count, 1000)
  const [apiErr, setApiErr] = useState<string>('')
  
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)
  const isBrowser = useMemo(() => typeof window !== 'undefined', [])
  const baseProps = useSelector((s: IRootState) => s.baseProps)

  // АСИНХРОННЫЙ ХУК ВАЛИДАЦИИ ПАРОЛЯ
  useEffect(() => {
    if (!passwordRef.current) return

    setIsLoading(true)
    setApiErr('')

    fetchCheckPassword({ chat_id, password: passwordRef.current })
      .then((data) => {
        if (data?.ok) {
          dispatch(setIsOneTimePasswordCorrect(true))
          if (data?.projects) {
            dispatch(updateProjects(data.projects))
          }

          // 🔥 СНАЙПЕРСКИЙ РОУТИНГ ПОСЛЕ УСПЕШНОГО ВХОДА
          if (returnUrl) {
            setTimeout(() => {
              router.push(returnUrl)
            }, 800) // Легкая задержка для красоты UX перед прыжком
          }
        } else {
          setApiErr(data?.message || 'Неверный PIN-код доступа. Доступ заблокирован.')
        }
      })
      .catch((err) => {
        setApiErr(err?.message || 'Сбой сетевого шлюза при проверке токена.')
      })
      .finally(() => setIsLoading(false))
  }, [debouncedCounter, chat_id, returnUrl])

  const handlePinInputComplete = useCallback((value: string) => {
    setIsLoading(true)
    passwordRef.current = value
    setCount((s) => s + 1)
  }, [])

  if (!isBrowser) return null

  // КЕЙС 1: Если авторизация прошла УСПЕШНО и у нас НЕТ параметра перенаправления — рендерим красивый AuthSuccessSvg
  if (isOneTimePasswordCorrect && !returnUrl) {
    return (
      <UniversalContainer>
        <Head>
          <title>Доступ разрешен | PravoSleva</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <AuthSuccessSvg />
        <Box sx={{ mt: 3, width: '100%', maxWidth: '280px', mx: 'auto' }}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" color="primary" component={Link} noLinkStyle href="/blog" fullWidth>
            В Блог
          </Button>
        </Box>
        <pre style={{ fontSize: 'x-small',
          whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
          wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
        }}>{JSON.stringify({ baseProps }, null, 2)}</pre>
      </UniversalContainer>
    )
  }

  // КЕЙС 2: Если пользователь еще в процессе ввода — показываем форму PIN-кода
  return (
    <ResponsiveBlock isLimited isPaddedMobile>
      <Head>
        <title>Авторизация | Личный кабинет</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
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
          chat_id={chat_id}
        />
      </Box>

      <pre style={{ fontSize: 'x-small',
          whiteSpace: 'pre-wrap', // Включает перенос строк и сохраняет пробелы
          wordBreak: 'break-all', // По желанию: переносит слишком длинные слова
        }}>{JSON.stringify({ baseProps }, null, 2)}</pre>
    </ResponsiveBlock>
  )
}
