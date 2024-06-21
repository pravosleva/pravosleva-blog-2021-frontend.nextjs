import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
// import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(ru)

import { memo } from 'react'
import ReactTimeAgo from 'react-time-ago'

type TProps = {
  ts: number;
}

export const TimeAgoLabel = memo(({ ts }: TProps) => {
  const date = new Date(ts)

  return (
    <ReactTimeAgo date={date} locale='en-US' />
  )
})
