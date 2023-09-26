import React from 'react'
// import PropTypes from 'prop-types';

import { getThemeColor } from '@/ui-kit/Theme'

export const CloseIcon = ({ size, color }) => {
  const fillColor = getThemeColor(color)

  return (
    <svg viewBox="0 0 20 20" width={size} height={size} fill={fillColor}>
      <path d="M16 5.05L14.95 4L10 8.95L5.05 4L4 5.05L8.95 10L4 14.95L5.05 16L10 11.05L14.95 16L16 14.95L11.05 10L16 5.05Z" />
    </svg>
  )
}

// CloseIcon.propTypes = {
//   size: PropTypes.number,
//   color: PropTypes.oneOf(themeColorsNames),
// };

// CloseIcon.defaultProps = {
//   size: 20,
//   color: 'Dark Black',
// };
