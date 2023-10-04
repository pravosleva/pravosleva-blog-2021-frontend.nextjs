import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  warpper: {
    display: 'flex',
    flexDirection: 'column',

    // alignItems: 'center',
    gap: '16px',

    // NOTE: Exp
    // paddingLeft: '16px',
    
    // paddingRight: '10px',
    borderLeft: '4px solid lightgray',

    // '& > div:first-child': {
    //   // border: '1px solid red',
    //   // @ts-ignore
    //   paddingTop: theme.spacing(1),
    // },
  },

  buttonWrapper: {
    width: '100%',
    // backgroundColor: '#fff',
    paddingLeft: '16px',
    paddingRight: '16px',
    paddingTop: '16px',
  },
  desktopStickyBottomButton: {
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      // @ts-ignore
      paddingBottom: theme.spacing(2),

      position: 'sticky',
      bottom: 0,
      zIndex: 1,
    },
  },
}))
