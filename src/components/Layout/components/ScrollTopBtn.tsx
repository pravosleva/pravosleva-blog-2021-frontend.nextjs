import { useCallback, memo } from 'react'
import styled, { css } from 'styled-components'
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

type TProps = {
  themeName: TThemeName;
  isShowed: boolean;
}

export const StyledScrollTopBtn = styled('div')<TProps>`
  position: fixed;
  z-index: 3;
  right: 32px;
  bottom: 32px;
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-align: center;
  width: 56px;
  height: 56px;
  ${({ themeName }: any) =>
    themeName &&
    css`
      color: ${getLoaderColorByThemeName(themeName)};
      background-color: ${getTextColorByThemeName(themeName)};
    `}
  &:active {
    ${({ themeName }: any) =>
      themeName &&
      css`
        background-color: ${getLoaderColorByThemeName(themeName)};
        color: ${getTextColorByThemeName(themeName)};
      `}
  }
  outline: none;

  transform: translateX(100px);
  transition: all 0.3s ease-out;
  ${(p: any) =>
    p.isShowed &&
    css`
      transform: translateX(0px);
    `}
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ScrollTopBtn = memo(() => {
  const { isMoreThan2Screens } = useScrollPosition()
  const { currentTheme } = useGlobalTheming()
  const goTop = useCallback((px: number = 0) => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: px, behavior: 'smooth' });
    }
  }, [])
  const scrollTop = useCallback(() => {
    goTop()
  }, [goTop])

  return (
    <StyledScrollTopBtn
      onClick={scrollTop}
      isShowed={isMoreThan2Screens}
      themeName={currentTheme}
    >
      <ArrowUpwardIcon fontSize='large' />
    </StyledScrollTopBtn>
  )
})
