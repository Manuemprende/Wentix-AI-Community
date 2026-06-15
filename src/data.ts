import { AITool, GitHubRepo, PromptItem, WorkflowItem, ResourceArticle, StackItem } from "./types";

export const CATEGORIES_LIST = [
  { name: "Herramientas IA", count: 142, icon: "Wrench", desc: "Software, plataformas visuales y SaaS inteligentes." },
  { name: "Repositorios GitHub", count: 89, icon: "Github", desc: "Código abierto, librerías y SDKs de última generación." },
  { name: "Prompts", count: 120, icon: "MessageSquareCode", desc: "Instrucciones de alto nivel para ChatGPT, Claude y Midjourney." },
  { name: "Agentes IA", count: 45, icon: "Bot", desc: "Sistemas autónomos que ejecutan tareas complejas en la PC." },
  { name: "SaaS", count: 73, icon: "Cpu", desc: "Software como servicio potenciado por inteligencia artificial." },
  { name: "APIs", count: 38, icon: "Code", desc: "Endpoints listos para integrar modelos en tus proyectos." },
  { name: "Productividad", count: 95, icon: "Zap", desc: "Extensiones y utilidades para optimizar tu tiempo de trabajo." },
  { name: "Ecommerce IA", count: 52, icon: "ShoppingBag", desc: "Herramientas para tiendas Shopify, WooCommerce y Amazon." },
  { name: "Marketing IA", count: 81, icon: "Megaphone", desc: "Copywriting, pautas publicitarias automáticas y embudos." },
  { name: "Diseño IA", count: 77, icon: "Paintbrush", desc: "Generación de interfaces, logos y vectores escalables." },
  { name: "Video IA", count: 48, icon: "Video", desc: "Genera avatares, guiones e historias en video con Runway y Sora." },
  { name: "Programación", count: 62, icon: "Binary", desc: "Asistentes de código como Cursor, Bolt y Copilot." },
  { name: "Open Source", count: 51, icon: "Heart", desc: "Llamas, Mistrals y proyectos libres e independientes." },
  { name: "Generación de contenido", count: 104, icon: "FileText", desc: "Artículos, tweets virales y podcasts sintetizados en segundos." },
  { name: "Automatización", count: 95, icon: "GitBranch", desc: "Flujos de trabajo, n8n, Make y bots de automatización." },
  { name: "IA general", count: 85, icon: "Cpu", desc: "Modelos generales de lenguaje y plataformas de IA." },
  { name: "Developer AI", count: 110, icon: "Binary", desc: "Herramientas avanzadas de desarrollo, terminal y CLI." },
  { name: "Datos", count: 70, icon: "Code", desc: "Extracción, scraping, bases de datos y procesamiento RAG." },
  { name: "Visual AI", count: 65, icon: "Paintbrush", desc: "Generación de imágenes, avatares, arte digital y 3D." },
  { name: "Infraestructura", count: 40, icon: "Cpu", desc: "Servidores, hardware, pipelines de despliegue y DevOps." },
  { name: "Skills", count: 82, icon: "Zap", desc: "Habilidades preconfiguradas, prompts de sistema y comandos para Claude y agentes." }
];

