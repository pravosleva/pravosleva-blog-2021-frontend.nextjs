import path from 'path'
import { IEnhancedArticle } from './types'
import { readLocalMdxShort } from './readLocalMdxShort'

const fs = require('fs')
const staticArticlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')

/**
 * ОПТИМИЗИРОВАННЫЙ ПОИСК
 * Читает файлы по очереди (сериализированно), не создавая пиков в RAM
 */
export const searchLocalMdx = async (searchQuery: string): Promise<IEnhancedArticle[]> => {
  const results: IEnhancedArticle[] = []
  if (!searchQuery) return results

  try {
    // Читаем список файлов в папке
    const files = await fs.promises.readdir(staticArticlesDirectory)
    const mdxFiles = files.filter((f: string) => f.endsWith('.mdx'))

    const lowerQuery = searchQuery.toLowerCase()

    // Используем обычный for...of вместо Promise.all или .forEach.
    // Это гарантирует последовательную обработку: один файл обработался, память очистилась, пошел второй.
    for (const file of mdxFiles) {
      const slug = file.replace(/\.mdx$/, '')
      
      // Читаем только легковесные метаданные
      const shortArticle = await readLocalMdxShort(slug)
      
      if (shortArticle && shortArticle.original?.title) {
        const titleMatch = shortArticle.original.title.toLowerCase().includes(lowerQuery)
        const briefMatch = shortArticle.brief?.toLowerCase().includes(lowerQuery)

        if (titleMatch || briefMatch) {
          results.push(shortArticle)
        }
      }
    }
  } catch (err) {
    console.error('[MDX Search] Ошибка при локальном поиске:', err)
  }

  return results
}
