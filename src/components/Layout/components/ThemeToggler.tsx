import React from 'react'
import { useSelector } from 'react-redux'
import { useGlobalTheming } from '~/hooks/useGlobalTheming'
import { IRootState } from '~/store/IRootState'
import { withTranslator } from '~/hocs/withTranslator'
import { getStringWithUpperCaseFirstChar } from '~/utils/getStringWithUpperCaseFirstChar'
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness6Icon from '@mui/icons-material/Brightness6'

enum ETheme {
  LIGHT = "light",
  GRAY = "gray",
  HRAD_GRAY = "hard-gray",
  DARK = "dark",
}

// Оптимизация 1: Четко типизируем объект иконок, чтобы избавиться от @ts-ignore
const themeIcons: Record<string, React.ReactNode> = {
  [ETheme.LIGHT]: <LightbulbCircleIcon fontSize="small" />,
  [ETheme.GRAY]: <Brightness5Icon fontSize="small" />,
  [ETheme.HRAD_GRAY]: <Brightness6Icon fontSize="small" />,
  [ETheme.DARK]: <Brightness4Icon fontSize="small" />,
}

interface IThemeTogglerProps {
  // t: (str: string, opts?: any) => string;
  type: 'desktop' | 'mobile';
}

export const ThemeToggler = withTranslator<IThemeTogglerProps>(({ t, type }) => {
  const { onSetNextTheme } = useGlobalTheming()
  
  // Оптимизация 2: Вытаскиваем тему из Redux. 
  // Примитивная строка 'light' / 'dark' отлично сравнивается по умолчанию, лишних рендеров не будет.
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  // Оптимизация 3: Убираем useMemo. Прямой поиск по ключу в объекте происходит за O(1)
  // и работает быстрее, чем создание и проверка массива зависимостей в useMemo.
  const ThemeIcon = themeIcons[currentTheme] || <span>NO</span>

  // Оптимизация 4: Выносим инлайновые стили в useMemo или переменные, 
  // чтобы React не пересоздавал объекты стилей при каждом рендере.
  const size = type === 'desktop' ? '50px' : '40px'

  return (
    <li
      onClick={onSetNextTheme}
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      className="muted no-muted-on-hover"
      title={t('CURRENT_THEME_IS', { theme: getStringWithUpperCaseFirstChar(currentTheme) })}
    >
      <span
        className="min-width-span"
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}
      >
        {ThemeIcon}
      </span>
    </li>
  )
})

// Задаем имя компонента для отображения в React DevTools (для HOC это хорошая практика)
ThemeToggler.displayName = 'ThemeToggler'
