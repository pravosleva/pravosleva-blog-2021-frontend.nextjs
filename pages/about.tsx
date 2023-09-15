import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProTip from '~/components/ProTip';
import Link from '~/components/Link';
import Copyright from '~/components/Copyright';
import { event } from '~/utils/googleAnalitycs';
import { Alert, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function About() {
  const handleClick = () => {
    try {
      const gaEvent = {
        action: "tst.0",
        params : { x: 1 },
      }
      const isConfirmed = window.confirm(`New event for google analytics?\n\n${JSON.stringify(gaEvent, null, 2)}`)
      if (isConfirmed) event(gaEvent)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          About
        </Typography>
        <Alert sx={{ mb: 2 }} variant="outlined" severity="info">
          In progress...
        </Alert>
        <Stack spacing={1}>
          <Button startIcon={<ArrowBackIcon />} variant="contained" color='primary' component={Link} noLinkStyle href="/" shallow>
            Go to the main page
          </Button>
          <Button variant="contained" color='inherit' onClick={handleClick}>
            GA tst 0
          </Button>
        </Stack>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
