import { useState, useEffect, useRef } from 'react'
import { headingsRegistrySignal, throttledHeadingsSignal, getLevelNum, IHeadingStoredItem } from '~/store/reactiveCollapsibleStore'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { getBgColor, getTextColor, getActiveBorderCSS, getActiveBgColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { useSignalValue } from '~/utils/reactive-engine'

interface UseHeadingsNavigationProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
  actualSlug?: string;
}

const standardDesktopOffsetTop = 50 + 16
const elementCriticalHeight = 2

export const useHeadingsNavigation = ({
  levels = ['h1', 'h2', 'h3'],
  pageLimit = 5,
  actualSlug,
}: UseHeadingsNavigationProps = {}) => {
  const headings = useSignalValue<IHeadingStoredItem[]>(throttledHeadingsSignal)
  const [currentPage, setCurrentPage] = useState(1)

  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: elementCriticalHeight,
  }))

  // 1. Инициализация: сбор заголовков, нормализация ID и построение дерева
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isCancelled = false;

    // СБРОС СТЕЙТА: При смене статьи мгновенно очищаем старое содержание и возвращаем пагинацию на 1
    headingsRegistrySignal.value = [];
    /* NOTE: Благодаря этому старое содержание предыдущей статьи мгновенно исчезает с экрана,
    не вызывая визуального бага «смешивания» текстов двух статей.
    */
    setCurrentPage(1);

    const initNavigation = () => {
      if (isCancelled) return;

      const selector = levels.map(lvl => `${lvl}[id]`).join(', ')
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

      // Если ReactMarkdown ещё не отрендерил новые ноды, выходим. 
      // Следующий таймаут или MutationObserver подхватит их.
      if (elements.length === 0) return;

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
      observer = new IntersectionObserver(
        (entries) => {
          let currentHeadings = [...throttledHeadingsSignal.value]
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

      elements.forEach(el => observer?.observe(el))
    }

    // РЕШЕНИЕ БАГА: Макротаска через setTimeout(..., 50) сдвигает выполнение разбора DOM
    // в конец очереди, когда ReactMarkdown гарантированно завершил вставку новых тегов h1-h4 статьи.
    const timerId = setTimeout(initNavigation, 50);
    /* NOTE: Микро-задержка инициализации (setTimeout):
    Заворачивание функции initNavigation в setTimeout(..., 50) — это классический паттерн для работы
    с динамическим контентом (Markdown/WYSIWYG) в React. Мы даём браузеру 50 миллисекунд на то,
    чтобы очистить старое дерево элементов и полностью отрисовать новые текстовые ноды.
    В момент вызова document.querySelectorAll новые ID гарантированно будут находиться в DOM.
    */

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
      if (observer) {
        observer.disconnect();
      }
      headingsRegistrySignal.value = [];
    };
  }, [levels, actualSlug]) // Перезапускаем строго при изменении уровней или слажка статьи

  // 2. Авто-синхронизация текущей страницы пагинации при скролле статьи
  useEffect(() => {
    if (headings.length === 0) return
    const activeProgressIndex = headings.findIndex(h => h.isActiveProgress)
    if (activeProgressIndex !== -1) {
      const targetPage = Math.floor(activeProgressIndex / pageLimit) + 1
      setCurrentPage(targetPage)
    }
  }, [headings, pageLimit]) // Убрали лишний actualSlug, так как headings теперь обновляются корректно

  // 3. Вычисление среза данных для текущей страницы
  const totalPages = Math.ceil(headings.length / pageLimit)
  const startIndex = (currentPage - 1) * pageLimit
  const visibleItems = headings.slice(startIndex, startIndex + pageLimit)
  const globalActiveIndex = headings.findIndex(h => h.isActiveProgress)

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
          return standardDesktopOffsetTop
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
      return isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
    }
    return isDarkTheme ? '#ffffff' : '#000000'
  }

  return {
    headings,
    visibleItems,
    currentPage,
    totalPages,
    setCurrentPage,
    handleScrollTo,
    getHeadingColor,
    getTextColor,
    getBgColor,
    getActiveBorderCSS,
    getActiveBgColor,
  }
}
