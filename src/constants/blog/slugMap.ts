import { TArticleTools } from './types'
import { list as articlesListAboutBash } from './bash'
import { list as articlesListAboutGit } from './git'
import { list as articlesListAboutJSVanilla, bg as bgJSVanilla } from './js-vanilla'
import { list as articlesListAboutNginx } from './nginx'
import { list as articlesListAboutRedShark } from './red-shark'
import { list as articlesListAboutNodeJs } from './node-js'
import { list as articlesListAboutUx } from './ux'
import { list as articlesListAboutDx } from './dx'
import { list as articlesListAboutMongoDB } from './mongodb'
// import { list as articlesListAboutManagement } from './management'
import { list as articlesListFromTogglCom } from './toggl.com'
import { list as articlesListAboutNetwork } from './network'
import { list as articlesListAboutProgramming } from './programming'

export const slugMapping: {[key: string]: TArticleTools} = {
  ...articlesListAboutBash,
  ...articlesListAboutGit,
  ...articlesListAboutNginx,
  ...articlesListAboutJSVanilla,
  ...articlesListAboutRedShark,
  ...articlesListAboutNodeJs,
  ...articlesListAboutUx,
  ...articlesListAboutDx,
  ...articlesListAboutMongoDB,
  // ...articlesListAboutManagement,
  ...articlesListFromTogglCom,
  ...articlesListAboutNetwork,
  ...articlesListAboutProgramming,
  'this-app-documentation-guide': {
    id: '5fcaa0ac50f83839dfbcfc12',
    brief: 'Чтоб не забыть',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/wrench-btn.png',
      size: {
        w: 497,
        h: 260,
      },
      type: 'image/png',
    },
  },
  'team-scoring': {
    id: '653053616917cd0d733cddb9',
    brief: 'По мотивам статьи Joel Spolsky',
    bg: {
      size: {
        w: 1200,
        h: 630,
      },
      src: 'https://pravosleva.pro/static/img/projects/scoring.jpg',
      type: 'image/jpg',
    },
  },
  'google-sheets-api-quota': {
    id: '64c8d7dbdb108f2f99272e0c',
    brief: 'Чтоб не забыть',
    bg: {
      size: {
        w: 1200,
        h: 600,
      },
      src: 'https://pravosleva.pro/static/img/blog/logo-google-sheets-photo.webp',
      type: 'image/webp',
    },
  },
  'limp-bizkit-video': {
    id: '607ca37d1f56f10aa3679bf7',
    brief: 'Everybody jumps from the sound of the shotgun In my neighborhood everybody got one!',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/limp-bizkit-default.jpg',
      size: {
        w: 1200,
        h: 630,
      },
      type: 'image/jpg',
    },
  },
  'ubuntu-first-steps': {
    id: '5fd277957d536a022794e44c',
    brief: 'Настройка Ubuntu с нуля, чтоб не забыть',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/logo-ubuntu.webp',
      size: {
        w: 900,
        h: 506,
      },
      type: 'image/webp',
    }
  },
  'tires-how-to-choose': {
    id: '634c5496b868e92b04c97bba',
    brief: 'Чтоб не забыть',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/tires-default.jpeg',
      size: {
        w: 362,
        h: 139,
      },
      type: 'image/jpeg',
    },
  },
  'web-api-is-browser-tab-active': {
    id: '61b8dc2ac2f1fd2a1ac7cab0',
    brief: 'Is browser tab active?',
    bg: bgJSVanilla,
  },
  'web-api-memory-stat': {
    id: '63ea0aef5ce46c7f363d448e',
    brief: 'How to got page memory stat in Chrome',
    bg: bgJSVanilla,
  },
  'telegram-bot-detect-members': {
    id: '64108f285ce46c7f363d44a0',
    brief: 'How to detect members in TG bot?',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/logo-telegram.jpg',
      size: {
        w: 840,
        h: 472,
      },
      type: 'image/jpg',
    },
  },
  'google-recaptcha-v3': {
    id: '6361a593b868e92b04c97bd2',
    brief: 'React + Express',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/google-recaptcha-v3.jpg',
      size: {
        w: 1200,
        h: 630,
      },
      type: 'image/jpg',
    },
  },
  'enable-cors-nginx': {
    id: '6518bd3bdb108f2f99272e20',
    brief: 'Hey bro, where is my fckn CORS?',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/logo-nginx.jpg',
      size: {
        w: 384,
        h: 220,
      },
      type: 'image/jpg',
    },
  },
  'qr-code-exp': {
    id: '605cc2e41ead2f48d72e74ad',
    brief: 'Hey bro, what about QR?',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/qr-code-v1.jpg',
      size: {
        w: 518,
        h: 346,
      },
      type: 'image/jpg',
    },
  },
  'strapi-v4-graphql-notes': {
    id: '655c8fcc6917cd0d733cddc4',
    brief: 'Notes',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/logo-graphql.png',
      size: {
        w: 300,
        h: 118,
      },
      type: 'image/png',
    },
  },
  'autopark-beta': {
    id: '65f1b62b0ce21b2be9dc4973',
    brief: 'Пробую сделать удобный сервис, чтоб напоминал про расходники с настраиваемым интервалом пробега',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/logo-autopark-no-slogan.big.png',
      size: {
        w: 869,
        h: 869,
      },
      type: 'image/png',
    },
  },
  'dev': {
    id: '66c6dac8ac4921798fee38ab',
    brief: 'Dev exp',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/wrench-btn.png',
      size: {
        w: 497,
        h: 260,
      },
      type: 'image/png',
    },
  },
  
}

const _slugMap = new Map<string, TArticleTools & {
  slug: string;
}>()

for (const slug in slugMapping) _slugMap.set(slugMapping[slug].id, {
  slug,
  ...slugMapping[slug],
})

export const slugMap = _slugMap
