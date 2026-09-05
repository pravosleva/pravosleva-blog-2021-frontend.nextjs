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

const Container = styled.div`
  width: 100%;
  border: 1px solid #d0d7de;
  border-radius: 6px;
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

const ListWrapper = styled.div`
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
  font-size: 12px;
  background-color: #ffffff;
`

interface ICodeLineProps {
  $type: IDiffLine['type'];
  $commaOnly?: boolean;
}

const CodeLine = styled.div<ICodeLineProps>`
  display: flex;
  width: 100%;
  box-sizing: border-box;
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

const Sign = styled.div<ICodeLineProps>`
  width: 30px;
  min-width: 30px;
  text-align: center;
  user-select: none;
  font-weight: bold;
  line-height: 24px;
  color: ${(props: ICodeLineProps) => {
    if (props.$commaOnly) return '#bf8700';
    if (props.$type === 'added') return '#1a7f37';
    if (props.$type === 'removed') return '#cf222e';
    return '#8c95a0';
  }};
`

const Content = styled.div`
  flex-grow: 1;
  white-space: pre;
  line-height: 24px;
  padding-right: 16px;
  overflow-x: auto;
`

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #57606a;
`

export default function JSONComparisonClient({ json1, json2, height = 500 }: TProps) {
  const [diffResult, setDiffResult] = useState<IDiffLine[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [VirtualList, setVirtualList] = useState<any>(null)
  const workerRef = useRef<Worker | null>(null)

  const arePropsValid = useMemo(() => isValidJson(json1) && isValidJson(json2), [json1, json2])

  useEffect(() => {
    workerRef.current = createDiffWorker()
    workerRef.current.onmessage = (e: MessageEvent) => {
      setDiffResult(e.data)
      setIsProcessing(false)
    }

    // Загружаем модуль динамически, полностью скрывая его имя от статического компилятора Webpack
    const name = ['react', 'window'].join('-')
    
    // @ts-ignore
    import(`${name}`)
      .then((mod) => {
        const listComp = mod.FixedSizeList || mod.default?.FixedSizeList || (mod as any).default
        if (listComp) {
          setVirtualList(() => listComp)
        }
      })
      .catch((err) => console.error('Ошибка загрузки react-window:', err))

    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    if (!arePropsValid) return
    setIsProcessing(true)

    const oldLines = JSON.stringify(JSON.parse(json1), null, 2).split('\n')
    const newLines = JSON.stringify(JSON.parse(json2), null, 2).split('\n')

    workerRef.current?.postMessage({ oldLines, newLines })
  }, [json1, json2, arePropsValid])

  const hasChanges = useMemo(() => diffResult.some(l => l.type !== 'unchanged'), [diffResult])

  if (!arePropsValid) {
    return <StatusMessage style={{ color: '#cf222e', fontWeight: 'bold' }}>Ошибка: Невалидный JSON!</StatusMessage>
  }

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
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
    diffResult.forEach(l => {
      if (l.type === 'added') added++
      if (l.type === 'removed') removed++
    })
    return { added, removed }
  }, [diffResult])

  return (
    <Container>
      <Header>
        <span>Построчное сравнение структуры</span>
        <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#57606a', display: 'flex', gap: '8px' }}>
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
        {(!VirtualList || (isProcessing && diffResult.length === 0)) ? (
          <StatusMessage>Инициализация данных и списков...</StatusMessage>
        ) : (
          <VirtualList
            height={height}
            itemCount={diffResult.length}
            itemSize={24}
            width="100%"
          >
            {Row}
          </VirtualList>
        )}
      </ListWrapper>
    </Container>
  )
}
