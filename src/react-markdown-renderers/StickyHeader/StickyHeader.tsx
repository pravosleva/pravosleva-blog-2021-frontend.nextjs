import { memo } from 'react'

type TProps = {
  text: string;
}

export const StickyHeader = memo(({ text }: TProps) => {
  return (
    <div
      style={{
        display: 'block',
        border: '1px solid red',
        position: 'sticky',
        top: '64px',
        zIndex: 1,
        padding: '8px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '2.25rem',
        width: 'fit-content',
      }}
      className='backdrop-blur--lite big-text'
    >
      {text}
    </div>
  )
})
