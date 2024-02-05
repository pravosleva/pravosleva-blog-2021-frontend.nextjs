import styled, { css } from 'styled-components'

const sizes = {
  default: css`
    width: 32px;
    height: 32px;
  `,
  '24px': css`
    width: 24px;
    height: 24px;
  `,
  '18px': css`
    width: 18px;
    height: 18px;
  `,
  '28px': css`
    width: 28px;
    height: 28px;
  `,
  '20px': css`
    width: 20px;
    height: 20px;
  `,
}

const getSize = (size = 'default') => sizes[size]

export const BorderlessButton = styled('button')`
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background: transparent;
  ${(p) => getSize(p.size)}
`

// BorderlessButton.propTypes = {
//   size: PropTypes.oneOf(Object.keys(sizes)).isRequired,
// };
