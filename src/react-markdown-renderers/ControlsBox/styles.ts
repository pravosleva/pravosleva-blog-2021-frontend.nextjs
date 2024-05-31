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
    code_center: {
      alignItems: 'center',
    },
    code_right: {
      alignItems: 'center',
    },
    code_left: {
      alignItems: 'center',
    },
    code_spaceBetween: {
      alignItems: 'center',
    },
  },
  // @ts-ignore
  [theme.breakpoints.up('sm')]: {
    wrapper: {
      // border: '1px dashed lightgray',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '16px',
  
      justifyContent: 'center',
      alignItems: 'center',
    },
    code_center: {
      justifyContent: 'center',
    },
    code_right: {
      justifyContent: 'flex-end',
    },
    code_left: {
      justifyContent: 'flex-start',
    },
    code_spaceBetween: {
      justifyContent: 'space-between',
    },
  },
}))
