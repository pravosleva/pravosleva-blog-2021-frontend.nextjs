import styled, { keyframes } from 'styled-components'
import { themeColor, themeMediaQuery } from '@/ui-kit'

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`

export const ModalContainer = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  // background: ${themeColor('Transparent Gray-blue')};
  background: ${themeColor('Transparent Black-hard')};
  backdrop-filter: blur(4px);
  z-index: 1000000;
  padding: 70px 0;
  overflow: auto;
  overflow-y: scroll;
  overflow-x: auto;
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 100%;
  }
  animation: ${fadeIn} 0.3s ease-in-out;
`
