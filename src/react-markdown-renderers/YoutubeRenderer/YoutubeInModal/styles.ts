import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: '0',
    overflow: 'hidden',
    // backgroundImage: 'url(/static2/images/smartprice/4video/maxresdefault.webp)',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    border: '1px solid grey',
    '&:hover': {
      border: '1px solid rgba(0,0,0,0.4)',
    },

    borderRadius: '8px',
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {
      marginBottom: '8px',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      marginBottom: '8px',
    },
    cursor: 'pointer',

    '& > .dimmer': {
      transition: 'opacity 0.2s ease-in-out',
      opacity: 0,
      '&:hover': {
        opacity: 1,
        backgroundColor: 'rgba(0,0,0,0.4) !important',
      },
    },

    '& > div > .arrow-hover': {
      color: '#FFF',
      border: '2px solid #FFF',
    },
    '&:hover > div > .arrow-hover': {
      color: '#fcbf2c',
      border: '2px solid #fcbf2c',
    },
  },
  internalWrapper: {
    zIndex: 3,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // [theme.breakpoints.down('sm')]: {},
    // [theme.breakpoints.up('md')]: {},
  },
  arrowBox: {
    color: '#FFF',
    zIndex: 4,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    '&:hover + .dimmer': {
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,0.4) !important',
    },

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    width: '65px',
    height: '65px',
  },
  arrow: {
    // cursor: 'pointer',
    // border: '2px solid #FFF',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    // color: '#FFF',
    // '&:hover': { color: '#fcbf2c', border: '2px solid #fcbf2c' },

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))
