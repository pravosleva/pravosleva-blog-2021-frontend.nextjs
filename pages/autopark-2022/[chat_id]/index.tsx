import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import ProTip from '~/components/ProTip';
// import Link from '~/components/Link';
// import Copyright from '~/components/Copyright';
import { Alert } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { Autopark2022 } from '~/components/Autopark2022'
import { wrapper } from '~/store'
// import { IRootState } from '~/store/IRootState'
import { setUserCheckerResponse } from '~/store/reducers/autopark'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
}: any) {


  if (userCheckerResponse?.code === 'not_found') return (
    <Container maxWidth="sm">
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
    <Container maxWidth="sm">
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
        {/* <Stack spacing={1}>
          <Button startIcon={<ArrowBackIcon />} variant="outlined" color='primary' component={Link} noLinkStyle href="/" shallow>
            Go to home page
          </Button>
        </Stack> */}
        {/* <ProTip />
        <Copyright /> */}
      </Box>
    </Container>
  );
}

// export const getInitialProps = wrapper.getInitialPageProps()

// export const getServerSideProps = wrapper.getServerSideProps(
//   // @ts-ignore
//   (store) => async (ctx: any) => {
//     const { query } = ctx
//     const { chat_id } = query
//     let errorMsg = null

//     const fetchUserData = async () => {
//       const result = await api
//         .post('/check-user', {
//           tg: {
//             chat_id
//           }
//         })
//         .then((res) => {
//           // console.log(res)
//           return res.data
//         })
//         .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

//       // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
//       if (typeof result === 'string') errorMsg = result

//       return result
//     }

//     const result = await fetchUserData()

//     // console.log(result)

//     if (result.ok === true || result.ok === false) store.dispatch(setUserCheckerResponse(result))

//     return { props: { userCheckerResponse: result, errorMsg, isUserExists: result?.ok, chat_id } }
//   }
// )

MyProjects.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query } = ctx
    const { chat_id } = query
    let errorMsg = null

    const fetchUserData = async () => {
      const result = await api
        .post('/check-user', {
          tg: {
            chat_id
          }
        })
        .then((res) => {
          return res.data
        })
        .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

      // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
      if (typeof result === 'string') errorMsg = result

      return result
    }

    const result = await fetchUserData()

    if (result.ok === true || result.ok === false) store.dispatch(setUserCheckerResponse(result))

    return { userCheckerResponse: result, errorMsg, isUserExists: result?.ok, chat_id }
  }
)
