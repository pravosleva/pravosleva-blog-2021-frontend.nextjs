import styled, { css } from 'styled-components'

interface IProps {
  isCurrentSelection: boolean
}

export const LangLink = styled('a')<IProps>`
  color: #fff;
  opacity: 0.5;
  ${(p: IProps) =>
    p.isCurrentSelection &&
    css`
      color: #ff781e !important;
      opacity: 1;
    `};
  &:hover {
    opacity: 1;
  }
  transition: all 0.3s ease;
`
