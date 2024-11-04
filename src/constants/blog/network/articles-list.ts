import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/browser.jpeg',
  size: {
    w: 2048,
    h: 1382,
  },
  type: 'image/jpeg',
}

export const list: {[key: string]: TArticleTools} = {
  'protocols': {
    id: '66e0201dd9a7126af852ebff',
    brief: 'Заметки про сети',
    bg,
  },
  'protocols-http': {
    id: '67207e3dd9a7126af852ec11',
    brief: 'Заметки про сети',
    bg,
  },
  'protocols-ssl-tls': {
    id: '672269dad9a7126af852ec14',
    brief: 'Заметки про сети',
    bg,
  },
  'protocols-tcp': {
    id: '67226b52d9a7126af852ec15',
    brief: 'Заметки про сети',
    bg,
  },
}
