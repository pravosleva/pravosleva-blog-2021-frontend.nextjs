import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { synthwave84, materialDark, materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism'

// Системный стек моноширинных шрифтов
const codeFont = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }

export const CodeRendererSynthwave84 = ({ language, value }: { language: string; value: string }) => {
  return <SyntaxHighlighter showLineNumbers={false} style={synthwave84} codeTagProps={{ style: codeFont }} language={language} children={value} />
}

export const CodeRendererMaterialDark = ({ language, value }: any) => {
  return <SyntaxHighlighter showLineNumbers={true} style={materialDark} codeTagProps={{ style: codeFont }} language={language} children={value} />
}

export const CodeRendererMaterialOceanic = ({ language, value }: any) => {
  return (
    <>
      {/* <span>{language}</span> */}
      <SyntaxHighlighter showLineNumbers={false} style={materialOceanic} codeTagProps={{ style: codeFont }} language={language} children={value} />
    </>
  )
}
