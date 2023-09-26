import { useState, useEffect } from 'react'

export const useUnscrolledBody = (initialShouldBodyUnscrolled: boolean) => {
  const [shouldBodyUnscrolled, setBodyUnscrolled] = useState(initialShouldBodyUnscrolled)

  useEffect(() => {
    if (!!window?.document) {
      if (shouldBodyUnscrolled) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }
    }
  }, [shouldBodyUnscrolled])

  return {
    shouldBodyUnscrolled,
    onBlockScrollBody: (isModalOpened: boolean) => setBodyUnscrolled(isModalOpened),
  }
}
