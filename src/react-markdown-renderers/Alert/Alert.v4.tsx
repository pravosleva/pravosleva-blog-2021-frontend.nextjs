import React from 'react'
import clsx from 'clsx'
import { EType, useStyles } from './styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/react-markdown-renderers'

interface IProps {
  type?: EType
  text?: string // Сделали опциональным
  header?: string
  rawChildren?: React.ReactNode // НОВОЕ: Для приема готовых нод из нового синтаксиса цитат
}

interface IProps {
  type?: EType
  text?: string
  header?: string
  rawChildren?: React.ReactNode // Для приема готовых нод из синтаксиса цитат
}

export const Alert = ({ type, text, header, rawChildren }: IProps) => {
  const classes = useStyles()

  // Обратная совместимость для старых статей с value=""
  const cleanText = React.useMemo(() => {
    if (!text) return ''
    let rawString = Array.isArray(text) ? text.join('') : String(text)
    if (rawString.includes('&nbsp;')) {
      rawString = rawString.replace(/&nbsp;/g, '\n\n')
    }
    return rawString
  }, [text])

  return (
    // @ts-ignore
    <div className={clsx(classes.likeBlockuote, classes[`likeBlockuote_${type || 'default'}`], 'article-alert')}>
      {!!header && (
        <ReactMarkdown
          // @ts-ignore
          plugins={[gfm, { singleTilde: false }]}
          renderers={theNotePageRenderers}
          components={theNotePageRenderers}
          children={`## ${header}`}
        />
      )}

      {rawChildren ? (
        <div 
          className="alert-content-nodes"
          style={{ 
            whiteSpace: 'normal', 
            width: '100%'
          }}
        >
          {/* Инжектируем стили для перебивания JSS специфичности */}
          <style>{`
            .article-alert pre, 
            .article-alert code, 
            .article-alert span {
              white-space: pre !important;
              word-break: normal !important;
              word-wrap: normal !important;
            }
            .article-alert pre {
              overflow-x: auto !important;
              display: block !important;
              width: 100% !important;
              background-color: rgba(0, 0, 0, 0.6) !important;
              border-radius: 6px;
              padding: 16px !important;
              transform: none !important;
            }
            .article-alert p {
              white-space: normal !important;
              margin: 0 0 1em 0 !important;
            }
            .article-alert p:last-child,
            .article-alert pre:last-child {
              margin-bottom: 0 !important;
            }
          `}</style>
          {rawChildren}
        </div>
      ) : (
        // Старый рендер для совместимости с value=""
        <ReactMarkdown
          // @ts-ignore
          plugins={[gfm, { singleTilde: false }]}
          renderers={theNotePageRenderers}
          components={theNotePageRenderers}
          children={cleanText}
        />
      )}
    </div>
  )
}