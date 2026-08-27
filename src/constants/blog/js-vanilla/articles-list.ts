import { TArticleTools } from '../types'

export const bg = {
  // src: 'https://pravosleva.pro/static/img/blog/logo-js.jpg',
  // size: {
  //   w: 1200,
  //   h: 630,
  // },
  // type: 'image/jpg',
  src: 'https://pravosleva.pro/static/img/blog/logo-js-2.webp',
  size: {
    w: 640,
    h: 360,
  },
  type: 'image/webp',
}
export const bgReactivity = {
  src: 'https://pravosleva.pro/static/img/blog/reactive-5.webp',
  size: {
    w: 1344,
    h: 768,
  },
  type: 'image/webp',
}

export const list: { [key: string]: TArticleTools } = {
  'js-vanilla-getExtractedValues': {
    id: '694d0e0ef7929b4140541fff',
    brief: 'Simple way to extract target values from string in JS vanilla',
    bg,
  },
  'js-vanilla-looper-factory': {
    id: '6992e9e9f7929b4140542008',
    brief: 'Simple looper factory in JS vanilla',
    bg,
  },
  'js-vanilla-debug-factory': {
    id: '6992ef2bf7929b4140542009',
    brief: 'Simple debug factory in JS vanilla',
    bg,
  },
  'js-vanilla-fetch-retry': {
    id: '62a78bc4f1c6891e3676f755',
    brief: 'Hot to make fetchRetry with JS vanilla',
    bg,
  },
  'js-vanilla-retryable-http-client-on-generators-sample': {
    id: '651ece106917cd0d733cddb5',
    brief: 'Fetch retry sample',
    bg,
  },
  'js-vanilla-search-by-words': {
    id: '6915d0c1f7929b4140541ff4',
    brief: 'Search sample',
    bg,
  },
  // 'simple-test': {
  //   id: '6655de148bbf9b44b4ec61ec',
  //   brief: 'JS exp',
  //   bg,
  // },
  'js-vanilla-generators-retrier': {
    id: '69b38c28f7929b414054200e',
    brief: 'JS Generators experience',
    bg,
  },
  'reactive-engine-ru': {
    id: '6a50eeb7f7929b414054202b',
    brief: 'JS в действии',
    bg: bgReactivity,
  },
  'js-interview-2026': {
    id: '6a3e79f8f7929b4140542026',
    brief: 'Заметки про JS',
    bg,
  },
}
