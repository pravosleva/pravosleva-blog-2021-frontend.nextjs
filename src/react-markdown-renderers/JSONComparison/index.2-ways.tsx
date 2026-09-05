import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { isValidJson } from '~/utils/isValidJson'
import { createDiffWorker } from '~/utils/diffWorker'

type TProps = {
  json1: string;
  json2: string;
  // height?: number;
}

interface IDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  commaOnly?: boolean;
}

// Пара для двухколоночного режима
interface ISideBySidePair {
  left: IDiffLine | null;
  right: IDiffLine | null;
}

const VIRTUALIZATION_THRESHOLD = 1000

// --- Стили в палитре Material Oceanic ---
const Container = styled.div`
  width: 100%;
  border-radius: 8px;
  @media (max-width: 768px) {
    width: calc(100% + 32px);
    transform: translateX(-16px);
    border-radius: 0px;
  }
  // border: 1px solid #546e7a;
  
  background-color: #263238;
  overflow: hidden;
  box-sizing: border-box;
`

const Header = styled.div`
  padding: 10px 16px;
  background-color: #1a2327;
  // border-bottom: 1px solid #546e7a;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #b0bec5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ToggleButtonGroup = styled.div`
  display: flex;
  background-color: #263238;
  // border: 1px solid #546e7a;
  border: none;
  border-radius: 6px;
  overflow: hidden;
  width: fit-content;
`

const ToggleButton = styled.button<{ $active: boolean }>`
  background-color: ${({ $active }) => ($active ? '#546e7a' : 'transparent')};
  color: ${({ $active }) => ($active ? '#89ddff' : '#b0bec5')};
  border: none;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: small;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background-color: ${({ $active }) => ($active ? '#546e7a' : 'rgba(84, 110, 122, 0.2)')};
  }
`

const AutoHeightContainer = styled.div`
  width: 100%;
  height: auto;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", "Courier New", monospace !important;
`

interface ICodeLineProps {
  $type: IDiffLine['type'] | 'empty';
  $commaOnly?: boolean;
}

// const CodeLine = styled.div<ICodeLineProps>`
//   display: flex;
//   align-items: center;
//   width: max-content;
//   min-width: 100%;
//   box-sizing: border-box;
//   height: 24px;
//   font-family: inherit;
  
//   background-color: ${(props: ICodeLineProps) => {
//     if (props.$commaOnly) return 'rgba(255, 158, 59, 0.15)';
//     if (props.$type === 'added') return 'rgba(195, 232, 141, 0.12)';
//     if (props.$type === 'removed') return 'rgba(255, 83, 112, 0.12)';
//     return 'transparent';
//   }};

//   border-left: 4px solid ${(props: ICodeLineProps) => {
//     if (props.$commaOnly) return '#ff9e3b';
//     if (props.$type === 'added') return '#c3e88d';
//     if (props.$type === 'removed') return '#ff5370';
//     return 'transparent';
//   }};

//   &:hover {
//     background-color: ${(props: ICodeLineProps) => {
//       if (props.$commaOnly) return 'rgba(255, 158, 59, 0.25)';
//       if (props.$type === 'added') return 'rgba(195, 232, 141, 0.22)';
//       if (props.$type === 'removed') return 'rgba(255, 83, 112, 0.22)';
//       return 'rgba(84, 110, 122, 0.15)';
//     }};
//   }
// `

// --- Новые Styled-компоненты для вертикального позиционирования и управления ---
const ScrollWrapper = styled.div`
  position: relative;
  width: 100%;
`

// --- Новые Styled-компоненты для адаптивного Scroll Snap ---

// Контейнер списка: теперь он растягивается по высоте контента (height: auto),
// а на мобильных устройствах включает горизонтальный свайп-контейнер для режима Side-by-Side
const ListWrapper = styled.div<{ $viewMode: 'line' | 'side' }>`
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace !important;
  font-size: 13px;
  background-color: #263238 !important;
  color: #b0bec5 !important;
  height: auto;
  overflow-y: hidden;
  overflow-x: hidden;

  @media (max-width: 768px) {
    ${(props) =>
      props.$viewMode === 'side' &&
      `
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    `}
  }
`

