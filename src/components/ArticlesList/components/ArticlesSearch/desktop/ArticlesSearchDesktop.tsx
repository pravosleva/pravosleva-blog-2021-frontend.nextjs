import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import { useArticlesSearch } from '../useArticlesSearch' // Наш хук
import { TThemeName } from '~/hooks/useGlobalTheming'
import { getLoaderColorByThemeName } from '@/utils/globalTheme/getLoaderColorByThemeName'
import { pluralize } from '~/utils/string-tools/pluralize' // Наша функция склонений
import { useIsDesktop } from '~/hooks/useIsDesktop'
import { getCounterBadgeBgColor, getCounterBadgeTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'

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

const getPanelBgColor = (themeName: TThemeName) => {
  return themeName === 'dark' || themeName === 'hard-gray' || themeName === 'gray' ? '#1e1e1e' : '#f9f9f9'
}

const getPanelTextColor = (themeName: TThemeName) => {
  return themeName === 'dark' || themeName === 'hard-gray' || themeName === 'gray' ? '#fff' : '#000'
}

const getCardBgColor = (themeName: TThemeName) => {
  return themeName === 'dark' || themeName === 'hard-gray' || themeName === 'gray' ? 'rgba(255,255,255,0.03)' : '#fff'
}

/* ================= СТИЛИ КНОПКИ СНИЗУ (НАД SCROLL TOP) ================= */
type TTriggerProps = {
  themeName: TThemeName
  isShowed: boolean
}

const StyledSearchTriggerBtn = styled('div')<TTriggerProps>`
  position: fixed;
  z-index: 3;
  right: 32px;
  // Высота ScrollTopBtn (56px) + её bottom (76px) + зазор (16px) = 148px
  bottom: 148px; 
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
  
  // Анимация появления/скрытия
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(100px);
  
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

/* ================= СТИЛИ ВЫЕЗЖАЮЩЕЙ ПАНЕЛИ ПОИСКА ================= */
type TPanelProps = {
  themeName: TThemeName
  isOpen: boolean
}

const SlidingSearchPanel = styled('div')<TPanelProps>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 420px; /* Фиксированная высота для десктопного дока */
  z-index: 201;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  box-sizing: border-box;
  
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(100%);

  ${(p) =>
    p.isOpen &&
    css`
      transform: translateY(0);
    `}

  ${({ themeName }) =>
    css`
      background-color: ${getPanelBgColor(themeName)};
      color: ${getPanelTextColor(themeName)};
      border-top-color: ${themeName === 'dark' || themeName === 'hard-gray' || themeName === 'gray' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
    `}
`

/* ================= СТИЛИ БЭЙДЖА СЧЕТЧИКА НАХОДОК ================= */
type TBadgeProps = {
  themeName: TThemeName
}

const SearchCountBadge = styled('span')<TBadgeProps>`
  position: absolute;
  // Смещаем бэйдж на верхний правый край кнопки
  top: 0px;
  right: 0px;
  
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 4; /* Гарантируем, что бэйдж будет поверх иконки лупы */
  
  animation: popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${({ themeName }) => {
    const isDark = themeName === 'gray' || themeName === 'hard-gray' || themeName === 'dark'
    return css`
      // background-color: ${isDark ? '#fff' : '#2a2a2a'};
      // color: ${isDark ? '#000' : '#fff'};
      background-color: ${getCounterBadgeBgColor({ currentTheme: themeName })};
      color: ${getCounterBadgeTextColor({ currentTheme: themeName })};
    `
  }}

  @keyframes popIn {
    0% { transform: scale(0); }
    100% { transform: scale(1); }
  }
`

/* ================= ОСНОВНОЙ КОМПОНЕНТ ================= */
interface ArticlesSearchDesktopProps {
  currentTheme: TThemeName
}

export const ArticlesSearchDesktop: React.FC<ArticlesSearchDesktopProps> = ({ currentTheme }) => {
  const {
    query,
    results,
    isLoading,
    currentPage,
    totalPages,
    totalNotes,
    setQuery,
    setCurrentPage,
    setLimit,
    reset,
    isSearchPanelOpen,
    setIsSearchPanelOpen,
  } = useArticlesSearch()

  const isDesktop = useIsDesktop(800)

  useEffect(() => {
    if (isDesktop) setLimit(10) // Для десктопа выставляем лимит 10
  }, [isDesktop])

  // const [isOpen, setIsOpen] = useState(false)
  const [localInput, setLocalInput] = useState(query)

  // 1. Адаптив: инициализируем только для десктопа (экраны >= 800px)
  // useEffect(() => {
  //   const checkWidth = () => setIsDesktop(window.innerWidth >= 800)
  //   checkWidth()
  //   window.addEventListener('resize', checkWidth, { passive: true })
  //   return () => window.removeEventListener('resize', checkWidth)
  // }, [])

  const isDark = currentTheme === 'gray' || currentTheme === 'hard-gray' || currentTheme === 'dark'
  // Кнопка триггера задвигается (transform: translateX), когда открыта сама панель
  const isTriggerVisible = !isSearchPanelOpen

  // Формируем красивую подсказку при наведении на кнопку
  const triggerTitle = query && totalNotes > 0
  ? `Поиск активен. Найдено заметок: ${totalNotes} по запросу "${query}"`
  : "Открыть поиск по заметкам"

  // Если это мобилка — хук вернет false, и компонент безопасно проигнорирует рендер десктопной разметки
  if (!isDesktop) return null

  return (
    <>
      {/* КНОПКА ТРИГГЕРА ВЫЗОВА (Находится на 16px выше кнопки ScrollTopBtn) */}
      <StyledSearchTriggerBtn
        onClick={() => setIsSearchPanelOpen(true)}
        isShowed={isTriggerVisible}
        themeName={currentTheme}
        title={triggerTitle} // Динамическая подсказка
      >
        <SearchIcon fontSize='medium' />
        {/* ДОБАВЛЕНО: Компактный бэйдж-счетчик */}
        {query && totalNotes > 0 && (
          <SearchCountBadge themeName={currentTheme}>
            {totalNotes > 99 ? '99+' : totalNotes}
          </SearchCountBadge>
        )}
      </StyledSearchTriggerBtn>

      {/* ВЫДВИЖНАЯ ПАНЕЛИ ПОИСКА */}
      <SlidingSearchPanel isOpen={isSearchPanelOpen} themeName={currentTheme}>
        
        {/* Шапка дока */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#888', letterSpacing: '1px' }}>
              Поиск по заметкам и статьям
            </span>
            {query && !isLoading && (
              <span style={{ fontSize: '12px', opacity: 0.8, backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                {pluralize({ count: totalNotes, titles: ['находка', 'находки', 'находок'] })}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsSearchPanelOpen(false)}
            style={{ border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Контейнер инпута */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '600px', marginBottom: '20px', flexShrink: 0 }}>
          <input
            type="text"
            placeholder="Ключевые слова через пробел..."
            value={localInput}
            onChange={(e) => {
              const val = e.target.value
              setLocalInput(val)
              setQuery(val)
            }}
            style={{
              width: '100%',
              padding: '12px 40px 12px 14px',
              borderRadius: '8px',
              fontSize: '16px',
              border: '1px solid',
              borderColor: isDark ? '#444' : '#ccc',
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              color: getPanelTextColor(currentTheme),
              outline: 'none',
              boxSizing: 'border-box',
              
              fontWeight: 'bold',
              fontFamily: 'monospace, system-ui',
              // @ts-ignore
              caretShape: 'block', // Делает курсор прямоугольным
              caretColor: isDark ? '#39e5ac' : 'lightgray', // Окрашивает курсор
            }}
          />
          {localInput && (
            <button
              onClick={() => {
                setLocalInput('')
                reset()
              }}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(calc(-50% + 4px))', border: 'none', background: 'transparent', color: '#888', cursor: 'pointer', padding: 0 }}
            >
              <CloseIcon fontSize="small" />
            </button>
          )}
        </div>

        {/* Сетка/Список результатов */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '16px' }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Синхронизация результатов...</div>
          ) : (!!results && results.length > 0) ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {results.map((note) => (
                <a
                  key={note._id}
                  href={`/p/${note._id}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '14px',
                    borderRadius: '8px',
                    backgroundColor: getCardBgColor(currentTheme),
                    border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
                    textDecoration: 'none',
                    color: getPanelTextColor(currentTheme),
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: currentTheme === 'hard-gray' || currentTheme === 'gray' ? '#39e5ac' : '#FF8E53' }}>
                    {note.title}
                  </div>
                  {/* Обрезка строки до двух линий, как мы настроили ранее */}
                  <div style={{ fontSize: '13px', color: '#888', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.description || 'Описание отсутствует'}
                  </div>
                </a>
              ))}
            </div>
          ) : query ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '14px' }}>По вашему запросу ничего не найдено</div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '14px', fontStyle: 'italic' }}>Введите ключевые слова для поиска по базе заметок</div>
          )}
        </div>

        {/* Пагинация (Десктопная) */}
        {!isLoading && totalPages > 1 && (
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: 'auto', paddingTop: '16px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}
          >
            <button disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', fontSize: '13px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.3 : 1, backgroundColor: isDark ? '#2a2a2a' : '#fff', border: isDark ? '1px solid #444' : '1px solid #ccc', borderRadius: '6px', color: getPanelTextColor(currentTheme) }}
            >
              <ArrowBackIosIcon fontSize="inherit" style={{ marginRight: '4px' }} /> Назад
            </button>
            <span style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>Страница {currentPage} из {totalPages}</span>
            <button
              disabled={currentPage === totalPages}onClick={() => setCurrentPage(currentPage + 1)}style={{ display: 'flex', alignItems: 'center', padding: '6px 12px', fontSize: '13px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.3 : 1, backgroundColor: isDark ? '#2a2a2a' : '#fff', border: isDark ? '1px solid #444' : '1px solid #ccc', borderRadius: '6px', color: getPanelTextColor(currentTheme) }}>Вперед <ArrowForwardIosIcon fontSize="inherit" style={{ marginLeft: '4px' }} />
             </button>
          </div>
        )}
      </SlidingSearchPanel>
    </>
  )
}