export const INITIAL_AI_TOOLS: AITool[] = [
  {
    id: "tool-ollama-local",
    name: "Ollama Local",
    description: "Corre LLMs potentes como Llama 3, Mistral o Phi-3 de manera totalmente privada y local en tu propia máquina.",
    pricing: "Open Source",
    category: "Herramientas IA",
    score: 4.95,
    tags: ["Local LLM", "Privacidad", "Open Source"],
    url: "https://ollama.com",
    stars: 87400,
    isTrending: true
  },
  {
    id: "tool-sd-webui",
    name: "Stable Diffusion WebUI",
    description: "La interfaz de usuario basada en navegador más avanzada y popular para generar imágenes de IA localmente con Stable Diffusion.",
    pricing: "Open Source",
    category: "Diseño IA",
    score: 4.88,
    tags: ["Generador Imágenes", "Local", "Open Source"],
    url: "https://github.com/AUTOMATIC1111/stable-diffusion-webui",
    stars: 132000,
    isTrending: true
  },
  {
    id: "tool-1-modified",
    name: "Claude 3.7 Sonnet",
    description: "El modelo más avanzado para razonamiento lógico, codificación limpia y redacción con estilo literario humano.",
    pricing: "Freemium",
    category: "Herramientas IA",
    score: 4.9,
    tags: ["Productividad", "Programación", "Redacción"],
    url: "https://anthropic.com",
    stars: 12500,
    isTrending: true
  },
  {
    id: "tool-2",
    name: "Cursor AI",
    description: "El editor de código fork de VS Code modificado con inteligencia artificial nativa. Genera y edita bases de código enteras.",
    pricing: "Desde $20/mes",
    category: "Programación",
    score: 4.93,
    tags: ["Asistente Código", "IDE", "Desarrollo"],
    url: "https://cursor.com",
    stars: 9400,
    isTrending: true
  },
  {
    id: "tool-3",
    name: "ElevenLabs Reader",
    description: "Sintetizador de voces clonadas hiperrealistas. Excelente para convertir guiones y artículos en podcasts con entonación natural.",
    pricing: "Freemium",
    category: "Video IA",
    score: 4.85,
    tags: ["Audio", "Voces IA", "Creators"],
    url: "https://elevenlabs.io",
    isLatest: true
  },
  {
    id: "tool-4",
    name: "v0 by Vercel",
    description: "Generador de interfaces UI React de alta fidelidad y responsive a partir de prompts sencillos usando Tailwind CSS.",
    pricing: "Freemium",
    category: "Diseño IA",
    score: 4.88,
    tags: ["UI/UX", "Tailwind Code", "Frontend"],
    url: "https://v0.dev",
    isTrending: true
  },
  {
    id: "tool-5",
    name: "Midjourney v6.2",
    description: "Motor de arte generativo de resolución cinematográfica con interpretación exacta de variables estéticas y tipografías en imagen.",
    pricing: "Desde $10/mes",
    category: "Diseño IA",
    score: 4.82,
    tags: ["Generador Imágenes", "Arte Digital", "Diseño"],
    url: "https://midjourney.com",
    stars: 8303
  },
  {
    id: "tool-6",
    name: "Bolt.new",
    description: "Plataforma de desarrollo en el navegador que crea, compila y despliega apps completas Full-Stack con solo describirlas.",
    pricing: "Freemium",
    category: "Programación",
    score: 4.87,
    tags: ["No-Code", "TypeScript", "Despliegue Rápido"],
    url: "https://bolt.new",
    isLatest: true,
    isTrending: true
  },
  {
    id: "tool-7",
    name: "HeyGen AI",
    description: "Plataforma que crea avatares humanos fotorrealistas con sincronización de labios exacta para anuncios y videos de capacitación.",
    pricing: "Desde $29/mes",
    category: "Video IA",
    score: 4.79,
    tags: ["Avatares", "Marketing Video", "SaaS"],
    url: "https://heygen.com"
  },
  {
    id: "tool-8",
    name: "Perplexity Pro",
    description: "Motor de búsqueda conversacional que indexa internet en tiempo real y cita fuentes fiables con resúmenes concisos.",
    pricing: "Freemium",
    category: "Productividad",
    score: 4.91,
    tags: ["Buscador", "Investigación", "Copilot"],
    url: "https://perplexity.ai"
  },
  {
    id: "tool-9",
    name: "Creatify AI",
    description: "Generador automatizado de anuncios de video para Ecommerce a partir del link de un producto en Shopify o Amazon.",
    pricing: "Desde $9/mes",
    category: "Ecommerce IA",
    score: 4.74,
    tags: ["Dropshipping", "Marketing IA", "Ad Creative"],
    url: "https://creatify.ai"
  }
];

