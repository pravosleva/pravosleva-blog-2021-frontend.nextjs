import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Alert } from '@mui/material'
import { Autopark2022 } from '~/components/Autopark2022'
import { wrapper } from '~/store'
import { setUserCheckerResponse } from '~/store/reducers/autopark'
import Head from 'next/head'
import { autoparkHttpClient } from '~/utils/autoparkHttpClient'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
}: any) {
  if (userCheckerResponse?.code === 'not_found') return (
    <Container maxWidth="xs">
      <Box sx={{ my: 4 }}>
        <Alert sx={{ mb: 2 }} variant="filled" severity="error">
          <Typography variant="body2" component="h2" gutterBottom>
            Пользователя {chat_id} не существует.<br />Нужна авторизация через Telegram
          </Typography>
        </Alert>
      </Box>
    </Container>
  )

  return (
    <>
      <Head>
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}`} />
      </Head>
      <Container maxWidth="xs">
        <Box sx={{ my: 4 }}>
          {
            !!errorMsg
            ? (
              <b>{errorMsg}</b>
            ) : (
              <>
                <Typography variant="h4" component="h1" gutterBottom>
                  Autopark
                </Typography>
                <Autopark2022 chat_id={chat_id} />
              </>
            )
          }
        </Box>
      </Container>
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

    return { userCheckerResponse: result, errorMsg, isUserExists: result?.ok, chat_id: tg_chat_id }
  }
)
