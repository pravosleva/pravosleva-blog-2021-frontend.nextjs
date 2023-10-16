import { useCallback, useState, useRef } from 'react'
import styled, { css } from 'styled-components'
import { Btn } from '~/ui-kit.special/Btn'
import useOnClickOutside from 'use-onclickoutside'
import { fadeIn } from '~/ui-kit.special/utils/styled-animations'

const Wrapper = styled('div')`
  position: relative;
`
const Modal = styled('div')<{
  isOpened?: boolean;
}>`
  position: absolute;
  top: 50px;
  right: 0;
  @media(max-width: 767px) {
    right: 50%;
    transform: translateX(50%);
  }
  z-index: 4;

  width: 320px;
  padding: 10px;
  border-radius: 6px;
  background-color: #FFF;
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

  & > input {
    color: #1b7bff;
    border: 1px solid #fff;
    border-radius: 6px;
    padding: 10px 5px;
    width: 100%;
    box-sizing: border-box;
    box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;
  }
  & > button {
    margin-left: 10px;
    background-color: rgba(106, 197, 232, 0.4);
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

  return (
    <Wrapper>
      <Btn onClick={handleClick} style={{ minWidth: '86px' }}>
        {!value ? (
          <i className="fa fa-search" />
        ) : (
          <>
            <i className="fa fa-search" />
            {' '}
            <i className="fas fa-exclamation-triangle" />
          </>
        )}
      </Btn>
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
              <Btn onClick={handleClear}>
                <i className="fas fa-times" />
              </Btn>
            )}
          </>
        </InternalFlex>
      </Modal>
    </Wrapper>
  )
}
