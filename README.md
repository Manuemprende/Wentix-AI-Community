# Wentix AI Community

AI-powered community platform for learning, building, and connecting.

---

## 🚀 VPS Deploy Guide

### Prerequisites (on your VPS)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Install nginx (reverse proxy + SSL)
sudo apt install -y nginx

# 5. Install certbot (free SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Clone & Setup on VPS

```bash
# Clone repo
git clone https://github.com/Manuemprende/Wentix-AI-Community.git /var/www/wentix-ai
cd /var/www/wentix-ai

# Install deps and build
npm install
npm run build

# Create .env
cp .env.example .env
nano .env   # Set GEMINI_API_KEY and APP_URL

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### SSL with Certbot

```bash
sudo certbot --nginx -d wentix.ai -d www.wentix.ai
```

### Deploy Script (from local)

Edit `deploy.sh` with your VPS IP, then run:

```bash
./deploy.sh production
```

---

## 🐳 Docker Deploy (Alternative)

```bash
docker-compose up -d --build
```

---

## 📦 Run Locally

**Prerequisites:** Node.js 22+

```bash
npm install
npm run dev
```

---

## 🔧 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `APP_URL` | Public URL of the app | Yes |
| `PORT` | Server port (default: 3000) | No |

---

## 🏗️ Architecture

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Express + Google GenAI (Gemini)
- **SSR:** Vite SSR via custom Express server
- **Database:** JSON file (`leads_database.json`)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx

