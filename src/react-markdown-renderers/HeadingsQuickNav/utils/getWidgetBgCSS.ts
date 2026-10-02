export const getWidgetBgCSS = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#FFF'
    case 'gray':
      return 'rgba(0,0,0,.5)'
    case 'hard-gray':
      return 'rgba(0,0,0,.3)'
    case 'dark':
      return 'rgba(0,0,0,.3)'
    default:
      return 'rgba(0,0,0,.3)'
  }
}
