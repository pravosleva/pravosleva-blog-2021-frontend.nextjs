import styled, { css, keyframes } from 'styled-components'
import { Input } from '@/ui-kit/atoms'
import { themeTextStyle, themeColor, themeShadow } from '@/ui-kit'

export const Wrapper = styled('div')`
  display: flex;
  flex-direction: column;
  position: relative;
  @media (max-width: 425px) {
    height: auto;
    flex-direction: column;
    justify-content: center;
    // align-items: center;
  }
  width: 100%;
`

const heights = {
  default: '52px',
  normal: '52px',
  small: '38px',
}

const getHeight = (height = 'default') => heights[height]

export const DropDownSelect = styled('div')`
  margin: 0 auto;
  // max-width: 820px;
  display: flex;
  align-items: stretch;
  height: ${(p) => getHeight(p.height)};
  box-sizing: border-box;
  width: 100%;
`

export const InputWrapper = styled('div')`
  position: relative;
  display: flex;
  width: 100%;
`

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const OptionsBox = styled('div')`
  box-sizing: border-box;
  position: absolute;
  max-height: 282px;
  overflow-y: auto;
  width: 100%;
  z-index: 9999999999;
  top: 50px;
  ${(p) =>
    p.height === 'small' &&
    css`
      top: 37px;
    `}
  left: 0px;
  right: 0px;
  background-color: ${themeColor('White color')};
  border-radius: 0 0 6px 6px;
  display: none;
  box-shadow: ${themeShadow('Dropdown shadow')};
  float: left;
  &::-webkit-scrollbar {
  width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #ddd;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(p) => themeColor(p.rgs ? 'rgs' : 'Accent Blue light')};
  }
  & ul {
    /* min-width: 250px; */
    overflow-y: auto;
    padding: 6px 0 6px 0;
    margin: 0;
  }

  ${(p) =>
    p.show &&
    css`
      display: block;
    `}

  ${(p) =>
    p.hasBorder &&
    css`
      border: 1px solid ${themeColor('Light Gray Stroke')};
    `}
  border-top: 1px solid ${themeColor('Light Gray Stroke')};
  ${(p) =>
    p.isInputFocused &&
    css`
      border-top: 1px solid ${themeColor(p.rgs ? 'rgs' : 'Select Blue')};
    `}
   ${(p) =>
     p.isInputIncorrect &&
     css`
       border-top: 1px solid ${themeColor('Incorrect')};
     `}
  ${(p) => (p.hasTopBorder ? 'border-top: none;' : '')}
  animation: ${fadeIn} 0.2s linear;
`

export const LineBox = styled('div')`
  position: absolute;
  top: 50px;
  height: 1px;
  background: ${themeColor('Light Gray Stroke')};
  left: 20px;
  right: 20px;
  z-index: 3001;
  @media (max-width: 425px) {
    top: 48px;
  }
`

export const LiItem = styled('li')`
  height: auto !important;
  margin: 0;
  overflow: hidden;
  padding: 9px 20px;
  position: relative;
  text-align: left;
  white-space: normal;
  word-break: break-all;
  ${themeTextStyle('14R Small-body')};
  color: ${themeColor('Dark Black')};
  &.over {
    background-color: ${(p) => themeColor(p.rgs ? 'rgs' : 'Select Blue')} !important;
    color: ${themeColor('White color')} !important;
    cursor: pointer;
  }
  &:active {
    background-color: ${(p) => themeColor(p.rgs ? 'rgs' : 'Primary Dark Blue')} !important;
    color: ${themeColor('White color')} !important;
    cursor: pointer;
  }
`

export const ArrowContainer = styled('div')`
  position: absolute;
  right: 16px;
  top: 14px;
  &&:hover {
    border: 1px solid red;
  }
  ${(p) =>
    p.height === 'small' &&
    css`
      top: 7px;
    `}
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 425px) {
    top: 12px;
  }
`

export const DropdownInput = styled(Input)`
  ${(p) =>
    p.show &&
    css`
      border-radius: ${p.attached && p.attached === 'right' ? '0' : '6px'}
        ${p.attached && p.attached === 'left' ? '0' : '6px'} 0 0;
    `}
`
