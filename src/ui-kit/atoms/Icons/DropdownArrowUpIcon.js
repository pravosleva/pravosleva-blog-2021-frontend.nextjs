import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit'

const StyledSVG = styled('svg')`
  & path {
    stroke: ${(p) => themeColor(p.colorName)};
  }
`

export const DropdownArrowUpIcon = ({ colorName = 'Light blue' }) => (
  <StyledSVG
    colorName={colorName}
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.1973 16.7012L12.1329 7.70117L4.19727 16.7012"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledSVG>
)
