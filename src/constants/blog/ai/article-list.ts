import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/cobain.jpg',
  size: {
    w: 438,
    h: 438,
  },
  type: 'image/png',
}

export const list: { [key: string]: TArticleTools } = {
  'ai-cover-toplist-2025-11-alternative': {
    id: '69160612f7929b4140541ff6',
    brief: 'Alternative AI Cover Toplist',
    bg,
  },
  'ai-cover-toplist-2025-11': {
    id: '69160442f7929b4140541ff5',
    brief: 'AI Cover Toplist',
    bg,
  },
}
