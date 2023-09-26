import { Alert, Box, Button, Container, Stack, Typography } from "@mui/material";
import Link from "~/components/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function AuthLogin() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
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
  );
}
