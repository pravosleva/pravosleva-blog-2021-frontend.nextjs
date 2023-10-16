import styled, { css } from 'styled-components'
import { CircleBtn } from './CircleBtn'

export const AbsoluteCircleBtn = styled(CircleBtn)<{
  topRightStyles?: string;
}>`
  position: absolute;
  top: 10px;
  right: 10px;
  ${(p) =>
    p.topRightStyles &&
    css`
      ${p.topRightStyles}
    `}
`
