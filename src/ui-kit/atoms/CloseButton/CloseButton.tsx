import React from 'react'
import styled from 'styled-components'
// import { themeColorsNames } from '@/ui-kit'
import { CloseIcon } from '@/ui-kit/atoms/Icons/CloseIcon'

interface IProps {
  size?: number
  onClick: Function
  color?: string
}
interface IContainerProps {
  size?: number
  onClick: Function
}

const Container: React.FC<IContainerProps> = styled.div`
  cursor: pointer;
  width: ${(p: IProps) => p.size}px;
  height: ${(p: IProps) => p.size}px;
`

export const CloseButton = ({ onClick, size, color }: IProps) => (
  <Container onClick={onClick} size={size || 20}>
    <CloseIcon size={size} color={color} />
  </Container>
)
