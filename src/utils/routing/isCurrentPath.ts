export const isCurrentPath = (browserLink: string, appLink: string): boolean => {
  return (
    browserLink === appLink ||
    (browserLink[browserLink.length - 1] === '/' && browserLink.slice(0, -1) === appLink) ||
    (appLink[appLink.length - 1] === '/' && appLink.slice(0, -1) === browserLink)
  )
}
