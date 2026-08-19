import { useMemo, useEffect, memo } from 'react'
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

  // Просто отправляем элементы на проверку. Повторные вызовы из-за ререндеров безопасны!
  // useEffect(() => {
  //   if (normalizedItems.length > 0) {
  //     registerGalleryItems(normalizedItems)
  //   }
  // }, [normalizedItems])
  useEffect(() => {
    if (normalizedItems.length > 0) {
      // ИСПРАВЛЕНО: Защита от родительского сброса при монтировании
      const timerId = setTimeout(() => {
        registerGalleryItems(normalizedItems);
      }, 0);

      return () => clearTimeout(timerId);
    }
  }, [normalizedItems]);

  const isServer = typeof window === 'undefined'
  if (isServer) return <CircularIndeterminate />
  
  if (!arePropsValid) return (
    <ResponsiveBlock isLimited isPaddedMobile style={{ paddingBottom: '30px' }}>
      <pre>{itemsJson}</pre>
    </ResponsiveBlock>
  )
  
  if (normalizedItems.length === 0) return <b>Empty ImagesGalleryBox</b>

  const handleImageClick = (src: string) => () => {
    // Находим картинку по её глобальному src в стабильном реестре
    const targetItem = globalRegistry.find(img => img.src === src)
    if (targetItem) {
      galleryActiveIndexSignal.value = targetItem.globalIndex // Провоцируем открытие лайтбокса
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
