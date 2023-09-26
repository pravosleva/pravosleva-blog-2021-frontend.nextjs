import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '14px': { width: '14', height: '14' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    fill: ${(p) => themeColor(p.colorName)};
  }
`

export const AddIcon = ({ sizeVariation = '14px', colorName = 'Light blue' }) => (
  <StyledSVG width={getSVGWidth(sizeVariation)} height={getSVGHeight(sizeVariation)} colorName={colorName} fill="none">
    <path d="M7.77778 6.22222V0H6.22222V6.22222H0V7.77778H6.22222V14H7.77778V7.77778H14V6.22222H7.77778Z" />
  </StyledSVG>
)
