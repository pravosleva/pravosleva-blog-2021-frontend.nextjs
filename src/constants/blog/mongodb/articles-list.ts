import { TArticleTools } from '../types'

export const bg = {
  // src: 'https://pravosleva.pro/static/img/blog/logo-mongodb-2.png',
  // size: {
  //   w: 360,
  //   h: 360,
  // },
  // type: 'image/png',
  src: 'https://pravosleva.pro/static/img/blog/mongodb.jpg',
  size: {
    w: 1200,
    h: 601,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
  'mongodb-search-samples': {
    id: '5fcf89195c65457d85706310',
    brief: 'Чтоб не забыть',
    bg,
  },

  // NOTE: Moved to ../toggl.com
  // 'mongodb-by-toggle': {
  //   id: '61b616c7c2f1fd2a1ac7caa4',
  //   brief: 'Interested about MongoDB',
  //   bg,
  // },
}
