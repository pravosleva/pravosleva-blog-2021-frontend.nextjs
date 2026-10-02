const fs = require('fs')
const path = require('path')

async function minifyStaticJS() {
  const srcRoot = path.resolve(process.cwd(), 'public/static/common/src')
  const destRoot = path.resolve(process.cwd(), 'public/static/common/min')

  if (!fs.existsSync(srcRoot)) return

  const terserOptions = {
    compress: { dead_code: true, drop_debugger: true, drop_console: false, passes: 2 },
    mangle: true,
    output: { comments: false }
  }

  async function processDirectory(currentSrcDir, currentDestDir) {
    if (!fs.existsSync(currentDestDir)) {
      fs.mkdirSync(currentDestDir, { recursive: true })
    }

    const items = fs.readdirSync(currentSrcDir)

    for (const item of items) {
      const srcPath = path.join(currentSrcDir, item)
      const destPath = path.join(currentDestDir, item)
      const stats = fs.statSync(srcPath)

      if (stats.isDirectory()) {
        await processDirectory(srcPath, destPath)
      } else if (stats.isFile() && item.endsWith('.js')) {
        try {
          const { minify } = require('terser')
          const inputJs = fs.readFileSync(srcPath, 'utf8')
          const minified = await minify(inputJs, terserOptions)

          if (minified.code) {
            fs.writeFileSync(destPath, minified.code, 'utf8')
          }
        } catch (terserError) {
          console.error(`❌ [JS Minifier] Ошибка в файле ${item}:`, terserError.message)
        }
      }
    }
  }

  try {
    await processDirectory(srcRoot, destRoot)
    console.log('⚡ [JS Minifier]: Static JS files optimized in common/min/*')
  } catch (globalError) {
    console.error('❌ [JS Minifier Global Error]:', globalError)
  }
}

// Экспортируем для использования в next.config.js
module.exports = minifyStaticJS

// Если файл запущен напрямую через `node scripts/minify-static.js.js`
if (require.main === module) {
  minifyStaticJS()
}