// Строка-сетка для Side-by-Side
// На десктопе — классические две колонки по 50%.
// На мобилке — контейнер растягивается на 200% ширины, выстраивая колонки друг за другом для свайпа.
const SideBySideGridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(84, 110, 122, 0.1);

  @media (max-width: 768px) {
    display: flex;
    width: 200%; /* Две мобильные колонки по 100% ширины экрана */
  }
`

// Колонки «Было» и «Стало»
// На мобилке каждая колонка занимает ровно 100% ширины экрана и привязывается к свайп-сетке
const Column = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  
  &:first-child {
    border-right: 1px solid #1a2327;
  }

  @media (max-width: 768px) {
    width: 50%; /* 50% от родительских 200% = ровно 100% вьюпорта */
    min-width: 50%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    
    &:first-child {
      border-right: none;
      border-bottom: 2px dashed #1a2327;
    }
  }
`

const SmartCodeLine = styled.div<ICodeLineProps>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  min-height: 24px;
  font-family: inherit;
  
  background-color: ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return 'rgba(255, 158, 59, 0.15)';
    if (props.$type === 'added') return 'rgba(195, 232, 141, 0.12)';
    if (props.$type === 'removed') return 'rgba(255, 83, 112, 0.12)';
    return 'transparent';
  }};

  border-left: 4px solid ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#ff9e3b';
    if (props.$type === 'added') return '#c3e88d';
    if (props.$type === 'removed') return '#ff5370';
    return 'transparent';
  }};

  &:hover {
    background-color: ${(props: ICodeLineProps) => {
      if (props.$commaOnly) return 'rgba(255, 158, 59, 0.25)';
      if (props.$type === 'added') return 'rgba(195, 232, 141, 0.22)';
      if (props.$type === 'removed') return 'rgba(255, 83, 112, 0.22)';
      return 'rgba(84, 110, 122, 0.15)';
    }};
  }
`

const Sign = styled.div<ICodeLineProps>`
  width: 30px;
  min-width: 30px;
  text-align: center;
  user-select: none;
  font-weight: bold;
  line-height: 24px;
  font-family: inherit;
  
  color: ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#ff9e3b';
    if (props.$type === 'added') return '#c3e88d';
    if (props.$type === 'removed') return '#ff5370';
    return '#546e7a';
  }} !important;
