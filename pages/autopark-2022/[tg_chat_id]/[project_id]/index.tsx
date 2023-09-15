import { useMemo } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
// import ProTip from '~/components/ProTip';
import Link from '~/components/Link'
// import Copyright from '~/components/Copyright';
import { Alert, Grid } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import axios from 'axios';
import { TheProject } from '~/components/Autopark2022/components'
import { wrapper } from '~/store'
import { setActiveProject } from '~/store/reducers/autopark'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { OneTimeLoginFormBtn } from '~/components/Autopark2022/components/OneTimeLoginFormBtn'
import Head from 'next/head'

const isDev = process.env.NODE_ENV === 'development'
const baseURL = isDev
  ? 'http://localhost:5000/pravosleva-bot-2021/autopark-2022'
  : 'http://pravosleva.ru/express-helper/pravosleva-bot-2021/autopark-2022'
const api = axios.create({ baseURL, validateStatus: (_s: number) => true, })

export default function MyProjects({
  userCheckerResponse,
  errorMsg,
  chat_id,
  project_id,
  projectDataResponse,
}: any) {
  if (userCheckerResponse.code === 'not_found') return (
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
  const items = useSelector((state: IRootState) => state.autopark.activeProject?.items || [])
  const hasItems = useMemo(() => items.length > 0, [items])

  return (
    <>
      {/*
      
      */}
      <Head>
        <link rel="manifest" href={`${baseURL}/get-dynamic-manifest?chat_id=${chat_id}&project_id=${project_id}`} />
      </Head>
      <Container
        maxWidth="xs"
        sx={{
          // border: '1px solid red',
        }}
      >
        <Box sx={{ py: 4 }}>
          {
            !!errorMsg
            ? (
              <b>{errorMsg}</b>
            ) : (
              <>
                {/* <Typography variant="h4" component="h1" gutterBottom>
                  Project
                </Typography> */}
                <Box sx={{ mb: 2 }} style={{ fontWeight: 'bold' }}>
                  <code>{projectDataResponse?.name || 'ERR: Noname'}</code>
                </Box>

                <TheProject
                  chat_id={chat_id}
                  project_id={project_id}
                />

                {!hasItems && (
                  <Alert sx={{ mb: 2 }} variant="standard" severity="error">
                    Пока нет расходников
                  </Alert>
                )}

                <Grid container spacing={2} sx={{ mb: 2 }}>
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
          {
            typeof window !== 'undefined' && (
              <Box sx={{ mb: 2 }}>
                <OneTimeLoginFormBtn chat_id={chat_id} />
              </Box>
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

    if (!!projectDataResult?.ok && !!projectDataResult?.projectData)
      store.dispatch(setActiveProject(projectDataResult.projectData))

    return { userCheckerResponse: userDataResult, projectDataResponse: projectDataResult?.projectData || null, errorMsg, isUserExists: userDataResult?.ok, chat_id, project_id }
  }
)
