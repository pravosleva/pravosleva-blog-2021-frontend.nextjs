// src/components/Markdown/ImagesGalleryBox2.tsx
import { useMemo, useEffect, memo } from 'react'
import { useStyles } from './useStyles'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { Image } from '../components'
import { TNormalizedItem } from '../types'
import { 
  galleryRegistrySignal, 
  galleryActiveIndexSignal, 
  registerGalleryItems
} from '~/store/reactive-engine/reactiveGalleryEngine'
import { useSignalValue } from '~/utils/reactive-engine'

interface IImagesGalleryBox2Props {
  itemsData?: string | TNormalizedItem[] // 🔥 Принимает И строковые JSON, И живые массивы!
  previewPosition?: 'left' | 'center'
};

export const ImagesGalleryBox2 = memo(({ itemsData, previewPosition }: IImagesGalleryBox2Props) => {
  const styles = useStyles()
  const globalRegistry = useSignalValue(galleryRegistrySignal)

  // 1. Умная валидация типа входящих данных
  const arePropsValid = useMemo(() => {
    if (!itemsData) return false
    
    // Если прилетел уже готовый массив — данные идеальны
    if (Array.isArray(itemsData)) return true
    
    // Если прилетела строка — пытаемся проверить, валидный ли это JSON
    if (typeof itemsData === 'string') {
      try {
        JSON.parse(itemsData)
        return true
      } catch (e) {
        console.warn('🚨 [Gallery JSON Error]:', e)
        return false
      }
    }
    return false
  }, [itemsData])

  // 2. Универсальная нормализация данных (0% техдолга)
  const normalizedItems: TNormalizedItem[] = useMemo(() => {
    if (!arePropsValid || !itemsData) return []
    if (Array.isArray(itemsData)) return itemsData // Если массив — отдаем как есть
    return JSON.parse(itemsData) // If строка — парсим
  }, [itemsData, arePropsValid])

  useEffect(() => {
    if (normalizedItems.length > 0) {
      const timerId = setTimeout(() => {
        registerGalleryItems(normalizedItems)
      }, 0)
      return () => clearTimeout(timerId)
    }
  }, [normalizedItems])

  const isServer = typeof window === 'undefined'
  if (isServer) return <CircularIndeterminate />
  
  if (!arePropsValid) return (
    <ResponsiveBlock isLimited isPaddedMobile style={{ paddingBottom: '30px' }}>
      <pre style={{ color: 'red', fontWeight: 'bold' }}>
        ERR: Invalid Gallery Data Type or JSON Structure
      </pre>
      <code style={{ fontSize: 'xs' }}>{String(itemsData)}</code>
    </ResponsiveBlock>
  )
  
  if (normalizedItems.length === 0) return <b>Empty ImagesGalleryBox</b>

  const handleImageClick = (src: string) => () => {
    const targetItem = globalRegistry.find(img => img.src === src)
    if (targetItem) {
      galleryActiveIndexSignal.value = targetItem.globalIndex
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
            previewPosition={previewPosition}
          />
        ))}
      </div>
    </div>
  )
})
