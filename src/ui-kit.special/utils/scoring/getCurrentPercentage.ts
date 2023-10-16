import { linear } from 'math-interpolate'
// import moment from 'moment'

type TProps = {
  startDate: number;
  targetDate: number;
}

export const getCurrentPercentage = ({ startDate: t0, targetDate: t100 }: TProps) => {
  const tsNow = new Date().getTime()
  const result = linear({
    x1: t0,
    y1: 0,
    x2: t100,
    y2: 100,
    x: tsNow,
  })

  return result
}
