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
        marginBottom: '24px',
      }
    },
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      display: 'grid',
      columnGap: '24px',
      rowGap: '24px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    },
  },
  subWrapper: {
    '& > div:not(:last-child)': {
      marginBottom: '24px',
    },
  },

  customizableListingWrapper: {
    // paddingTop: 0,
    '& ul': {
      // border: '1px solid red',
      // listStyleImage: 'url(/static/svg/yellow-dot.svg)',
      listStyle: 'outside',
      listStyleType: "'✪'", // 'disc',
      '& > li::marker': {
        // transform: 'translateY(-2px)',
        // color: '#4183c4',
        // content: '✪',
      },
    },

    '& ul, ol': {
      '& > li': {
        marginBottom: '8px',
        paddingLeft: '8px',
        '& > p': {
          display: 'inline',
        },
        '& > blockquote': {
          marginTop: '0px !important',
          marginBottom: '0px !important',
        },
      },
    },
  },
}))
