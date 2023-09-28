export const getReadableCamelCase = (str: string): string => {
  // V1:
  // return str
  //   .replace(/([A-Z])/g, ' $1')
  //   .replace(/^./, function (str) {
  //     return str.toUpperCase()
  //   })
  //   .slice(1)
  // V2:
  return str.replace(/([a-z])([A-Z])/g, '$1 $2') // /([a-z0-9])([A-Z])/ for numbers counting as lowercase characters
}
