import React, { useState, useEffect, useRef } from 'react'
import { useHeadingsNavigation } from './hooks'
import { getWidgetBorderCSS } from './utils/getWidgetBorderCSS';
import { getWidgetBgCSS } from './utils';

interface HeadingsQuickNavMobileProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
  currentTheme: string;
  actualSlug: string;
}

export const HeadingsQuickNavMobile: React.FC<HeadingsQuickNavMobileProps> = ({
  levels,
  pageLimit = 4,
  currentTheme,
  actualSlug
}) => {
  const {
    headings,
    visibleItems,
    currentPage,
    totalPages,
    setCurrentPage,
    handleScrollTo,
    getHeadingButtonColor,
    getLabelBgColor,
    getFabTriggerTextColor,
    getActiveBorderCSS,
    getActiveBgColor,
  } = useHeadingsNavigation({
    levels, pageLimit, actualSlug,
    ignoreSelectors: ['.article-alert', '.notice-block', '.info-banner']
  })

  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // --- Нативная механика свайпа вниз (Drag-to-close) ---
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartY = useRef(0)
  const currentTransformY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY // Исправлено: строгое извлечение первого тача
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY // Исправлено: строгое извлечение первого тача
    const deltaY = currentY - touchStartY.current

    // Тянуть разрешено только вниз
    if (deltaY > 0) {
      setTranslateY(deltaY)
      currentTransformY.current = deltaY
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (currentTransformY.current > 120) {
      setIsOpen(false)
    }
    setTranslateY(0)
    currentTransformY.current = 0
  }

  // --- Эффект фиксации и блокировки внешнего скролла ---
  useEffect(() => {
    if (typeof window === 'undefined') return

    const originalStyle = window.getComputedStyle(document.body).overflow

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
    } else {
      document.body.style.overflow = originalStyle
      document.body.style.touchAction = ''
    }

    return () => {
      document.body.style.overflow = originalStyle
      document.body.style.touchAction = ''
    }
  }, [isOpen])

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  if (!isMobile || headings.length === 0) return null

  const activeHeading = headings.find(h => h.isActiveProgress) || headings[0]
  const isDarkTheme = currentTheme === 'gray' || currentTheme === 'hard-gray' || currentTheme === 'dark'
  
  const summaryBoxBg = getWidgetBgCSS({ currentTheme })

  const handleColor = isDarkTheme ? 'gray' : 'lightgray'
  const widgetBorderCSS = getWidgetBorderCSS({ currentTheme })

  return (
    <>
      {/* ================= КНОПКА-ПЛАШКА СНИЗУ ЭКРАНА ================= */}
      <div
        className='fade-in-effect'
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '400px',
          padding: '12px 16px',
          borderRadius: '24px',
          backgroundColor: summaryBoxBg,
          color: getFabTriggerTextColor({ currentTheme }),
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          border: widgetBorderCSS,
          backdropFilter: 'blur(10px)',
          zIndex: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: '12px' }}>
          <span style={{ fontSize: 'small', opacity: 0.6 }}>
            Содержание:
          </span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeHeading?.text}
          </span>
        </div>
        <span
          style={{
            letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
            backgroundColor: getLabelBgColor({ currentTheme }),
            color: (isDarkTheme || currentTheme === 'gray') ? '#fff' : '#000',
          }}
        >
          {currentPage} / {totalPages} ☰
        </span>
      </div>

      {/* ================= ЗАДНИЙ ФОН (ОБЛЕГЧЕННЫЙ BACKDROP) ================= */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 4,
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s',
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* ================= ВЫДВИЖНАЯ ШТОРКА (BOTTOM SHEET) ================= */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          backgroundColor: isDarkTheme ? '#1e1e1e' : '#f9f9f9',
          color: getFabTriggerTextColor({ currentTheme }),
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 16px 32px 16px', // Оптимизировано под хендлер тача
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          
          transform: isOpen ? `translateY(${translateY}px)` : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* ХЕНДЛЕР ЗАКРЫТИЯ (ЗОНА ДЛЯ СВАЙПА СО СТРЕЛКОЙ) */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            width: '100%', 
            padding: '8px 0px 8px 0px', 
            margin: '-8px 0 0 0', 
            cursor: 'grab', 
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* УМНАЯ СТРЕЛКА ОГЛАВЛЕНИЯ */}
          <div style={{ 
            position: 'relative',
            width: '36px', 
            height: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Левый сегмент */}
            <div style={{
              position: 'absolute',
              left: '2px',
              width: '17px',
              height: '4px',
              backgroundColor: handleColor,
              borderRadius: '2px',
              transition: 'transform 0.2s ease',
              transform: isDragging ? 'rotate(25deg) translateX(1px)' : 'rotate(0deg)',
            }} />
            
            {/* Правый сегмент */}
            <div style={{
              position: 'absolute',
              right: '2px',
              width: '17px',
              height: '4px',
              backgroundColor: handleColor,
              borderRadius: '2px',
              transition: 'transform 0.2s ease',
              transform: isDragging ? 'rotate(-25deg) translateX(-1px)' : 'rotate(0deg)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 'x-small', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Содержание
            </div>
          </div>
        </div>

        {/* Список заголовков (Разрешен внутренний тач-скролл) */}
        <div
          style={{ flex: 1, overflowY: 'auto', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', touchAction: 'pan-y' }}
        >
          {visibleItems.map((heading, idx) => (
            <button
              key={heading.id}
              onClick={() => {
                handleScrollTo(heading.id)
                setIsOpen(false)
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                fontSize: 'small',
                borderRadius: '8px',
                border: heading.isActiveProgress ? getActiveBorderCSS({ currentTheme }) : '1px solid transparent',
                paddingLeft: '12px', 
                backgroundColor: heading.isActiveProgress 
                  ? getActiveBgColor({ currentTheme })
                  : heading.isVisible
                    ? getLabelBgColor({ currentTheme })
                    : 'transparent',
                color: getHeadingButtonColor({ item: heading, idx, currentTheme }),
                fontWeight: 'bold',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                background: 'none',
                cursor: 'pointer'
              }}
              title={heading.text}
            >
              <span style={{ whiteSpace: 'pre', fontFamily: 'monospace, Courier' }}>
                {heading.prefix}{heading.text}
              </span>
            </button>
            ))
          }
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '0px',
          // borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0 }}>
            <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            style={{ padding: '8px 16px', fontSize: 'small', fontWeight: 'bold', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff',
              border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '24px', color: getFabTriggerTextColor({ currentTheme }) }}
            >
            ← Назад</button>

            <span style={{ fontSize: 'small', color: '#888', fontWeight: 'bold' }}>
            {currentPage} / {totalPages}</span>

            <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            style={{ padding: '8px 16px', fontSize: 'small', fontWeight: 'bold', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1, backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff', border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '24px', color: getFabTriggerTextColor({ currentTheme }) }}
            >
            Вперед →</button>
          </div>
        )}
      </div>

    </>
  )
}