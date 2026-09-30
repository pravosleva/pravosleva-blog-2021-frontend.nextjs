import React, { useRef, useState, useEffect } from 'react'

interface PinItemProps {
  initialValue?: string;
  disabled?: boolean;
  secret?: boolean;
  type?: 'numeric' | 'text';
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  validate?: (value: string) => string;
  inputStyle?: React.CSSProperties;
  inputFocusStyle?: React.CSSProperties;
  autoSelect?: boolean;
  regexCriteria?: RegExp;
  ariaLabel?: string;
  placeholder?: string;
  currentTheme: string;
  onChange: (value: string, isPasting: boolean) => void;
  onBackspace: () => void;
  onPaste: React.ClipboardEventHandler<HTMLInputElement> | null;
}

export const PinItem = React.forwardRef<HTMLInputElement, PinItemProps>(({
  initialValue = '',
  disabled = false,
  secret = false,
  type = 'numeric',
  inputMode = 'text',
  validate,
  inputStyle = {},
  inputFocusStyle = {},
  autoSelect = false,
  regexCriteria = /^[A-Za-z0-9_@./#&+-]*\$/,
  ariaLabel = '',
  placeholder = '',
  currentTheme,
  onChange,
  onBackspace,
  onPaste,
}, ref) => {
  const localRef = useRef<HTMLInputElement>(null)
  const inputRef = (ref as React.RefObject<HTMLInputElement>) || localRef

  const [value, setValue] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const runValidation = (val: string): string => {
    if (validate) return validate(val)

    if (type === 'numeric') {
      const firstChar = val.charAt(0)
      return (firstChar >= '0' && firstChar <= '9') ? firstChar : ''
    }

    if (regexCriteria.test(val)) {
      return val.toUpperCase()
    }

    return ''
  }

  const handleUpdate = (updatedValue: string, isPasting = false) => {
    const validated = runValidation(updatedValue)
    if (value === validated && !isPasting) return

    if (validated.length < 2) {
      setValue(validated)
      // Нулевой таймаут для согласованности с Event Loop при переключении фокуса
      setTimeout(() => {
        onChange(validated, isPasting)
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (!value || !value.length)) {
      onBackspace()
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (autoSelect) {
      e.target.select()
    }
    setIsFocused(true)
  }

  // Расчет адаптивной палитры границ инпутов на основе темы блога
  const themeBorderColor = (() => {
    switch (currentTheme) {
      case 'light': return '#ccc'
      case 'gray': return '#666'
      case 'hard-gray': return 'rgb(57, 229, 172)'
      case 'dark': return 'rgb(255, 142, 83)'
      default: return '#ccc'
    }
  })()

  const baseInputStyle: React.CSSProperties = {
    padding: 0,
    margin: '0 4px',
    textAlign: 'center',
    border: `2px solid ${themeBorderColor}`,
    borderRadius: '8px',
    background: 'transparent',
    width: '45px',
    height: '45px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'inherit',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: isFocused ? '0 0 8px rgba(3, 169, 244, 0.4)' : 'none',
    borderColor: isFocused ? '#03A9F4' : themeBorderColor,
    ...inputStyle,
    ...(isFocused ? inputFocusStyle : {}),
  }

  return (
    <input
      ref={inputRef}
      disabled={disabled}
      onChange={(e) => handleUpdate(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder || value}
      aria-label={ariaLabel || value}
      maxLength={1}
      autoComplete="new-password"
      type={secret ? 'password' : (type === 'numeric' ? 'tel' : type)}
      inputMode={inputMode || (type === 'numeric' ? 'numeric' : 'text')}
      pattern={type === 'numeric' ? '[0-9]*' : undefined}
      onFocus={handleFocus}
      onBlur={() => setIsFocused(false)}
      onPaste={onPaste || undefined}
      style={baseInputStyle}
      value={value}
    />
  )
})

PinItem.displayName = 'PinItem'
