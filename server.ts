import express from "express";
import "dotenv/config";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const DATABASE_PATH = path.join(process.cwd(), "leads_database.json");
const RADAR_ARTICLES_PATH = path.join(process.cwd(), "radar_articles.json");
const RADAR_PROMPTS_PATH = path.join(process.cwd(), "radar_prompts.json");
const MAX_PERSISTED_RADAR_ARTICLES = 1000;
const MAX_PERSISTED_RADAR_PROMPTS = 1000;
const DEFAULT_RADAR_SOURCE_URLS = [
  "https://www.tododeia.com/",
  "https://www.tododeia.com/tienda/claude-de-cero-a-cien",
  "https://www.tododeia.com/tienda/codex-de-cero-a-cien",
  "https://www.tododeia.com/collab"
];
const DEFAULT_RADAR_TOOL_SOURCE_URLS = [
  "https://www.futurepedia.io/",
  "https://theresanaiforthat.com/",
  "https://aitoptools.com/",
  "https://bestofai.io/"
];
const DEFAULT_PROMPT_SOURCE_URLS = [
  "https://prompts.chat/prompts",
  "https://prompts.chat/prompts?q=automation",
  "https://prompts.chat/prompts?q=marketing",
  "https://prompts.chat/prompts?q=business",
  "https://prompts.chat/prompts?q=design",
  "https://prompts.chat/prompts?q=developer",
  "https://prompts.chat/prompts?q=image",
  "https://prompts.chat/prompts?q=content",
  "https://prompts.chat/prompts?q=code",
  "https://prompts.chat/prompts?q=python",
  "https://prompts.chat/prompts?q=seo",
  "https://prompts.chat/prompts?q=sales",
  "https://prompts.chat/prompts?q=email",
  "https://prompts.chat/prompts?q=research",
  "https://prompts.chat/prompts?q=video",
  "https://prompts.chat/prompts?q=startup",
  "https://prompts.chat/prompts?q=writing"
];

interface ExtractedResource {
  url: string;
  normalizedUrl: string;
  sourcePlatform?: string;
  sourceType: "github_repo" | "web_page";
  title: string;
  description: string;
  text: string;
  owner?: string;
  repo?: string;
  stars?: number;
  forks?: number;
  language?: string;
  license?: string;
  homepage?: string;
  topics?: string[];
  resourceLinks?: ResourceLink[];
}

interface ResourceLink {
  label: string;
  url: string;
  type: "github" | "official" | "docs" | "demo" | "tool";
}

interface ModeledCatalogItem {
  title: string;
  description: string;
  category: string;
  tags: string[];
  pricing: string;
  score: number;
  stars: number | null;
  forks?: number;
  owner?: string;
  language?: string;
  highlights: string[];
  viralHacks: string;
  wentixAngle: string;
  sourceSummary: string;
}

interface ModeledNewsArticle {
  title: string;
  category: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  readTime: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  views: number;
  sourceUrl: string;
  sourceSummary: string;
  wentixAngle: string;
  learningGoals?: string[];
  contentSections?: { heading: string; body: string }[];
  actionSteps?: string[];
  closingNote?: string;
  resourceLinks?: ResourceLink[];
}

function inferDifficulty(resource: ExtractedResource, item?: Partial<ModeledNewsArticle>): "Principiante" | "Intermedio" | "Avanzado" {
  if (item?.difficulty === "Principiante" || item?.difficulty === "Intermedio" || item?.difficulty === "Avanzado") {
    return item.difficulty;
  }

  const text = `${resource.title} ${resource.description} ${resource.text}`.toLowerCase();
  const advancedTerms = ["arquitectura", "produccion", "producción", "multiagente", "multi-agente", "fine-tuning", "rag", "kubernetes", "seguridad", "sdk", "enterprise"];
  const intermediateTerms = ["automatizacion", "automatización", "workflow", "n8n", "api", "integracion", "integración", "deploy", "cursor", "codex", "github", "ollama", "supabase"];
  const beginnerTerms = ["de cero", "principiante", "intro", "guia", "guía", "primeros pasos", "tutorial", "aprende", "fundamentos"];

  if (advancedTerms.some((term) => text.includes(term))) return "Avanzado";
  if (intermediateTerms.some((term) => text.includes(term))) return "Intermedio";
  if (beginnerTerms.some((term) => text.includes(term))) return "Principiante";
  return "Intermedio";
}

function inferAcademyDifficulty(resource: ExtractedResource, item?: Partial<ModeledNewsArticle>): "Principiante" | "Intermedio" | "Avanzado" {
  if (item?.difficulty === "Principiante" || item?.difficulty === "Intermedio" || item?.difficulty === "Avanzado") {
    return item.difficulty;
  }

  const titleAndSummary = `${resource.title} ${resource.description} ${resource.url}`.toLowerCase();
  const text = `${titleAndSummary} ${resource.text.slice(0, 2500)}`.toLowerCase();
  const beginnerTerms = ["de cero", "principiante", "intro", "esencial", "basico", "básico", "guia", "guía", "primeros pasos", "tutorial", "aprende", "fundamentos", "instalar", "que es", "qué es"];
  const advancedTerms = ["arquitectura", "produccion", "producción", "multiagente", "multi-agente", "fine-tuning", "rag", "kubernetes", "seguridad", "sdk", "enterprise", "mcp", "agente", "agents"];
  const intermediateTerms = ["automatizacion", "automatización", "workflow", "n8n", "api", "integracion", "integración", "deploy", "cursor", "codex", "github", "ollama", "supabase", "marketing", "ads", "copywriter"];

  if (beginnerTerms.some((term) => text.includes(term))) return "Principiante";
  if (advancedTerms.some((term) => titleAndSummary.includes(term))) return "Avanzado";
  if (intermediateTerms.some((term) => text.includes(term))) return "Intermedio";
  if (advancedTerms.some((term) => text.includes(term))) return "Avanzado";
  return "Intermedio";
}

function inferAcademyDifficultyV2(resource: ExtractedResource, item?: Partial<ModeledNewsArticle>): "Principiante" | "Intermedio" | "Avanzado" {
  if (item?.difficulty === "Principiante" || item?.difficulty === "Intermedio" || item?.difficulty === "Avanzado") {
    return item.difficulty;
  }

  const titleAndSummary = `${resource.title} ${resource.description} ${resource.url}`.toLowerCase();
  const body = `${titleAndSummary} ${resource.text.slice(0, 1800)}`.toLowerCase();
  const beginnerStrong = ["de cero", "principiante", "primeros pasos", "fundamentos", "instalar", "qué es", "que es", "comandos esenciales", "basico", "básico"];
  const advancedTitle = ["arquitectura", "multiagente", "multi-agente", "fine-tuning", "rag", "kubernetes", "seguridad", "sdk", "enterprise", "mcp", "agente", "agents", "developer", "desarrollador", "higgsfield", "skills"];
  const intermediateTitle = ["automatizacion", "automatización", "workflow", "n8n", "api", "integracion", "integración", "deploy", "cursor", "codex", "github", "ollama", "supabase", "marketing", "ads", "copywriter", "ventas", "contenido", "creativo", "negocio", "comunidad"];

  if (beginnerStrong.some((term) => titleAndSummary.includes(term))) return "Principiante";
  if (advancedTitle.some((term) => titleAndSummary.includes(term))) return "Avanzado";
  if (intermediateTitle.some((term) => titleAndSummary.includes(term))) return "Intermedio";
  if (advancedTitle.filter((term) => body.includes(term)).length >= 2) return "Avanzado";
  if (intermediateTitle.some((term) => body.includes(term))) return "Intermedio";
  return "Intermedio";
}

interface PersistedRadarArticle extends ModeledNewsArticle {
  id: string;
  createdAt: string;
  source: string;
  sourceType: ExtractedResource["sourceType"];
  sourceTitle: string;
}

interface RadarRunSummary {
  success: true;
  running: boolean;
  startedAt: string;
  finishedAt: string;
  sourceCount: number;
  processedCount: number;
  insertedCount: number;
  duplicateCount: number;
  failureCount: number;
  articles: PersistedRadarArticle[];
  failures: { url: string; error: string }[];
}

interface RadarStatus {
  running: boolean;
  startedAt: string | null;
  lastFinishedAt: string | null;
  lastRun: RadarRunSummary | null;
  persistedCount: number;
}

interface ExtractedPromptCard {
  sourceUrl: string;
  sourceTitle: string;
  promptText: string;
  tags: string[];
  votes: number;
}

interface PersistedPromptItem {
  id: string;
  title: string;
  promptText: string;
  description: string;
  model: string;
  category: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  popularCount: number;
  sourceUrl: string;
  sourceTitle: string;
  createdAt: string;
}

interface PromptRadarRunSummary {
  success: true;
  running: boolean;
  startedAt: string;
  finishedAt: string;
  sourceCount: number;
  processedCount: number;
  insertedCount: number;
  duplicateCount: number;
  failureCount: number;
  prompts: PersistedPromptItem[];
  failures: { url: string; error: string }[];
}

interface PromptRadarStatus {
  running: boolean;
  startedAt: string | null;
  lastFinishedAt: string | null;
  lastRun: PromptRadarRunSummary | null;
  persistedCount: number;
}

interface LeadItem {
  email: string;
  createdAt: string;
}

interface DonationItem {
  id: string;
  name: string;
  amount: number;
  message: string;
  date: string;
}

interface LeadsDB {
  visitorsCount: number;
  leads: LeadItem[];
  donations: DonationItem[];
}

