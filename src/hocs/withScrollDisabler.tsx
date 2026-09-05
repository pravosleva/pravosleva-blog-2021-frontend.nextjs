import React, { useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

export const withScrollDisabler = <T extends object>(
  WrappedComponent: React.ComponentType<T & { scrollToRef: (ref: React.RefObject<HTMLElement | null>, paddingTop?: number) => void }>
) => {
  const Wrapper = (props: T) => {
    // Оптимизация 1: Вытаскиваем только длину массива. 
    // Нам не нужен сам список компонентов, нужен только факт его пустоты.
    // Это защитит от лишних рендеров, если состав списка изменился, а количество — нет.
    const hasDisablingComponents = useSelector(
      (state: IRootState) => state.scrollDisablingComponents.list.length > 0
    )

    // Оптимизация 2: Мемоизируем функцию скролла. 
    // Теперь ссылка на неё стабильна и не вызывает перерисовок дочернего компонента.
    const scrollToRef = useCallback((ref: React.RefObject<HTMLElement | null>, paddingTop = 10) => {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.offsetTop - paddingTop,
          behavior: 'smooth',
        })
      }
    }, [])

    // Оптимизация 3: Управление стилями body
    useEffect(() => {
      if (typeof window === 'undefined') return

      const body = document.body

      if (hasDisablingComponents) {
        body.style.overflow = 'hidden'
        body.style.position = 'fixed'
        body.style.left = '0'
        body.style.right = '0'
      } else {
        body.style.overflow = ''
        body.style.position = ''
        body.style.left = ''
        body.style.right = ''
      }

      // Очистка (cleanup): если компонент размонтируется, возвращаем скролл назад
      return () => {
        body.style.overflow = ''
        body.style.position = ''
        body.style.left = ''
        body.style.right = ''
      }
    }, [hasDisablingComponents])

    return <WrappedComponent {...props} scrollToRef={scrollToRef} />
  }

  // Задаем имя для отладки в React DevTools
  Wrapper.displayName = `withScrollDisabler(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return Wrapper
}
