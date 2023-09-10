// import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material'
import { Box, Container, Typography } from '@mui/material'
import { AddNewBtn, AuditList } from '~/components/ToDo2023/components'
import { TAudit } from '~/components/ToDo2023/state'
import { useSelector, useDispatch } from 'react-redux'
import { addAudit } from '~/store/reducers/todo2023'
import { memo, useCallback } from 'react'
import { IRootState } from '~/store/IRootState'
import { todo2023HttpClient } from '~/utils/todo2023HttpClient'

export const ToDo2023 = memo(() => {
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
        console.log(err)
        return []
      })

    dispatch(addAudit({
      name,
      description,
      jobs: remoteJobs,
    }))
  }, [])

  const localAudits: TAudit[] = useSelector((state: IRootState) => state.todo2023.localAudits)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Container maxWidth="xs">
        <Box sx={{ py: 2 }}>
          <Typography variant="h5" display="block" gutterBottom>
            Audit list
          </Typography>
        </Box>
        <AuditList audits={localAudits} />
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
