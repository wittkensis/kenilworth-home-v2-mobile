#!/bin/sh
set -e

# Seed DB if not already initialized
if [ ! -f /data/home.db ]; then
  echo "Initializing database from seed..."
  sqlite3 /data/home.db < /app/data-seed/seed.sql
  echo "Database initialized."
fi

exec node server.js
