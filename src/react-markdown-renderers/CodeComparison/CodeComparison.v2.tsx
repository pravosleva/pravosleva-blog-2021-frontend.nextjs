import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'
import { CodeRendererMaterialOceanic } from '../CodeRenderer' // Укажите правильный относительный путь к вашему файлу

// Добавляем поддержку пропса языка в интерфейс компонента
interface ICodeComparisonProps {
  oldCodeBase64?: string
  newCodeBase64?: string
  oldCodeRaw?: string
  newCodeRaw?: string
  hideInputs?: boolean
  language?: string // Новый пропс для гибкой настройки (по умолчанию 'javascript')
}

interface IDiffLine {
  type: 'normal' | 'deleted' | 'added' | 'modified-old' | 'modified-new' | 'empty'
  text: string
  num: number | null
}

interface IUnifiedLine {
  type: string
  text: string
  oldNum: number | null
  newNum: number | null
}

interface ICodeComparisonProps {
  oldCodeBase64?: string // Старый код в Base64 (Рекомендуется для MDX)
  newCodeBase64?: string // Новый код в Base64 (Рекомендуется для MDX)
  oldCodeRaw?: string     // Старый код обычным текстом
  newCodeRaw?: string     // Новый код обычным текстом
  hideInputs?: boolean    // Флаг, чтобы скрыть текстовые поля ввода внутри самой статьи
}
// Вспомогательный безопасный декодер строк
const decodeBase64 = (str?: string): string => {
  if (!str) return ''
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch (e) {
    console.error('[CodeComparison] Ошибка декодирования Base64:', e)
    return '/* Ошибка декодирования кода */'
  }
}

// --- Styled Components ---
const Container = styled.div`
  background-color: #263238;
  border: 1px solid #455a64;
  border-radius: 6px;
  overflow: hidden;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Toolbar = styled.div`
  background-color: #1a2327;
  padding: 10px 16px;
  border-bottom: 1px solid #37474f;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eceff1;
  font-size: 13px;
`

const ButtonGroup = styled.div`
  display: flex;
  background-color: #212d31;
  border: 1px solid #455a64;
  border-radius: 4px;
  overflow: hidden;
`

const ModeButton = styled.button<{ $active: boolean }>`
  background-color: ${props => props.$active ? '#80cbc4' : 'transparent'};
  color: ${props => props.$active ? '#1a2327' : '#90a4ae'};
  border: none;
  padding: 4px 12px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  &:hover {
    color: ${props => props.$active ? '#1a2327' : '#eeffff'};
    background-color: ${props => props.$active ? '#80cbc4' : 'rgba(128, 203, 196, 0.1)'};
  }
`

// src/components/CodeComparison/index.tsx

const SplitView = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  background-color: #263238;
  
  /* --- CSS Scroll Snap для мобилок --- */
  @media (max-width: 768px) {
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }
`

const CodePane = styled.div`
  flex: 1;
  width: 50%;
  overflow-y: hidden;
  border-right: 1px solid #37474f;
  
  &:last-child {
    border-right: none;
  }

  /* --- Адаптация панели под свайпы пальцем --- */
  @media (max-width: 768px) {
    min-width: 100%; /* Каждая панель занимает ровно 100% экрана смартфона */
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: center; /* Жестко фиксируем панель по центру экрана после свайпа */
    scroll-snap-stop: always;  
    overflow-x: auto; /* Чтобы длинные строки внутри панели можно было скроллить вбок */
  }
`

// Небольшая подсказка-индикатор для мобильных пользователей над панелью
const MobileSwipeHint = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    background-color: #21272a;
    padding: 6px 16px;
    font-size: 11px;
    color: #80cbc4;
    text-align: center;
    border-bottom: 1px solid #37474f;
    font-style: italic;
  }
`

const UnifiedViewContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background-color: #263238;
`

const PaneTitle = styled.div`
  background-color: #21272a;
  padding: 6px 12px;
  font-size: 11px;
  color: #90a4ae;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #37474f;
`

const LineRow = styled.div<{ $type: string }>`
  display: flex;
  line-height: 20px;
  font-size: 13px;
  white-space: pre;
  background-color: ${props => {
    switch (props.$type) {
      case 'deleted': return 'rgba(239, 83, 80, 0.15)'
      case 'added': return 'rgba(195, 232, 141, 0.15)'
      case 'modified-old': return 'rgba(128, 203, 196, 0.12)'
      case 'modified-new': return 'rgba(128, 203, 196, 0.2)'
      case 'empty': return '#1e272c'
      default: return 'transparent'
    }
  }};
`

