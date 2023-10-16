// -- COLORS

function hex(c: number) {
  const s = '0123456789abcdef'
  // @ts-ignore
  let i = parseInt(c)
  if (i === 0 || isNaN(c)) return '00'
  i = Math.round(Math.min(Math.max(0, i), 255))
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16)
}
/* Convert an RGB triplet to a hex string */
function convertToHex(rgb: number[]): string {
  return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2])
}
/* Remove '#' in color hex string */
function trim(s: string) {
  return s.charAt(0) === '#' ? s.substring(1, 7) : s
}
/* Convert a hex string to an RGB triplet */
function convertToRGB(hex: string): number[] {
  const color = []
  color[0] = parseInt(trim(hex).substring(0, 2), 16)
  color[1] = parseInt(trim(hex).substring(2, 4), 16)
  color[2] = parseInt(trim(hex).substring(4, 6), 16)
  return color
}
export const generateColor = (colorStart: string, colorEnd: string, colorCount: number) => {
  // The beginning of your gradient
  const start = convertToRGB(colorStart)
  // The end of your gradient
  const end = convertToRGB(colorEnd)
  // The number of colors to compute
  const len = colorCount
  // Alpha blending amount
  let alpha = 0.0
  const saida = []

  for (let i = 0; i < len; i++) {
    const c = []
    alpha += 1.0 / len

    c[0] = start[0] * alpha + (1 - alpha) * end[0]
    c[1] = start[1] * alpha + (1 - alpha) * end[1]
    c[2] = start[2] * alpha + (1 - alpha) * end[2]

    saida.push(convertToHex(c))
  }

  return saida
}
// Exemplo de como usar
/*
var tmp = generateColor('#000000','#ff0ff0',10);
for (cor in tmp) {
  $('#result_show').append("<div style='padding:8px;color:#FFF;background-color:#"+tmp[cor]+"'>COLOR "+cor+"° - #"+tmp[cor]+"</div>")
}
*/
// --
