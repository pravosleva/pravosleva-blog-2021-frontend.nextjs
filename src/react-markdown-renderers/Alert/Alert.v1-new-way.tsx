import React from 'react'
import clsx from 'clsx'
import { EType, useStyles } from './styles'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { theNotePageRenderers } from '~/react-markdown-renderers'

interface IProps {
  type?: EType
  text: string
  header?: string
}

export const Alert = ({ type, text, header }: IProps) => {
  const classes = useStyles()

  // ИСПРАВЛЕНО: Безопасно склеиваем текст в единую строку, 
  // если парсер разбил его на массив из-за переносов строк
  const cleanText = React.useMemo(() => {
    if (!text) return ''
    if (Array.isArray(text)) {
      return text.join('')
    }
    return String(text)
  }, [text])

  return (
    // @ts-ignore
    <div className={clsx(classes.likeBlockuote, classes[`likeBlockuote_${type || 'default'}`], 'article-alert')}>
      {!!header && (
        <ReactMarkdown
          // @ts-ignore
          plugins={[gfm, { singleTilde: false }]}
          renderers={theNotePageRenderers}
          children={`## ${header}`}
        />
      )}
      <ReactMarkdown
        // @ts-ignore
        plugins={[gfm, { singleTilde: false }]}
        renderers={theNotePageRenderers}
        // Передаем очищенный нормализованный текст
        children={cleanText} 
      />
    </div>
  )
}
