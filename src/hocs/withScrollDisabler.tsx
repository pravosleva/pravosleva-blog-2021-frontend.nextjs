import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

export const withScrollDisabler = (WrappedComponent: any) => {
  const Wrapper = (props: any) => {
    const scrollDisablingComponentsList = useSelector((state: IRootState) => state.scrollDisablingComponents.list)
    const scrollToRef = (ref: any, paddingTop = 10) => {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.offsetTop - paddingTop,
          behavior: 'smooth',
        })
      }
    }

    useEffect(() => {
      const shouldDisable = scrollDisablingComponentsList.length > 0

      try {
        document.body.style.overflow = shouldDisable ? 'hidden' : 'auto'
        // @ts-ignore
        document.body.style.position = shouldDisable ? 'fixed' : null
        // @ts-ignore
        document.body.style.left = shouldDisable ? '0' : null
        // @ts-ignore
        document.body.style.right = shouldDisable ? '0' : null
      } catch (err) {
        console.log(err)
      }
    }, [scrollDisablingComponentsList.length])

    return <WrappedComponent {...props} scrollToRef={scrollToRef} />
  }

  return Wrapper
}
