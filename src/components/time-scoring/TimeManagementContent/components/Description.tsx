import React, { memo } from 'react'
// import Prism from 'prismjs'
// import ReactMarkdown from 'react-markdown'

// console.log(Prism)

const areEqual = (prevProps: any, nextProps: any) => {
  return prevProps.source === nextProps.source
}

type TProps = {
  source: string;
}

export const Description = memo(({ source }: TProps) => {
  // useEffect(() => {
  //   if (!!window) {
  //     setTimeout(() => Prism.highlightAll(), 1000)
  //   }
  // }, [source])

  // <ReactMarkdown source={source} />
  return (
    <div
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        fontSize: '13px',
        // marginBottom: '10px',
        // border: '1px solid red',
      }}
    >
      {source}
    </div>
  )
}, areEqual)
