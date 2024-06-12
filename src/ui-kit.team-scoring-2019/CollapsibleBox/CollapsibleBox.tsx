import { useState, useCallback } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import classes from './CollapsibleBox.module.scss'

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
          gap: '8px',
          cursor: 'pointer',
          color: '#0162c8', // 'rgb(0, 191, 255)',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        onClick={handleToggle}
        title={label}
      >
        {/* <i className={isOpened ? "fa fa-chevron-up" : "fa fa-chevron-down"} /> */}
        {
          isOpened ? (
            <KeyboardArrowUpIcon fontSize='small' />
          ) : (
            <KeyboardArrowDownIcon fontSize='small' />
          )
        }
        <h4
          // style={{ marginBottom: isOpened ? '1rem' : '1.45rem' }}
          style={{ margin: '0px' }}
          className='truncate'
        >
          {label}
        </h4>
      </div>
      {
        isOpened && (
          <div style={{ marginTop: '1rem' }} className={classes.descriptionWrapper}>
            {typeof descritpion === 'string' ? descritpion : descritpion}
          </div>
        )
      }
    </div>
  )
}
