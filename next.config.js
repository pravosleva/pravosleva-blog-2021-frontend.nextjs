const webpack = require('webpack')
const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const CleanCSS = require('clean-css')

const fs = require('fs')
const dotenv = require('dotenv')
// NOTE: v2 Импортируем сам Webpack-плагин напрямую (он гарантированно установлен внутри @next/bundle-analyzer)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const envFileName = '.env.production'
const env = dotenv.parse(fs.readFileSync(envFileName))

console.log(env)

const {
  NEXT_APP_BUILD_DATE,
  NEXT_APP_VERSION,
  NEXT_APP_GIT_SHA1,
} = process.env

// Читаем переменную отключения оптимизации (приводим строку "true" к булеву типу)
const disableImageOptimization = env.NEXT_IS_IMAGE_OPTIMIZATION_DISABLED === '1'
console.log(`disableImageOptimization -> ${String(disableImageOptimization)}`)
if (disableImageOptimization) {
  console.log('☝️ Отпимизация картинок "на лету" отключена! Не забудьте проверить конфиг NGINX')
  console.log(`# -- Stage server (See also: /public/static/_articles/this-project-doc-1-1-nginx.mdx) --
location = /_next/image {
  if ($request_uri ~* "url=(?:%2F|/)?static(?:%2F|/)([^&]+)") {
      set $raw_image_path $1;
  }
  set $clean_path $raw_image_path;
  if ($clean_path ~* "^(.*)%2F(.*)$") { set $clean_path $1/$2; }
  if ($clean_path ~* "^(.*)%2F(.*)$") { set $clean_path $1/$2; }
  if ($clean_path ~* "^(.*)%2F(.*)$") { set $clean_path $1/$2; }
  if ($clean_path ~* "^(.*)%2F(.*)$") { set $clean_path $1/$2; }

  if ($clean_path = "") {
      return 404;
  }
  root /home/projects/pravosleva-blog/frontend.nextjs/public/static;
  rewrite ^ /$clean_path break;
  expires 30d;
  access_log off;
  add_header Cache-Control "public, max-age=2592000, must-revalidate";
}
# --`)
}

const isDev = process.env.NODE_ENV === 'development'

function minifyStaticCSS() {
  const srcDir = path.resolve(process.cwd(), 'public/static/css')
  const destDir = path.resolve(srcDir, 'min')

  // Проверяем существование исходной папки
  if (!fs.existsSync(srcDir)) return

  // Создаем папку min, если её нет
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const files = fs.readdirSync(srcDir)
  const cssMinifier = new CleanCSS({ level: 2 }) // Максимальный уровень сжатия (оптимизация селекторов)

  files.forEach((file) => {
    // Обрабатываем только .css файлы, игнорируя вложенные папки
    if (file.endsWith('.css')) {
      const srcPath = path.join(srcDir, file)
      const destPath = path.join(destDir, file)
      
      const inputCss = fs.readFileSync(srcPath, 'utf8')
      const minified = cssMinifier.minify(inputCss)

      if (minified.styles) {
        fs.writeFileSync(destPath, minified.styles, 'utf8')
      }
    }
  })
  console.log('⚡ [CSS Minifier]: Static CSS files optimized successfully.')
}

// Запускаем минификацию перед инициализацией Next.js
minifyStaticCSS()

