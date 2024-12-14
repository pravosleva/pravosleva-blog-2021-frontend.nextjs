export function isValidJson(str: string | undefined): boolean {
  try {
    switch (true) {
      case typeof str === 'string':
        // @ts-ignore
        JSON.parse(str)
        break
      default:
        throw new Error(`🚫 Incorrect type: ${typeof str}`)
    }
  } catch (e) {
    console.warn(e)
    return false
  }
  return true
}
