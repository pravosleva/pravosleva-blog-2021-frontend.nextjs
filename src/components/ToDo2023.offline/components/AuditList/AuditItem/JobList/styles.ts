import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  warpper: {
    display: 'flex',
    flexDirection: 'column',

    // alignItems: 'center',
    gap: '8px',
    paddingLeft: '16px',
    // paddingRight: '10px',
    borderLeft: '4px solid lightgray',

    '& > div:first-child': {
      // border: '1px solid red',
      // @ts-ignore
      paddingTop: theme.spacing(1),
    },
  },
}))
