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
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { CreateNewProject } from '~/components/Autopark2022/components/ProjectList/components/CreateNewProject'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'

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
      {/* <Head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head> */}
      <ErrorPage message={`Пользователя ${chat_id} не существует. Нужна авторизация через Telegram`} />
    </>
  )
  if (!!errorMsg) return (
    <ErrorPage message={errorMsg} />
  )

  return (
    <>
      <Head>
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}`} />
        <script
          type="text/javascript"
          defer
          dangerouslySetInnerHTML={{
            __html: `if (typeof customEruda !== 'undefined') setTimeout(customEruda.initIfNecessary, 1000);`,
          }}
        />
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs">
          <Autopark2022 chat_id={chat_id} />
        </Container>
        {
          isBrowser && (
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
              {isOneTimePasswordCorrect ? (
                <CreateNewProject chat_id={chat_id} />
              ) : (
                <OneTimeLoginFormBtn
                  chat_id={chat_id}
                />
              )}
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
    const baseProps = await getInitialPropsBase(ctx)
    switch (true) {
      case !tg_chat_id || isNaN(Number(tg_chat_id)):
        _pageService.hasAuthenticated = false
        _pageService.message = `Incorrect page param (number expected), received: \`${tg_chat_id}\``
        break
      // NOTE: For ssr only?
      case baseProps.authData.oneTime.jwt.isAuthorized: {
        _pageService.hasAuthenticated = true
        store.dispatch(setIsOneTimePasswordCorrect(true))
        break
      }
      case baseProps.authData.oneTime.jwt._service.isErrored: {
        _pageService.hasAuthenticated = false
        _pageService.message = baseProps.authData.oneTime.jwt._service.message || 'ERR1 (No err.message)'
        break
      }
      default:
        break
    }
    // -

    return {
      userCheckerResponse: result,
      errorMsg,
      isUserExists: result?.ok,
      chat_id: tg_chat_id,
      _pageService,
    }
  }
)
