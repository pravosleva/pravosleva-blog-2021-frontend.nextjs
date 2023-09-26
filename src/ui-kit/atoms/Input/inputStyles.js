import { css } from 'styled-components'
import { themeTextStyle, themeColor } from '@/ui-kit'

const attachedStyles = {
  right: css`
    border-radius: 0 6px 6px 0;
  `,
  left: css`
    border-radius: 6px 0 0 6px;
  `,
}

export const getAttachedStyles = (p) => (p.attached && attachedStyles[p.attached]) || ''

export const getBorderStyles = (p) => css`
  border: none;
  ${(p) =>
    p.hasBorder &&
    css`
      border: 1px solid ${themeColor('Light Gray Stroke')};
      caret-color: ${(p) => themeColor(p.rgs ? 'rgs' : 'Select Blue')};
      ${p.value &&
      css`
        border: 1px solid ${themeColor('Light blue')};
      `}
      &:hover {
        border: 1px solid ${themeColor('Gray-blue')};
      }
      &:focus {
        border: 1px solid ${(p) => themeColor(p.rgs ? 'rgs' : 'Select Blue')};
      }
      ${p.isIncorrect &&
      css`
        border: 1px solid ${themeColor('Incorrect')} !important;
        ::placeholder {
          color: ${themeColor('Incorrect')};
        }
      `}
    `}
`

export const getEditableStyles = (p) => css`
  ${(p) =>
    !p.editable &&
    css`
      cursor: pointer;
      caret-color: transparent;
    `}
`

const heightStyles = {
  small: css`
    ${themeTextStyle('14R Small-body')}
  `,
  normal: css`
    ${themeTextStyle('16R Body')}
  `,
  default: css`
    ${themeTextStyle('16R Body')}
  `,
}

const getHeightStyles = (height = 'default') => heightStyles[height]

export const getCommonStyles = (p) => css`
  background-color: ${themeColor('White color')};
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 6px;
  text-decoration: none;
  outline: 0;
  width: 100%;
  ${(p) => getHeightStyles(p.height)};
  color: ${themeColor('Dark Black')};
`