// Safe database loading helper
function getDB(): LeadsDB {
  try {
    if (fs.existsSync(DATABASE_PATH)) {
      const raw = fs.readFileSync(DATABASE_PATH, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
  }
  return {
    visitorsCount: 9482,
    leads: [
      { email: "manu.emprendehoy@gmail.com", createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString() },
      { email: "carla.ia.marketing@gmail.com", createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
      { email: "javier.growth.hacks@outlook.com", createdAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString() }
    ],
    donations: [
      { id: "1", name: "Alejandro M.", amount: 50, message: "Soporte total a Wentix AI. ¡Mucha fuerza!", date: "2026-05-29" },
      { id: "2", name: "Lucía Fernández", amount: 25, message: "Los prompts de Claude me han ahorrado días enteros. Gracias Manu.", date: "2026-05-27" }
    ]
  };
}

// Safe database saving helper
function saveDB(db: LeadsDB) {
  try {
    fs.writeFileSync(DATABASE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

function parseSourceUrls(input?: string): string[] {
  return String(input || "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueSourceUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  return urls.filter((url) => {
    const key = normalizeDedupeText(url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getRadarSourceUrls(overrideUrls?: unknown): string[] {
  const requestedUrls = Array.isArray(overrideUrls)
    ? overrideUrls.map((item) => String(item).trim()).filter(Boolean)
    : parseSourceUrls(typeof overrideUrls === "string" ? overrideUrls : undefined);
  const configuredUrls = parseSourceUrls(process.env.RADAR_SOURCE_URLS);
  const configuredToolUrls = parseSourceUrls(process.env.RADAR_TOOL_SOURCE_URLS);

  if (requestedUrls.length) return uniqueSourceUrls(requestedUrls);

  return uniqueSourceUrls([
    ...(configuredUrls.length ? configuredUrls : DEFAULT_RADAR_SOURCE_URLS),
    ...(configuredToolUrls.length ? configuredToolUrls : DEFAULT_RADAR_TOOL_SOURCE_URLS)
  ]);
}

function getPromptRadarSourceUrls(overrideUrls?: unknown): string[] {
  const requestedUrls = Array.isArray(overrideUrls)
    ? overrideUrls.map((item) => String(item).trim()).filter(Boolean)
    : parseSourceUrls(typeof overrideUrls === "string" ? overrideUrls : undefined);
  const configuredUrls = parseSourceUrls(process.env.PROMPT_RADAR_SOURCE_URLS);
  return requestedUrls.length ? requestedUrls : configuredUrls.length ? configuredUrls : DEFAULT_PROMPT_SOURCE_URLS;
}

function boolEnv(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function intEnv(name: string, defaultValue: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : defaultValue;
}

function normalizeDedupeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function createRadarArticleId(article: ModeledNewsArticle): string {
  const key = normalizeDedupeText(article.sourceUrl || article.title);
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) - hash + key.charCodeAt(index)) | 0;
  }
  return `radar-${Math.abs(hash).toString(36)}`;
}

function isPersistedRadarArticle(value: unknown): value is PersistedRadarArticle {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PersistedRadarArticle>;
  return typeof item.id === "string" && typeof item.title === "string" && typeof item.sourceUrl === "string";
}

function readRadarArticles(): PersistedRadarArticle[] {
  try {
    if (!fs.existsSync(RADAR_ARTICLES_PATH)) return [];
    const raw = fs.readFileSync(RADAR_ARTICLES_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isPersistedRadarArticle) : [];
  } catch (err) {
    console.error("Error reading radar articles file, using empty list:", err);
    return [];
  }
}

function writeRadarArticles(articles: PersistedRadarArticle[]) {
  fs.writeFileSync(RADAR_ARTICLES_PATH, JSON.stringify(articles, null, 2), "utf-8");
}

function needsArticleRemodel(article: PersistedRadarArticle, nextArticle?: ModeledNewsArticle): boolean {
  const contentBlob = [
    article.excerpt,
    article.sourceSummary,
    article.wentixAngle,
    ...(article.learningGoals || []),
    ...(article.actionSteps || []),
    ...(article.contentSections || []).flatMap((section) => [section.heading, section.body])
  ].join(" ");

  const hasScrapeNoise = /Titulo detectado|Descripcion detectada|Dominio:\s|Contenido visible|\b0[1-9]\s+[A-ZÁÉÍÓÚÑ][^.!?]{2,42}\s+0[1-9]/i.test(contentBlob);
  const missingStructure = !article.contentSections?.length || !article.learningGoals?.length;
  const missingUsefulLinks = !article.resourceLinks?.length && Boolean(nextArticle?.resourceLinks?.length);

  return hasScrapeNoise || missingStructure || missingUsefulLinks;
}

function isPersistedPromptItem(value: unknown): value is PersistedPromptItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PersistedPromptItem>;
  return typeof item.id === "string" && typeof item.title === "string" && typeof item.promptText === "string";
}

function readRadarPrompts(): PersistedPromptItem[] {
  try {
    if (!fs.existsSync(RADAR_PROMPTS_PATH)) return [];
    const raw = fs.readFileSync(RADAR_PROMPTS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isPersistedPromptItem) : [];
  } catch (err) {
    console.error("Error reading radar prompts file, using empty list:", err);
    return [];
  }
}

function writeRadarPrompts(prompts: PersistedPromptItem[]) {
  fs.writeFileSync(RADAR_PROMPTS_PATH, JSON.stringify(prompts, null, 2), "utf-8");
}

function normalizeInputUrl(input: string): string {
  const trimmed = String(input || "").trim();
  if (!trimmed) throw new Error("URL vacia");
  return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
}

function parseGitHubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(normalizeInputUrl(url));
    if (parsed.hostname.replace("www.", "").toLowerCase() !== "github.com") return null;
    const [owner, repo] = parsed.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/i, "") };
  } catch {
    return null;
  }
}

function parseCompactNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const cleaned = value.trim().toLowerCase().replace(/,/g, "");
  const match = cleaned.match(/(\d+(?:\.\d+)?)(k|m)?/);
  if (!match) return undefined;
  const base = Number(match[1]);
  if (!Number.isFinite(base)) return undefined;
  const multiplier = match[2] === "m" ? 1_000_000 : match[2] === "k" ? 1_000 : 1;
  return Math.round(base * multiplier);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/<!--\s*-->/g, "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function extractMeta(html: string, name: string): string {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${escapedName}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:name|property)=["']${escapedName}["'][^>]*>`, "i")
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function extractTitle(html: string): string {
  return (
    extractMeta(html, "og:title") ||
    html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, " ").trim() ||
    ""
  );
}

function extractMarkdownDescription(markdown: string): string {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .find((line) => line.length > 40 && !line.startsWith("```"))?.slice(0, 220) || "";
}

