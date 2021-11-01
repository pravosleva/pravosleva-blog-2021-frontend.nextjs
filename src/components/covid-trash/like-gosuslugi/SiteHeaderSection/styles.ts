import { makeStyles } from '@mui/styles'
// import grey from '@material-ui/core/colors/grey'
// import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((_theme: any) => ({
  responsiveBlock: {
    // borderTop: '1px solid transparent',
    // border: 'none !important',
  },
  wrapper: {
    padding: '30px 24px 30px 24px',
    display: 'flex',
    justifyContent: 'space-between',

    '& > .logo': {
      width: '126px',
      height: '24px',
      background: 'url(/static/img/covid-trash/gosuslugi-logo.svg) 0 100% no-repeat',
      backgroundSize: 'contain',
      textIndent: '100%',
    },

    '& > .translate-button': {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      '& > img': {
        margin: '0 8px 0 0',
      }
    }
  },
}))