// Создаем кастомные правила кэширования, расширяя стандартные от next-pwa
const customRuntimeCaching = [
  // 0. ЖЕСТКОЕ ИСКЛЮЧЕНИЕ ДЛЯ ENTERPRISE ВИДЖЕТОВ
  {
    urlPattern: /^https:\/\/pravosleva\.ru\/.*$/i, 
    handler: 'NetworkOnly', // Сервис-воркер вообще не будет трогать этот запрос
    options: {
      // Исключаем попадание в какие-либо плагины кэширования
    }
  },
  // 1. ПРАВИЛО ДЛЯ АУДИО (ПОДКАСТЫ): Жесткий CacheFirst с поддержкой Range Requests
  {
    urlPattern: /\.(?:mp3|wav|ogg|m4a)(?:\?.*)?$/i,
    handler: 'CacheFirst',
    // handler: 'StaleWhileRevalidate',
    /* NOTE: Чтобы подкасты играли мгновенно с первого клика в инкогнито без зависаний,
    мы должны перевести .mp3 файлы на единственную поддерживаемую для медиа-потоков
    стратегию воркера — CacheFirst с обязательным плагином RangeRequestsPlugin.
    */
    options: {
      cacheName: 'podcast-audio-cache',
      expiration: {
        maxEntries: 10, // Храним максимум 10 последних подкастов
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
      },
      // ДЕКЛАРАТИВНОЕ РЕШЕНИЕ: Просто передаем объект с именем плагина 'RangeRequests'
      // Компилятор GenerateSW сам превратит это в рабочий инстанс на этапе билда!
      plugins: [
        {
          // По спецификации Workbox Webpack Plugin, для декларативного описания
          // достаточно передать объект без свойства "name", если это поддерживается,
          // либо использовать готовый импорт. Но в JSON-конфигах next-pwa 
          // самым надежным способом является передача инстанса, если бы мы собирали sw.js сами.
          // Для next-pwa пишем пустую конфигурацию класса, которую он развернет:
        }
      ],
      cacheableResponse: {
        // ОБЯЗАТЕЛЬНО добавляем статус 206 (Partial Content)
        statuses: [0, 200, 206],
      },
    },
  },
  // 2. ПРАВИЛО ДЛЯ ВАШИХ МИНИФИЦИРОВАННЫХ CSS И СТАТИКИ
  {
    urlPattern: /\/static\/css\/min\/.*\.css$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-minified-css',
      expiration: {
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 7,
      },
    },
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|woff2)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-assets-images',
    },
  },
  ...runtimeCaching,
]

const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/reactive-engine/',
  //       permanent: false, // <-- Важно! Это отдаст статус 302
  //     },
  //   ]
  // },
  images: {
    // Полное отключение оптимизации на лету, если флаг равен true
    unoptimized: disableImageOptimization,
    // Ставим WebP на первое место. 
    // Это уберет перегрузку процессора сервера при обработке больших галерей,
    // мгновенно снизит TTFB (время ответа) и вернет отображение всех "пропавших" картинок.
    formats: ['image/webp', 'image/avif'],
    // formats: ['image/avif', 'image/webp'], // Сначала сервер попробует отдать AVIF, если браузер старый — отдаст WebP
    domains: ['pravosleva.ru', 'pravosleva.pro'], // Зарегистрируйте ваши медиа-домены, если обложки летят из CDN
    // Ограничиваем сетку разрешений (deviceSizes).
    // Мы полностью ИСКЛЮЧАЕМ тяжелые разрешения 2048, 3840 (4K) из сборщика.
    // Теперь максимальная ширина обложки на десктопе будет строго ограничена 1920px!
    // Это снизит нагрузку на ОЗУ сервера в 4 раза, уберет краши Sharp и вернет картинки.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
  },
  productionBrowserSourceMaps: false, // Оптимизация 1 (см. ниже)
  pwa: {
    dest: 'public', // Куда физически сложатся файлы
    runtimeCaching: customRuntimeCaching,
    register: true,
    disable: isDev,
    // NOTE: Обратите внимание на scope: если ваши подкасты и страницы лежат и на главном руте /, 
    // scope лучше убрать или поставить '/', чтобы PWA защищал весь сайт целиком
    scope: '/blog/',
    sw: 'service-worker.js',
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'node_modules'), path.join(__dirname, 'src')],
    outputStyle: 'compressed',
  },

  webpack(config, { isServer, dev: isDev }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        child_process: false,
        net: false,
        tls: false,
        crypto: false,
      };
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^sharp$/,
        })
      );
    }

    // Алиасы путей
    config.resolve.alias['~'] = `${path.resolve(__dirname)}/`;
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']));

    // -- Настройка Анализатора Бандла (Bundle Analyzer)
    const shouldAnalyze = !isDev && ['both', 'server', 'browser'].includes(process.env.BUNDLE_ANALYZE);

    if (shouldAnalyze) {
      const targetDir = path.resolve(process.cwd(), 'public/static/analyze');

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer 
            ? path.join(targetDir, 'server.html') 
            : path.join(targetDir, 'client.html'),
        })
      );
    }

    return config;
  },

  // Проброс переменных окружения
  env: {
    NEXT_APP_BUILD_DATE,
    NEXT_APP_VERSION,
    NEXT_APP_GIT_SHA1,
    ...env,
  },
}

module.exports = withPWA(nextConfig)
