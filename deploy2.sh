source ./read-env.sh

# Читаем настройку включения приватных страниц для текущего стенда (например, из .env.stage или .env.production)
PRIVATE_INCLUDED=$(read_env BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED .env."$1")
echo "🔧 [Deploy Config] BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED = ${PRIVATE_INCLUDED:-0}"
# Пробрасываем переменную инлайном прямо в скрипт генерации
BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED="$PRIVATE_INCLUDED" ./refresh-slug-mapping.sh
#./refresh-slug-mapping.sh

# 2. Читаем переменную домена карты сайта из файла конфигурации стенда (например, .env.stage или .env.production)
SITEMAP_HOST=$(read_env BASH_SITEMAP .env."$1")

if [ -z "$SITEMAP_HOST" ]; then
  echo "⚠️  WARNING: BASH_SITEMAP is not defined for environment '$1'. Fallback to default check..."
  # Если переменной нет, можно подставить фолбек или остановить билд
fi

# 3. Запускаем генерацию sitemap.xml, принудительно передавая SITEMAP_HOST в Node.js через переменные окружения командной строки
if [ ! -z "$SITEMAP_HOST" ]; then
  NEXT_APP_SITEMAP_BASE_URL="$SITEMAP_HOST" node ./scripts/generate-sitemap.js
fi

# -- 3.5. #SEO АВТОГЕНЕРАЦИЯ ROBOTS.TXT ПОД КОНКРЕТНЫЙ СТЕНД
ROBOTS_PATH="./public/robots.txt"

if [ "$1" == "stage" ] || [ "$1" == "ru" ]; then
  # Если деплоим на стейдж (.ru) — по-прежнему наглухо закрываем весь сайт от индексации
  echo -e "User-agent: *\nDisallow: /\n\nSitemap: ${SITEMAP_HOST}/sitemap.xml" > $ROBOTS_PATH
  echo "[Robots] Сгенерирован защищенный robots.txt для STAGE стенда"
else
  # Если деплоим на прод (.pro) — открываем всё, КРОМЕ указанных вами секретных / технических папок
  echo -e "User-agent: *
Allow: /
Disallow: /express-next-api/
Disallow: /subprojects/auditlist/
Disallow: /vaccine/
Disallow: /team-scoring/
Disallow: /auth/login
Disallow: /autopark-2022/

Sitemap: ${SITEMAP_HOST}/sitemap.xml" > $ROBOTS_PATH
  echo "[Robots] Сгенерирован открытый robots.txt с исключениями для PRODUCTION стенда"
fi

DEPLOY_HOST=$(read_env BASH_DEPLOY_HOST .env."$1")

# -- Проверяем, удалось ли прочитать переменную, чтобы не деплоить в "никуда"
if [ -z "$DEPLOY_HOST" ]; then
  echo "❌ ERROR: DEPLOY_HOST is not defined for environment '$1'"
  exit 1
fi

# -- Базовый путь на удаленном сервере
REMOTE_ROOT=$(read_env BASH_REMOTE_ROOT .env."$1")

# -- Копирование директорий
# - Формируем динамические пути на основе прочитанного
deploy_path_build_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/.next"
deploy_path_public_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/public"
#deploy_path_server_dist_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/server.dist"
#deploy_path_node_modules_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/node_modules"
#deploy_path_config_file="${DEPLOY_HOST}:${REMOTE_ROOT}/next.config.js"
#deploy_path_package_json_file="${DEPLOY_HOST}:${REMOTE_ROOT}/package.json"
echo '-- 🚄 DEPLOY STARTED' &&
# -/
rsync -av --delete .next/ $deploy_path_build_dir &&
# - Копирование директорий с чистым разделением папок
# Мы просто говорим rsync: «Скопируй всю папку public, но наглухо проигнорируй конкретные директории с исходниками»
rsync -av --delete \
  --exclude="static/css/src/" \
  --exclude="static/common/src/" \
  public/ $deploy_path_public_dir &&
echo '-- 🚀 SOURCE DIRECTORIES EXCLUDED SUCCESSFULLY' &&
# -/
# - Others
#rsync -av --delete server.dist/ $deploy_path_server_dist_dir &&
#rsync -av --delete node_modules/ $deploy_path_node_modules_dir &&
# -/
# - Явное копирвание конфигов и прочего вспомогательного
#rsync -av .env."$1" "${DEPLOY_HOST}:${REMOTE_ROOT}/.env.$1" &&
rsync -av .env.production "${DEPLOY_HOST}:${REMOTE_ROOT}/.env.production" &&
#rsync -av next.config.js $deploy_path_config_file &&
#rsync -av package.json $deploy_path_package_json_file &&
# -/
# --

echo '-- 🏁 DEPLOY COMPLETED'
