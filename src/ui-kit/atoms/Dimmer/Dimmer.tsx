import styled from 'styled-components'
import { themeColor } from '@/ui-kit'

type TProps = {
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Dimmer = styled('div')<TProps>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
  overflow-y: scroll;
  overflow-x: auto;
  background: ${themeColor('Transparent Gray-blue')};
  // background: ${themeColor('Transparent Black-hard')};
  backdrop-filter: blur(1.5em);
`
