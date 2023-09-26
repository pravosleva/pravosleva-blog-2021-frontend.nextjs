import styled from 'styled-components'
import { themeMediaQuery } from '@/ui-kit'

export const CloseBtnContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000000;
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    top: 65px;
  }
`
