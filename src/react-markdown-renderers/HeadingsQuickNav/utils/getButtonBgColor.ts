export const getButtonBgColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#ededed'
    case 'gray':
      return 'rgba(255,255,255,0.1)'
    case 'hard-gray':
      return 'rgba(255,255,255,0.1)'
    case 'dark':
      return 'rgba(255, 255, 255, 0.1)'
    default:
      return '#fff'
  }
}