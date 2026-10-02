import React from 'react'
import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

type TProps = {
  src: string;
  alt: string;
  onClickHandler: () => void;
  previewPosition?: 'left' | 'center';
  // TODO: Добавляем размеры для next/image (рекомендуется для предотвращения Layout Shift)
  // width?: number | string;
  // height?: number | string;
  // layout?: 'fill' | 'fixed' | 'intrinsic' | 'responsive';
}

const LOADER_MAP: Record<string, string> = {
  'light': '/static/img/loaders/loader7-primary.svg',
  'gray': '/static/img/loaders/loader7.svg',
  'hard-gray': '/static/img/loaders/loader7-orange.svg',
  'dark': '/static/img/loaders/loader7-orange.svg',
}

const DEFAULT_LOADER = '/static/img/loaders/loader7-primary.svg'

export const Image = React.memo(({ 
  src, 
  alt, 
  onClickHandler, 
  previewPosition = 'center',
}: TProps) => {
  // ⚡ РЕШЕНИЕ: triggerOnce: true отключает observer после первого пересечения экрана
  const { ref, inView } = useInView({ 
    threshold: 0,
    triggerOnce: true 
  })
  
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)
  const previewSrc = LOADER_MAP[currentTheme] || DEFAULT_LOADER

  return (
    <img
      ref={ref}
      src={inView ? src : previewSrc}
      alt={alt}
      onClick={onClickHandler}
      className={inView ? previewPosition : 'center'}
    />
  )
})

Image.displayName = 'Image'
