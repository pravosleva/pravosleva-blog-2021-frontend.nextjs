import React, { useMemo, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { isValidJson } from '~/utils/isValidJson'
import { createDiffWorker } from '~/utils/diffWorker'

type TProps = {
  json1: string;
  json2: string;
  height?: number;
}

interface IDiffLine {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  commaOnly?: boolean;
}

const VIRTUALIZATION_THRESHOLD = 1000

const Container = styled.div`
  width: 100%;
  border: 1px solid #546e7a;
  border-radius: 6px;
  background-color: #263238;
  overflow: hidden;
  box-sizing: border-box;
`

const Header = styled.div`
  padding: 10px 16px;
  background-color: #1a2327;
  border-bottom: 1px solid #546e7a;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #b0bec5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ListWrapper = styled.div`
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace !important;
  font-size: 13px;
  background-color: #263238 !important;
  color: #b0bec5 !important;
  
  & ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  & ::-webkit-scrollbar-track {
    background: #1a2327;
  }
  & ::-webkit-scrollbar-thumb {
    background: #546e7a;
    border-radius: 4px;
  }
  & ::-webkit-scrollbar-thumb:hover {
    background: #80cbc4;
  }
`

const FallbackScrollContainer = styled.div<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  overflow-y: auto;
  width: 100%;
`

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
  height: 24px;
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
  white-space: pre;
  line-height: 24px;
  padding-right: 16px;
  overflow-x: auto;
  font-family: inherit;
  color: #b0bec5 !important;

  & span.key { color: #80cbc4; }
  & span.punct { color: #89ddff; }
  & span.str { color: #c3e88d; }
  & span.num-bool { color: #f77669; }
`

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #546e7a;
`

export default function JSONComparisonClient({ json1, json2, height = 500 }: TProps) {
  const [diffResult, setDiffResult] = useState<IDiffLine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [VirtualList, setVirtualList] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const workerRef = useRef<Worker | null>(null)
  const arePropsValid = useMemo(() => isValidJson(json1) && isValidJson(json2), [json1, json2])
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

  const hasChanges = useMemo(() => diffResult.some(l => l.type !== 'unchanged'), [diffResult])

  const highlightJsonLine = (lineText: string) => {
    if (!lineText) return '';
    
    let escaped = lineText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    escaped = escaped.replace(/^(\s*)"([^"]+)"(\s*:)/g, '$1<span class="key">"$2"</span><span class="punct">$3</span>');
    escaped = escaped.replace(/(:\s*)"([^"]*)"(,?)$/g, '<span class="punct">:</span> <span class="str">"$2"</span><span class="punct">$3</span>');
    escaped = escaped.replace(/(:\s*)(true|false|null|\d+(?:\.\d+)?)(,?)$/g, '<span class="punct">:</span> <span class="num-bool">$2</span><span class="punct">$3</span>');
    escaped = escaped.replace(/([\{\}\[\]\,])/g, '<span class="punct">$1</span>');

    return <span dangerouslySetInnerHTML={{ __html: escaped }} />;
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
        <Content>{highlightJsonLine(line.value)}</Content>
      </CodeLine>
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

    if (!isHeavyList) {
      return (
        <AutoHeightContainer>
          {diffResult.map((_, index) => (
            <Row key={index} index={index} />
          ))}
        </AutoHeightContainer>
      )
    }

    if (!VirtualList) {
      return (
        <FallbackScrollContainer $height={height}>
          {diffResult.map((_, index) => (
            <Row key={index} index={index} />
          ))}
        </FallbackScrollContainer>
      )
    }

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
        <span>Построчное сравнение структуры</span>
        <span style={{ fontSize: '12px', fontWeight: 'normal', display: 'flex', gap: '8px' }}>
          {isProcessing ? (
            '🔄 Расчет в Web Worker...'
          ) : hasChanges ? (
            <>
              <span style={{ color: '#c3e88d' }}>+{stats.added}</span>
              <span style={{ color: '#ff5370' }}>-{stats.removed}</span>
            </>
          ) : (
            <span style={{ color: '#80cbc4' }}>✅ Идентичны</span>
          )}
        </span>
      </Header>

      <ListWrapper>
        {renderListContent()}
      </ListWrapper>
    </Container>
  )
}

JSONComparisonClient.displayName = 'JSONComparisonClient'
