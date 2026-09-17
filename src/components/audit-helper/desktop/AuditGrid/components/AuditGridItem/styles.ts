import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

export const useStyles = makeStyles<Theme>((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: theme.spacing(2),
    minHeight: '52px',
    width: '100%', 
    boxSizing: 'border-box',
    userSelect: 'none',

    // 🎯 ТОТАЛЬНЫЙ ОГНЕТУШИТЕЛЬ ДЛЯ ВСЕХ ВИДОВ ФОКУСА РОДИТЕЛЯ И ДЕТЕЙ:
    // Мы явно запрещаем браузеру рисовать рамку на карточке, когда фокус падает на внутреннюю кнопку стрелочки!
    '&, &:focus, &:active, &:focus-visible, &:focus-within': {
      outline: 'none !important',
      outlineWidth: '0px !important',
      outlineColor: 'transparent !important',
      outlineOffset: '0px !important',
      WebkitTapHighlightColor: 'transparent !important',
    },
  },
  
  activeWrapper: {
    border: '2px solid #fff', 
    boxShadow: `0 0 0 2px ${theme.palette.primary.dark}`,
    outline: 'none !important',
    
    // Дублируем защиту для активного состояния
    '&, &:focus, &:active, &:focus-visible, &:focus-within': {
      outline: 'none !important',
      outlineWidth: '0px !important',
      outlineColor: 'transparent !important',
      WebkitTapHighlightColor: 'transparent !important',
    }
  },

  display: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(2),
    minWidth: 0, 
    flexGrow: 1, 
  },

  circleBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0, 
  },

  displayTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: 0, 
    flexGrow: 1,
  },

  name: {
    fontWeight: 'bold',
    fontSize: 'small',
    lineHeight: 1.3,
    letterSpacing: '0.00938em',
    width: '100%',
  },
  description: {
    fontFamily: 'Montserrat,system-ui,Roboto,Helvetica,Arial,sans-serif',
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.66,
    letterSpacing: '0.03333em',
    width: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    display: '-webkit-box',
    WebkitLineClamp: 2, 
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
    actions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: theme.spacing(0),
    flexShrink: 0, // Жестко запрещаем блоку кнопок сжиматься или улетать за экран

    // 🎯 ТОЧЕЧНЫЙ ОГНЕТУШИТЕЛЬ: Сбрасываем обводку у всех вложенных кнопок MUI
    '& .MuiButtonBase-root, & .MuiIconButton-root, & button': {
      outline: 'none !important',
      outlineWidth: '0px !important',
      outlineColor: 'transparent !important',
      boxShadow: 'none !important', // На всякий случай гасим дефолтные тени MUI
      WebkitTapHighlightColor: 'transparent !important',
      
      // Скрываем рамку фокуса, которая активируется браузером при клике мыши
      '&:focus, &:active, &:focus-visible, &:focus-within': {
        outline: 'none !important',
        outlineWidth: '0px !important',
        boxShadow: 'none !important',
        WebkitTapHighlightColor: 'transparent !important',
      },
    },

    [theme.breakpoints.down('lg')]: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
  },
}))
