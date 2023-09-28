import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    alignItems: 'center',

    // @ts-ignore
    gap: theme.spacing(2),
    // @ts-ignore
    borderRadius: theme.spacing(2),

    border: '2px solid #fff',
    boxShadow: 'unset',
    transition: 'all .2s linear',
    // cursor: 'pointer',
  },
  activeWrapper: {
    border: '2px solid #fff',
    // @ts-ignore
    outline: `2px solid ${theme.palette.primary.dark}`,
  },

  display: {
    // border: '1px dashed lightgray',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    alignItems: 'center',

    // @ts-ignore
    gap: theme.spacing(2),
  },

  circleBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // -- NOTE: Left side
  displayTitle: {
    // border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    // border: '1px solid red',
    forntWeight: 'bold',
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    fontWeight: 400,
    fontSize: '1rem',
    // lineHeight: 1.5,
    lineHeight: 2,
    letterSpacing: '0.00938em',
  },
  description: {
    fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
  },
  // --
  actions: {
    // border: '1px solid red',
    marginLeft: 'auto',

    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',

    // @ts-ignore
    gap: theme.spacing(0),
  },
}))
