import styled, { css } from 'styled-components'

export const Btn = styled('button')<{
  color?: 'primary';
  fullWidth?: boolean;
}>`
  cursor: pointer;
  padding: 10px 25px;
  border-radius: 8px;
  outline: none;
  box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;
  transition: all 0.3 ease;

  font-size: 14px;
  font-weight: 500;

  ${(p) => {
    switch (p.color) {
      case 'primary':
        return css`
background-color: rgb(106, 197, 232);
// border-radius: 20px;
border: 2px solid rgb(106, 197, 232);
color: white;
&:hover {
  background-color: #1b7bff;
  border-color: rgb(106, 197, 232);
}
`
      default: return css`
background-color: transparent;
border: 2px solid rgb(106, 197, 232);
color: white;
&:hover {
  background-color: rgb(106, 197, 232);
  color: white;
  border: 2px solid rgb(106, 197, 232);
}      
`
    }
  }
}

${(p) => p.fullWidth && css`
  width: 100%;
`}

  transition: background 0.5s ease-in-out;
`

export const PrimaryBtn = styled(Btn)`
  background-color: rgb(106, 197, 232);
  border-radius: 20px;
  border: 2px solid rgba(98, 178, 208, 0.9);
  color: white;
  &:hover {
    background-color: #1b7bff;
    border: 2px solid #1b7bff;
  }
`
