import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { themeColor } from '@/ui-kit/Theme'

const sizeVariations = {
  '14px mobile': { width: '14', height: '14' },
}

const getSVGWidth = (sizeVariation) => sizeVariations[sizeVariation].width
const getSVGHeight = (sizeVariation) => sizeVariations[sizeVariation].height

const StyledSVG = styled('svg')`
  & path {
    stroke: ${(p) => themeColor(p.strokeColorName)};
  }
`

export const OwnerPartsIcon = ({ colorName = 'PrimaryDarkBlue', sizeVariation = '14px mobile' }) => (
  <StyledSVG
    strokeColorName={colorName}
    width={getSVGWidth(sizeVariation)}
    height={getSVGHeight(sizeVariation)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.15577 11.4189C9.9599 11.4189 11.4224 9.95674 11.4224 8.15303C11.4224 6.34932 9.9599 4.88713 8.15577 4.88713C6.35164 4.88713 4.8891 6.34932 4.8891 8.15303C4.8891 9.95674 6.35164 11.4189 8.15577 11.4189Z"
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.58 6.89355L13.4348 6.59728C13.3044 6.09895 13.1054 5.62114 12.8435 5.17755L13.4516 4.14506C13.5811 3.92516 13.5455 3.64551 13.365 3.46505L12.5691 2.66934C12.3886 2.48888 12.1089 2.45329 11.889 2.58279L10.8569 3.18932C10.4123 2.92674 9.93325 2.72731 9.4336 2.59679L9.1298 1.4199C9.06596 1.17269 8.84291 0.999978 8.58753 1H7.4617C7.20641 1.00008 6.98349 1.17278 6.91967 1.4199L6.61633 2.59283C6.11333 2.72279 5.63101 2.92255 5.18343 3.18629L4.12853 2.5653C3.90858 2.43579 3.62886 2.47139 3.44837 2.65185L2.65223 3.44779C2.47173 3.62824 2.43613 3.9079 2.56567 4.1278L3.1868 5.18222C2.92787 5.62179 2.73064 6.09488 2.60067 6.58819L1.42 6.89355C1.17273 6.95738 0.999978 7.18037 1 7.43569V8.56126C1.00008 8.81649 1.17282 9.03935 1.42 9.10316L2.59133 9.40642C2.72189 9.9152 2.92386 10.4029 3.19123 10.8551L2.58457 11.8869C2.45503 12.1068 2.49063 12.3864 2.67113 12.5669L3.46727 13.3628C3.64776 13.5433 3.92748 13.5789 4.14743 13.4494L5.18017 12.8412C5.63177 13.1078 6.11881 13.3093 6.62683 13.4396L6.91967 14.5768C6.98349 14.8239 7.20641 14.9966 7.4617 14.9967H8.58753C8.84291 14.9967 9.06596 14.824 9.1298 14.5768L9.42543 13.4337C9.92971 13.3026 10.4131 13.1014 10.8614 12.8359L11.8715 13.4305C12.0914 13.56 12.3711 13.5244 12.5516 13.3439L13.3478 12.548C13.5283 12.3675 13.5639 12.0879 13.4343 11.868L12.8396 10.8581C13.1096 10.4027 13.3131 9.91101 13.4441 9.39803L14.5802 9.10409C14.8277 9.04011 15.0004 8.81677 15 8.56126V7.43569C15 7.18037 14.8273 6.95738 14.58 6.89355Z"
      strokeLinecap="round"
    />
  </StyledSVG>
)

OwnerPartsIcon.propTypes = {
  sizeVariation: PropTypes.oneOf(Object.keys(sizeVariations)),
  colorName: PropTypes.string,
}

OwnerPartsIcon.defaultProps = {
  sizeVariation: '14px mobile',
  colorName: 'Primary Dark Blue',
}
