import styled from 'styled-components'
import { breakpoints } from '~/mui/theme';

type TProps = {
  maxWidth?: 'md';
  isPaddedMobile?: boolean;
  isLastSection?: boolean;
}

const limits: { [key: string]: number; } = {
  md: 900,
}

export const Container = styled('div')<TProps>`
  // border: 1px solid red;
  margin: 0 auto;

  ${({ maxWidth }) => !!maxWidth && !!limits[maxWidth] && `
    max-width: ${limits[maxWidth]}px;
  `}

  ${({ isPaddedMobile }) => !!isPaddedMobile && `
    @media(max-width: ${breakpoints.md}px) {
      padding: 0px 16px 0px 16px;
    }
  `}

  ${({ isLastSection }) => !!isLastSection && `
    @media(max-width: ${breakpoints.md}px) {
      padding-bottom: 30px;
    }
    @media(min-width: ${breakpoints.md + 1}px) {
      padding-bottom: 50px;
    }
  `}
`
