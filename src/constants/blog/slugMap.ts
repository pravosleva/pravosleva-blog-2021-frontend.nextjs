type TArticleTools = {
  id: string;
  brief: string;
  bgSrc?: string;
}
export const slugMapping: {[key: string]: TArticleTools} = {
  'google-sheets-api-quota': {
    id: '64c8d7dbdb108f2f99272e0c',
    brief: 'Чтоб не забыть',
    bgSrc: '/static/img/blog/google-sheets.webp',
  },
  'limp-bizkit-video': {
    id: '607ca37d1f56f10aa3679bf7',
    brief: 'Чтоб не забыть',
    bgSrc: '/static/img/blog/limp-bizkit-default.jpg',
  },
  'ubuntu-first-steps': {
    id: '5fd277957d536a022794e44c',
    brief: 'Настройка Ubuntu с нуля, чтоб не забыть',
    // bgSrc:
  },
  'tires-hot-to-choose': {
    id: '634c5496b868e92b04c97bba',
    brief: 'Чтоб не забыть',
    // bgSrc:
  }
}

const _slugMap = new Map<string, TArticleTools & {
  slug: string;
}>()

for (const slug in slugMapping) _slugMap.set(slugMapping[slug].id, {
  slug,
  ...slugMapping[slug],
})

export const slugMap = _slugMap
