import { TArticleTools } from '../types'

const bg = {
  src: 'https://pravosleva.pro/static/img/blog/logo-bash.png',
  size: {
    w: 1200,
    h: 630,
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
    brief: 'Как извлечь хэш git коммита при сборке',
    bg,
  },
  'bash-search-remove-files-and-dirs': {
    id: '5fd270747d536a022794e442',
    brief: 'Чтобы найти иголку в стоге сена, достаточно сжечь сено и провести магнитом над пеплом',
    bg,
    // bg: {
    //   src: 'https://pravosleva.pro/static/img/blog/logo-bash-900x600.jpg',
    //   size: { w: 900, h: 600 },
    //   type: 'image/jpg',
    // },
  },
}
