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

  const cleanText = React.useMemo(() => {
    if (!text) return ''
    
    // Склеиваем массивы, если они пришли из children
    let rawString = Array.isArray(text) ? text.join('') : String(text)

    // Обратная совместимость для старых value со старыми хаками &nbsp;
    if (rawString.includes('&nbsp;')) {
      rawString = rawString.replace(/&nbsp;/g, '\n\n')
    }

    // Если текст пришел из бэктиков {\` text \`}, убираем лишние начальные/конечные пустые строки
    return rawString.trim()
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
        children={cleanText} 
      />
    </div>
  )
}
