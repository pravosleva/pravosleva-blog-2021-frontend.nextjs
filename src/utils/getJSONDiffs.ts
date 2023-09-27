export function getJSONDiffs(obj1: any, obj2: any): any {
  const result: any = {}
  if (Object.is(obj1, obj2)) {
    return undefined
  }
  if (!obj2 || typeof obj2 !== 'object') {
    return obj2
  }
  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach((key) => {
      if (Array.isArray(obj1[key]) || Array.isArray(obj2[key])) {
        if (!Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          result[key] = obj2[key]
          return
        } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
          const arr = obj2[key].reduce((acc: any[], item: any) => {
            if (!obj1[key].includes(item)) acc.push(item)
            return acc
          }, [])
          if (arr.length > 0) result[key] = arr
          return
        }
      }
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key]
      }
      if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        const value = getJSONDiffs(obj1[key], obj2[key])
        if (!!value) result[key] = value
      }
    })
  return result
}
