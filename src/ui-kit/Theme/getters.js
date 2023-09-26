import { keys, path, prop } from 'ramda'

import { Theme } from './values'

export const themeColor = (value) => (props) => path(['theme', 'colors', value], props) || '#000'

export const getThemeColor = (value) => themeColor(value)({ theme: Theme })

export const themeColorsNames = keys(prop('colors', Theme))

export const themeFontFamily = (value) => (props) =>
  path(['theme', 'fontFamilies', value], props) || 'Montserrat, sans-serif'

export const getThemeFontFamily = (value) => themeFontFamily(value)({ theme: Theme })

export const themeTextStyle = (value) => (props) => {
  const currentStyle = path(['theme', 'textStyles', value], props)

  return {
    'font-weight': `${prop('fontWeight', currentStyle) || 400}`,
    'font-size': `${prop('fontSize', currentStyle) || 16}px`,
    'line-height': `${prop('lineHeight', currentStyle) || 24}px`,
  }
}

export const themeShadow = (value) => (props) => path(['theme', 'shadows', value], props) || 'none'

export const themeMediaQuery = (mqName, minOrMax = 'max') => (props) =>
  path(['theme', 'mediaQueries', mqName, minOrMax], props) || ''
