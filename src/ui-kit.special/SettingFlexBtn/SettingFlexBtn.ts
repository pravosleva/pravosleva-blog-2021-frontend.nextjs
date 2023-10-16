import styled, { css } from 'styled-components'

export const SettingFlexBtn = styled('button')<{ assigned?: boolean; }>`
  flex: 1 1 auto;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: white;
  color: rgb(106, 197, 232);
  &:hover {
    background-color: rgb(106, 197, 232);
    color: white;
  }
  border-radius: unset;
  padding: 10px 25px;
  ${(p) =>
    p.disabled &&
    p.disabled === true &&
    css`
      opacity: 0.8;
      color: #ff886f;
      &:hover {
        color: white;
        background-color: #ff886f;
      }
    `}
  ${(p) =>
    p.assigned &&
    p.assigned === true &&
    css`
      opacity: 0.8;
      color: #ff886f;
      &:hover {
        color: white;
        background-color: #ff886f;
      }
    `}
`
