import React from 'react'
import styled from 'styled-components'
import { breakpoints } from '~/mui/theme'

interface IUniversalContainerProps {
  isForLayout: boolean;
  hasBreadcrumbs: boolean;
  children?: React.ReactNode; // Поддержка любых дочерних React-нод
}

const Wrapper = styled.div<{ isForLayout: boolean; hasBreadcrumbs: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  // Вычитаем примерную высоту хедера и хлебных крошек, чтобы не появлялся ложный скролл страницы
  @media (max-width: ${breakpoints.md}px) {
    ${({ isForLayout, hasBreadcrumbs }) => {
      const base = '100svh'
      const header = isForLayout ? '40px' : '0px'
      const breadcrumbs = hasBreadcrumbs ? '84px' : '0px'
      const result = [base, header, breadcrumbs].join(' - ')
      return `min-height: calc(${result});`
      }
    }
    padding: 16px;
  }
  @media (min-width: ${breakpoints.md + 1}px) {
    ${({ isForLayout, hasBreadcrumbs }) => {
      const base = '100svh'
      const header = isForLayout ? '50px' : '0px'
      const breadcrumbs = hasBreadcrumbs ? '84px' : '0px'
      const result = [base, header, breadcrumbs].join(' - ')
      return `min-height: calc(${result});`
      }
    }
    padding: 24px;
  }
  box-sizing: border-box;
`

export const UniversalContainer: React.FC<IUniversalContainerProps> = ({ children, isForLayout, hasBreadcrumbs }) => (
  <Wrapper isForLayout={isForLayout} hasBreadcrumbs={hasBreadcrumbs}>{children}</Wrapper>
)
