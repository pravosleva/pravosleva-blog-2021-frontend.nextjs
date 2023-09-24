import { useEffect, useRef, useState, useCallback } from 'react'
import { getTimeAgo } from '~/utils/getTimeAgo'

type TProps = {
  date: number | undefined;
  delay: number
}

const defaultTimeAgoText = ''

export const useTimeAgo = ({
  date,
  delay,
}: TProps) => {
  const _lastDateRef = useRef<number>(new Date().getTime())
  const timeoutRef = useRef<NodeJS.Timeout | undefined>()
  const _timeAgoTextRef = useRef<string>(defaultTimeAgoText)
  const [timeAgoText, setTimeAgoText] = useState('')

  const [count, setCount] = useState<number>(0)

  const updateCounter = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  useEffect(() => {
    if (!!timeoutRef.current) clearTimeout(timeoutRef.current)

    const _newText = getTimeAgo(date)
    if (_timeAgoTextRef.current !== _newText) {
      _timeAgoTextRef.current = _newText
      setTimeAgoText(_newText)
    }

    timeoutRef.current = setTimeout(updateCounter, delay)

    if (!!timeoutRef.current)
      return () => {
        if (!!timeoutRef.current) clearTimeout(timeoutRef.current)
      }
  }, [count])

  useEffect(() => {
    if (_lastDateRef.current !== date) updateCounter()
  }, [date])

  return {
    timeAgoText: !!date ? timeAgoText : defaultTimeAgoText,
    // _count: count,
  }
}
