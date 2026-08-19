import { useMemo, useEffect, useState, memo } from 'react'
import { useStyles } from './useStyles'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { Image } from '../components'
import { TNormalizedItem, TProps } from '../types'
import { 
  galleryRegistrySignal, 
  galleryActiveIndexSignal, 
  registerGalleryItems
} from '~/store/reactive-engine/reactiveGalleryEngine'
import { useSignalValue } from '~/utils/reactive-engine'

export const ImagesGalleryBox2 = memo(({ itemsJson }: TProps) => {
  const styles = useStyles()
  
  // Создаем стабильный ID галереи на весь её жизненный цикл
  const [galleryId] = useState(() => `gallery-${Math.random().toString(36).substr(2, 9)}`)
  
  const globalRegistry = useSignalValue(galleryRegistrySignal)

  const arePropsValid = useMemo(() => {
    try {
      if (typeof itemsJson !== 'string') throw new Error(`🚫 Incorrect type: ${typeof itemsJson}`)
      JSON.parse(itemsJson)
      return true
    } catch (e) {
      console.warn(e)
      return false
    }
  }, [itemsJson])

  const normalizedItems: TNormalizedItem[] = useMemo(() => {
    return arePropsValid ? JSON.parse(itemsJson) : []
  }, [itemsJson, arePropsValid])

  // Пушим картинки в сквозной реактивный список по мере рендеринга JsxParser
  useEffect(() => {
    if (normalizedItems.length > 0) {
      registerGalleryItems(galleryId, normalizedItems)
    }
  }, [galleryId, normalizedItems])

  const isServer = typeof window === 'undefined'
  if (isServer) return <CircularIndeterminate />
  
  if (!arePropsValid) return (
    <ResponsiveBlock isLimited isPaddedMobile style={{ paddingBottom: '30px' }}>
      <pre>{itemsJson}</pre>
    </ResponsiveBlock>
  )
  
  if (normalizedItems.length === 0) return <b>Empty ImagesGalleryBox</b>

  const handleImageClick = (src: string) => () => {
    // Находим глобальный сквозной индекс кликнутой картинки в ядре
    const targetItem = globalRegistry.find(img => img.galleryId === galleryId && img.src === src);
    if (targetItem) {
      galleryActiveIndexSignal.value = targetItem.globalIndex;
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.srLWrapperLayout}>
        {normalizedItems.map(({ src, caption }, i) => (
          <Image
            key={`${i}-${src}`}
            src={src}
            alt={caption || 'img'}
            onClickHandler={handleImageClick(src)}
          />
        ))}
      </div>
    </div>
  )
})
