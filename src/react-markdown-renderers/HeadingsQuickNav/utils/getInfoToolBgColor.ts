export const getInfoToolBgColor = ({ currentTheme }: { currentTheme: string }) => {
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

  // switch (currentTheme) {
  //   case 'light':
  //     return '#fff'
  //   case 'gray':
  //     return '#333'
  //   case 'hard-gray':
  //     return '#1e1e1e'
  //   case 'dark':
  //     return '#1e1e1e'
  //   default:
  //     return '#fff'
  // }

  switch (currentTheme) {
    case 'light':
      return 'rgba(255, 255, 255, 0.8)'
    case 'gray':
      return 'rgba(0, 0, 0, 0.4)'
    case 'hard-gray':
      return 'rgba(0, 0, 0, 0.6)'
    case 'dark':
      return 'rgba(255, 255, 255, 0.1)'
    default:
      return '#fff'
  }
}
