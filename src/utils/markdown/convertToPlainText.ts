import marked from 'marked'
// @ts-ignore
import PlainTextRenderer from 'marked-plaintext'

// const plaintextOptions = {
//   sanitize: false,
// }

export const convertToPlainText = (markdownText: string): string => {
  const renderer = new PlainTextRenderer()

  // renderer.checkbox = (text: string) => {
  //   return text
  // }

  // marked.setOptions(plaintextOptions)
  
  return marked.parse(markdownText, { renderer })
}
