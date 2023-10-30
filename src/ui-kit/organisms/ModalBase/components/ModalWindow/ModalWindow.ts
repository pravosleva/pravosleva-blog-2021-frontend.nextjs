import styled, { css, keyframes } from 'styled-components'
import { themeMediaQuery, themeColor, themeShadow } from '@/ui-kit'
import { ESize } from '~/ui-kit/organisms/Modal/components/ModalContent'


interface IProps {
  size: ESize;
  width: number;
  noBackground?: boolean;
}

const sizes: any = {
  small: 440,
  large: 800,
  superLarge: 1400,
}

const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`

export const ModalWindow = styled.div<IProps>`
display: flex;
flex-direction: column;
border-radius: 16px;
position: relative;
min-height: 60px;
width: ${(p: any) => sizes[p.size] || sizes.small}px;
${(p: any) =>
  p.width &&
  css`
    width: ${p.width};
  `}
background: ${themeColor('Transparent Gray-blue')};
box-shadow: ${themeShadow('Main Shadow')};
${(p: any) =>
  p.noBackground &&
  css`
    background: inherit;
    box-shadow: inherit;
  `}
@media (max-width: ${themeMediaQuery('mobile', 'max')}) {
  border-radius: 0;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  max-height: 100vh;
  justify-content: space-between;
  padding-top: 40px;
}
animation: ${fadeIn} 0.3s ease-in-out;
`
