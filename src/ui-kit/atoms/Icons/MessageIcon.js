import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '44px': { width: '44', height: '44' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & rect {
    stroke: ${(p) => themeColor(p.fillColorName)};
  }
  & path {
    &.path-first {
      stroke: ${(p) => themeColor(p.colorName)};
    }

    &.path-second {
      fill: ${(p) => themeColor(p.colorName)};
    }

    &.path-thirt {
      fill: ${(p) => themeColor(p.colorName)};
    }
  }
`

export const MessageIcon = ({ sizeVariation = '44px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 44 44"
    fill="none"
    fillColorName={colorName}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="0.5" y="0.5" width="43" height="43" rx="5.5" fill="white" />
    <path
      className="path-first"
      d="M16.1123 27.6707H15.9169L15.7733 27.8032L10.8355 32.3572C10.8353 32.3574 10.835 32.3576 10.8348 32.3578C10.7321 32.4514 10.6009 32.5 10.4761 32.5C10.4036 32.5 10.3259 32.4842 10.2497 32.4519C10.061 32.364 9.92847 32.162 9.92847 31.9268V12.0732C9.92847 11.746 10.1837 11.5 10.4761 11.5H33.5237C33.8125 11.5 34.0713 11.7476 34.0713 12.0732V27.0976C34.0713 27.4268 33.8141 27.6707 33.5237 27.6707H16.1123Z"
    />
    <path
      className="path-second"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.0021 18.3331H16.4835C16.0578 18.3331 15.7142 18.0601 15.7142 17.722C15.7142 17.3838 16.0578 17.1108 16.4835 17.1108H25.0021C25.4226 17.1108 25.7714 17.3838 25.7714 17.722C25.7714 18.0601 25.4226 18.3331 25.0021 18.3331Z"
    />
    <path
      className="path-thirt"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.5194 22.0001H16.4805C16.0565 22.0001 15.7142 21.7271 15.7142 21.3889C15.7142 21.0508 16.0565 20.7778 16.4805 20.7778H27.5194C27.9383 20.7778 28.2857 21.0508 28.2857 21.3889C28.2857 21.7271 27.9383 22.0001 27.5194 22.0001Z"
    />
  </StyledSVG>
)

MessageIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(['44px']),
  colorName: PropTypes.string,
}

MessageIcon.defaultProps = {
  sizeVariation: '44px',
  colorName: 'Primary Dark Blue',
}
