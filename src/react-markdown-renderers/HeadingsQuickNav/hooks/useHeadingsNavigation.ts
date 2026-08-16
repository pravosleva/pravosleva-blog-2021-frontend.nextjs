import { useState, useEffect, useRef } from 'react'
import { headingsRegistrySignal, useSignalValue, getLevelNum, IHeadingStoredItem } from '~/store/reactiveCollapsibleStore'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'

interface UseHeadingsNavigationProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
}

const standardDesktopOffsetTop = 50 + 16
const elementCriticalHeight = 2

export const useHeadingsNavigation = ({
  levels = ['h1', 'h2', 'h3'],
  pageLimit = 5,
}: UseHeadingsNavigationProps = {}) => {
  const headings = useSignalValue<IHeadingStoredItem[]>(headingsRegistrySignal)
  const [currentPage, setCurrentPage] = useState(1)

  // Фабрика скролла (утилита)
  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: elementCriticalHeight,
  }))

  // 1. Инициализация: сбор заголовков, нормализация ID и построение дерева
  useEffect(() => {
    const selector = levels.map(lvl => `${lvl}[id]`).join(', ')
    const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

    if (elements.length === 0) return

    const baseLevel = 1
    const usedIds = new Map<string, number>()

    // Дедупликация ID в DOM
    elements.forEach((el) => {
      const rawId = el.id.trim()
      if (!usedIds.has(rawId)) {
        usedIds.set(rawId, 0)
      } else {
        const nextIndex = usedIds.get(rawId)! + 1
        usedIds.set(rawId, nextIndex)
        el.id = `${rawId}-${nextIndex}`
      }
    })

    // Построение структуры дерева
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
        id: el.id,
        text: el.innerText || el.textContent || '',
        tagName,
        prefix,
        levelDiff,
        isVisible: false,
        isActiveProgress: false
      }
    })

    headingsRegistrySignal.value = initialTree

    // Настройка IntersectionObserver для прогресса
    const observer = new IntersectionObserver(
      (entries) => {
        let currentHeadings = [...headingsRegistrySignal.value]
        let isVisibilityChanged = false

        entries.forEach((entry) => {
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

  // 2. Авто-синхронизация текущей страницы пагинации при скролле статьи
  useEffect(() => {
    if (headings.length === 0) return
    const activeProgressIndex = headings.findIndex(h => h.isActiveProgress)
    if (activeProgressIndex !== -1) {
      const targetPage = Math.floor(activeProgressIndex / pageLimit) + 1
      setCurrentPage(targetPage)
    }
  }, [headings, pageLimit])

  // 3. Вычисление среза данных для текущей страницы
  const totalPages = Math.ceil(headings.length / pageLimit)
  const startIndex = (currentPage - 1) * pageLimit
  const visibleItems = headings.slice(startIndex, startIndex + pageLimit)
  const globalActiveIndex = headings.findIndex(h => h.isActiveProgress)

  // Функция хэндлера клика (скролл к элементу)
  const handleScrollTo = (id: string) => {
    scrollToIdRef.current({
      id,
      _cfg: {
        getOffsetTop: ({ targetElm }) => {
          let absoluteTop = 0
          let currentElm: HTMLElement | null = targetElm
          while (currentElm) {
            absoluteTop += currentElm.offsetTop
            currentElm = currentElm.offsetParent as HTMLElement | null
          }
          const elementHeight = targetElm.offsetHeight

          if (elementHeight <= elementCriticalHeight) {
            const windowHeight = window.innerHeight
            const targetCenterPos = absoluteTop - (windowHeight / 2) + (elementHeight / 2)
            return absoluteTop - targetCenterPos
          }
          return standardDesktopOffsetTop // Стандартный отступ для больших блоков
        }
      }
    })
  }

  const getHeadingColor = ({ item, idx, currentTheme }: {
    item: IHeadingStoredItem;
    idx: number;
    currentTheme: string;
  }) => {
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

  const getBgColor = ({ currentTheme }: { currentTheme: string }) => {
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
  }

  const getTextColor = ({ currentTheme }: { currentTheme: string }) => {
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
  }

  return {
    headings,              // Весь массив
    visibleItems,          // Постраничный срез для рендера списка кнопок
    currentPage,           // Текущая страница пагинации
    totalPages,            // Всего страниц пагинации
    setCurrentPage,        // Метод ручного переключения страниц (для кнопок вперед/назад)
    handleScrollTo,        // Метод точного скролла до центра при клике
    getHeadingColor,       // Готовые цвета с учетом темы, прогресса и прочтения
    getTextColor,
    getBgColor,
  }
}
