import { Alert, Button } from '@mui/material'
import { makeStyles, createStyles } from '@mui/styles'

type TProps = {
  resetErrorBoundary: () => void
  error: Error
}

const useStyles = makeStyles((theme) =>
  createStyles({
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
      '& > *:first-child': {
        // @ts-ignore
        marginRight: theme.spacing(2)
      },
    },
  }),
);

export const ErrorFallback = ({ error, resetErrorBoundary }: TProps) => {
  const classes = useStyles()
  const { message } = error

  return (
    <Alert variant="outlined" severity="error" title="Oops">
      <div className={classes.flexContainer}>
        <div>{message}</div>
        <Button size='small' autoFocus onClick={resetErrorBoundary} variant='outlined' color="primary">
          Try again
        </Button>
      </div>
    </Alert>
  )
}
