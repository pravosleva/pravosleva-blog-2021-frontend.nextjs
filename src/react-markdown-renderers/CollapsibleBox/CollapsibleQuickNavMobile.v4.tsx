// src/react-markdown-renderers/CollapsibleBox/CollapsibleQuickNavMobile.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
// import PushPinIcon from '@mui/icons-material/PushPin'
import CloseIcon from '@mui/icons-material/Close'
import SchoolIcon from '@mui/icons-material/School'
import { IRootState } from '~/store/IRootState'
import { collapsibleRegistrySignal, ICollapsibleItem } from '~/store/reactive-engine/reactiveCollapsibleStore'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { useSignalValue } from '~/utils/reactive-engine'
import { getInfoToolBgColor, getFabTriggerTextColor } from '../HeadingsQuickNav/utils'

import { AbstractService, ReactiveEngine } from '@pravosleva/reactive-engine'

const standardDesktopOffsetTop = 50 + 16

class MobileNavLogic extends AbstractService {
  public scrollY = this.engine.signal<number>(0, 'collapsible-nav:signal:scrollY')

  public targets = this.engine.computed<{
    prev: ICollapsibleItem | null;
    next: ICollapsibleItem | null;
  }>(() => {
    const currentScrollY = this.scrollY.value
    const currentRegistry = collapsibleRegistrySignal.value
    const itemsList = Object.values(currentRegistry)
    
    const itemsCount = itemsList.length
    if (itemsCount === 0) return { prev: null, next: null }

    const lastIndex = itemsCount - 1
    const screenHeight = window.innerHeight
    const triggerLine = screenHeight / 2 

    if (currentScrollY < 80) {
      return { prev: null, next: itemsList[0] || null }
    }

    let currentActiveIdx = -1
    let isFirstBlockCenterPassed = false
    let isFirstBlockAboveScreen = false
    let isLastBlockVisible = false
    let isLastBlockCenterPassed = false
    let isLastBlockAboveScreen = false
    let isActiveBlockAboveScreen = false

    for (let i = 0; i < itemsCount; i++) {
      const item = itemsList[i]
      const el = document.getElementById(item.id)
      
      if (el) {
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < screenHeight && rect.bottom >= 0
        const isAboveScreen = rect.bottom < 0

        // Геометрический центр блока
        const elementCenterY = rect.top + (rect.height / 2)
        
        // ИСПРАВЛЕНО (ДОБАВЛЕН ЛЮФТ +5px ДЛЯ ПРЕДОТВРАЩЕНИЯ ОКРУГЛЕНИЯ ПИКСЕЛЕЙ):
        // Теперь микро-сдвиги в дробных пикселях на мобильных экранах не заблокируют триггер!
        const centerPassed = (elementCenterY <= triggerLine + 5) || (rect.top <= standardDesktopOffsetTop + 100)

        if (centerPassed) {
          currentActiveIdx = i
          isActiveBlockAboveScreen = isAboveScreen
        }
        if (i === 0) {
          isFirstBlockCenterPassed = centerPassed
          isFirstBlockAboveScreen = isAboveScreen
        }
        if (i === lastIndex) {
          isLastBlockVisible = isVisible
          isLastBlockCenterPassed = centerPassed
          isLastBlockAboveScreen = isAboveScreen
        }
      }
    }

    if (!isFirstBlockCenterPassed && !isFirstBlockAboveScreen) {
      return { prev: null, next: null }
    }

    let foundPrev: ICollapsibleItem | null = null
    let foundNext: ICollapsibleItem | null = null

    if (currentActiveIdx !== -1) {
      if (currentActiveIdx === lastIndex) {
        foundNext = null
        if (isActiveBlockAboveScreen) {
          foundPrev = itemsList[lastIndex]
        } else {
          foundPrev = itemsCount > 1 ? itemsList[itemsCount - 2] : null
        }
      } 
      else {
        if (isActiveBlockAboveScreen) {
          foundPrev = itemsList[currentActiveIdx]
          foundNext = itemsList[currentActiveIdx + 1] || null
        } else {
          foundPrev = currentActiveIdx > 0 ? itemsList[currentActiveIdx - 1] : null
          foundNext = itemsList[currentActiveIdx + 1] || null
        }
      }
    }

    return { prev: foundPrev, next: foundNext }
  }, 'collapsible-nav:computed:targets')
}

const navEngine = new ReactiveEngine({
  logger: {
    isEnabled: process.env.NODE_ENV === 'development',
    traceTime: true,
    filter: /^collapsible-nav-*/ 
  }
})

