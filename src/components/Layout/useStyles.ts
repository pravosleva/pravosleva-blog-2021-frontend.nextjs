import { makeStyles } from '@mui/styles'
// import { grey } from '@mui/material/colors'
import {
  // contentBottomMargin,
  // breadCrumbsHeight,
  siteHeaderHeight,
} from '~/mui/useBaseStyles'

export const useStyles = makeStyles((theme) => ({
  // bg: {
  //   backgroundColor: grey[200],
  // },
  content: {
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      minHeight: `calc(100dvh - ${siteHeaderHeight.desktop}px)`,
      // padding: theme.spacing(1, 1, 4, 1),
      // maxWidth: '1000px',
      margin: '0 auto',
      // marginBottom: `${contentBottomMargin}px`,
      // overflowY: 'auto',
      // border: '1px solid transparent',
      // border: '1px solid red',
    },
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {
      minHeight: `calc(100dvh - ${siteHeaderHeight.mobile}px)`,
      // padding: theme.spacing(1, 1, 4, 1),
      // maxWidth: '1000px',
      margin: '0 auto',
      // marginBottom: `${contentBottomMargin}px`,
      // overflowY: 'auto',
      // border: '1px solid transparent',
      // border: '1px dashed red',
    },
  },
  // breadcrumbs: {
  //   position: 'sticky',
  //   top: 0,

  //   backgroundColor: '#FFF',
  //   zIndex: 5,
  //   borderBottom: '1px solid lightgray',
  // },
}))
