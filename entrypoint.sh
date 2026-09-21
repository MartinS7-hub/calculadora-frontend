#!/bin/sh
set -e

: "${API_URL:?API_URL no definida}"

echo "window.API_URL = '${API_URL}';" > /usr/share/nginx/html/config.js
echo "config.js generado con API_URL=${API_URL}" >&2

exec nginx -g 'daemon off;'