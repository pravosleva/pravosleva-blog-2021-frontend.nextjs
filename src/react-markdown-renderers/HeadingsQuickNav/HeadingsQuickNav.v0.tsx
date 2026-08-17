import { Button } from '@mui/material';
import clsx from 'clsx';
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux';
import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { IRootState } from '~/store/IRootState';
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { collapsibleEngine, headingsRegistrySignal, IHeadingStoredItem } from '~/store/reactiveCollapsibleStore';
import { useSignalValue } from '~/utils/reactive-engine';

const standardDesktopOffsetTop = 50 + 16
const elementCriticalHeight = 2

interface HeadingsQuickNavProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
}

const getLevelNum = (tagName: string) => parseInt(tagName.replace('h', ''), 10) || 1

export const HeadingsQuickNav: React.FC<HeadingsQuickNavProps> = ({
  levels = ['h1', 'h2', 'h3'], // По умолчанию ищем h1, h2, h3
  pageLimit = 5,               // Пагинация по 5 элементов
}) => {
  // Читаем готовые данные из сигнала с помощью нашего кастомного хука подписки
  const headings = useSignalValue<IHeadingStoredItem[]>(headingsRegistrySignal)

  const [isDesktop, setIsDesktop] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: elementCriticalHeight,
  }))

  // 1. Сбор данных из DOM и расчет дерева (Выполняется ровно ОДИН раз при монтировании)
  useEffect(() => {
    const selector = levels.map(lvl => `${lvl}[id]`).join(', ')
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

    if (elements.length === 0) return

    const baseLevel = 1;
    const usedIds = new Map<string, number>() // Карта для отслеживания дубликатов ID

    // ШАГ 1: Нормализуем ID прямо в DOM, чтобы гарантировать их уникальность
    elements.forEach((el) => {
      const rawId = el.id.trim()
      
      if (!usedIds.has(rawId)) {
        // Первый раз видим этот ID — оставляем как есть
        usedIds.set(rawId, 0)
      } else {
        // ID продублирован — вычисляем новый индекс и обновляем атрибут в самом DOM-дереве!
        const nextIndex = usedIds.get(rawId)! + 1
        usedIds.set(rawId, nextIndex)
        
        const uniqueId = `${rawId}-${nextIndex}`
        el.id = uniqueId // Принудительно меняем ID у тега на странице
      }
    })

    // ШАГ 2: Строим разветвленное дерево на основе гарантированно уникальных ID
    const initialTree: IHeadingStoredItem[] = elements.map((el, idx, arr) => {
      const tagName = el.tagName.toLowerCase()
      const currentLevel = getLevelNum(tagName)
      const levelDiff = currentLevel - baseLevel
      let prefix = ''

      if (levelDiff > 0) {
        const tail = arr.slice(idx + 1)
        const nextParentIdx = tail.findIndex(item => getLevelNum(item.tagName.toLowerCase()) < currentLevel)
        const validSearchZone = nextParentIdx !== -1 ? tail.slice(0, nextParentIdx) : tail
        
        const hasNextSibling = validSearchZone.some(item => getLevelNum(item.tagName.toLowerCase()) === currentLevel)
        const nodeIcon = hasNextSibling ? '├─ ' : '└─ '

        if (levelDiff === 1) {
          prefix = nodeIcon
        } else {
          const fields: string[] = []
          for (let l = 1; l < levelDiff; l++) {
            const checkLevel = baseLevel + l
            const nextHigherParentIdx = tail.findIndex(item => getLevelNum(item.tagName.toLowerCase()) < checkLevel)
            const parentSearchZone = nextHigherParentIdx !== -1 ? tail.slice(0, nextHigherParentIdx) : tail
            const extendsParent = parentSearchZone.some(item => getLevelNum(item.tagName.toLowerCase()) === checkLevel)
            
            fields.push(extendsParent ? '│  ' : '   ')
          }
          prefix = fields.join('') + nodeIcon
        }
      }

      return {
        id: el.id, // Здесь уже гарантированно уникальный ID (например, "intro-1")
        text: el.innerText || el.textContent || '',
        tagName,
        prefix,
        levelDiff,
        isVisible: false,
        isActiveProgress: false
      }
    })

    headingsRegistrySignal.value = initialTree

    // ШАГ 3: Настройка IntersectionObserver (теперь работает без багов)
    const observer = new IntersectionObserver(
      (entries) => {
        let currentHeadings = [...headingsRegistrySignal.value]
        let isVisibilityChanged = false

        entries.forEach((entry) => {
          // Так как ID элементов в DOM теперь строго уникальны, find найдет ровно ту ноду, которая скроллится
          const item = currentHeadings.find(h => h.id === entry.target.id)
          if (item && item.isVisible !== entry.isIntersecting) {
            item.isVisible = entry.isIntersecting
            isVisibilityChanged = true
          }
        })

        let activeIndex = -1
        elements.forEach((el, idx) => {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.4) {
            activeIndex = idx
          }
        })
        if (activeIndex === -1 && elements.length > 0) activeIndex = 0

        let isProgressChanged = false
        currentHeadings.forEach((h, idx) => {
          const shouldBeActive = idx === activeIndex
          if (h.isActiveProgress !== shouldBeActive) {
            h.isActiveProgress = shouldBeActive
            isProgressChanged = true
          }
        })

        if (isVisibilityChanged || isProgressChanged) {
          headingsRegistrySignal.value = currentHeadings
        }
      },
      { rootMargin: '0px 0px -20% 0px' }
    )

    elements.forEach(el => observer.observe(el))
    
    return () => {
      observer.disconnect()
      headingsRegistrySignal.value = []
    }
  }, [levels])
  
  // 2. Умная пагинация: слушает изменение активного прогресса в сигнале
  useEffect(() => {
    if (headings.length === 0) return
    const activeProgressIndex = headings.findIndex(h => h.isActiveProgress)
    if (activeProgressIndex !== -1) {
      const targetPage = Math.floor(activeProgressIndex / pageLimit) + 1
      setCurrentPage(targetPage)
    }
  }, [headings, pageLimit])

  // 3. Контроль ширины экрана
  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // --- БЕЗОПАСНЫЙ РАСЧЕТ ДЕРЕВА НА ЛЕТУ БЕЗ USEMEMO (Устраняет ошибку #310) ---
  // const totalPages = Math.ceil(headings.length / pageLimit)

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

  if (!isDesktop || headings.length === 0) return null

  // ПАГИНАЦИЯ НА ЛЕТУ (Обычный плоский срез готового массива)
  const totalPages = Math.ceil(headings.length / pageLimit)
  const startIndex = (currentPage - 1) * pageLimit
  const visibleItems = headings.slice(startIndex, startIndex + pageLimit)

  // Глобальный индекс активного элемента для декларативного стиля цвета кнопок
  const globalActiveIndex = headings.findIndex(h => h.isActiveProgress)

  const getHeadingColor = (item: IHeadingStoredItem, idx: number) => {
    const globalIndex = startIndex + idx
    const isDarkTheme = currentTheme === 'dark' || currentTheme === 'hard-gray'

    if (item.isActiveProgress || item.isVisible) {
      switch (currentTheme) {
        case 'hard-gray': case 'gray': return '#39e5ac'
        default: return '#FF8E53'
      }
      
    }
    if (globalIndex < globalActiveIndex) {
      return isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' // Прочитан
    }
    return isDarkTheme ? '#ffffff' : '#000000' // Не прочитан
  }

  return (
    <div
      className="headings-quick-nav-panel"
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
        // По ТЗ компонент НЕ задвигаем наверх, он всегда статичен на top: 120px
        fontSize: 'small',
      }}
    >
      <div style={{ fontWeight: 'bold', color: textColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Содержание страницы
      </div>

      {visibleItems.map((heading, i) => {
        // Рассчитываем отступ (отступ слева) в зависимости от уровня заголовка h1-h4 для визуальной иерархии
        // const levelIndent = heading.tagName === 'h1' ? '0px' : heading.tagName === 'h2' ? '8px' : heading.tagName === 'h3' ? '16px' : '24px'

        return (
          <button
            key={heading.id}
            onClick={() => {
              try {
                scrollToIdRef.current({ 
                  id: heading.id,
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

                      // Если блок свернут (меньше elementCriticalHeight) (200px -> 2)
                      if (elementHeight <= elementCriticalHeight) {
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
            style={{
              textAlign: 'left',
              // padding: '8px 12px',
              padding: '0px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              // fontFamily: heading.levelDiff > 0 ? 'monospace, Courier, Courier New' : 'inherit',
              fontFamily: 'system-ui, monospace, Courier, Courier New',
              // fontSize: 'small',
              // borderRadius: '8px',
              // border: heading.isVisible ? '2px solid transparent' : '2px solid lightgray',
              border: 'none',
              // backgroundColor: bgColor,
              backgroundColor: 'transparent',
              // marginLeft: levelIndent, // Визуальное смещение поддерева
              color: getHeadingColor(heading, i),

              // Кнопка задизейблена для клика ТОЛЬКО если она в фокусе прогресса чтения
              // pointerEvents: heading.isVisible ? 'none' : 'auto',
              // cursor: heading.isVisible ? 'not-allowed' : 'pointer',
              cursor: 'pointer',
              // fontWeight: heading.isVisible ? 'normal' : 'bold',
              fontWeight: 'bold',
              transition: 'all 0.15s ease',
              // boxShadow: heading.isVisible ? 'none' : '0 2px 4px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',

              // Отступ слева теперь фиксированный, так как дерево строится за счет пробелов в monospace
              // paddingLeft: '12px', 
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
        )
      })}

      {/* Пагинация идентична правой панели */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            // marginTop: '8px',
            // paddingTop: '8px',
            // borderTop: '1px solid rgba(0,0,0,0.06)'
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
