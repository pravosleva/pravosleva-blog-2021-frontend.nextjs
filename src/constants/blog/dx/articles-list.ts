import { TArticleTools } from '../types'

const madDeveloperBg = {
  src: 'https://pravosleva.pro/static/img/blog/mad-developer.jpg',
  size: {
    w: 612,
    h: 408,
  },
  type: 'image/jpg',
}
const dxBg = {
  src: 'https://pravosleva.pro/static/img/blog/dx.webp',
  size: {
    w: 1920,
    h: 1080,
  },
  type: 'image/webp',
}

export const list: {[key: string]: TArticleTools} = {
  'good-dx-exp-2024': {
    id: '66c756b908a5177347693298',
    brief: 'Философ был свободен от следующих 4-х предметов: предвзятого взгляда, уверенности, упрямства и эгоизма (Конфуций)',
    bg: madDeveloperBg,
  },
  'good-dx-exp-2024-p3': {
    id: '66d83030d9a7126af852ebfd',
    brief: 'DX news',
    bg: dxBg,
  },
}
