import { Alert, Box, Typography } from '@mui/material';
import { ResponsiveBlock } from '~/mui/ResponsiveBlock';

type TProps = {
  message: string;
  children?: React.ReactNode;
}

export const ErrorPage = ({ message, children }: TProps) => {
  return (
    <ResponsiveBlock
      isLimited
      isPaddedMobile
      style={{
        paddingBottom: '30px',
        // maxWidth: '100%'
      }}
    >
      <Box
        sx={{
          py: 6,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Oops...
        </Typography>
        <Alert variant="filled" severity="error">
          <Typography variant="body2" component="h2" gutterBottom>
            {message}
          </Typography>
        </Alert>
        {children}
      </Box>
    </ResponsiveBlock>
  )
}
