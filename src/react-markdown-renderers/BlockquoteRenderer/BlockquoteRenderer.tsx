import React from 'react'
import { Alert } from '../Alert'
import { EType } from '../Alert/styles'

// Рекурсивный хелпер для извлечения сырого текста (нужен только для проверки регулярным выражением)
const stringifyChildren = (node: any): string => {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(stringifyChildren).join('')
  if (node.props?.children) return stringifyChildren(node.props.children)
  return ''
}

// Рекурсивная функция для очистки СТРОГО первой текстовой ноды в дереве React элементов
const cleanFirstTextNode = (node: any): any => {
  if (!node) return node

  // Кейс 1: Мы дошли до чистой строки на самом дне структуры
  if (typeof node === 'string') {
    return node.replace(/^\[!(?:success|warning|danger|info|default|draft)\]\s*/i, '')
  }

  // Кейс 2: Это массив элементов (например, внутри параграфа)
  if (Array.isArray(node)) {
    return node.map((child, index) => {
      // Очищаем ТОЛЬКО самый первый элемент массива, остальные не трогаем
      if (index === 0) return cleanFirstTextNode(child)
      return child
    }).filter(child => child !== '') // Убираем пустые строки, если маркер был единственным текстом
  }

  // Кейс 3: Это React элемент с пропсом children (компонент <p>, <span> и т.д.)
  if (node.props && 'children' in node.props) {
    const updatedChildren = cleanFirstTextNode(node.props.children)
    
    // Если после очистки внутри компонента ничего не осталось, возвращаем null (удаляем пустой тег)
    if (updatedChildren === null || (Array.isArray(updatedChildren) && updatedChildren.length === 0)) {
      return null
    }
    
    return React.cloneElement(node, {}, updatedChildren)
  }

  return node
}

export const BlockquoteRenderer = ({ children }: any) => {
  const childrenArray = React.Children.toArray(children)
  
  // 1. Собираем весь текст цитаты в одну плоскую строку исключительно для проверки регуляркой
  const fullText = stringifyChildren(childrenArray)

  // Ищем маркер [!тип] в самом начале текста цитаты
  const calloutMatch = fullText.match(/^\[!(success|warning|danger|info|default|draft)\]/i)

  if (calloutMatch) {
    const alertType = calloutMatch[1].toLowerCase() as EType

    // 2. Филигранно очищаем первую ноду от префикса с помощью нашего рекурсивного хелпера
    const updatedChildren = childrenArray.map((child: any, index: number) => {
      if (index === 0) {
        return cleanFirstTextNode(child)
      }
      return child
    }).filter(Boolean)

    return (
      <Alert 
        type={alertType} 
        rawChildren={updatedChildren} 
      />
    )
  }

  // Если это стандартная цитата без маркера — рендерим её обычный вид
  return (
    <blockquote
      className="blog-standard-blockquote"
      style={{
        // borderLeft: '4px solid #ccc',
        paddingLeft: '16px',
        // color: '#666',
        fontSize: '0.9em',
      }}
    >
      {children}
    </blockquote>
  )
}
