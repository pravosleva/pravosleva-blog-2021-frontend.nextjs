import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((_theme) => ({
  // tst: {
  //   [theme.breakpoints.up('md')]: {},
  //   [theme.breakpoints.down('sm')]: {},
  // },
  dialogWrapper: {
    '& > div > div': {
      backgroundColor: 'transparent !important',
      boxShadow: 'none',

      margin: '0px',
    },
  },
  dialogContent: {
    backgroundColor: 'transparent',
  },
  dialogTitle: {
    '& > h2': {
      display: 'flex',
      width: '100%',
    },
  },
  closeIcon: {
    marginLeft: 'auto',
  },
}))
