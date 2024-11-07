import { TArticleTools } from '../types'

const bgSolid = {
  src: 'https://pravosleva.pro/static/img/blog/solid.jpg',
  size: {
    w: 634,
    h: 634,
  },
  type: 'image/jpg',
}
const bgCoding = {
  src: 'https://pravosleva.pro/static/img/coding.jpg',
  size: {
    w: 1080,
    h: 687,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
  'programming-solid': {
    id: '6728d250d9a7126af852ec18',
    brief: 'SOLID нужен для обеспечения качественной модульности, уменьшающей когнитивную сложность кода и способствующей большей переиспользуемости',
    bg: bgSolid,
  },
  'programming-oop': {
    id: '67289180d9a7126af852ec17',
    brief: 'Принципы ООП позволяют разработчикам создавать гибкие и масштабируемые системы, которые легко адаптируются к изменениям требований // ООП также способствует повторному использованию кода и улучшает его читаемость',
    bg: bgCoding,
  },
}
