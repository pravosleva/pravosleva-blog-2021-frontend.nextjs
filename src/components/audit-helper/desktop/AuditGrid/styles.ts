import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    minHeight: '100%',
    display: 'grid',
    // @ts-ignore
    columnGap: theme.spacing(2),
    // @ts-ignore
    rowGap: theme.spacing(2),

    // @ts-ignore
    [theme.breakpoints.down('md')]: {
      // gridTemplateColumns: '1fr',
      gridTemplateColumns: 'minmax(250px, 1fr)',
      // border: '1px dashed red',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    },
  },

  // NOTE: Left side
  leftSideWrapper: {
    // border: '1px solid black',
    // paddingBottom: '16px',

    display: 'flex',
    flexDirection: 'column',
    // @ts-ignore
    // gap: theme.spacing(2),
    gap: '0px',

    // -- NOTE: Exp?
    // maxHeight: '100dvh',
    // overflowY: 'auto',
    // position: 'sticky',
    // top: '0px',
    // --
  },

  stickyTopPanel: {
    position: 'sticky',
    top: '0px',
    zIndex: 2,
    // @ts-ignore
    // padding: theme.spacing(2, 0, 2, 0),
    // borderBottom: '1px solid lightgray',
    // backgroundColor: '#fff',
  },
  auditListWrapper: {
    display: 'flex',
    flexDirection: 'column',
    // @ts-ignore
    gap: theme.spacing(1),
    boxSizing: 'border-box',
  },
  // isLimitedHeight: {
  //   paddingTop: '8px',
  //   maxHeight: 'calc(100dvh - 50px)',
  //   overflowY: 'auto',
  //   position: 'sticky',
  //   top: '0px',
  // },
  auditItem: {
    // @ts-ignore
    padding: '2px 2px 0 2px', // NOTE: Special for outline css prop
  },

  // NOTE: Right side
  rightSideWrapper: {
    // border: '1px dashed lightgray',
    // paddingBottom: '16px',
    // maxWidth: '100%',

    // -- NOTE: Look
    maxHeight: '100dvh',
    overflowY: 'auto',
    position: 'sticky',
    top: '0px',
    // --
    
    display: 'flex',
  },
}))
