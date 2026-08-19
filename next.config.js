const webpack = require('webpack')
const path = require('path')
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
const CleanCSS = require('clean-css')

const fs = require('fs')
const dotenv = require('dotenv')
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

const nextConfig = {
  productionBrowserSourceMaps: false, // Оптимизация 1 (см. ниже)
  pwa: {
    dest: 'public', // NOTE: By default to .next
    runtimeCaching,
    // disable: process.env.NODE_ENV === 'development',
    register: true,
    scope: '/blog/',
    sw: 'service-worker.js',
    disable: isDev, // Оптимизация 2 (см. ниже)
  },
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  webpack(config) {
    config.resolve.alias['~'] = `${path.resolve(__dirname)}/`
    config.plugins.push(new webpack.EnvironmentPlugin(['NODE_ENV']))

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
  // analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  // bundleAnalyzerConfig: {
  //   server: {
  //     analyzerMode: 'static',
  //     reportFilename: '../analyze/server.html', // Относительно .next/server/
  //   },
  //   browser: {
  //     analyzerMode: 'static',
  //     reportFilename: './analyze/client.html', // Относительно .next/
  //   },
  // },
}

// module.exports = withPWA(withBundleAnalyzer(nextConfig))
module.exports = withPWA(nextConfig)
