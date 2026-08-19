import { useState, useEffect, useRef } from 'react'
import { headingsRegistrySignal, throttledHeadingsSignal, getLevelNum, IHeadingStoredItem } from '~/store/reactive-engine/reactiveHeadingsEngine'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { getButtonBgColor, getTextColor, getActiveBorderCSS, getActiveBgColor, getInfoToolBgColor, getInfoToolTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
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

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isCancelled = false;

    // ИСПРАВЛЕНО: УБРАЛИ headingsRegistrySignal.value = []. 
    // Больше не зануляем глобальный сигнал превентивно, чтобы не вызывать "моргание" интерфейса.
    // Вместо этого просто сбрасываем локальный указатель страницы пагинации.
    setCurrentPage(1);

    const initNavigation = () => {
      // Если за 50мс юзер уже ушел на другую статью, полностью игнорируем выполнение
      if (isCancelled) return;

      const selector = levels.map(lvl => `${lvl}[id]`).join(', ')
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

      // Если разметка новой статьи еще не появилась в DOM — мягко выходим, 
      // оставляя сигнал в покое, пока MutationObserver или повторный цикл не заполнит его
      if (elements.length === 0) {
        // Если элементов действительно нет во всей статье, тогда очищаем атомарно
        headingsRegistrySignal.value = [];
        return;
      }

      const baseLevel = 1
      const usedIds = new Map<string, number>()

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

      // ИСПРАВЛЕНО: Записываем новое дерево АТОМАРНО одним махом. 
      // Сигнал перетечет из [старые_заголовки] напрямую в [новые_заголовки], 
      // минуя фазу пустого массива [], убирая эффект схлопывания блока.
      headingsRegistrySignal.value = initialTree

      observer = new IntersectionObserver(
        (entries) => {
          // Защита: если хук уже находится в процессе уничтожения/смены статьи,
          // полностью блокируем колбэки старого обсервера
          if (isCancelled) return;

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

    const timerId = setTimeout(initNavigation, 50);

    return () => {
      // ИСПРАВЛЕНО: Сразу выставляем флаг отмены, чтобы заблокировать асинхронные
      // ответы IntersectionObserver старой статьи, которые летели в микротаски
      isCancelled = true;
      clearTimeout(timerId);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [levels, actualSlug])

  useEffect(() => {
    if (headings.length === 0) return
    const activeProgressIndex = headings.findIndex(h => h.isActiveProgress)
    if (activeProgressIndex !== -1) {
      const targetPage = Math.floor(activeProgressIndex / pageLimit) + 1
      setCurrentPage(targetPage)
    }
  }, [headings, pageLimit])

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

  const getHeadingButtonColor = ({ item, idx, currentTheme }: {
    item: IHeadingStoredItem;
    idx: number;
    currentTheme: string;
  }) => {
    const globalIndex = startIndex + idx
    // const isDarkTheme = currentTheme === 'dark' || currentTheme === 'hard-gray'

    if (item.isActiveProgress || item.isVisible) {
      switch (currentTheme) {
        case 'hard-gray': case 'gray': return '#39e5ac'
        default: return '#FF8E53'
      }
    }
    // if (globalIndex < globalActiveIndex) {
    //   return isDarkTheme ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
    // }
    // return isDarkTheme ? '#ffffff' : '#000000'

    switch (true) {
      case globalIndex < globalActiveIndex: {
        switch (currentTheme) {
          case 'light': return 'rgba(0, 0, 0, 0.4)'
          case 'gray': case 'hard-gray': case 'dark': return 'rgba(255, 255, 255, 0.4)'
          default: return 'rgba(0, 0, 0, 0.4)'
        }
      }
      default:
        switch (currentTheme) {
          case 'light': return '#000'
          case 'hard-gray': case 'gray': case 'dark': return '#fff'
          default: return '#000'
        }
    }
  }

  return {
    headings,
    visibleItems,
    currentPage,
    totalPages,
    setCurrentPage,
    handleScrollTo,
    getHeadingButtonColor,
    getTextColor,
    getButtonBgColor,
    getActiveBorderCSS,
    getActiveBgColor,
    getInfoToolBgColor,
    getInfoToolTextColor,
  }
}
