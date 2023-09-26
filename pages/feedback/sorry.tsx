import { useEffect, useState } from 'react'
import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material'
import Link from '~/components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Layout } from '~/components/Layout'

export default function FeedbackSorry() {
  const [msg, setMsg] = useState('')
  useEffect(() => {
    try {
      const _msg = localStorage.getItem('_tmp.error-message')
      if (!!_msg) {
        setMsg(_msg)
        localStorage.removeItem('_tmp.error-message')
      }
    } catch (err: any) {
      if (!!err?.message) setMsg(err?.message)
    }
  return () => {
    try {
      localStorage.removeItem('_tmp.error-message')
    } catch (err) {
      // Nothing...
    }
  }
  }, [])
  
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sorry
          </Typography>

          <Alert sx={{ mb: 2 }} variant="outlined" severity={!!msg ? 'error' : 'info'}>
            {msg || 'Nothing for report =)'}
          </Alert>

          <Stack spacing={1}>
            <Button startIcon={<ArrowBackIcon />} variant="contained" color='primary' component={Link} noLinkStyle href="/" shallow>
              Home
            </Button>
          </Stack>
        </Box>
      </Container>
    </Layout>
  );
}
