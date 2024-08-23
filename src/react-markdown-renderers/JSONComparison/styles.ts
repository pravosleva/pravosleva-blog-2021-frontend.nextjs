import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      fontSize: '13px',

      '& pre': {
        // marginBottom: '0px !important',
        whiteSpace: 'pre-wrap',
        // fontFamily: 'system-ui !important',
        fontWeight: 'bold',

        color: '#FFF',
        border: '2px solid #2D3748',
        padding: '16px',
        margin: 0,
        // boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#2D3748',
        // borderRadius: '8px',
      },
      // @ts-ignore
      [theme.breakpoints.down('sm')]: {
        borderRadius: '0px',
      },
      // @ts-ignore
      [theme.breakpoints.up('md')]: {
        borderRadius: '8px',
      },
    },
  })
)