function sanitizeModeledText(value: string): string {
  return String(value || "")
    .replace(/Titulo detectado:\s*/gi, "")
    .replace(/Descripcion detectada:\s*/gi, "")
    .replace(/Dominio:\s*\S+\s*/gi, "")
    .replace(/Contenido visible:\s*/gi, "")
    .replace(/\b(?:0[1-9]|1[0-9])\s+([A-ZÁÉÍÓÚÑ][^.!?]{2,42})(?=\s+(?:0[1-9]|1[0-9])\s+|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractUsefulResourceLinks(html: string, baseUrl: string): ResourceLink[] {
  const links: ResourceLink[] = [];
  const seen = new Set<string>();
  const baseHost = new URL(baseUrl).hostname.replace(/^www\./, "");
  const anchorPattern = /<a\b[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(html)) && links.length < 6) {
    const href = normalizeDiscoveredUrl(match[1], baseUrl);
    if (!href || seen.has(href)) continue;

    const parsed = new URL(href);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname.toLowerCase();
    const labelText = decodeHtmlEntities(stripHtml(match[2])).replace(/\s+/g, " ").trim();
    const compact = `${labelText} ${href}`.toLowerCase();

    let type: ResourceLink["type"] | null = null;
    if (host === "github.com") type = "github";
    else if (/docs|documentation|manual|guide|learn/.test(compact)) type = "docs";
    else if (/demo|playground|example|preview/.test(compact)) type = "demo";
    else if (/launch|open app|try|sign up|get started|website|official|home/.test(compact) && host !== baseHost) type = "official";
    else if (host !== baseHost && !/\.(png|jpe?g|gif|webp|svg|css|js|pdf|zip)$/i.test(path)) type = "tool";

    if (!type) continue;
    seen.add(href);
    links.push({
      label: labelText && labelText.length <= 60 ? labelText : type === "github" ? "Repositorio GitHub" : "Recurso oficial",
      url: href,
      type
    });
  }

  const order: Record<ResourceLink["type"], number> = { github: 0, official: 1, docs: 2, demo: 3, tool: 4 };
  return links.sort((a, b) => order[a.type] - order[b.type]);
}

function splitResourceIntoSections(resource: ExtractedResource): { heading: string; body: string }[] {
  const cleaned = sanitizeModeledText(resource.text)
    .replace(/\s+/g, " ")
    .replace(/Volver al inicio/gi, " ")
    .replace(/comunidad b[oó]veda/gi, " ")
    .trim();
  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 45 && sentence.length < 700);

  const chunks: string[] = [];
  for (let index = 0; index < sentences.length && chunks.length < 5; index += 3) {
    const chunk = sentences.slice(index, index + 3).join(" ");
    if (chunk.length > 120) chunks.push(chunk.slice(0, 900));
  }

  const headings = [
    "Contexto y oportunidad",
    "Cómo aplicarlo en Wentix",
    "Errores que debes evitar",
    "Sistema recomendado",
    "Próximo paso"
  ];

  const fallback = resource.description || resource.text.slice(0, 700) || "Contenido modelado para convertir la fuente en una sesión práctica de aprendizaje.";
  const baseChunks = chunks.length ? chunks : [fallback];

  return baseChunks.slice(0, 5).map((body, index) => ({
    heading: headings[index] || `Bloque ${index + 1}`,
    body: body.trim()
  }));
}

function buildLearningGoals(resource: ExtractedResource): string[] {
  const title = resource.title.replace(/^Radar Wentix:\s*/i, "");
  return [
    `Entender qué aporta "${title}" sin depender de la fuente original.`,
    "Traducir la idea a una acción concreta dentro del ecosistema Wentix.",
    "Identificar el nivel de complejidad antes de aplicarlo en un proyecto real."
  ];
}

function buildActionSteps(resource: ExtractedResource): string[] {
  const lower = `${resource.title} ${resource.description} ${resource.text}`.toLowerCase();
  if (lower.includes("claude") || lower.includes("codex")) {
    return [
      "Define un proyecto pequeño donde probar la técnica durante 20 minutos.",
      "Crea una instrucción base con objetivo, contexto, restricciones y formato de salida.",
      "Evalúa el resultado y guarda la versión útil como plantilla o skill Wentix."
    ];
  }
  if (lower.includes("github") || lower.includes("repo")) {
    return [
      "Revisa el repositorio o recurso asociado y separa instalación, uso y caso de negocio.",
      "Convierte el aprendizaje en una checklist reproducible.",
      "Documenta cuándo conviene usarlo y cuándo no dentro de tu stack."
    ];
  }
  return [
    "Resume la idea en una frase operativa.",
    "Convierte esa frase en un mini flujo de trabajo aplicable.",
    "Guarda el aprendizaje como sesión, prompt o automatización reutilizable."
  ];
}

function extractPromptsChatCards(html: string, sourceUrl: string, limit: number): ExtractedPromptCard[] {
  const cards: ExtractedPromptCard[] = [];
  const seenPrompts = new Set<string>();
  const prePattern = /<pre\b[^>]*>([\s\S]*?)<\/pre>/gi;
  let match: RegExpExecArray | null;

  while ((match = prePattern.exec(html)) && cards.length < limit) {
    const promptText = decodeHtmlEntities(stripHtml(match[1])).replace(/\n{3,}/g, "\n\n").trim();
    if (promptText.length < 40) continue;
    if (!isMostlyEnglishPrompt(promptText)) continue;
    const promptKey = normalizeDedupeText(promptText.slice(0, 260));
    if (seenPrompts.has(promptKey)) continue;

    const before = html.slice(Math.max(0, match.index - 3500), match.index);
    const titleMatches = Array.from(before.matchAll(/<a\b[^>]+href=["'](\/prompts\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi));
    const lastTitle = titleMatches[titleMatches.length - 1];
    const cardBefore = lastTitle?.index !== undefined ? before.slice(lastTitle.index) : before;
    const sourcePath = lastTitle?.[1] || "";
    const sourceTitle = decodeHtmlEntities(stripHtml(lastTitle?.[2] || "Prompt de IA")).trim();
    const tagMatches = Array.from(cardBefore.matchAll(/href=["']\/tags\/[^"']+["'][^>]*>([^<]+)<\/a>/gi));
    const tags = tagMatches.slice(-4).map((tag) => decodeHtmlEntities(tag[1]).trim()).filter(Boolean);
    const votesMatch = html.slice(match.index, Math.min(html.length, match.index + 1800)).match(/lucide-arrow-big-up[\s\S]{0,500}?>(\d+)<\/span>/i);
    const source = sourcePath ? new URL(sourcePath, sourceUrl).toString() : sourceUrl;

    seenPrompts.add(promptKey);
    cards.push({
      sourceUrl: source,
      sourceTitle: sourceTitle || "Prompt de IA",
      promptText,
      tags,
      votes: Number(votesMatch?.[1] || 0)
    });
  }

  return cards;
}

function isMostlyEnglishPrompt(value: string): boolean {
  const compact = value.replace(/\s+/g, " ").trim();
  const letters = compact.match(/\p{L}/gu) || [];
  if (!letters.length) return false;
  const asciiLetters = compact.match(/[A-Za-z]/g) || [];
  const asciiRatio = asciiLetters.length / letters.length;
  const commonEnglishTerms = /\b(the|and|you|your|with|for|to|as|act|create|write|provide|should|will|want|need|task|role|prompt)\b/i;
  return asciiRatio > 0.82 && commonEnglishTerms.test(compact);
}

function inferPromptModel(card: ExtractedPromptCard): string {
  const text = `${card.sourceTitle} ${card.promptText} ${card.tags.join(" ")}`.toLowerCase();
  if (/midjourney|\/imagine|--ar|--v\s*\d/.test(text)) return "Midjourney";
  if (/claude/.test(text)) return "Claude";
  if (/gemini/.test(text)) return "Gemini";
  if (/sora|runway|video/.test(text)) return "Sora";
  return "ChatGPT";
}

function inferPromptCategory(card: ExtractedPromptCard): string {
  const text = `${card.sourceTitle} ${card.promptText} ${card.tags.join(" ")}`.toLowerCase();
  if (/competitive research|rival research|perplexity|market research|competitor/.test(text)) return "Negocios Digitales";
  if (/repository|bug|security vulnerabilit|critical issue|static code analysis|dependency|ci\/cd|programming language|framework|code quality|regression test/.test(text)) return "Programación";
  if (/3d|image|visual|miniature|photo|midjourney|render|design|website|ui|ux/.test(text)) return "Diseño IA";
  if (/python|javascript|typescript|react|code|developer|software|api|programming|app\b/.test(text)) return "Programación";
  if (/marketing|copy|sales|email|brand|seo|content|social|ad\b|ads/.test(text)) return "Marketing IA";
  if (/automation|workflow|zapier|make|n8n|telegram|scrap/.test(text)) return "Automatizaciones";
  if (/business|startup|strategy|product|market/.test(text)) return "Negocios Digitales";
  return "Prompts";
}

function inferPromptDifficulty(card: ExtractedPromptCard): "Principiante" | "Intermedio" | "Avanzado" {
  const text = `${card.sourceTitle} ${card.promptText} ${card.tags.join(" ")}`.toLowerCase();
  if (/architecture|api|developer|software|python|typescript|automation|workflow|strategy|advanced|complex/.test(text)) return "Avanzado";
  if (/plan|analyze|consultant|marketing|design|business|content|seo/.test(text)) return "Intermedio";
  return "Principiante";
}

function summarizePromptUseCase(card: ExtractedPromptCard): string {
  const promptLower = card.promptText.toLowerCase();
  if (/competitive research|rival research|perplexity|market research|competitor/.test(promptLower)) {
    return "Prompt en inglés para investigar competidores, contrastar fuentes y convertir señales del mercado en análisis accionable.";
  }
  if (/repository|bug|security vulnerabilit|static code analysis|dependency|ci\/cd|regression test/.test(promptLower)) {
    return "Prompt en inglés para auditar repositorios, detectar bugs y documentar correcciones técnicas con trazabilidad.";
  }
  if (/3d|image|visual|miniature|photo|midjourney|render/.test(promptLower)) {
    return "Prompt en inglés para generar piezas visuales con una dirección creativa clara y reutilizable.";
  }
  if (/web design consultant|information architecture|visual design/.test(promptLower)) {
    return "Prompt en inglés para planificar arquitectura, diseño visual y experiencia de usuario en proyectos web.";
  }
  if (/job interview|interviewer|interview questions/.test(promptLower)) {
    return "Prompt en inglés para simular entrevistas, practicar respuestas y preparar procesos de selección.";
  }
  if (/auto(?:matically)? types|pyautogui|typing automation|customizable delay/.test(promptLower)) {
    return "Prompt en inglés para crear automatizaciones de escritura con Python y una interfaz configurable.";
  }
  const category = inferPromptCategory(card).toLowerCase();
  const title = card.sourceTitle.replace(/[^\p{L}\p{N}\s-]/gu, "").trim();
  if (category.includes("programación")) return `Prompt en inglés para resolver tareas técnicas de programación con instrucciones claras y reutilizables.`;
  if (category.includes("marketing")) return `Prompt en inglés para crear contenido, ventas o campañas con una estructura lista para adaptar a tu negocio.`;
  if (category.includes("diseño")) return `Prompt en inglés para generar ideas visuales, interfaces o piezas creativas con mejor dirección estética.`;
  if (category.includes("automatizaciones")) return `Prompt en inglés para diseñar flujos, automatizar tareas y convertir procesos repetitivos en sistemas accionables.`;
  if (category.includes("negocios")) return `Prompt en inglés para analizar decisiones de negocio y convertir ideas en planes prácticos.`;
  return `Prompt en inglés de uso profesional, modelado para Wentix con título y descripción en español.`;
}

function spanishPromptTitle(sourceTitle: string, category: string, promptText = ""): string {
  const normalized = sourceTitle.trim();
  const promptLower = promptText.toLowerCase();
  if (/competitive research|rival research|perplexity|search index/.test(promptLower)) return "Investigación competitiva avanzada";
  if (/repository|bug|security vulnerabilit|static code analysis|dependency|ci\/cd/.test(promptLower)) return "Auditor técnico de repositorios";
  if (/auto(?:matically)? types|pyautogui|typing automation|customizable delay/.test(promptLower)) return "Automatizador de escritura con Python";
  if (/verbatim|organized notes|meeting notes|transcript/.test(promptLower)) return "Notas organizadas desde conversaciones";
  if (/sentence expansion|expand.*sentence|complete.*sentence/.test(promptLower)) return "Expansor de frases profesional";
  if (/job interview|interviewer|interview questions/.test(promptLower)) return "Simulador de entrevista laboral";
  if (/web design consultant|information architecture|visual design/.test(promptLower)) return "Consultor de diseño web";
  if (/revenue performance|performance report|business report/.test(promptLower)) return "Informe de rendimiento comercial";
  const dictionary: Record<string, string> = {
    "Write an Email": "Redactar un correo profesional",
    "Python Software Developer": "Desarrollador Python para apps",
    "Web Design Consultant": "Consultor de diseño web",
    "Web Design": "Consultor de diseño web",
    "Job Interviewer": "Simulador de entrevista laboral",
    "Revenue Performance Report": "Informe de rendimiento comercial",
    "Payment gateway page": "Página de pasarela de pagos",
    "Frontend Developer Skill": "Asistente frontend profesional",
    "Act as a Python Software Developer": "Desarrollador Python para automatización",
    "Marketing": "Prompt de marketing accionable"
  };
  if (dictionary[normalized]) return dictionary[normalized];
  if (/interview/i.test(normalized)) return "Simulador de entrevista laboral";
  if (/revenue|performance|report/i.test(normalized)) return "Informe de rendimiento para negocio";
  if (/payment|checkout|gateway/i.test(normalized)) return "Página de pagos optimizada";
  if (/football|photo|image|tunnel|portrait/i.test(normalized)) return "Prompt visual creativo";
  if (/email/i.test(normalized)) return "Redactor de correos profesionales";
  if (/python|developer|code|software/i.test(normalized)) return "Asistente técnico de programación";
  if (/design|website|ui|ux/i.test(normalized)) return "Consultor de diseño y experiencia";
  if (/marketing|copy|content|sales/i.test(normalized)) return "Estratega de marketing con IA";
  if (category === "Programación") return "Prompt técnico de programación";
  if (category === "Marketing IA") return "Prompt de marketing accionable";
  if (category === "Diseño IA") return "Prompt creativo de diseño";
  if (category === "Automatizaciones") return "Prompt para automatizar procesos";
  if (category === "Negocios Digitales") return "Prompt estratégico de negocio";
  return "Prompt profesional para IA";
}

function buildFallbackPromptItem(card: ExtractedPromptCard): PersistedPromptItem {
  const category = inferPromptCategory(card);
  return {
    id: createRadarArticleId({ title: card.sourceTitle, sourceUrl: card.sourceUrl } as ModeledNewsArticle).replace("radar-", "prompt-"),
    title: spanishPromptTitle(card.sourceTitle, category, card.promptText),
    promptText: card.promptText,
    description: summarizePromptUseCase(card),
    model: inferPromptModel(card),
    category,
    difficulty: inferPromptDifficulty(card),
    popularCount: Math.max(card.votes, Math.floor(300 + Math.random() * 2400)),
    sourceUrl: card.sourceUrl,
    sourceTitle: card.sourceTitle,
    createdAt: new Date().toISOString()
  };
}

function normalizeModeledPrompt(item: Partial<PersistedPromptItem>, card: ExtractedPromptCard): PersistedPromptItem {
  const fallback = buildFallbackPromptItem(card);
  return {
    ...fallback,
    title: String(item.title || fallback.title).slice(0, 90),
    description: String(item.description || fallback.description).slice(0, 220),
    model: String(item.model || fallback.model),
    category: String(item.category || fallback.category),
    difficulty: item.difficulty === "Principiante" || item.difficulty === "Intermedio" || item.difficulty === "Avanzado" ? item.difficulty : fallback.difficulty,
    popularCount: Number.isFinite(Number(item.popularCount)) ? Number(item.popularCount) : fallback.popularCount,
    promptText: card.promptText
  };
}

function refinePageTitle(url: string, title: string, visibleText: string): string {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "").toLowerCase();
    if (hostname === "tododeia.com") {
      const firstChunk = visibleText.split("|")[0]?.split("—")[0]?.trim();
      if (firstChunk && firstChunk.length >= 6 && firstChunk.length <= 90 && !firstChunk.toLowerCase().includes("skip to")) {
        return firstChunk;
      }
    }
  } catch {
    // Keep original title if URL parsing fails.
  }
  return title;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 9000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeDiscoveredUrl(rawHref: string, baseUrl: string): string {
  try {
    const absolute = new URL(rawHref, baseUrl);
    absolute.hash = "";
    absolute.search = "";
    if (!["http:", "https:"].includes(absolute.protocol)) return "";
    return absolute.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function isCrawlableInternalUrl(url: string, rootUrl: string): boolean {
  try {
    const parsed = new URL(url);
    const root = new URL(rootUrl);
    if (parsed.hostname.replace("www.", "") !== root.hostname.replace("www.", "")) return false;
    const path = parsed.pathname.toLowerCase();
    if (path.includes("/api/") || path.includes("/_next/") || path.includes("/assets/")) return false;
    return !/\.(apng|avif|png|jpe?g|gif|webp|svg|ico|css|js|mjs|map|json|webmanifest|pdf|zip|rar|7z|mp4|mov|webm|mp3|wav|ogg|woff2?|ttf|otf|eot)$/i.test(path);
  } catch {
    return false;
  }
}

async function discoverSitemapUrls(seedUrls: string[], maxPages: number): Promise<string[]> {
  const discovered = new Set<string>();

  for (const seedUrl of seedUrls) {
    if (discovered.size >= maxPages) break;

    try {
      const normalizedSeed = normalizeInputUrl(seedUrl).replace(/\/$/, "");
      const origin = new URL(normalizedSeed).origin;
      const sitemapCandidates = new Set<string>([`${origin}/sitemap.xml`]);

      try {
        const robotsResponse = await fetchWithTimeout(`${origin}/robots.txt`, {
          headers: { "User-Agent": "WentixRadarCrawler/1.0" }
        }, 9000);
        if (robotsResponse.ok) {
          const robotsText = await robotsResponse.text();
          const sitemapPattern = /^sitemap:\s*(\S+)/gim;
          let robotsMatch: RegExpExecArray | null;
          while ((robotsMatch = sitemapPattern.exec(robotsText))) {
            sitemapCandidates.add(robotsMatch[1].trim());
          }
        }
      } catch {
        // Sitemap discovery still continues with /sitemap.xml.
      }

      for (const sitemapUrl of sitemapCandidates) {
        if (discovered.size >= maxPages) break;
        try {
          const response = await fetchWithTimeout(sitemapUrl, {
            headers: {
              "User-Agent": "WentixRadarCrawler/1.0",
              "Accept": "application/xml,text/xml,text/plain,*/*"
            }
          }, 12000);
          if (!response.ok) continue;
          const xml = await response.text();
          const locPattern = /<loc>\s*([^<]+)\s*<\/loc>/gi;
          let locMatch: RegExpExecArray | null;
          while ((locMatch = locPattern.exec(xml)) && discovered.size < maxPages) {
            const nextUrl = normalizeDiscoveredUrl(decodeHtmlEntities(locMatch[1].trim()), normalizedSeed);
            if (!nextUrl || discovered.has(nextUrl) || !isCrawlableInternalUrl(nextUrl, normalizedSeed)) continue;
            discovered.add(nextUrl);
          }
        } catch (err: any) {
          console.warn(`Radar sitemap skipped ${sitemapUrl}:`, err.message || err);
        }
      }
    } catch {
      // Ignore malformed seed URLs.
    }
  }

  return Array.from(discovered).slice(0, maxPages);
}

async function discoverInternalUrls(seedUrls: string[], maxPages: number): Promise<string[]> {
  const normalizedSeeds = seedUrls.map((url) => normalizeInputUrl(url).replace(/\/$/, ""));
  const rootUrl = normalizedSeeds[0];
  const sitemapUrls = await discoverSitemapUrls(normalizedSeeds, maxPages);
  const queue = [...normalizedSeeds, ...sitemapUrls];
  const discovered = new Set<string>(queue);
  const crawled = new Set<string>();

  while (queue.length && discovered.size < maxPages) {
    const currentUrl = queue.shift();
    if (!currentUrl || crawled.has(currentUrl)) continue;
    crawled.add(currentUrl);

    try {
      const response = await fetchWithTimeout(currentUrl, {
        headers: {
          "User-Agent": "WentixRadarCrawler/1.0",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
      }, 9000);
      if (!response.ok) continue;
      const contentType = response.headers.get("content-type") || "";
      if (contentType && !/text\/html|application\/xhtml\+xml/i.test(contentType)) continue;

      const html = await response.text();
      const hrefPattern = /href=["']([^"']+)["']/gi;
      let match: RegExpExecArray | null;
      while ((match = hrefPattern.exec(html)) && discovered.size < maxPages) {
        const nextUrl = normalizeDiscoveredUrl(match[1], currentUrl);
        if (!nextUrl || discovered.has(nextUrl) || !isCrawlableInternalUrl(nextUrl, rootUrl)) continue;
        discovered.add(nextUrl);
        queue.push(nextUrl);
      }
    } catch (err: any) {
      console.warn(`Radar crawler skipped ${currentUrl}:`, err.message || err);
    }
  }

  return Array.from(discovered).slice(0, maxPages);
}

async function extractGitHubResource(url: string, sourcePlatform?: string): Promise<ExtractedResource | null> {
  const repoRef = parseGitHubRepo(url);
  if (!repoRef) return null;

  const apiUrl = `https://api.github.com/repos/${repoRef.owner}/${repoRef.repo}`;
  const response = await fetchWithTimeout(apiUrl, {
    headers: {
      "Accept": "application/vnd.github+json",
      "User-Agent": "WentixCurator/1.0"
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API respondio ${response.status}`);
  }

  const repo = await response.json() as any;
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const normalizedUrl = repo.html_url || normalizeInputUrl(url);
  const title = repo.name || repoRef.repo;
  const description = repo.description || `Repositorio open source ${repoRef.owner}/${repoRef.repo}`;
  const text = [
    `Repositorio: ${repo.full_name}`,
    `Descripcion original: ${description}`,
    `Lenguaje principal: ${repo.language || "No especificado"}`,
    `Estrellas: ${repo.stargazers_count || 0}`,
    `Forks: ${repo.forks_count || 0}`,
    `Licencia: ${repo.license?.spdx_id || repo.license?.name || "No especificada"}`,
    `Temas: ${topics.join(", ") || "Sin topics"}`,
    `Homepage: ${repo.homepage || "No declarada"}`
  ].join("\n");

  return {
    url,
    normalizedUrl,
    sourcePlatform,
    sourceType: "github_repo",
    title,
    description,
    text,
    owner: repo.owner?.login || repoRef.owner,
    repo: title,
    stars: Number(repo.stargazers_count || 0),
    forks: Number(repo.forks_count || 0),
    language: repo.language || "Open Source",
    license: repo.license?.spdx_id || repo.license?.name,
    homepage: repo.homepage || "",
    topics,
    resourceLinks: [
      { label: "Repositorio GitHub", url: normalizedUrl, type: "github" },
      ...(repo.homepage ? [{ label: "Web oficial", url: repo.homepage, type: "official" as const }] : [])
    ]
  };
}

async function extractWebResource(url: string, sourcePlatform?: string): Promise<ExtractedResource> {
  const normalizedUrl = normalizeInputUrl(url);
  const githubResource = await extractGitHubResource(normalizedUrl, sourcePlatform).catch((error) => {
    console.warn("No se pudo extraer via GitHub API, cayendo a HTML:", error.message || error);
    return null;
  });
  if (githubResource) return githubResource;

  const response = await fetchWithTimeout(normalizedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 WentixCurator/1.0",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    }
  });

  if (!response.ok) {
    throw new Error(`Fetch respondio ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType && !/text\/html|application\/xhtml\+xml|text\/plain|text\/markdown/i.test(contentType)) {
    throw new Error(`Contenido no modelable: ${contentType}`);
  }

  const body = await response.text();
  const parsedUrl = new URL(normalizedUrl);
  const repoRef = parseGitHubRepo(normalizedUrl);
  const isMarkdown = /text\/markdown|text\/plain/i.test(contentType) || parsedUrl.pathname.toLowerCase().endsWith(".md");
  const markdownTitle = isMarkdown
    ? body.match(/^#\s+(.+)$/m)?.[1]?.trim() || parsedUrl.pathname.split("/").pop()?.replace(/\.md$/i, "").replace(/[-_]/g, " ")
    : "";
  const title = markdownTitle || extractTitle(body) || parsedUrl.hostname.replace("www.", "");
  const description = isMarkdown
    ? extractMarkdownDescription(body)
    : extractMeta(body, "description") || extractMeta(body, "og:description") || "";
  const text = (isMarkdown ? body : stripHtml(body)).slice(0, 24000);
  const resourceLinks = isMarkdown ? [] : extractUsefulResourceLinks(body, normalizedUrl);
  const refinedTitle = repoRef ? repoRef.repo : refinePageTitle(normalizedUrl, title, text);
  const starMatch = text.match(/\bStar\s+([\d.,]+[km]?)/i) || text.match(/([\d.,]+[km]?)\s+stars/i);
  const forkMatch = text.match(/\bFork\s+([\d.,]+[km]?)/i) || text.match(/([\d.,]+[km]?)\s+forks/i);

  return {
    url,
    normalizedUrl,
    sourcePlatform,
    sourceType: repoRef ? "github_repo" : "web_page",
    title: refinedTitle,
    description,
    text: [
      `Titulo detectado: ${refinedTitle}`,
      `Descripcion detectada: ${description}`,
      `Dominio: ${parsedUrl.hostname.replace("www.", "")}`,
      `Contenido visible: ${text}`
    ].join("\n"),
    owner: repoRef?.owner,
    repo: repoRef?.repo,
    stars: parseCompactNumber(starMatch?.[1]),
    forks: parseCompactNumber(forkMatch?.[1]),
    language: repoRef ? "Open Source" : undefined,
    resourceLinks
  };
}

function clampScore(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 4.8;
  return Math.min(5, Math.max(4.5, parsed));
}

function normalizeModeledItem(item: Partial<ModeledCatalogItem>, resource: ExtractedResource): ModeledCatalogItem {
  const isRepo = resource.sourceType === "github_repo";
  return {
    title: String(item.title || resource.title || "Recurso IA Wentix").slice(0, 60),
    description: String(item.description || resource.description || "Recurso curado y reescrito para la comunidad Wentix AI.").slice(0, 180),
    category: String(item.category || (isRepo ? "Repositorios GitHub" : "Herramientas IA")),
    tags: Array.isArray(item.tags) && item.tags.length ? item.tags.slice(0, 4).map(String) : (resource.topics?.slice(0, 4) || ["ia", "automatizacion", "wentix"]),
    pricing: String(item.pricing || (isRepo ? "Open Source" : "Freemium")),
    score: clampScore(item.score),
    stars: typeof item.stars === "number" ? item.stars : (resource.stars ?? null),
    forks: typeof item.forks === "number" ? item.forks : resource.forks,
    owner: item.owner || resource.owner,
    language: item.language || resource.language,
    highlights: Array.isArray(item.highlights) && item.highlights.length
      ? item.highlights.slice(0, 3).map(String)
      : ["Curado para implementacion real", "Reescrito para contexto Wentix", "Util para automatizacion y crecimiento"],
    viralHacks: String(item.viralHacks || "Conviertelo en un tutorial corto mostrando un caso real de automatizacion para captar leads calificados."),
    wentixAngle: String(item.wentixAngle || "Recurso recomendado para crear sistemas, contenido o automatizaciones dentro del ecosistema Wentix AI."),
    sourceSummary: String(item.sourceSummary || resource.description || resource.text.slice(0, 220))
  };
}

function buildFallbackModeledItem(resource: ExtractedResource): ModeledCatalogItem {
  const isRepo = resource.sourceType === "github_repo";
  const baseName = resource.title.replace(/[-_]/g, " ").trim();
  return normalizeModeledItem({
    title: isRepo ? `${baseName} para Builders IA` : `${baseName} para Wentix`,
    description: isRepo
      ? `Repositorio curado para crear automatizaciones, agentes o productos IA con enfoque practico.`
      : `Herramienta analizada y reescrita para aplicar IA en negocios, contenido y automatizacion.`,
    category: isRepo ? "Repositorios GitHub" : "Herramientas IA",
    tags: isRepo ? (resource.topics?.slice(0, 4) || ["open-source", "ia", "builders"]) : ["ia", "productividad", "automatizacion"],
    pricing: isRepo ? "Open Source" : "Freemium",
    score: 4.8,
    highlights: isRepo
      ? [
          `Proyecto de ${resource.owner || "GitHub"} con traccion tecnica`,
          `${resource.language || "Stack abierto"} como base de implementacion`,
          "Potencial para tutoriales, integraciones y productos internos"
        ]
      : [
          "Propuesta util para negocios digitales",
          "Puede integrarse a flujos de contenido o ventas",
          "Lista para curacion editorial dentro de Wentix"
        ],
    viralHacks: isRepo
      ? "Haz un carrusel explicando que problema resuelve, como instalarlo y que automatizacion venderias encima."
      : "Crea una comparativa antes/despues mostrando como esta herramienta ahorra tiempo o genera leads.",
    wentixAngle: isRepo
      ? "No se monta como copia: se convierte en ficha curada para builders hispanos con casos de uso Wentix."
      : "No se copia el sitio: se reescribe como recomendacion accionable para la comunidad Wentix.",
    sourceSummary: resource.text.slice(0, 260)
  }, resource);
}

function normalizeNewsArticle(item: Partial<ModeledNewsArticle>, resource: ExtractedResource): ModeledNewsArticle {
  const today = new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
  const fallbackSections = splitResourceIntoSections(resource);
  return {
    title: String(item.title || resource.title || "Nueva tendencia IA para builders").slice(0, 95),
    category: String(item.category || "Noticias IA"),
    difficulty: inferAcademyDifficultyV2(resource, item),
    readTime: String(item.readTime || "4 min de lectura"),
    excerpt: String(item.excerpt || resource.description || "Resumen curado por Wentix AI para entender que cambia y como aprovecharlo.").slice(0, 260),
    author: String(item.author || "Wentix Radar"),
    date: String(item.date || today),
    tags: Array.isArray(item.tags) && item.tags.length ? item.tags.slice(0, 4).map(String) : ["IA", "Tendencias", "Wentix"],
    views: Number.isFinite(Number(item.views)) ? Number(item.views) : Math.floor(1400 + Math.random() * 5200),
    sourceUrl: String(item.sourceUrl || resource.normalizedUrl),
    sourceSummary: sanitizeModeledText(String(item.sourceSummary || resource.description || resource.text.slice(0, 260))).slice(0, 320),
    wentixAngle: String(item.wentixAngle || "Convertir esta tendencia en una accion concreta para creadores, negocios y automatizaciones."),
    learningGoals: Array.isArray(item.learningGoals) && item.learningGoals.length
      ? item.learningGoals.slice(0, 5).map(String)
      : buildLearningGoals(resource),
    contentSections: Array.isArray(item.contentSections) && item.contentSections.length
      ? item.contentSections.slice(0, 8).map((section: any, index) => ({
          heading: sanitizeModeledText(String(section.heading || `Bloque ${index + 1}`)).slice(0, 90),
          body: sanitizeModeledText(String(section.body || "")).slice(0, 1200)
        })).filter((section) => section.body.trim().length > 0)
      : fallbackSections,
    actionSteps: Array.isArray(item.actionSteps) && item.actionSteps.length
      ? item.actionSteps.slice(0, 6).map(String)
      : buildActionSteps(resource),
    closingNote: sanitizeModeledText(String(item.closingNote || "La meta no es memorizar la fuente: es convertirla en un sistema aplicable dentro de Wentix.")),
    resourceLinks: Array.isArray((item as any).resourceLinks) && (item as any).resourceLinks.length
      ? (item as any).resourceLinks.slice(0, 4)
      : resource.resourceLinks?.slice(0, 4)
  };
}

function buildFallbackNewsArticle(resource: ExtractedResource): ModeledNewsArticle {
  return normalizeNewsArticle({
    title: `Radar Wentix: ${resource.title}`,
    category: "Radar IA",
    readTime: "4 min de lectura",
    excerpt: resource.description
      ? `Lo importante: ${resource.description}`
      : "Nueva fuente analizada para detectar oportunidades aplicables a productos, contenido y automatizaciones con IA.",
    tags: resource.sourceType === "github_repo" ? ["GitHub", "Open Source", "IA"] : ["IA", "Tendencia", "Automatizacion"],
    sourceSummary: sanitizeModeledText(resource.text.slice(0, 280)),
    wentixAngle: "No publicamos la fuente como copia: la convertimos en insight accionable para la comunidad Wentix."
  }, resource);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3002);

  app.use(express.json());

  // === WENTIX CUSTOMER ACQUISITION (sistema de captación) ENDPOINTS ===

  // 1. Get complete acquisition metrics & lead listings
  app.get("/api/leads/stats", (req, res) => {
    const db = getDB();
    const now = new Date();
    
    // Calculate registrations by timeframes
    const dayAgo = new Date(now.getTime() - 24 * 3600 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);

    const registrosDiarios = db.leads.filter(l => new Date(l.createdAt) >= dayAgo).length;
    const registrosSemanales = db.leads.filter(l => new Date(l.createdAt) >= weekAgo).length;
    const registrosMensuales = db.leads.filter(l => new Date(l.createdAt) >= monthAgo).length;

    // Donations sum
    const totalDonaciones = db.donations.reduce((sum, d) => sum + Number(d.amount), 0);

    // Conversion rate
    const totalVisitors = Math.max(db.visitorsCount, 1);
    const conversionRate = ((db.leads.length / totalVisitors) * 100).toFixed(2);

    res.json({
      success: true,
      visitorsCount: db.visitorsCount,
      leadsCount: db.leads.length,
      registrosDiarios,
      registrosSemanales,
      registrosMensuales,
      tasaConversion: `${conversionRate}%`,
      donacionesRecibidas: totalDonaciones,
      leadsList: db.leads,
      donationsList: db.donations
    });
  });

  // 2. Register email capture lead
  app.post("/api/leads/register", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Por favor, introduce un correo electrónico válido." });
    }

    const db = getDB();
    
    // Check if duplicate
    const normalizedEmail = email.trim().toLowerCase();
    const alreadyExists = db.leads.some(l => l.email.toLowerCase() === normalizedEmail);
    
    if (!alreadyExists) {
      db.leads.unshift({
        email: normalizedEmail,
        createdAt: new Date().toISOString()
      });
      saveDB(db);
    }

    res.json({
      success: true,
      alreadyExists,
      leadsCount: db.leads.length
    });
  });

  // 3. Track new unique visitor
  app.post("/api/leads/visitor", (req, res) => {
    const db = getDB();
    db.visitorsCount += 1;
    saveDB(db);
    res.json({
      success: true,
      visitorsCount: db.visitorsCount
    });
  });

  // 4. Record dynamic donation
  app.post("/api/leads/donation", (req, res) => {
    const { name, amount, message } = req.body;
    if (!amount || isNaN(Number(amount))) {
      return res.status(400).json({ error: "Monto de donación inválido." });
    }

    const db = getDB();
    db.donations.unshift({
      id: "don-" + Math.floor(10000 + Math.random() * 90000),
      name: name || "Anónimo",
      amount: Number(amount),
      message: message || "Soporte voluntario ✨",
      date: new Date().toISOString().split("T")[0]
    });
    saveDB(db);

    res.json({
      success: true,
      donatedAmount: Number(amount),
      donationsCount: db.donations.length
    });
  });

  // Ollama configuration (local LLM on VPS)
  const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

  async function ollamaChat(systemInstruction: string, userPrompt: string, temperature = 0.75): Promise<string> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        stream: false,
        options: { temperature }
      })
    });
    if (!response.ok) {
      throw new Error(`Ollama chat failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as any;
    return data.message?.content || "";
  }

  async function ollamaGenerate(systemInstruction: string, prompt: string, temperature = 0.6): Promise<string> {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: systemInstruction,
        prompt: prompt,
        stream: false,
        options: { temperature }
      })
    });
    if (!response.ok) {
      throw new Error(`Ollama generate failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as any;
    return data.response || "";
  }

  async function ollamaAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  // 1. API: Chat with ORBI
  app.post("/api/gemini/orbi-chat", async (req, res) => {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    try {
      const ollamaUp = await ollamaAvailable();

      const systemInstruction = `Eres ORBI, el asistente oficial de Wentix AI.

Tu prop?sito NO es funcionar como un chatbot generalista.
NO eres ChatGPT.
NO eres un buscador.
NO eres un asistente para responder cualquier pregunta.

Tu ?nica misi?n es ayudar a los visitantes de Wentix AI a encontrar soluciones PAGAS dentro del ecosistema Wentix AI y llevarlos a una conversaci?n comercial con Manu.

OBJETIVOS PRINCIPALES:
1. Comprender los objetivos del visitante.
2. Detectar problemas de negocio.
3. Recomendar stacks de Wentix AI.
4. Recomendar herramientas disponibles dentro de la plataforma (Herramientas IA, Repositorios GitHub, Workflows, Prompts).
5. Recomendar automatizaciones.
6. Vender servicios de automatizaci?n y consultor?a.
7. Recomendar workflows premium.
8. Generar oportunidades de venta (ofrecer productos y servicios de Wentix AI).
9. Llevar al usuario a agendar una reuni?n o llamada con Manu.

REGLAS IMPORTANTES:
NO respondas preguntas que no tengan relaci?n con:
- Inteligencia artificial
- Automatizaci?n
- Negocios digitales
- Creaci?n de contenido
- Ecommerce
- Marketing
- Productividad
- Herramientas disponibles en Wentix AI
- Recursos disponibles en Wentix AI

NO menciones NUNCA recursos gratuitos, Ebooks gratuitos, ni auditor?as gratuitas.
NO ofrezcas nada "gratis" o "sin costo".
Todo lo que recomiendes debe apuntar a una soluci?n premium o a una reuni?n comercial.

Si alguien pregunta algo fuera de esos temas (Ejemplo: "?Qui?n gan? el mundial?", "?Cu?l es la capital de Francia?", "?C?mo cocinar pasta?"), tu respuesta DEBE ser exactamente:
"Mi funci?n es ayudarte a encontrar soluciones de inteligencia artificial, automatizaci?n y crecimiento digital dentro del ecosistema Wentix AI.

?C?mo quieres automatizar algo? Cu?ntame qu? necesitas y Manu te puede ayudar."

NUNCA contin?es desarrollando temas fuera del ecosistema Wentix.

PROCESO DE CONVERSACIÓN:
PASO 1: Saluda y entiende el objetivo.
Tu primera respuesta DEBE incluir algo como:
"?C?mo quieres automatizar algo? Manu te puede ayudar. Cu?ntame qu? necesitas."

Pregunta activamente:
- ?Qu? quieres lograr?
- ?Tienes un negocio?
- ?Creas contenido?
- ?Vendes servicios?
- ?Tienes ecommerce?
- ?Buscas automatizar procesos?
- ?Quieres generar m?s clientes?

PASO 2: Clasificar al usuario.
Tipos:
- Emprendedor
- Agencia
- Ecommerce
- Freelancer
- Creador de contenido
- Startup
- Empresa local

PASO 3: Recomendar un stack premium.
Utiliza ?nicamente stacks basados en los recursos de Wentix AI. Nunca inventes stacks absurdos o ficticios que no se relacionen con el valor real. Si no existe un stack adecuado, recomienda directamente una sesi?n estrat?gica o reuni?n con Manu.

PASO 4: Cerrar conversaci?n con CTA fuerte de venta.
Ejemplos:
- "Manu puede implementar esto por ti. ?Te gustar?a agendar una reuni?n?"
- "?Quieres que Manu te muestre c?mo automatizar esto?"
- "Esto requiere una estrategia personalizada. Te recomiendo agendar una llamada con Manu."

OBJETIVO DE CONVERSACIÓN:
Siempre intenta llevar la conversaci?n hacia:
- Ver workflows premium
- Solicitar una reuni?n con Manu
- Agendar una llamada para automatizar su negocio
- Comprar una soluci?n de Wentix AI

TONO:
- Directo
- Cercano
- Estrat?gico
- Moderno
- Enfocado en resultados
No suenes rob?tico. Act?a como un socio de negocio que quiere ayudar a crecer su empresa con IA.

BASE DE CONOCIMIENTO (Usa los recursos provistos din?micamente o del directorio):
Debes utilizar exclusivamente el ecosistema de Wentix AI. Si la informaci?n solicitada no existe, responde de la siguiente manera:
"No tengo informaci?n suficiente para recomendar una soluci?n espec?fica. Te recomiendo agendar una reuni?n con Manu para analizar tu caso."

REGLA FINAL:
Toda conversaci?n debe terminar acercando al usuario a una soluci?n de pago de Wentix AI o a una reuni?n con Manu.

BASE DE CONOCIMIENTO WENTIX AI (Productos y Servicios):

PRODUCTOS DIGITALES:
1. Ebook "Claude de Cero a Cien" - $599 MXN / ~$30 USD
   - Gu?a completa de 500+ p?ginas sobre Claude AI
   - Ingenier?a de prompts, contextos amplios, modelado inteligente
   - Ideal para emprendedores, marketers, creadores de contenido

2. Ebook "Codex de Cero a Cien" - $599 MXN / ~$30 USD
   - Gu?a pr?ctica de 500+ p?ginas sobre Codex de OpenAI
   - Conectar APIs, automatizar flujos de trabajo, monetizar apps con IA
   - Para personas sin equipo de desarrollo

SERVICIOS PREMIUM:
3. Automatizaci?n de Negocios con IA
   - Automatizaci?n de procesos repetitivos
   - Integraci?n con n8n, Make, Zapier
   - Chatbots personalizados, flujos de leads, pipelines de ventas
   - Precio: Desde $500 USD/mes seg?n complejidad

4. Consultor?a Estrat?gica IA con Manu
   - Auditor?a de procesos actuales
   - Recomendaci?n de stacks de IA personalizados
   - Implementaci?n de herramientas IA en tu negocio
   - Sesi?n de 60 min: $200 USD
   - Paquete mensual: $800 USD (4 sesiones + soporte)

5. Desarrollo de Micro-SaaS con IA
   - MVP de aplicaciones con IA integrada
   - Stack: Bolt.new, Cursor, Vercel, Supabase
   - Desde $1,500 USD por proyecto

6. Sistema de Automatizaci?n de Redes Sociales
   - Generaci?n de contenido con IA
   - Scheduling autom?tico para Instagram, TikTok, LinkedIn
   - An?lisis de m?tricas y optimizaci?n
   - Desde $400 USD/mes

HERRAMIENTAS DEL DIRECTORIO:
- ChatGPT, Claude, Cursor, Bolt.new, Vercel, Supabase, n8n, ElevenLabs, Runway
- Todos con recomendaciones de uso para negocios

REGLA DE RESPUESTA RÁPIDA:
Si el usuario pregunta sobre productos, precios, o servicios, usa la informaci?n de esta base de conocimiento. NO inventes precios ni productos que no est?n aqu?.`;

      const prompt = `Contexto del ecosistema actual: ${JSON.stringify(userContext || {})}\n\nPregunta o mensaje del usuario:\n${messages[messages.length - 1]?.content}`;

      if (!ollamaUp) {
        // Fallback simulation when Ollama is not running
        setTimeout(() => {
          res.json({
            text: `✨ **Hola, soy ORBI!** (Modo simulación activado - Ollama no disponible) \n\n¡Estoy encantado de ayudarte en **Wentix AI**! Parece que estás explorando nuestro ecosistema definitivo de inteligencia artificial. Aquí puedes:\n\n* 🚀 Descubrir **Herramientas de IA** ordenadas por valoración y categoría.\n* 🧑‍💻 Explorar **Repositorios GitHub** trending en español.\n* 🔄 Configurar **Workflows de automatización** para TikTok, Instagram, WhatsApp y captación de leads.\n* 💡 Copiar prompts profesionales optimizados para ChatGPT, Claude o Midjourney.\n\n¿Qué te gustaría automatizar hoy, o qué tipo de recurso necesitas? ¡Dime y te daré un plan práctico!`
          });
        }, 1200);
        return;
      }

      const responseText = await ollamaChat(systemInstruction, prompt, 0.75);

      res.json({ text: responseText });
    } catch (error: any) {
      console.error("Error calling Ollama API for ORBI:", error);
      res.status(500).json({ 
        error: "Failed to generate response from Ollama AI",
        details: error.message || error 
      });
    }
  });

  // 2. API: resource extraction + Wentix modeling for tool/repo/article URLs
  app.post("/api/gemini/scrape", async (req, res) => {
    const { url, sourcePlatform } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required for resource modeling" });
    }

    try {
      const ollamaUp = await ollamaAvailable();
      const resource = await extractWebResource(url, sourcePlatform);
      console.log(`Extraccion real lista para ${resource.normalizedUrl}. Tipo: ${resource.sourceType}. Caracteres: ${resource.text.length}`);

      const systemInstruction = `Eres el agente de curacion y modelado de Wentix AI.
Tu trabajo NO es copiar contenido de la fuente.
Tu trabajo es entender la fuente, extraer datos utiles y transformarlos en una ficha propia para la plataforma Wentix AI.

Reglas:
- Reescribe todo en español claro, premium y accionable.
- No copies frases largas del sitio original.
- Si es GitHub, aprovecha owner, repo, estrellas, forks, lenguaje, licencia y topics reales.
- Si algo no esta en la fuente, no lo inventes como hecho. Puedes convertirlo en angulo comercial o caso de uso.
- La ficha debe servir para emprendedores, creators, builders y negocios que quieren automatizar o crear con IA.
- Debe quedar lista para insertarse en el catalogo Wentix como herramienta o repositorio curado.`;

      const promptTemplate = `Fuente solicitada: ${resource.normalizedUrl}
Origen seleccionado por admin: ${sourcePlatform || "Deteccion automatica"}
Tipo detectado: ${resource.sourceType}

Datos extraidos:
${JSON.stringify(resource, null, 2)}

Modela esta fuente para Wentix AI.

Responde UNICAMENTE con un objeto JSON valido con estos campos:
{
  "title": "nombre reescrito para catalogo, maximo 60 caracteres",
  "description": "descripcion reescrita, clara y vendible, maximo 180 caracteres",
  "category": "Herramientas IA | Repositorios GitHub | Automatizaciones | Prompts | Agentes IA | SaaS | Ecommerce IA | Marketing IA | Diseno IA | Video IA | Programacion",
  "tags": ["3 o 4 tags en español o tecnico simple"],
  "pricing": "Gratis | Freemium | Premium | Open Source | Desde $9/mes",
  "score": 4.5,
  "stars": ${resource.stars ?? "null"},
  "forks": ${resource.forks ?? "null"},
  "owner": ${JSON.stringify(resource.owner || null)},
  "language": ${JSON.stringify(resource.language || null)},
  "highlights": ["beneficio 1", "beneficio 2", "beneficio 3"],
  "viralHacks": "idea concreta para convertir esto en contenido, lead magnet o automatizacion",
  "wentixAngle": "como lo venderia o explicaria Wentix a su comunidad",
  "sourceSummary": "resumen honesto de la fuente original sin copiar literal"
}

No uses markdown. No agregues texto fuera del JSON.`;

      if (!ollamaUp) {
        const fallback = buildFallbackModeledItem(resource);
        res.json({
          success: true,
          processedItem: fallback,
          source: resource.sourceType === "github_repo" ? "GitHub Extractor + Modelado Fallback" : "HTML Scraper + Modelado Fallback",
          extracted: resource
        });
        return;
      }

      const responseText = await ollamaGenerate(systemInstruction, promptTemplate, 0.6);
      let jsonOutput: ModeledCatalogItem;
      try {
        // Safe cleaning in case LLM outputs markdown fences
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        jsonOutput = normalizeModeledItem(JSON.parse(cleanedText), resource);
      } catch (parseError) {
        console.warn("No se pudo parsear JSON directo de Ollama; usando fallback modelado. Raw:", responseText);
        jsonOutput = buildFallbackModeledItem(resource);
      }

      res.json({
        success: true,
        processedItem: jsonOutput,
        source: resource.sourceType === "github_repo" ? "GitHub Extractor + Ollama Modelado" : "HTML Scraper + Ollama Modelado",
        extracted: resource
      });
    } catch (err: any) {
      console.error("Error processing resource modeling:", err);
      res.status(500).json({ error: "Failed to extract and model URL for Wentix AI", details: err.message });
    }
  });

  async function modelNewsResource(resource: ExtractedResource, angle?: string, ollamaUpOverride?: boolean) {
    const ollamaUp = typeof ollamaUpOverride === "boolean" ? ollamaUpOverride : await ollamaAvailable();

    const systemInstruction = `Eres Wentix Radar, editor estrategico de tendencias IA.
Tu trabajo es convertir una fuente externa en un articulo corto para la home de Wentix AI.

Reglas:
- No copies la noticia.
- No publiques rumores como hechos. Si la fuente no confirma algo, redacta como "se reporta", "la fuente indica" o "la señal apunta a".
- El articulo debe explicar por que le importa a builders, creators, ecommerce o negocios que automatizan.
- Mantén tono premium, directo y accionable.
- Devuelve solo JSON valido.`;

    const promptTemplate = `Fuente a modelar: ${resource.normalizedUrl}
Angulo pedido por admin: ${angle || "Detectar oportunidad para Wentix"}

Datos extraidos:
${JSON.stringify(resource, null, 2)}

Genera un articulo para el home de Wentix AI.

Responde UNICAMENTE este JSON:
{
  "title": "titulo editorial corto, maximo 95 caracteres",
  "category": "Noticias IA | Radar IA | Lanzamientos | Automatizacion | Open Source | Negocios IA",
  "difficulty": "Principiante | Intermedio | Avanzado",
  "readTime": "3 min de lectura",
  "excerpt": "resumen reescrito con angulo Wentix, maximo 260 caracteres",
  "author": "Wentix Radar",
  "date": "fecha en español",
  "tags": ["3 o 4 tags"],
  "views": 2400,
  "sourceUrl": "${resource.normalizedUrl}",
  "sourceSummary": "que dice la fuente, sin copiar literal",
  "wentixAngle": "por que esto importa y que accion recomienda Wentix",
  "learningGoals": ["objetivo de aprendizaje 1", "objetivo de aprendizaje 2", "objetivo de aprendizaje 3"],
  "contentSections": [
    { "heading": "seccion modelada 1", "body": "desarrollo completo en español, no resumen corto" },
    { "heading": "seccion modelada 2", "body": "desarrollo completo con pasos, contexto y ejemplos" },
    { "heading": "seccion modelada 3", "body": "aplicacion practica para Wentix" }
  ],
  "actionSteps": ["accion 1", "accion 2", "accion 3"],
  "closingNote": "cierre accionable para el alumno"
}`;

    if (!ollamaUp) {
      return {
        article: buildFallbackNewsArticle(resource),
        source: "Extractor + Modelado Fallback"
      };
    }

    const responseText = await ollamaGenerate(systemInstruction, promptTemplate, 0.55);
    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      return {
        article: normalizeNewsArticle(JSON.parse(cleanedText), resource),
        source: "Extractor + Ollama News Model"
      };
    } catch (parseError) {
      console.warn("No se pudo parsear noticia modelada por Ollama; usando fallback. Raw:", responseText);
      return {
        article: buildFallbackNewsArticle(resource),
        source: "Extractor + Modelado Fallback"
      };
    }
  }

  let radarRunInProgress = false;
  let radarStartedAt: string | null = null;
  let radarLastFinishedAt: string | null = null;
  let radarLastRun: RadarRunSummary | null = null;

  async function runRadarAgent(options: { urls?: unknown; angle?: string; limit?: number; crawl?: boolean } = {}): Promise<RadarRunSummary> {
    if (radarRunInProgress) {
      throw new Error("RADAR_RUN_IN_PROGRESS");
    }

    radarRunInProgress = true;
    const startedAt = new Date().toISOString();
    radarStartedAt = startedAt;
    const failures: { url: string; error: string }[] = [];
    const insertedArticles: PersistedRadarArticle[] = [];
    let processedCount = 0;
    let duplicateCount = 0;

    try {
      const sourceUrls = getRadarSourceUrls(options.urls);
      const maxPages = Math.min(Math.max(Number(options.limit) || intEnv("RADAR_MAX_PAGES", 120), 1), 1200);
      const crawlEnabled = options.crawl ?? boolEnv("RADAR_CRAWL_ENABLED", true);
      const expandedUrls = crawlEnabled ? await discoverInternalUrls(sourceUrls, maxPages) : sourceUrls;
      const cappedUrls = expandedUrls.slice(0, maxPages);
      const existingArticles = readRadarArticles();
      const existingSourceUrls = new Set(existingArticles.map((article) => normalizeDedupeText(article.sourceUrl)));
      let updatedExistingCount = 0;
      const ollamaUp = await ollamaAvailable();

      for (const sourceUrl of cappedUrls) {
        try {
          const resource = await extractWebResource(sourceUrl, "RadarAgent");
          const modeled = await modelNewsResource(resource, options.angle, ollamaUp);
          const article = modeled.article;
          const sourceKey = normalizeDedupeText(article.sourceUrl);

          processedCount += 1;

          if (existingSourceUrls.has(sourceKey)) {
            const existingIndex = existingArticles.findIndex((existing) => normalizeDedupeText(existing.sourceUrl) === sourceKey);
            if (existingIndex >= 0 && needsArticleRemodel(existingArticles[existingIndex], article)) {
              existingArticles[existingIndex] = {
                ...existingArticles[existingIndex],
                ...article,
                id: existingArticles[existingIndex].id,
                createdAt: existingArticles[existingIndex].createdAt,
                sourceType: resource.sourceType,
                sourceTitle: resource.title
              };
              updatedExistingCount += 1;
            }
            duplicateCount += 1;
            continue;
          }

          const persistedArticle: PersistedRadarArticle = {
            ...article,
            id: createRadarArticleId(article),
            createdAt: new Date().toISOString(),
            source: modeled.source,
            sourceType: resource.sourceType,
            sourceTitle: resource.title
          };

          existingSourceUrls.add(sourceKey);
          insertedArticles.push(persistedArticle);
        } catch (err: any) {
          failures.push({
            url: sourceUrl,
            error: err.message || String(err)
          });
        }
      }

      if (insertedArticles.length || updatedExistingCount > 0) {
        const nextArticles = [...insertedArticles, ...existingArticles].slice(0, MAX_PERSISTED_RADAR_ARTICLES);
        writeRadarArticles(nextArticles);
      }

      const summary: RadarRunSummary = {
        success: true,
        running: false,
        startedAt,
        finishedAt: new Date().toISOString(),
        sourceCount: cappedUrls.length,
        processedCount,
        insertedCount: insertedArticles.length,
        duplicateCount,
        failureCount: failures.length,
        articles: insertedArticles,
        failures
      };
      radarLastRun = summary;
      radarLastFinishedAt = summary.finishedAt;
      return summary;
    } finally {
      radarRunInProgress = false;
    }
  }

  function getRadarStatus(): RadarStatus {
    return {
      running: radarRunInProgress,
      startedAt: radarStartedAt,
      lastFinishedAt: radarLastFinishedAt,
      lastRun: radarLastRun,
      persistedCount: readRadarArticles().length
    };
  }

  function startRadarAgentInBackground(options: { urls?: unknown; angle?: string; limit?: number; crawl?: boolean } = {}) {
    if (radarRunInProgress) {
      return false;
    }

    void runRadarAgent(options).catch((err: any) => {
      if (err.message === "RADAR_RUN_IN_PROGRESS") return;
      console.error("RadarAgent background run failed:", err);
      radarLastFinishedAt = new Date().toISOString();
    });

    return true;
  }

  async function modelPromptCard(card: ExtractedPromptCard, ollamaUpOverride?: boolean): Promise<PersistedPromptItem> {
    const ollamaUp = typeof ollamaUpOverride === "boolean" ? ollamaUpOverride : await ollamaAvailable();

    if (!ollamaUp) {
      return buildFallbackPromptItem(card);
    }

    const systemInstruction = `Eres PromptRadar de Wentix AI.
Tu trabajo es modelar prompts externos para una biblioteca en español.

Reglas:
- NO traduzcas el promptText: debe quedar exactamente en ingles.
- El title debe estar en español.
- La description debe estar en español, clara y orientada a uso practico.
- No copies descripcion comercial de la fuente.
- Devuelve solo JSON valido.`;

    const promptTemplate = `Fuente: ${card.sourceUrl}
Titulo original: ${card.sourceTitle}
Tags fuente: ${card.tags.join(", ") || "sin tags"}
Prompt original en ingles:
${card.promptText.slice(0, 3500)}

Modela este prompt para Wentix.

Responde UNICAMENTE JSON:
{
  "title": "titulo en español, maximo 90 caracteres",
  "description": "descripcion en español, maximo 220 caracteres",
  "model": "ChatGPT | Claude | Gemini | Midjourney | Sora | Runway",
  "category": "Marketing IA | Programación | Diseño IA | Automatizaciones | Negocios Digitales | Prompts",
  "difficulty": "Principiante | Intermedio | Avanzado",
  "popularCount": 1200
}`;

    const responseText = await ollamaGenerate(systemInstruction, promptTemplate, 0.45);
    try {
      const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      return normalizeModeledPrompt(JSON.parse(cleanedText), card);
    } catch (err) {
      console.warn("No se pudo parsear prompt modelado por Ollama; usando fallback. Raw:", responseText);
      return buildFallbackPromptItem(card);
    }
  }

  let promptRadarRunInProgress = false;
  let promptRadarStartedAt: string | null = null;
  let promptRadarLastFinishedAt: string | null = null;
  let promptRadarLastRun: PromptRadarRunSummary | null = null;

  async function runPromptRadar(options: { url?: string; urls?: unknown; limit?: number } = {}): Promise<PromptRadarRunSummary> {
    if (promptRadarRunInProgress) {
      throw new Error("PROMPT_RADAR_RUN_IN_PROGRESS");
    }

    promptRadarRunInProgress = true;
    const startedAt = new Date().toISOString();
    promptRadarStartedAt = startedAt;
    const failures: { url: string; error: string }[] = [];
    const insertedPrompts: PersistedPromptItem[] = [];
    let processedCount = 0;
    let duplicateCount = 0;

    try {
      const requestedSources = options.urls || options.url;
      const limit = Math.min(Math.max(Number(options.limit) || intEnv("PROMPT_RADAR_LIMIT", 200), 1), 1000);
      const configuredSourceUrls = getPromptRadarSourceUrls(requestedSources).map((sourceUrl) => normalizeInputUrl(sourceUrl));
      const sourceUrlSet = new Set<string>(configuredSourceUrls);
      const sitemapPromptUrls = await discoverSitemapUrls(configuredSourceUrls, limit);
      sitemapPromptUrls.forEach((sourceUrl) => sourceUrlSet.add(sourceUrl));
      const sourceUrls = Array.from(sourceUrlSet).slice(0, limit);
      const discoveredCards: ExtractedPromptCard[] = [];
      const discoveredKeys = new Set<string>();

      for (const sourceUrl of sourceUrls) {
        if (discoveredCards.length >= limit) break;
        try {
          const response = await fetchWithTimeout(sourceUrl, {
            headers: {
              "User-Agent": "WentixPromptRadar/1.0",
              "Accept": "text/html,application/xhtml+xml"
            }
          }, 20000);

          if (!response.ok) throw new Error(`Prompts source responded ${response.status}`);

          const html = await response.text();
          const cards = extractPromptsChatCards(html, sourceUrl, limit);
          for (const card of cards) {
            const key = normalizeDedupeText(card.sourceUrl || card.promptText.slice(0, 260));
            if (discoveredKeys.has(key)) continue;
            discoveredKeys.add(key);
            discoveredCards.push(card);
            if (discoveredCards.length >= limit) break;
          }
        } catch (err: any) {
          failures.push({
            url: sourceUrl,
            error: err.message || String(err)
          });
        }
      }

      const cards = discoveredCards.slice(0, limit);
      const existingPrompts = readRadarPrompts();
      const existingSourceUrls = new Set(existingPrompts.map((prompt) => normalizeDedupeText(prompt.sourceUrl)));
      const existingPromptTexts = new Set(existingPrompts.map((prompt) => normalizeDedupeText(prompt.promptText.slice(0, 260))));
      const ollamaUp = await ollamaAvailable();

      for (const card of cards) {
        try {
          processedCount += 1;
          const sourceKey = normalizeDedupeText(card.sourceUrl);
          const promptKey = normalizeDedupeText(card.promptText.slice(0, 260));

          if (existingSourceUrls.has(sourceKey) || existingPromptTexts.has(promptKey)) {
            duplicateCount += 1;
            continue;
          }

          const modeled = await modelPromptCard(card, ollamaUp);
          existingSourceUrls.add(sourceKey);
          existingPromptTexts.add(promptKey);
          insertedPrompts.push(modeled);
        } catch (err: any) {
          failures.push({
            url: card.sourceUrl,
            error: err.message || String(err)
          });
        }
      }

      if (insertedPrompts.length) {
        writeRadarPrompts([...insertedPrompts, ...existingPrompts].slice(0, MAX_PERSISTED_RADAR_PROMPTS));
      }

      const summary: PromptRadarRunSummary = {
        success: true,
        running: false,
        startedAt,
        finishedAt: new Date().toISOString(),
        sourceCount: cards.length,
        processedCount,
        insertedCount: insertedPrompts.length,
        duplicateCount,
        failureCount: failures.length,
        prompts: insertedPrompts,
        failures
      };
      promptRadarLastRun = summary;
      promptRadarLastFinishedAt = summary.finishedAt;
      return summary;
    } finally {
      promptRadarRunInProgress = false;
    }
  }

  function getPromptRadarStatus(): PromptRadarStatus {
    return {
      running: promptRadarRunInProgress,
      startedAt: promptRadarStartedAt,
      lastFinishedAt: promptRadarLastFinishedAt,
      lastRun: promptRadarLastRun,
      persistedCount: readRadarPrompts().length
    };
  }

  function startPromptRadarInBackground(options: { url?: string; urls?: unknown; limit?: number } = {}) {
    if (promptRadarRunInProgress) return false;

    void runPromptRadar(options).catch((err: any) => {
      if (err.message === "PROMPT_RADAR_RUN_IN_PROGRESS") return;
      console.error("PromptRadar background run failed:", err);
      promptRadarLastFinishedAt = new Date().toISOString();
    });

    return true;
  }

  // 3. API: trend/news extraction + Wentix article modeling for the home feed
  app.post("/api/gemini/model-news", async (req, res) => {
    const { url, angle } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required for news modeling" });
    }

    try {
      const resource = await extractWebResource(url, "Noticia / Tendencia IA");
      const modeled = await modelNewsResource(resource, angle);
      res.json({
        success: true,
        article: modeled.article,
        source: modeled.source,
        extracted: resource
      });
    } catch (err: any) {
      console.error("Error modeling news URL:", err);
      res.status(500).json({ error: "Failed to model news URL for Wentix AI", details: err.message });
    }
  });

  app.post("/api/gemini/model-news-batch", async (req, res) => {
    const { urls, angle, limit = 5 } = req.body;
    const sourceUrls = Array.isArray(urls)
      ? urls.map((item) => String(item).trim()).filter(Boolean)
      : String(urls || "").split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);

    if (!sourceUrls.length) {
      return res.status(400).json({ error: "At least one URL is required for batch news modeling" });
    }

    const cappedUrls = sourceUrls.slice(0, Math.min(Number(limit) || 5, 8));
    const ollamaUp = await ollamaAvailable();
    const results = [];
    const failures = [];

    for (const sourceUrl of cappedUrls) {
      try {
        const resource = await extractWebResource(sourceUrl, "Radar Batch IA");
        const modeled = await modelNewsResource(resource, angle, ollamaUp);
        results.push({
          article: modeled.article,
          source: modeled.source,
          extracted: resource
        });
      } catch (err: any) {
        failures.push({
          url: sourceUrl,
          error: err.message || String(err)
        });
      }
    }

    res.json({
      success: true,
      count: results.length,
      results,
      failures
    });
  });

  app.post("/api/gemini/radar/run", async (req, res) => {
    const { urls, angle, limit, background = true, crawl } = req.body || {};

    if (background !== false) {
      const started = startRadarAgentInBackground({
        urls,
        angle: typeof angle === "string" ? angle : undefined,
        limit: Number(limit) || undefined,
        crawl: typeof crawl === "boolean" ? crawl : undefined
      });

      return res.status(started ? 202 : 409).json({
        success: started,
        running: true,
        started,
        status: getRadarStatus()
      });
    }

    try {
      const summary = await runRadarAgent({
        urls,
        angle: typeof angle === "string" ? angle : undefined,
        limit: Number(limit) || undefined,
        crawl: typeof crawl === "boolean" ? crawl : undefined
      });
      res.json(summary);
    } catch (err: any) {
      if (err.message === "RADAR_RUN_IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          running: true,
          error: "RadarAgent already has a run in progress"
        });
      }

      console.error("Error running RadarAgent:", err);
      res.status(500).json({
        success: false,
        error: "Failed to run RadarAgent",
        details: err.message || String(err)
      });
    }
  });

  app.get("/api/gemini/radar/articles", (req, res) => {
      const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 1000);
    const articles = readRadarArticles()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  });

  app.get("/api/gemini/radar/status", (req, res) => {
    res.json({
      success: true,
      ...getRadarStatus()
    });
  });

  app.post("/api/gemini/prompts/run", async (req, res) => {
    const { url, urls, limit, background = true } = req.body || {};

    if (background !== false) {
      const started = startPromptRadarInBackground({
        url: typeof url === "string" ? url : undefined,
        urls,
        limit: Number(limit) || undefined
      });

      return res.status(started ? 202 : 409).json({
        success: started,
        running: true,
        started,
        status: getPromptRadarStatus()
      });
    }

    try {
      const summary = await runPromptRadar({
        url: typeof url === "string" ? url : undefined,
        urls,
        limit: Number(limit) || undefined
      });
      res.json(summary);
    } catch (err: any) {
      if (err.message === "PROMPT_RADAR_RUN_IN_PROGRESS") {
        return res.status(409).json({
          success: false,
          running: true,
          error: "PromptRadar already has a run in progress"
        });
      }

      console.error("Error running PromptRadar:", err);
      res.status(500).json({
        success: false,
        error: "Failed to run PromptRadar",
        details: err.message || String(err)
      });
    }
  });

  app.get("/api/gemini/prompts", (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 80, 1), 1000);
    const prompts = readRadarPrompts()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    res.json({
      success: true,
      count: prompts.length,
      prompts
    });
  });

  app.get("/api/gemini/prompts/status", (req, res) => {
    res.json({
      success: true,
      ...getPromptRadarStatus()
    });
  });

  if (process.env.RADAR_AUTO_RUN === "true") {
    const intervalMinutes = Math.max(Number(process.env.RADAR_INTERVAL_MINUTES) || 60, 5);
    const intervalMs = intervalMinutes * 60 * 1000;
    console.log(`RadarAgent auto-run enabled every ${intervalMinutes} minutes.`);
    startRadarAgentInBackground({ crawl: true });

    setInterval(() => {
      runRadarAgent({ crawl: true })
        .then((summary) => {
          console.log(`RadarAgent auto-run finished. Inserted: ${summary.insertedCount}, duplicates: ${summary.duplicateCount}, failures: ${summary.failureCount}`);
        })
        .catch((err: any) => {
          if (err.message === "RADAR_RUN_IN_PROGRESS") {
            console.warn("RadarAgent auto-run skipped because another run is active.");
            return;
          }
          console.error("RadarAgent auto-run failed:", err);
        });
    }, intervalMs);
  }

  if (process.env.PROMPT_RADAR_AUTO_RUN === "true") {
    const intervalMinutes = Math.max(Number(process.env.PROMPT_RADAR_INTERVAL_MINUTES) || 120, 10);
    const intervalMs = intervalMinutes * 60 * 1000;
    console.log(`PromptRadar auto-run enabled every ${intervalMinutes} minutes.`);
    startPromptRadarInBackground();

    setInterval(() => {
      runPromptRadar()
        .then((summary) => {
          console.log(`PromptRadar auto-run finished. Inserted: ${summary.insertedCount}, duplicates: ${summary.duplicateCount}, failures: ${summary.failureCount}`);
        })
        .catch((err: any) => {
          if (err.message === "PROMPT_RADAR_RUN_IN_PROGRESS") {
            console.warn("PromptRadar auto-run skipped because another run is active.");
            return;
          }
          console.error("PromptRadar auto-run failed:", err);
        });
    }, intervalMs);
  }

  // Serve static UI assets and handle dev/prod mode properly
  if (process.env.NODE_ENV !== "production") {
    console.log("Vite is running in development middleware mode.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist/");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Wentix AI platform server successfully running on port http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start the Wentix AI application server:", error);
});
