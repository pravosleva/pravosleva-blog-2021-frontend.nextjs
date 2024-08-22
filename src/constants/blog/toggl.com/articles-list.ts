import { TArticleTools } from '../types'
import { bg as mongodbBg } from '../mongodb'
// import { bg as managementBg } from '../management'

export const list: {[key: string]: TArticleTools} = {
  'about-mongodb': {
    id: '61b616c7c2f1fd2a1ac7caa4',
    brief: 'Interested about MongoDB',
    bg: mongodbBg,
  },
  'about-management': {
    id: '66c702ba08a5177347693291',
    brief: 'Interested about project management',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/developer-hell.jpg',
      size: {
        w: 466,
        h: 248,
      },
      type: 'image/jpg',
    },
  },
  'how-does-music-affect-work': {
    id: '66c705fe08a5177347693292',
    brief: 'Dev exp',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/brain.jpeg',
      size: {
        w: 297,
        h: 170,
      },
      type: 'image/jpeg',
    },
  },
  'airport-hacks': {
    id: '66c707e908a5177347693293',
    brief: 'Interested by toggl.com',
    // bg: {
    //   src: 'https://pravosleva.pro/static/img/blog/brain.jpeg',
    //   size: {
    //     w: 297,
    //     h: 170,
    //   },
    //   type: 'image/jpeg',
    // },
  },
  'save-princess-8-programming-languages': {
    id: '66c70a9608a5177347693294',
    brief: 'Interested by toggl.com',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/best-programming-languages.webp',
      size: {
        w: 750,
        h: 375,
      },
      type: 'image/webp',
    },
  },
  'hidden-dangers-refactoring': {
    id: '66c70d6908a5177347693295',
    brief: 'Interested by toggl.com',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/wrench-btn.png',
      size: {
        w: 497,
        h: 260,
      },
      type: 'image/png',
    },
  },
  'programming-languages-games': {
    id: '66c70fbb08a5177347693296',
    brief: 'Interested by toggl.com',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/best-programming-languages.webp',
      size: {
        w: 750,
        h: 375,
      },
      type: 'image/webp',
    },
  },
  'overwork-time': {
    id: '66c7113e08a5177347693297',
    brief: 'About overwork time',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/robots-work-for-you.png',
      size: {
        w: 674,
        h: 380,
      },
      type: 'image/png',
    },
  },
}
