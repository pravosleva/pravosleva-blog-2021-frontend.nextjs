import styled from 'styled-components'

// Обертка для десктопных элементов (видны только от 800px)
export const DesktopOnly = styled('div')`
  display: none;
  
  @media (min-width: 800px) {
    display: block;
  }
`

// Обертка для мобильных элементов (видны только до 799px)
export const MobileOnly = styled('div')`
  display: block;
  
  @media (min-width: 800px) {
    display: none;
  }
`
