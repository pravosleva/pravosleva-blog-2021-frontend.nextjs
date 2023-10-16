import styled from 'styled-components'

export const CircleBtn = styled('button')`
  outline: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  not supported by any browser */

  border: 1px solid transparent;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.3s linear;

  &:hover {
    border: 1px solid #fff;
    box-shadow: rgba(51, 51, 51, 0.4) 0px 0px 4px;
  }
`