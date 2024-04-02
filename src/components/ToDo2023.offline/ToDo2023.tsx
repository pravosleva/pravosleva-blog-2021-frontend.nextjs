import Head from 'next/head'
import { memo, useCallback, useState, useRef, useEffect } from 'react'
import { /* VariantType, */ useSnackbar } from 'notistack'
import { useDispatch, useSelector } from 'react-redux'
import {
  addAudit,
  removeAudit,
  addJob,
  addSubjob,
  toggleJobDone,
  removeJob,
  toggleSubJobDone,
  updateAuditComment,
} from '~/store/reducers/todo2023'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'
import {
  Box,
  Button,
  Container,
  // Grid,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material'
// import { Container } from '~/mui/ResponsiveBlock/components/Container'
// import { AuditList, TAuditListProps } from './AuditList'
import { useRouter } from 'next/router'
import { AddNewBtn, AuditList, TAudit, AuditGrid } from '~/components/audit-helper'
import { IRootState } from '~/store/IRootState'
import Link from '~/components/Link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import SendIcon from '@mui/icons-material/Send'
// import { useCompare } from '~/hooks/useDeepEffect'
import MoreVertIcon from '@mui/icons-material/MoreVert'
// import FolderIcon from '@mui/icons-material/Folder'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
// import MuiLink from '@mui/material/Link'
import { useWindowSize } from '~/hooks/useWindowSize'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useIsInViewport } from '~/hooks/useIsInViewport'
import TelegramIcon from '@mui/icons-material/Telegram'

const isDev = process.env.NODE_ENV === 'development'

