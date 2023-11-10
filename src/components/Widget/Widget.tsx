import clsx from 'clsx'
import classes from './Widget.module.scss'
// import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { useState, useCallback } from 'react'

export const Widget = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const handleToggle = useCallback(() => {
    setIsOpened(s => !s)
  }, [setIsOpened])

  return (
    <div
      className={clsx(
        'backdrop-blur--lite',
        classes.wrapper,
        classes.row,
        {
          [classes.isOpened]: isOpened,
        },
      )}
    >
      <div
        className={classes.internalSpace}
        style={{
          // borderTop: '1px solid lightgray',
          // borderBottom: '1px solid lightgray',
        }}
      >
        {children}
      </div>
      <button
        className={clsx(
          classes.toggler,
          // 'backdrop-blur--lite',
        )}
        style={{
          backgroundColor: 'transparent',
        }}
        onClick={handleToggle}
      >
        {
          isOpened ? (
            <i
              style={{ fontSize: "20px", color: 'inherit' }}
              // className="fa fa-angle-double-left"
              className='fas fa-chevron-left'
            />
          ) : (
            <i
              style={{ fontSize: "20px", color: 'inherit' }}
              // className="fa fa-angle-double-left"
              className='fas fa-chevron-right'
            />
          )
        }
      </button>
    </div>
  )
}
