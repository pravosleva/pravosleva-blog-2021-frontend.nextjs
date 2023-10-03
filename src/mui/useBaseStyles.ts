import { makeStyles } from '@mui/styles'

export const contentBottomMargin = 50
export const breadCrumbsHeight = 37
export const siteHeaderHeight = {
  desktop: 50,
  mobile: 40,
}

export const useBaseStyles = makeStyles((theme) => ({
  redBox: {
    // border: '1px dashed red',
  },
  
  noPaddedMobile: {
    // @ts-ignore
    [theme.breakpoints.down('xs')]: {
      padding: '0px !important',
    },
  },
  desktopFrameInternalBox: {
    color: 'blue',
    // @ts-ignore
    [theme.breakpoints.up('lg')]: {
      // @ts-ignore
      padding: theme.spacing(1, 2, 1, 2),
    },
    // @ts-ignore
    [theme.breakpoints.down('md')]: {
      // @ts-ignore
      padding: theme.spacing(1, 2, 1, 2),
    },
    // @ts-ignore
    [theme.breakpoints.between('sm', 'md')]: {
      // @ts-ignore
      padding: theme.spacing(1, 3, 1, 3),
      // border: '1px dashed green',
    },
    // @ts-ignore
    [theme.breakpoints.down('xs')]: {
      // @ts-ignore
      padding: theme.spacing(1, 2, 1, 2),
    },
  },
  isRounded: {
    borderRadius: '4px',
  },
  isRoundedDesktop: {
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      borderRadius: '4px',
    },
  },

  standardJobInternalBox: {
    // Etc.
  },
  fixedPreloader: {
    zIndex: 2,
    position: 'fixed',
    bottom: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '20px',
    height: '20px',
    backgroundColor: 'transparent',

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperAsGrid: {
    // @ts-ignore
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      '& > div:not(:last-child)': {
        marginBottom: '20px',
      }
    },
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      display: 'grid',
      columnGap: '20px',
      rowGap: '20px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    },
  },
  subWrapper: {
    '& > div:not(:last-child)': {
      marginBottom: '20px',
    },
  },
}))
