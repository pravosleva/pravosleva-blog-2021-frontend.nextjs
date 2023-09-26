export const getThemeIcon = (currentTheme: string): string => {
  switch (currentTheme) {
    case 'hard-gray':
      return 'fas fa-adjust'
    case 'dark':
      return 'fas fa-moon'
    case 'gray':
      return 'far fa-lightbulb'
    case 'light':
    default:
      return 'fas fa-lightbulb'
  }
}
