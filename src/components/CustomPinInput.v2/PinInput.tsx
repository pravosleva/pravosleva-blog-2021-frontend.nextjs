import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'
import { PinItem } from './PinItem'

interface PinInputProps {
  initialValue?: string | number;
  length: number;
  type?: 'numeric' | 'text';
  secret?: boolean;
  disabled?: boolean;
  focus?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  inputFocusStyle?: React.CSSProperties;
  autoSelect?: boolean;
  regexCriteria?: RegExp;
  ariaLabel?: string;
  placeholder?: string;
  validate?: (value: string) => string;
  onChange?: (pin: string, currentIndex: number) => void;
  onComplete?: (pin: string, currentIndex: number) => void;
}

export const PinInput: React.FC<PinInputProps> = ({
  initialValue = '',
  length,
  type = 'numeric',
  secret = false,
  disabled = false,
  focus = false,
  inputMode,
  style = {},
  inputStyle = {},
  inputFocusStyle = {},
  autoSelect = true,
  regexCriteria = /^[A-Za-z0-9_@./#&+-]*$/,
  ariaLabel = '',
  placeholder = '',
  validate,
  onChange = () => {},
  onComplete = () => {},
}) => {
  // Селектор темы из глобального стейта блога
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  const [values, setValues] = useState<string[]>(() => 
    Array(length).fill('').map((_, i) => initialValue.toString()[i] || '')
  )

  const elementsRef = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (focus && length > 0 && elementsRef.current[0]) {
      elementsRef.current[0].focus()
    }
  }, [focus, length])

  const onItemChange = (value: string, isPasting: boolean, index: number) => {
    let currentIndex = index
    const newValues = [...values]
    newValues[index] = value
    setValues(newValues)

    // Перемещение фокуса на следующий элемент
    if (value.length === 1 && index < length - 1 && elementsRef.current[index + 1]) {
      currentIndex += 1
      elementsRef.current[currentIndex]?.focus()
    }

    const pin = newValues.join('')

    if (!isPasting) {
      onChange(pin, currentIndex)
    }

    if (pin.length === length) {
      if (isPasting && index < length - 1) return
      onComplete(pin, currentIndex)
    }
  }

  const onBackspace = (index: number) => {
    if (index > 0 && elementsRef.current[index - 1]) {
      elementsRef.current[index - 1]?.focus()
    }
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text').trim()
    if (pastedData.length !== length) return

    e.preventDefault()
    const newValues = pastedData.split('').slice(0, length)
    setValues(newValues)

    // Обновляем DOM ноды и переводим фокус на последний инпут
    newValues.forEach((char, idx) => {
      onItemChange(char, true, idx)
    })
    elementsRef.current[length - 1]?.focus()
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...style
  }

  return (
    <div style={containerStyle} className="pincode-input-container">
      {values.map((val, i) => (
        <PinItem
          key={i}
          ref={(el) => { elementsRef.current[i] = el }}
          initialValue={val}
          disabled={disabled}
          secret={secret}
          type={type}
          inputMode={inputMode}
          validate={validate}
          inputStyle={inputStyle}
          inputFocusStyle={inputFocusStyle}
          autoSelect={autoSelect}
          regexCriteria={regexCriteria}
          ariaLabel={ariaLabel}
          placeholder={placeholder}
          currentTheme={currentTheme}
          onBackspace={() => onBackspace(i)}
          onChange={(v, isPasting) => onItemChange(v, isPasting, i)}
          onPaste={i === 0 ? onPaste : null}
        />
      ))}
    </div>
  )
}
