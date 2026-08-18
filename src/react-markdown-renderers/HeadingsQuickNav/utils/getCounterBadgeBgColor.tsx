export const getCounterBadgeBgColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#FFC800'
    case 'gray':
      return '#FFC800'
    case 'hard-gray':
      return '#39e5ac'
    case 'dark':
      return '#FF8E53'
    default:
      return '#fff'
  }
}