import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '24px': { width: '14 ', height: '18' },
  '32px': { width: '22', height: '22' }, // todo
  '14px mobile': { width: '10', height: '10' }, // todo
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    fill: ${(p) => themeColor(p.fillColorName)};
  }
`

export const FineIcon = ({ sizeVariation = '24px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    fillColorName={colorName}
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3.25 10.25H8.25V11.5H3.25V10.25ZM3.25 7.125H10.75V8.375H3.25V7.125ZM3.25 13.375H6.375V14.625H3.25V13.375Z" />
    <path d="M12.625 2.125H10.75V1.5C10.75 1.16848 10.6183 0.850537 10.3839 0.616116C10.1495 0.381696 9.83152 0.25 9.5 0.25H4.5C4.16848 0.25 3.85054 0.381696 3.61612 0.616116C3.3817 0.850537 3.25 1.16848 3.25 1.5V2.125H1.375C1.04348 2.125 0.725537 2.2567 0.491116 2.49112C0.256696 2.72554 0.125 3.04348 0.125 3.375V16.5C0.125 16.8315 0.256696 17.1495 0.491116 17.3839C0.725537 17.6183 1.04348 17.75 1.375 17.75H12.625C12.9565 17.75 13.2745 17.6183 13.5089 17.3839C13.7433 17.1495 13.875 16.8315 13.875 16.5V3.375C13.875 3.04348 13.7433 2.72554 13.5089 2.49112C13.2745 2.2567 12.9565 2.125 12.625 2.125ZM4.5 1.5H9.5V4H4.5V1.5ZM12.625 16.5H1.375V3.375H3.25V5.25H10.75V3.375H12.625V16.5Z" />
  </StyledSVG>
)

FineIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(Object.keys(sizeVariations)),
  colorName: PropTypes.string,
}

FineIcon.defaultProps = {
  sizeVariation: '24px',
  colorName: 'Primary Dark Blue',
}
