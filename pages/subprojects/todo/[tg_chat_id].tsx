// import Container from '@mui/material/Container'
// import Box from '@mui/material/Box'
import { wrapper } from '~/store'
import Head from 'next/head'
import { Todo2023Online } from '~/components/Todo2023.online/Todo2023Online'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'

export default function TodoOnline({
  chat_id,
}: {
  chat_id: number;
}) {
  return (
    <>
      <Head>
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}`} />
      </Head>
      <Todo2023Online room={chat_id} />
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

    return { chat_id: Number(tg_chat_id) }
  }
)