`

const Content = styled.div`
  flex-grow: 1;
  white-space: pre-wrap; 
  word-break: break-all;
  line-height: 24px;
  padding-left: 8px;
  padding-right: 16px;
  font-family: inherit;
  color: #b0bec5 !important;
  overflow: hidden;

  & span.key { color: #80cbc4; }
  & span.punct { color: #89ddff; }
  & span.str { color: #c3e88d; }
  & span.num-bool { color: #f77669; }

  & span.key, & span.punct, & span.str, & span.num-bool {
    font-weight: bold;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", "Courier New", monospace !important;
  }
`

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #546e7a;
`

export const JSONComparison = ({ json1, json2 }: TProps) => {
  const [diffResult, setDiffResult] = useState<IDiffLine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [VirtualList, setVirtualList] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  // Состояние выбранного режима: 'line' (построчный) или 'side' (двухколоночный)
  const [viewMode, setViewMode] = useState<'line' | 'side'>('line')
  
  const workerRef = useRef<Worker | null>(null)
  const arePropsValid = useMemo(() => isValidJson(json1) && isValidJson(json2), [json1, json2])

  // Инициализация воркера и динамическая подгрузка react-window
  useEffect(() => {
    try {
      workerRef.current = createDiffWorker()
      workerRef.current.onmessage = (e: MessageEvent) => {
        setDiffResult(e.data || [])
        setIsProcessing(false)
      }
      workerRef.current.onerror = (errorEvent: ErrorEvent) => {
        setErrorMessage(`Ошибка Worker: ${errorEvent.message}`)
        setIsProcessing(false)
      }
    } catch (workerInitError: any) {
      setErrorMessage(`Не удалось инициализировать Web Worker: ${workerInitError?.message || workerInitError}`)
    }

    const name = ['react', 'window'].join('-')
    import(`${name}`)
      .then((mod) => {
        const listComp = mod.FixedSizeList || mod.default?.FixedSizeList || (mod as any).default
        if (listComp) {
          setVirtualList(() => listComp)
        }
      })
      .catch((importError) => {
        console.warn('[JSONComparison] Ошибка загрузки react-window, включен HTML-режим.', importError)
      })

    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    if (!arePropsValid) return
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const oldLines = JSON.stringify(JSON.parse(json1), null, 2).split('\n')
      const newLines = JSON.stringify(JSON.parse(json2), null, 2).split('\n')

      if (workerRef.current) {
        workerRef.current.postMessage({ oldLines, newLines })
      } else {
        throw new Error('Worker не готов')
      }
    } catch (prepareError: any) {
      setErrorMessage(`Ошибка подготовки: ${prepareError?.message || prepareError}`)
      setIsProcessing(false)
    }
  }, [json1, json2, arePropsValid])

  // --- Преобразование линейного массива в пары для Side-by-Side режима ---
  const sideBySidePairs = useMemo<ISideBySidePair[]>(() => {
    if (viewMode !== 'side') return []
    
    const pairs: ISideBySidePair[] = []
    let pointer = 0

    while (pointer < diffResult.length) {
      const current = diffResult[pointer]

      // Если строка не менялась, она отображается параллельно в обеих колонках
      if (current.type === 'unchanged') {
        pairs.push({ left: current, right: current })
        pointer++
      } 
      // Если это блок изменений (сглаженный по запятой), ставим их строго друг напротив друга
      else if (current.commaOnly && pointer < diffResult.length - 1) {
        const next = diffResult[pointer + 1]
        if (current.type === 'removed' && next.type === 'added') {
          pairs.push({ left: current, right: next })
        } else {
          pairs.push({ left: next, right: current })
        }
        pointer += 2
      }
      // Если это удаленная строка, она заполняет только левую колонку, справа — пустота
      else if (current.type === 'removed') {
        pairs.push({ left: current, right: null })
        pointer++
      } 
      // Если это добавленная строка, она заполняет только правую колонку, слева — пустота
      else if (current.type === 'added') {
        pairs.push({ left: null, right: current })
        pointer++
      }
    }

    return pairs
  }, [diffResult, viewMode])

  const isHeavyList = useMemo(() => {
    const targetLength = viewMode === 'side' ? sideBySidePairs.length : diffResult.length
    return targetLength > VIRTUALIZATION_THRESHOLD
  }, [diffResult.length, sideBySidePairs.length, viewMode])

  // Функция подсветки синтаксиса токенов JSON
  const highlightJsonLine = (lineText: string) => {
    if (!lineText) return '';
    let escaped = lineText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    escaped = escaped.replace(/^(\s*)"([^"]+)"(\s*:)/g, '$1<span class="key">"$2"</span><span class="punct">$3</span>')
    escaped = escaped.replace(/(:\s*)"([^"]*)"(,?)$/g, '<span class="punct">:</span> <span class="str">"$2"</span><span class="punct">$3</span>')
    escaped = escaped.replace(/(:\s*)(true|false|null|\d+(?:\.\d+)?)(,?)$/g, '<span class="punct">:</span> <span class="num-bool">$2</span><span class="punct">$3</span>')
    escaped = escaped.replace(/([\{\}\[\]\,])/g, '<span class="punct">$1</span>')
    return <span style={{ fontWeight: 'bold',
    fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", "Courier New", monospace' }} dangerouslySetInnerHTML={{ __html: escaped }} />
  }

  if (!arePropsValid) {
    return <StatusMessage style={{ color: '#ff5370', fontWeight: 'bold' }}>Ошибка: Невалидный JSON формат!</StatusMessage>
  }
  
  if (errorMessage) {
    return (
      <Container style={{ borderColor: '#ff5370' }}>
        <Header style={{ backgroundColor: '#1a2327', color: '#ff5370' }}>
          <span>🚨 Ошибка отладки</span>
        </Header>
        <StatusMessage style={{ textAlign: 'left', color: '#ff5370' }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', margin: 0 }}>{errorMessage}</pre>
        </StatusMessage>
      </Container>
    )
  }

  // Реф на внутренний скролл-контейнер для вертикального перемещения
  // const localContainerRef = useRef<HTMLDivElement>(null)

  // const handleVerticalScroll = (direction: 'top' | 'bottom') => {
  //   const el = localContainerRef.current
  //   if (!el) return
    
  //   el.scrollTo({
  //     top: direction === 'top' ? 0 : el.scrollHeight,
  //     behavior: 'smooth'
  //   })
  // }

  // --- Компонент Одиночной Строки (Построчный Режим Line-by-Line) ---
  const LineRow = ({ index }: { index: number }) => {
    const line = diffResult[index]
    if (!line) return null

    let sign = ' '
    if (line.type === 'added') sign = '+'
    if (line.type === 'removed') sign = '-'
    if (line.commaOnly) sign = '≠'

    return (
      <SmartCodeLine $type={line.type} $commaOnly={line.commaOnly}>
        <Sign $type={line.type} $commaOnly={line.commaOnly}>{sign}</Sign>
        <Content>{highlightJsonLine(line.value)}</Content>
      </SmartCodeLine>
    )
  }

  // --- Компонент Парной Строки (Двухколоночный Режим Side-by-Side) ---
  const SideRow = ({ index }: { index: number }) => {
    const pair = sideBySidePairs[index]
    if (!pair) return null

    const { left, right } = pair

    return (
      <SideBySideGridRow>
        <Column>
          {left ? (
            <SmartCodeLine $type={left.type} $commaOnly={left.commaOnly}>
              <Sign $type={left.type} $commaOnly={left.commaOnly}>{left.commaOnly ? '≠' : '-'}</Sign>
              <Content>{highlightJsonLine(left.value)}</Content>
            </SmartCodeLine>
          ) : (
            <SmartCodeLine $type="empty" style={{ opacity: 0.05 }}>
              <Sign $type="empty">&nbsp;</Sign>
              <Content />
            </SmartCodeLine>
          )}
        </Column>
        <Column>
          {right ? (
            <SmartCodeLine $type={right.type} $commaOnly={right.commaOnly}>
              <Sign $type={right.type} $commaOnly={right.commaOnly}>{right.commaOnly ? '≠' : '+'}</Sign>
              <Content>{highlightJsonLine(right.value)}</Content>
            </SmartCodeLine>
          ) : (
            <SmartCodeLine $type="empty" style={{ opacity: 0.05 }}>
              <Sign $type="empty">&nbsp;</Sign>
              <Content />
            </SmartCodeLine>
          )}
        </Column>
      </SideBySideGridRow>
    )
  }

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    diffResult.forEach(l => {
      if (l.commaOnly) return
      if (l.type === 'added') added++
      if (l.type === 'removed') removed++
    })
    return { added, removed }
  }, [diffResult])

  const renderListContent = () => {
    if (isProcessing && diffResult.length === 0) {
      return <StatusMessage>🔄 Вычисляем различия в фоне...</StatusMessage>
    }

    const itemCount = viewMode === 'side' ? sideBySidePairs.length : diffResult.length
    const RowComponent = viewMode === 'side' ? SideRow : LineRow

    return (
      <AutoHeightContainer>
        {Array.from({ length: itemCount }).map((_, index) => (
          <RowComponent key={index} index={index} />
        ))}
      </AutoHeightContainer>
    )
  }

  return (
    <Container>
      <Header>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <span>Сравнение JSON структур</span>
            <span style={{ fontSize: '12px', fontWeight: 'bold', display: 'flex', gap: '8px' }}>
              {isProcessing ? (
                '🔄'
              ) : diffResult.length > 0 ? (
                <>
                  <span style={{ color: '#c3e88d', fontWeight: 'bold' }}>+{stats.added}</span>
                  <span style={{ color: '#ff5370', fontWeight: 'bold' }}>-{stats.removed}</span>
                </>
              ) : (
                '⏳'
              )}
            </span>
          </div>
          <ToggleButtonGroup>
            <ToggleButton $active={viewMode === 'line'} onClick={() => setViewMode('line')}>
              Line-by-Line
            </ToggleButton>
            <ToggleButton $active={viewMode === 'side'} onClick={() => setViewMode('side')}>
              Side-by-Side
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </Header>

      <ScrollWrapper>
        {/* Контейнер теперь полностью резиновый по вертикали. */}
        {/* На мобилках при viewMode === 'side' автоматически активируется горизонтальный scroll-snap */}
        <ListWrapper $viewMode={viewMode}>
          {renderListContent()}
        </ListWrapper>
      </ScrollWrapper>
    </Container>
  )
}

JSONComparison.displayName = 'JSONComparison'
