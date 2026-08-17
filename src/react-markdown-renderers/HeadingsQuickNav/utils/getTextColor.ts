export const getTextColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#000'
    case 'gray':
      return 'inherit'
    case 'hard-gray':
      return '#fff'
    case 'dark':
      return 'inherit'
    default:
      return '#000'
  }
}
