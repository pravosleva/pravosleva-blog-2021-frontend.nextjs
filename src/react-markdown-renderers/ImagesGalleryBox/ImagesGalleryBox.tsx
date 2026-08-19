import { useMemo, useEffect, useState, memo } from 'react'
import { useStyles } from './styles'
import { CircularIndeterminate } from '~/mui/CircularIndeterminate'
import { ResponsiveBlock } from '~/mui/ResponsiveBlock'
import { Image } from './components'
import { TNormalizedItem, TProps } from './types'
import { 
  galleryRegistrySignal, 
  galleryActiveIndexSignal, 
  registerGalleryItems
} from '~/store/reactive-engine/reactiveGalleryEngine'
import { useSignalValue } from '~/utils/reactive-engine'

export const ImagesGalleryBox = memo(({ itemsJson }: TProps) => {
  const styles = useStyles()
  
  // Инициализируем стабильный уникальный ID для конкретного инстанса этой галереи
  const [galleryId] = useState(() => `gallery-flat-${Math.random().toString(36).substr(2, 9)}`)
  
  // Подписываемся на сквозной глобальный реестр картинок
  const globalRegistry = useSignalValue(galleryRegistrySignal)

  // Безопасная проверка валидности пропсов (ИСПРАВЛЕНО: обернуто в useMemo)
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

  // Безопасный парсинг элементов (ИСПРАВЛЕНО: больше не парсит сырую строку прямо в теле рендера)
  const normalizedItems: TNormalizedItem[] = useMemo(() => {
    return arePropsValid ? JSON.parse(itemsJson) : []
  }, [itemsJson, arePropsValid])

  // РЕГИСТРАЦИЯ: Пушим картинки этой галереи в общий стек ядра статьи
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

  // Хендлер клика: открывает модалку на правильном глобальном индексе
  const handleImageClick = (src: string) => () => {
    const targetItem = globalRegistry.find(img => img.galleryId === galleryId && img.src === src)
    if (targetItem) {
      galleryActiveIndexSignal.value = targetItem.globalIndex // Передаем управление в GlobalArticleLightbox
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
