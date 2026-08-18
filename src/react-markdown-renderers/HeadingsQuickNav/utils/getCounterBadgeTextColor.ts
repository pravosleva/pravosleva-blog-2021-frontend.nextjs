export const getCounterBadgeTextColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#000'
    case 'gray':
      return '#000'
    case 'hard-gray':
      return '#000'
    case 'dark':
      return '#000'
    default:
      return '#fff'
  }
}