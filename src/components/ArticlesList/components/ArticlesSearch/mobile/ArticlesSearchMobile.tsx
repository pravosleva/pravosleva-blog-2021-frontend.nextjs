import React, { useState, useEffect, useRef } from 'react'
import { getLabelBgColor, getWidgetAccentColor, getWidgetBgCSS, getWidgetBorderCSS } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { pluralize } from '~/utils/string-tools/pluralize'
import { useArticlesSearch } from '../useArticlesSearch'
import { useIsDesktop } from '~/hooks/useIsDesktop'
import { NCodeSamplesSpace } from '~/types'
import CloseIcon from '@mui/icons-material/Close'

interface ArticlesSearchMobileProps {
  currentTheme: string;
}

export const ArticlesSearchMobile = ({ currentTheme }: ArticlesSearchMobileProps) => {
  const {
    query,
    data,
    isLoading,
    currentPage,
    totalPages,
    totalNotes,
    setQuery,
    setCurrentPage,
    setLimit,
    reset,
    close,
  } = useArticlesSearch()

  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [localInput, setLocalInput] = useState(query)

  // --- Нативная механика свайпа вниз (Drag-to-close) ---
  const [translateY, setTranslateY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartY = useRef(0)
  const currentTransformY = useRef(0)

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // Берем координату первого прикоснувшегося пальца [0]
    touchStartY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    // ИСПРАВЛЕНО: Добавлен индекс [0] для обращения к объекту Touch
    const currentY = e.touches[0].clientY
    const deltaY = currentY - touchStartY.current

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

  // --- Эффект блокировки внешнего скролла ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; 
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  const isDesktop = useIsDesktop(800)
  useEffect(() => {
    if (!isDesktop) {
      setLimit(5)
    }
  }, [isDesktop])

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  useEffect(() => {
    if (!query) setLocalInput('')
  }, [query])

  const getLink = (id: string) => {
    return `/p/${id}`
  }

  if (!isMobile) return null

  const isDarkTheme = currentTheme === 'gray' || currentTheme === 'hard-gray' || currentTheme === 'dark'
  const accentTextColor = getWidgetAccentColor({ currentTheme })
  const panelBg = isDarkTheme ? '#1e1e1e' : '#f9f9f9'

  const handleColor = isDarkTheme ? 'gray' : 'lightgray'
  const widgetBorderCSS = getWidgetBorderCSS({ currentTheme })
  const widgetBgCSS = getWidgetBgCSS({ currentTheme })

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
          backgroundColor: widgetBgCSS,
          color: accentTextColor,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          border: widgetBorderCSS,
          backdropFilter: 'blur(10px)',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: '12px' }}>
          <span style={{ fontSize: 'small', opacity: 0.6 }}>Поиск:</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {query || 'Введите ключевые слова...'}
          </span>
        </div>
        <span
          style={{
            letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: '11px', padding: '2px 8px', borderRadius: '6px',
            backgroundColor: getLabelBgColor({ currentTheme }),
            color: accentTextColor,
          }}
        >
          {!!totalNotes ? `${pluralize({ count: totalNotes, titles: ['находка', 'находки', 'находок'] })}` : '🔍'}
        </span>
      </div>

      {/* ================= ЗАДНИЙ ФОН (BACKDROP) ================= */}
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

      {/* ================= ВЫДВИЖНАЯ ШТОРКА ПОИСКА (BOTTOM SHEET) ================= */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100vw',
          backgroundColor: panelBg,
          color: accentTextColor,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '8px 16px 32px 16px', // Оптимизировано под тач
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          transform: isOpen 
            ? `translateY(${translateY}px)` 
            : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* ХЕНДЛЕР ЗАКРЫТИЯ (ЗОНА ДЛЯ СВАЙПА ЧЕРЕЗ СТРЕЛКУ) */}
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
          {/* ИНТЕЛЛЕКТУАЛЬНАЯ СТРЕЛКА-ЧЕРТОЧКА */}
          <div style={{ 
            position: 'relative',
            width: '36px', 
            height: '12px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Левое крыло стрелки */}
            <div style={{
              position: 'absolute',
              left: '2px',
              width: '17px',
              height: '4px',
              backgroundColor: handleColor,
              borderRadius: '2px',
              transition: 'transform 0.2s ease',
              // Когда тянем — плавно сгибаем левую часть вниз под углом 25 градусов
              transform: isDragging 
                ? 'rotate(25deg) translateX(1px)' 
                : 'rotate(0deg)',
            }} />
            
            {/* Правое крыло стрелки */}
            <div style={{
              position: 'absolute',
              right: '2px',
              width: '17px',
              height: '4px',
              backgroundColor: handleColor,
              borderRadius: '2px',
              transition: 'transform 0.2s ease',
              // Когда тянем — плавно сгибаем правую часть вниз под углом -25 градусов
              transform: isDragging 
                ? 'rotate(-25deg) translateX(-1px)' 
                : 'rotate(0deg)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 'x-small', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Поиск
            </div>
          </div>
        </div>

        {/* СПИСОК РЕЗУЛЬТАТОВ */}
        <div
          style={{ flex: 1, overflowY: 'auto', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', touchAction: 'pan-y' }}
          className='mobile-search-result-items-wrapper'
        >
          {isLoading ? (
            <div style={{ textTransform: 'none', textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small', fontStyle: 'italic' }}>
              Загрузка результатов...
            </div>
          ) : (!!data && data?.length > 0) ? (
            data.map((note: { original: NCodeSamplesSpace.TNote; slug: string; }) => (
              <a
                key={note.original._id}
                href={getLink(note.slug || note.original._id)}
                target='_blank'
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  padding: '12px',
                  // borderRadius: '8px',
                  backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.03)' : '#fff',
                  border: isDarkTheme ? '2px solid rgba(255,255,255,0.05)' : '2px solid rgba(0,0,0,0.05)',
                  textDecoration: 'none',
                  color: accentTextColor
                }}
              >
                <div style={{
                  fontSize: '14px', fontWeight: 'bold',
                  // color: currentTheme === 'hard-gray' || currentTheme === 'gray' ? '#39e5ac' : currentTheme === 'light' ? '#2672b6' : '#FF8E53',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {note.original.title}
                </div>
                <div style={{
                  fontSize: 'small', color: '#888', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}
                >
                  {note.original.description || 'Нет описания заметки'}
                </div>
              </a>
            ))
          ) : query ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small', fontStyle: 'italic' }}>Ничего не найдено. Попробуйте изменить запрос</div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small', fontStyle: 'italic' }}>Введите слова для начала поиска</div>
          )
        }
      </div>

      {/* СЕРВЕРНАЯ ПАГИНАЦИЯ */}
      {!isLoading && totalPages > 1 && (
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px',
        // borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
        flexShrink: 0,
        opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto'
      }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{
          padding: '8px 16px', fontSize: 'small', fontWeight: 'bold', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1,
          backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff',
          border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '24px', color: accentTextColor
        }}
          >
          ← Назад</button>

        <span style={{ fontSize: 'small', color: '#888', fontWeight: 'bold' }}>
        {currentPage} / {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
          padding: '8px 16px', fontSize: 'small', fontWeight: 'bold', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1,
          backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff',
          border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '24px', color: accentTextColor,
          }}
          >
          Вперед →</button>
      </div>
    )}

    {/* ПУБЛИЧНОЕ ПОЛЕ ВВОДА */}
    <div style={{
      position: 'relative', display: 'flex', gap: '8px', flexShrink: 0, marginTop: '16px',
      // borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
    }}>
      <input
        type="text"
        placeholder="Ключевые слова через пробел..."
        value={localInput}
        onChange={(e) => {
        setLocalInput(e.target.value)
        setQuery(e.target.value)
        }}
        style={{
        flex: 1, padding: '12px 36px 12px 12px', borderRadius: '24px', border: '2px solid',
        borderColor: isDarkTheme ? '#444' : '#ccc', backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff',
        color: accentTextColor, fontFamily: 'monospace, system-ui', outline: 'none', fontWeight: 'bold',
        }}
      />
      {localInput && (
        <button
          onClick={() => {
          setLocalInput('');
          reset();
          close();
          }}
          style={{
            position: 'absolute',
            right: '5px',
            top: '50%',
            transform: 'translateY(-50%)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            
            background: 'transparent',
            color: '#888',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          <CloseIcon fontSize='small' />
        </button>
      )}
    </div>
  </div>
</>
)}
