import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  warpper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderLeft: '4px solid rgba(203,213,225,1)',
    '& > div:first-child': {
      paddingTop: theme.spacing(1),
    },
    '& > div:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },

  buttonWrapper: {
    width: '100%',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '16px',
  },
  desktopStickyBottomButton: {
    [theme.breakpoints.up('md')]: {
      paddingBottom: theme.spacing(2),
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
    },
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
  },
}))