const LineNumber = styled.div`
  width: 45px;
  text-align: right;
  padding-right: 12px;
  color: #546e7a;
  user-select: none;
  background-color: #212d31;
  font-size: 11px;
`

// const CodeText = styled.div<{ $type: string }>`
//   padding-left: 12px;
//   flex: 1;
//   color: ${props => {
//     switch (props.$type) {
//       case 'deleted': return '#ff5370'
//       case 'added': return '#c3e88d'
//       case 'modified-old':
//       case 'modified-new': return '#80cbc4'
//       case 'empty': return '#546e7a'
//       default: return '#eeffff'
//     }
//   }};
  
//   &::before {
//     content: ${props => {
//       if (props.$type === 'deleted' || props.$type === 'modified-old') return '"- "'
//       if (props.$type === 'added' || props.$type === 'modified-new') return '"+ "'
//       return '"  "'
//     }};
//     color: inherit;
//     opacity: 0.5;
//   }
// `
const CodeText = styled.div<{ $type: string }>`
  padding-left: 12px;
  flex: 1;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  overflow-x: auto;
  
  color: ${props => {
    switch (props.$type) {
      case 'deleted': return '#ff5370'
      case 'added': return '#c3e88d'
      default: return '#eeffff'
    }
  }};
  
  &::before {
    content: ${props => {
      if (props.$type === 'deleted' || props.$type === 'modified-old') return '"- "'
      if (props.$type === 'added' || props.$type === 'modified-new') return '"+ "'
      return '"  "'
    }};
    color: inherit;
    opacity: 0.5;
  }

  /* Сбрасываем внутренние отступы, фоны и скроллы вашего стандартного pre/code, 
     чтобы строки диффа не превращались в отдельные независимые блоки */
  & pre, & code {
    background: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    box-shadow: none !important;
    display: inline !important;
    white-space: pre !important;
  }
`

const InputsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  width: 100%;
`

const TextAreaWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 12px;
  color: #90a4ae;
`

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 120px;
  background-color: #1a2327;
  border: 1px solid #455a64;
  border-radius: 4px;
  padding: 12px;
  color: #eeffff;
  font-family: monospace;
  font-size: 13px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #80cbc4;
  }
