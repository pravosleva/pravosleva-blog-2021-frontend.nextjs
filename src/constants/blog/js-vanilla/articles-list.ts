import { TArticleTools } from '../types'

export const bg = {
  src: 'https://pravosleva.pro/static/img/blog/logo-js.jpg',
  size: {
    w: 1200,
    h: 630,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
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
  // 'simple-test': {
  //   id: '6655de148bbf9b44b4ec61ec',
  //   brief: 'JS exp',
  //   bg,
  // },
}
