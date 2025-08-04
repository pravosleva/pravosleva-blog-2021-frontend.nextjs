import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      gap: '16px',
      flexDirection: 'row',
      flexWrap: 'nowrap',

      overflowX: 'scroll',
      scrollSnapType: 'x mandatory',

      '&::-webkit-scrollbar': {
        display: 'none',
      },

      /* NOTE: [1/2] Если нужны первая и последняя по центру */
      paddingLeft: '10%',
      paddingRight: '10%',
    },
    cardWrapper: {
      scrollSnapAlign: 'center',

      /* NOTE: [2/2] Если нужен хвост и перед, но [1/2] выключено */
      minWidth: '100%',
      width: '100%',
    },

    card: {
      height: '100%',
      borderRadius: '16px',
    },
    internalCardContent: {
      padding: '16px 16px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      borderRadius: 'inherit',
    },
  })
)
