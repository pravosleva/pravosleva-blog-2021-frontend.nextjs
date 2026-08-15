import React, { useState, useEffect, useRef } from 'react'
import { collapsibleRegistrySignal, useSignalValue, ICollapsibleItem } from '~/store/reactiveCollapsibleStore'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'

const standardDesktopOffsetTop = 50 + 16

export const CollapsibleQuickNav: React.FC = () => {
  // Подписываемся на изменения глобального реактивного сигнала реестра блоков
  const registry = useSignalValue<Record<string, ICollapsibleItem>>(collapsibleRegistrySignal)
  const [isDesktop, setIsDesktop] = useState(false)
  
  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: 200,
  }))

  // Отслеживание ширины экрана
  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth >= 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  const items = Object.values(registry)

  // Если не десктоп или на странице нет ни одного CollapsibleBox — ничего не рендерим
  if (!isDesktop || items.length === 0) return null

  return (
    <div
      className="collapsible-quick-nav-panel"
      style={{
        position: 'fixed',
        right: '24px',
        top: '120px',
        width: '220px',
        maxHeight: '70vh',
        overflowY: 'auto',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
      }}
    >
      {/* <div style={{ fontSize: 'small', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
        Навигация по блокам
      </div> */}
      
      {items.map((item) => (
        <button
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
          style={{
            textAlign: 'left',
            padding: '8px 12px',
            fontSize: 'small',
            borderRadius: '8px',
            border: '2px solid lightgray',
            backgroundColor: item.isVisible ? 'rgba(0,0,0,0.03)' : '#fff',
            color: item.isVisible ? '#aaa' : '#333',

            // ВМЕСТО disabled используем CSS для блокировки кликов
            pointerEvents: item.isVisible ? 'none' : 'auto', 
            cursor: item.isVisible ? 'not-allowed' : 'pointer',

            fontWeight: item.isVisible ? 'normal' : 'bold',
            transition: 'all 0.15s ease',
            boxShadow: item.isVisible ? 'none' : '0 2px 4px rgba(0,0,0,0.04)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          title={item.header}
        >
          {item.header}
        </button>
      ))}
    </div>
  )
}
