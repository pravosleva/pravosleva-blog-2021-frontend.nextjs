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
      // border: '1px solid red',
    },
    // @ts-ignore
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    },
  },

  // NOTE: Left side
  leftSideWrapper: {
    // border: '1px solid black',

    display: 'flex',
    flexDirection: 'column',
    // @ts-ignore
    gap: theme.spacing(2),
  },
  auditItem: {
    // @ts-ignore
    // padding: theme.spacing(1),
  },

  // NOTE: Right side
  rightSideWrapper: {
    // border: '1px dashed lightgray',
    // maxWidth: '100%',
    
    display: 'flex',
  },
}))
