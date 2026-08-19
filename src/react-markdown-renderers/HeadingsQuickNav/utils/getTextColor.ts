export const getTextColor = ({ currentTheme }: { currentTheme: string }) => {
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
      return '#000'
  }
}
