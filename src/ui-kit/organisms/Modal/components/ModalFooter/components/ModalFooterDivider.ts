import styled from 'styled-components'
import { Divider } from '@/ui-kit/atoms/Divider'

export const ModalFooterDivider = styled(Divider)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  @media (max-width: 425px) {
    display: none;
  }
`
