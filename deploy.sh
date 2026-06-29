#!/bin/bash
set -e

# ============================================================
# WENTIX AI COMMUNITY - VPS BUILD/RELOAD SCRIPT
# ============================================================
# Current production path: /var/www/wentix-ai
# Current public URL: https://community.wentixai.pro
#
# Note: the current VPS app directory may not be a Git repository.
# In that case, sync files first (tar/scp), then run this script.
# ============================================================

APP_DIR="/var/www/wentix-ai"

echo "Deploying Wentix AI Community..."
cd "$APP_DIR"

if [ -d ".git" ]; then
  echo "Pulling latest changes from Git..."
  git pull origin main
else
  echo "No .git directory found. Skipping git pull; using files already synced to $APP_DIR."
fi

echo "Installing dependencies..."
npm install

echo "Building..."
npm run build

echo "Reloading PM2..."
pm2 reload wentix-ai-community --update-env

echo "Deployed."
echo "URL: https://community.wentixai.pro"
echo "Logs: pm2 logs wentix-ai-community"
