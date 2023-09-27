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

// const Icon = ({ children, type }: { children: React.FC; type: EType }) => {
//   return <div>{children}</div>
// }

export const Alert = ({ type, text, header }: IProps) => {
  const classes = useStyles()

  return (
    // @ts-ignore
    <div className={clsx(classes.likeBlockuote, classes[`likeBlockuote_${type || 'default'}`])}>
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
        children={text}
      />
    </div>
  )
}
