import { makeStyles } from '@mui/styles'
// import grey from '@material-ui/core/colors/grey'
// import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((_theme: any) => ({
  responsiveBlock: {
    // borderTop: '1px solid transparent',
    // border: 'none !important',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    '& > h6': {
      fontSize: '16px',
      lineHeight: '24px',
      // fontWeight: 600,
      // font-family: Lato,Arial,sans-serif,-apple-system;
      fontFamily: 'Lato-Bold,Arial,sans-serif,-apple-system !important',
      fontWeight: 400,
      color: '#0b1f33',
      marginBottom: 0,
    },
    '& > .small-text': {
      fontSize: '14px',
      lineHeight: '20px',
      // font-family: Lato,Arial,sans-serif,-apple-system;
      fontFamily: 'Lato,Arial,sans-serif,-apple-system !important',
      color: '#0b1f33',
      marginTop: '4px',
      '& > .gray': {
        color: '#66727f',
      }
    }
  },
}))