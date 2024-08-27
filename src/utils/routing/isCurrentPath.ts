export const isCurrentPath = (routerPathName: string, browserLink: string): boolean => {
  const isTested1 = routerPathName === browserLink
  const isTested2 = routerPathName[routerPathName.length - 1] === '/'
    && routerPathName.slice(0, -1) === browserLink
  const isTested3 = browserLink[browserLink.length - 1] === '/'
    && browserLink.slice(0, -1) === routerPathName

  return (
    isTested1
    || isTested2
    || isTested3
  )
}
