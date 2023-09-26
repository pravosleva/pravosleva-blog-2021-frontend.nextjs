import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '24px': { width: '18', height: '12' },
  '32px': { width: '18', height: '12' }, // TODO
  '14px mobile': { width: '18', height: '12' }, // TODO
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    stroke: ${(p) => themeColor(p.colorName)};
  }
`

export const ArrowDownIcon = ({ sizeVariation = '24px', colorName = 'Light blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    colorName={colorName}
    viewBox="0 0 18 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1 1.5L9.06435 10.5L17 1.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </StyledSVG>
)
