export const getActiveBgColor = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return 'rgba(255, 142, 83, 0.1)' 
    case 'gray':
      return 'rgba(57, 229, 172, 0.1)'
    case 'hard-gray':
      return 'rgba(57, 229, 172, 0.1)'
    case 'dark':
      return 'rgba(255, 142, 83, 0.1)' 
    default:
      return 'rgba(255, 142, 83, 0.1)' 
  }
}
