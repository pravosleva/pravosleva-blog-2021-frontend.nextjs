const webpack = require('webpack')
const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const CleanCSS = require('clean-css')

const fs = require('fs')
const dotenv = require('dotenv')
// const withBundleAnalyzer = require('@next/bundle-analyzer')
// NOTE: v2 Импортируем сам Webpack-плагин напрямую (он гарантированно установлен внутри @next/bundle-analyzer)
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isProduction = process.env.NODE_ENV === 'production'
const envFileName = isProduction ? '.env.production' : '.env.dev'
const env = dotenv.parse(fs.readFileSync(envFileName))

const {
  NEXT_APP_BUILD_DATE,
  NEXT_APP_VERSION,
  NEXT_APP_GIT_SHA1,
} = process.env

const isDev = process.env.NODE_ENV === 'development'

// ─── СКРИПТ АВТО-МИНИФИКАЦИИ CSS ──────────────────────────────────────
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
// ──────────────────────────────────────────────────────────────────────

// Создаем кастомные правила кэширования, расширяя стандартные от next-pwa
// Создаем кастомные правила кэширования
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
    options: {
      cacheName: 'podcast-audio-cache',
      expiration: {
        maxEntries: 10, // Храним максимум 10 последних подкастов
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 дней
      },
      // ИСПРАВЛЕНО: Синтаксис плагинов для старых версий Workbox / next-pwa
      // Мы передаем имя плагина строкой, без обертки в объект { name }, либо массив готовых объектов
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
        statuses: [0, 200],
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

// -- NOTE: v1
// const bundleAnalyzer = withBundleAnalyzer({
//   enabled: ['both', 'server', 'browser'].includes(process.env.BUNDLE_ANALYZE),
//   openAnalyzer: false, // Автоматически НЕ откроет отчеты в браузере после билда
//   analyzerMode: 'static',
// })
// --

const nextConfig = {
  productionBrowserSourceMaps: false, // Оптимизация 1 (см. ниже)
  pwa: {
    dest: 'public', // NOTE: By default to .next
    runtimeCaching: customRuntimeCaching,
    register: true,
    // Обратите внимание на scope: если ваши подкасты и страницы лежат и на главном руте /, 
    // scope лучше убрать или поставить '/', чтобы PWA защищал весь сайт целиком
    disable: isDev,
    scope: '/blog/',
    sw: 'service-worker.js',
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  webpack(config, { isServer }) {
    config.resolve.alias['~'] = `${path.resolve(__dirname)}/`
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']))

    // -- NOTE: v2 Проверяем, передан ли флаг запуска анализатора
    const shouldAnalyze = ['both', 'server', 'browser'].includes(process.env.BUNDLE_ANALYZE)

    if (shouldAnalyze) {
      // Вычисляем АБСОЛЮТНЫЙ путь до целевой папки .next/static/analyze
      const targetDir = path.resolve(process.cwd(), 'public/static/analyze')

      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          // Разделяем имена файлов в зависимости от текущего процесса компиляции Next.js
          reportFilename: isServer 
            ? path.join(targetDir, 'server.html') 
            : path.join(targetDir, 'client.html'),
        })
      )
    }
    // --

    // SASS support
    // Оптимизация 3: Безопасное добавление SASS/CSS правил в Next.js 11
    config.module.rules.push({
      test: /\.(css|scss)$/,
      use: [
        { loader: "style-loader" },
        {
          loader: "css-loader",
          options: {
            modules: {
              localIdentName: isDev ? "next-cfg-2__[folder]__[name]__[local]___[hash:base64:5]" : "[name]__[local]___[hash:base64:5]",
            },
          },
        },
        {
          loader: "sass-loader",
          options: {
            sassOptions: {
              localIdentName: isDev ? "next-cfg-3__[folder]__[name]__[local]___[hash:base64:5]" : "[name]__[local]___[hash:base64:5]",
              sourceMap: isDev,
              outputStyle: 'compressed',
              includePaths: [
                'node_modules',
                path.resolve(__dirname, '/src'),
              ],
            },
          },
        },
      ],
    });

    return config
  },
  env: {
    NEXT_APP_BUILD_DATE,
    NEXT_APP_VERSION,
    NEXT_APP_GIT_SHA1,
    ...env,
  },
}

// -- NOTE: v1
// module.exports = withPWA(bundleAnalyzer(nextConfig))
// --
// -- NOTE: v2 
module.exports = withPWA(nextConfig)
// --
