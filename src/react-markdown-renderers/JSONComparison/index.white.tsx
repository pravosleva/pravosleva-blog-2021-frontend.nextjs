import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { isValidJson } from '~/utils/isValidJson'
import { createDiffWorker } from '~/utils/diffWorker'

type TProps = {
  json1: string;
  json2: string;
  height?: number; // Высота скролл-бокса для больших файлов (дефолт 500)
}

interface IDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  commaOnly?: boolean;
}

// Порог включения виртуализации
const VIRTUALIZATION_THRESHOLD = 1000

const Container = styled.div`
  width: 100%;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  background-color: #ffffff;
  overflow: hidden;
  box-sizing: border-box;
`

const Header = styled.div`
  padding: 10px 16px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #d0d7de;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

// 1. Принудительно задаем шрифт для всего оберточного контейнера списков
const ListWrapper = styled.div`
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 12px;
  background-color: #ffffff;
  
  & ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  & ::-webkit-scrollbar-track {
    background: #f6f8fa;
  }
  & ::-webkit-scrollbar-thumb {
    background: #d0d7de;
    border-radius: 4px;
  }
  & ::-webkit-scrollbar-thumb:hover {
    background: #afb8c1;
  }
`

// 2. Указываем знакам наследовать моноширинный шрифт
const Sign = styled.div<ICodeLineProps>`
  width: 30px;
  min-width: 30px;
  text-align: center;
  user-select: none;
  font-weight: bold;
  line-height: 24px;
  // font-family: inherit; // Принудительное наследование
  color: ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#bf8700';
    if (props.$type === 'added') return '#1a7f37';
    if (props.$type === 'removed') return '#cf222e';
    return '#8c95a0';
  }};
`

// 3. Указываем тексту JSON наследовать моноширинный шрифт
const Content = styled.div`
  flex-grow: 1;
  white-space: pre;
  line-height: 24px;
  padding-right: 16px;
  overflow-x: auto;
  font-family: monospace, systen-ui; /* Принудительное наследование */
  font-weight: bold;
  color: #000000 !important; /* Принудительно черный цвет текста для всех строк */
`

// Контейнер для больших файлов, когда виртуализация не смогла загрузиться
const FallbackScrollContainer = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  overflow-y: auto;
  width: 100%;
`

// Контейнер для маленьких файлов: высота подстраивается автоматически, скролла нет
const AutoHeightContainer = styled.div`
  width: 100%;
  height: auto;
`

interface ICodeLineProps {
  $type: IDiffLine['type'];
  $commaOnly?: boolean;
}

const CodeLine = styled.div<ICodeLineProps>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  height: 24px; /* Фиксируем высоту строки для всех режимов */
  
  background-color: ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#fff8c5';
    if (props.$type === 'added') return '#dafbe1';
    if (props.$type === 'removed') return '#ffebe9';
    return 'transparent';
  }};
  border-left: 4px solid ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#db9d04';
    if (props.$type === 'added') return '#2da44e';
    if (props.$type === 'removed') return '#cf222e';
    return 'transparent';
  }};
`

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #57606a;
`

