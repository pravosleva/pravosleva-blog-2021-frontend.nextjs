#!/bin/sh

dist_dir='./server.dist2'

for path in \
    'server.src' \
    'socket-logic'
do
    arg='--outDir'

    if [ -d "./${path}" ]; then
        arg='-d'
    fi

    ./node_modules/.bin/tsc "./${path}" "${arg}" "${dist_dir}/${path}" || exit 1
done
