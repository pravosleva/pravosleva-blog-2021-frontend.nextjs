import styled from 'styled-components'

export const Wrapper = styled('div')`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  > div,
  > div > div,
  > div > div > div,
  > div > div > div > div,
  > div > div > div > div > div,
  > div > div > div > div > div > svg {
    border-radius: inherit;
  }
  box-shadow: 0 0 5px lightgray;
`
