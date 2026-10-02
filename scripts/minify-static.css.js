const fs = require('fs')
const path = require('path')
const CleanCSS = require('clean-css')

function minifyStaticCSS() {
  const srcDir = path.resolve(process.cwd(), 'public/static/css/src')
  const destDir = path.resolve(process.cwd(), 'public/static/css/min')

  if (!fs.existsSync(srcDir)) {
    console.warn('⚠️ [CSS Minifier]: Папка css/src отсутствует. Пропускаем.')
    return
  }

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const files = fs.readdirSync(srcDir)
  const cssMinifier = new CleanCSS({ level: 2 })

  files.forEach((file) => {
    if (file.endsWith('.css')) {
      const srcPath = path.join(srcDir, file)
      const destPath = path.join(destDir, file)
      
      try {
        const inputCss = fs.readFileSync(srcPath, 'utf8')
        const minified = cssMinifier.minify(inputCss)

        if (minified.styles) {
          fs.writeFileSync(destPath, minified.styles, 'utf8')
        }
        if (minified.errors.length > 0 || minified.warnings.length > 0) {
          console.warn(`⚠️ [CSS Minifier] Проблемы в ${file}:`, minified.errors, minified.warnings)
        }
      } catch (fileError) {
        console.error(`❌ [CSS Minifier] Ошибка файла ${file}:`, fileError)
      }
    }
  })
  
  console.log('⚡ [CSS Minifier]: Static CSS files optimized in public/static/css/min/*')
}

// Экспортируем для использования в next.config.js
module.exports = minifyStaticCSS

// Если файл запущен напрямую через `node scripts/minify-static.css.js`
if (require.main === module) {
  minifyStaticCSS()
}
