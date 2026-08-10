import { TArticleTools } from '../types'

export const bg = {
  src: '/static/img/projects/math-preview.gif',
  size: {
    w: 309,
    h: 270,
  },
  type: 'image/gif',
}

export const list: { [key: string]: TArticleTools } = {
  'math-byFifthDegreeLeastSquaresApproximation': {
    id: '6992cfc6f7929b4140542006',
    brief: 'Approximation by Fifth Degree Least Squares in JS vanilla',
    bg,
  }
}
