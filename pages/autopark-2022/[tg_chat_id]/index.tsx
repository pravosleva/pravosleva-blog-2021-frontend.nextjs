import { useMemo } from 'react'
import { Autopark2022 } from '~/components/Autopark2022'
import { wrapper } from '~/store'
import { setUserCheckerResponse } from '~/store/reducers/autopark'
import Head from 'next/head'
import { autoparkHttpClient } from '~/utils/autoparkHttpClient'
import { ErrorPage } from '~/components/ErrorPage'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { OneTimeLoginFormBtn } from '~/components/Autopark2022/components/OneTimeLoginFormBtn'
import { Container } from '@mui/material'
import jwt from 'jsonwebtoken'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'

type TPageService = {
  isOk: boolean;
  message?: string;
  hasAuthenticated: boolean;
}

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  // _pageService,
}: any) {
  const isBrowser = useMemo(() => typeof window !== 'undefined', [typeof window])
  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  if (userCheckerResponse?.code === 'not_found') return (
    <>
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <ErrorPage message={`Пользователя ${chat_id} не существует. Нужна авторизация через Telegram`} />
    </>
  )
  if (!!errorMsg) return (
    <ErrorPage message={errorMsg} />
  )

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}`} />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs">
          <Autopark2022 chat_id={chat_id} />
        </Container>
        {
          isBrowser && !isOneTimePasswordCorrect && (
            <div
              style={{
                marginTop: 'auto',
                position: 'sticky',
                bottom: '0px',
                zIndex: 2,
                padding: '16px',
                // backgroundColor: '#fff',
                // borderTop: '1px solid lightgray',
              }}
              className='backdrop-blur--lite'
            >
              <OneTimeLoginFormBtn
                chat_id={chat_id}
              />
            </div>
          )
        }
      </div>
    </>
  );
}

MyProjects.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query } = ctx
    const { tg_chat_id } = query
    let errorMsg = null

    const result = await autoparkHttpClient.getUserData({
      tg: {
        chat_id: tg_chat_id,
      }
    })
      .then((res) => res)
      .catch((err) => err.message || 'Unknown err (GIPP)')

    if (result?.ok === true || result?.ok === false) store.dispatch(setUserCheckerResponse(result))
    if (typeof result === 'string') errorMsg = result

    // - NOTE: Quick auth
    const _pageService: TPageService = {
      isOk: true,
      hasAuthenticated: false,
    }
    try {
      const { cookies } = ctx.req

      const authCookieName = 'autopark-2022.jwt'
      const secretKey = 'super-secret'
      if (!!cookies[authCookieName]) {
        const decodedToken: any = jwt.verify(cookies[authCookieName], secretKey)

        _pageService.hasAuthenticated = decodedToken?.chat_id === tg_chat_id
        if (_pageService.hasAuthenticated) store.dispatch(setIsOneTimePasswordCorrect(true))
      }
    } catch (err) {
      // @ts-ignore
      _pageService.message = err?.message || 'No err.message'
    }
    // -

    return { userCheckerResponse: result, errorMsg, isUserExists: result?.ok, chat_id: tg_chat_id, _pageService }
  }
)
