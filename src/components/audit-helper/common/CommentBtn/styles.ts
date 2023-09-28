import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  commentBox: {
    // maxWidth: '100%',
    height: '100%',
    // background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
    // @ts-ignore
    border: `2px solid ${theme.palette.primary.dark}`,
    // borderRadius: 'inherit',
    // @ts-ignore
    borderRadius: theme.spacing(2),
    // backgroundImage: '',
    // @ts-ignore
    // backgroundColor: theme.palette.primary.dark,
    // @ts-ignore
    padding: theme.spacing(1, 1, 1, 1),
    // '& > div:not(:last-child)': {
    //   marginBottom: theme.spacing(2),
    // },
    // color: '#fff',

    display: 'flex',
    flexDirection: 'column',
  },
  commentTitle: {
    // fontSize: '13px',

    maxWidth: '100%',
  },
  commentDescription: {
    // marginBottom: 'auto',
    // @ts-ignore
    // marginBottom: theme.spacing(3),
    height: '100%',

    '& > pre': {
      // border: '1px solid red',
      // @ts-ignore
      borderRadius: theme.spacing(2, 2, 0, 0),
      marginBottom: 0,
      backgroundColor: 'transparent',
      // @ts-ignore
      padding: theme.spacing(1, 1, 1, 1),
      // border: '1px solid red'
    }
  },
  commentAction: {
    display: 'flex',
    alignItems: 'center',
    '& > div': {
      marginLeft: 'auto',
      display: 'flex',
      // @ts-ignore
      gap: theme.spacing(1),
    },
    // @ts-ignore
    // paddingRight: theme.spacing(1),
  },
}))
