// Изменяем импорт Prism на PrismLight для ручного контроля языков
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'

// Стандартные базовые языки
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript'
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx'
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css'
import markup from 'react-syntax-highlighter/dist/cjs/languages/prism/markup'
// "markup" в Prism отвечает за HTML, XML, SVG и Vue-шаблоны!
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript'
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx'
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash'
import nginx from 'react-syntax-highlighter/dist/cjs/languages/prism/nginx'
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json'
import yaml from 'react-syntax-highlighter/dist/cjs/languages/prism/yaml'

// Темы оформления
import { synthwave84, materialDark, materialOceanic } from 'react-syntax-highlighter/dist/cjs/styles/prism'

// Регистрируем базовый стек
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('jsx', jsx)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('markup', markup)
SyntaxHighlighter.registerLanguage('html', markup)
SyntaxHighlighter.registerLanguage('vue', markup) // Привязываем Vue к разметке markup

// Регистрируем новые языки в рантайме Prism:
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('ts', typescript) // Алиас для .ts
SyntaxHighlighter.registerLanguage('tsx', tsx)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('sh', bash) // Алиас для .sh
SyntaxHighlighter.registerLanguage('shell', bash) // Алиас для shell-скриптов
SyntaxHighlighter.registerLanguage('nginx', nginx)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('yml', yaml) // Алиас для .yml файлов

// Системный стек моноширинных шрифтов
const codeFont = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }

// Вспомогательная функция для нормализации имен языков и алиасов
const normalizeLanguage = (lang: string): string => {
  if (!lang) return 'javascript'
  const lower = lang.toLowerCase()
  if (lower === 'vue') return 'markup'
  if (lower === 'ts') return 'typescript'
  if (lower === 'sh' || lower === 'shell' || lower === 'env') return 'bash'
  if (lower === 'yml') return 'yaml'
  return lower
}

interface ICodeRendererProps {
  language: string
  value: string
}

export const CodeRendererSynthwave84 = ({ language, value }: ICodeRendererProps) => {
  return <SyntaxHighlighter showLineNumbers={false} style={synthwave84} codeTagProps={{ style: codeFont }} language={normalizeLanguage(language)} children={value} />
}

export const CodeRendererMaterialDark = ({ language, value }: ICodeRendererProps) => {
  return <SyntaxHighlighter showLineNumbers={true} style={materialDark} codeTagProps={{ style: codeFont }} language={normalizeLanguage(language)} children={value} />
}

export const CodeRendererMaterialOceanic = ({ language, value }: ICodeRendererProps) => {
  return <SyntaxHighlighter showLineNumbers={false} style={materialOceanic} codeTagProps={{ style: codeFont }} language={normalizeLanguage(language)} children={value} />
}
