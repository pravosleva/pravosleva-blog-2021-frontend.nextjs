import { makeStyles } from '@mui/styles'
// import grey from '@material-ui/core/colors/grey'
// import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((theme: any) => ({
  responsiveBlock: {
    // borderTop: '1px solid transparent',
    // border: 'none !important',
  },
  wrapper: {
    marginTop: '24px',
    width: '100%',

    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    backgroundColor: '#fff',
    border: '2px solid #0d4cd3',
    color: '#0d4cd3',
    '&:hover': {
      color: '#0d4cd3',
    },
    textDecoration: 'none',
    fontFamily: 'Lato,Arial,sans-serif,-apple-system !important',

    borderRadius: '8px',
    cursor: 'pointer',
    display: 'inline-block',
    // fontFamily: 'Lato,Arial,sans-serif',
    fontSize: '16px',
    lineHeight: '24px',
    outline: 'none',
    padding: '12px 24px',
    textAlign: 'center',
    whiteSpace: 'nowrap',

    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}))