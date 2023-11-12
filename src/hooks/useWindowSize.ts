import { useState, useEffect } from 'react'
import { breakpoints } from '~/mui/theme'

const { sm, md, xl, lg } = breakpoints

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/

  const [windowSize, setWindowSize] = useState({
    width: 500, // undefined,
    height: 500, // undefined,
    isMobile: false,
    isDesktop: false,

    upSm: false,
    upMd: false,
    upLg: false,
    upXl: false,

    downSm: false,
    downMd: false,
    downLg: false,
    downXl: false,
  })

  useEffect(() => {
    function handleResize() {
      const width = window?.innerWidth
      const height = window?.innerHeight
      const isMobile = width <= md
      const isDesktop = width > md
      const upSm = width > sm
      const upMd = width > md
      const upLg = width > lg
      const upXl = width > xl

      const downSm = width <= sm
      const downMd = width <= md
      const downLg = width <= lg
      const downXl = width <= xl

      // Set window width/height to state
      setWindowSize({
        width,
        height,
        isMobile,
        isDesktop,

        upSm,
        upMd,
        upLg,
        upXl,
        
        downSm,
        downMd,
        downLg,
        downXl,
      })
    }

    // Handler to call on window resize
    if (typeof window !== 'undefined') {
      // Add event listener
      window.addEventListener('resize', handleResize)

      // Call handler right away so state gets updated with initial window size
      handleResize()
    }

    // Remove event listener on cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [typeof window]) // Empty array ensures that effect is only run on mount

  return windowSize
}
