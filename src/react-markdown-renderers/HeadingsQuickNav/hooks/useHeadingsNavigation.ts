import { useState, useEffect, useRef } from 'react'
import { headingsRegistrySignal, throttledHeadingsSignal, getLevelNum, IHeadingStoredItem } from '~/store/reactive-engine/reactiveHeadingsEngine'
import { scrollToIdFactory } from '~/utils/scrollToIdFactory'
import { getButtonBgColor, getTextColor, getActiveBorderCSS, getActiveBgColor, getInfoToolBgColor, getInfoToolTextColor } from '~/react-markdown-renderers/HeadingsQuickNav/utils'
import { useSignalValue } from '~/utils/reactive-engine'

interface UseHeadingsNavigationProps {
  levels?: ('h1' | 'h2' | 'h3' | 'h4')[];
  pageLimit?: number;
  actualSlug?: string;
  // ДОБАВЛЕНО: Массив CSS-селекторов контейнеров, заголовки внутри которых нужно игнорировать
  ignoreSelectors?: string[];
  /* NOTE: Когда мы передаем массив ['.article-alert', '.notice-block'],
  хук внутри себя компилирует для браузера следующую строчку CSS-селектора (например, для уровня h2):
  h2[id]:not(.article-alert h2, .notice-block h2)
  Как это понимает браузер:
  Псевдокласс :not(.article-alert h2) на уровне движка отрисовки Chromium/Gecko означает буквально следующее:
  «Найди мне все теги h2 с атрибутом id, КРОМЕ тех, у которых где-то выше по дереву предков (на любом уровне вложенности — будь то прямой родитель или пра-пра-прадедушка) есть элемент с классом .article-alert».
  */
}

const standardDesktopOffsetTop = 50 + 16
const elementCriticalHeight = 2

export const useHeadingsNavigation = ({
  levels = ['h1', 'h2', 'h3'],
  pageLimit = 5,
  actualSlug,
  ignoreSelectors = ['.alert', '.notice', '.custom-widget'], // Дефолтные селекторы для игнорирования
}: UseHeadingsNavigationProps = {}) => {
  const headings = useSignalValue<IHeadingStoredItem[]>(throttledHeadingsSignal)
  const [currentPage, setCurrentPage] = useState(1)

  // Сериализуем и уровни, и игнорируемые селекторы, чтобы исключить лишние ререндеры
  const levelsKey = levels.join(',');
  const ignoreKey = ignoreSelectors.join(',');

  const scrollToIdRef = useRef(scrollToIdFactory({
    timeout: 0,
    offsetTop: standardDesktopOffsetTop,
    elementHeightCritery: elementCriticalHeight,
  }))

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isCancelled = false;
    const visibleElementsMap = new Map<string, boolean>();

    setCurrentPage(1);

    const initNavigation = () => {
      if (isCancelled) return;

      const currentLevels = levelsKey.split(',');
      const currentIgnores = ignoreKey ? ignoreKey.split(',') : [];

      // СТРОИМ СЕЛЕКТОР С ИСКЛЮЧЕНИЕМ:
      // Если есть игнорируемые классы, превращаем их в строку вида ":not(.alert) :not(.notice)"
      const notModifier = currentIgnores.length > 0 
        ? currentIgnores.map(selector => `:not(${selector} ${selector.startsWith('.') || selector.startsWith('#') ? '' : ' '})`).join('')
        : '';

      // Итоговый селектор будет выглядеть так: "h1[id]:not(.alert *), h2[id]:not(.alert *)"
      // Это заставит браузер проигнорировать ЛЮБОЙ заголовок, если среди его родителей есть .alert
      const selector = currentLevels
        .map(lvl => `${lvl}[id]${currentIgnores.length > 0 ? `:not(${currentIgnores.map(i => `${i} ${lvl}`).join(', ')})` : ''}`)
        .join(', ')

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

      observer = new IntersectionObserver(
        (entries) => {
          if (isCancelled) return;

          let currentHeadings = [...throttledHeadingsSignal.value]
          let isVisibilityChanged = false // Флаг изменения видимости

          // 1. Фиксируем видимость элементов
          entries.forEach((entry) => {
            visibleElementsMap.set(entry.target.id, entry.isIntersecting);
            
            const item = currentHeadings.find(h => h.id === entry.target.id)
            if (item && item.isVisible !== entry.isIntersecting) {
              item.isVisible = entry.isIntersecting
              isVisibilityChanged = true
            }
          })

          // 2. Рассчитываем активный индекс
          let activeIndex = -1;
          for (let i = 0; i < elements.length; i++) {
            if (visibleElementsMap.get(elements[i].id)) {
              activeIndex = i;
              break;
            }
          }

          if (activeIndex === -1 && elements.length > 0) {
            if (elements[0]) {
              const firstRect = elements[0].getBoundingClientRect();
              if (firstRect.top > window.innerHeight * 0.4) {
                activeIndex = 0;
              } else {
                const prevActive = currentHeadings.findIndex(h => h.isActiveProgress);
                activeIndex = prevActive !== -1 ? prevActive : 0;
              }
            }
          }

          // 3. Проверяем изменение прогресса чтения
          let isProgressChanged = false // Флаг изменения прогресса
          currentHeadings.forEach((h, idx) => {
            const shouldBeActive = idx === activeIndex
            if (h.isActiveProgress !== shouldBeActive) {
              h.isActiveProgress = shouldBeActive
              isProgressChanged = true // Фиксируем, что активный пункт сменился!
            }
          })

          // ИСПРАВЛЕНО: Теперь если изменилась видимость ИЛИ переключился активный пункт прогресса —
          // мы гарантированно пушим обновление в реактивное ядро
          if (isVisibilityChanged || isProgressChanged) {
            headingsRegistrySignal.value = currentHeadings;
          }
        },
        { rootMargin: '-10% 0px -40% 0px' }
      )

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
    // Добавляем ignoreKey в массив зависимостей
  }, [levelsKey, ignoreKey, actualSlug])

  useEffect(() => {
    if (headings.length === 0) return
    const activeProgressIndex = headings.findIndex(h => h.isActiveProgress)
    if (activeProgressIndex !== -1) {
      const targetPage = Math.floor(activeProgressIndex / pageLimit) + 1
      setCurrentPage(targetPage) // <--- Вот эта магия автоскролла пагинации!
    }
  }, [headings, pageLimit])

  // ... (Остальной расчет пагинации и цветов остается прежним) ...
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
