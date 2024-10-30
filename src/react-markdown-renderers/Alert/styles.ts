import { makeStyles } from '@mui/styles'
// import { theme } from '~/mui/theme'

export enum EType {
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  info = 'info',
  default = 'default',
  custom = 'custom',
  draft = 'draft',
}
const getIconByType = (type: EType, icon?: string) => {
  switch (true) {
    case type === EType.success:
      return '👌'
    case type === EType.warning:
      return '⚡'
    case type === EType.danger:
      return '🔥'
    case type === EType.info:
      return 'ℹ️'
    case type === EType.custom && !!icon:
      return '👌'
    case type === EType.draft:
      // return '🖆'
      return '✒️'
    case type === EType.default:
    default:
      return '💡'
  }
}

export const useStyles = makeStyles((_theme) => ({
  likeBlockuote: {
    '& h2': {
      lineHeight: '1em',
      marginTop: 0,
    },
    // fontSize: '0.9em',
    maxWidth: '100%',
    // maxWidth: '550px',
    borderRadius: '8px',
    margin: '0px auto 1.45rem auto',
    // fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontSize: '0.9em',
    color: '#555',
    /* padding: 1.2em 30px 1.2em 75px; */
    padding: '1.2em 30px 1.2em 50px',
    // borderLeft: '8px solid #78c0a8',
    // lineHeight: '1.6',
    position: 'relative',
    background: '#ededed',
    // quotes: '"“" "”" "‘" "’"',
    '&::before': {
      fontFamily: 'Arial',
      // color: '#78c0a8',
      fontStyle: 'normal',
      fontSize: '2em',
      position: 'absolute',
      left: '8px',
      top: '8px',
      paddingRight: '',
    },
    boxShadow: '0 8px 6px -6px rgba(0,0,0,0.3)',
    '& a': {
      color: '#000',
      textDecoration: 'underline',
    },
    '& p': {
      margin: 0,
    },
  },
  likeBlockuote_success: {
    quotes: `"${getIconByType(EType.success)}" "”" "${getIconByType(EType.success)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    // background: 'rgba(120,192,168,1)',
    background: 'linear-gradient(180deg, #00b273 15%, #009e82 90%)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(120,192,168,0.4)',
    },
    '& a': {
      color: '#FFF !important',
    },
  },
  likeBlockuote_warning: {
    quotes: `"${getIconByType(EType.warning)}" "”" "${getIconByType(EType.warning)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    // background: 'rgba(255,142,83,1)',
    background: 'linear-gradient(180deg, #ff6c52 15%, #ff8a53 90%)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '0px 0px 8px rgba(255,255,255,0.65)',
    },
    '& a': {
      color: '#FFF !important',
    },
  },
  likeBlockuote_danger: {
    quotes: `"${getIconByType(EType.danger)}" "”" "${getIconByType(EType.danger)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    // background: 'rgba(244,67,44,1)',
    background: 'linear-gradient(180deg, #d63435 15%, #fd5951 90%)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(250,114,104,0.4)',
    },
    '& a': {
      color: '#FFF !important',
    },
  },
  likeBlockuote_info: {
    quotes: `"${getIconByType(EType.info)}" "”" "${getIconByType(EType.info)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.35)',
    // borderLeft: '8px solid #3FAEFD',
    // background: 'rgba(56,130,196,1)',
    background: 'linear-gradient(180deg, #0095fa 15%, #00b7ff 90%)',
    color: '#FFF',
    '&::before': {
      content: 'open-quote',
      // textShadow: '0px 0px 8px rgba(255,255,255,0.65)',
    },
    '& a': {
      color: '#fff !important',
    },
  },
  likeBlockuote_default: {
    quotes: `"${getIconByType(EType.default)}" "”" "${getIconByType(EType.default)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.4)',
    background: 'rgba(222,222,222,1)',
    color: '#000',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(222,222,222,0.4)',
      textShadow: '0px 0px 7px #FFF',
    },
    '& a': {
      // @ts-ignore
      // color: theme.palette.primary.main,
      color: '#000 !important',
    },
  },
  likeBlockuote_draft: {
    quotes: `"${getIconByType(EType.draft)}" "”" "${getIconByType(EType.draft)}" "’"`,
    borderLeft: '8px solid rgba(255,255,255,0.5)',
    background: '#00e6b8',
    color: '#000',
    '&::before': {
      content: 'open-quote',
      // textShadow: '3px 3px rgba(222,222,222,0.4)',
      textShadow: '0px 0px 7px #FFF',
    },
    '& a': {
      // @ts-ignore
      // color: theme.palette.primary.main,
      color: '#000 !important',
    },
  },
}))
