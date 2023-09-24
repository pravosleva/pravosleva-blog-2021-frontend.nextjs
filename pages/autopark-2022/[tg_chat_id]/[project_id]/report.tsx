import * as React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
} from '@mui/material'
import Link from '~/components/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
// import { TheProject } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { setActiveProject } from '~/store/reducers/autopark'
import { Report } from '~/components/Autopark2022/components'
import Head from 'next/head'
import { ErrorPage } from '~/components/ErrorPage'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import jwt from 'jsonwebtoken'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })

type TPageService = {
  isOk: boolean;
  message?: string;
}

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  project_id,
  projectDataResponse,
}: any) {
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
      </Head>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
        <Container maxWidth="xs">
          <Box sx={{ p: 2 }} style={{ fontWeight: 'bold' }}>
            <code>{projectDataResponse?.name || 'ERR: Noname'}</code>
          </Box>
          
          {
            typeof window !== 'undefined' && (
              <Report
                chat_id={chat_id}
                project_id={project_id}
              />
            )
          }
        </Container>
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant='contained'
                color='secondary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}/${project_id}`}
                shallow
                fullWidth
              >
                {projectDataResponse?.name || 'Project'}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<ArrowBackIcon />}
                variant='outlined'
                color='primary'
                component={Link}
                noLinkStyle
                href={`/autopark-2022/${chat_id}`}
                shallow
                fullWidth
              >
                Projects
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}

MyProjects.getInitialProps = wrapper.getInitialPageProps(
  // @ts-ignore
  (store) => async (ctx: any) => {
    const { query } = ctx
    const { tg_chat_id: chat_id, project_id } = query
    let errorMsg = null

    const fetchUserData = async () => {
      const result = await api
        .post('/check-user', {
          tg: {
            chat_id,
          }
        })
        .then((res) => {
          // console.log(res)
          return res.data
        })
        .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

      // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
      if (typeof result === 'string') errorMsg = result

      return result
    }

    const userDataResult = await fetchUserData()

    // console.log(result)

    const fetchProjectData = async () => {
      const result = await api
        .post('/project/get-data', {
          chat_id,
          project_id,
        })
        .then((res) => {
          // console.log(res.data)
          return res.data
        })
        .catch((err) => typeof err === 'string' ? err : err.message || 'No err.message')

      // if (Array.isArray(result) && result.length > 0 && !!result[0]?.id) return result[0]
      if (typeof result === 'string') errorMsg = result

      return result
    }

    let projectDataResult = null

    if (!errorMsg)
      projectDataResult = await fetchProjectData()

    if (!!projectDataResult?.ok && !!projectDataResult.projectData)
      store.dispatch(setActiveProject(projectDataResult.projectData))

    // - NOTE: Quick auth
    const _pageService: TPageService = {
      isOk: true,
    }
    try {
      const { cookies } = ctx.req

      const authCookieName = 'autopark-2022.jwt'
      const secretKey = 'super-secret'
      if (!!cookies[authCookieName]) {
        const decodedToken: any = jwt.verify(cookies[authCookieName], secretKey)

        if (decodedToken?.chat_id === chat_id) store.dispatch(setIsOneTimePasswordCorrect(true))
      }
    } catch (err) {
      // @ts-ignore
      _pageService.message = err?.message || 'No err.message'
    }
    // -

    return { userCheckerResponse: userDataResult, projectDataResponse: projectDataResult?.projectData || null, errorMsg, isUserExists: userDataResult?.ok, chat_id, project_id, _pageService }
  }
)
