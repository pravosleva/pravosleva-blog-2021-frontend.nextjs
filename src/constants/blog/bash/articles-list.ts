import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/logo-bash.png',
  size: {
    w: 1200,
    h: 675,
  },
  type: 'image/png',
}

export const list: {[key: string]: TArticleTools} = {
  'bash-quaint-files-copy': {
    id: '605b35611ead2f48d72e74a3',
    brief: 'Скрипт в функции просматривает директории (и поддиректории) srcDir и копирует...',
    bg,
  },
  'bash-write-git-commit-hash-to-static-file': {
    id: '6238cb7f52ac7d093d671313',
    brief: 'Как записать хэш git коммита в статический файл при сборке',
    bg,
  }
}
