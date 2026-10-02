export const getWidgetBorderCSS = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '2px solid #0162c8'
    case 'gray':
      return '2px solid #39e5ac'
    case 'hard-gray':
      return '2px solid rgb(255, 204, 153)'
    case 'dark':
      return '2px solid #FFF'
    default:
      return '2px solid #FF8E53'
  }
}
