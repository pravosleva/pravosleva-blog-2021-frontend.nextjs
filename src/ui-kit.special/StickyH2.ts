import styled from 'styled-components'

export const StickyH2 = styled('h2').attrs({
  className: 'backdrop-blur--lite truncate'
})`
  position: sticky;
  top: 0;
  margin: 0px 0px 16px 0px;
  padding: 16px 16px 16px 16px;
  border-bottom: 1px solid lightgray;
  z-index: 1;
`

export const StickyTopBox = styled('div').attrs({
  className: 'backdrop-blur--lite truncate'
})`
  position: sticky;
  top: 0;
  margin: 0px 0px 0px 0px;
  padding: 16px 16px 16px 16px;
  // border-bottom: 1px solid lightgray;
  z-index: 1;
`
