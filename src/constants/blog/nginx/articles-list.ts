import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/logo-nginx.jpg',
  size: {
    w: 384,
    h: 220,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
  'nginx-get-public-ip': {
    id: '602cfad280b2f31ebde37da0',
    brief: 'How to get IP from NGINX',
    bg,
  },
  'nginx-logs': {
    id: '650b202fdb108f2f99272e15',
    brief: 'Hey bro, where is my logs?',
    bg,
  },
}
