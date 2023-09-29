import React from 'react'
import styled from 'styled-components'

const StyledSVG = styled('svg')`
  & path {
    &.path-first {
      fill: #fff;
    }
    &.path-second {
      stroke: #fff;
    }
  }
`

export const CrossCloseIcon = () => (
  <StyledSVG width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      className="path-first"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.7857 15.9995L22.5041 10.2822C22.7211 10.0627 22.7211 9.7127 22.5041 9.49601C22.2874 9.27932 21.9352 9.27932 21.7186 9.49601L16.0002 15.2133L10.2818 9.49601C10.0651 9.27932 9.71288 9.27932 9.49621 9.49601C9.27926 9.7127 9.27926 10.0627 9.49621 10.2822L15.2146 15.9995L9.49621 21.7195C9.27926 21.9362 9.27926 22.2862 9.49621 22.5057C9.60454 22.614 9.74676 22.6668 9.88899 22.6668C10.0312 22.6668 10.1734 22.614 10.2818 22.5057L16.0002 16.7857L21.7186 22.5057C21.8269 22.614 21.9691 22.6668 22.1113 22.6668C22.2536 22.6668 22.3958 22.614 22.5041 22.5057C22.7211 22.2862 22.7211 21.9362 22.5041 21.7195L16.7857 15.9995"
    />
    <path
      className="path-second"
      d="M16.7857 15.9995L22.5041 10.2822C22.7211 10.0627 22.7211 9.7127 22.5041 9.49601C22.2874 9.27932 21.9352 9.27932 21.7186 9.49601L16.0002 15.2133L10.2818 9.49601C10.0651 9.27932 9.71288 9.27932 9.49621 9.49601C9.27926 9.7127 9.27926 10.0627 9.49621 10.2822L15.2146 15.9995L9.49621 21.7195C9.27926 21.9362 9.27926 22.2862 9.49621 22.5057C9.60454 22.614 9.74676 22.6668 9.88899 22.6668C10.0312 22.6668 10.1734 22.614 10.2818 22.5057L16.0002 16.7857L21.7186 22.5057C21.8269 22.614 21.9691 22.6668 22.1113 22.6668C22.2536 22.6668 22.3958 22.614 22.5041 22.5057C22.7211 22.2862 22.7211 21.9362 22.5041 21.7195L16.7857 15.9995"
      strokeWidth="0.25"
    />
  </StyledSVG>
)

const StyledSVG2 = styled('svg')`
  & rect {
    fill: #fff;
  }
`

export const HamburgerIcon = () => (
  <StyledSVG2 width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="11.6001" y="5.5" width="15.4" height="1.23529" rx="0.617647" />
    <rect x="5" y="15.3823" width="22" height="1.23529" rx="0.617647" />
    <rect x="11.6001" y="25.2646" width="15.4" height="1.23529" rx="0.617647" />
  </StyledSVG2>
)