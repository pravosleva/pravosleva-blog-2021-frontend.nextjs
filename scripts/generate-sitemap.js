const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.NEXT_APP_SITEMAP_BASE_URL;

async function generateSitemap() {
  console.log('--- 🗺️  STARTING SITEMAP GENERATION');

  if (!BASE_URL) {
    console.error('❌ ERROR: process.env.NEXT_APP_SITEMAP_BASE_URL is not defined! Sitemap generation aborted.');
    process.exit(1);
  }

  const cleanBaseUrl = BASE_URL.replace(/\/$/, '');
  console.log(`[Sitemap] Целевой хост для генерации ссылок: ${cleanBaseUrl}`);

  // -- #SEO

  // Массив регулярных выражений для страниц, которые КАТЕГОРИЧЕСКИ нельзя индексировать
  const disallowedPatterns = [
    /^\/subprojects\/auditlist/, // Исключает /subprojects/auditlist и все подстраницы /*
    /^\/vaccine/,               // Исключает /vaccine и все подстраницы /*
    /^\/team-scoring/,          // Исключает /team-scoring и все подстраницы /*
    /^\/auth\/login$/,          // Исключает строго страницу авторизации
    /^\/autopark-2022/          // Исключает /autopark-2022 и все подстраницы /*
  ];

  // Вспомогательная функция проверки: разрешен ли URL для sitemap.xml
  const isUrlAllowed = (urlPath) => {
    return !disallowedPatterns.some(pattern => pattern.test(urlPath));
  };

  // 1. Статические страницы сайта
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/feedback', changefreq: 'monthly', priority: '0.5' },
    { url: '/auth/login', changefreq: 'never', priority: '0.0' }, // Эту страницу мы отфильтруем
  ];

  // --

  let xmlRows = [];

  // Добавляем только разрешенные статические страницы
  staticPages.forEach(page => {
    if (isUrlAllowed(page.url)) {
      xmlRows.push(`  <url>
    <loc>${cleanBaseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
    } else {
      console.log(`[Sitemap Filter] Исключена статическая страница: ${page.url}`);
    }
  });

  // 2. Читаем сгенерированную JSON-карту локальных статей
  const slugMapPath = path.join(process.cwd(), 'public', 'static', 'local.slug-map.json');
  
  if (fs.existsSync(slugMapPath)) {
    try {
      const rawData = fs.readFileSync(slugMapPath, 'utf8');
      const slugMapping = JSON.parse(rawData);

      Object.entries(slugMapping).forEach(([slugKey, meta]) => {
        if (meta.isPrivate || meta.isDraft) return;

        const articlePath = `/p/${slugKey}`;

        // На случай, если слаг статьи совпадает с каким-то из запрещенных путей
        if (!isUrlAllowed(articlePath)) {
          console.log(`[Sitemap Filter] Исключена статья из-за совпадения пути: ${articlePath}`);
          return;
        }

        const lastModDate = meta.updatedAt 
          ? meta.updatedAt.split('T')[0] 
          : new Date().toISOString().split('T')[0];

        xmlRows.push(`  <url>
    <loc>${cleanBaseUrl}${articlePath}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
      });
      console.log(`[Sitemap] Итого динамических статей добавлено: ${xmlRows.length - 2}`); // Минус базовые статические
    } catch (parseError) {
      console.error('[Sitemap] Ошибка парсинга local.slug-map.json:', parseError);
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
${xmlRows.join('\n')}
</urlset>`;

  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(outputPath, sitemapXml, 'utf8');

  console.log(`--- 🏁 SITEMAP GENERATION COMPLETED: public/sitemap.xml`);
}

generateSitemap();
