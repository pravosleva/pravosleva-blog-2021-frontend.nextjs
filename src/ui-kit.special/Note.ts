import styled from 'styled-components'

export const Note = styled("div")`
  font-size: smaller;

  border: none;
  // margin-bottom: 20px;
  & ul {
    margin-left: 0;
    margin-bottom: 0;
  }
  & ul > li {
    margin-bottom: 0;
  }
`