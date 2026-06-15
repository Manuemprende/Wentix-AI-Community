#!/bin/bash
set -e

# ============================================================
# WENTIX AI COMMUNITY - VPS DEPLOY SCRIPT
# ============================================================
# Usage: ./deploy.sh [production|staging]
# Requirements: Node.js 22+, PM2, nginx (optional)
# ============================================================

ENV=${1:-production}
APP_DIR="/var/www/wentix-ai"
LOG_DIR="$APP_DIR/logs"

echo "🚀 Deploying Wentix AI Community to $ENV..."

# 1. Build locally
echo "📦 Building application..."
npm ci
npm run clean
npm run build

# 2. Create remote directory if needed
echo "📁 Preparing remote server..."
ssh root@your-vps-ip "mkdir -p $APP_DIR/logs && mkdir -p $APP_DIR/dist"

# 3. Sync files (update with your VPS IP)
echo "📤 Uploading files..."
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='src' \
  --exclude='*.md' \
  --exclude='deploy.sh' \
  ./ root@your-vps-ip:$APP_DIR/

# 4. Install dependencies on server and restart
echo "🔧 Installing dependencies and restarting..."
ssh root@your-vps-ip "cd $APP_DIR && npm ci --production && pm2 reload ecosystem.config.js --env $ENV || pm2 start ecosystem.config.js --env $ENV"

# 5. Restart nginx if present
ssh root@your-vps-ip "systemctl reload nginx || true"

echo "✅ Deploy complete!"
echo "🔗 App running at: https://wentix.ai"
