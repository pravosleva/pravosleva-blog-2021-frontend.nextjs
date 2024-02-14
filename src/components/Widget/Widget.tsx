import clsx from 'clsx'
import classes from './Widget.module.scss'
// import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { useState, useCallback } from 'react'
import { useWindowSize } from '~/hooks/useWindowSize'
import { Fab } from '~/ui-kit.team-scoring-2019'
import styled, { css } from 'styled-components'
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const MobileToggler = styled(Fab)<{
  opened?: boolean;
}>`
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 100;

  // color: #000;
  color: #0162c8;
  border-color: #0162c8;
  border-color: #fff;
  // background-color: #0162c8;
  // color: #fff;

  ${(p) => p.opened &&
    css`
      // background-color: #6efacc;
      background-color: #0162c8;
      color: #fff;
    `}

  display: flex;
  justify-content: center;
  align-items: center;
`

export const Widget = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const handleToggle = useCallback(() => {
    setIsOpened(s => !s)
  }, [setIsOpened])
  const { upSm } = useWindowSize()

  return (
    <>
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
        {
          upSm && (
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
                  // <i
                  //   style={{ fontSize: "20px", color: 'inherit' }}
                  //   // className="fa fa-angle-double-left"
                  //   className='fas fa-chevron-left'
                  // />
                  <KeyboardArrowLeftIcon fontSize='large' />
                ) : (
                  // <i
                  //   style={{ fontSize: "20px", color: 'inherit' }}
                  //   // className="fa fa-angle-double-left"
                  //   className='fas fa-chevron-right'
                  // />
                  <KeyboardArrowRightIcon fontSize='large' />
                )
              }
            </button>
          )
        }
      </div>
      {
        !upSm && (
          <MobileToggler
            onClick={handleToggle}
            opened={isOpened}
          >
            {
              isOpened ? (
                // <i
                //   style={{ fontSize: "20px", color: 'inherit' }}
                //   // className="fa fa-angle-double-left"
                //   className='fas fa-chevron-left'
                // />
                <KeyboardArrowLeftIcon fontSize='large' />
              ) : (
                // <i
                //   style={{ fontSize: "20px", color: 'inherit' }}
                //   // className="fa fa-angle-double-left"
                //   className='fas fa-chevron-right'
                // />
                <KeyboardArrowRightIcon fontSize='large' />
              )
            }
          </MobileToggler>
        )
      }
    </>
  )
}
