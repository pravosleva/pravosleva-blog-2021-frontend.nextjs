import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  grid: {
    // border: '1px solid red',

    display: 'grid',
    columnGap: '16px',
    rowGap: '16px',

    // @ts-ignore
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    },
    gridAutoFlow: 'dense',

    '& > .grid-item': {
      borderRadius: '16px',
    },

    marginBottom: '16px',
  },

  reactYoutubeContainer: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: '0',
    overflow: 'hidden',
    backgroundColor: '#000',
    borderRadius: '16px',
    // [theme.breakpoints.down('sm')]: {
    //   marginBottom: '25px',
    // },
  },
  reactYoutube: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  },

  externalWrapper: {
    width: '100%',
    margin: '0 auto',
    // [theme.breakpoints.up('md')]: {
    //   maxWidth: '550px',
    // },
    // marginBottom: '20px',
  },
}))
