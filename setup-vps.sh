#!/bin/bash
set -e

# ============================================================
# WENTIX AI COMMUNITY - VPS SETUP SCRIPT (One-time install)
# ============================================================
# Run this ONCE on your fresh VPS as root
# ssh root@161.97.160.76
# curl -fsSL https://raw.githubusercontent.com/Manuemprende/Wentix-AI-Community/main/setup-vps.sh | bash
# Or: wget the script and run it
# ============================================================

echo "🚀 Setting up Wentix AI Community on VPS..."

# 1. System update
echo "📦 Updating system..."
apt update && apt upgrade -y
apt install -y curl wget git nginx certbot python3-certbot-nginx ufw

# 2. Install Node.js 22
echo "📦 Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# 3. Install PM2
echo "📦 Installing PM2..."
npm install -g pm2

# 4. Install Ollama
echo "🤖 Installing Ollama..."
curl -fsSL https://ollama.com/install.sh | sh

# 5. Pull llama3.2 model
echo "🤖 Pulling llama3.2 model..."
ollama pull llama3.2

# 6. Clone repo
echo "📁 Cloning repository..."
APP_DIR="/var/www/wentix-ai"
mkdir -p $APP_DIR
git clone https://github.com/Manuemprende/Wentix-AI-Community.git $APP_DIR

# 7. Install dependencies and build
echo "📦 Building application..."
cd $APP_DIR
npm install
npm run build

# 8. Create .env
echo "🔧 Creating .env file..."
cat > $APP_DIR/.env <<EOF
NODE_ENV=production
PORT=3000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
APP_URL=https://wentixai.sbs
EOF

# 9. Create logs directory
mkdir -p $APP_DIR/logs

# 10. Start with PM2
echo "🚀 Starting with PM2..."
pm2 start $APP_DIR/ecosystem.config.js
pm2 save
pm2 startup systemd

# 11. Configure nginx
echo "🌐 Configuring nginx..."
cp $APP_DIR/nginx.conf /etc/nginx/sites-available/wentix-ai
ln -sf /etc/nginx/sites-available/wentix-ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 12. Firewall
echo "🔥 Configuring firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw --force enable

# 13. SSL with Certbot
echo "🔒 Installing SSL certificate..."
certbot --nginx -d wentixai.sbs -d www.wentixai.sbs --non-interactive --agree-tos --email manu.emprendehoy@gmail.com

# 14. Auto-renewal cron
echo "🔒 Setting up SSL auto-renewal..."
echo "0 3 * * * certbot renew --quiet" | crontab -

echo ""
echo "✅ SETUP COMPLETE!"
echo ""
echo "🔗 App: https://wentixai.sbs"
echo "📊 PM2: pm2 status"
echo "📝 Logs: pm2 logs wentix-ai-community"
echo "🤖 Ollama: ollama list"
echo ""
echo "🔄 To update the app later, run: ./deploy.sh"
