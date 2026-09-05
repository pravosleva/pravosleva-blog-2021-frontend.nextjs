export function getJSONDiffs(obj1: any, obj2: any): any {
  // 1. Быстрая проверка на идентичность примитивов или ссылок
  if (Object.is(obj1, obj2)) {
    return undefined
  }

  // 2. Если obj2 не является объектом или равен null, то результатом разницы является сам obj2
  if (obj2 === null || typeof obj2 !== 'object') {
    return obj2
  }

  // 3. Если obj1 не объект (а obj2 точно объект), то возвращаем obj2 целиком
  if (obj1 === null || typeof obj1 !== 'object') {
    return obj2
  }

  // 4. Специальная обработка массивов (для JSON-структур)
  if (Array.isArray(obj1) || Array.isArray(obj2)) {
    // Если структуры разные (один массив, другой нет) или массивы не равны по составу
    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      return obj2
    }
    return undefined
  }

  const result: any = {}
  
  // 5. Собираем уникальный набор ключей без дубликатов с помощью Set
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])

  allKeys.forEach((key) => {
    const val1 = obj1[key]
    const val2 = obj2[key]

    // Если ключа вообще нет в новом объекте obj2, значит его удалили
    if (!(key in obj2)) {
      result[key] = undefined 
      return
    }

    // Если оба значения являются объектами, уходим в рекурсию
    if (val1 !== null && typeof val1 === 'object' && val2 !== null && typeof val2 === 'object') {
      const deepDiff = getJSONDiffs(val1, val2)
      if (deepDiff !== undefined) {
        result[key] = deepDiff
      }
    } 
    // Если значения примитивные и они не равны
    else if (!Object.is(val1, val2)) {
      result[key] = val2
    }
  })

  // Возвращаем объект с разницей только если в нем есть ключи
  return Object.keys(result).length > 0 ? result : undefined
}
