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
 * Безопасное добавление картинок конкретной галереи в общий пул
 */
export const registerGalleryItems = (galleryId: string, items: TNormalizedItem[]) => {
  const currentRegistry = [...galleryRegistrySignal.value];
  
  // Проверяем, не добавлены ли уже картинки ЭТОЙ конкретной галереи (защита от лишних ререндеров React)
  const isAlreadyRegistered = currentRegistry.some(img => img.galleryId === galleryId);
  if (isAlreadyRegistered) return;

  const startIdx = currentRegistry.length;
  
  const mappedItems: IGalleryRegistryItem[] = items.map((item, index) => ({
    ...item,
    globalIndex: startIdx + index,
    galleryId
  }));
  
  galleryRegistrySignal.value = [...currentRegistry, ...mappedItems];
};

/**
 * Тотальный сброс галереи при смене статьи (вызывать в основном шаблоне статьи)
 */
export const resetGalleryRegistry = () => {
  galleryRegistrySignal.value = [];
  galleryActiveIndexSignal.value = -1;
};
