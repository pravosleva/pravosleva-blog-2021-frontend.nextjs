import styled from 'styled-components'
import { Divider } from '@/ui-kit/atoms/Divider'

export const ModalHeaderDivider = styled(Divider)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  @media (max-width: 425px) {
    display: none;
  }
`
