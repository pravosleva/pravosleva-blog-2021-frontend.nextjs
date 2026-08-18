import { useState, useEffect } from 'react'

/**
 * Хук для определения десктопного разрешения экрана (>= 800px)
 * Полностью безопасен для использования при SSR (Next.js)
 */
export const useIsDesktop = (breakpoint: number = 800): boolean => {
  // На сервере всегда возвращаем false, чтобы не ломать гидратацию HTML
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    // Этот код выполнится строго на клиенте, где объект window уже гарантированно существует
    const checkWidth = () => {
      setIsDesktop(window.innerWidth >= breakpoint)
    }

    // Проверяем ширину сразу при монтировании
    checkWidth()

    // Слушаем изменение размеров экрана с флагом passive для оптимизации скролла/рендеринга
    window.addEventListener('resize', checkWidth, { passive: true })
    
    return () => window.removeEventListener('resize', checkWidth)
  }, [breakpoint])

  return isDesktop
}
