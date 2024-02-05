import styled, { css } from 'styled-components'
import { themeMediaQuery, themeShadow } from '~/ui-kit.uremont'

const sizes = {
  small: css`
    width: 440px;
    max-width: 440px;
  `,
  large: css`
    width: 800px;
    max-width: 800px;
  `,
}

export enum ESize {
  SMALL = 'small',
  LARGE = 'large',
}

const getSize = (size: ESize) => sizes[size] || sizes.small

export const ModalContent = styled('div')<{ size: ESize }>`
  display: flex;
  flex-direction: column;
  background: #FFF;
  color: #000;
  border-radius: 16px;
  padding: 0;
  margin: auto;
  ${(p: any) => getSize(p.size)}
  box-shadow: ${themeShadow('Main Shadow')};
  @media (max-width: ${themeMediaQuery('mobile', 'max')}) {
    border-radius: 0;
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    max-height: 100vh;
    justify-content: space-between;
  }
`