export const INITIAL_GITHUB_REPOS: GitHubRepo[] = [
  {
    id: "github-openwa",
    name: "OpenWA",
    owner: "rmyndharis",
    description: "API de WhatsApp gratuita, open source y auto-hospedada. Conecta tu WhatsApp a tu negocio con una API REST simple, webhooks, multi-sesión y dashboard web.",
    stars: 1250,
    forks: 340,
    language: "TypeScript",
    tags: ["WhatsApp API", "Self-Hosted", "NestJS", "Docker"],
    category: "Developer Tools",
    url: "https://github.com/rmyndharis/OpenWA"
  },
  {
    id: "github-1",
    name: "autogpt",
    owner: "Significant-Gravitas",
    description: "Un framework de agentes autónomos que encadena bloques de pensamiento de LLMs para alcanzar objetivos propuestos en internet.",
    stars: 164200,
    forks: 42100,
    language: "Python",
    tags: ["AI Agents", "Autonomous", "LlamaIndex"],
    category: "AI Agents",
    url: "https://github.com/Significant-Gravitas/AutoGPT"
  },
  {
    id: "github-2",
    name: "ollama",
    owner: "ollama",
    description: "Arranca, configura e interactúa con modelos de lenguaje masivos y multimodales (Llama 3, Mistral) localmente en macOS, Linux y Windows.",
    stars: 87400,
    forks: 6900,
    language: "Go",
    tags: ["Local LLM", "Mistral", "Dev Tools"],
    category: "Open Source AI",
    url: "https://github.com/ollama/ollama"
  },
  {
    id: "github-3",
    name: "crewAI",
    owner: "crewAIInc",
    description: "Framework para orquestar equipos colaborativos de agentes autónomos de IA. Ideal para flujos que requieren especialidades.",
    stars: 18900,
    forks: 2320,
    language: "Python",
    tags: ["Agentic Crews", "Colaboracion", "Workflows"],
    category: "AI Agents",
    url: "https://github.com/crewAIInc/crewAI"
  },
  {
    id: "github-4",
    name: "open-webui",
    owner: "open-webui",
    description: "Interfaz web con el mismo acabado y potencia que ChatGPT Plus para interactuar localmente con Ollama, HuggingFace y APIs.",
    stars: 38200,
    forks: 3100,
    language: "Svelte",
    tags: ["Frontend UI", "OpenSource", "RAG"],
    category: "Developer Tools",
    url: "https://github.com/open-webui/open-webui"
  },
  {
    id: "github-5",
    name: "browser-use",
    owner: "browser-use",
    description: "Librería basada en Playwright que le permite a cualquier agente de inteligencia artificial navegar por páginas web reales como humano.",
    stars: 12500,
    forks: 1100,
    language: "Python",
    tags: ["Web Scraping", "Playwright", "Agent Automation"],
    category: "Developer Tools",
    url: "https://github.com/browser-use/browser-use"
  }
];

export const INITIAL_PROMPTS_LIBRARY: PromptItem[] = [
  {
    id: "prompt-1",
    title: "El Megaprompt para Copywriting Viral",
    promptText: `Actúa como un estratega de contenido viral de clase mundial y copywriter experto para redes sociales. 
Tu tarea es reescribir el tema proveído: [TEMA] de manera que genere una alta retención y un deseo irracional de leer.
Estructura la respuesta usando el método AIDA (Atención, Interés, Deseo, Acción):
1. El Gancho (Atención): Crea 3 variaciones de ganchos polémicos pero profesionales basados en curiosidad o miedo a perderse algo (FOMO).
2. La Tensión (Interés): Describe en 3 líneas cortas el dolor central que soluciona o la recompensa.
3. El Cuerpo (Deseo): Explica el hack con un formato de lista usando emojis estratégicos con un ritmo ágil de lectura de 1 frase por párrafo.
4. El Llamado (Acción): Un CTA sutil invitando a guardar el post o responder una pregunta para fomentar debates orgánicos en los comentarios.`,
    description: "Optimiza tus hilos de Twitter (X), guiones de TikTok e Instagram Reels usando un enfoque AIDA científicamente probado para capturar atención.",
    model: "ChatGPT",
    category: "Marketing IA",
    difficulty: "Intermedio",
    popularCount: 1845
  },
  {
    id: "prompt-2",
    title: "Arquitecto de Código Limpio e Inyección de Dependencias",
    promptText: `Actúa como un Arquitecto de Software Principal experto en TypeScript y React moderno. 
Quiero que audites el siguiente componente y apliques la regla SOLID de responsabilidad única y abstracción de efectos secundarios. 
Aísla la lógica reactiva en custom hooks, tipa todos los parámetros de entrada con TypeScript estricto, evita renders redundantes y documenta las funciones críticas bajo el formato JSDoc.
Aquí está el componente: [CÓDIGO]`,
    description: "Instrucción de refactorización profunda para empaquetar código espagueti en modelos modulares y desacoplados.",
    model: "Claude",
    category: "Programación",
    difficulty: "Avanzado",
    popularCount: 1290
  },
  {
    id: "prompt-3",
    title: "Midjourney Retrato Cinemático de Alta Costura",
    promptText: `/imagine prompt: Extreme close-up portrait of a cybernetic warrior, pristine porcelain chassis interlinked with neon cyan fiber optics, holographic overlay emitting a soft amethyst glow, ultra-detailed microtexture skin, soft cinematic studio lighting, dramatic backlighting, rain droplets, shot on Hasselblad 100mp, photorealistic, Unreal Engine 5 render style, 8k resolution, volumetric smoke --ar 16:9 --style raw --v 6.0`,
    description: "Prompt estético cyberpunk que genera rostros fotorrealistas con iluminación de estudio cinematográfico.",
    model: "Midjourney",
    category: "Diseño IA",
    difficulty: "Avanzado",
    popularCount: 2310
  },
  {
    id: "prompt-4",
    title: "Planificador de Automatizaciones Empresariales",
    promptText: `Eres un consultor líder en automatización empresarial con n8n y Make. 
Mi negocio digital se enfoca en [TIPO_NEGOCIO] y quiero automatizar la captación de leads y pre-calificación mediante WhatsApp. 
Diseña paso a paso qué nodos lógicos necesito, qué endpoints de APIs externas debo convocar (ej. OpenAI, Google Sheets, CRM) y cómo estructurar el prompt de filtrado para que no consuma créditos de más.`,
    description: "Ayuda a estructurar pipelines complejos de automatización con nodos y flujos de decisión óptimos sin gastar créditos excesivos.",
    model: "Gemini",
    category: "Automatizaciones",
    difficulty: "Principiante",
    popularCount: 890
  }
];

