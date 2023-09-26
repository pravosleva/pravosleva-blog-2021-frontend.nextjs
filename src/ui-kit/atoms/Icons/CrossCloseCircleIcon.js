import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit'

const sizeVariations = {
  '14px mobile': '16',
  '32px': '32',
}

const getDimensions = (sizeVariation) => sizeVariations[sizeVariation]

const StyledSVG = styled('svg')`
  & path {
    &.path-first {
      fill: ${(p) => themeColor(p.colorName)};
    }

    &.path-second {
      stroke: ${(p) => themeColor(p.colorName)};
    }
  }
  & circle {
    stroke: ${(p) => themeColor(p.colorName)};
  }
`

export const CrossCloseCircleIcon = ({ colorName = 'Primary Dark Blue', sizeVariation = '14px' }) => (
  <StyledSVG
    colorName={colorName}
    width={getDimensions(sizeVariation)}
    height={getDimensions(sizeVariation)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="8" cy="8" r="8" fill="white" />
    <path
      className="path-first"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.3535 7.99969L10.9268 5.42692C11.0244 5.32816 11.0244 5.17064 10.9268 5.07313C10.8293 4.97562 10.6708 4.97562 10.5733 5.07313L8 7.6459L5.42672 5.07313C5.32922 4.97562 5.17072 4.97562 5.07322 5.07313C4.97559 5.17064 4.97559 5.32816 5.07322 5.42692L7.6465 7.99969L5.07322 10.5737C4.97559 10.6712 4.97559 10.8287 5.07322 10.9275C5.12197 10.9762 5.18597 11 5.24997 11C5.31397 11 5.37797 10.9762 5.42672 10.9275L8 8.35347L10.5733 10.9275C10.622 10.9762 10.686 11 10.75 11C10.814 11 10.878 10.9762 10.9268 10.9275C11.0244 10.8287 11.0244 10.6712 10.9268 10.5737L8.3535 7.99969Z"
    />
    <path
      className="path-second"
      d="M8.3535 7.99969L10.9268 5.42692C11.0244 5.32816 11.0244 5.17064 10.9268 5.07313C10.8293 4.97562 10.6708 4.97562 10.5733 5.07313L8 7.6459L5.42672 5.07313C5.32922 4.97562 5.17072 4.97562 5.07322 5.07313C4.97559 5.17064 4.97559 5.32816 5.07322 5.42692L7.6465 7.99969L5.07322 10.5737C4.97559 10.6712 4.97559 10.8287 5.07322 10.9275C5.12197 10.9762 5.18597 11 5.24997 11C5.31397 11 5.37797 10.9762 5.42672 10.9275L8 8.35347L10.5733 10.9275C10.622 10.9762 10.686 11 10.75 11C10.814 11 10.878 10.9762 10.9268 10.9275C11.0244 10.8287 11.0244 10.6712 10.9268 10.5737L8.3535 7.99969"
      strokeWidth="0.6"
    />
  </StyledSVG>
)

CrossCloseCircleIcon.propTypes = {
  colorName: PropTypes.string,
  sizeVariation: PropTypes.oneOf(Object.keys(sizeVariations)),
}
