import React from 'react'
import styled, { css } from 'styled-components'
import { themeColor, themeTextStyle } from '@/ui-kit'
import Link from 'next/link'

const types = {
  blue: css`
    background-color: ${themeColor('Accent Blue light')};
    &:hover {
      background-color: ${themeColor('Select Blue')};
    }
  `,
  secondary: css`
    background-color: ${themeColor('White color')};
    color: ${themeColor('Primary Dark Blue')};
    border: 1px solid ${themeColor('Primary Dark Blue')};
    &:hover {
      background-color: ${themeColor('White color')};
      color: ${themeColor('Select Blue')};
      border: 1px solid ${themeColor('Select Blue')};
    }
  `,
  secondaryWhite: css`
    color: ${themeColor('White color')};
    background-color: transparent;
    border: 1px solid ${themeColor('White color')};
    &:hover {
      background-color: ${themeColor('White color')};
      color: ${themeColor('Primary Dark Blue')};
      border: 1px solid ${themeColor('White color')};
    }
  `,
  orange: css`
    background-color: ${themeColor('Accent Orange')};
    &:hover {
      background-color: ${themeColor('Accent Orange Hover')};
    }
  `,
}

const widths = {
  auto: css`
    width: auto;
  `,
  narrow: css`
    width: 150px;
  `,
  medium: css`
    width: 200px;
  `,
  wide: css`
    width: 250px;
  `,
  responsive: css`
    width: 100%;
  `,
}

const sizes = {
  xsmall: css`
    height: 30px;
  `,
  small: css`
    height: 38px;
  `,
  medium: css`
    height: 44px;
  `,
  large: css`
    height: 52px;
  `,
}

const attached = {
  right: css`
    border-radius: 0 8px 8px 0;
  `,
  left: css`
    border-radius: 8px 0 0 8px;
  `,
}

const getDefaultStyles = () => css`
  font-family: Montserrat, system-ui;
  background-color: ${themeColor('Accent Blue light')};
  color: ${themeColor('White color')};
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${themeColor('Select Blue')};
  }
  transition: all 0.3s ease;

  width: 200px;
  height: 44px;

  align-items: center;
  justify-content: center;
  padding: 0 15px;
  border-radius: 8px;

  text-decoration: none;
  outline: none;
  user-select: none;
`

const getDisabledStyles = () => css`
  background-color: ${themeColor('White color')};
  color: ${themeColor('Light Gray Stroke')};
  border: 1px solid ${themeColor('Light Gray Stroke')};
  cursor: default;
  &:hover {
    background-color: ${themeColor('White color')};
    color: ${themeColor('Light Gray Stroke')};
    border: 1px solid ${themeColor('Light Gray Stroke')};
    cursor: default;
  }
`
export type TType = 'blue' | 'secondary' | 'orange' | 'secondaryWhite'
export type TWidth = 'narrow' | 'medium' | 'wide' | 'responsive'
export type TSize = 'xsmall' | 'small' | 'medium' | 'large'
export type TAttached = 'right' | 'left'

const getTypeStyles = (type: TType): any => types[type] || types.blue
const getWidthStyles = (width: TWidth) => widths[width] || widths.medium
const getSizeStyles = (size: TSize) => sizes[size] || sizes.medium
const getAttachedStyles = (attach: TAttached) => attached[attach] || ''

interface IProps {
  typeName?: TType
  width?: TWidth
  size?: TSize
  attached?: TAttached
  onClick?: any
}

const getButtonStyles = (_p: IProps) => css`
  display: flex;
  box-sizing: border-box;
  ${themeTextStyle('Link - 14pt')}

  /* types */
  ${getDefaultStyles()}
  &:disabled {
    ${getDisabledStyles()}
  }
  ${(p: any) => p.typeName && getTypeStyles(p.typeName)}

  /* widths */
  ${(p: any) => p.width && getWidthStyles(p.width)}

  /* sizes */
  ${(p: any) => p.size && getSizeStyles(p.size)}

  /* misc */
  ${(p: any) => p.attached && getAttachedStyles(p.attached)}
`

export const Button = styled.button<IProps>`
  ${(p) => getButtonStyles(p)}
`

// const StyledLink = styled(Button)``

export const NextLinkButton = ({ href, name, onClick, ...props }: any) => (
  <Link href={href} as={href}>
    <Button onClick={onClick} {...props}>
      {name}
    </Button>
  </Link>
)
export const ExternalLinkButton = ({ href, name, onClick, ...props }: any) => (
  <a href={href} style={{ textDecoration: 'none' }}>
    <Button onClick={onClick} {...props}>
      {name}
    </Button>
  </a>
)

// Button.defaultProps = {
//   type: '',
//   width: '',
//   size: '',
//   attached: '',
// };
