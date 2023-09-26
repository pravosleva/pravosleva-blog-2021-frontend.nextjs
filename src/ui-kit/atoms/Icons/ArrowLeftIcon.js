import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '12px': { width: '12', height: '12' },
  '24px': { width: '24', height: '24' },
  '32px': { width: '24', height: '24' }, // TODO
  '14px mobile': { width: '24', height: '24' }, // TODO
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    fill: ${(p) => themeColor(p.colorName)};
  }
`

export const ArrowLeftIcon = ({ colorName = 'Primary Dark Blue', sizeVariation = '24px' }) => (
  <StyledSVG
    colorName={colorName}
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M10.5745 5.52802L4.16069 11.6L22.9199 11.6L22.9199 13.2L4.16069 13.2L10.5745 19.272L9.38146 20.4L0.919922 12.4L9.38146 4.40002L10.5745 5.52802Z" />
  </StyledSVG>
)
