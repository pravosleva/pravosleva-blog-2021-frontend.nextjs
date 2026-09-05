import { TArticleTools } from '../types'

export const reactBg = {
  src: 'https://pravosleva.pro/static/img/blog/react-logo-bg.jpeg',
  size: {
    w: 730,
    h: 487,
  },
  type: 'image/jpeg',
}
const jsBg = {
  src: 'static/img/blog/logo-js-2.webp',
  size: {
    w: 640,
    h: 360,
  },
  type: 'image/webp',
}

export const list: { [key: string]: TArticleTools } = {
  'react-hook-use-outside-click': {
    id: '63e4f9255ce46c7f363d448b',
    brief: 'Хук для отслеживания клика вне элемента',
    bg: reactBg,
  },
  'react-vs-vue3': {
    id: '6a9abed4f7929b414054205c',
    brief: 'Прямое сравнение',
    bg: jsBg,
  },
}
