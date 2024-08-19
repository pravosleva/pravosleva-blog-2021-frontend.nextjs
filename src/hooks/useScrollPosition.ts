import { useState, useEffect } from 'react'
import { useDebounce } from '~/hooks/useDebounce'

export interface IWindowDims {
  pageYOffset: number;
}

function isItMoreThan2Screens(): boolean {
  const { innerHeight, pageYOffset } = window
  return innerHeight * 2 - pageYOffset < 0
}

export const useScrollPosition = (): {
  scrollPosition: IWindowDims;
  isMoreThan2Screens: boolean;
} => {
  const [scrollPosition, setScrollPosition] = useState<IWindowDims>({
    pageYOffset: 0,
  })
  const [isMoreThan2Screens, setIsMoreThan2Screens] = useState<boolean>(false)

  const debouncedCurrentHeight = useDebounce(scrollPosition?.pageYOffset, 100)

  useEffect(() => {
    function handleScroll() {
      setScrollPosition({ pageYOffset: !!window ? window.pageYOffset : 0 })
    }

    // return EventBus.on('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMoreThan2Screens(isItMoreThan2Screens())
  }, [debouncedCurrentHeight, setIsMoreThan2Screens])

  return { scrollPosition, isMoreThan2Screens }
}
