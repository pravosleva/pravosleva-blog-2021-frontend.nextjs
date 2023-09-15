import { useEffect, useRef, useState } from 'react'
import { getTimeAgo } from '~/utils/getTimeAgo'

type TProps = {
  date: number | undefined;
  delay: number
}

export const useTimeAgo = ({
  date,
  delay,
}: TProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()
  const [timeAgoText, setTimeAgoText] = useState('')

  const [count, setCount] = useState<number>(0)

  const updateCounter = () => {
    setCount((c) => c + 1)
  }

  useEffect(() => {
    if (!!timeoutRef.current) clearTimeout(timeoutRef.current)

    setTimeAgoText(getTimeAgo(date))

    timeoutRef.current = setTimeout(updateCounter, delay)

    if (!!timeoutRef.current)
      return () => {
        if (!!timeoutRef.current) clearTimeout(timeoutRef.current)
      }
  }, [count, date])

  return {
    timeAgoText: !!date ? timeAgoText : 'Unknown',
    _count: count,
  }
}
