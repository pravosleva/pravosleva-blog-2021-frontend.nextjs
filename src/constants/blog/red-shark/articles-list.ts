import { TArticleTools } from '../types'

export const bg = {
  src: 'https://pravosleva.pro/static/img/blog/red-shark.jpg',
  size: {
    w: 1000,
    h: 562,
  },
  type: 'image/jpg',
}

const bgKaz = {
  src: 'https://pravosleva.pro/static/img/blog/flag-kaz.jpg',
  size: {
    w: 1000,
    h: 625,
  },
  type: 'image/jpg',
}

export const list: {[key: string]: TArticleTools} = {
  'red-shark-2022-9-2': {
    id: '65d73e282eff672077764cce',
    brief: 'UI fixes',
    bg,
  },
  'red-shark-2024-2': {
    id: '65cb39166917cd0d733cddd6',
    brief: 'Давно планировал ремонт правого порога (как выяснилось, требует ремонта и крыло)',
    bg,
  },
  'red-shark-2022-9': {
    id: '65cb3d1c6917cd0d733cddd7',
    brief: 'А у Вас был повод съездить?',
    bg: bgKaz,
  },
}
