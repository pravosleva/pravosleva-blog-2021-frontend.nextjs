import styled, { css } from 'styled-components'

export const Btn = styled('button')<{
  color?: 'primary' | 'secondary' | 'secondary-outlined';
  // variant?: 'outlined';
  fullWidth?: boolean;
  rounded?: boolean;
  hasWhiteBorder?: boolean;
}>`
  cursor: pointer;
  padding: 10px 25px;
  // line-height: 45px;
  border-radius: 8px;

  ${(p) => p.rounded && css`
    border-radius: 2em;
  `}

  outline: none;
  box-shadow: rgba(51, 51, 51, 0.2) 0px 0px 4px;
  transition: all 0.3 ease;

  font-size: 14px;
  font-weight: bold;
  // font-weight: 500;
  letter-spacing: .09em;
  text-transform: uppercase;

  ${(p) => {
    switch (p.color) {
      case 'primary':
        return css`
// background-color: rgb(106, 197, 232);
background-color: rgb(32, 107, 235);
// border-radius: 20px;
// border: 2px solid rgb(106, 197, 232);
border: 2px solid rgb(32, 107, 235);
color: white;
&:hover {
  background-color: #1b7bff;
  // border-color: rgb(106, 197, 232);
  border: 2px solid rgb(32, 107, 235);
}
`
      case 'secondary': return css`
background-color: #6efacc;
color: #000;
border: 2px solid #6efacc;
&:hover {
  background-color: transparent;
  color: #fff;
}
`
      case 'secondary-outlined': return css`
background-color: transparent;
border: 2px solid #6efacc;
color: #6efacc;
transition:
  background-color .2s,
  color .4s;
&:hover {
  background-color: #6efacc;
  color: #000;
}
`
      default: return css`
background-color: transparent;
// border: 2px solid rgb(106, 197, 232);
border: 2px solid rgb(32, 107, 235);
color: white;
&:hover {
  // background-color: rgb(106, 197, 232);
  background-color: rgb(32, 107, 235);
  color: white;
  // border: 2px solid rgb(106, 197, 232);
  border: 2px solid rgb(32, 107, 235);
}      
`
    }
  }
}

${(p) => p.fullWidth && css`
  width: 100%;
`}

${(p) => p.hasWhiteBorder && css`
  border: 2px solid #fff;
`}

  transition: background 0.5s ease-in-out;
`

export const PrimaryBtn = styled(Btn)`
  // background-color: rgb(106, 197, 232);
  // background-color: rgb(32, 107, 235);
  border-radius: 20px;
  // border: 2px solid rgba(98, 178, 208, 0.9);
  // border: 2px solid transparent;
  color: white;
  &:hover {
    background-color: #1b7bff;
    // border: 2px solid #1b7bff;
  }
`
