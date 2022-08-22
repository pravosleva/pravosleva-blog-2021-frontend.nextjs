export function getPrettyPrice(price: number): string {
  let result: any = Math.round(+price * 100) / 100
  var parts = price.toString().split('.')
  result = parts[0]

  let tmp = ''
  let len = result.length

  for (var i = 0; i < len; ++i) {
    if (i > 0 && i % 3 === 0) {
      tmp += ' '
    }

    tmp += result[len - 1 - i]
  }

  len = tmp.length
  let out = ''

  for (i = 0; i < len; ++i) {
    out += tmp[len - 1 - i]
  }

  parts[0] = out

  if (parts.length > 1 && parts[1].length == 1) {
    parts[1] += '0'
  }

  return parts.join('.')
}
