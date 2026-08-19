import { ReactiveEngine } from '@pravosleva/reactive-engine'
import { TNormalizedItem } from '~/react-markdown-renderers/ImagesGalleryBox/types'

export interface IGalleryRegistryItem extends TNormalizedItem {
  globalIndex: number;
  galleryId: string;
}

export const reactiveGalleryEngine = new ReactiveEngine({
  logger: {
    isEnabled: true,
    instanceName: 'Global Article Gallery'
  }
})

export const galleryRegistrySignal = reactiveGalleryEngine.signal<IGalleryRegistryItem[]>(
  [],
  'global:gallery-images-registry'
)

export const galleryActiveIndexSignal = reactiveGalleryEngine.signal<number>(
  -1,
  'global:gallery-active-index'
)

/**
 * Абсолютно безопасное добавление картинок в общий пул всей статьи.
 * Иммунно к Strict Mode, двойной гидратации и смене ID.
 */
export const registerGalleryItems = (items: TNormalizedItem[]) => {
  // Берём текущее состояние реестра из сигнала
  const currentRegistry = [...galleryRegistrySignal.value];
  const newItemsToPush: IGalleryRegistryItem[] = [];

  items.forEach((item) => {
    // Проверяем, добавлена ли уже эта картинка по её уникальному URL (src)
    const isAlreadyPresent = currentRegistry.some(img => img.src === item.src) ||
                             newItemsToPush.some(img => img.src === item.src);

    if (!isAlreadyPresent) {
      newItemsToPush.push({
        ...item,
        // Индекс строго инкрементируется от текущей реальной длины глобального массива
        globalIndex: currentRegistry.length + newItemsToPush.length,
        galleryId: 'article-static-node' // Нам больше не нужны рандомные ID
      });
    }
  });

  // Обновляем сигнал только если реально пришли новые, ещё не зарегистрированные картинки
  if (newItemsToPush.length > 0) {
    galleryRegistrySignal.value = [...currentRegistry, ...newItemsToPush];
  }
};

/**
 * Тотальный сброс галереи при смене статьи (вызывать в основном шаблоне статьи)
 */
export const resetGalleryRegistry = () => {
  galleryRegistrySignal.value = [];
  galleryActiveIndexSignal.value = -1;
};
