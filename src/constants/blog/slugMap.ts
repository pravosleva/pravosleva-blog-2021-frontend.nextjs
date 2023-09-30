type TArticleTools = {
  id: string;
  brief: string;
  bgSrc?: string;
}
export const slugMapping: {[key: string]: TArticleTools} = {
  'google-sheets-api-quota': {
    id: '64c8d7dbdb108f2f99272e0c',
    brief: 'Чтоб не забыть',
    bgSrc: '/static/img/blog/logo-google-sheets-photo.webp',
  },
  'limp-bizkit-video': {
    id: '607ca37d1f56f10aa3679bf7',
    brief: 'Клипы в закреп',
    bgSrc: '/static/img/blog/limp-bizkit-default.jpg',
  },
  'ubuntu-first-steps': {
    id: '5fd277957d536a022794e44c',
    brief: 'Настройка Ubuntu с нуля, чтоб не забыть',
    bgSrc: '/static/img/blog/logo-ubuntu.webp',
  },
  'tires-how-to-choose': {
    id: '634c5496b868e92b04c97bba',
    brief: 'Чтоб не забыть',
    bgSrc: '/static/img/blog/tires-default.jpeg',
  },
  'bash-quaint-files-copy': {
    id: '605b35611ead2f48d72e74a3',
    brief: 'Скрипт в функции просматривает директории (и поддиректории) srcDir и копирует...',
    bgSrc: '/static/img/blog/logo-bash.png',
  },
  'nginx-get-public-ip': {
    id: '602cfad280b2f31ebde37da0',
    brief: 'How to get IP from NGINX',
    bgSrc: '/static/img/blog/logo-nginx.jpg',
  },
  'nginx-logs': {
    id: '650b202fdb108f2f99272e15',
    brief: 'How to see NGINX logs',
    bgSrc: '/static/img/blog/logo-nginx.jpg',
  },
  'js-vanilla-fetch-retry': {
    id: '62a78bc4f1c6891e3676f755',
    brief: 'Hot to make fetchRetry with JS vanilla',
    bgSrc: '/static/img/blog/logo-js.jpg',
  },
  'web-api-is-browser-tab-active': {
    id: '61b8dc2ac2f1fd2a1ac7cab0',
    brief: 'Is browser tab active?',
    bgSrc: '/static/img/blog/logo-js.jpg',
  },
  'web-api-memory-stat': {
    id: '63ea0aef5ce46c7f363d448e',
    brief: 'Memory stat exp',
    bgSrc: '/static/img/blog/logo-js.jpg',
  },
  'telegram-bot-detect-members': {
    id: '64108f285ce46c7f363d44a0',
    brief: 'How to detect members in TG bot?',
    bgSrc: '/static/img/blog/logo-telegram.jpg',
  },
  'google-recaptcha-v3': {
    id: '6361a593b868e92b04c97bd2',
    brief: 'React + Express',
    bgSrc: '/static/img/blog/google-recaptcha-v3.jpg',
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
