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
import { TUserCheckerResponse, setActiveProject } from '~/store/reducers/autopark'
import { Report } from '~/components/Autopark2022/components'
import Head from 'next/head'
import { ErrorPage } from '~/components/ErrorPage'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase';

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
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
}: {
  userCheckerResponse: TUserCheckerResponse;
  errorMsg?: string;
  chat_id: string;
  project_id: string;
  projectDataResponse: {
    name: string;
    description: string;
  } | null;
}) {
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
        <title>{projectDataResponse?.name || 'My Car'} | Report</title>
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_id=${project_id}&project_name=${projectDataResponse?.name || 'My Car'}&project_type=autopark_report`} />
        <meta name="application-name" content={projectDataResponse?.name || 'My Car'} />
        <meta name="apple-mobile-web-app-title" content={projectDataResponse?.name || 'My Car'} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <script
          type="text/javascript"
          defer
          dangerouslySetInnerHTML={{
            __html: `if (typeof customEruda !== 'undefined') setTimeout(customEruda.initIfNecessary, 1000);`,
          }}
        />
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
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
    const baseProps = await getInitialPropsBase(ctx)
    switch (true) {
      case !chat_id || isNaN(Number(chat_id)):
        _pageService.message = `Incorrect page param (number expected), received: \`${chat_id}\``
        break
      // NOTE: For ssr only?
      case baseProps.authData.oneTime.jwt.isAuthorized: {
        store.dispatch(setIsOneTimePasswordCorrect(true))
        break
      }
      case baseProps.authData.oneTime.jwt._service.isErrored: {
        _pageService.message = baseProps.authData.oneTime.jwt._service.message || 'ERR1 (No err.message)'
        break
      }
      default:
        break
    }
    // -

    return {
      userCheckerResponse: userDataResult,
      projectDataResponse: projectDataResult?.projectData || null,
      errorMsg,
      isUserExists: userDataResult?.ok,
      chat_id, project_id,
      _pageService,
    }
  }
)
