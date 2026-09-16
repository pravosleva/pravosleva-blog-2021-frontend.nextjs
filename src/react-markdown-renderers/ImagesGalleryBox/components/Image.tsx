import { useInView } from 'react-intersection-observer'
import { useSelector } from 'react-redux'
import { IRootState } from '~/store/IRootState'

type TProps = {
  src: string;
  alt: string;
  onClickHandler: () => void;
  previewPosition?: 'left' | 'center';
}

// 🎯 СТАБИЛЬНЫЙ СЛОВАРЬ ЛОАДЕРОВ: Вынесен из компонента, чтобы не пересоздаваться в памяти
const LOADER_MAP: Record<string, string> = {
  'light': '/static/img/loaders/loader7-primary.svg',
  'gray': '/static/img/loaders/loader7.svg',
  'hard-gray': '/static/img/loaders/loader7-orange.svg',
  'dark': '/static/img/loaders/loader7-orange.svg',
}

const DEFAULT_LOADER = '/static/img/loaders/loader7-primary.svg'

export const Image = ({ src, alt, onClickHandler, previewPosition = 'center' }: TProps) => {
  // Хук ленивой загрузки (Lazy Loading) через Intersection Observer
  const { ref, inView } = useInView({ threshold: 0 })
  
  // Получаем текущую тему из глобального Redux-хранилища
  const currentTheme = useSelector((state: IRootState) => state.globalTheme.theme)

  // Мгновенный и легковесный выбор лоадера без useMemo
  const previewSrc = LOADER_MAP[currentTheme] || DEFAULT_LOADER

  return (
    <img
      ref={ref}
      src={inView ? src : previewSrc}
      alt={alt}
      onClick={onClickHandler}
      // Если картинка вне зоны видимости — жестко держим класс 'center' для лоадера
      className={inView ? previewPosition : 'center'}
    />
  )
}