`

export const CodeComparison = ({ 
  oldCodeBase64, 
  newCodeBase64, 
  oldCodeRaw, 
  newCodeRaw,
  hideInputs = false,
  language = 'js'
}: ICodeComparisonProps) => {
   // Вычисляем начальный код на основе переданных пропсов
  const initialOld = useMemo(() => {
    if (oldCodeBase64) return decodeBase64(oldCodeBase64)
    return oldCodeRaw || '// Старый код'
  }, [oldCodeBase64, oldCodeRaw])

  const initialNew = useMemo(() => {
    if (newCodeBase64) return decodeBase64(newCodeBase64)
    return newCodeRaw || '// Новый код'
  }, [newCodeBase64, newCodeRaw])

  const [oldCode, setOldCode] = useState<string>(initialOld)
  const [newCode, setNewCode] = useState<string>(initialNew)

  // Переинициализируем стейты, если пропсы динамически изменились
  useEffect(() => { setOldCode(initialOld) }, [initialOld])
  useEffect(() => { setNewCode(initialNew) }, [initialNew])

  // const [oldCode, setOldCode] = useState<string>('const a = 10;\nconsole.log(a);')
  // const [newCode, setNewCode] = useState<string>('const a = 20;\nconsole.log(a);\nconsole.log("Done");')

  // Режим отображения: 'split' (2 колонки) или 'unified' (1 колонка)
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split')

  const [diffOld, setDiffOld] = useState<IDiffLine[]>([])
  const [diffNew, setDiffNew] = useState<IDiffLine[]>([])
  const [diffUnified, setDiffUnified] = useState<IUnifiedLine[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const workerRef = useRef<Worker | null>(null)
  const leftPaneRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    workerRef.current = new Worker('/static/common/render/code-diff.worker-2.js')

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
    workerRef.current.postMessage({ oldCode, newCode })
  }, [oldCode, newCode])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
    if (!targetRef.current || viewMode === 'unified') return
    targetRef.current.scrollTop = e.currentTarget.scrollTop
  }

  return (
    <div style={{ width: '100%' }} className='code-comparison'>
      
      {!hideInputs && (
        <InputsContainer>
          <TextAreaWrapper>
            <Label>Оригинальный код (Старый)</Label>
            <StyledTextArea value={oldCode} onChange={(e) => setOldCode(e.target.value)} />
          </TextAreaWrapper>
          <TextAreaWrapper>
            <Label>Модифицированный код (Новый)</Label>
            <StyledTextArea value={newCode} onChange={(e) => setNewCode(e.target.value)} />
          </TextAreaWrapper>
        </InputsContainer>
      )}

      <Container>
        <Toolbar>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>💻 Code Diff Engine</span>
            <span style={{ color: '#80cbc4', fontSize: '11px' }}>
              {isProcessing ? '⚡ Расчет...' : '✨ Синхронизировано'}
            </span>
          </div>
          
          {/* Переключатель режимов отображения */}
          <ButtonGroup>
            <ModeButton $active={viewMode === 'split'} onClick={() => setViewMode('split')}>
              ⇄ Split
            </ModeButton>
            <ModeButton $active={viewMode === 'unified'} onClick={() => setViewMode('unified')}>
              ☰ Unified
            </ModeButton>
          </ButtonGroup>
        </Toolbar>

        {viewMode === 'split' ? (
          /* РЕНДЕР: ДВЕ КОЛОНКИ (Split View + Мобильный свайпер) */
          <>
            {/* Подсказка появится только на экранах смартфонов */}
            <MobileSwipeHint>← Проведите пальцем (свайп) для сравнения кода →</MobileSwipeHint>
    
            {/* РЕНДЕР: ДВЕ КОЛОНКИ (Split View) */}
            <SplitView>
              <CodePane 
                ref={leftPaneRef} 
                onScroll={(e) => handleScroll(e, rightPaneRef)}
                style={{ overflowY: 'auto', maxHeight: '400px' }}
              >
                <PaneTitle>Original Build</PaneTitle>
                {diffOld.map((line, index) => (
                  <LineRow key={`old-l-${index}`} $type={line.type}>
                    <LineNumber>{line.num ?? '~'}</LineNumber>
                    {/* <CodeText $type={line.type}>{line.text}</CodeText> */}
                    <CodeText $type={line.type}>
                      {line.type === 'empty' ? (
                        ''
                      ) : (
                        <CodeRendererMaterialOceanic 
                          language={language || 'javascript'} 
                          value={line.text} // Если ваш компонент принимает строку через value
                        />
                        /* Примечание: Если ваш компонент принимает код как children, 
                          напишите так: <CodeRendererMaterialOceanic language={language}>{line.text}</CodeRendererMaterialOceanic> */
                      )}
                    </CodeText>
                  </LineRow>
                ))}
              </CodePane>

              <CodePane 
                ref={rightPaneRef} 
                onScroll={(e) => handleScroll(e, leftPaneRef)}
                style={{ overflowY: 'auto', maxHeight: '400px' }}
              >
                <PaneTitle>Modified Build</PaneTitle>
                {diffNew.map((line, index) => (
                  <LineRow key={`new-l-${index}`} $type={line.type}>
                    <LineNumber>{line.num ?? '~'}</LineNumber>
                    <CodeText $type={line.type}>{line.text}</CodeText>
                  </LineRow>
                ))}
              </CodePane>
            </SplitView>
          </>
        ) : (
          /* РЕНДЕР: ОДНА ОБЩАЯ КОЛОНКА (Unified View) */
          <UnifiedViewContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <PaneTitle>Unified Stream</PaneTitle>
            {diffUnified.map((line, index) => (
              <LineRow key={`uni-l-${index}`} $type={line.type}>
                {/* Выводим два блока номеров строк: для старого файла и для нового */}
                <LineNumber>{line.oldNum ?? '-'}</LineNumber>
                <LineNumber style={{ borderRight: '1px solid #37474f' }}>{line.newNum ?? '-'}</LineNumber>
                {/* <CodeText $type={line.type}>{line.text}</CodeText> */}
                <CodeText $type={line.type}>
                  {line.type === 'empty' ? (
                    ''
                  ) : (
                    <CodeRendererMaterialOceanic 
                      language={language || 'javascript'} 
                      value={line.text}
                    />
                  )}
                </CodeText>
              </LineRow>
            ))}
          </UnifiedViewContainer>
        )}
      </Container>
    </div>
  )
}

CodeComparison.displayName = 'CodeComparison'
