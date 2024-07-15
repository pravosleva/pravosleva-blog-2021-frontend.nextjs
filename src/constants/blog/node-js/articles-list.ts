import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/bg-node-js.webp',
  size: {
    w: 2400,
    h: 1100,
  },
  type: 'image/webp',
}

export const list: {[key: string]: TArticleTools} = {
  'request-params-validation-in-express-js': {
    id: '65e03441879fb9319a7a38f3',
    brief: 'Реализация в рамках паттерна Middleware',
    bg,
  },
}
