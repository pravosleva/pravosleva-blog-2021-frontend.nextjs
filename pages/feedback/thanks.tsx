import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material'
import Link from '~/components/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Layout } from '~/components/Layout'

export default function FeedbackThanks() {
  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Thanks
          </Typography>
          <Alert sx={{ mb: 2 }} variant="outlined" severity="info">
            In progress...
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
