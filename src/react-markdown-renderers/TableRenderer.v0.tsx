import React, { useRef, useState, useEffect } from 'react'

export const TableRenderer = ({ children }: { children: React.ReactNode }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const [showControls, setShowControls] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollLimits = () => {
    const el = scrollContainerRef.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    // Показываем кнопки, если ширина контента больше видимой области
    const hasScroll = scrollWidth > clientWidth + 2
    setShowControls(hasScroll)

    if (hasScroll) {
      setCanScrollLeft(scrollLeft > 2)
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6)
    }
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
    })
    
    resizeObserver.observe(el)
    checkScrollLimits()

    // Небольшой таймаут на случай ленивой сборки Markdown стилей браузером
    const timer = setTimeout(checkScrollLimits, 150)

    return () => {
      resizeObserver.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return (
    /* Внешний оберточный контейнер. У него НЕ должно быть overflow, чтобы работал sticky */
    <div className="table-root-wrapper" style={{ position: 'relative', width: '100%' }}>
      
      {/* Изолированный контейнер со скроллом только для самой таблицы */}
      <div 
        ref={scrollContainerRef}
        onScroll={checkScrollLimits}
        style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}
        className="table-scroll-container"
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          {children}
        </table>
      </div>

      {/* Панель кнопок лежит вне блока скролла, поэтому CSS Sticky отработает идеально */}
      {showControls && (
        <div 
          className="table-scroll-controls"
          style={{
            position: 'sticky',
            bottom: '20px', // Всегда будет висеть в 20px от низа экрана, пока видна таблица
            marginTop: '-50px', // Смещаем контейнер кнопок визуально наверх, чтобы наложить поверх таблицы
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            padding: '10px 20px',
            pointerEvents: 'none',
            zIndex: 50,
            boxSizing: 'border-box'
          }}
        >
          <button
            onClick={() => handleArrowClick('left')}
            disabled={!canScrollLeft}
            type="button"
            className="table-scroll-btn"
            style={{ pointerEvents: 'auto' }}
          >
            ←
          </button>
          <button
            onClick={() => handleArrowClick('right')}
            disabled={!canScrollRight}
            type="button"
            className="table-scroll-btn"
            style={{ pointerEvents: 'auto' }}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
