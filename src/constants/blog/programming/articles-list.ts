import { TArticleTools } from '../types'

const bgSolid = {
  src: 'https://pravosleva.pro/static/img/blog/solid.webp',
  size: {
    w: 634,
    h: 634,
  },
  type: 'image/webp',
}
const bgCoding = {
  src: 'https://pravosleva.pro/static/img/blog/joker.webp',
  size: {
    w: 990,
    h: 1220,
  },
  type: 'image/webp',
}
const bgHackerNews = {
  src: 'https://pravosleva.pro/static/img/projects/hacker-news-bg.png',
  size: {
    w: 1200,
    h: 710,
  },
  type: 'image/png',
}
const bgEyes = {
  src: 'https://pravosleva.pro/static/img/blog/eyes.webp',
  size: {
    w: 896,
    h: 1344,
  },
  type: 'image/webp',
}

export const list: { [key: string]: TArticleTools } = {
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
  'hacker-news-client-2024': {
    id: '6766beed8c79264aa7fd53aa',
    brief: 'App for open API',
    bg: bgHackerNews,
  },
  'programming-solid-s': {
    id: '6a52a1aaf7929b414054202e',
    brief: 'SOLID',
    bg: bgSolid,
  },
  'programming-solid-o': {
    id: '6a52a27ff7929b414054202f',
    brief: 'SOLID',
    bg: bgSolid,
  },
  'programming-solid-l': {
    id: '6a52a2eff7929b4140542030',
    brief: 'SOLID',
    bg: bgSolid,
  },
  'programming-solid-i': {
    id: '6a52a355f7929b4140542031',
    brief: 'SOLID',
    bg: bgSolid,
  },
  'programming-solid-d': {
    id: '6a52a069f7929b414054202d',
    brief: 'SOLID',
    bg: bgSolid,
  },
  'programming-di': {
    id: '6a52a780f7929b4140542033',
    brief: 'DI',
    bg: bgEyes,
  },
}
