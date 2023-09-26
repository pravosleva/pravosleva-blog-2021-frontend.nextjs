import styled from 'styled-components'

export const ModalFooterContainer = styled('div')`
  position: relative;
  width: 100%;
  z-index: 0;
  height: 80px;
  min-height: 80px;
  max-height: 80px;
  box-sizing: border-box;
  padding: 20px 30px 25px 30px;
  @media (max-width: 425px) {
    height: auto;
    max-height: 100%;
    min-height: auto;
    background: #ffffff;
  }
`
