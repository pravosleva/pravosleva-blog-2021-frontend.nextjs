import React, { useState, useEffect, useMemo } from 'react'
import { useHeadingsNavigation } from './hooks'
import clsx from 'clsx';

interface HeadingsQuickNavProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
  currentTheme: string;
}

export const HeadingsQuickNav: React.FC<HeadingsQuickNavProps> = ({
  levels,
  pageLimit,
  currentTheme
}) => {
  const {
    visibleItems,
    currentPage,
    totalPages,
    setCurrentPage,
    handleScrollTo,
    getHeadingColor,
    getBgColor,
    getTextColor,
  } = useHeadingsNavigation({ levels, pageLimit })

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])
  const textColor = getTextColor({ currentTheme })
  const bgColor = getBgColor({ currentTheme })

  // Если не десктоп или контента нет — скрываем десктопную плашку
  if (!isDesktop || visibleItems.length === 0) return null

  return (
    <div
      className={clsx('headings-quick-nav-panel-desktop', 'fadeIn')}
      style={{
        position: 'fixed',
        left: '24px', // Позиционируем строго СЛЕВА экрана
        top: '120px',
        width: '280px',
        maxHeight: '70vh',
        overflowY: 'auto',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: bgColor,
        color: textColor,
        backdropFilter: 'blur(8px)',
        border: '2px solid lightgray',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
        fontSize: 'small',
      }}
    >
      <div style={{ fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Содержание страницы
      </div>

      {visibleItems.map((heading, idx) => (
        // <button
        //   key={heading.id}
        //   onClick={() => handleScrollTo(heading.id)}
        //   style={{
        //     textAlign: 'left',
        //     padding: '0px',
        //     display: 'flex',
        //     flexDirection: 'row',
        //     alignItems: 'center',
        //     fontFamily: 'system-ui, monospace, Courier, Courier New',
        //     border: 'none',
        //     backgroundColor: bgColor,
        //     color: getHeadingColor({ item: heading, idx, currentTheme }),
        //     cursor: 'pointer',
        //     fontWeight: 'bold',
        //     transition: 'all 0.15s ease',
        //     overflow: 'hidden',
        //     textOverflow: 'ellipsis',
        //     whiteSpace: 'nowrap',
        //   }}
        //   title={heading.text}
        // >
        //   <span style={{ whiteSpace: 'pre', fontFamily: heading.levelDiff > 0 ? 'monospace, Courier' : 'inherit' }}>
        //     {heading.prefix}{heading.text}
        //   </span>
        // </button>
        <button
          key={heading.id}
          onClick={() => handleScrollTo(heading.id)}
          style={{
            textAlign: 'left',
            padding: '0px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            fontFamily: 'system-ui, monospace, Courier, Courier New',
            border: 'none',
            backgroundColor: 'transparent',
            color: getHeadingColor({ item: heading, idx, currentTheme }),
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.15s ease',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={heading.text}
        >
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'pre',
              fontFamily: 'monospace, Courier, Courier New, monospace',
            }}>
            {heading.prefix}{heading.text}
          </span>
        </button>
      ))}

      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className={clsx({
              'backdrop-blur--lite': currentTheme === 'dark' || currentTheme === 'gray' || currentTheme === 'hard-gray',
            })}
            style={{
              padding: '4px 8px',
              fontSize: 'small',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.3 : 1,
              borderRadius: '8px',
              border: '2px solid lightgray',
              backgroundColor: bgColor,
              color: currentTheme === 'dark'
              ? '#fff'
              : currentTheme === 'hard-gray'
                ? '#fff'
                : '#000',
            }}
          >
            ← Назад
          </button>

          <span style={{ fontSize: 'small', color: textColor, fontWeight: 'bold', opacity: 0.5 }}>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className={clsx({
              'backdrop-blur--lite': currentTheme === 'dark' || currentTheme === 'gray' || currentTheme === 'hard-gray',
            })}
            style={{
              padding: '4px 8px',
              fontSize: 'small',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.3 : 1,
              borderRadius: '8px',
              border: '2px solid lightgray',
              backgroundColor: bgColor,
              color: currentTheme === 'dark'
              ? '#fff'
              : currentTheme === 'hard-gray'
                ? '#fff'
                : '#000',
            }}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  )
}
