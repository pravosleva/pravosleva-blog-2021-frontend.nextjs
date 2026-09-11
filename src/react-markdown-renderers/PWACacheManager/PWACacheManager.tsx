import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'

// --- Styled Components в стиле Material Oceanic ---
const CacheBox = styled.div`
  background-color: #263238;
  border: 2px solid #fff;
  border-radius: 16px;
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);

  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  margin-bottom: 1.45rem;
`

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const Title = styled.span`
  // font-size: 12px;
  color: #90a4ae;
  // text-transform: uppercase;
  letter-spacing: 0.05em;
  // font-weight: bold;
`

const SizeText = styled.span`
  // font-size: 16px;
  color: #eeffff;
  font-weight: bold;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
  
  & b {
    color: #ff9e3b; /* Оранжевый акцент на цифрах */
  }
`

const ClearButton = styled.button`
  background-color: rgba(255, 83, 112, 0.1);
  color: #ff5370;
  border: 1px solid rgba(255, 83, 112, 0.2);
  border-radius: 6px;
  font-size: small;
  @media(max-width: 768px) {
    padding: 2px 8px;
    font-size: x-small;
  }
  @media(min-width: 769px) {
    padding: 4px 12px;
    
  }
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  outline: none;

  &:hover:not(:disabled) {
    background-color: #ff5370;
    color: #1a2327;
    border-color: #ff5370;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    border-color: #37474f;
    color: #546e7a;
    background-color: transparent;
  }
`

const CACHE_NAME = 'podcast-audio-cache'

export const PWACacheManager = () => {
  const [cacheSizeText, setCacheSizeText] = useState<string>('0.0 Мб')
  const [isStorageSupported, setIsStorageSupported] = useState<boolean>(false)
  const [isClearing, setIsProcessing] = useState<boolean>(false)

  // Функция честного подсчета байт в Cache Storage
  const calculateCacheSize = useCallback(async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return

    try {
      const cache = await caches.open(CACHE_NAME)
      const keys = await cache.keys()
      let totalBytes = 0

      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          // Вытаскиваем размер из CDN/Nginx заголовков ответа
          const contentLength = response.headers.get('content-length')
          if (contentLength) {
            totalBytes += parseInt(contentLength, 10)
          }
        }
      }

      // Форматируем байты в понятный человеку вид
      if (totalBytes === 0) {
        setCacheSizeText('0.0 Мб')
      } else if (totalBytes < 1024 * 1024) {
        setCacheSizeText(`${(totalBytes / 1024).toFixed(1)} Кб`)
      } else {
        setCacheSizeText(`${(totalBytes / (1024 * 1024)).toFixed(1)} Мб`)
      }
    } catch (error) {
      console.error('[PWA Cache] Ошибка подсчета размера:', error)
      setCacheSizeText('неизвестно')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'caches' in window) {
      setIsStorageSupported(true)
      calculateCacheSize()
    }
  }, [calculateCacheSize])

  // Функция полной очистки кэша подкастов
  const handleClearCache = async () => {
    if (!window.confirm('Вы действительно хотите полностью стереть сохраненные подкасты из памяти устройства?')) {
      return
    }

    setIsProcessing(true)
    try {
      if ('caches' in window) {
        // Удаляем хранилище целиком
        const deleted = await caches.delete(CACHE_NAME)
        if (deleted) {
          console.log(`🧹 [PWA Cache]: Хранилище ${CACHE_NAME} успешно очищено.`)
          
          // Сбрасываем также метаданные экспирации Workbox в IndexedDB, чтобы синхронизировать лимиты
          if ('indexedDB' in window) {
            try {
              indexedDB.deleteDatabase('workbox-expiration')
            } catch (idbErr) {
              console.warn('[PWA Cache] Не удалось очистить IDB метаданные:', idbErr)
            }
          }
        }
      }
    } catch (err) {
      console.error('[PWA Cache] Ошибка очистки кэша:', err)
    } finally {
      // Пересчитываем размер (сбросит в 0.0 Мб) и снимаем лоадер кнопки
      await calculateCacheSize()
      setIsProcessing(false)
    }
  }

  // Если браузер вообще не поддерживает PWA технологии (например, старый WebView), не рендерим ничего
  if (!isStorageSupported) return null

  const isCacheEmpty = cacheSizeText === '0.0 Мб'

  return (
    <CacheBox>
      <InfoGroup>
        <Title>Автономная память PWA</Title>
        <SizeText>
          В кэше плеера <b>{cacheSizeText}</b>
        </SizeText>
      </InfoGroup>
      <ClearButton 
        disabled={isCacheEmpty || isClearing} 
        onClick={handleClearCache}
      >
        {isClearing ? 'Очистка...' : 'Сбросить кэш'}
      </ClearButton>
    </CacheBox>
  )
}

PWACacheManager.displayName = 'PWACacheManager'
