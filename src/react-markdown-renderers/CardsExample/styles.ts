import { makeStyles, createStyles } from '@mui/styles'

export const useStyles = makeStyles((theme) =>
  createStyles({
    // @ts-ignore
    [theme.breakpoints.up('sm')]: {
      externalWrapper: {},
      wrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
        gap: '24px',
        width: '100%',
        alignItems: 'stretch',
      },
      cardWrapper: {
        // minWidth: '100%',
        // width: '100%',
      },
      card: {
        borderRadius: '16px',
        height: '100%',
      },
      internalCardGradientSpace: {
        padding: '16px 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRadius: 'inherit',
      },
    },
    // @ts-ignore
    [theme.breakpoints.down('sm')]: {
      externalWrapper: {
        width: 'calc(100% + 32px)',
        transform: 'translateX(-16px)',
      },
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
        borderRadius: '16px',
        height: '100%',
      },
      internalCardGradientSpace: {
        padding: '16px 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRadius: 'inherit',
      },
    },
  })
)
