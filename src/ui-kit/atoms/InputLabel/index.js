import styled, { css, keyframes } from 'styled-components'
import { themeColor, themeTextStyle } from '@/ui-kit'

// export const topLabelScaleIn = keyframes`
//   0% { opacity: 0; transform: scale(1.3) translate(22px, 0); padding: 0; }
//   100% { opacity: 1; transform: scale(1) translate(15px, -50%); padding: 5px; }
// `
export const topLabelFadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`

const heightStyles = {
  small: css`
    ${themeTextStyle('12R Notifications')}
    padding: 1px 7px;
    transform: translate(7px, -12px);
  `,
  normal: css`
    ${themeTextStyle('14R Small-body')}
    padding: 2px 10px;
    transform: translate(10px, -50%);
  `,
  default: css`
    ${themeTextStyle('14R Small-body')}
    padding: 2px 10px;
    transform: translate(10px, -50%);
  `,
}

const getHeightStyles = (height = 'default') => heightStyles[height]

export const InputLabel = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 5px 0 5px;
  color: ${themeColor('Light Gray Stroke')};
  ${(p) =>
    p.isInputFilled &&
    css`
      color: ${themeColor('Light blue')};
    `}
  ${(p) =>
    p.isInputHovered &&
    css`
      color: ${themeColor('Gray-blue')};
    `}
  ${(p) =>
    p.isInputFocused &&
    css`
      color: ${themeColor(p.rgs ? 'rgs' : 'Select Blue')};
    `}
  ${(p) =>
    p.isInputIncorrect &&
    css`
      color: ${themeColor('Incorrect')};
    `}
  ${(p) => getHeightStyles(p.height)}
  z-index: 9;
  border: none;
  background-color: #ffffff;

  ${(p) =>
    !p.visible &&
    css`
      display: none;
    `}
  ${(p) =>
    p.animated &&
    css`
      animation: ${topLabelFadeIn} 0.3s linear;
    `}
`

// InputLabel.defaultProps = {
//   height: 'default',
// };
