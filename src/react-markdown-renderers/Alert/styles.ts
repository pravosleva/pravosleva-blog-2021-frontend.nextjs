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
    // whiteSpace: 'pre-wrap', // Оставляем для старого контента из value
    maxWidth: '100%',
    borderRadius: '16px',
    margin: '0px auto 1.45rem auto',
    fontStyle: 'normal',
    fontSize: '0.9em',
    color: '#555',
    padding: '16px 16px 16px 50px',
    position: 'relative',
    background: '#ededed',
    '&::before': {
      fontFamily: 'Arial',
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

    /* ==========================================================
       ИСПРАВЛЕНО: ЖЕСТКИЙ СБРОС ДЛЯ ПОДДЕРЖКИ НОВОГО СИНТАКСИСА КОДА
       Отключаем pre-wrap для элементов кода, чтобы они не дробились 
       посимвольно, и возвращаем им стандартный скролл
       ========================================================== */
    // '& pre, & code, & span': {
    //   whiteSpace: 'pre !important', /* Запрещаем перенос инлайн-элементов кода */
    // },
    // '& pre': {
    //   overflowX: 'auto !important', /* Включаем горизонтальный скролл для длинных строк */
    //   width: '100% !important',
    //   display: 'block !important',
    // },
    /* Для обычных абзацев внутри нового синтаксиса возвращаем нормальный перенос текста */
    '& .alert-content-nodes p': {
      whiteSpace: 'normal !important',
      margin: '0 0 1em 0 !important',
    },
    '& .alert-content-nodes p:last-child': {
      margin: '0 !important',
    },
    '& .alert-content-nodes .code-block-wrapper button': {
      display: 'none',
    },
    whiteSpace: 'pre-wrap',
    
    // ГАРАНТИРОВАННЫЙ СБРОС ЛЕСЕНКИ ДЛЯ КОДА
    '& pre, & code, & span': {
      whiteSpace: 'pre !important',
      wordBreak: 'normal !important',
      wordWrap: 'normal !important'
    },
    '& pre': {
      overflowX: 'auto !important',
      display: 'block !important',
      width: '100% !important',
      padding: '16px !important',
    }
  },
  likeBlockuote_success: {
    quotes: `"${getIconByType(EType.success)}" "”" "${getIconByType(EType.success)}" "’"`,
    borderLeft: '16px solid rgba(255,255,255,0.35)',
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
    borderLeft: '16px solid rgba(255,255,255,0.35)',
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
    borderLeft: '16px solid rgba(255,255,255,0.35)',
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
    borderLeft: '16px solid rgba(255,255,255,0.35)',
    // borderLeft: '16px solid #3FAEFD',
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
    borderLeft: '16px solid rgba(255,255,255,0.4)',
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
    borderLeft: '16px solid rgba(255,255,255,0.5)',
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
