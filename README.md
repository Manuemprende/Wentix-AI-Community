# Wentix AI Community

AI-powered community platform for learning, building, and connecting.

---

## 🏗️ Architecture

- **Frontend:** React 19 + Vite + Tailwind CSS
- **Backend:** Express + Vite SSR
- **AI:** Ollama (local LLM) — runs on the same VPS
- **Database:** JSON file (`leads_database.json`)
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx + SSL (Let's Encrypt)

---

## 🚀 VPS Deploy (One-time Setup)

SSH into your VPS and run:

```bash
curl -fsSL https://raw.githubusercontent.com/Manuemprende/Wentix-AI-Community/main/setup-vps.sh | bash
```

Or manually:

```bash
# 1. Update & install dependencies
sudo apt update && sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# 2. Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. PM2
sudo npm install -g pm2

# 4. Ollama (local LLM)
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2

# 5. Clone & build
git clone https://github.com/Manuemprende/Wentix-AI-Community.git /var/www/wentix-ai
cd /var/www/wentix-ai
npm install && npm run build

# 6. Create .env
cp .env.example .env
# Edit: OLLAMA_MODEL=llama3.2, APP_URL=https://wentixai.sbs

# 7. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 8. Nginx + SSL
sudo cp nginx.conf /etc/nginx/sites-available/wentix-ai
sudo ln -s /etc/nginx/sites-available/wentix-ai /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d wentixai.sbs
```

---

## 🔄 Fast Update (After Git Push)

Every time you push updates to GitHub, run this **on the VPS**:

```bash
cd /var/www/wentix-ai && ./deploy.sh
```

Or manually:

```bash
cd /var/www/wentix-ai
git pull origin main
npm install
npm run build
pm2 reload ecosystem.config.js
```

---

## 🐳 Docker Deploy (Alternative)

```bash
docker-compose up -d --build
```

---

## 📦 Run Locally

**Prerequisites:** Node.js 22+, Ollama running locally

```bash
# Start Ollama first
ollama serve

# In another terminal
npm install
npm run dev
```

---

## 🔧 Environment Variables

| Variable | Description | Default |
|---|---|---|
| `OLLAMA_BASE_URL` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Model name to use | `llama3.2` |
| `APP_URL` | Public URL of the app | `https://wentixai.sbs` |
| `PORT` | Server port | `3000` |

---

## 📝 Useful Commands

| Command | Description |
|---|---|
| `pm2 status` | Check app status |
| `pm2 logs wentix-ai-community` | View logs |
| `pm2 reload ecosystem.config.js` | Reload app |
| `ollama list` | List installed models |
| `ollama pull llama3.2` | Update model |
| `sudo nginx -t` | Test nginx config |
| `sudo certbot renew --dry-run` | Test SSL renewal |

