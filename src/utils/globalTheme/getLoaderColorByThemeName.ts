export const getLoaderColorByThemeName = (themeName: string): string => {
  switch (themeName) {
    case 'gray':
    case 'hard-gray':
      return '#fff'
    case 'dark':
      return '#ff9000' // ff781e
    case 'light':
    default:
      return '#0162c8'
  }
}
