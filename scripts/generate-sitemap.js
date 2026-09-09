const fs = require('fs');
const path = require('path');

// Читаем базовый URL из переменной окружения, которую пробросит bash-скрипт
const BASE_URL = process.env.NEXT_APP_SITEMAP_BASE_URL;

async function generateSitemap() {
  console.log('--- 🗺️  STARTING SITEMAP GENERATION');

  // Защита: если переменная не долетела, останавливаем процесс, чтобы не нагенерировать битых ссылок
  if (!BASE_URL) {
    console.error('❌ ERROR: process.env.NEXT_APP_SITEMAP_BASE_URL is not defined! Sitemap generation aborted.');
    process.exit(1);
  }

  // Отрезаем слеш на конце, если пользователь случайно указал домен как "https://domain.ru"
  const cleanBaseUrl = BASE_URL.replace(/\/$/, '');
  console.log(`[Sitemap] Целевой хост для генерации ссылок: ${cleanBaseUrl}`);

  // 1. Статические страницы сайта
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/feedback', changefreq: 'monthly', priority: '0.5' },
  ];

  let xmlRows = [];

  staticPages.forEach(page => {
    xmlRows.push(`  <url>
    <loc>${cleanBaseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  });

  // 2. Читаем сгенерированную ранее JSON карту локальных статей
  const slugMapPath = path.join(process.cwd(), 'public', 'static', 'local.slug-map.json');
  
  if (fs.existsSync(slugMapPath)) {
    try {
      const rawData = fs.readFileSync(slugMapPath, 'utf8');
      const slugMapping = JSON.parse(rawData);

      Object.entries(slugMapping).forEach(([slugKey, meta]) => {
        if (meta.isPrivate || meta.isDraft) return;

        // Форматируем дату обновления
        const lastModDate = meta.updatedAt 
          ? meta.updatedAt.split('T')[0] 
          : new Date().toISOString().split('T')[0];

        xmlRows.push(`  <url>
    <loc>${cleanBaseUrl}/p/${slugKey}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
      console.log(`[Sitemap] Успешно добавлено локальных статей из JSON: ${Object.keys(slugMapping).length}`);
    } catch (parseError) {
      console.error('[Sitemap] Ошибка парсинга local.slug-map.json:', parseError);
    }
  } else {
    console.warn('[Sitemap] Файл local.slug-map.json не найден. Сборка только для статических страниц.');
  }

  // 3. Формируем итоговый xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
${xmlRows.join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf8');

  console.log(`--- 🏁 SITEMAP GENERATION COMPLETED: public/sitemap.xml`);
}

generateSitemap();
