import Cookie from 'js-cookie'

type TProps = { defaultTheme?: string }

export const getThemeFromCookieOrDefault = ({ defaultTheme }: TProps): string => {
  let _defaultTheme = defaultTheme || 'light'
  let detectedTheme: string | undefined

  if (typeof window !== 'undefined') detectedTheme = Cookie.get('theme')

  return detectedTheme || _defaultTheme
}
