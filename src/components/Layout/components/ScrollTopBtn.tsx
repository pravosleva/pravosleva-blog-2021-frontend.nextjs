import React, { useCallback, memo } from 'react'
import styled from 'styled-components'
import { getLoaderColorByThemeName } from '@/utils/globalTheme/getLoaderColorByThemeName'
import { useScrollPosition } from '~/hooks/useScrollPosition'
import { useGlobalTheming, TThemeName } from '~/hooks/useGlobalTheming'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const getTextColorByThemeName = (themeName: TThemeName) => {
  switch (themeName) {
    case 'gray':
    case 'hard-gray':
      return '#0162c8'
    case 'light':
    case 'dark':
    default:
      return '#fff'
  }
}

type TStyledProps = {
  $themeName: TThemeName;
}

// 1. Явно передаем интерфейс TStyledProps в дженерик styled.div
const StyledScrollTopBtn = styled.div<TStyledProps>`
  position: fixed;
  z-index: 3;
  right: 32px;
  bottom: 76px;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-align: center;
  width: 56px;
  height: 56px;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  
  transition: transform 0.3s ease-out, background-color 0.2s ease, color 0.2s ease;

  /* 2. Исправление ошибки: Явно типизируем входящие пропсы (props: TStyledProps) перед вызовом функций */
  color: ${(props: TStyledProps) => getLoaderColorByThemeName(props.$themeName)};
  background-color: ${(props: TStyledProps) => getTextColorByThemeName(props.$themeName)};

  &:active {
    background-color: ${(props: TStyledProps) => getLoaderColorByThemeName(props.$themeName)};
    color: ${(props: TStyledProps) => getTextColorByThemeName(props.$themeName)};
  }
`

export const ScrollTopBtn = memo(() => {
  const { isMoreThan2Screens } = useScrollPosition()
  const { currentTheme } = useGlobalTheming()

  const handleScrollTop = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  return (
    <StyledScrollTopBtn
      onClick={handleScrollTop}
      $themeName={currentTheme}
      style={{
        transform: isMoreThan2Screens ? 'translateX(0px)' : 'translateX(100px)',
      }}
    >
      <ArrowUpwardIcon fontSize="medium" />
    </StyledScrollTopBtn>
  )
})

ScrollTopBtn.displayName = 'ScrollTopBtn'
