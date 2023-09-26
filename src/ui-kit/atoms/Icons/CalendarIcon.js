import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit'

const sizeVariations = {
  '24px': { width: '21', height: '19' },
  '32px': { width: '28', height: '26' },
  '14px mobile': { width: '14', height: '13' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    fill: ${(p) => themeColor(p.fillColorName)};
  }
`

export const CalendarIcon = ({ sizeVariation = '32px', colorName = 'Primary Dark Blue' }) => (
  <StyledSVG
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 22 20"
    fill="none"
    fillColorName={colorName}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.613 18.5569H1.41269V3.25649H4.96713V4.10126C4.96713 4.6261 5.20038 5.04692 5.72238 5.04692C6.24438 5.04692 6.45211 4.6261 6.45211 4.10126V3.25649H15.5547V4.10126C15.5547 4.6261 15.7898 5.04692 16.3118 5.04692C16.8338 5.04692 17.0284 4.6261 17.0284 4.10126V3.25649H20.613V18.5569ZM20.7126 2.21907H17.0242V1.3361C17.0242 0.850462 16.7852 0.453125 16.2978 0.453125C15.8104 0.453125 15.5558 0.850462 15.5558 1.3361V2.21907H6.44088V1.3361C6.44088 0.850462 6.18952 0.453125 5.70212 0.453125C5.21472 0.453125 4.94482 0.850462 4.94482 1.3361V2.21907H1.28727C0.799868 2.21907 0.404297 2.6164 0.404297 3.10204V18.6644C0.404297 19.1544 0.799868 19.5474 1.28727 19.5474H20.7126C21.2 19.5474 21.5956 19.1544 21.5956 18.6644V3.10204C21.5956 2.6164 21.2 2.21907 20.7126 2.21907Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.35107 8.48389C7.98508 8.48389 7.68884 8.77968 7.68884 9.14611C7.68884 9.51255 7.98508 9.80834 8.35107 9.80834C8.71706 9.80834 9.0133 9.51255 9.0133 9.14611C9.0133 8.77968 8.71706 8.48389 8.35107 8.48389Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.70214 8.48389C5.33615 8.48389 5.03992 8.77968 5.03992 9.14611C5.03992 9.51255 5.33615 9.80834 5.70214 9.80834C6.06814 9.80834 6.36437 9.51255 6.36437 9.14611C6.36437 8.77968 6.06814 8.48389 5.70214 8.48389Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 11.1323C10.634 11.1323 10.3378 11.4281 10.3378 11.7946C10.3378 12.161 10.634 12.4568 11 12.4568C11.366 12.4568 11.6622 12.161 11.6622 11.7946C11.6622 11.4281 11.366 11.1323 11 11.1323Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.35107 11.1323C7.98508 11.1323 7.68884 11.4281 7.68884 11.7946C7.68884 12.161 7.98508 12.4568 8.35107 12.4568C8.71706 12.4568 9.0133 12.161 9.0133 11.7946C9.0133 11.4281 8.71706 11.1323 8.35107 11.1323Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2977 11.1323C15.9317 11.1323 15.6354 11.4281 15.6354 11.7946C15.6354 12.161 15.9317 12.4568 16.2977 12.4568C16.6637 12.4568 16.9599 12.161 16.9599 11.7946C16.9599 11.4281 16.6637 11.1323 16.2977 11.1323Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.6489 11.1323C13.2829 11.1323 12.9867 11.4281 12.9867 11.7946C12.9867 12.161 13.2829 12.4568 13.6489 12.4568C14.0149 12.4568 14.3112 12.161 14.3112 11.7946C14.3112 11.4281 14.0149 11.1323 13.6489 11.1323Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2977 13.7817C15.9317 13.7817 15.6354 14.0775 15.6354 14.444C15.6354 14.8104 15.9317 15.1062 16.2977 15.1062C16.6637 15.1062 16.9599 14.8104 16.9599 14.444C16.9599 14.0775 16.6637 13.7817 16.2977 13.7817Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.6489 13.7817C13.2829 13.7817 12.9867 14.0775 12.9867 14.444C12.9867 14.8104 13.2829 15.1062 13.6489 15.1062C14.0149 15.1062 14.3112 14.8104 14.3112 14.444C14.3112 14.0775 14.0149 13.7817 13.6489 13.7817Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.70214 11.1323C5.33615 11.1323 5.03992 11.4281 5.03992 11.7946C5.03992 12.161 5.33615 12.4568 5.70214 12.4568C6.06814 12.4568 6.36437 12.161 6.36437 11.7946C6.36437 11.4281 6.06814 11.1323 5.70214 11.1323Z"
    />
  </StyledSVG>
)

CalendarIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(['24px', '32px', '14px mobile']),
  colorName: PropTypes.string,
}

CalendarIcon.defaultProps = {
  sizeVariation: '32px',
  colorName: 'Primary Dark Blue',
}