export const INITIAL_WORKFLOWS: WorkflowItem[] = [
  {
    id: "wf-1",
    title: "Generador de Shorts y Guiones Automáticos",
    description: "Scrapea hilos de Reddit o posts trending de Instagram, reescribe el guión con Gemini y genera el video vertical editado listo para subir.",
    timeSaved: "12 horas/semana",
    targetPlatform: "TikTok + Reels",
    nodes: [
      { id: "n1", label: "Gatillo: URL Trending", type: "trigger", status: "idle" },
      { id: "n2", label: "Scraper Apify / Reddit API", type: "action", status: "idle" },
      { id: "n3", label: "IA: Adaptación de Guión", type: "ai", status: "idle" },
      { id: "n4", label: "Sintetizador ElevenLabs Audio", type: "ai", status: "idle" },
      { id: "n5", label: "Generador Video (Runway / Sora)", type: "ai", status: "idle" },
      { id: "n6", label: "Webhook: Publicación Automática", type: "output", status: "idle" }
    ],
    connections: [
      { from: "n1", to: "n2" },
      { from: "n2", to: "n3" },
      { from: "n3", to: "n4" },
      { from: "n4", to: "n5" },
      { from: "n5", to: "n6" }
    ]
  },
  {
    id: "wf-2",
    title: "Embudo WhatsApp Interactivo Calificador de Leads",
    description: "Detecta consultas entrantes en tu chatbot de empresa, las analiza según su intención de compra, y las deriva automáticamente al CRM o agenda una reunión.",
    timeSaved: "8 horas/semana",
    targetPlatform: "Negocios Digitales",
    nodes: [
      { id: "w1", label: "Mensaje WhatsApp (ManyChat)", type: "trigger", status: "idle" },
      { id: "w2", label: "IA Clasificador de Intención", type: "ai", status: "idle" },
      { id: "w3", label: "Bifurcación: ¿Listo para comprar?", type: "action", status: "idle" },
      { id: "w4", label: "Calio.io Agendamiento Automático", type: "output", status: "idle" },
      { id: "w5", label: "Supabase Save Lead Metadata", type: "output", status: "idle" }
    ],
    connections: [
      { from: "w1", to: "w2" },
      { from: "w2", to: "w3" },
      { from: "w3", to: "w4" },
      { from: "w3", to: "w5" }
    ]
  }
];

