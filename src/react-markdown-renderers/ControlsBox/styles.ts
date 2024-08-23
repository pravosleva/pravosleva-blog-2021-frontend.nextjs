import { makeStyles } from '@mui/styles'
// import { theme } from '~/common/styled-mui/theme'
// const getIconByType = (type: EType, icon?: string) => {
//   switch (true) {
//     case type === EType.success:
//       return '👌'
//     case type === EType.warning:
//       return '⚡'
//     case type === EType.danger:
//       return '🔥'
//     case type === EType.info:
//       return 'ℹ️'
//     case type === EType.custom && !!icon:
//       return '👌'
//     case type === EType.default:
//     default:
//       return '💡'
//   }
// }

export const useStyles = makeStyles((theme) => ({
  // '& a': {
  //   color: theme.palette.primary.main,
  // },
  wrapper: {
    fontSize: '0.9em',
  },

  // @ts-ignore
  [theme.breakpoints.down('sm')]: {
    wrapper: {
      // border: '1px dashed lightgray',
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      gap: '16px',
  
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  // @ts-ignore
  [theme.breakpoints.up('sm')]: {
    wrapper: {
      // border: '1px dashed black',
      display: 'grid',
      columnGap: '16px',
      rowGap: '16px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',

      // '& > *:not(:last-child)': {
      //   borderRight: '1px solid rgba(0,0,0,0.5)',
      // },
    },
  },
}))
