import { useMemo } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
 } from '@mui/material'
import Link from '~/components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from 'axios';
import { TheProject } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { setActiveProject } from '~/store/reducers/autopark'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
// import { OneTimeLoginFormBtn } from '~/components/Autopark2022/components/OneTimeLoginFormBtn'
import Head from 'next/head'
import { ErrorPage } from '~/components/ErrorPage'
import { setIsOneTimePasswordCorrect } from '~/store/reducers/autopark'
import { CreateNewItem } from '~/components/Autopark2022/components/TheProject/components/CreateNewItem'
import { getInitialPropsBase } from '~/utils/next/getInitialPropsBase'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.pro/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })

type TPageService = {
  isOk: boolean;
  message?: string;
  hasAuthenticated: boolean;
}

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  project_id,
  projectDataResponse,
}: any) {
  if (userCheckerResponse.code === 'not_found') return (
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

  const items = useSelector((state: IRootState) => state.autopark.activeProject?.items || [])
  const hasItems = useMemo(() => items.length > 0, [items])

  const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  return (
    <>
      <Head>
        {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_id=${project_id}&project_type=autopark`} />
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
          {/* <Typography variant="h4" component="h1" gutterBottom>
            Project
          </Typography> */}
          <Box sx={{ p: 2 }} style={{ fontWeight: 'bold' }}>
            <code>{projectDataResponse?.name || 'ERR: Noname'}</code>
          </Box>

          <TheProject
            chat_id={chat_id}
            project_id={project_id}
          />

          {!hasItems && (
            <Alert sx={{ p: 2 }} variant="standard" severity="error">
              Пока нет расходников
            </Alert>
          )}
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
            {
              isOneTimePasswordCorrect && (
                <Grid item xs={12}>
                {/* <Button sx={{ mb: 2 }} fullWidth variant="contained" color='primary' onClick={handleAddItem} startIcon={<AddIcon />}>
                  Добавить расходник
                </Button> */}
                <CreateNewItem chat_id={chat_id} project_id={project_id} />
                </Grid>
              )
            }
            <Grid item xs={hasItems ? 6 : 12}>
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
            {
              hasItems && (
                <Grid item xs={6}>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    variant='contained'
                    color='secondary'
                    component={Link}
                    noLinkStyle
                    href={`/autopark-2022/${chat_id}/${project_id}/report`}
                    shallow
                    fullWidth
                  >
                    Report
                  </Button>
                </Grid>
              )
            }
          </Grid>
        </div>
      </div>
      {/* <Stack spacing={1}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" color='primary' component={Link} noLinkStyle href="/" shallow>
          Go to home page
        </Button>
      </Stack> */}
      {/* <ProTip />
      <Copyright /> */}
    </>
  );
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

    if (!!projectDataResult?.ok && !!projectDataResult?.projectData)
      store.dispatch(setActiveProject(projectDataResult.projectData))

    // - NOTE: Quick auth
    const baseProps = await getInitialPropsBase(ctx)
    const _pageService: TPageService = {
      isOk: true,
      hasAuthenticated: false,
    }
    switch (true) {
      case !chat_id || isNaN(Number(chat_id)):
        _pageService.hasAuthenticated = false
        _pageService.message = `Incorrect page param (number expected), received: \`${chat_id}\``
        break
      // NOTE: For ssr only?
      case baseProps.authData.oneTime.jwt.isAuthorized: {
        _pageService.hasAuthenticated = true
        store.dispatch(setIsOneTimePasswordCorrect(true))
        break
      }
      case baseProps.authData.oneTime.jwt._service.isErrored: {
        _pageService.hasAuthenticated = true
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
      chat_id,
      project_id,
      _pageService,
    }
  }
)
