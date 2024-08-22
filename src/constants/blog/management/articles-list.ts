import { TArticleTools } from '../types'

export const bg = {
  src: 'https://pravosleva.pro/static/img/blog/management.jpeg',
  size: {
    w: 1000,
    h: 725,
  },
  type: 'image/jpeg',
}

export const list: {[key: string]: TArticleTools} = {
  'about-management': {
    id: '66c702ba08a5177347693291',
    brief: 'Interested about project management',
    bg,
  },
}
