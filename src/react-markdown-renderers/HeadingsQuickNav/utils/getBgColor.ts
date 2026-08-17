export const getBgColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#ededed'
    case 'gray':
      return '#ededed'
    case 'hard-gray':
      return 'gray'
    case 'dark':
      return 'rgba(255, 255, 255, 0.1)'
    default:
      return '#fff'
  }
}