#!/bin/bash

echo "===> CLEANUP STARTED"

EXTERNAL_DIR=""$(dirname "$PWD")""

# Step 1: Create target dir if necessary
if [ ! -d "./.next" ];
then
  echo "===> 👌 CLEANUP IS UNNECESSARY"
  exit 0
else
  rm -rf './.next'
  if [ ! $? -eq 0 ]; then
    echo "🚫 ERROR: Не удалось удалить ./.next"
    exit 1
  fi
fi

echo -ne '##                        (10%)\r'

echo -ne '######                    (30%)\r'

echo -ne '########################  (100%)\r'

echo "===> 👌 CLEANUP COMPLETED "

exit 
