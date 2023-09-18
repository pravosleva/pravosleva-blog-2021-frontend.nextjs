// import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { AddNewBtn, AuditList } from '~/components/ToDo2023.offline/components'
import { TAudit } from '~/components/ToDo2023.offline/state'
import { useSelector, useDispatch } from 'react-redux'
import {
  addAudit,
  removeAudit,
  addJob,
  addSubjob,
  toggleJobDone,
  removeJob,
  toggleSubJobDone,
} from '~/store/reducers/todo2023'
import { memo, useCallback } from 'react'
import { IRootState } from '~/store/IRootState'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'
import Link from '~/components/Link'
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// import SendIcon from '@mui/icons-material/Send';
// import { useRouter } from 'next/router'
// import { useCompare } from '~/hooks/useDeepEffect'
import { /* VariantType, */ useSnackbar } from 'notistack'

export const ToDo2023 = memo(() => {
  // const router = useRouter()
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
    const isConfirmed = window.confirm('Вы уверены?')
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Container maxWidth="xs">
        <Box sx={{ py: 2 }}>
          <Typography variant="h5" display="block" gutterBottom>
            Audit list
          </Typography>
          
          <Stack
            direction='row'
            alignItems='start'
            spacing={2}
            // sx={{ mb: 2 }}
          >
            <Button fullWidth startIcon={<ArrowBackIcon />} variant='outlined' color='primary' component={Link} noLinkStyle href='/' target='_self'>
              Home
            </Button>
            {/* <Button fullWidth endIcon={<ArrowForwardIcon />} variant='outlined' color='primary' component={Link} noLinkStyle href='/subprojects/todo/1' target='_self'>
              Online /1
            </Button> */}
            {/*
              isOneTimePasswordCorrect && (
                <Button onClick={pushForMeowt} fullWidth endIcon={<SendIcon />} variant='outlined' color='secondary'>
                  Push /1
                </Button>
              )
            */}
          </Stack>
        </Box>

        <AuditList
          audits={localAudits}
          onRemoveAudit={handleRemoveAudit}
          onAddJob={handleAddJob}
          onAddSubjob={handleAddSubjob}
          onToggleJobDone={handleToggleJobDone}
          onRemoveJob={handleRemoveJob}
          onToggleSubjob={handleToggleSubjob}
          isEditable={true}
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
          </div>
        )
      }
    </div>
  )
})
