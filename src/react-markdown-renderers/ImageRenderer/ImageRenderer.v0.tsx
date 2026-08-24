import { useEffect, useMemo } from 'react'
import { 
  galleryRegistrySignal, 
  galleryActiveIndexSignal, 
  registerGalleryItems 
} from '~/store/reactive-engine/reactiveGalleryEngine'
import { TNormalizedItem } from '~/react-markdown-renderers/ImagesGalleryBox/types'

interface IProps {
  alt: string
  src: string
  title?: string // <-- ReactMarkdown сам передаст сюда строку из кавычек
}

export const ImageRenderer = ({ alt, src, title }: IProps) => {
  const normalizedItem: TNormalizedItem = useMemo(() => ({
    src,
    original: src,
    width: 0,
    height: 0,
    tags: [],
    title: title || alt || 'Изображение', // <-- Заголовок лайтбокса
    caption: alt || ''                    // <-- Нижнее описание в лайтбоксе
  }), [src, alt])

  useEffect(() => {
    if (!src) return;

    // ИСПРАВЛЕНО: Уходим в конец очереди макротасок (setTimeout 0). 
    // Картинка зарегистрируется строго ПОСЛЕ того, как родительский сброс resetGalleryRegistry() очистит массив.
    const timerId = setTimeout(() => {
      registerGalleryItems([normalizedItem]);
    }, 0);

    return () => clearTimeout(timerId);
  }, [normalizedItem, src])

  const handleClick = () => {
    const currentRegistry = galleryRegistrySignal.value;
    const targetItem = currentRegistry.find(img => {
      if (!img.src || !src) return false;
      return img.src.includes(src) || src.includes(img.src);
    });

    if (targetItem) {
      galleryActiveIndexSignal.value = targetItem.globalIndex;
    } else {
      console.warn(`⚠️ [ImageRenderer]: Картинка с src "${src}" не найдена в реестре статьи! Доступно:`, currentRegistry);
    }
  }

  if (!src) return null;

  return (
    <img 
      className="small"
      alt={alt} 
      src={src} 
      onClick={handleClick} 
      style={{ cursor: 'pointer' }}
    />
  )
}
