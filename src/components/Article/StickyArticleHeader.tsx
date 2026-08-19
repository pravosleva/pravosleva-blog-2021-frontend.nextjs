import { memo, useEffect } from 'react'
import Link from 'next/link'
import styled, { css } from 'styled-components'
import { getFormatedDate2 } from '~/utils/time-tools/timeConverter'
import { useReactiveValue0 } from '~/utils/reactive-engine/hooks'
import { SearchArticlesService, stickyHeaderEngine } from './stickyHeaderEngine'

type TStickyHeaderProps = {
  themeName: string
  isVisible: boolean
}

const StyledStickyHeader = styled('div')<TStickyHeaderProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  @media (min-width: 768px) {
    height: 50px;
    padding: 0px 40px 0px 20px;
  }
  @media (max-width: 767px) {
    height: 40px;
    padding: 0 16px;
  }
  z-index: 3;
  display: flex;
  align-items: center;
  
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;

  ${(p) =>
    p.isVisible &&
    css`
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    `}

  ${({ themeName }) => {
    switch (themeName) {
      case 'dark':
      case 'hard-gray':
        return css`
          background-color: #1e1e1e;
          color: #fff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        `;
      case 'gray':
        return css`
          background-color: #333;
          color: #fff;
        `;
      case 'light':
      default:
        return css`
          background-color: #ffffff;
          color: #000;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        `;
    }
  }}
`

const StickyHeaderTitle = styled('h4')`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Montserrat', system-ui;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // max-width: 800px;
  // max-width: calc((100vw - 800px)/2 - 20px - 20px - 50px);
  margin: 0 auto 0 0; /* Прижимаем к левому краю, но держим границы */
`

const StickyBlogLink = styled('a')<{ hoverColor: string }>`
  font-family: 'Montserrat', system-ui;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  color: #888;
  white-space: nowrap;
  transition: color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${(p) => p.hoverColor};
  }
`

const StickySeparator = styled('span')`
  // margin: 0 8px;
  color: #888;
  user-select: none;
`

interface StickyArticleHeaderProps {
  currentTheme: string
  linkColor: string
  article: any
  bannerRef: React.RefObject<HTMLDivElement | null> // Передаем реф баннера сюда
}

export const StickyArticleHeaderComponent = memo(({ currentTheme, linkColor, article, bannerRef }: StickyArticleHeaderProps) => {
  const specialEngine = stickyHeaderEngine.inject(SearchArticlesService)
  
  // Подписываемся НАПРЯМУЮ на сигнал видимости шапки
  const isVisible = useReactiveValue0(specialEngine.isStickyHeaderVisible)

  useEffect(() => {
    const target = bannerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0
        
        // Меняем сигнал в сервисе атомарно, минуя стейт страницы статьи!
        specialEngine.isStickyHeaderVisible.value = isScrolledPast
      },
      {
        threshold: 0,
        rootMargin: '-50px 0px 0px 0px'
      }
    )

    observer.observe(target)
    
    return () => {
      observer.disconnect()
      // Сбрасываем сигнал при размонтировании страницы статьи
      specialEngine.isStickyHeaderVisible.value = false
    }
  }, [bannerRef, article])

  return (
    <StyledStickyHeader themeName={currentTheme} isVisible={isVisible}>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '0 auto', gap: '8px' }}>
        {/* Ссылка на Блог (Совместимо с Next.js 11.1.4) */}
        <Link href="/blog" passHref>
          <StickyBlogLink hoverColor={linkColor}>Блог</StickyBlogLink>
        </Link>
        <StickySeparator>•</StickySeparator>
        <StickyHeaderTitle>{article?.original?.title}</StickyHeaderTitle>
        {!!article?.original?.createdAt && (
          <small style={{ fontSize: '11px', opacity: 0.4, marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            {getFormatedDate2(new Date(article.original.createdAt))}
          </small>
        )}
      </div>
    </StyledStickyHeader>
  )
})

StickyArticleHeaderComponent.displayName = 'StickyArticleHeaderComponent'
