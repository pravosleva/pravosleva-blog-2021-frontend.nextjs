import styled, { css } from 'styled-components'

export const ProgressBar = styled('div')<{
  label: string;
  value: number;
}>`
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 3em;
  background-color: #1960bc;
  border-radius: 1.5em;
  color: #fff;

  &::before {
    box-sizing: border-box;
    white-space: pre;
    ${({ label }) =>
      label &&
      css`
        content: '${label}';
      `}
    display: flex;
    align-items: center;
    position: absolute;
    left: 0.5em;
    top: 0.5em;
    bottom: 0.5em;
    /* width: calc(var(--width, 0) * 1%); */
    ${({ value }) =>
      value &&
      css`
        width: ${value <= 100 ? Math.abs(value).toFixed(0) : 100}%;
      `}
    min-width: 2rem;
    max-width: calc(100% - 1em);
    background-color: #2cc194;
    ${({ value }) =>
      value &&
      value > 100 &&
      css`
        background-color: #e46046;
      `}
    ${({ value }) =>
      value &&
      value < 0 &&
      css`
        background-color: #2280fa;
      `}
    border-radius: 1em;
    padding: 1em;
    transition: width 0.3s ease-in;
  }
`