export const INITIAL_RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: "art-1",
    title: "Cómo crear una Máquina de Contenido Automatizada usando n8n, Supabase y Gemini AI",
    category: "Tutoriales",
    readTime: "8 min de lectura",
    excerpt: "Guía paso a paso para estructurar un embudo que capte noticias de IA, genere un boletín sumamente premium optimizado para SEO, y publique en redes sociales sin intervención humana.",
    author: "Alvaro Wentix",
    date: "May 28, 2026",
    tags: ["Automatizacion", "n8n", "Creators"],
    views: 4520
  },
  {
    id: "art-2",
    title: "Guía de Monetización: Construyendo Micro-SaaS lucrativos en un fin de semana con Bolt.new y Cursor",
    category: "Casos de estudio",
    readTime: "12 min de lectura",
    excerpt: "Analizamos cómo tres creadores españoles facturan más de $3,500 dólares al mes desarrollando herramientas especializadas de un solo propósito sin saber programar de forma profesional.",
    author: "Elena Gomez",
    date: "May 25, 2026",
    tags: ["SaaS", "Negocios Digitales", "No-code"],
    views: 8930
  },
  {
    id: "art-3",
    title: "Open Source vs Propietario: Por qué correr Llama 3 local con Ollama es el mejor hack de privacidad empresarial",
    category: "Hacks IA",
    readTime: "6 min de lectura",
    excerpt: "No expongas la base de clientes de tu ecommerce. Te explicamos los pasos óptimos para desplegar Ollama en chips Apple Silicon con total autonomía.",
    author: "Mateo Ortiz",
    date: "May 19, 2026",
    tags: ["Open Source", "Ollama", "Seguridad"],
    views: 3120
  }
];

export const GRATIS_STACK: StackItem[] = [
  { name: "ChatGPT", description: "Tu copiloto de brainstorming, redacción persuasiva y traducción de ideas a conceptos técnicos en español.", category: "Asistente General", freeTierInfo: "Plan gratuito completo con limitaciones de carga de archivos.", lucideIcon: "MessageSquare", badge: "Esencial", url: "https://chatgpt.com" },
  { name: "Claude", description: "La mejor redacción de textos estructurados y de lógica matemática/depuración de código de programación en la industria.", category: "Copiloto Técnico", freeTierInfo: "Acceso gratuito con créditos diarios renovables.", lucideIcon: "BrainCircuit", badge: "Recomendado", url: "https://claude.ai" },
  { name: "Cursor", description: "El IDE definitivo que te permite construir apps enteras programando en lenguaje natural. Cambia cómo creas herramientas.", category: "IDE Inteligente", freeTierInfo: "Suscripción gratis con 50 consultas premium gratuitas al mes.", lucideIcon: "CodeXml", badge: "Favorito", url: "https://cursor.com" },
  { name: "Bolt.new", description: "Crea y despliega aplicaciones web directamente desde un prompt de texto, sin instalar nada, directamente en la nube.", category: "No-Code builder", freeTierInfo: "Créditos iniciales y compilación web completamente gratuita.", lucideIcon: "Layers", badge: "Futurista", url: "https://bolt.new" },
  { name: "Vercel", description: "Plataforma premium para desplegar tus interfaces web en segundos con soporte Edge y carga ultra-rápida.", category: "Hosting & Frontend", freeTierInfo: "Plan Hobby gratuito para proyectos personales y startups.", lucideIcon: "CloudUpload", badge: "Producción", url: "https://vercel.com" },
  { name: "Supabase", description: "Base de datos Postgres abierta y en tiempo real para persistir feeds, perfiles de usuarios e historiales de prompts.", category: "Base de datos cloud", freeTierInfo: "2 proyectos gratuitos con base de datos real Postgres de 500MB.", lucideIcon: "Database", badge: "Infraestructura", url: "https://supabase.com" },
  { name: "n8n.io", description: "El motor rey de automatizaciones visuales basadas en flujos lógicos y nodos de IA integrables con total libertad.", category: "Monomotor de flujos", freeTierInfo: "Versión auto-hospedada gratis para siempre ejecutable en local.", lucideIcon: "GitFork", badge: "Automatizador", url: "https://n8n.io" },
  { name: "ElevenLabs", description: "El estándar de la industria en clonación de voces humanas y locuciones automatizadas con emoción.", category: "Generador de Voces", freeTierInfo: "10,000 caracteres gratuitos al mes con voces preestablecidas.", lucideIcon: "Volume2", badge: "Audio", url: "https://elevenlabs.io" },
  { name: "Runway", description: "Estudio generativo de video que te permite crear escenas fantásticas de cine e hiperrealismo desde un prompt.", category: "Video Generativo", freeTierInfo: "Créditos iniciales gratuitos para explorar Gen-2/Gen-3.", lucideIcon: "Tv", badge: "Cine", url: "https://runwayml.com" }
];
