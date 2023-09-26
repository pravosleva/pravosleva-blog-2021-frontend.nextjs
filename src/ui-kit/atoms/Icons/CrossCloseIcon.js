import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit'

const sizeVariations = {
  '24px': { width: '10', height: '10' },
  '32px': { width: '14', height: '14' },
  '14px mobile': { width: '10', height: '10' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    &.path-first {
      fill: ${(p) => themeColor(p.fillColorName)};
    }

    &.path-second {
      stroke: ${(p) => themeColor(p.fillColorName)};
    }
  }
`

export const CrossCloseIcon = ({ sizeVariation = '32px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 14 14"
    fill="none"
    fillColorName={colorName}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      className="path-first"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.78554 6.99947L13.5039 1.28221C13.7209 1.06274 13.7209 0.712702 13.5039 0.496013C13.2873 0.279324 12.935 0.279324 12.7184 0.496013L6.99998 6.21328L1.28159 0.496013C1.06492 0.279324 0.712692 0.279324 0.496023 0.496013C0.279076 0.712702 0.279076 1.06274 0.496023 1.28221L6.21442 6.99947L0.496023 12.7195C0.279076 12.9362 0.279076 13.2862 0.496023 13.5057C0.604357 13.614 0.746581 13.6668 0.888805 13.6668C1.03103 13.6668 1.17325 13.614 1.28159 13.5057L6.99998 7.78566L12.7184 13.5057C12.8267 13.614 12.9689 13.6668 13.1112 13.6668C13.2534 13.6668 13.3956 13.614 13.5039 13.5057C13.7209 13.2862 13.7209 12.9362 13.5039 12.7195L7.78554 6.99947Z"
    />
    <path
      className="path-second"
      d="M7.78554 6.99947L13.5039 1.28221C13.7209 1.06274 13.7209 0.712702 13.5039 0.496013C13.2873 0.279324 12.935 0.279324 12.7184 0.496013L6.99998 6.21328L1.28159 0.496013C1.06492 0.279324 0.712692 0.279324 0.496023 0.496013C0.279076 0.712702 0.279076 1.06274 0.496023 1.28221L6.21442 6.99947L0.496023 12.7195C0.279076 12.9362 0.279076 13.2862 0.496023 13.5057C0.604357 13.614 0.746581 13.6668 0.888805 13.6668C1.03103 13.6668 1.17325 13.614 1.28159 13.5057L6.99998 7.78566L12.7184 13.5057C12.8267 13.614 12.9689 13.6668 13.1112 13.6668C13.2534 13.6668 13.3956 13.614 13.5039 13.5057C13.7209 13.2862 13.7209 12.9362 13.5039 12.7195L7.78554 6.99947"
      strokeWidth="0.25"
    />
  </StyledSVG>
)

CrossCloseIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(['24px', '32px', '14px mobile']),
  colorName: PropTypes.string,
}

CrossCloseIcon.defaultProps = {
  sizeVariation: '32px',
  colorName: 'Primary Dark Blue',
}
