import { TArticleTools } from '../types'

const bgSolid = {
  src: 'https://pravosleva.pro/static/img/blog/solid.jpg',
  size: {
    w: 634,
    h: 634,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
  'programming-solid': {
    id: '6728d250d9a7126af852ec18',
    brief: 'SOLID нужен для обеспечения качественной модульности, уменьшающей когнитивную сложность кода и способствующей большей переиспользуемости',
    bg: bgSolid,
  },
}