export const JSONComparison = ({ json1, json2, height = 500 }: TProps) => {
  const [diffResult, setDiffResult] = useState<IDiffLine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [VirtualList, setVirtualList] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const workerRef = useRef<Worker | null>(null)
  const arePropsValid = useMemo(() => isValidJson(json1) && isValidJson(json2), [json1, json2])

  // Решаем, нужен ли тяжелый режим виртуализации для текущего набора данных
  const isHeavyList = useMemo(() => diffResult.length > VIRTUALIZATION_THRESHOLD, [diffResult.length])

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

    // Подгружаем библиотеку лениво. Если список маленький, она даже не будет вызываться.
    const name = ['react', 'window'].join('-')
    import(`${name}`)
      .then((mod) => {
        const listComp = mod.FixedSizeList || mod.default?.FixedSizeList || (mod as any).default
        if (listComp) {
          setVirtualList(() => listComp)
        }
      })
      .catch((importError) => {
        console.warn('[JSONComparison] Динамический импорт react-window не удался. Включен фолбек-режим.', importError)
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
        throw new Error('Worker не готов к работе')
      }
    } catch (prepareError: any) {
      setErrorMessage(`Ошибка подготовки: ${prepareError?.message || prepareError}`)
      setIsProcessing(false)
    }
  }, [json1, json2, arePropsValid])

  const hasChanges = useMemo(() => diffResult.some(l => l.type !== 'unchanged'), [diffResult])

  if (!arePropsValid) {
    return <StatusMessage style={{ color: '#cf222e', fontWeight: 'bold' }}>Ошибка: Невалидный JSON формат!</StatusMessage>
  }

  if (errorMessage) {
    return (
      <Container>
        <Header style={{ backgroundColor: '#ffebe9', color: '#cf222e' }}>
          <span>🚨 Ошибка отладки компонента</span>
        </Header>
        <StatusMessage style={{ textAlign: 'left', color: '#cf222e', backgroundColor: '#fff8f7' }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '11px', margin: 0 }}>{errorMessage}</pre>
        </StatusMessage>
      </Container>
    )
  }

  const Row = ({ index, style }: { index: number; style?: React.CSSProperties }) => {
    const line = diffResult[index]
    if (!line) return null

    let sign = ' '
    if (line.type === 'added') sign = '+'
    if (line.type === 'removed') sign = '-'
    if (line.commaOnly) sign = '≠'

    return (
      <CodeLine style={style} $type={line.type} $commaOnly={line.commaOnly}>
        <Sign $type={line.type} $commaOnly={line.commaOnly}>{sign}</Sign>
        <Content>{line.value}</Content>
      </CodeLine>
    )
  }

  const stats = useMemo(() => {
    let added = 0
    let removed = 0
    let commaChanges = 0 // Дополнительно можем считать изменения запятых

    diffResult.forEach(l => {
      // Если строка изменилась ТОЛЬКО из-за запятой, не плюсуем её к зеленым/красным
      if (l.commaOnly) {
        if (l.type === 'added') commaChanges++ // Считаем пары или штуки, если нужно
        return
      }
      
      if (l.type === 'added') added++
      if (l.type === 'removed') removed++
    })
    
    return { added, removed, commaChanges }
  }, [diffResult])

  // Умный выбор рендерера
  const renderListContent = () => {
    if (isProcessing && diffResult.length === 0) {
      return <StatusMessage>🔄 Вычисляем различия в фоне...</StatusMessage>
    }

    // Режим 1: Строк мало (до 1000). Рендерим обычный список, который тянется по высоте контента
    if (!isHeavyList) {
      return (
        <AutoHeightContainer>
          {diffResult.map((_, index) => (
            <Row key={index} index={index} />
          ))}
        </AutoHeightContainer>
      )
    }

    // Режим 2: Строк много, но библиотека виртуализации не успела/не смогла загрузиться
    if (!VirtualList) {
      return (
        <FallbackScrollContainer $height={height}>
          {diffResult.map((_, index) => (
            <Row key={index} index={index} />
          ))}
        </FallbackScrollContainer>
      )
    }

    // Режим 3: Строк много (> 1000) и библиотека готова. Включаем полноценный быстрый виртуальный список
    return (
      <VirtualList
        height={height}
        itemCount={diffResult.length}
        itemSize={24}
        width="100%"
      >
        {Row}
      </VirtualList>
    )
  }

  return (
    <Container>
      <Header>
        <span style={{ color: '#000' }}>Построчное сравнение структуры</span>
        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#57606a', display: 'flex', gap: '8px' }}>
          {isProcessing ? (
            '🔄 Вычисления в Web Worker...'
          ) : hasChanges ? (
            <>
              <span style={{ color: '#2da44e' }}>+{stats.added}</span>
              <span style={{ color: '#cf222e' }}>-{stats.removed}</span>
            </>
          ) : (
            '✅ Идентичны'
          )}
        </span>
      </Header>

      <ListWrapper>
        {renderListContent()}
      </ListWrapper>
    </Container>
  )
}

JSONComparison.displayName = 'JSONComparison'
