// src/components/ClearPwaCacheBtn.tsx
import React, { useState, useCallback } from 'react'
import clsx from 'clsx'
// import btnClasses from '~/ui.button.module.scss' // Ваши стили кнопок

export const ClearPwaCacheBtn = () => {
  const [status, setStatus] = useState<'idle' | 'clearing' | 'success' | 'failed'>('idle')

  const handleClearCache = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Защита для SSR: на сервере Node.js объекта caches не существует
    if (typeof window === 'undefined' || !('caches' in window)) {
      setStatus('failed')
      return
    }

    try {
      setStatus('clearing')

      // 1. Получаем имена всех зарегистрированных кэш-хранилищ PWA
      const cacheNames = await window.caches.keys()
      
      // 2. Параллельно удаляем каждое хранилище (включая 'podcast-audio-cache', 'static-assets' и т.д.)
      await Promise.all(
        cacheNames.map((cacheName) => window.caches.delete(cacheName))
      )

      // 3. Перезапускаем Service Worker, чтобы он перерегистрировал чистые кэши
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
      }

      setStatus('success')
      
      // Через 3 секунды возвращаем кнопку в исходное состояние и жестко перезагружаем страницу
      setTimeout(() => {
        setStatus('idle')
        window.location.reload() // Перезагрузка выкачает свежие файлы mp3/css напрямую из сети
      }, 2000)

    } catch (err) {
      console.error('🚨 [PWA Cache]: Ошибка при очистке Cache Storage:', err)
      setStatus('failed')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }, [])

  // Динамический текст и стили в зависимости от состояния процесса
  const getBtnText = () => {
    switch (status) {
      case 'clearing': return 'Очистка кэша... ⏳'
      case 'success': return 'Кэш очищен! Перезапуск... ✓'
      case 'failed': return 'Ошибка очистки ❌'
      default: return 'Очистить кэш PWA'
    }
  }

  return (
    <button
      onClick={handleClearCache}
      disabled={status === 'clearing' || status === 'success'}
      // className={clsx(btnClasses.neonBtn, {
      //   [btnClasses['neonBtn--danger']]: status === 'failed',
      //   [btnClasses['neonBtn--success']]: status === 'success',
      //   [btnClasses['neonBtn--outlined']]: status === 'idle'
      // })}
      style={{
        padding: '6px 14px',
        fontSize: 'small',
        borderRadius: '8px',
        cursor: status === 'clearing' ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        opacity: status === 'clearing' ? 0.7 : 1
      }}
    >
      {getBtnText()}
    </button>
  )
}
