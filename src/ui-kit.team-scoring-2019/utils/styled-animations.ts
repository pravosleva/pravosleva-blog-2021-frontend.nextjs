import { keyframes } from 'styled-components'

export const fadeIn = keyframes`
  from { opacity: 0 };
  to { opacity: 1 };
`

// USAGE:
// animation: ${fadeIn} 0.3s ease-in-out;
