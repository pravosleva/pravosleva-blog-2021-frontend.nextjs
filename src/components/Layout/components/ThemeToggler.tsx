import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useGlobalTheming } from '~/hooks/useGlobalTheming'
import { getThemeIcon } from '~/utils/globalTheme/getThemeIcon'
import { IRootState } from '~/store/IRootState'
import { withTranslator } from '~/hocs/withTranslator'
import { getStringWithUpperCaseFirstChar } from '~/utils/getStringWithUpperCaseFirstChar'

export const ThemeToggler = withTranslator(({ t }: any) => {
  const { onSetNextTheme } = useGlobalTheming()
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const themeIcon = useMemo(() => getThemeIcon(currentTheme), [currentTheme])

  return (
    <>
      <li
        onClick={onSetNextTheme}
        style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '0px', cursor: 'pointer' }}
        className="muted no-muted-on-hover"
        title={t('CURRENT_THEME_IS', { theme: getStringWithUpperCaseFirstChar(currentTheme) })}
      >
        <span
          className="min-width-span"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <i className={`${themeIcon} theme-toggler`}></i>
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
