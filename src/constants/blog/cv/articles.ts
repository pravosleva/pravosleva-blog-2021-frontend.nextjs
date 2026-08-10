import { TArticleTools } from '../types'

// const bg = {
//   src: 'https://pravosleva.pro/static/img/blog/cv-v0.jpg',
//   size: {
//     w: 2783,
//     h: 1297,
//   },
//   type: 'image/jpg',
// }
const bg2 = {
  src: 'https://pravosleva.pro/static/img/blog/logo-js-850x478.jpeg',
  size: {
    w: 850,
    h: 478,
  },
  type: 'image/jpg',
}

export const list: { [key: string]: TArticleTools } = {
  'cv-ru': {
    id: '68905b0d10f7b720079c8bdd',
    brief: 'Мой опыт в коммерческой разработке',
    bg: bg2,
  },
}
