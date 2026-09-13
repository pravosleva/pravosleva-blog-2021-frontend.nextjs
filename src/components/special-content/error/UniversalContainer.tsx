import React from 'react'
import styled from 'styled-components'
import { breakpoints } from '~/mui/theme'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  // Вычитаем примерную высоту хедера и хлебных крошек, чтобы не появлялся ложный скролл страницы
  @media (max-width: ${breakpoints.md}px) {
    min-height: calc(100vh - 40px - 84px);
    padding: 16px;
  }
  @media (min-width: ${breakpoints.md + 1}px) {
    min-height: calc(100vh - 50px - 84px);
    padding: 24px;
  }
  box-sizing: border-box;
`

export const UniversalContainer: React.FC<unknown> = ({ children }) => <Wrapper>{children}</Wrapper>