export const ToDo2023 = memo(() => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const handleError = (arg: any) => {
    console.warn(arg)
  }
  const handleAddNewAudit = useCallback(async (arg: any) => {
    const { name, description } = arg
    if (!name) {
      // window.alert('Incorrect name')
      return
    }

    // NOTE: Get remote standardJobList -> Put to jobs
    const remoteJobs = await todo2023HttpClient.getJobs()
      .then((res) => {
        // @ts-ignore
        if (!res?.jobs) throw new Error('jobs was not received')
        // @ts-ignore
        return res.jobs
      })
      .catch((err) => {
        enqueueSnackbar(err?.message || 'ERR: No err.message', { variant: 'error', autoHideDuration: 10000 })
        return []
      })

    dispatch(addAudit({
      name,
      description,
      jobs: remoteJobs,
    }))
  }, [])

  const localAudits: TAudit[] = useSelector((state: IRootState) => state.todo2023.localAudits)
  
  const handleRemoveAudit = useCallback(({ auditId }) => {
    const isConfirmed = window.confirm('Аудит будет удален. Вы уверены?')
    if (isConfirmed) dispatch(removeAudit({
      auditId,
    }))
  }, [])
  const handleAddJob = useCallback(({
    auditId,
    name,
    subjobs,
  }) => {
    dispatch(addJob({
      auditId,
      name,
      subjobs,
    }))
  }, [])
  const handleAddSubjob = useCallback(({
    name,
    auditId,
    jobId,
  }) => {
    dispatch(addSubjob({
      name,
      auditId,
      jobId,
    }))
  }, [])
  const handleToggleJobDone = useCallback(({
    auditId,
    jobId,
  }) => {
    dispatch(toggleJobDone({
      auditId,
      jobId,
    }))
  }, [])
  const handleRemoveJob = useCallback(({
    auditId,
    jobId,
  }) => {
    const isConfirmed = window.confirm('Вы уверены?')
    if (isConfirmed) dispatch(removeJob({
      auditId,
      jobId,
    }))
  }, [])
  const handleToggleSubjob = useCallback(({
    auditId,
    jobId,
    subjobId,
  }) => {
    dispatch(toggleSubJobDone({
      auditId,
      jobId,
      subjobId,
    }))
  }, [])
  const handleUpdateAuditComment = useCallback(({
    auditId,
    comment,
  }) => {
    dispatch(updateAuditComment({
      auditId,
      comment
    }))
  }, [])

  // const pushForMeowt = useCallback(() => {
  //   const passwd = window.prompt('Meowt password')
  //   if (passwd === '123455') {
  //     // console.log(router)
  //     todo2023HttpClient.replaceAuditsInRoom({
  //       room: 1,
  //       audits: localAudits,
  //     })
  //       .then((_res) => {
  //         enqueueSnackbar('Ok', { variant: 'success', autoHideDuration: 3000 })
  //       })
  //       .catch((err) => {
  //         console.log(err)
  //         enqueueSnackbar(err?.message || 'ERR: No err.message', { variant: 'error', autoHideDuration: 10000 })
  //       })
  //   } else enqueueSnackbar('Incorrect', { variant: 'error', autoHideDuration: 3000 })
  // }, [useCompare([localAudits])])
  // const isOneTimePasswordCorrect = useSelector((state: IRootState) => state.autopark.isOneTimePasswordCorrect)

  const lastVisitedOnlinePages = useSelector((state: IRootState) => state.todo2023.online?.lastVisitedPages || [])
  //-- NOTE: Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpened = Boolean(anchorEl);
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, [])
  const handleMenuClose: any = useCallback(() => {
    setAnchorEl(null);
  }, [])
  const handleRoomClick = useCallback((tg_chat_id: number) => () => {
    router.push(`/subprojects/audit-list/${tg_chat_id}`)
  }, [])
  // --

  const { isMobile, isDesktop } = useWindowSize()

  const desktopPageContentTopRef = useRef(null)
  const desktopPageContentBottomRef = useRef(null)

  const isBottomInViewport = useIsInViewport({ elm: desktopPageContentBottomRef.current });
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState<boolean>(false)
  useEffect(() => {
    console.log(`isBottomInViewport= ${isBottomInViewport}`)
    setTimeout(() => {
      setIsScrollToBottomVisible(!isBottomInViewport)
    }, 0)
    
  }, [isBottomInViewport, typeof window, localAudits.length])
  const scrollToBottom = useCallback(() => {
    try {
      // @ts-ignore
      desktopPageContentTopRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err) {
      console.log(err)
    }
  }, [])

  switch (true) {
    case isMobile: return (
      <>
        <Head>
          <title>AuditList</title>
          {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        </Head>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 40px)' }}>
          <Container maxWidth="md">
            <Stack
              direction='column'
              alignItems='start'
              spacing={2}
              sx={{ pt: 2, pb: 2 }}
            >
              <Box
                sx={{
                  // pb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Typography
                  variant="h5"
                  display="block"
                  // gutterBottom
                >
                  AuditList
                </Typography>
                {
                  lastVisitedOnlinePages?.length > 0 && (
                    <>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={isMenuOpened ? 'long-menu' : undefined}
                        aria-expanded={isMenuOpened ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={isMenuOpened}
                        onClose={handleMenuClose}
                        PaperProps={{
                          // style: {
                          //   maxHeight: ITEM_HEIGHT * 4.5,
                          //   width: '20ch',
                          // },
                        }}
                      >
                        {
                          lastVisitedOnlinePages.map(({ tg_chat_id }) => (
                            <MenuItem
                              key={tg_chat_id}
                              selected={false}
                              onClick={handleRoomClick(tg_chat_id)}
                              disabled={String(tg_chat_id) === router.query.tg_chat_id}
                            >
                              <ListItemIcon><AccountTreeIcon fontSize="small" /></ListItemIcon>
                              <Typography variant="inherit">{tg_chat_id}</Typography>
                              {/* <MuiLink href={`/subprojects/audit-list/${tg_chat_id}`} variant='overline' underline="hover">{tg_chat_id}</MuiLink> */}
                            </MenuItem>
                          ))
                        }
                      </Menu>
                    </>
                  )
                }
              </Box>
            </Stack>
  
            <AuditList
              audits={localAudits}
              onRemoveAudit={handleRemoveAudit}
              onAddJob={handleAddJob}
              onAddSubjob={handleAddSubjob}
              onToggleJobDone={handleToggleJobDone}
              onRemoveJob={handleRemoveJob}
              onToggleSubjob={handleToggleSubjob}
              isEditable={true}
              onUpdateAuditComment={handleUpdateAuditComment}
            />
          </Container>
          {
            typeof window !== 'undefined' && (
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
                <Box sx={{ pt:0, pb: 2 }}>
                  <AddNewBtn
                    cb={{
                      onSuccess: handleAddNewAudit,
                      onError: handleError,
                    }}
                    label='Добавить Аудит'
                    muiColor='primary'
                    cfg={{
                      name: {
                        type: 'text',
                        label: 'Название',
                        inputId: 'audit-name',
                        placeholder: 'Аудит',
                        defaultValue: '',
                        reactHookFormOptions: { required: true, maxLength: 20, minLength: 3 }
                      },
                      description: {
                        type: 'text',
                        label: 'Описание',
                        inputId: 'audit-description',
                        placeholder: 'Something',
                        defaultValue: '',
                        reactHookFormOptions: { required: false, maxLength: 50 }
                      }
                    }}
                  />
                </Box>
                <Stack spacing={2} direction='row' sx={{ width: '100%' }}>
                  <Button fullWidth startIcon={<ArrowBackIcon />} variant='outlined' color='primary' component={Link} noLinkStyle href='/' target='_self'>
                    Home
                  </Button>
                  {lastVisitedOnlinePages?.length > 0 && (
                    <Button
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                      variant='outlined'
                      color='primary'
                      component={Link}
                      noLinkStyle
                      href={`/subprojects/audit-list/${lastVisitedOnlinePages[0].tg_chat_id}`}
                      target='_self'
                    >
                      {lastVisitedOnlinePages[0].tg_chat_id}
                    </Button>
                  )}
                </Stack>
              </div>
            )
          }
        </div>
      </>
    )
    case isDesktop: return (
      <>
        <Head>
          <title>AuditList</title>
          {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        </Head>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: 'calc(100dvh - 50px)',
            // paddingBottom: '50px',
          }}
        >
          <Stack
            direction='column'
            alignItems='start'
            spacing={0}
            sx={{ pt: 12, pb: 0 }}
          >
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '24px',
                // border: '1px solid red',
              }}
            >
              <span className='truncate'>AuditList</span>
              {
                isScrollToBottomVisible && (
                  <span>
                    <IconButton
                      aria-label="more"
                      id="to-bottom"
                      // aria-controls={isMenuOpened ? 'long-menu' : undefined}
                      // aria-expanded={isMenuOpened ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={scrollToBottom}
                      color='primary'
                    >
                      <ArrowDownwardIcon />
                    </IconButton>
                  </span>
                )
              }
              {
                isDev ? (
                  <span>
                    <Button
                      size='small'
                      endIcon={<ArrowForwardIcon />}
                      variant='outlined'
                      // variant='text'
                      color='primary'
                      component={Link}
                      noLinkStyle
                      href={'/subprojects/audit-list/123'}
                      target='_self'
                    >
                      Online 123
                    </Button>
                  </span>
                ) : (
                  lastVisitedOnlinePages?.length > 0 ? (
                    <span>
                      <Button
                        size='small'
                        endIcon={<ArrowForwardIcon />}
                        variant='outlined'
                        color='primary'
                        component={Link}
                        noLinkStyle
                        href={`/subprojects/audit-list/${lastVisitedOnlinePages[0].tg_chat_id}`}
                        target='_self'
                      >
                        Online {lastVisitedOnlinePages[0].tg_chat_id}
                      </Button>
                    </span>
                  ) : (
                    <span>
                      <Button
                        size='small'
                        endIcon={<TelegramIcon />}
                        variant='contained'
                        color='primary'
                        component={Link}
                        noLinkStyle
                        href='https://t.me/pravosleva_bot?start=auditlist'
                        target='_self'
                      >
                        Online
                      </Button>
                    </span>
                  )
                )
              }
            </Typography>
            <div ref={desktopPageContentTopRef} />
            <AuditGrid
              audits={localAudits}
              onRemoveAudit={handleRemoveAudit}
              onAddJob={handleAddJob}
              onAddSubjob={handleAddSubjob}
              onToggleJobDone={handleToggleJobDone}
              onRemoveJob={handleRemoveJob}
              onToggleSubjob={handleToggleSubjob}
              onUpdateAuditComment={handleUpdateAuditComment}
              onAddNewAudit={handleAddNewAudit}

              isEditable={true}
            />
            <div ref={desktopPageContentBottomRef} />
          </Stack>
        </div>
      </>
    )

    default: return (
      <>
        <Head>
          <title>AuditList</title>
          {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        </Head>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100dvh - 50px)' }}>
          <CircularIndeterminate />
        </div>
      </>
    )
  }
})
