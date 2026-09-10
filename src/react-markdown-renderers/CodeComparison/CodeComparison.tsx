import React, { useState, useEffect, useRef, useMemo } from 'react'
import styled from 'styled-components'

interface IDiffLine {
  type: 'normal' | 'deleted' | 'added' | 'modified-old' | 'modified-new' | 'empty'
  text: string
  num: number | null
}

// --- Styled Components в стиле Material Oceanic ---
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

const SplitView = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  background-color: #263238;
`

const CodePane = styled.div`
  flex: 1;
  width: 50%;
  overflow-y: hidden;
  border-right: 1px solid #37474f;
  &:last-child {
    border-right: none;
  }
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
      case 'deleted': return 'rgba(239, 83, 80, 0.15)' // Бледный красный
      case 'added': return 'rgba(195, 232, 141, 0.15)'   // Бледный зеленый
      case 'modified-old': return 'rgba(128, 203, 196, 0.12)' // Бирюзовый (измененный старый)
      case 'modified-new': return 'rgba(128, 203, 196, 0.2)'  // Бирюзовый сочный (новый)
      case 'empty': return '#1e272c' // Затемнение для пустых строк-заглушек
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

const CodeText = styled.div<{ $type: string }>`
  padding-left: 12px;
  flex: 1;
  color: ${props => {
    switch (props.$type) {
      case 'deleted': return '#ff5370' // Красный текст
      case 'added': return '#c3e88d'   // Зеленый текст
      case 'modified-old':
      case 'modified-new': return '#80cbc4' // Бирюзовый текст
      case 'empty': return '#546e7a'
      default: return '#eeffff'        // Дефолтный белый Material Oceanic
    }
  }};
  
  /* Добавляем маркеры изменений в начало строки */
  &::before {
    content: ${props => {
      if (props.$type === 'deleted' || props.$type === 'modified-old') return '"- "'
      if (props.$type === 'added' || props.$type === 'modified-new') return '"+ "'
      return '"  "'
    }};
    color: inherit;
    opacity: 0.5;
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
  font-weight: 500;
`

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 150px;
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

export const CodeComparison = () => {
  const [oldCode, setOldCode] = useState<string>('// Старый код\nconst a = 10;\nconsole.log(a);')
  const [newCode, setNewCode] = useState<string>('// Новый код\nconst a = 20;\nconsole.log(a);\nconsole.log("Финиш");')

  const [diffOld, setDiffOld] = useState<IDiffLine[]>([])
  const [diffNew, setDiffNew] = useState<IDiffLine[]>([])
  const [isProcessing, setIsMounted] = useState<boolean>(false)

  const workerRef = useRef<Worker | null>(null)

  // Связанный синхронный скролл колонок кода
  const leftPaneRef = useRef<HTMLDivElement>(null)
  const rightPaneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Инициализируем Web Worker строго на клиенте
    workerRef.current = new Worker('/static/workers/code-diff.worker.js')

    workerRef.current.onmessage = (e: MessageEvent) => {
      const { resultOld, resultNew } = e.data
      setDiffOld(resultOld)
      setDiffNew(resultNew)
      setIsMounted(false)
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  // Отправляем тяжелую задачу в Воркер при изменении любого инпута
  useEffect(() => {
    if (!workerRef.current) return

    setIsMounted(true)
    workerRef.current.postMessage({ oldCode, newCode })
  }, [oldCode, newCode])

  // Реализация синхронного вертикального скролла
  const handleScroll = (e: React.UIEvent<HTMLDivElement>, targetRef: React.RefObject<HTMLDivElement>) => {
    if (!targetRef.current) return
    targetRef.current.scrollTop = e.currentTarget.scrollTop
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Поля ввода исходного кода */}
      <InputsContainer>
        <TextAreaWrapper>
          <Label>Оригинальный код (Старый)</Label>
          <StyledTextArea 
            value={oldCode} 
            onChange={(e) => setOldCode(e.target.value)} 
            placeholder="Вставьте исходный код..."
          />
        </TextAreaWrapper>
        <TextAreaWrapper>
          <Label>Модифицированный код (Новый)</Label>
          <StyledTextArea 
            value={newCode} 
            onChange={(e) => setNewCode(e.target.value)} 
            placeholder="Вставьте измененный код..."
          />
        </TextAreaWrapper>
      </InputsContainer>

      {/* Окно визуального сравнения диффов */}
      <Container>
        <Toolbar>
          <span>💻 Code Diff Engine</span>
          <span style={{ color: '#80cbc4' }}>{isProcessing ? '⚡ Вычисления...' : '✨ Готово'}</span>
        </Toolbar>
        
        <SplitView>
          {/* Левое окно: Старый код */}
          <CodePane 
            ref={leftPaneRef} 
            onScroll={(e) => handleScroll(e, rightPaneRef)}
            style={{ overflowY: 'auto', maxHeight: '400px' }}
          >
            <PaneTitle>Original Build</PaneTitle>
            {diffOld.map((line, index) => (
              <LineRow key={`old-line-${index}`} $type={line.type}>
                <LineNumber>{line.num ?? '~'}</LineNumber>
                <CodeText $type={line.type}>{line.text}</CodeText>
              </LineRow>
            ))}
          </CodePane>

          {/* Правое окно: Новый код */}
          <CodePane 
            ref={rightPaneRef} 
            onScroll={(e) => handleScroll(e, leftPaneRef)}
            style={{ overflowY: 'auto', maxHeight: '400px' }}
          >
            <PaneTitle>Modified Build</PaneTitle>
            {diffNew.map((line, index) => (
              <LineRow key={`new-line-${index}`} $type={line.type}>
                <LineNumber>{line.num ?? '~'}</LineNumber>
                <CodeText $type={line.type}>{line.text}</CodeText>
              </LineRow>
            ))}
          </CodePane>
        </SplitView>
      </Container>
    </div>
  )
}

CodeComparison.displayName = 'CodeComparison'
