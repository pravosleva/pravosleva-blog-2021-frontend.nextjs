import { TArticleTools } from '../types'

export const bg = {
  src: 'https://pravosleva.pro/static/img/blog/react-logo-bg.jpeg',
  size: {
    w: 730,
    h: 487,
  },
  type: 'image/jpeg',
}

export const list: { [key: string]: TArticleTools } = {
  'react-hook-use-outside-click': {
    id: '63e4f9255ce46c7f363d448b',
    brief: 'Хук для отслеживания клика вне элемента',
    bg,
  },
}
