#!/bin/bash
set -e

# ============================================================
# WENTIX AI COMMUNITY - FAST DEPLOY SCRIPT
# ============================================================
# Run this ON THE VPS (or via SSH) every time you push updates
# ============================================================

APP_DIR="/var/www/wentix-ai"

echo "🚀 Deploying Wentix AI Community..."

cd $APP_DIR

echo "📥 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "🔄 Reloading PM2..."
pm2 reload ecosystem.config.js

echo "✅ Deployed!"
echo "🔗 https://wentixai.sbs"
echo "📝 Logs: pm2 logs wentix-ai-community"
