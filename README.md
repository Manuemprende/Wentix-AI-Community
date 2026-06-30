# Wentix AI Community

Plataforma Wentix AI para comunidad, academia, radar de IA, prompts y recursos modelados.

## Produccion

- URL publica activa: https://community.wentixai.pro
- VPS: `161.97.160.76`
- App directory: `/var/www/wentix-ai`
- Process manager: PM2
- PM2 app: `wentix-ai-community`
- Runtime port: `3002`
- Public proxy: Traefik Docker (`wentix-traefik`)
- Traefik route: `community.wentixai.pro -> 172.18.0.1:3002`

Nota: `wentixai.sbs` no es la URL activa de esta app. Ese dominio todavia tiene DNS/hosting externo mezclado. Usar `community.wentixai.pro` para validar produccion.

## Radar y Academia

El sistema tiene dos flujos:

- `RadarAgent`: extrae articulos, recursos y herramientas desde fuentes publicas, usa sitemap cuando existe, modela el contenido y lo guarda en `radar_articles.json`.
- `PromptRadar`: extrae prompts desde fuentes publicas, usa sitemap cuando existe, conserva el prompt en ingles y modela titulo/descripcion/categoria en espanol en `radar_prompts.json`.

Estado actual esperado:

- Articulos modelados: `390`
- Prompts modelados: `799`
- El inicio muestra solo 3 piezas importantes.
- `AI 0 a PRO` recibe la biblioteca completa de articulos modelados.
- La biblioteca de prompts carga hasta `1000` items desde backend.

## Variables Importantes

Configurar en `.env` local y en `/var/www/wentix-ai/.env` del VPS:

```bash
NODE_ENV=production
PORT=3002
AI_PROVIDER=groq
GROQ_API_KEY= # configurar solo en el VPS, no commitear
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.1-8b-instant
GROQ_MAX_TOKENS=1800
AI_MAX_MODELED_ARTICLES_PER_RUN=40
AI_MAX_MODELED_PROMPTS_PER_RUN=80
RADAR_CLEANUP_OLD_FIRST=true
RADAR_CLEANUP_OLD_LIMIT=2
AI_MODEL_DELAY_MS=65000

# Fallback opcional si se quiere volver a local
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
APP_URL=https://community.wentixai.pro

RADAR_AUTO_RUN=true
RADAR_INTERVAL_MINUTES=60
RADAR_CRAWL_ENABLED=true
RADAR_MAX_PAGES=800
RADAR_SOURCE_URLS=https://www.tododeia.com/,https://www.tododeia.com/tienda/claude-de-cero-a-cien,https://www.tododeia.com/tienda/codex-de-cero-a-cien,https://www.tododeia.com/collab
RADAR_TOOL_SOURCE_URLS=https://www.futurepedia.io/,https://theresanaiforthat.com/,https://aitoptools.com/,https://bestofai.io/

PROMPT_RADAR_AUTO_RUN=true
PROMPT_RADAR_INTERVAL_MINUTES=120
PROMPT_RADAR_LIMIT=800
```

## Desarrollo Local

```bash
npm install
npm run dev
```

URL local habitual:

```text
http://localhost:3002
```

Validaciones antes de desplegar:

```bash
npm run lint
npm run build
```

## Deploy Real al VPS

El directorio remoto `/var/www/wentix-ai` actualmente no es un repo Git. Por eso el deploy se hace enviando un tar del commit actual y reconstruyendo en el VPS.

Los archivos persistidos de produccion (`radar_articles.json`, `radar_prompts.json`, `leads_database.json`) no se incluyen en el tar porque viven en el VPS y crecen con los agentes.

Desde Windows/PowerShell, en la raiz del repo:

```powershell
git archive --format=tar --output wentix-deploy.tar HEAD
scp wentix-deploy.tar root@161.97.160.76:/tmp/wentix-deploy.tar
ssh root@161.97.160.76 'set -e; cd /var/www/wentix-ai; tar -xf /tmp/wentix-deploy.tar -C /var/www/wentix-ai; npm install; npm run build; pm2 reload wentix-ai-community --update-env; rm -f /tmp/wentix-deploy.tar; pm2 status --no-color'
Remove-Item wentix-deploy.tar -Force
```

Despues del deploy validar:

```bash
curl -sS https://community.wentixai.pro/api/gemini/radar/articles?limit=1000
curl -sS https://community.wentixai.pro/api/gemini/prompts?limit=1000
pm2 status
pm2 logs wentix-ai-community --lines 80
```

## Endpoints Utiles

```text
GET  /api/gemini/radar/articles?limit=1000
GET  /api/gemini/radar/status
POST /api/gemini/radar/run

GET  /api/gemini/prompts?limit=1000
GET  /api/gemini/prompts/status
POST /api/gemini/prompts/run
```

Ejecutar radar manual:

```bash
curl -X POST https://community.wentixai.pro/api/gemini/radar/run \
  -H "Content-Type: application/json" \
  -d '{"background":true,"crawl":true,"limit":800}'
```

Agregar nuevas fuentes de herramientas:

```bash
# Separar por comas o saltos de linea.
# El agente mezcla estas fuentes con RADAR_SOURCE_URLS y deduplica por URL.
RADAR_TOOL_SOURCE_URLS=https://directorio-uno.com/,https://directorio-dos.com/
```

Usar este campo para directorios, lanzamientos de productos, paginas de herramientas IA o repositorios publicos. El agente no copia la fuente: extrae, modela, clasifica por nivel y la convierte en contenido interno Wentix.

Ejecutar prompts manual:

```bash
curl -X POST https://community.wentixai.pro/api/gemini/prompts/run \
  -H "Content-Type: application/json" \
  -d '{"background":true,"limit":800}'
```

## Politica de Publicacion

- Contenido propio nuevo: se sube y despliega de inmediato.
- Contenido scrapeado/modelado del dia: se acumula y se despliega al cierre del dia, salvo que se pida publicarlo antes.
- Home/Radar inicial: solo 3 piezas importantes.
- Academia y biblioteca interna: pueden cargar todo el volumen modelado.
