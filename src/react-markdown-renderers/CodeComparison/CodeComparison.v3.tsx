import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { CodeRendererMaterialOceanic } from '../CodeRenderer'

interface IDiffLine {
  type: 'normal' | 'removed' | 'added' | 'empty'
  text: string
}

interface ICodeComparisonProps {
  oldCodeBase64?: string
  newCodeBase64?: string
  oldCodeRaw?: string
  newCodeRaw?: string
  hideInputs?: boolean
  language?: string
}

// --- Тонкая интеграция ваших идеальных Styled-компонентов ---
const Container = styled.div`
  width: 100%;
  border-radius: 8px;
  @media (max-width: 768px) {
    width: calc(100% + 32px);
    transform: translateX(-16px);
    border-radius: 0px;
  }
  background-color: #263238;
  overflow: hidden;
  box-sizing: border-box;
  // border: 1px solid rgba(84, 110, 122, 0.2);
`
const Header = styled.div`
  padding: 10px 16px;
  background-color: #1a2327;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #b0bec5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // border-bottom: 1px solid rgba(84, 110, 122, 0.1);
`
const ToggleButtonGroup = styled.div`
  display: flex;
  background-color: #263238;
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
const SideBySideGridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(84, 110, 122, 0.1);
  // border-bottom: 2px dashed #1a2327;

  @media (max-width: 768px) {
    display: flex;
    width: 200%;
  }
`
const Column = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  
  &:first-child {
    border-right: 1px solid #1a2327;
  }

  @media (max-width: 768px) {
    width: 50%;
    min-width: 50%;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    
    &:first-child {
      border-right: none;
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
    if (props.$type === 'empty') return '#1e272c';
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

  /* Интегрируем сброс для изоморфного CodeRendererMaterialOceanic */
  & pre, & code {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    display: inline !important;
    white-space: pre-wrap !important;
  }
`
const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: #546e7a;
`

const decodeBase64 = (str?: string): string => {
  if (!str) return ''
  try {
    return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
  } catch (e) {
    return '/* Error decoding base64 */'
  }
}

export const CodeComparison = ({ oldCodeBase64, newCodeBase64, oldCodeRaw, newCodeRaw, language = 'javascript' }: ICodeComparisonProps) => {
  const initialOld = useMemo(() => oldCodeBase64 ? decodeBase64(oldCodeBase64) : oldCodeRaw || '', [oldCodeBase64, oldCodeRaw])
  const initialNew = useMemo(() => newCodeBase64 ? decodeBase64(newCodeBase64) : newCodeRaw || '', [newCodeBase64, newCodeRaw])

  const [viewMode, setViewMode] = useState<'line' | 'side'>('line')
  const [diffOld, setDiffOld] = useState<IDiffLine[]>([])
  const [diffNew, setDiffNew] = useState<IDiffLine[]>([])
  const [diffUnified, setDiffUnified] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    workerRef.current = new Worker('/static/common/min/render/code-diff.worker-3.js')
    workerRef.current.onmessage = (e: MessageEvent) => {
      const { resultOld, resultNew, resultUnified } = e.data
      setDiffOld(resultOld)
      setDiffNew(resultNew)
      setDiffUnified(resultUnified)
      setIsProcessing(false)
    }
    return () => workerRef.current?.terminate()
  }, [])

  useEffect(() => {
    if (!workerRef.current) return
    setIsProcessing(true)
    workerRef.current.postMessage({ oldCode: initialOld, newCode: initialNew })
  }, [initialOld, initialNew])

  const getSign = (type: string) => {
    if (type === 'added') return '+'
    if (type === 'removed') return '-'
    return ' '
  }

  return (
    <Container className='code-comparison'>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Code</span>
          {isProcessing && <span style={{ color: '#ff9e3b', fontSize: '11px' }}>⚡ Расчет...</span>}
        </div>
        <ToggleButtonGroup>
          <ToggleButton $active={viewMode === 'side'} onClick={() => setViewMode('side')}>
            Side
          </ToggleButton>
          <ToggleButton $active={viewMode === 'line'} onClick={() => setViewMode('line')}>
            Line
          </ToggleButton>
        </ToggleButtonGroup>
      </Header>

      <AutoHeightContainer>
        <ListWrapper $viewMode={viewMode}>
          {viewMode === 'side' ? (
            /* РЕНДЕР: ДВЕ КОЛОНКИ (Side-by-Side + Мобильный свайпер) */
            diffOld.map((oldLine, idx) => {
              const newLine = diffNew[idx]
              return (
                <SideBySideGridRow key={`side-row-${idx}`}>
                  {/* Левая колонка: БЫЛО */}
                  <Column>
                    <SmartCodeLine $type={oldLine.type}>
                      <Sign $type={oldLine.type}>{getSign(oldLine.type)}</Sign>
                      <Content>
                        {oldLine.type !== 'empty' && (
                          <CodeRendererMaterialOceanic language={language} value={oldLine.text} />
                        )}
                      </Content>
                    </SmartCodeLine>
                  </Column>
                  
                  {/* Правая колонка: СТАЛО */}
                  <Column>
                    <SmartCodeLine $type={newLine?.type || 'empty'}>
                      <Sign $type={newLine?.type || 'empty'}>{getSign(newLine?.type || '')}</Sign>
                      <Content>
                        {newLine && newLine.type !== 'empty' && (
                          <CodeRendererMaterialOceanic language={language} value={newLine.text} />
                        )}
                      </Content>
                    </SmartCodeLine>
                  </Column>
                </SideBySideGridRow>
              )
            })
          ) : (
            /* РЕНДЕР: ОДНА КОЛОНКА (Unified View / Line) */
            diffUnified.map((line, idx) => (
              <SmartCodeLine key={`line-row-${idx}`} $type={line.type}>
                <Sign $type={line.type}>{getSign(line.type)}</Sign>
                <Content>
                  <CodeRendererMaterialOceanic language={language} value={line.text} />
                </Content>
              </SmartCodeLine>
            ))
          )}
        </ListWrapper>
      </AutoHeightContainer>
    </Container>
  )
}

CodeComparison.displayName = 'CodeComparison'
