import { makeStyles } from '@mui/styles'
// import grey from '@material-ui/core/colors/grey'
// import { contentBottomMargin, breadCrumbsHeight, siteHeaderHeight } from '~/common/mui/baseStyles'

export const useStyles = makeStyles((_theme: any) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '350px',
    margin: '0 auto',
  },
  externalWrapper: {
    padding: '0 17px',
    // border: '1px solid transparent',
  },
}))