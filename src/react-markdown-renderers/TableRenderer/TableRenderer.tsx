import React, { useRef, useState, useEffect } from 'react'
import { FloatingHeader } from './FloatingHeader'
import { useIsDesktop } from '~/hooks/useIsDesktop';

interface TableRendererProps {
  children: React.ReactNode;
  withScrollButtons?: boolean;   // Опция включения кнопок (дефолт: true)
  withFloatingHeader?: boolean;  // Опция включения липкой шапки (дефолт: false)
  topOffset?: number;            // Отступ сверху (под хедер сайта)
}

export const TableRenderer: React.FC<TableRendererProps> = ({
  children,
  withScrollButtons = true,
  withFloatingHeader = false,
  topOffset = 0,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  
  const [showControls, setShowControls] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isHeaderFloating, setIsHeaderFloating] = useState(false)

  const checkScrollLimits = () => {
    const el = scrollContainerRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const hasScroll = scrollWidth > clientWidth + 2
    setShowControls(hasScroll && withScrollButtons)

    if (hasScroll && withScrollButtons) {
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6)
    }
  }

  const handleWindowScroll = () => {
    if (!withFloatingHeader || !rootRef.current || !tableRef.current) return

    const rootRect = rootRef.current.getBoundingClientRect()
    const originalThead = tableRef.current.querySelector('thead')
    const theadHeight = originalThead ? originalThead.clientHeight : 40

    // Шапка появляется, только если оригинальный thead скрылся сверху,
    // но вся таблица еще не уехала полностью вверх
    const shouldFloat = 
      rootRect.top + topOffset < 0 && 
      rootRect.bottom - theadHeight - topOffset > 0

    setIsHeaderFloating(shouldFloat)
  }

  const handleArrowClick = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current
    if (!el) return
    const scrollAmount = el.clientWidth * 0.7
    el.scrollTo({
      left: direction === 'left' ? el.scrollLeft - scrollAmount : el.scrollLeft + scrollAmount,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const resizeObserver = new ResizeObserver(() => {
      checkScrollLimits()
      if (withFloatingHeader) handleWindowScroll()
    })
    
    resizeObserver.observe(el)
    checkScrollLimits()

    if (withFloatingHeader) {
      window.addEventListener('scroll', handleWindowScroll, { passive: true })
      window.addEventListener('resize', handleWindowScroll, { passive: true })
    }

    const timer = setTimeout(() => {
      checkScrollLimits()
      if (withFloatingHeader) handleWindowScroll()
    }, 150)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleWindowScroll)
      window.removeEventListener('resize', handleWindowScroll)
      clearTimeout(timer)
    }
  }, [withFloatingHeader, withScrollButtons, topOffset])

  const isDesktop = useIsDesktop()

  return (
    <div ref={rootRef} className="table-root-wrapper" style={{ position: 'relative', width: '100%' }}>
      
      {/* Липкая копия шапки включается строго по опции */}
      {withFloatingHeader && (
        <FloatingHeader 
          tableRef={tableRef}
          scrollContainerRef={scrollContainerRef}
          isVisible={isHeaderFloating}
          // topOffset={isDesktop ? 42 : 36}
          topOffset={isDesktop ? 50 : 40}
          // -- TODO: Сделать обертку, вынести зависимость выше. Здесь должно быть это:
          // topOffset={topOffset}
          // --
        />
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={checkScrollLimits}
        className="table-scroll-container"
      >
        <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </table>
      </div>

      {showControls && (
        <div className="table-scroll-controls">
          <button
            onClick={() => handleArrowClick('left')}
            disabled={!canScrollLeft}
            type="button"
            className="table-scroll-btn"
          >
            ←
          </button>
          <button
            onClick={() => handleArrowClick('right')}
            disabled={!canScrollRight}
            type="button"
            className="table-scroll-btn"
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
