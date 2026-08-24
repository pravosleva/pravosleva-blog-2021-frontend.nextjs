// src/react-markdown-renderers/CodeRenderer.tsx
import React from 'react'

// Системный стек моноширинных шрифтов
const codeFont = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }

/* =========================================================================
   ИСПРАВЛЕНО: Полностью валидный и строго типизированный объект темы Material Oceanic
   ========================================================================= */
const materialOceanicTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': { color: '#b0bec5', background: 'none', textShadow: 'none', fontFamily: codeFont.fontFamily, textAlign: 'left', whiteSpace: 'pre', wordBreak: 'normal', wordSpacing: 'normal', lineHeight: '1.5', tabSize: '4', hyphens: 'none' },
  'pre[class*="language-"]': { color: '#b0bec5', background: '#263238', textShadow: 'none', fontFamily: codeFont.fontFamily, textAlign: 'left', whiteSpace: 'pre', wordBreak: 'normal', wordSpacing: 'normal', lineHeight: '1.5', tabSize: '4', hyphens: 'none', padding: '1em', margin: '.5em 0', overflow: 'auto' },
  'comment': { color: '#546e7a', fontStyle: 'italic' },
  'prolog': { color: '#546e7a', fontStyle: 'italic' },
  'doctype': { color: '#546e7a', fontStyle: 'italic' },
  'cdata': { color: '#546e7a', fontStyle: 'italic' },
  'punctuation': { color: '#89ddff' },
  'namespace': { opacity: '.7' },
  'property': { color: '#80cbc4' },
  'tag': { color: '#ff5370' },
  'boolean': { color: '#ff9e3b' },
  'number': { color: '#f77669' },
  'constant': { color: '#80cbc4' },
  'symbol': { color: '#80cbc4' },
  'deleted': { color: '#ff5370' },
  'selector': { color: '#c3e88d' },
  'attr-name': { color: '#fad430' },
  'string': { color: '#c3e88d' },
  'char': { color: '#c3e88d' },
  'builtin': { color: '#80cbc4' },
  'inserted': { color: '#80cbc4' },
  'operator': { color: '#89ddff' },
  'entity': { color: '#80cbc4', cursor: 'help' },
  'url': { color: '#80cbc4' },
  '.language-css .token.string': { color: '#80cbc4' },
  '.style .token.string': { color: '#80cbc4' },
  'variable': { color: '#80cbc4' },
  'atrule': { color: '#c792ea' },
  'attr-value': { color: '#c3e88d' },
  'function': { color: '#82b1ff' },
  'class-name': { color: '#ffcb6b' },
  'keyword': { color: '#c792ea' },
  'regex': { color: '#89ddff' },
  'important': { color: '#c792ea', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' }
}

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

export const CodeRendererMaterialOceanic = ({ language, value }: ICodeRendererProps) => {
  const [Highlighter, setHighlighter] = React.useState<any>(null)

  React.useEffect(() => {
    Promise.all([
      // Лениво импортируем только ядро и парсеры языков из esm-ветки
      import('react-syntax-highlighter/dist/esm/prism-light'),
      import('react-syntax-highlighter/dist/esm/languages/prism/javascript'),
      import('react-syntax-highlighter/dist/esm/languages/prism/jsx'),
      import('react-syntax-highlighter/dist/esm/languages/prism/css'),
      import('react-syntax-highlighter/dist/esm/languages/prism/markup'),
      import('react-syntax-highlighter/dist/esm/languages/prism/typescript'),
      import('react-syntax-highlighter/dist/esm/languages/prism/tsx'),
      import('react-syntax-highlighter/dist/esm/languages/prism/bash'),
      import('react-syntax-highlighter/dist/esm/languages/prism/nginx'),
      import('react-syntax-highlighter/dist/esm/languages/prism/json'),
      import('react-syntax-highlighter/dist/esm/languages/prism/yaml'),
    ]).then(([
      { default: PrismLight }, 
      js, jsx, css, markup, ts, tsx, bash, nginx, json, yaml
    ]) => {
      PrismLight.registerLanguage('javascript', js.default)
      PrismLight.registerLanguage('jsx', jsx.default)
      PrismLight.registerLanguage('css', css.default)
      PrismLight.registerLanguage('markup', markup.default)
      PrismLight.registerLanguage('html', markup.default)
      PrismLight.registerLanguage('vue', markup.default)
      PrismLight.registerLanguage('typescript', ts.default)
      PrismLight.registerLanguage('ts', ts.default)
      PrismLight.registerLanguage('tsx', tsx.default)
      PrismLight.registerLanguage('bash', bash.default)
      PrismLight.registerLanguage('sh', bash.default)
      PrismLight.registerLanguage('shell', bash.default)
      PrismLight.registerLanguage('nginx', nginx.default)
      PrismLight.registerLanguage('json', json.default)
      PrismLight.registerLanguage('yaml', yaml.default)
      PrismLight.registerLanguage('yml', yaml.default)

      setHighlighter(() => PrismLight)
    }).catch(err => {
      console.error("🚨 [CodeRenderer]: Ошибка загрузки компонентов Prism:", err)
    })
  }, [])

  if (!Highlighter) {
    return (
      <pre style={{ ...codeFont, background: '#263238', color: '#fff', padding: '1em', overflow: 'auto' }}>
        <code>{value}</code>
      </pre>
    )
  }

  return (
    <Highlighter 
      showLineNumbers={false} 
      style={materialOceanicTheme} 
      codeTagProps={{ style: codeFont }} 
      language={normalizeLanguage(language)} 
      children={value} 
    />
  )
}
