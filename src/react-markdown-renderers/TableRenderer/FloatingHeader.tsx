import React, { useRef, useState, useEffect } from 'react'
// import { useIsDesktop } from '~/hooks/useIsDesktop'

interface FloatingHeaderProps {
  tableRef: React.RefObject<HTMLTableElement | null>;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  topOffset?: number;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  tableRef,
  scrollContainerRef,
  isVisible,
  topOffset = 0,
}) => {
  const headerScrollRef = useRef<HTMLDivElement>(null)
  const [colWidths, setColWidths] = useState<number[]>([])

  const measureColumns = () => {
    const originalTable = tableRef.current
    if (!originalTable) return

    const originalThs = originalTable.querySelectorAll('thead th')
    const widths: number[] = []

    originalThs.forEach((th) => {
      widths.push(th.getBoundingClientRect().width)
    })

    setColWidths(widths)
  }

  const syncHorizontalScroll = () => {
    const mainContainer = scrollContainerRef.current
    const headerContainer = headerScrollRef.current
    if (mainContainer && headerContainer) {
      headerContainer.scrollLeft = mainContainer.scrollLeft
    }
  }

  // const isDesktop = useIsDesktop()

  // 1. Синхронизация горизонтального скролла
  useEffect(() => {
    const mainContainer = scrollContainerRef.current
    if (!mainContainer) return

    const handleScroll = () => {
      syncHorizontalScroll()
    }

    mainContainer.addEventListener('scroll', handleScroll, { passive: true })
    return () => mainContainer.removeEventListener('scroll', handleScroll)
  }, [scrollContainerRef])

  // 2. Измеряем колонки строго тогда, когда шапка реально должна стать видимой
  useEffect(() => {
    if (!isVisible) return

    measureColumns()
    // Мгновенно выравниваем скролл в момент появления
    requestAnimationFrame(syncHorizontalScroll)

    const resizeObserver = new ResizeObserver(() => {
      measureColumns()
      syncHorizontalScroll()
    })

    if (tableRef.current) {
      resizeObserver.observe(tableRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [isVisible, tableRef])

  // Безопасно вытаскиваем оригинальный thead
  const originalThead = tableRef.current?.querySelector('thead')

  // Если оригинальной таблицы или thead еще нет в DOM (например, при первой загрузке страницы), 
  // возвращаем пустой невидимый контейнер, чтобы не падать с ошибкой
  if (!originalThead || !scrollContainerRef.current) {
    return <div className="table-floating-header-wrapper is-hidden" style={{ display: 'none' }} />
  }

  const totalTableWidth = colWidths.reduce((sum, w) => sum + w, 0)

  return (
    <div
      className={`table-floating-header-wrapper ${isVisible ? 'is-visible' : 'is-hidden'}`}
      style={{
        position: 'fixed',
        top: `${topOffset}px`,
        left: scrollContainerRef.current.getBoundingClientRect().left,
        width: `${scrollContainerRef.current.clientWidth}px`,
        zIndex: 6, // isDesktop ? 6 : 4,
        borderLeft: '1px solid lightgray',
        borderRight: '1px solid lightgray',
        borderTop: '1px solid lightgray',
        // borderTopLeftRadius: '8px',
        // borderTopRightRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        // backgroundColor: '#f1f3f5',
        transition: 'opacity 0.2s ease, transform 0.2s ease, visibility 0.2s',
        boxSizing: 'content-box',
      }}
    >
      {/* 
        Рендерим внутреннее содержимое таблицы ТОЛЬКО еслиisVisible === true.
        Это предотвращает ложные появления шапки вверху экрана до того, 
        как оригинальная таблица доехала до верха страницы.
      */}
      {isVisible && (
        <div
          ref={headerScrollRef}
          style={{
            width: '100%',
            overflowX: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <table
            style={{
              tableLayout: 'fixed',
              width: totalTableWidth ? `${totalTableWidth}px` : 'auto',
              borderCollapse: 'collapse',
            }}
          >
            <colgroup>
              {colWidths.map((width, idx) => (
                <col key={idx} style={{ width: `${width}px` }} />
              ))}
            </colgroup>
            
            <thead dangerouslySetInnerHTML={{ __html: originalThead.innerHTML }} />
          </table>
        </div>
      )}
    </div>
  )
}
