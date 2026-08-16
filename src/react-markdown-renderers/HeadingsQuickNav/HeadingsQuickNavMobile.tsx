import React, { useState, useEffect } from 'react'
import { useHeadingsNavigation } from './hooks'

interface HeadingsQuickNavMobileProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
  currentTheme: string;
}

export const HeadingsQuickNavMobile: React.FC<HeadingsQuickNavMobileProps> = ({
  levels,
  pageLimit = 4, // Для мобилки лучше уменьшить лимит до 4-5 пунктов, чтобы шторка не занимала весь экран
  currentTheme
}) => {
  const {
    headings,
    visibleItems,
    currentPage,
    totalPages,
    setCurrentPage,
    handleScrollTo,
    getHeadingColor,
    getBgColor,
    getTextColor,
    getActiveBorderCSS,
    getActiveBgColor,
  } = useHeadingsNavigation({ levels, pageLimit })

  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false) // Стейт открытия шторки меню

  // 1. Логика отображения только на мобильных экранах (< 800px)
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  if (!isMobile || headings.length === 0) return null

  // Находим текущий активный заголовок, чтобы вывести его название прямо на закрытую кнопку-плашку
  const activeHeading = headings.find(h => h.isActiveProgress) || headings[0]
  const isDarkTheme = currentTheme === 'dark' || currentTheme === 'hard-gray'

  return (
    <>
      {/* ================= КНОПКА-ПЛАШКА СНИЗУ ЭКРАНА ================= */}
      <div
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '400px',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: isDarkTheme ? '#2a2a2a' : '#ffffff',
          color: getTextColor({ currentTheme }),
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          border: isDarkTheme ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(10px)',
          zIndex: 290,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          // fontSize: '14px',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: '12px' }}>
          <span style={{ fontSize: 'small', opacity: 0.6 }}>Содержание:</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeHeading?.text}</span>
        </div>
        <span style={{ letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: '11px', padding: '2px 6px', borderRadius: '6px', backgroundColor: getBgColor({ currentTheme }), color: isDarkTheme ? '#fff' : '#000' }}>
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
          zIndex: 300,
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
          // maxHeight: '60vh',
          backgroundColor: isDarkTheme ? '#1e1e1e' : '#f9f9f9',
          color: getTextColor({ currentTheme }),
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '20px 16px 32px 16px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          zIndex: 310,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          
          // Анимация выезда снизу вверх
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Хэндл шторки (визуальная полоска сверху для красоты) */}
        <div style={{ width: '40px', height: '4px', backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', borderRadius: '2px', margin: '0 auto 8px auto', flexShrink: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', /* marginBottom: '4px' */ }}>
          <div style={{ fontSize: 'small', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Содержание статьи
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ border: 'none', background: 'transparent', color: '#888', fontSize: '18px', cursor: 'pointer', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {/* Список заголовков */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {visibleItems.map((heading, idx) => (
            <button
              key={heading.id}
              onClick={() => {
                handleScrollTo(heading.id)
                setIsOpen(false) // Закрываем шторку после клика, чтобы пользователь видел куда приехал скролл
              }}
              style={{
                textAlign: 'left',
                padding: '10px 12px', // Чуть увеличили паддинг для удобства нажатия пальцем (Mobile Friendly)
                fontSize: 'small',
                borderRadius: '8px',
                border: heading.isActiveProgress ? getActiveBorderCSS({ currentTheme }) : '1px solid transparent',
                paddingLeft: '12px', 
                backgroundColor: heading.isActiveProgress 
                  ? getActiveBgColor({ currentTheme })
                  : heading.isVisible
                    ? getBgColor({ currentTheme })
                    : 'transparent',
                color: getHeadingColor({ item: heading, idx, currentTheme }),
                // fontWeight: heading.isActiveProgress ? 'bold' : '500',
                fontWeight: 'bold',
                transition: 'all 0.15s ease',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                background: 'none'
              }}
              title={heading.text}
            >
              <span style={{ whiteSpace: 'pre', fontFamily: heading.levelDiff > 0 ? 'monospace, Courier' : 'inherit' }}>
                {heading.prefix}{heading.text}
              </span>
            </button>
          ))}
        </div>

        {/* Пагинация (Кнопки увеличены под тач-интерфейсы) */}
        {totalPages > 1 && (
          <div
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: '8px', 
              paddingTop: '16px', 
              borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', 
              
              // ИСПРАВЛЕНО: Вместо shrink пишем flexShrink
              flexShrink: 0 
            }}
          >
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              style={{ padding: '8px 16px', fontSize: 'small', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff', border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '8px', color: getTextColor({ currentTheme }) }}
            >
              ← Назад
            </button>
            <span style={{ fontSize: 'small', color: '#888', fontWeight: 'bold' }}>
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              style={{ 
                padding: '8px 16px', 
                fontSize: 'small', 
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
                opacity: currentPage === totalPages ? 0.3 : 1, 
                // ИСПРАВЛЕНО: Убрана синтаксическая ошибка в тернарнике фона
                backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff', 
                border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', 
                borderRadius: '8px', 
                color: getTextColor({ currentTheme }) 
              }}
            >
              Вперед →
            </button>
          </div>
        )}
      </div>
    </>
  )
}
