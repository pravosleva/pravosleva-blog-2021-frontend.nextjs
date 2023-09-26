import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit'

const sizeVariations = {
  '24px': { width: '16', height: '16' },
  '20px': { width: '20', height: '20' },
  '32px': { width: '14', height: '14' },
  '14px mobile': { width: '10', height: '10' },
  '16px': { width: '16', height: '16' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    fill: ${(p) => themeColor(p.fillColorName)};
  }
  & circle {
    stroke: ${(p) => themeColor(p.fillColorName)};
  }
`

export const InformIcon = ({ sizeVariation = '32px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 16 16"
    fill="none"
    fillColorName={colorName}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.00124 12.0242C7.64221 12.0242 7.35083 11.7326 7.35083 11.3688V7.23306C7.35083 6.8693 7.64221 6.57764 8.00124 6.57764C8.36026 6.57764 8.65164 6.8693 8.65164 7.23306V11.3688C8.65164 11.7326 8.36026 12.0242 8.00124 12.0242Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.18701 4.78908C7.18701 4.3403 7.55091 3.97607 8.00002 3.97607C8.44913 3.97607 8.81303 4.3403 8.81303 4.78908C8.81303 5.23786 8.44913 5.60209 8.00002 5.60209C7.55091 5.60209 7.18701 5.23786 7.18701 4.78908Z"
    />
    <circle cx="8" cy="8" r="7.5" />
  </StyledSVG>
)

InformIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(Object.keys(sizeVariations)),
  colorName: PropTypes.string,
}

InformIcon.defaultProps = {
  sizeVariation: '32px',
  colorName: 'Primary Dark Blue',
}
