import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'grid',
    // @ts-ignore
    columnGap: theme.spacing(2),
    // @ts-ignore
    rowGap: theme.spacing(2),
    // @ts-ignore
    [theme.breakpoints.down('md')]: {
      // gridTemplateColumns: '1fr',
      gridTemplateColumns: 'minmax(250px, 1fr)',
      // border: '1px solid red',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    },
    gridAutoFlow: 'dense',
    
  },
  gridItemBg: {
    objectFit: 'cover',
    // @ts-ignore
    borderRadius: theme.spacing(2),
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  gridItemBox: {
    // maxWidth: '100%',
    height: '100%',
    background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
    borderRadius: 'inherit',
    backgroundImage: '',
    // @ts-ignore
    padding: theme.spacing(2, 2, 2, 2),
    // '& > div:not(:last-child)': {
    //   marginBottom: theme.spacing(2),
    // },
    color: '#fff',

    display: 'flex',
    flexDirection: 'column',
  },
  gridItemTitle: {
    // fontSize: '13px',

    maxWidth: '100%',
  },
  gridItemDescription: {
    // marginTop: 'auto',
    // @ts-ignore
    marginBottom: theme.spacing(3),
    height: '100%',
  },
  gridItemAction: {
    display: 'flex',
    alignItems: 'center',
    '& > div:last-child': {
      marginLeft: 'auto',
    },
    // @ts-ignore
    paddingRight: theme.spacing(1),
  },
}))
