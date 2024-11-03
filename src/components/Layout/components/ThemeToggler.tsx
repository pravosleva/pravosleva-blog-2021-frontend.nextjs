import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalTheming } from '~/hooks/useGlobalTheming'
// import { getThemeIcon } from '~/utils/globalTheme/getThemeIcon'
import { IRootState } from '~/store/IRootState'
import { withTranslator } from '~/hocs/withTranslator'
import { getStringWithUpperCaseFirstChar } from '~/utils/getStringWithUpperCaseFirstChar'
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle'
// import LightbulbIcon from '@mui/icons-material/Lightbulb'
import Brightness5Icon from '@mui/icons-material/Brightness5'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness6Icon from '@mui/icons-material/Brightness6'

enum ETheme {
  LIGHT = "light",
  GRAY = "gray",
  HRAD_GRAY = "hard-gray",
  // DARK_GRAY = "dark-gray",
  DARK = "dark",
}
const themeIcons: {
  [key in ETheme]: React.ReactNode;
} = {
  [ETheme.LIGHT]: <LightbulbCircleIcon fontSize='small' />,
  [ETheme.GRAY]: <Brightness5Icon fontSize='small' />,
  [ETheme.HRAD_GRAY]: <Brightness6Icon fontSize='small' />,
  [ETheme.DARK]: <Brightness4Icon fontSize='small' />,
}

export const ThemeToggler = withTranslator(({ t, type }: any) => {
  const { onSetNextTheme } = useGlobalTheming()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  // const themeIcon = useMemo(() => getThemeIcon(currentTheme), [currentTheme])
  // @ts-ignore
  const ThemeIcon = useMemo(() => themeIcons[currentTheme] || <span>NO</span>, [currentTheme])

  return (
    <>
      <li
        onClick={onSetNextTheme}
        style={{
          width: type === 'desktop' ? '50px' : '40px',
          height: type === 'desktop' ? '50px' : '40px',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer',
          // border: '1px solid red',
        }}
        className="muted no-muted-on-hover"
        title={t('CURRENT_THEME_IS', { theme: getStringWithUpperCaseFirstChar(currentTheme) })}
      >
        <span
          className="min-width-span"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          {/* <i className={`${themeIcon} theme-toggler`}></i> */}
          {ThemeIcon}
        </span>
      </li>
      {/* <style jsx>{`
        @media (min-width: 768px) {
          .min-width-span {
            min-width: 47px;
          }
          .theme-toggler: {
            margin-left: 15px;
            margin-right: 15px;
          }
        }
        @media (max-width: 767px) {
          .min-width-span {
            min-width: 40px;
          }
          .theme-toggler: {
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      `}</style> */}
    </>
  )
})
