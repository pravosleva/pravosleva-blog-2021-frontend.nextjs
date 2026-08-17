export const getActiveBorderCSS = ({ currentTheme }: { currentTheme: string }) => {
  switch (currentTheme) {
    case 'light':
      return '1px solid #FF8E53'
    case 'gray':
      return '1px solid #39e5ac'
    case 'hard-gray':
      return '1px solid #39e5ac'
    case 'dark':
      return '1px solid #FF8E53'
    default:
      return '1px solid #FF8E53'
  }
}
