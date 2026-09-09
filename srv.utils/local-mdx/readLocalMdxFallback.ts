import path from 'path'

// Стандартные серверные модули (здесь они абсолютно безопасны)
const fs = require('fs')
const matter = require('gray-matter')

// Дефолтное превью для бэкграунда, если в MDX нет кастомного
export const defaultBg = {
  src: '/static/img/blog/dog.webp',
  size: { w: 896, h: 1344 },
  type: 'image/webp'
}

// Локальный фолбек для чтения MDX файлов, перенесенный на уровень Express
export const readLocalMdxFallback = (slug: string) => {
  try {
    // На сервере Express путь вычисляется от корня запущенного процесса
    const articlesDirectory = path.join(process.cwd(), 'public', 'static', '_articles')
    const filePath = path.join(articlesDirectory, `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
      console.log(`[Express Fallback] Файл не найден на диске: ${filePath}`)
      return Promise.reject(null)
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    if (data.isDraft) {
      console.log(`[Express Fallback] Статья ${slug} пропущена (isDraft: true)`)
      return Promise.reject(null)
    }

    console.log(`[Express Fallback] Успешный возврат локального файла: ${slug}.mdx`)

    // Формируем структуру, которую ожидает увидеть клиентское приложение
    return Promise.resolve({
      _id: slug,
      title: data.title || 'Без названия (Локальный файл)',
      description: content,
      isPrivate: data.isPrivate || false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      priority: data.priority || 0,
      bg: {
        src: data?.bg_src || defaultBg.src,
        size: data?.bg_size || defaultBg.size,
        type: data?.bg_type || defaultBg.type,
      },
      brief: data.brief || 'Unset'
    })
  } catch (error) {
    console.error(`[Express Fallback] Ошибка парсинга файла ${slug}:`, error)
    return Promise.reject(null)
  }
}
