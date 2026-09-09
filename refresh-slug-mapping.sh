#!/bin/bash

# Останавливаем скрипт при любой ошибке внутри процессов
set -e

echo "🚄 [Bash] Запуск скрипта обновления локальной карты статей..."

# Проверяем, установлена ли нода
if ! [ -x "$(command -v node)" ]; then
  echo '❌ Error: Node.js не установлен в системе.' >&2
  exit 1
fi

# Запускаем наш JS-генератор
node scripts/generate-slug-map.js

echo "🏁 [Bash] Скрипт refresh-slug-mapping успешно завершил работу!"
