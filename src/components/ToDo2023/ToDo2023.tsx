// import { Modal, Box, Typography, Button, TextField, Grid } from '@mui/material'
import { Box, Container, Typography } from '@mui/material'
import { AddNewBtn, AuditList } from '~/components/ToDo2023/components'
import { stateInstance } from '~/components/ToDo2023/state'

export const ToDo2023 = () => {
  const handleError = (arg: any) => {
    console.warn(arg)
  }
  const handleAddNewAudit = (arg: any) => {
    const { name, description } = arg
    if (!name) {
      // window.alert('Incorrect name')
      return
    }

    stateInstance.addAudit({
      name,
      description,
    })
      .catch((err) => {
        if (!!err?.message) {
          console.error(err.message)
          return
        }
        console.warn(err)
      })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Container maxWidth="xs">
        <Box sx={{ py: 2 }}>
          <Typography variant="h5" display="block" gutterBottom>
            Audit list
          </Typography>
        </Box>
        <AuditList />
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
}
