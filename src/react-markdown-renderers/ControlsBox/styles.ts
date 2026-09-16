import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'

export const useStyles = makeStyles<Theme>((theme) => ({
  wrapper: {
    fontSize: '0.9em',
    width: '100%',
  },

  // 📱 МОБИЛЬНЫЙ СЛОЙ
  [theme.breakpoints.down('sm')]: {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      // Все чётные кнопки (2, 4, 6...) по умолчанию прижимаем влево
      '& > a:nth-child(even)': {
        alignItems: 'flex-start',
        textAlign: 'left',
      },

      // Все нечётные кнопки (3, 5, 7...) по умолчанию прижимаем вправо
      '& > a:nth-child(odd)': {
        alignItems: 'flex-end',
        textAlign: 'right',
      },

      // Исключение для Первой кнопки: она нечётная, но жёстко ровняется влево
      '& > a:first-child': {
        alignItems: 'flex-start',
        textAlign: 'left',
      },
    },
  },

  // 🖥️ ДЕСКТОПНЫЙ СЛОЙ (Исправлено дублирование ключей объектов)
  [theme.breakpoints.up('sm')]: {
    wrapper: {
      display: 'grid',
      columnGap: '16px',
      rowGap: '16px',
      gridTemplateColumns: '1fr 1fr', // Две равные колонки

      // =========================================================================
      // 📐 ГЕОМЕТРИЯ СЕТКИ (РАСПРЕДЕЛЕНИЕ КОЛОНОК)
      // =========================================================================
      
      // 1. Первая кнопка на всю ширину, если всего элементов БОЛЬШЕ двух (3, 4, 5...)
      '& > a:first-child:nth-last-child(n + 3)': {
        gridColumn: '1 / -1',
      },

      // 2. Первая и ЕДИНСТВЕННАЯ кнопка в списке занимает всю ширину
      '& > a:first-child:last-child': {
        gridColumn: '1 / -1',
      },

      // =========================================================================
      // 🔮 БАЗОВЫЙ ШАХМАТНЫЙ РИТМ ВЫРАВНИВАНИЯ КОНТЕНТА
      // =========================================================================
      
      // Все чётные кнопки (2, 4, 6...) по умолчанию прижимаем влево
      '& > a:nth-child(even)': {
        alignItems: 'flex-start',
        textAlign: 'left',
      },

      // Все нечётные кнопки (3, 5, 7...) по умолчанию прижимаем вправо
      '& > a:nth-child(odd)': {
        alignItems: 'flex-end',
        textAlign: 'right',
      },

      // Исключение для Первой кнопки: она нечётная, но жёстко ровняется влево
      '& > a:first-child': {
        alignItems: 'flex-start',
        textAlign: 'left',
      },

      // =========================================================================
      // 🚨 ОБЪЕДИНЕННЫЙ КЕЙС: Последняя кнопка на всю ширину (если она НЕ первая)
      // =========================================================================
      // 🔥 ИСПРАВЛЕНО: gridColumn, alignItems и textAlign собраны в один ключ!
      '& > a:first-child:nth-last-child(n + 3) ~ a:last-child:nth-child(even)': {
        gridColumn: '1 / -1',
        alignItems: 'flex-end',
        textAlign: 'right',
      },
    },
  },
}))
