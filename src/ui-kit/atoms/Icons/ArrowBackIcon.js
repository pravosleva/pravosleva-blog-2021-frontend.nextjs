import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '24px': { width: '12', height: '18' },
  '32px': { width: '12', height: '18' }, // TODO
  '14px mobile': { width: '12', height: '18' }, // TODO
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    stroke: ${(p) => themeColor(p.colorName)};
  }
`

export const ArrowBackIcon = ({ sizeVariation = '24px', colorName = 'Light blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    colorName={colorName}
    viewBox="0 0 12 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 1L1.5 9.06435L10.5 17"
      stroke="#A4B0BD"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledSVG>
)
