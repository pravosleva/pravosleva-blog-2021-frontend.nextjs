import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '24px': { width: '14', height: '11' },
  '32px': { width: '20', height: '17' },
  '14px mobile': { width: '10', height: '10' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    stroke: ${(p) => themeColor(p.fillColorName)};
  }
`

export const OkStatusIcon = ({ sizeVariation = '32px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 20 17"
    fill="none"
    fillColorName={colorName}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.666687 8.9619L7.41846 15.6667L19.3334 1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledSVG>
)

OkStatusIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(['24px', '32px', '14px mobile']),
  colorName: PropTypes.string,
}

OkStatusIcon.defaultProps = {
  sizeVariation: '32px',
  colorName: 'Primary Dark Blue',
}
