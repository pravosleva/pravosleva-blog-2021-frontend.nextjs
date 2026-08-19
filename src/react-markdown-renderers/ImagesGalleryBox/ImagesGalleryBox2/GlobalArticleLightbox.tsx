import React, { useMemo } from 'react'
import Lightbox from 'react-image-lightbox'
import { useSignalValue } from '~/utils/reactive-engine'
import { galleryRegistrySignal, galleryActiveIndexSignal } from '~/store/reactive-engine/reactiveGalleryEngine'

export const GlobalArticleLightbox = () => {
  const images = useSignalValue(galleryRegistrySignal)
  const activeIndex = useSignalValue(galleryActiveIndexSignal)

  const isOpen = activeIndex !== -1 && images.length > 0
  
  const currentImage = useMemo(() => isOpen ? images[activeIndex] : null, [images, activeIndex, isOpen])
  
  const nextIndex = useMemo(() => (activeIndex + 1) % images.length, [images, activeIndex])
  const nextImage = useMemo(() => images[nextIndex] || currentImage, [images, nextIndex, currentImage])
  
  const prevIndex = useMemo(() => (activeIndex + images.length - 1) % images.length, [images, activeIndex])
  const prevImage = useMemo(() => images[prevIndex] || currentImage, [images, currentImage])

  if (!isOpen || !currentImage) return null

  return (
    <Lightbox
      mainSrc={currentImage.original}
      imageTitle={currentImage.title}
      imageCaption={currentImage.caption}
      mainSrcThumbnail={currentImage.src}
      nextSrc={nextImage.original}
      nextSrcThumbnail={nextImage.src}
      prevSrc={prevImage.original}
      prevSrcThumbnail={prevImage.src}
      onCloseRequest={() => {
        galleryActiveIndexSignal.value = -1 // Закрываем лайтбокс
      }}
      onMovePrevRequest={() => {
        galleryActiveIndexSignal.value = prevIndex
      }}
      onMoveNextRequest={() => {
        galleryActiveIndexSignal.value = nextIndex
      }}
    />
  )
}
