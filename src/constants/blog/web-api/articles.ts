import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/scroll-to-element.png',
  size: {
    w: 360,
    h: 360,
  },
  type: 'image/png',
}

export const list: { [key: string]: TArticleTools } = {
  'scroll-to-element': {
    id: '6864f41d10f7b720079c8bd6',
    brief: 'Как определить, нужен ли элемент в середине viewport или же в начале страницы?',
    bg,
  },
}
