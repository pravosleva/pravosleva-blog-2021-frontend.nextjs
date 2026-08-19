import React, { useState, useEffect } from 'react'
// import { getButtonBgColor, getTextColor, getActiveBorderCSS, getActiveBgColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { getButtonBgColor, getTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils';
import { pluralize } from '~/utils/string-tools/pluralize';
import { useArticlesSearch } from '../useArticlesSearch'
import { useIsDesktop } from '~/hooks/useIsDesktop';


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
  } = useArticlesSearch()

  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [localInput, setLocalInput] = useState(query) // Локальный стейт для мгновенного ввода символов в инпут

  const isDesktop = useIsDesktop(800)
  useEffect(() => {
    if (!isDesktop) {
      setLimit(5) // Для мобилки выставляем лимит 5
    }
  }, [isDesktop])

  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // Синхронизируем локальный инпут при сбросе
  useEffect(() => {
    if (!query) setLocalInput('')
  }, [query])

  if (!isMobile) return null

  const isDarkTheme = currentTheme === 'gray' || currentTheme === 'hard-gray' || currentTheme === 'dark'
  const textColor = isDarkTheme ? '#fff' : '#000'
  const panelBg = isDarkTheme ? '#1e1e1e' : '#f9f9f9'
  // const elementBg = isDarkTheme ? '#2a2a2a' : '#ededed'

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
          borderRadius: '12px',
          backgroundColor: isDarkTheme ? '#2a2a2a' : '#ffffff',
          color: textColor,
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
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', marginRight: '12px' }}
        >
          <span style={{ fontSize: 'small', opacity: 0.6 }}>Поиск:</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {query || 'Введите ключевые слова...'}
          </span>
        </div>
        <span
          // style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '6px', backgroundColor: elementBg, color: textColor, whiteSpace: 'nowrap', flexShrink: 0 }}
          style={{ letterSpacing: '0.5px', whiteSpace: 'nowrap', fontSize: '11px', padding: '2px 6px', borderRadius: '6px', backgroundColor: getButtonBgColor({ currentTheme }), color: isDarkTheme ? '#fff' : '#000' }}
        >
          {!!totalNotes ? `${pluralize({ count: totalNotes, titles: ['находка', 'находки', 'находок'] })} 🔍` : '🔍'}
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
          zIndex: 300,
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
          // maxHeight: '80vh', // Поисковой шторке даем больше места (80%)
          backgroundColor: panelBg,
          color: textColor,
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          padding: '20px 16px 32px 16px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
          zIndex: 310,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ width: '40px', height: '4px', backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', borderRadius: '2px', margin: '0 auto 4px auto', flexShrink: 0 }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Поиск по статьям и заметкам
          </div>
          <button onClick={() => setIsOpen(false)} style={{ border: 'none', background: 'transparent', color: '#888', fontSize: '18px', cursor: 'pointer', padding: '4px' }}>✕</button>
        </div>

        {/* СПИСОК РЕЗУЛЬТАТОВ СЕРВЕРНОЙ ВЫДАЧИ */}
        <div
          style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}
        >
          {
            isLoading
            ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small' }}>
                Загрузка результатов...
              </div>
            )
            : (!!data && data?.length > 0) ? (
              data.map((note: any) => (
                <a
                  key={note._id}
                  href={`/p/${note._id}`}
                  target='_blank'
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isDarkTheme ? 'rgba(255,255,255,0.03)' : '#fff',
                    border: isDarkTheme ? '2px solid rgba(255,255,255,0.05)' : '2px solid rgba(0,0,0,0.05)',
                    textDecoration: 'none',
                    color: textColor
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px', fontWeight: 'bold',
                      color: currentTheme === 'hard-gray' || currentTheme === 'gray' ? '#39e5ac' : currentTheme === 'light' ? '#2672b6' : '#FF8E53',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,           // Задаем максимальное количество строк (2 строки)
                      WebkitBoxOrient: 'vertical',  // Указываем вертикальную ориентацию бокса
                      overflow: 'hidden',           // Скрываем все, что выходит за пределы двух строк
                    }}>
                    {note.title}
                  </div>
                  <div
                    style={{
                      fontSize: '12px', color: '#888', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,           // Задаем максимальное количество строк (1 строка)
                      WebkitBoxOrient: 'vertical',  // Указываем вертикальную ориентацию бокса
                      overflow: 'hidden',           // Скрываем все, что выходит за пределы двух строк
                    }}>
                    {note.description || 'Нет описания заметки'}
                  </div>
                </a>
              ))
            ) : query ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small' }}>Ничего не найдено. Попробуйте изменить запрос</div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: 'small', fontStyle: 'italic' }}>Введите слова для начала поиска</div>
            )}
          </div>

          {/* СЕРВЕРНАЯ ПАГИНАЦИЯ */}
          {!isLoading && totalPages > 1 && (
            <div
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '12px',
                borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', flexShrink: 0,
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? 'none' : 'auto'
              }}
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  padding: '8px 16px', fontSize: 'small', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1,
                  backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff', border: isDarkTheme ? '2px solid #444' : '2px solid #ccc', borderRadius: '8px', color: textColor }}
              >
                ← Назад
              </button>
              <span style={{ fontSize: 'small', color: '#888', fontWeight: 'bold' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  padding: '8px 16px', fontSize: 'small', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1,
                  backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff', border: isDarkTheme ? '2px solid #444' : '1px solid #ccc', borderRadius: '8px', color: textColor,
                }}
              >
                Вперед →
              </button>
            </div>
          )}

          {/* ПУБЛИЧНОЕ ПОЛЕ ВВОДА (INPUT С ДЕБАУНСОМ ЧЕРЕЗ СЕРВИС) */}
          <div
            style={{
              position: 'relative', display: 'flex', gap: '8px', flexShrink: 0,
              // marginTop: '4px',
              paddingTop: '12px',
              borderTop: isDarkTheme ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <input
              type="text"
              placeholder="Ключевые слова через пробел..."
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value)
                setQuery(e.target.value) // Вызывает дебаунс-метод сервиса
              }}
              style={{
                flex: 1,
                padding: '12px 36px 12px 12px',
                borderRadius: '8px',
                border: '2px solid',
                borderColor: isDarkTheme ? '#444' : '#ccc',
                backgroundColor: isDarkTheme ? '#2a2a2a' : '#fff',
                color: textColor,
                // fontSize: '15px',
                fontFamily: 'monospace, system-ui',
                outline: 'none',

                fontWeight: 'bold',
                // @ts-ignore
                caretShape: 'block', // Делает курсор прямоугольным
                caretColor: isDarkTheme ? '#39e5ac' : 'lightgray', // Окрашивает курсор
              }}
            />
            {localInput && (
              <button 
                onClick={() => { setLocalInput(''); reset(); }}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(calc(-50% + 6px))', border: 'none', background: 'transparent', color: '#888', fontSize: '16px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
      </div>
    </>
  )
}
