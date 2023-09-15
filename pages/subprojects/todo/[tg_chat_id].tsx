// import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import { wrapper } from '~/store'
import Head from 'next/head'
import { Todo2023Online } from '~/components/Todo2023.online/Todo2023Online'
import { ErrorPage } from '~/components/ErrorPage';

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
        <title>Audit list</title>
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

    // const result = await autoparkHttpClient.getUserData({
    //   tg: {
    //     chat_id: tg_chat_id,
    //   }
    // })
    //   .then((res) => res)
    //   .catch((err) => err.message || 'Unknown err (GIPP)')

    // if (result?.ok === true || result?.ok === false) store.dispatch(setUserCheckerResponse(result))
    // if (typeof result === 'string') errorMsg = result

    const _pageService: TPageService = {
      isOk: true,
    }

    if(isNaN(tg_chat_id)) {
      _pageService.isOk = false
      _pageService.message = 'Incorrect page param (number expected)'
    }

    return {
      chat_id: Number(tg_chat_id),
      _pageService,
    }
  }
)
