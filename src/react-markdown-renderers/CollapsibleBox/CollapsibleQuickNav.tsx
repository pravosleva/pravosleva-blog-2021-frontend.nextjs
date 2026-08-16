import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { IRootState } from '~/store/IRootState'
import { collapsibleRegistrySignal, useSignalValue, ICollapsibleItem } from '~/store/reactiveCollapsibleStore'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import clsx from 'clsx'

const standardDesktopOffsetTop = 50 + 16
interface CollapsibleQuickNavProps {
  pageLimit?: number; // Опциональный лимит кнопок на одной странице меню (например, 5)
}

export const CollapsibleQuickNav: React.FC<CollapsibleQuickNavProps> = ({ 
  pageLimit = 5 // По умолчанию показываем по 5 элементов, если проп не передан
}) => {
  // Подписываемся на изменения глобального реактивного сигнала реестра блоков
  const registry = useSignalValue<Record<string, ICollapsibleItem>>(collapsibleRegistrySignal)
  const [isDesktop, setIsDesktop] = useState(false)
  // Локальный стейт для текущей страницы пагинации (1-indexed)
  const [currentPage, setCurrentPage] = useState(1)
  
  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: 200,
  }))

  // Получаем упорядоченный массив всех зарегистрированных блоков
  const items = useMemo(() => Object.values(registry), [registry])

  // Расчет общего количества страниц
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / pageLimit)
  }, [items.length, pageLimit])

  // АВТО-ПАГИНАЦИЯ ПРИ СКРОЛЛЕ СТРАНИЦЫ
  // Следим за изменением статуса видимости блоков. Если первый видимый элемент 
  // находится на другой странице пагинации — принудительно переключаем её.
  useEffect(() => {
    if (items.length === 0) return

    // Находим индекс самого первого элемента, который сейчас виден на экране (isVisible === true)
    const firstVisibleIndex = items.findIndex(item => item.isVisible)

    if (firstVisibleIndex !== -1) {
      // Вычисляем, на какую страницу пагинации попадает этот элемент (1, 2, 3...)
      const targetPage = Math.floor(firstVisibleIndex / pageLimit) + 1
      
      // Переключаем страницу, только если она отличается от текущей
      setCurrentPage(targetPage)
    }
  }, [items, pageLimit])

  // Отслеживание ширины экрана
  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // const items = Object.values(registry)

  // Срез элементов, которые нужно отрендерить на текущей странице пагинации
  const startIndex = (currentPage - 1) * pageLimit
  const visibleItems = items.slice(startIndex, startIndex + pageLimit)
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const bgColor = useMemo(() => {
    switch (currentTheme) {
      case 'light':
        return '#ededed'
      case 'gray':
        return '#ededed'
      case 'hard-gray':
        return 'gray'
      case 'dark':
        return 'rgba(255, 255, 255, 0.1)'
      default:
        return '#fff'
    }
  }, [currentTheme])
  const textColor = useMemo(() => {
    switch (currentTheme) {
      case 'light':
        return '#000'
      case 'gray':
        return 'inherit'
      case 'hard-gray':
        return '#fff'
      case 'dark':
        return 'inherit'
      default:
        return '#000'
    }
  }, [currentTheme])

  // --- НОВОЕ УСЛОВИЕ: ВСЕ ЛИ КНОПКИ НА ТЕКУЩЕЙ СТРАНИЦЕ НЕАКТИВНЫ (ВИДИМЫ)? ---
  const shouldHidePanel = useMemo(() => {
    if (visibleItems.length === 0) return false
    // Метод .every вернет true, только если абсолютно у всех элементов таблицы isVisible === true
    return visibleItems.every(item => item.isVisible)
  }, [visibleItems])
  
  // Если не десктоп или на странице нет ни одного CollapsibleBox — ничего не рендерим
  if (!isDesktop || items.length === 0) return null

  return (
    <div
      className="collapsible-quick-nav-panel"
      style={{
        position: 'fixed',
        right: '24px',
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
        backdropFilter: 'blur(8px)',
        border: '2px solid lightgray',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)',

        // --- ДИНАМИЧЕСКОЕ СМЕЩЕНИЕ НАВЕРХ ---
        // Переключаем top, opacity и visibility для красивого уезда за экран
        top: shouldHidePanel ? '-500px' : '120px',
        opacity: shouldHidePanel ? 0 : 1,
        visibility: shouldHidePanel ? 'hidden' : 'visible',
        
        // Плавный переход для всех изменяемых свойств позиционирования
        transition: 'top 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, visibility 0.3s',
      }}
    >
      {/* <div style={{ fontSize: 'small', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        Навигация по блокам
      </div> */}
      
      {visibleItems.map((item) => (
        <button
          // size='small'
          // variant='contained'
          // color='primary'
          key={item.id}
          // disabled={item.isVisible}
          onClick={() => {
            try {
              scrollToIdRef.current({ 
                id: item.id,
                _cfg: {
                  getOffsetTop: ({ targetElm }) => {
                    // НАДЕЖНЫЙ АБСОЛЮТНЫЙ РАСЧЕТ позиции элемента на странице с нуля
                    let absoluteTop = 0
                    let currentElm: HTMLElement | null = targetElm
                    while (currentElm) {
                      absoluteTop += currentElm.offsetTop
                      currentElm = currentElm.offsetParent as HTMLElement | null
                    }

                    const elementHeight = targetElm.offsetHeight
                    
                    // Если блок свернут (меньше 200px)
                    if (elementHeight <= 200) {
                      const windowHeight = window.innerHeight
                      // Вычисляем офсет сверху так, чтобы после вычитания в window.scrollTo 
                      // элемент оказался ровно по центру экрана
                      const targetCenterPos = absoluteTop - (windowHeight / 2) + (elementHeight / 2)
                      
                      // Нам нужно вернуть такое число, которое при вычитании из (getBoundingClientRect().top + pageYOffset)
                      // даст точно targetCenterPos. 
                      // Так как (getBoundingClientRect().top + pageYOffset) всегда равен нашему absoluteTop,
                      // то специальный офсет равен:
                      return absoluteTop - targetCenterPos
                    }
                    
                    return standardDesktopOffsetTop // Стандартный отступ для больших блоков
                  }
                }
              })
            } catch (e) {
              console.error(e)
            }
          }}
          className={clsx({
            'backdrop-blur--lite': currentTheme === 'dark' || currentTheme === 'gray' || currentTheme === 'hard-gray',
          })}
          style={{
            textAlign: 'left',
            padding: '8px 12px',
            fontSize: 'small',
            borderRadius: '8px',
            border: item.isVisible ? '2px solid transparent' : '2px solid lightgray',
            backgroundColor: bgColor,
            color:
              currentTheme === 'dark'
              ? (item.isVisible ? '#FF8E53' : '#fff')
              : currentTheme === 'hard-gray'
                ? (item.isVisible ? '#FF8E53' : '#fff')
              : currentTheme === 'gray'
                ? item.isVisible ? '#39e5ac' : '#000'
              : item.isVisible ? '#FF8E53' : '#000',
            // opacity: item.isVisible ? 0.5 : 1,
            pointerEvents: item.isVisible ? 'none' : 'auto', 
            cursor: item.isVisible ? 'not-allowed' : 'pointer',

            // fontWeight: item.isVisible ? 'normal' : 'bold',
            fontWeight : 'bold',
            transition: 'all 0.15s ease',
            boxShadow: item.isVisible ? 'none' : '0 2px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            // textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          title={item.header}
        >
          {item.header}
        </button>
      ))}

      {/* ПОДВАЛ ПАГИНАЦИИ (Отображается, только если страниц больше одной) */}
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
              backgroundColor: bgColor,
              border: '2px solid lightgray',
              borderRadius: '8px',
              letterSpacing: '0.5px',

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
              fontSize: '11px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.3 : 1,
              backgroundColor: bgColor,
              border: '2px solid lightgray',
              borderRadius: '8px',
              letterSpacing: '0.5px',

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
