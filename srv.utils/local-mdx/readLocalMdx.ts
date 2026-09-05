import path from 'path'
import { TArticle } from '~/components/Article/types'
import { NCodeSamplesSpace } from '~/types'
import { defaultBg } from './defaultBg'

// Описываем все возможные поля, которые мы можем написать в начале MDX файла
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

// Интерфейс для расширения типа TNote локальными тегами (чтобы TS не ругался)
interface IEnhancedNote extends NCodeSamplesSpace.TNote {
  tags?: string[];
}

// Интерфейс для расширения статьи, если фронтенд умеет читать теги на верхнем уровне
interface IEnhancedArticle extends Omit<TArticle, 'original'> {
  original: IEnhancedNote;
  tags?: string[];
  author?: string;
}

/**
 * Вспомогательная функция для безопасного чтения локального MDX файла на сервере.
 * Вынесена в утилиты для переиспользования в getInitialProps страниц Next.js.
 */
export const readLocalMdx = async (slug: string): Promise<IEnhancedArticle | null> => {
  // Железобетонная защита от случайного вызова на стороне клиента (в браузере)
  if (typeof window !== 'undefined') return null

  try {
    const fs = require('fs')
    const matter = require('gray-matter')

    // Формируем абсолютный путь к папке _articles в корне проекта
    const articlesDirectory = path.join(process.cwd(), 'public/static/_articles')
    const filePath = path.join(articlesDirectory, `${slug}.mdx`)

    // Если файла физически нет — возвращаем null для переключения на сетевое API
    if (!fs.existsSync(filePath)) return null

    const fileContents = fs.readFileSync(filePath, 'utf8')
    
    // Парсим YAML front-matter шапку файла
    const { data, content } = matter(fileContents)
    const frontMatter = data as IMdxFrontMatter 

    // Если статья помечена как черновик, игнорируем её для обычных пользователей
    if (frontMatter.isDraft) {
      console.log(`[MDX Fallback] Статья ${slug} пропущена, так как это черновик (isDraft: true)`)
      return null
    }

    console.log(`[MDX Fallback] Успешно прочитана локальная статья: ${slug}.mdx`)

    return {
      original: {
        _id: slug,
        title: frontMatter.title || 'Без названия (Локальный файл)',
        description: content, // Текст статьи пишется в описание
        isPrivate: frontMatter.isPrivate || false,
        createdAt: frontMatter.createdAt || new Date().toISOString(),
        updatedAt: frontMatter.updatedAt || new Date().toISOString(),
        priority: frontMatter.priority || 0,
        tags: frontMatter.tags || [], // Теперь это свойство безопасно благодаря IEnhancedNote
      },
      slug: slug,
      brief: frontMatter.brief || 'Локальная копия статьи',
      bg: frontMatter.bg_src ? {
        src: frontMatter.bg_src,
        size: frontMatter.bg_size || { w: 896, h: 1344 },
        type: frontMatter.bg_type || 'image/webp'
      } : defaultBg,
      tags: frontMatter.tags || [],
      author: frontMatter.author || 'system',
    }
  } catch (error) {
    console.error(`[MDX Fallback] Ошибка чтения файла ${slug}:`, error)
    return null
  }
}
