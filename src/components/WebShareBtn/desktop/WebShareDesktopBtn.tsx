import { useCallback, memo } from 'react'
import { RWebShare } from 'react-web-share'
import styled, { css } from 'styled-components'
import ShareIcon from '@mui/icons-material/Share'

import { useGlobalTheming, TThemeName } from '~/hooks/useGlobalTheming'
import { useIsDesktop } from '~/hooks/useIsDesktop'
import { getLoaderColorByThemeName } from '@/utils/globalTheme/getLoaderColorByThemeName'

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
  themeName: TThemeName;
  isShowed: boolean;
}

/* ================= КРУГЛЫЙ СТИЛИЗОВАННЫЙ КОНТЕЙНЕР КНОПКИ ================= */
const StyledShareBtn = styled('div')<TStyledProps>`
  position: fixed;
  z-index: 3;
  right: 32px;
  // Позиционируем ровно на 16px выше кнопки поиска
  bottom: 220px; 
  border-radius: 50%;
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  text-align: center;
  width: 56px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;

  // Анимация выезда в бок вслед за остальными кнопками
  transform: translateX(100px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${(p) =>
    p.isShowed &&
    css`
      transform: translateX(0px);
    `}
    
  ${({ themeName }) =>
    themeName &&
    css`
      color: ${getLoaderColorByThemeName(themeName)};
      background-color: ${getTextColorByThemeName(themeName)};
    `}
    
  &:active {
    ${({ themeName }) =>
      themeName &&
      css`
        background-color: ${getLoaderColorByThemeName(themeName)};
        color: ${getTextColorByThemeName(themeName)};
      `}
  }
`

type TProps = {
  url: string;
  title?: string;
  text?: string;
  isSearchPanelOpen: boolean; // Прокидываем флаг, чтобы кнопка пряталась при открытом поиске
}

export const WebShareDesktopBtn = memo(({ url, title = '', text = '', isSearchPanelOpen }: TProps) => {
  const isDesktop = useIsDesktop(800)
  const { currentTheme } = useGlobalTheming()

  const handleClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, [])

  // Если это мобильное устройство — рендерить десктопную фиксированную кнопку не нужно
  if (!isDesktop) return null

  // Кнопка шаринга прячется, если панель поиска открыта (чтобы не перекрывать док)
  const isShowed = !isSearchPanelOpen

  return (
    // @ts-ignore
    <RWebShare
      // @ts-ignore
      data={{
        url,
        title,
        text,
      }}
    >
      <StyledShareBtn
        onClick={handleClick}
        isShowed={isShowed}
        themeName={currentTheme}
        title="Поделиться статьей"
      >
        <ShareIcon fontSize='medium' />
      </StyledShareBtn>
    </RWebShare>
  )
})
