#!/bin/bash

# Останавливаем скрипт при любой ошибке внутри процессов
set -e

echo "🚄 [Bash] Запуск скрипта обновления локальной карты статей..."

# Проверяем, установлена ли нода
if ! [ -x "$(command -v node)" ]; then
  echo '❌ Error: Node.js не установлен в системе.' >&2
  exit 1
fi

# ПРОБРОС ФЛАГА: Берем значение переменной из терминала. 
# Если переменная не была передана, подставляем фолбек "0" (безопасный режим).
CURRENT_PRIVATE_FLAG="${BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED:-0}"

echo "🔧 [Bash Config] BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED проброшен в Node.js как: $CURRENT_PRIVATE_FLAG"

# Запускаем наш JS-генератор, явно передавая флаг на уровень process.env для Node.js
BASH_NOTES_IS_PRIVATE_PAGES_INCLUDED="$CURRENT_PRIVATE_FLAG" node scripts/generate-slug-map.js

echo "🏁 [Bash] Скрипт refresh-slug-mapping успешно завершил работу!"
