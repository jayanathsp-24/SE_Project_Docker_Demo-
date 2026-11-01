#!/bin/sh
set -e
cd /app

if [ ! -f package.json ]; then
  echo "No package.json in /app (the frontend/ folder). Create the Next.js app first (see README)." >&2
  exit 1
fi

HASH=""
[ -f package-lock.json ] && HASH=$(md5sum package-lock.json | cut -d' ' -f1)
STORED=$(cat node_modules/.lock-hash 2>/dev/null || true)

if [ ! -d node_modules ] || [ "$HASH" != "$STORED" ]; then
  echo "Installing dependencies..."
  if [ -f package-lock.json ]; then npm ci; else npm install; fi
  [ -n "$HASH" ] && echo "$HASH" > node_modules/.lock-hash
fi

exec npm run dev -- --hostname 0.0.0.0 --port 3000
