import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/bg-css-v2.jpg',
  size: {
    w: 360,
    h: 225,
  },
  type: 'image/jpg',
}

export const list: { [key: string]: TArticleTools } = {
  'scroll-snap-type-exp': {
    id: '6878d8d710f7b720079c8bd9',
    brief: 'Карточки с эффектом перелистывания',
    bg,
  },
}