export const CollapsibleQuickNavMobile: React.FC = () => {
  const logic = navEngine.inject(MobileNavLogic)
  const targets = useSignalValue(logic.targets)
  const registry = useSignalValue<Record<string, ICollapsibleItem>>(collapsibleRegistrySignal)
  
  const [isMobile, setIsMobile] = useState(false)
  // ТУМБЛЕР АКТИВАЦИИ: по умолчанию панель закрыта (режим энергосбережения)
  const [isOpen, setIsOpened] = useState(false)

  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: 200,
  }))

  const items = Object.values(registry)

  // =========================================================================
  // ⚡ ФИКС СБРОСА: Автоматический сброс рантайма при смене статьи (SPA переходе)
  // =========================================================================
  useEffect(() => {
    // Как только состав элементов изменился (или обнулился реестр старой страницы)
    setIsOpened(false)
    logic.scrollY.value = 0
  }, [items.map(i => i.id).join(',')]) // Реагирует на изменение структуры ID блоков

  // Контроль мобильного разрешения
  useEffect(() => {
    const checkWidth = () => setIsMobile(window.innerWidth < 800)
    checkWidth()
    window.addEventListener('resize', checkWidth, { passive: true })
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  // МОДЕРНИЗИРОВАННЫЙ СКРОЛЛ-ЛИСТЕНЕР: 
  // Слушает скролл окна ТОЛЬКО ТОГДА, КОГДА КНОПКА НАЖАТА И ПАНЕЛЬ РАСКРЫТА (isOpen === true)
  useEffect(() => {
    if (!isMobile || items.length === 0 || !isOpen) {
      // Если панель закрыта — сбрасываем сигнал в 0, усыпляя граф вычислений
      logic.scrollY.value = 0
      return
    }

    let isThrottled = false

    const handleWindowScrollRaw = () => {
      if (isThrottled) return
      isThrottled = true

      requestAnimationFrame(() => {
        logic.scrollY.value = window.scrollY
        isThrottled = false
      })
    }

    // Первичный пинок при открытии и подписка
    handleWindowScrollRaw()
    window.addEventListener('scroll', handleWindowScrollRaw, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScrollRaw)
  }, [items.length, isMobile, isOpen])

  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const infoToolBgColor = getInfoToolBgColor({ currentTheme })
  const textColor = getFabTriggerTextColor({ currentTheme })

  const { prev: prevTarget, next: nextTarget } = targets
  // 1. Проверяем, доехали ли мы физически до первого блока статьи
  // 1. Проверяем, доехали ли мы физически до первого блока статьи
  const isFirstBlockReached = useMemo(() => {
    const firstItem = items[0] // Берем первый элемент из массива
    if (!firstItem) return false
    const el = document.getElementById(firstItem.id)
    if (!el) return false
    
    const rect = el.getBoundingClientRect()
    const triggerLine = window.innerHeight / 2
    const elementCenterY = rect.top + (rect.height / 2)
    
    return (elementCenterY <= triggerLine + 5) || (rect.top <= standardDesktopOffsetTop + 100)
  }, [targets, items])

  // 2. ИСПРАВЛЕНО: Стрелки активны и видны, только если РЕЖИМ ВКЛЮЧЕН (isOpen)
  // и мы уже доехали до контента, и в графе есть цели для скролла!
  const isNavActive = isOpen && isFirstBlockReached && (!!prevTarget || !!nextTarget)

  // 3. Подсказка видна, когда панель открыта, но первый блок еще НЕ достигнут
  const showScrollHint = isOpen && !isFirstBlockReached

  // Защитный Early Return переносим строго в рендер, чтобы хуки сброса не ломались!
  if (!isMobile || items.length === 0) return null

  // Панель полностью скрывается, только если закрыта кнопка-пин
  const shouldHide = !isOpen

  return (
    <div
      className="collapsible-quick-nav-mobile-container"
      style={{
        position: 'fixed',
        bottom: '345px', // По вашему дизайну
        right: '8px',    // По вашему дизайну
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* 💡 НОВОЕ: ПОЛУПРОЗРАЧНАЯ ПОДСКАЗКА ДЛЯ ПОЛЬЗОВАТЕЛЯ */}
      <div
        style={{
          position: 'absolute',
          right: '56px',
          bottom: '4px',
          backgroundColor: infoToolBgColor,
          color: textColor,
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontFamily: 'Montserrat, system-ui',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
          
          // Анимация плавного появления/исчезновения
          transform: showScrollHint ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.8)',
          opacity: showScrollHint ? 0.9 : 0,
          visibility: showScrollHint ? 'visible' : 'hidden',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        👇 Листайте вниз
      </div>

      {/* 🧭 СЛОЙ СТРЕЛОК НАВИГАЦИИ (Рендерится и двигается только если isOpen === true) */}
      <div
        className="collapsible-quick-nav-mobile-arrows"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          // Стрелки плавно выезжают строго после прохождения первого блока
          transform: isNavActive ? 'scale(1) translateY(0)' : 'scale(0.3) translateY(40px)',
          opacity: isNavActive ? 1 : 0,
          visibility: isNavActive ? 'visible' : 'hidden',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, visibility 0.2s',
        }}
      >
        {/* Стрелка ВВЕРХ */}
        {!!prevTarget && (
          <button
            onClick={() => scrollToIdRef.current({ id: prevTarget.id })}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: infoToolBgColor,
              color: textColor,
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <ArrowUpwardIcon fontSize="small" />
          </button>
        )}

        {/* Стрелка ВНИЗ */}
        {!!nextTarget && (
          <button
            onClick={() => scrollToIdRef.current({ id: nextTarget.id })}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: infoToolBgColor,
              color: textColor,
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <ArrowDownwardIcon fontSize="small" />
          </button>
        )}
      </div>

      {/* 📌 ГЛАВНАЯ КНОПКА-ТУМБЛЕР ДЛЯ АКТИВАЦИИ И СРАВНЕНИЯ ПАМЯТИ */}
      <button
        onClick={() => setIsOpened(s => !s)}
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: isOpen ? '#FF8E53' : infoToolBgColor,
          color: isOpen ? '#fff' : textColor,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          WebkitTapHighlightColor: 'transparent',
          zIndex: 5,
        }}
        title={isOpen ? "Закрыть навигацию" : "Открыть навигацию по блокам"}
      >
        {isOpen ? <CloseIcon fontSize="small" /> : <SchoolIcon fontSize="small" /* style={{ transform: 'rotate(45deg)' }} */ />}
      </button>
    </div>
  )
}
