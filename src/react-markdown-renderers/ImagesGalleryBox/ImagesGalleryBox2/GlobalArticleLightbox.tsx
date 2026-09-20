import React, { useEffect, useMemo, useState } from 'react'
import Lightbox from 'react-image-lightbox'
import { useSignalValue } from '~/utils/reactive-engine'
import { galleryRegistrySignal, galleryActiveIndexSignal } from '~/store/reactive-engine/reactiveGalleryEngine'

export const GlobalArticleLightbox = () => {
  const images = useSignalValue(galleryRegistrySignal)
  const activeIndex = useSignalValue(galleryActiveIndexSignal)

  const isOpen = activeIndex !== -1 && images.length > 0
  
  const currentImage = useMemo(() => isOpen ? images[activeIndex] : null, [images, activeIndex, isOpen])
  const hasMoreThanOneImage = images.length > 1

  const nextIndex = useMemo(() => {
    return hasMoreThanOneImage ? (activeIndex + 1) % images.length : -1
  }, [images, activeIndex, hasMoreThanOneImage])
  
  const nextImage = useMemo(() => {
    return (hasMoreThanOneImage && nextIndex !== -1) ? images[nextIndex] : null
  }, [images, nextIndex, hasMoreThanOneImage])
  
  const prevIndex = useMemo(() => {
    return hasMoreThanOneImage ? (activeIndex + images.length - 1) % images.length : -1
  }, [images, activeIndex, hasMoreThanOneImage])
  
  const prevImage = useMemo(() => {
    return (hasMoreThanOneImage && prevIndex !== -1) ? images[prevIndex] : null
  }, [images, prevIndex, hasMoreThanOneImage])

  // ИСПРАВЛЕНО: Динамически формируем верхний заголовок со счётчиком ("1 / 5 | Название картинки")
  const displayTitle = useMemo(() => {
    if (!currentImage) return undefined
    
    const counterStr = `${activeIndex + 1} / ${images.length}`
    const customTitle = currentImage.title || ''
    
    // Если у картинки есть свой title, красиво объединяем его со счётчиком
    return customTitle ? `${counterStr} — ${customTitle}` : counterStr
  }, [currentImage, activeIndex, images.length])

  const [isFullscreen, setIsFullscreen] = useState(false)

  // Следим за тем, вышел ли пользователь из полноэкранного режима кнопкой Esc
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Ошибка включения полноэкранного режима: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const [showCaption, setShowCaption] = useState(true)

  // Формируем кастомное описание с кнопкой сворачивания
  const customCaption = useMemo(() => {
    if (!currentImage?.caption) return null

    return (
      <div style={{ color: '#fff', maxWidth: '600px' }}>
        <div style={{ marginBottom: '0px' }}>
          <button
            onClick={() => setShowCaption((s) => !s)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: 'small',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {showCaption
              ? <><span>✕</span><span>Скрыть описание</span></>
              : <><span>👁</span><span>Показать описание</span></>
            }
          </button>
        </div>
        
        {/* Анимировать или просто скрывать контент */}
        {showCaption && (
          <div style={{
            marginTop: '8px',
            overflowY: 'auto', 
            fontSize: 'small', 
            lineHeight: '1.4' 
          }}>
            {currentImage.caption}
          </div>
        )}
      </div>
    )
  }, [currentImage?.caption, showCaption])

  if (!isOpen || !currentImage) return null

  return (
    <Lightbox
      mainSrc={currentImage.original}
      
      // ИСПРАВЛЕНО: Передаем сгенерированный заголовок со счетчиком в imageTitle
      imageTitle={displayTitle}
      // imageCaption={currentImage.caption}
      // Заменяем строку на наш кастомный JSX-компонент
      imageCaption={customCaption}
      mainSrcThumbnail={currentImage.src}
      
      nextSrc={nextImage?.original ?? undefined}
      nextSrcThumbnail={nextImage?.src ?? undefined}
      prevSrc={prevImage?.original ?? undefined}
      prevSrcThumbnail={prevImage?.src ?? undefined}
      
      onCloseRequest={() => {
        galleryActiveIndexSignal.value = -1
      }}
      onMovePrevRequest={hasMoreThanOneImage ? () => { galleryActiveIndexSignal.value = prevIndex } : undefined}
      onMoveNextRequest={hasMoreThanOneImage ? () => { galleryActiveIndexSignal.value = nextIndex } : undefined}

      toolbarButtons={[
        <button
          key="fullscreen-btn"
          onClick={toggleFullscreen}
          style={{
            background: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '35px',
            padding: '0px',
            opacity: 0.7,
            transition: 'opacity 0.2s',
            display: 'flex',
            border: 'none',
            width: '45px',
            height: '50px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
        >
          {isFullscreen ? '↙' : '↗'} 
        </button>
      ]}
    />
  )
}
