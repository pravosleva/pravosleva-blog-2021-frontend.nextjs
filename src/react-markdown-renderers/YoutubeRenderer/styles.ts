import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  reactYoutubeContainer: {
    position: 'relative',
    paddingBottom: '56.25%', // 16:9
    height: '0',
    overflow: 'hidden',
    backgroundColor: '#000',
    // @ts-ignore
    [theme.breakpoints.down('md')]: {
      borderRadius: '0px',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      borderRadius: '8px',
    },
    // border: '1px solid black',
  },
  reactYoutube: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    // border: '1px solid red',
  },

  externalWrapper: {
    width: '100%',
    margin: '0 auto',
    // @ts-ignore
    // [theme.breakpoints.up('md')]: {
    //   maxWidth: '850px',
    // },
    marginBottom: '8px',
    // border: '1px dashed red',
  },
}))