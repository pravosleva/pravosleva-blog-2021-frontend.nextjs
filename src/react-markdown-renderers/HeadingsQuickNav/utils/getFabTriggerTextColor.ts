export const getFabTriggerTextColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '#000'
    case 'gray':
      return '#fff'
    case 'hard-gray':
      return 'rgba(255,204,153,1)'
    case 'dark':
      return 'rgb(255,142,83)'
    default:
      return '#000'
  }
}
