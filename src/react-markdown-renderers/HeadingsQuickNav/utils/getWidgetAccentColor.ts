export const getWidgetAccentColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#0162c8'
    case 'gray':
      return '#39e5ac'
    case 'hard-gray':
      return 'rgb(255, 204, 153)'
    case 'dark':
      return '#FF8E53'
    default:
      return 'inherit'
  }
}
