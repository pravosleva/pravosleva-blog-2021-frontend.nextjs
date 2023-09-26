import styled from 'styled-components'
import { themeMediaQuery } from '@/ui-kit'

export const ModalBody = styled('div')`
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    overflow: auto;
    overflow-y: auto;
    overflow-x: auto;
    height: 100%;
    background: #fff;
    padding: 15px 15px;
  }
  @media (max-width: 425px) {
    padding: 0px 15px;
  }
`
