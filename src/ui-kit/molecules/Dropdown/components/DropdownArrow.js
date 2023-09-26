import React from 'react'
import { DropdownArrowUpIcon } from '@/ui-kit/atoms/Icons/DropdownArrowUpIcon'
import { DropdownArrowDownIcon } from '@/ui-kit/atoms/Icons/DropdownArrowDownIcon'
import { ArrowContainer } from './index'

const getColorName = (isHovered, isFilled) => {
  if (isHovered) {
    return 'Gray-blue'
  }
  if (isFilled) {
    return 'Light blue'
  }
  return 'Light Gray Stroke'
}

export const DropdownArrow = ({ isDropdownVisible, isInputHovered, isInputFilled, height }) => (
  <ArrowContainer height={height}>
    {!!isDropdownVisible && <DropdownArrowUpIcon colorName={getColorName(isInputHovered, isInputFilled)} />}
    {!isDropdownVisible && <DropdownArrowDownIcon colorName={getColorName(isInputHovered, isInputFilled)} />}
  </ArrowContainer>
)
