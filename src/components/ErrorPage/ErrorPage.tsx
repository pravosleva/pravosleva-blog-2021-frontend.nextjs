import { Alert, Box, Container, Typography } from "@mui/material";

type TProps = {
  message: string;
}

export const ErrorPage = ({ message }: TProps) => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          py: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Oops...
        </Typography>
        <Alert sx={{ mb: 2 }} variant="filled" severity="error">
          <Typography variant="body2" component="h2" gutterBottom>
            {message}
          </Typography>
        </Alert>
      </Box>
    </Container>
  )
}
