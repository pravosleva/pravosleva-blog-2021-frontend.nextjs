import { makeStyles } from '@mui/styles'
// import grey from '@material-ui/core/colors/grey'
// import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((_theme: any) => ({
  responsiveBlock: {
    // borderTop: '1px solid transparent',
    // border: 'none !important',
  },
  wrapper: {
    boxSizing: 'border-box',
    width: '100%',
    // minWidth: '350px',
    padding: '22px 30px',
    background: 'url(/static/img/covid-trash/bg-valid.svg) no-repeat 0 0',
    borderRadius: '16px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  h4: {
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: 400,
    color: '#fff',
    fontFamily: 'Lato-Bold,Arial,sans-serif !important',
  },
  activated: {
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'Lato,Arial,sans-serif,-apple-system',
    color: '#0b1f33',

    marginTop: '12px',

    '& > .target-text': {
      display: 'inline-block',
      padding: '6px 36px',
      background: '#fff',
      borderRadius: '16px',
      verticalAlign: 'baseline',
      color: '#0b1f33',
      fontFamily: 'Lato-Bold,Arial,sans-serif,-apple-system !important',
      fontWeight: 300,
    }
  },
}))