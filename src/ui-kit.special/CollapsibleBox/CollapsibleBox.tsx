import { useState, useCallback } from 'react'

type TProps = {
  label: string;
  descritpion: string | React.ReactNode;
}

export const CollapsibleBox = ({
  label,
  descritpion,
}: TProps) => {
  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleToggle = useCallback(() => {
    setIsOpened((state) => !state)
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '16px',
          cursor: 'pointer',
          color: 'rgb(0, 191, 255)',
        }}
        onClick={handleToggle}
      >
        <i
          className={isOpened ? "fa fa-chevron-up" : "fa fa-chevron-down"}
        />
        <h4 style={{ marginBottom: isOpened ? '1rem' : '1.45rem' }}>{label}</h4>
      </div>
      {
        isOpened && (
          <div>
            {typeof descritpion === 'string' ? descritpion : descritpion}
          </div>
        )
      }
    </div>
  )
}
