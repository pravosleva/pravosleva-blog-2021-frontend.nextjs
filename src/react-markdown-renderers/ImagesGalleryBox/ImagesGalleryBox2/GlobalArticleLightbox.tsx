import React, { useMemo } from 'react'
import Lightbox from 'react-image-lightbox'
import { useSignalValue } from '~/utils/reactive-engine'
import { galleryRegistrySignal, galleryActiveIndexSignal } from '~/store/reactive-engine/reactiveGalleryEngine'

export const GlobalArticleLightbox = () => {
  const images = useSignalValue(galleryRegistrySignal)
  const activeIndex = useSignalValue(galleryActiveIndexSignal)

  const isOpen = activeIndex !== -1 && images.length > 0
  
  const currentImage = useMemo(() => isOpen ? images[activeIndex] : null, [images, activeIndex, isOpen])
  
  // Проверяем реальное количество УНИКАЛЬНЫХ картинок в статье
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

  if (!isOpen || !currentImage) return null

  return (
    <Lightbox
      mainSrc={currentImage.original}
      imageTitle={currentImage.title}
      imageCaption={currentImage.caption}
      mainSrcThumbnail={currentImage.src}
      
      // ИСПРАВЛЕНО: Передаем undefined вместо null, чтобы соответствовать типам библиотеки
      nextSrc={nextImage?.original ?? undefined}
      nextSrcThumbnail={nextImage?.src ?? undefined}
      prevSrc={prevImage?.original ?? undefined}
      prevSrcThumbnail={prevImage?.src ?? undefined}
      
      onCloseRequest={() => {
        galleryActiveIndexSignal.value = -1
      }}
      onMovePrevRequest={hasMoreThanOneImage ? () => { galleryActiveIndexSignal.value = prevIndex } : undefined}
      onMoveNextRequest={hasMoreThanOneImage ? () => { galleryActiveIndexSignal.value = nextIndex } : undefined}
    />
  )
}
