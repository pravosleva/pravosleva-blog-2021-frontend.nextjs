import { TArticleTools } from './types'
import { list as articlesListAboutBash } from './bash'
import { list as articlesListAboutCss } from './css'
import { list as articlesListAboutCv } from './cv'
import { list as articlesListAboutGit } from './git'
import { list as articlesListAboutJSVanilla, bg as bgJSVanilla } from './js-vanilla'
import { list as articlesListAboutNginx } from './nginx'
import { list as articlesListAboutRedShark } from './red-shark'
import { list as articlesListAboutNodeJs } from './node-js'
import { list as articlesListAboutUx } from './ux'
import { list as articlesListAboutDx } from './dx'
import { list as articlesListAboutMongoDB } from './mongodb'
import { list as articlesListAboutManagement } from './management'
import { list as articlesListFromTogglCom } from './toggl.com'
import { list as articlesListAboutNetwork } from './network'
import { list as articlesListAboutProgramming } from './programming'
import { list as articlesListAboutDocker } from './docker'
import { list as articlesListAboutWebApi } from './web-api'
import { list as articlesListAboutAI } from './ai'
import { list as articlesListAboutMath } from './math'
import { list as articlesListAboutReact } from './react'

export const slugMapping: { [key: string]: TArticleTools } = {
  ...articlesListAboutBash,
  ...articlesListAboutCss,
  ...articlesListAboutCv,
  ...articlesListAboutGit,
  ...articlesListAboutNginx,
  ...articlesListAboutJSVanilla,
  ...articlesListAboutRedShark,
  ...articlesListAboutNodeJs,
  ...articlesListAboutUx,
  ...articlesListAboutDx,
  ...articlesListAboutMongoDB,
  ...articlesListAboutManagement,
  ...articlesListFromTogglCom,
  ...articlesListAboutNetwork,
  ...articlesListAboutProgramming,
  ...articlesListAboutDocker,
  ...articlesListAboutWebApi,
  ...articlesListAboutAI,
  ...articlesListAboutMath,
  ...articlesListAboutReact,
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
      // size: {
      //   w: 1200,
      //   h: 630,
      // },
      // src: 'https://pravosleva.pro/static/img/projects/scoring.jpg',
      // type: 'image/jpg',
      size: {
        w: 309,
        h: 270,
      },
      src: '/static/img/projects/math-preview.gif',
      type: 'image/gif',
    },
  },
  'estimate-corrector-2024': {
    id: '67723f368c79264aa7fd53b1',
    brief: 'Based on the methodology by Joel Spolsky',
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
      src: 'https://pravosleva.pro/static/img/blog/eyes.webp',
      size: {
        w: 896,
        h: 1344,
      },
      type: 'image/webp',
    },
  },
  'what-where-when': {
    id: '678bcbf18c79264aa7fd53b6',
    brief: 'Музыка из шоу',
    bg: {
      src: 'https://pravosleva.pro/static/img/blog/what-where-when.jpg',
      size: {
        w: 860,
        h: 576,
      },
      type: 'image/jpg',
    },
  },
  'reactive-engine-news-1.5.5': {
    id: '6a7f1677f7929b4140542039',
    brief: 'News',
    bg: {
      src: '/static/img/blog/coca-cola.webp',
      size: {
        w: 1080,
        h: 1080,
      },
      type: 'image/webp',
    },
  },
  'reactive-engine-ssr-vue3-nuxt4': {
    id: '6a8d539ef7929b4140542047',
    brief: 'Tutorial',
    bg: {
      src: '/static/img/blog/nuxt4-logo-dark.webp',
      size: {
        w: 300,
        h: 300,
      },
      type: 'image/webp',
    },
  },
  'reactive-engine-ssr-react-next': {
    id: '6a803917f7929b414054203a',
    brief: 'Tutorial',
    bg: {
      src: '/static/img/blog/nextjs-logo-dark.webp',
      size: {
        w: 1176,
        h: 1056,
      },
      type: 'image/webp',
    },
  },
  // {
  //   id: 1,
  //   title: 'AuditList 2023',
  //   description: 'AUDIT_LIST_PROJECT_DESCR',
  //   img: {
  //     // NOTE: Converter online https://cloudconvert.com/
  //     src: '/static/img/projects/audit-v2.webp',
  //     alt: 'loading...',
  //     color: {
  //       // NOTE: Get average color online https://matkl.github.io/average-color/
  //       average: '#d79695',
  //     },
  //   },
  //   links: [
  //     {
  //       href: '/subprojects/audit-list',
  //       as: '/subprojects/audit-list',
  //       text: 'PROJECT_GO_BTN:LINK_GOTO',
  //       color: ELinkColor.YELLOW,
  //       icon: ELinkIcon.ARROW,
  //     },
  //   ],
  //   uiDate: '2023',
  //   brief: 'PROJECT_BRIEF@AUDITOR_HELPER',
  //   tags: [],
  // },
  'audit-list-2023': {
    id: '6a85e2a2f7929b4140542042',
    brief: 'Audit helper',
    bg: {
      src: '/static/img/projects/audit-v2.webp',
      size: {
        w: 700,
        h: 466,
      },
      type: 'image/webp',
    },
  },
  'edna-trash-2026': {
    id: '6a8c0c6bf7929b4140542046',
    brief: 'Фронтенд треш-кейс',
    bg: {
      src: '/static/img/blog/FB_IMG_1787205276491.webp',
      size: {
        w: 2048,
        h: 2048,
      },
      type: 'image/webp',
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
