export const getSubColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#ededed'
    case 'gray':
      return '#ededed'
    case 'hard-gray':
      return '#ededed'
    case 'dark':
      return '#ededed'
    default:
      return '#fff'
  }
}
