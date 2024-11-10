import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/logo-docker.png',
  size: {
    w: 1200,
    h: 630,
  },
  type: 'image/png',
}

export const list: {[key: string]: TArticleTools} = {
  'docker-exp-2023': {
    id: '67307326d9a7126af852ec1b',
    brief: 'Заметки про Docker',
    bg,
  },
}
