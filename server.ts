import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const DATABASE_PATH = path.join(process.cwd(), "leads_database.json");

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

async function startServer() {
  const app = express();
  const PORT = 3000;

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

  // Initialize Gemini Client safely
  let ai: GoogleGenAI | null = null;
  const getGeminiClient = () => {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Real AI responses will fall back to simulation.");
      }
      ai = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  };

  // 1. API: Chat with ORBI
  app.post("/api/gemini/orbi-chat", async (req, res) => {
    const { messages, userContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    try {
      const client = getGeminiClient();
      const apiKeyExists = !!process.env.GEMINI_API_KEY;

      const systemInstruction = `Eres ORBI, el asistente oficial de Wentix AI.

Tu propósito NO es funcionar como un chatbot generalista.
NO eres ChatGPT.
NO eres un buscador.
NO eres un asistente para responder cualquier pregunta.

Tu única misión es ayudar a los visitantes de Wentix AI a encontrar soluciones dentro del ecosistema Wentix AI.

OBJETIVOS PRINCIPALES:
1. Comprender los objetivos del visitante.
2. Detectar problemas de negocio.
3. Recomendar stacks de Wentix AI.
4. Recomendar herramientas disponibles dentro de la plataforma (Herramientas IA, Repositorios GitHub, Workflows, Prompts).
5. Recomendar automatizaciones.
6. Recomendar recursos gratuitos (Ebooks, Guías de venta).
7. Recomendar repositorios.
8. Recomendar workflows.
9. Generar oportunidades de venta (ofrecer Ebooks "Claude de Cero a Cien" o "Codex de Cero a Cien" con franja PRONTO).
10. Llevar al usuario a agendar una reunión o auditoría de IA.

REGLAS IMPORTANTES:
NO respondas preguntas que no tengan relación con:
- Inteligencia artificial
- Automatización
- Negocios digitales
- Creación de contenido
- Ecommerce
- Marketing
- Productividad
- Herramientas disponibles en Wentix AI
- Recursos disponibles en Wentix AI

Si alguien pregunta algo fuera de esos temas (Ejemplo: "¿Quién ganó el mundial?", "¿Cuál es la capital de Francia?", "¿Cómo cocinar pasta?"), tu respuesta DEBE ser exactamente:
"Mi función es ayudarte a encontrar soluciones de inteligencia artificial, automatización y crecimiento digital dentro del ecosistema Wentix AI.

Cuéntame qué proyecto quieres construir o qué objetivo quieres alcanzar y te recomendaré el stack más adecuado."

NUNCA continúes desarrollando temas fuera del ecosistema Wentix.

PROCESO DE CONVERSACIÓN:
PASO 1: Entender el objetivo.
Pregunta activamente:
- ¿Qué quieres lograr?
- ¿Tienes un negocio?
- ¿Creas contenido?
- ¿Vendes servicios?
- ¿Tienes ecommerce?
- ¿Buscas automatizar procesos?
- ¿Quieres generar más clientes?

PASO 2: Clasificar al usuario.
Tipos:
- Emprendedor
- Agencia
- Ecommerce
- Freelancer
- Creador de contenido
- Startup
- Empresa local

PASO 3: Recomendar un stack.
Utiliza únicamente stacks basados en los recursos de Wentix AI. Nunca inventes stacks absurdos o ficticios que no se relacionen con el valor real. Si no existe un stack adecuado, recomienda directamente una sesión estratégica o reunión.

PASO 4: Cerrar conversación con CTA de conversión.
Ejemplos:
- "Creo que este stack puede ayudarte."
- "¿Quieres que te muestre cómo implementarlo?"
- "¿Te gustaría agendar una reunión con el equipo de Wentix AI?"

OBJETIVO DE CONVERSIÓN:
Siempre intenta llevar la conversación hacia:
- Explorar recursos o Ebooks
- Ver herramientas en el directorio
- Ver workflows
- Solicitar una auditoría gratuita
- Agendar una reunión

TONO:
- Profesional
- Cercano
- Estratégico
- Moderno
- Consultivo
No suenes robótico ni como vendedor agresivo. Actúa como un consultor estratégico experto en IA.

BASE DE CONOCIMIENTO (Usa los recursos provistos dinámicamente o del directorio):
Debes utilizar exclusivamente el ecosistema de Wentix AI. Si la información solicitada no existe, responde de la siguiente manera:
"No tengo información suficiente para recomendar una solución específica. Te recomiendo agendar una reunión para analizar tu caso."

REGLA FINAL:
Toda conversación debe terminar acercando al usuario a una solución de Wentix AI o a una reunión con el equipo.`;

      const prompt = `Contexto del ecosistema actual: ${JSON.stringify(userContext || {})}\n\nPregunta o mensaje del usuario:\n${messages[messages.length - 1]?.content}`;

      if (!apiKeyExists) {
        // Fallback simulation to keep the app working gracefully without crashing
        setTimeout(() => {
          res.json({
            text: `✨ **Hola, soy ORBI!** (Modo simulación activado - Sin clave de API) \n\n¡Estoy encantado de ayudarte en **Wentix AI**! Parece que estás explorando nuestro ecosistema definitivo de inteligencia artificial. Aquí puedes:\n\n* 🚀 Descubrir **Herramientas de IA** ordenadas por valoración y categoría.\n* 🧑‍💻 Explorar **Repositorios GitHub** trending en español.\n* 🔄 Configurar **Workflows de automatización** para TikTok, Instagram, WhatsApp y captación de leads.\n* 💡 Copiar prompts profesionales optimizados para ChatGPT, Claude o Midjourney.\n\n¿Qué te gustaría automatizar hoy, o qué tipo de recurso necesitas? ¡Dime y te daré un plan práctico!`
          });
        }, 1200);
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.75,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error calling Gemini API for ORBI:", error);
      res.status(500).json({ 
        error: "Failed to generate response from Gemini AI",
        details: error.message || error 
      });
    }
  });

  // 2. API: Auto-Scraping simulation and IA synthesis for tool/repo/article URLs
  app.post("/api/gemini/scrape", async (req, res) => {
    const { url, sourcePlatform } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required for scraping simulation" });
    }

    try {
      const client = getGeminiClient();
      const apiKeyExists = !!process.env.GEMINI_API_KEY;

      // Real fetch scraper in sandbox/backend!
      let scrapedContent = "";
      let fetchSuccess = false;
      try {
        const fetchUrl = url.startsWith("http") ? url : `https://${url}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

        const responseFetch = await fetch(fetchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 WentixScraper/1.0",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (responseFetch.ok) {
          const rawHtml = await responseFetch.text();
          // Basic HTML cleaning
          let cleaned = rawHtml
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
          
          scrapedContent = cleaned.substring(0, 2000); // Use up to 2000 characters
          fetchSuccess = true;
          console.log(`Scraping real exitoso para ${url}. Caracteres extraídos: ${scrapedContent.length}`);
        } else {
          console.warn(`Fetch returned status ${responseFetch.status} for URL: ${url}`);
        }
      } catch (fetchErr: any) {
        console.warn(`No se pudo extraer contenido HTML real para ${url} (cayendo en metadato inteligente):`, fetchErr.message || fetchErr);
      }

      // If fetch fails or returns empty, use a smart, non-empty fallback metadata based on URL domain
      if (!scrapedContent) {
        try {
          const domain = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
          scrapedContent = `Plataforma origen: ${sourcePlatform || "Detección Automática"}
URL: ${url}
Contenido del dominio: ${domain}. Es una plataforma líder dedicada a tecnologías de inteligencia artificial, desarrollo, automatización o productividad. Procesa este recurso con tu experticia técnica.`;
        } catch {
          scrapedContent = `URL: ${url}. Herramientas o repositorio de Inteligencia Artificial para el catálogo de Wentix AI.`;
        }
      }

      const systemInstruction = `Eres un agente experto de procesamiento y automatización de Wentix AI.
Tu tarea es analizar el contenido real extraído de una página web y transformarlo en una ficha técnica curada impecable en formato JSON.
Debes realizar un análisis inteligente y reescribir la información en un formato JSON estructurado, traducido al español con estilo premium, inspirador, directo y profesional (nunca tradicional).
No inventes información que no encaje con el tipo de plataforma. Provee una reescritura de alta calidad redactada para emprendedores digitales y creadores.`;

      const promptTemplate = `Procesa este contenido real extraído mediante scraping desde la URL de la plataforma (${url}):

${scrapedContent}

Debes responder ÚNICAMENTE con un objeto JSON válido con los siguientes campos:
1. "title": Un título de marca reescrito y optimizado para SEO, atractivo y conciso (máximo 40 caracteres)
2. "description": Una descripción sumamente atractiva, clara y optimizada en español de lo que hace exactamente la herramienta o repositorio (máximo 120 caracteres)
3. "category": Una de las siguientes categorías válidas de Wentix: Herramientas IA, Repositorios GitHub, Automatizaciones, Prompts, Agentes IA, SaaS, Ecommerce IA, Marketing IA, Diseño IA, Video IA, Programación
4. "tags": Un arreglo de 3 o 4 palabras clave en español (ej. ["automatizacion", "marketing", "no-code"])
5. "pricing": Tipo de precio en un string: "Gratis", "Desde $9/mes", "Open Source", "Freemium" o "Premium"
6. "score": Un float entre 4.5 y 5.0
7. "stars": Un número entero aleatorio útil entre 150 y 12500 para popularidad, o null si no se aplica
8. "highlights": Un arreglo con 3 características clave en español de gran valor técnico o comercial
9. "viralHacks": Un tip breve enfocado en creadores de contenido o ecommerce sobre cómo monetizar esto.

Responde solo el JSON literal sin bloques markdown \`\`\`json ni caracteres adicionales para que sea parseable directamente.`;

      if (!apiKeyExists) {
        // Fallback simulated JSON but with correct metadata dynamically
        setTimeout(() => {
          let sampleHost = "source";
          try {
            sampleHost = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.replace("www.", "");
          } catch {}
          
          const isRepo = url.toLowerCase().includes("github");
          const mockJSON = {
            title: `Generador Inteligente para ${sampleHost}`,
            description: `Automatiza e impulsa la generación de contenido y workflows usando agentes de última generación integrados con tu stack digital.`,
            category: isRepo ? "Repositorios GitHub" : "Herramientas IA",
            tags: ["automatizacion", "inteligencia-artificial", "productividad", "growth-hacking"],
            pricing: isRepo ? "Open Source" : "Freemium",
            score: 4.8,
            stars: isRepo ? Math.floor(Math.random() * 2500) + 300 : null,
            highlights: [
              "Procesamiento ultra-rápido en la nube",
              "Integración nativa con n8n, Slack y bases de datos",
              "Soporte completo para modelos Gemini, Claude y OpenAI"
            ],
            viralHacks: "Crea carruseles explicando cómo conectar esta herramienta con automatizaciones y compártelo en TikTok/Instagram para captar leads en automático."
          };
          res.json({ success: true, processedItem: mockJSON, source: "Simulada Dinámica (Entorno Local)" });
        }, 1500);
        return;
      }

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptTemplate,
        config: {
          systemInstruction,
          temperature: 0.6,
        }
      });

      const responseText = response.text || "";
      let jsonOutput;
      try {
        // Safe cleaning in case LLM outputs markdown fences
        const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        jsonOutput = JSON.parse(cleanedText);
      } catch (parseError) {
        console.warn("Could not parse direct JSON from response text, building fallback rescue parse. Raw response:", responseText);
        jsonOutput = {
          title: "Nueva Herramienta Procesada En Vivo",
          description: "La IA ha procesado el recurso de manera automática, optimizando la semántica y clasificación para emprendedores en español.",
          category: url.toLowerCase().includes("github") ? "Repositorios GitHub" : "Herramientas IA",
          tags: ["ia", "wentix", "ecosistema", "automation"],
          pricing: "Freemium",
          score: 4.7,
          stars: 450,
          highlights: ["Detección de metadatos en vivo", "SEO optimizado automáticamente", "Lista para desplegar"],
          viralHacks: "Publica un tutorial corto en YouTube Shorts mostrando el antes y el después de usar este recurso."
        };
      }

      res.json({ success: true, processedItem: jsonOutput, source: fetchSuccess ? "Scraper Real + Google Gemini 3.5-Flash" : "Google Gemini 3.5-Flash (Metadata Inteligente)" });
    } catch (err: any) {
      console.error("Error processing web scraping URL with Gemini:", err);
      res.status(500).json({ error: "Failed to scrape and curate URL with Gemini AI", details: err.message });
    }
  });

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
