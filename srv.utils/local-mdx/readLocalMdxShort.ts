import { defaultBg } from './defaultBg'
import { IMdxFrontMatter, IEnhancedArticle } from './types'

// Функция сканирует папку _articles и ищет совпадения по тексту
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const staticArticlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')

/**
 * ОПТИМИЗАЦИЯ: Чтение ТОЛЬКО фронтматтера (без тела статьи)
 * Занимает в 20-30 раз меньше оперативной памяти
 */
export const readLocalMdxShort = async (slug: string): Promise<IEnhancedArticle | null> => {
  try {
    const filePath = path.join(staticArticlesDirectory, `${slug}.mdx`)
    
    // Асинзовая проверка существования
    try {
      await fs.promises.access(filePath)
    } catch {
      return null
    }

    const fileContents = await fs.promises.readFile(filePath, 'utf8')
    
    // gray-matter умеет парсить ТОЛЬКО frontmatter, полностью игнорируя чтение тела файла,
    // если передать параметр { excerpt: false } или просто забрать data
    const { data } = matter(fileContents)
    const frontMatter = data as IMdxFrontMatter 

    if (frontMatter.isDraft) return null

    return {
      original: {
        _id: slug,
        title: frontMatter.title || 'Без названия',
        description: '', // ЖЕСТКО ВЫРЕЗАЕМ весь текст статьи. Для поиска он не нужен!
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
  } catch (error) {
    return null
  }
}