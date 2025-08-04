import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/cv-v0.jpg',
  size: {
    w: 2783,
    h: 1297,
  },
  type: 'image/jpg',
}

export const list: { [key: string]: TArticleTools } = {
  'cv-ru': {
    id: '68905b0d10f7b720079c8bdd',
    brief: 'Мой опыт в коммерческой разработке',
    bg,
  },
}
