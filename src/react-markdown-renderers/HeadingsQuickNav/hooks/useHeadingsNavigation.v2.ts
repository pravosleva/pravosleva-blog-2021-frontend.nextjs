import { useState, useEffect, useRef } from 'react'
import { headingsRegistrySignal, throttledHeadingsSignal, getLevelNum, IHeadingStoredItem } from '~/store/reactive-engine/reactiveHeadingsEngine'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { getLabelBgColor, getTextColor, getActiveBorderCSS, getActiveBgColor, getInfoToolBgColor, getInfoToolTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
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

  // ИСПРАВЛЕНО: Сериализуем массив уровней в стабильную строку (например, "h1,h2,h3,h4"),
  // чтобы перерендеры из-за поиска не триггерили перезапуск эффекта.
  const levelsKey = levels.join(',');

  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: elementCriticalHeight,
  }))

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isCancelled = false;

    setCurrentPage(1);

    const initNavigation = () => {
      if (isCancelled) return;

      // ИСПРАВЛЕНО: Восстанавливаем массив из стабильного ключа для селектора
      const currentLevels = levelsKey.split(',');
      const selector = currentLevels.map(lvl => `${lvl}[id]`).join(', ')
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]

      if (elements.length === 0) {
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

      headingsRegistrySignal.value = initialTree

      // Замените блок IntersectionObserver внутри useEffect в вашем хуке useHeadingsNavigation.ts:

      // Храним карту видимости элементов прямо в замыкании эффекта, 
      // чтобы не зависеть от рассинхронизации ID контента
      const visibleElementsMap = new Map<string, boolean>();

      observer = new IntersectionObserver(
        (entries) => {
          if (isCancelled) return;

          let currentHeadings = [...throttledHeadingsSignal.value];
          let isChanged = false;

          // 1. Фиксируем, какие элементы сейчас физически видны в нашей активной зоне
          entries.forEach((entry) => {
            visibleElementsMap.set(entry.target.id, entry.isIntersecting);
            
            const item = currentHeadings.find(h => h.id === entry.target.id);
            if (item && item.isVisible !== entry.isIntersecting) {
              item.isVisible = entry.isIntersecting;
              isChanged = true;
            }
          });

          // 2. ИСПРАВЛЕНИЕ ПРЫЖКОВ: Находим первый сверху элемент, который ОСТАЛСЯ видимым в зоне скролла.
          // Больше никаких getBoundingClientRect() в циклах!
          let activeIndex = -1;
          
          for (let i = 0; i < elements.length; i++) {
            if (visibleElementsMap.get(elements[i].id)) {
              activeIndex = i;
              break; // Нашли самый верхний видимый заголовок в зоне чтения — он и активен
            }
          }

          // Если мы скроллим вверх и ни один заголовок не попал в rootMargin, 
          // определяем положение по первому элементу
          if (activeIndex === -1 && elements.length > 0) {
            const firstRect = elements[0].getBoundingClientRect();
            if (firstRect.top > window.innerHeight * 0.4) {
              activeIndex = 0; // Самый верх статьи
            } else {
              // Мы проскроллили ниже, сохраняем текущий активный из сигнала, чтобы не прыгать в 0
              const prevActive = currentHeadings.findIndex(h => h.isActiveProgress);
              activeIndex = prevActive !== -1 ? prevActive : 0;
            }
          }

          // 3. Обновляем статус активного прогресса
          currentHeadings.forEach((h, idx) => {
            const shouldBeActive = idx === activeIndex;
            if (h.isActiveProgress !== shouldBeActive) {
              h.isActiveProgress = shouldBeActive;
              isChanged = true;
            }
          });

          if (isChanged) {
            headingsRegistrySignal.value = currentHeadings;
          }
        },
        { 
          // Настраиваем "полосу захвата" для чтения:
          // Ловим заголовки в диапазоне от 10% до 60% от верха экрана viewport.
          // Это полностью нивелирует влияние вложенных div и маргинов.
          rootMargin: '-10% 0px -40% 0px' 
        }
      );

      // Привязываем обсервер к элементам
      elements.forEach(el => observer?.observe(el))
    }

    const timerId = setTimeout(initNavigation, 50);

    return () => {
      isCancelled = true;
      clearTimeout(timerId);
      if (observer) {
        observer.disconnect();
      }
    };
    
    // ИСПРАВЛЕНО: Вместо нестабильной ссылки `levels` следим за примитивной строкой `levelsKey`
  }, [levelsKey, actualSlug]) 

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
    getLabelBgColor,
    getActiveBorderCSS,
    getActiveBgColor,
    getInfoToolBgColor,
    getInfoToolTextColor,
  }
}