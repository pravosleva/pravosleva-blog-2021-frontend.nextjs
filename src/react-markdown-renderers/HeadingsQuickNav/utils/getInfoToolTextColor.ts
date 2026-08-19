export const getInfoToolTextColor = ({ currentTheme }: { currentTheme: string }) => {
  // -- NOTE: Original (bottom action)
  // const isDarkTheme = currentTheme === 'dark' || currentTheme === 'hard-gray'
  // backgroundColor: isDarkTheme ? '#2a2a2a' : '#ffffff',
  // border: isDarkTheme ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)'
  // --

  // -- NOTE: Original (top sticky header)
  // isDarkTheme -> #1e1e1e
  // gray -> #333
  // light -> #fff
  // --

  switch (currentTheme) {
    case 'light':
      return '#000'
    case 'gray':
      return '#fff'
    case 'hard-gray':
      return '#fff'
    case 'dark':
      return '#fff'
    default:
      return '#fff'
  }
}
