import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles((_theme) =>
  createStyles({
    wrapper: {
      fontSize: '13px',

      '& pre': {
        marginBottom: '0px !important',
        whiteSpace: 'pre-wrap',

        color: '#FFF',
        border: '2px solid #2D3748',
        padding: '5px',
        margin: 0,
        // boxShadow: '0 0 4px rgba(0, 0, 0, 0.2)',
        backgroundColor: '#2D3748',
        borderRadius: '8px',
      },
    },
  })
)
