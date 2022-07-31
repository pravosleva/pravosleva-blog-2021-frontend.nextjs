import * as React from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ProTip from '~/components/ProTip'
import Link from '~/components/Link'
import Copyright from '~/components/Copyright'
import { Alert, Button, Stack } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function Index() {
  // const goToPage = (url: string) => (e: any) => {
  //   e.preventDefault()
  //   try {
  //     window.location.href = url
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          my: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          In progress...
        </Typography>
        <Alert sx={{ mb: 2 }} severity="info" variant='filled'>Next.js / MUI v5-beta / TypeScript</Alert>
        <Stack spacing={1}>
          {/* <Link href="/about" color="secondary">
            Go to the about page
          </Link> */}
          {/* <Button endIcon={<ArrowForwardIcon />} variant="contained" color='primary' component={Link} noLinkStyle href='http://pravosleva.ru/cra/' target='_blank'>
            Go to CRA version (mui@4.x)
          </Button> */}
          <Button endIcon={<ArrowForwardIcon />} variant="contained" color='primary' component={Link} noLinkStyle href='https://t.me/pravosleva_bot?start=autopark' target='_blank'>
            Autopark
          </Button>
          <Link href='/about' color="secondary" shallow>
            Go to about page
          </Link>
          <Link href='https://selection4test.ru' color="secondary" target='_blank'>
            Old trash
          </Link>
        </Stack>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
