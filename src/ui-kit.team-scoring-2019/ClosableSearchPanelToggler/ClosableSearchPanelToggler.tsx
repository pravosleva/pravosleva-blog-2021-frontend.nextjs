import { useCallback, useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
// import { Btn } from '~/ui-kit.team-scoring-2019/Btn'
import useOnClickOutside from 'use-onclickoutside'
import { fadeIn } from '~/ui-kit.team-scoring-2019/utils/styled-animations'
import { CircleBtn } from '~/components/time-scoring/TimeManagementContent/components'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

const Wrapper = styled('div')`
  position: relative;
  height: 100%;
`
const Modal = styled('div').attrs({
  className: 'backdrop-blur--lite',
})<{
  isOpened?: boolean;
}>`
  position: absolute;
  // top: 50px;
  // right: 0;
  // @media(max-width: 767px) {
  //   right: 50%;
  //   transform: translateX(50%);
  // }
  // left: 0;
  // transform: translateX(0%);
  z-index: 4;

  top: 0;
  left: 0;
  transform: translateX(30px) translateY(0px);

  width: 320px;
  @media (max-width: 600px) {
    width: 250px;
  }
  padding: 8px;
  border-radius: 16px;
  // background-color: #FFF;
  color: #1b7bff;
  box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;

  display: flex;
  flex-direction: column;

  ${({ isOpened }) => !isOpened &&
    css`
      display: none;
    `}
  animation: ${fadeIn} 0.3s ease-in-out;
`
const InternalFlex = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  & > input {
    color: #1b7bff;
    font-weight: bold;
    border: 1px solid #fff;
    border-radius: 8px;
    padding: 4px 8px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;
  }
  /* & > button {
    background-color: rgba(106, 197, 232, 0.4);
  } */
  & > button {
    width: 34px;
    height: 34px;
    box-sizing: content-box;
  }
`

export const ClosableSearchPanelToggler = ({ onChange }: { onChange: (_e: any) => void; }) => {
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [value, setValue] = useState('')
  const inputRef = useRef<any>(null)
  const modalRef = useRef(null)
  const handleClose = () => {
    setIsModalOpened(false)
  }
  useOnClickOutside(modalRef, handleClose)
  const handleFocus = () => {
    setTimeout(() => inputRef.current.focus(), 0)
  }
  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value)
      onChange(e.target.value)
    },
    [setValue, onChange],
  )
  const handleClick = useCallback(() => {
    if (isModalOpened) {
      setIsModalOpened(false)
    } else {
      setIsModalOpened(true)
      handleFocus()
    }
  }, [isModalOpened, setIsModalOpened, handleFocus])
  const handleClear = useCallback(() => {
    handleChange({ target: { value: '' } })
    handleFocus()
  }, [handleChange, setIsModalOpened])

  useEffect(() => {
    return () => {
      handleChange({ target: { value: '' } })
    }
  }, [])

  return (
    <Wrapper>
      {/* <Btn
        onClick={handleClick}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
        }}
        rounded
      >
        {!value ? (
          <i className="fa fa-search" />
        ) : (
          <>
            <i className="fa fa-search" />
            <i className="fas fa-exclamation-triangle" />
          </>
        )}
      </Btn> */}
      {/* <CircleBtn onClick={handleClick} >
        <i className="fa fa-search" style={{ fontSize: '12px', color: 'white' }} />
      </CircleBtn> */}
      <span style={{ cursor: 'pointer' }} onClick={handleClick}>
        {/* <i className="fa fa-search" style={{ color: !!value ? '#ff9671' : 'white' }} /> */}
        <SearchIcon fontSize='small' htmlColor={!!value ? '#ff9671' : '#fff' } />
      </span>
      <Modal ref={modalRef} isOpened={isModalOpened}>
        <InternalFlex>
          <>
            <input
              ref={inputRef}
              value={value}
              type="text"
              onChange={handleChange}
            />
            {!!value && (
              // <Btn onClick={handleClear}>
              //   <i className="fas fa-times" />
              // </Btn>
              <CircleBtn onClick={handleClear} >
                {/* <i className="fa fa-times" style={{ fontSize: '12px', color: 'white' }} /> */}
                <CloseIcon fontSize='small' />
              </CircleBtn>
            )}
          </>
        </InternalFlex>
      </Modal>
    </Wrapper>
  )
}
