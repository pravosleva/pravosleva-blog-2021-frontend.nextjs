// import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import { wrapper } from '~/store'
import Head from 'next/head'
import { Todo2023Online } from '~/components/Todo2023.online/Todo2023Online'
import { ErrorPage } from '~/components/ErrorPage'
import jwt from 'jsonwebtoken'
// import { autoparkHttpClient } from '~/utils/autoparkHttpClient'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'

// const isDev = process.env.NODE_ENV === 'development'
// const baseURL = isDev
//   ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
//   : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'

type TPageService = {
  isOk: boolean;
  message?: string;
}

export default function TodoOnline({
  chat_id,
  _pageService,
}: {
  chat_id: number;
  _pageService: TPageService;
}) {
  return (
    <>
      <Head>
        <title>AuditList | Online</title>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      {
        _pageService.isOk
        ? <Todo2023Online room={chat_id} />
        : <ErrorPage message={_pageService.message || 'ERR: No _pageService.message'} />
      }
    </>
  );
}

TodoOnline.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query: { tg_chat_id } } = ctx
    // let errorMsg = null
    const _pageService: TPageService = {
      isOk: true,
    }

    // const result = await autoparkHttpClient.checkJWT({
    //   tested_chat_id: tg_chat_id,
    // })
    //   .then((res) => res)
    //   .catch((err) => err.message || 'Unknown err (GIPP)')

    // if (result?.ok === true) store.dispatch(setIsOneTimePasswordCorrect(true))
    // if (typeof result === 'string') errorMsg = result

    if(isNaN(tg_chat_id)) {
      _pageService.isOk = false
      _pageService.message = `Incorrect page param (number expected), received \`${tg_chat_id}\``
    } else {
      // NOTE: For ssr only
      try {
        const { cookies } = ctx.req
        const authCookieName = 'autopark-2022.jwt'
        const secretKey = 'super-secret'
        if (!!cookies[authCookieName]) {
          const decodedToken: any = jwt.verify(cookies[authCookieName], secretKey)
          if (decodedToken?.chat_id === tg_chat_id) store.dispatch(setIsOneTimePasswordCorrect(true))
        }
      } catch (err) {
        console.log(err)
      }
    }

    return {
      chat_id: Number(tg_chat_id),
      _pageService,
    }
  }
)
