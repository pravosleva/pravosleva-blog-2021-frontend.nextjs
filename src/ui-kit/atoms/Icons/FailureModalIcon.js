import React from 'react'
import styled from 'styled-components'
import { themeColor } from '@/ui-kit'

const Path = styled('path')`
  fill: ${(p) => themeColor(p.color)};
`

export const FailureModalIcon = ({ colorName = 'lightGrayStroke' }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24 48C10.743 48 0 37.254 0 24C0 10.746 10.743 0 24 0C37.254 0 48 10.746 48 24C48 37.254 37.254 48 24 48ZM24.021 28.23L27.945 32.154C29.106 33.315 30.993 33.315 32.154 32.154C33.318 30.993 33.318 29.106 32.154 27.945L28.23 24.021L32.154 20.094C33.315 18.933 33.315 17.049 32.154 15.885C30.99 14.721 29.106 14.721 27.945 15.885L24.021 19.809L20.082 15.873C18.921 14.709 17.034 14.709 15.873 15.873C14.709 17.034 14.709 18.918 15.873 20.082L19.809 24.018L15.873 27.957C14.709 29.121 14.709 31.005 15.873 32.166C17.034 33.33 18.921 33.33 20.082 32.166L24.021 28.23Z"
      color={colorName}
    />
  </svg>
)
