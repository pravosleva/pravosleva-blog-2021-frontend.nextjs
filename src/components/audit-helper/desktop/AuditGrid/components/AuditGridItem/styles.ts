import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

export const useStyles = makeStyles<Theme>((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(2),
    borderRadius: theme.spacing(1),
    boxShadow: 'unset',
    transition: 'all .2s linear',
    minHeight: '52px',
    
    // 🔥 Заменяем нестандартный stretch на надежный 100% для кроссбраузерности
    width: '100%', 
    boxSizing: 'border-box',
  },
  activeWrapper: {
    border: '2px solid #fff',
    outline: `2px solid ${theme.palette.primary.dark}`,
  },

  display: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: theme.spacing(2),
    
    // 🎯 ФИКС 1: Разрешаем блоку сжиматься, ломаем дефолтное поведение Flexbox
    minWidth: 0, 
    flexGrow: 1, 
  },

  circleBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0, // Запрещаем иконке/кругу сжиматься
  },

  // -- NOTE: Left side
  displayTitle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    
    // 🎯 ФИКС 2: Разрешаем текстовой колонке ужиматься на планшетах
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

    // 🎯 ФИКС 3: Сохраняем все переводы строк пользователя (Enter)
    whiteSpace: 'pre-wrap',

    // 🎯 ФИКС 4: Агрессивно разрываем длинные ссылки и слова без пробелов, 
    // чтобы они не выталкивали правый блок кнопок за экран
    wordBreak: 'break-word',
    overflowWrap: 'break-word',

    // 👑 ОПЦИОНАЛЬНО (Красивое троеточие): Если на планшетах текст слишком длинный,
    // этот код аккуратно скроет всё, что не поместилось в 2 строки, добавив "..."
    display: '-webkit-box',
    WebkitLineClamp: 2, // Ограничение в 2 строки (можно поставить 3)
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  // --
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: theme.spacing(0),
    flexShrink: 0, // 🔥 Жестко запрещаем блоку кнопок сжиматься или улетать за экран

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
