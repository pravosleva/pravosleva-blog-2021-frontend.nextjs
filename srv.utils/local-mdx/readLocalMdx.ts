import path from 'path'
import { TArticle } from '~/components/Article/types'
import { NCodeSamplesSpace } from '~/types'
import { defaultBg } from './defaultBg'

interface IMdxFrontMatter {
  title?: string
  brief?: string
  bg_src?: string
  bg_size?: { w: number; h: number }
  bg_type?: string
  createdAt?: string
  updatedAt?: string
  priority?: number
  tags?: string[]
  author?: string
  isPrivate?: boolean
  isDraft?: boolean
}

interface IEnhancedNote extends NCodeSamplesSpace.TNote {
  tags?: string[];
}

export interface IEnhancedArticle extends Omit<TArticle, 'original'> {
  original: IEnhancedNote;
  tags?: string[];
  author?: string;
  isLocal?: boolean;
}

// --- НАСТРОЙКИ КЭША ---
const CACHE_MAX_ITEMS = process.env.MDX_CACHE_MAX_ITEMS ? Number(process.env.MDX_CACHE_MAX_ITEMS) : 100 // Макс. 100 статей
const CACHE_MAX_MEMORY_MB = process.env.MDX_CACHE_MAX_MEMORY_MB ? Number(process.env.MDX_CACHE_MAX_MEMORY_MB) : 50 // Макс. 50 МБ

// Хранилище кэша в памяти сервера (работает как Map для сохранения порядка вставки элементов)
const mdxCache = new Map<string, { article: IEnhancedArticle; sizeInBytes: number }>()
let currentCacheSizeInBytes = 0

// Вспомогательная функция для приблизительной оценки размера объекта в байтах
const estimateObjectSizeInBytes = (obj: any): number => {
  try {
    const str = JSON.stringify(obj)
    return str ? str.length * 2 : 0 // 1 символ в JS строке занимает примерно 2 байта (UTF-16)
  } catch {
    return 0
  }
}

// Функция очистки старых элементов (LRU логика) при превышении лимитов
const enforceCacheLimits = () => {
  const maxMemoryBytes = CACHE_MAX_MEMORY_MB * 1024 * 1024

  // Удаляем элементы с самого начала Map (они самые "старые"), пока не уложимся в лимиты
  while (mdxCache.size > CACHE_MAX_ITEMS || currentCacheSizeInBytes > maxMemoryBytes) {
    const oldestKey = mdxCache.keys().next().value
    if (!oldestKey) break

    const oldestItem = mdxCache.get(oldestKey)
    if (oldestItem) {
      currentCacheSizeInBytes -= oldestItem.sizeInBytes
      mdxCache.delete(oldestKey)
      console.log(`[MDX Cache] Вытеснен старый элемент: ${oldestKey}.mdx из-за превышения лимитов.`)
    }
  }
}

/**
 * Вспомогательная функция для безопасного чтения локального MDX файла на сервере.
 * Поддерживает настраиваемый LRU-кэш по памяти и количеству документов.
 */
export const readLocalMdx = async (slug: string): Promise<IEnhancedArticle | null> => {
  if (typeof window !== 'undefined') return null

  // 1. ПРОВЕРКА КЭША: Если статья есть в памяти, отдаем её без чтения диска
  if (mdxCache.has(slug)) {
    const cachedData = mdxCache.get(slug)
    if (cachedData) {
      console.log(`[MDX Cache] Попадание в кэш (кэш-хит) для статьи: ${slug}.mdx`)
      
      // Обновляем позицию в Map, делая её "самой свежей" (удалили и перевставили в конец)
      mdxCache.delete(slug)
      mdxCache.set(slug, cachedData)
      
      return cachedData.article
    }
  }

  try {
    const fs = require('fs')
    const matter = require('gray-matter')

    const staticArticlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')
    const filePath = path.join(staticArticlesDirectory, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) return null

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const frontMatter = data as IMdxFrontMatter 

    if (frontMatter.isDraft) {
      console.log(`[MDX Fallback] Статья ${slug} пропущена, так как это черновик (isDraft: true)`)
      return null
    }

    const freshArticle: IEnhancedArticle = {
      original: {
        _id: slug,
        title: frontMatter.title || 'Без названия (Локальный файл)',
        description: content,
        isPrivate: frontMatter.isPrivate || false,
        createdAt: frontMatter.createdAt || new Date().toISOString(),
        updatedAt: frontMatter.updatedAt || new Date().toISOString(),
        priority: frontMatter.priority || 0,
        tags: frontMatter.tags || [],
      },
      slug: slug,
      brief: frontMatter.brief || 'Локальная копия статьи',
      bg: frontMatter.bg_src ? {
        src: frontMatter.bg_src || defaultBg.src,
        size: frontMatter.bg_size || defaultBg.size,
        type: frontMatter.bg_type || defaultBg.type,
      } : defaultBg,
      tags: frontMatter.tags || [],
      author: frontMatter.author || 'system',
      isLocal: true,
    }

    // 2. ЗАПИСЬ В КЭШ: Рассчитываем размер новой статьи и добавляем её в память
    const sizeInBytes = estimateObjectSizeInBytes(freshArticle)
    
    currentCacheSizeInBytes += sizeInBytes
    mdxCache.set(slug, { article: freshArticle, sizeInBytes })
    
    console.log(
      `[MDX Cache] Статья ${slug}.mdx успешно прочитана с диска и добавлена в кэш. Размер: ${(sizeInBytes / 1024).toFixed(2)} КБ.`
    )

    // Запускаем проверку ограничений
    enforceCacheLimits()

    return freshArticle
  } catch (error) {
    console.error(`[MDX Fallback] Ошибка чтения файла ${slug} из папки public:`, error)
    return null
  }
}
