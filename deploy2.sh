source ./read-env.sh

DEPLOY_HOST=$(read_env BASH_DEPLOY_HOST .env."$1")

# Проверяем, удалось ли прочитать переменную, чтобы не деплоить в "никуда"
if [ -z "$DEPLOY_HOST" ]; then
  echo "❌ ERROR: DEPLOY_HOST is not defined for environment '$1'"
  exit 1
fi

# Базовый путь на удаленном сервере
REMOTE_ROOT=$(read_env BASH_REMOTE_ROOT .env."$1")

# Формируем динамические пути на основе прочитанного
deploy_path_build_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/.next"
deploy_path_public_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/public"
deploy_path_config_file="${DEPLOY_HOST}:${REMOTE_ROOT}/next.config.js"
deploy_path_package_json_file="${DEPLOY_HOST}:${REMOTE_ROOT}/package.json"
#deploy_path_server_dist_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/server.dist"
#deploy_path_node_modules_dir="${DEPLOY_HOST}:${REMOTE_ROOT}/node_modules"

echo '-- 🚄 DEPLOY STARTED' &&

rsync -av --delete .next/ $deploy_path_build_dir &&
rsync -av --delete public/ $deploy_path_public_dir &&

# Явное копирвание конфигов и прочего вспомогательного
rsync -av next.config.js $deploy_path_config_file &&
rsync -av package.json $deploy_path_package_json_file &&
rsync -av .env."$1" "${DEPLOY_HOST}:${REMOTE_ROOT}/.env.$1" &&
rsync -av .env."$1" "${DEPLOY_HOST}:${REMOTE_ROOT}/.env.production" &&

echo '-- 🏁 DEPLOY COMPLETED'
