import styled from 'styled-components'

export const Fab = styled('button').attrs({
  className: 'backdrop-blur--lite'
})`
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  /* box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2); */
  /* background-color: #29B6F6; */
  /* background-color: rgba(27,123, 255,0.8); */
  background-color: transparent;
  border: 2px solid #6efacc;
  color: #6efacc;
  outline: none;

  box-shadow: 0 5px 10px 0px rgba(7,7,7,.3);

  transition: background-color 0.5s ease-in-out;
`
