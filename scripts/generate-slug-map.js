const fs = require('fs');
const path = require('path');
// Используем gray-matter, который уже есть в зависимостях вашего проекта
const matter = require('gray-matter');

// Читаем флаг принудительного включения приватных страниц из .env
const isPrivatePagesIncluded = process.env.BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED === '1';

const ARTICLES_DIR = path.join(process.cwd(), 'public', 'static', '_articles');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'static', 'local.slug-map.json');

function generateSlugMap() {
  console.log('🔄 Начат процесс генерации local.slug-map.json...');

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.error(`❌ Ошибка: Директория не найдена: ${ARTICLES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(ARTICLES_DIR);
  const slugMap = {};

  files.forEach((fileName) => {
    if (!fileName.endsWith('.mdx')) return;

    const slug = fileName.replace(/\.mdx$/, '');
    const filePath = path.join(ARTICLES_DIR, fileName);

    try {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);

      // Пропускаем черновики, если они не должны попадать в общую карту
      if (data.isDraft) {
        console.log(`⚠️  Статья ${slug} пропущена (isDraft: true)`);
        return;
      }

      // 2. УМНЫЙ ФИЛЬТР ПРИВАТНОСТИ:
      // Если у статьи стоит isPrivate: true, НО в .env НЕ разрешено их включать — пропускаем её
      if (data.isPrivate && !isPrivatePagesIncluded) {
        console.log(`[SlugMap Builder] Статья ${fileName} пропущена (конфиг запрещает isPrivate в этом билде)`);
        return;
      }

      // Структурируем объект bg, безопасно собирая его из плоских свойств mdx шапки
      const bg = data.bg_src ? {
        src: data.bg_src,
        size: data.bg_size || { w: 896, h: 1344 },
        type: data.bg_type || 'image/webp'
      } : null;

      // Собираем итоговый объект для данного слага.
      // Используем деструктуризацию, чтобы все остальные кастомные атрибуты (category, author и т.д.)
      // автоматически впекались в JSON, даже если вы добавите новые поля в будущем.
      const { bg_src, bg_size, bg_type, ...restFrontMatter } = data;

      slugMap[slug] = {
        title: data.title || 'Без названия',
        brief: data.brief || '',
        bg: bg,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        priority: typeof data.priority === 'number' ? data.priority : 0,
        tags: Array.isArray(data.tags) ? data.tags : [],
        // isPrivate: data.isPrivate ?? false,
        isPrivate: !!data.isPrivate, // сохраняем флаг булевым значением
        ...restFrontMatter // Динамический проброс любых других кастомных атрибутов
      };

    } catch (fileError) {
      console.error(`❌ Ошибка обработки файла ${fileName}:`, fileError);
    }
  });

  // Записываем финальный результат с красивыми отступами в 2 пробела для читаемости
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(slugMap, null, 2), 'utf8');
  console.log(`✨ Успешно создан файл: ${OUTPUT_FILE}`);
  console.log(`📊 Всего проиндексировано статей: ${Object.keys(slugMap).length}`);
}

generateSlugMap();
