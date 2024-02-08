import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  commentBox: {
    // maxWidth: '100%',
    height: '100%',
    // background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7))',
    // @ts-ignore
    // border: `2px solid ${theme.palette.primary.dark}`,
    border: '2px solid rgba(203,213,225,1)',
    borderLeftWidth: '4px',
    // border: '2px solid lightgray',
    // color: 'rgba(203,213,225,1)',
    // @ts-ignore
    // background: `linear-gradient(90deg, rgba(232,232,232,1) 0%, rgba(255,255,255,1) 70%, rgba(255,255,255,1) 100%)`,
    // background: `linear-gradient(90deg, ${theme.palette.secondary.light} 0%, rgba(255,255,255,1) 32%, rgba(255,255,255,1) 100%)`,
    // borderRadius: 'inherit',
    // @ts-ignore
    borderRadius: theme.spacing(1), // NOTE: BORDER_EXP
    // backgroundImage: '',
    // @ts-ignore
    // backgroundColor: theme.palette.primary.dark,
    // @ts-ignore
    padding: theme.spacing(3, 2, 2, 2),
    // '& > div:not(:last-child)': {
    //   marginBottom: theme.spacing(2),
    // },
    // color: '#fff',

    display: 'flex',
    flexDirection: 'column',
    minHeight: '52px',
    position: 'relative',
    fontWeight: 'bold',
    fontSize: 'small',
  },
  editableCommentBox: {
    // @ts-ignore
    padding: theme.spacing(3, 2, 4, 2),
  },
  absoluteBadgeRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    // @ts-ignore
    // backgroundColor: theme.palette.primary.dark,
    backgroundColor: 'rgba(203,213,225,1)',
    color: '#fff',
    borderRadius: '0 4px 0 8px',
    // padding: '2px 10px',
    padding: '0px 8px 2px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  absoluteControls: {
    position: 'absolute',
    // @ts-ignore
    bottom: theme.spacing(1),
    // @ts-ignore
    right: theme.spacing(1),
    // @ts-ignore
    // backgroundColor: theme.palette.primary.dark,
    color: '#fff',

    // borderRadius: '8px 0 4px 0',
    // padding: '2px 10px',
    // padding: '2px 10px 0px 10px',

    // border: '1px solid red',
    display: 'flex',
    gap: '0px',

    '& button': {
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'bold',
      // padding: '0px 10px 2px 10px',
      // padding: '2px 10px 0px 10px',
      padding: '2px 10px',
    },
    '& button:first-child': {
      // borderRadius: '8px 0 0 0',
      // @ts-ignore
      borderRadius: theme.spacing(1, 0, 0, 1),
    },
    '& button:last-child': {
      // borderRadius: '0 0 4px 0',
      // @ts-ignore
      borderRadius: theme.spacing(0, 1, 1, 0),
    },
  },
  btnDelete: {
    // @ts-ignore
    backgroundColor: theme.palette.error.light,
    color: '#fff',
    '&:hover': {
      // @ts-ignore
      backgroundColor: theme.palette.error.dark,
    },
  },
  btnEdit: {
    // @ts-ignore
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    '&:hover': {
      // @ts-ignore
      backgroundColor: theme.palette.primary.light,
    },
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
