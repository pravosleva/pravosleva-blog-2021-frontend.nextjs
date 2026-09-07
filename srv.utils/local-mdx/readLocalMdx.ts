import path from 'path'
// import { NCodeSamplesSpace } from '~/types'
import { defaultBg } from './defaultBg'
import { IEnhancedArticle, IMdxFrontMatter } from './types'

// ОПТИМИЗАЦИЯ 1: Выносим импорты на уровень модуля. 
// require() внутри функции на каждый файл плодит инстансы зависимостей в памяти.
const fs = require('fs')
const matter = require('gray-matter')


// --- НАСТРОЙКИ КЭША ---
const CACHE_MAX_ITEMS = process.env.MDX_CACHE_MAX_ITEMS ? Number(process.env.MDX_CACHE_MAX_ITEMS) : 100 
const CACHE_MAX_MEMORY_MB = process.env.MDX_CACHE_MAX_MEMORY_MB ? Number(process.env.MDX_CACHE_MAX_MEMORY_MB) : 50 

const mdxCache = new Map<string, { article: IEnhancedArticle; sizeInBytes: number }>()
let currentCacheSizeInBytes = 0

// ОПТИМИЗАЦИЯ 2: Оценка размера без JSON.stringify.
// Стрингификация больших объектов (особенно когда `content` — это весь текст статьи) 
// создает гигантские временные строки в памяти, удваивая её потребление.
const estimateObjectSizeInBytes = (obj: any): number => {
  if (!obj) return 0;
  // Грубая, но безопасная для памяти оценка: длина текста + структура
  const textLength = (obj.original?.description?.length || 0) + (obj.brief?.length || 0);
  return textLength * 2 + 500; 
}

const enforceCacheLimits = () => {
  const maxMemoryBytes = CACHE_MAX_MEMORY_MB * 1024 * 1024
  while (mdxCache.size > CACHE_MAX_ITEMS || currentCacheSizeInBytes > maxMemoryBytes) {
    const oldestKey = mdxCache.keys().next().value
    if (!oldestKey) break

    const oldestItem = mdxCache.get(oldestKey)
    if (oldestItem) {
      currentCacheSizeInBytes -= oldestItem.sizeInBytes
      mdxCache.delete(oldestKey)
    }
  }
}

// Заранее вычисляем путь к директории один раз при старте сервера
const staticArticlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')

/**
 * Оптимизированная функция чтения локального MDX файла.
 */
export const readLocalMdx = async (slug: string): Promise<IEnhancedArticle | null> => {
  if (typeof window !== 'undefined') return null

  // 1. ПРОВЕРКА КЭША
  const cachedData = mdxCache.get(slug)
  if (cachedData) {
    mdxCache.delete(slug)
    mdxCache.set(slug, cachedData)
    return cachedData.article
  }

  try {
    const filePath = path.join(staticArticlesDirectory, `${slug}.mdx`)

    // ОПТИМИЗАЦИЯ 3: Заменяем синхронные методы fs на асинхронные из промисов.
    // Это освобождает поток выполнения (Event Loop) и позволяет Node.js вовремя чистить память.
    try {
      await fs.promises.access(filePath)
    } catch {
      return null
    }

    const fileContents = await fs.promises.readFile(filePath, 'utf8')
    
    // Парсим фронтматтер
    const { data, content } = matter(fileContents)
    const frontMatter = data as IMdxFrontMatter 

    if (frontMatter.isDraft) {
      return null
    }

    const freshArticle: IEnhancedArticle = {
      original: {
        _id: slug,
        title: frontMatter.title || 'Без названия (Локальный файл)',
        description: content, // ОПТИМИЗАЦИЯ 4 (см. совет ниже)
        isPrivate: frontMatter.isPrivate || false,
        createdAt: frontMatter.createdAt || new Date().toISOString(),
        updatedAt: frontMatter.updatedAt || new Date().toISOString(),
        priority: frontMatter.priority || 0,
      },
      slug: slug,
      brief: frontMatter.brief || 'Локальная копия статьи',
      bg: frontMatter.bg_src ? {
        src: frontMatter.bg_src || defaultBg.src,
        size: frontMatter.bg_size || defaultBg.size,
        type: frontMatter.bg_type || defaultBg.type,
      } : defaultBg,
    }

    // 2. ЗАПИСЬ В КЭШ
    const sizeInBytes = estimateObjectSizeInBytes(freshArticle)
    currentCacheSizeInBytes += sizeInBytes
    mdxCache.set(slug, { article: freshArticle, sizeInBytes })

    enforceCacheLimits()

    return freshArticle
  } catch (error) {
    console.error(`[MDX Fallback] Ошибка чтения файла ${slug}:`, error)
    return null
  }
}
