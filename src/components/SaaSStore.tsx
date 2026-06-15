import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  ShoppingBag, 
  Terminal, 
  Check, 
  MessageSquare, 
  Play, 
  RefreshCw, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Smartphone, 
  Copy, 
  Eye, 
  ThumbsUp, 
  Layers, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Video, 
  X, 
  Info,
  CreditCard,
  Twitter,
  User,
  Hash,
  Bot,
  Heart
} from "lucide-react";

// Types for Premium SaaS Items
export interface SaaSApp {
  id: string;
  name: string;
  tagline: string;
  badge: "HOTSALE" | "NUEVO" | "MÁS POPULAR" | "RECOMENDADO";
  description: string;
  pricingMonthly: number;
  pricingLifetime: number;
  rating: number;
  features: string[];
  lucideIcon: any;
  accentColor: string;
}

interface SaaSStoreProps {
  onShowToast: (message: string) => void;
  onAddBacker: (backer: { id: string; name: string; amount: number; message: string; date: string }) => void;
  backersList?: any[];
}

export default function SaaSStore({ onShowToast, onAddBacker }: SaaSStoreProps) {
  // License activation status stored in localStorage
  const [activeLicenses, setActiveLicenses] = useState<Record<string, { type: "monthly" | "lifetime"; key: string }>>(() => {
    const saved = localStorage.getItem("wentix_saas_licenses");
    return saved ? JSON.parse(saved) : {};
  });

  // Active view tab inside SaaS store ("catalogo" or "mis-licencias")
  const [storeTab, setStoreTab] = useState<"catalogo" | "mis-licencias">("catalogo");

  // Selected tool for active demo simulator
  const [activeDemoAppId, setActiveDemoAppId] = useState<string>("saas-multipost");

  // State for Purchase/Checkout modal
  const [checkoutApp, setCheckoutApp] = useState<{ app: SaaSApp; type: "monthly" | "lifetime"; price: number } | null>(null);
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"idle" | "running" | "success">("idle");
  const [generatedLicense, setGeneratedLicense] = useState("");

  // ----------------------------------------------------
  // SIMULATOR 1 STATES: MULTI-NETWORKS VIDEO AUTOPOST
  // ----------------------------------------------------
  const [videoPrompt, setVideoPrompt] = useState("3 lecciones de finanzas personales para emprendedores jóvenes");
  const [videoVoice, setVideoVoice] = useState("Voz Masculina Profesional (IA)");
  const [videoRatio, setVideoRatio] = useState("9:16 (TikTok, Reels)");
  const [videoSteps, setVideoSteps] = useState<string[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlayingVideoDemo, setIsPlayingVideoDemo] = useState(false);
  const [videoDemoResult, setVideoDemoResult] = useState<any | null>(null);
  
  // Real-time ticking views statistics for posted mock video
  const [mockStatsTikTok, setMockStatsTikTok] = useState({ views: 0, likes: 0, shares: 0 });
  const [mockStatsInsta, setMockStatsInsta] = useState({ views: 0, likes: 0, shares: 0 });
  const [mockStatsShorts, setMockStatsShorts] = useState({ views: 0, likes: 0, shares: 0 });

  // ----------------------------------------------------
  // SIMULATOR 2 STATES: CONTENT CAROUSEL & X THREADS
  // ----------------------------------------------------
  const [carouselSource, setCarouselSource] = useState("Cómo duplicar tus ventas usando automatización sin código y chatbots inteligentes.");
  const [carouselStyle, setCarouselStyle] = useState("Tech Minimalist Dark");
  const [isGeneratingCarousel, setIsGeneratingCarousel] = useState(false);
  const [carouselStep, setCarouselStep] = useState(0);
  const [generatedSlides, setGeneratedSlides] = useState<string[]>([]);
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [carouselSlideIndex, setCarouselSlideIndex] = useState(0);

  // ----------------------------------------------------
  // SIMULATOR 3 STATES: WHATSAPP OMNI-AGENTpersuasive Sales Chatbot
  // ----------------------------------------------------
  const [waContext, setWaContext] = useState("Venta de calzado deportivo marca 'ZenStride' ultraligero a $49, con envío gratis e inmediato y garantía de 30 días de devolución.");
  const [waGreeting, setWaGreeting] = useState("¡Hola! Soy tu asistente ZenStride entrenado por IA. ¿Buscas comodidad diaria o alto rendimiento deportivo?");
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [chatbotMessages, setChatbotMessages] = useState<Array<{ sender: "user" | "agent"; text: string; time: string }>>([]);
  const [userChatInput, setUserChatInput] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);

  // ----------------------------------------------------
  // SIMULATOR 4 STATES: SOCIAL MEDIA AUTOMATION BOT
  // ----------------------------------------------------
  const [socialKeywords, setSocialKeywords] = useState("#marketing, @competidor1, automatizacion, inteligencia artificial");
  const [socialBotTone, setSocialBotTone] = useState("Educativo & Persuasivo");
  const [isSocialBotActive, setIsSocialBotActive] = useState(false);
  const [socialBotStats, setSocialBotStats] = useState({ commentsSent: 124, likesEmitted: 382, dmsDelivered: 41, leadsCaptured: 9 });
  const [socialLogs, setSocialLogs] = useState<Array<{ id: string; channel: "twitter" | "instagram" | "linkedin"; user: string; text: string; action: string; commentText?: string; time: string }>>([
    {
      id: "log-initial-1",
      channel: "twitter",
      user: "@pablo_growth",
      text: "¿Alguien conoce un buen bot para automatizar respuestas por mensaje directo?",
      action: "Comentario enviado & Mensaje directo enviado",
      commentText: "¡Hola @pablo_growth! Te recomiendo automatizar con SocialFlow de Wentix. Responde menciones y envía DMs con el gancho en menos de 10s. ¡Una locura!",
      time: "22:15:30"
    },
    {
      id: "log-initial-2",
      channel: "instagram",
      user: "@sofia.estudios",
      text: "El principal cuello de botella de mi marca personal es que me toma horas contestar comentarios repetidos.",
      action: "Comentario optimizado de alto valor",
      commentText: "¡Totalmente de acuerdo @sofia.estudios! Delegar esto en un agente autónomo de IA te salva al menos 3 horas diarias de trabajo manual.",
      time: "22:12:15"
    }
  ]);

  // Social Bot simulation ticking effect
  useEffect(() => {
    if (!isSocialBotActive) return;

    const interval = setInterval(() => {
      const users = ["@brian_saas", "@carla_finanzas", "@startup_hub", "@agencia_viral", "@diego.growth", "@valentin_dev", "@emma_marketing"];
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const channels: Array<"twitter" | "instagram" | "linkedin"> = ["twitter", "instagram", "linkedin"];
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];

      const posts = [
        "¿Cuáles son las mejores prácticas para escalar una agencia de automatización sin código hoy en día?",
        "Estoy buscando un bot que pueda leer comentarios de Instagram y enviar links automáticamente al priv.",
        "Súper cansado de copiar y pegar el mismo link en las menciones de todas mis redes sociales.",
        "¿Quién me ayuda a de-bloquear un flujo autómata para capturar leads sin estar pegado al teléfono?",
        "La inteligencia artificial en atención al cliente es el hack de ventas más grande de este año.",
        "¿Cómo automatizar comentarios de valor en el nicho de SaaS e infoproductos para captar clientes?"
      ];
      const randomPost = posts[Math.floor(Math.random() * posts.length)];

      let randomCommText = "";
      if (socialBotTone.includes("Persuasivo")) {
        randomCommText = `¡Hola! Justo solucioné eso usando el SocialFlow Auto-Bot Pro de Wentix. Auto-comenta aportando gran valor y manda DMs inmediatos para captar el lead. ¡Pruébalo, te cambia el negocio!`;
      } else if (socialBotTone.includes("Divertido")) {
        randomCommText = `¡Amigo, deja de teclear a mano! 😂 Pon un clon inteligente de Wentix a automatizar respuestas. Cero estrés y el triple de captación en piloto automático.`;
      } else {
        randomCommText = `Excelente consulta. Para automatizar esto de manera orgánica lo ideal es disparar un comentario basado en un análisis semántico por webhook, seguido de un DM.`;
      }

      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];

      const newLog = {
        id: `social-log-${Date.now()}`,
        channel: randomChannel,
        user: randomUser,
        text: randomPost,
        action: "Comentario + Like + DM Auto-enviado",
        commentText: randomCommText,
        time: timeStr
      };

      setSocialLogs(prev => [newLog, ...prev.slice(0, 7)]);
      setSocialBotStats(prev => ({
        commentsSent: prev.commentsSent + 1,
        likesEmitted: prev.likesEmitted + Math.floor(Math.random() * 3) + 1,
        dmsDelivered: prev.dmsDelivered + 1,
        leadsCaptured: prev.leadsCaptured + (Math.random() > 0.65 ? 1 : 0)
      }));

    }, 3500);

    return () => clearInterval(interval);
  }, [isSocialBotActive, socialBotTone]);

  // Persistence of Licenses
  useEffect(() => {
    localStorage.setItem("wentix_saas_licenses", JSON.stringify(activeLicenses));
  }, [activeLicenses]);

  // Tick stats logic for Simulated Multipost video
  useEffect(() => {
    let interval: any;
    if (videoDemoResult) {
      interval = setInterval(() => {
        setMockStatsTikTok(prev => ({
          views: prev.views + Math.floor(Math.random() * 45) + 5,
          likes: prev.likes + Math.floor(Math.random() * 12) + 1,
          shares: prev.shares + (Math.random() > 0.7 ? 1 : 0)
        }));
        setMockStatsInsta(prev => ({
          views: prev.views + Math.floor(Math.random() * 30) + 3,
          likes: prev.likes + Math.floor(Math.random() * 9) + 1,
          shares: prev.shares + (Math.random() > 0.8 ? 1 : 0)
        }));
        setMockStatsShorts(prev => ({
          views: prev.views + Math.floor(Math.random() * 55) + 8,
          likes: prev.likes + Math.floor(Math.random() * 16) + 2,
          shares: prev.shares + (Math.random() > 0.65 ? 1 : 0)
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [videoDemoResult]);

  // Premium SaaS lists
  const PREMIUM_SAAS_LIST: SaaSApp[] = [
    {
      id: "saas-multipost",
      name: "ShortBlast Multi-Agent AI",
      tagline: "Motor de Render de Video & Disparador Automatizado Multi-Social",
      badge: "MÁS POPULAR",
      description: "Genera micro-videos cortados al milímetro con voces neuronales premium ultrarrealistas y publícalos de manera 100% automatizada e instantánea en TikTok, YouTube Shorts, Instagram Reels y Facebook en un solo clic.",
      pricingMonthly: 29,
      pricingLifetime: 149,
      rating: 4.96,
      accentColor: "border-cyan-500 text-cyan-400 bg-cyan-950/20 shadow-cyan-950/40",
      features: [
        "Renderizado de video multi-capa en la nube (Voz IA + Subtítulos + Clips)",
        "API oficial de publicación directa en TikTok, Reels y Shorts",
        "Evasión de filtros de copyright y detección automática de hashtags virales",
        "Panel inteligente de analíticas acumulado en un único monitor",
        "Licencia comercial para reventa de servicios de contenidos a clientes locales"
      ],
      lucideIcon: Video
    },
    {
      id: "saas-content",
      name: "Content Machine Carousel AI",
      tagline: "El Redactor Visual de Hilos y Diapositivas Virales",
      badge: "HOTSALE",
      description: "Escribe hilos de contenido perspicuo para LinkedIn, Twitter (X) y formatea instantáneamente hermosos carruseles de imágenes estéticos listos para subir a Instagram o PDFs de LinkedIn diseñados para duplicar tu engagement orgánico.",
      pricingMonthly: 19,
      pricingLifetime: 89,
      rating: 4.88,
      accentColor: "border-purple-500 text-purple-400 bg-purple-950/20 shadow-purple-950/40",
      features: [
        "Inyección directa de blogs/URLs o transcripciones de YouTube",
        "Estilos visuales modernos preconfigurados tipo Vercel y Linear",
        "Estructura AIDA optimizada para máxima retención de lectura",
        "Botón de descarga PDF directo y copia de texto en un clic",
        "Planificador de calendario integrado para disparos programados"
      ],
      lucideIcon: Layers
    },
    {
      id: "saas-whatsapp",
      name: "WhatsApp OmniAgent Pro",
      tagline: "Clon de Agente de Ventas & Conversor de Leads Permanente",
      badge: "RECOMENDADO",
      description: "Despliega un agente autónomo de ventas y soporte 24/7 conectado directamente a tus líneas de WhatsApp. Entrena al clon de IA con los PDFs, FAQs y precios de tu tienda o consultora para que capte, persuada y cierre pedidos en piloto automático.",
      pricingMonthly: 39,
      pricingLifetime: 199,
      rating: 4.98,
      accentColor: "border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-emerald-950/40",
      features: [
        "Integración web de WhatsApp nativa lista para escanear en 3 minutos",
        "Respuestas hiper-personalizadas de alta conversión basadas en contexto propio",
        "Integración directa con Stripe/Paypal para mandar enlaces de cobro por WhatsApp",
        "Panel de transvía humana: toma el control de la conversación en cualquier instante",
        "Cero cobro por mensajes enviados sin cargos ocultos"
      ],
      lucideIcon: MessageSquare
    },
    {
      id: "saas-social-bot",
      name: "SocialFlow Auto-Bot Pro",
      tagline: "Piloto Automático de Respuestas, Likes, Menciones e Instahacks 24/7",
      badge: "NUEVO",
      description: "Escucha palabras clave, menciones e hilos en vivo de X/Twitter, Instagram y LinkedIn. Genera comentarios de altísimo valor de forma instantánea con el tono de tu marca, envía links por DM y saca estadísticas de alcance orgánico automáticas.",
      pricingMonthly: 24,
      pricingLifetime: 119,
      rating: 4.95,
      accentColor: "border-amber-500 text-amber-500 bg-amber-950/25 shadow-amber-950/40",
      features: [
        "Monitoreo persistente en tiempo real de hashtags y competidores",
        "Inyección directa de links interactivos en Mensajes Directos (Auto-DM)",
        "Modulador de tono de IA integrado (Educativo, Divertido, Persuasivo)",
        "Generación autónoma de comentarios contextualizados de alto impacto",
        "Controles anti-spam avanzados con delay humano para evasión de bloqueos"
      ],
      lucideIcon: Bot
    }
  ];

  // Helper app fetching by ID
  const getAppById = (id: string): SaaSApp => {
    return PREMIUM_SAAS_LIST.find(a => a.id === id) || PREMIUM_SAAS_LIST[0];
  };

  // Launch Multi-Post simulation
  const handleRunVideoDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) {
      onShowToast("Escribe un tema o idea base para el video");
      return;
    }

    setIsPlayingVideoDemo(true);
    setVideoSteps([
      "🤖 Iniciando procesamiento de lenguaje natural...",
      "✍️ Redactando guión de alta retención optimizado para hooks de 3 segundos...",
      "🎭 Sintetizando locución de audio premium con la voz neuronales seleccionada...",
      "🎨 Configurando subtítulos de colores de alto contraste estilo Alex Hormozi...",
      "🌌 Generando clips e imágenes de soporte con modelo de difusión rápida...",
      "⚡ Unificando componentes y renderizando archivo master mp4...",
      "🔗 Conectando servidores dedicados de distribución multi-red...",
      "🚀 Publicando simultáneamente en TikTok, Instagram Reels, y YouTube Shorts..."
    ]);
    setVideoProgress(0);
    setVideoDemoResult(null);

    // Initial resets
    setMockStatsTikTok({ views: 0, likes: 0, shares: 0 });
    setMockStatsInsta({ views: 0, likes: 0, shares: 0 });
    setMockStatsShorts({ views: 0, likes: 0, shares: 0 });

    const totalSteps = 8;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setVideoProgress(Math.floor((currentStep / totalSteps) * 100));

      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlayingVideoDemo(false);
          setVideoDemoResult({
            prompt: videoPrompt,
            voice: videoVoice,
            ratio: videoRatio,
            title: `💡 ${videoPrompt.substring(0, 45)}... #ia #business #tips #automatizacion #wentix`,
            date: new Date().toLocaleTimeString()
          });
          onShowToast("🚀 ¡Contenido de prueba renderizado y publicado en redes con éxito!");
        }, 800);
      }
    }, 1200);
  };

  // Launch Carousel & Threads simulation
  const handleRunCarouselDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselSource.trim()) {
      onShowToast("Por favor introduce un texto base de entrada");
      return;
    }

    setIsGeneratingCarousel(true);
    setCarouselStep(1);
    setGeneratedSlides([]);
    setGeneratedThread([]);

    setTimeout(() => {
      setCarouselStep(2);
      // Generate mock beautiful slides
      setTimeout(() => {
        setCarouselStep(3);
        const slides = [
          "📈 CÓMO DUPLICAR VENTAS: El Sistema que Nadie te Cuenta usando Automatización de IA 🚀",
          "⚠️ EL PROBLEMA CENTRAL: Pasar 5 horas al día respondiendo mensajes repetitivos de clientes. Pierdes el 60% de tus ventas por demora.",
          "💡 LA SOLUCIÓN: Montar un Multicanal Inteligente. No es un chatbot tonto, es un agente entrenado con tus FAQs de marca.",
          "🛡️ RESULTADOS REALES: Respuestas en menos de 10 segundos, cotizaciones automáticas creadas de inmediato y 3 veces más leads captados.",
          "🎯 PLAN DE ACCIÓN: 1. Define tu contexto de FAQs. 2. Enlaza OmniAgent a WhatsApp. 3. Duplica tu rentabilidad hoy mismo. ¿Te sumas?"
        ];
        const thread = [
          "🧵 1/5 ¿Sigues respondiendo chats manualmente a las 2 AM? Estás dejando miles de dólares en la mesa. Así es como la automatización inteligente de IA puede triplicar tus conversiones en piloto automático 👇",
          "⚡ 2/5 El cliente moderno no espera más de 3 minutos. Si tardas en contestar un WhatsApp, ya le compró a tu competencia. Un chatbot tradicional espanta; un clon de IA entrenado convierte leads en segundos.",
          "⚙️ 3/5 Configura un contexto de FAQs limpio, detalla tus ofertas, envíos y políticas. OmniAgent Pro lee tus PDFs, clona tu estilo de ventas y responde en tiempo real sin equivocarse jamás.",
          "💲 4/5 ¿Lo mejor? Puedes automatizar los enlaces de cobro con Stripe integrados directamente en el chat. Captación, persuasión y facturación 100% digital en piloto automático.",
          "🚀 5/5 Es hora de poner a trabajar la tecnología para ti mientras descansas o creas nuevas ofertas. ¿Listo para escalar de verdad en español? Entra a Wentix y activa tu OmniAgent Pro ahora mismo."
        ];

        setGeneratedSlides(slides);
        setGeneratedThread(thread);
        setCarouselSlideIndex(0);
        setIsGeneratingCarousel(false);
        setCarouselStep(0);
        onShowToast("✨ ¡Guión visual de Carrusel e Hilo viral de contenido creado!");
      }, 1500);
    }, 1200);
  };

  // Launch WhatsApp Agent simulation
  const handleInitAgent = () => {
    if (!waContext.trim()) {
      onShowToast("Ingresa el contexto de tu negocio");
      return;
    }

    setIsAgentRunning(true);
    setChatbotMessages([
      { sender: "agent", text: waGreeting, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    onShowToast("🟢 Agente de prueba encendido. ¡Envía un mensaje al chat!");
  };

  // Send message inside WhatsApp Simulator
  const handleSendWaMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || !isAgentRunning) return;

    const userMsg = userChatInput;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatbotMessages(prev => [...prev, { sender: "user", text: userMsg, time: nowStr }]);
    setUserChatInput("");
    setIsAgentTyping(true);

    // AI Persuasive dynamic responses based on context and message matching
    setTimeout(() => {
      let reply = "¡Hola! Estoy analizando tu pregunta para brindarte la mejor información de inmediato.";
      const query = userMsg.toLowerCase();

      // Simple contextual parsing for the demo matching
      if (query.includes("precio") || query.includes("cuesta") || query.includes("costo") || query.includes("cuánto") || query.includes("dólares") || query.includes("venden")) {
        reply = `¡Claro que sí! 🤩 El costo de nuestros calzados ZenStride es de solo $49 USD. Es una inversión única para proteger tus articulaciones y elevar tu rendimiento o comodidad. ¿Te gustaría que te envíe el enlace de pago seguro para asegurar los tuyos hoy?`;
      } else if (query.includes("gratis") || query.includes("envio") || query.includes("envío") || query.includes("despacho")) {
        reply = `¡Ofrecemos envío 100% GRATIS a todo tu sector! 🚚💨 Despachamos de forma ultrarrápida, por lo que tus ZenStride te llegarán en tiempo récord. ¿A qué dirección de destino te gustaría despacharlos?`;
      } else if (query.includes("garantia") || query.includes("garantía") || query.includes("devolucion") || query.includes("cambio")) {
        reply = `Totalmente confiable. 💪 Tienes 30 días garantizados de devolución completa si no te encantan tus calzados, además de política ágil de cambios de talla asegurado. ¡Queremos que camines feliz!`;
      } else if (query.includes("comprar") || query.includes("quiero uno") || query.includes("quiero comprar") || query.includes("ordenar")) {
        reply = `¡Excelente elección! 🚀 Para procesar tu pedido de ZenStride de inmediato a $49 con Envío Gratis, por favor ingresa tus datos o haz clic en este enlace simulado para finalizar de inmediato con total seguridad:

🔗 [ENLACE_PROCESAR_PEDIDO_ZENSTRIDE]

¿Qué talla y color prefieres para tus calzados?`;
      } else {
        reply = `¡Entiendo perfectamente! Respecto a lo que me preguntas, déjame decirte que nuestro producto destaca exactamente para eso. Te ofrecemos tecnología de amortiguación activa ZenStride, un calzado de peso pluma y los mejores estándares de materiales por solo $49.

¿Quieres que te guíe para elegir tu talla ideal en este momento? 👟`;
      }

      setChatbotMessages(prev => [...prev, { sender: "agent", text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsAgentTyping(false);
    }, 1500);
  };

  // Copy to clipboard helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast("📋 ¡Copiado al portapapeles con éxito!");
  };

  // Open Checkout Modal
  const handleOpenCheckout = (app: SaaSApp, type: "monthly" | "lifetime") => {
    const price = type === "monthly" ? app.pricingMonthly : app.pricingLifetime;
    setCheckoutApp({ app, type, price });
    setCardHolder("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setPaymentStep("idle");
  };

  // Submit payment checkout
  const handleProcessCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardHolder.trim() || !cardNumber.trim()) {
      onShowToast("Llena los campos requeridos para simular la compra.");
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStep("running");

    // Simulate luxury transaction
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentStep("success");
      const licenseKey = `WNTX-${checkoutApp?.app.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}-KEY`;
      setGeneratedLicense(licenseKey);

      // Save activated license in local state
      if (checkoutApp) {
        setActiveLicenses(prev => ({
          ...prev,
          [checkoutApp.app.id]: { type: checkoutApp.type, key: licenseKey }
        }));

        // Add backer to parent dashboard to reward interactive user!
        onAddBacker({
          id: Date.now().toString(),
          name: `${cardHolder} (Licenciado)`,
          amount: checkoutApp.price,
          message: `🔥 Activó la Licencia de ${checkoutApp.app.name} (${checkoutApp.type === 'lifetime' ? 'De por vida' : 'Mensual'})!`,
          date: new Date().toISOString().split("T")[0]
        });
      }
      onShowToast("🎉 ¡Pago simulado procesado! Licencia premium activada.");
    }, 2500);
  };

  const IS_STORE_DISABLED = true;

  if (IS_STORE_DISABLED) {
    return (
      <div className="py-16 px-4 max-w-3xl mx-auto text-center space-y-8 animate-fade-in" id="wentix-saas-premium-store">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-amber-950/20 border border-amber-500/30 text-amber-400 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-amber-500/5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>Mantenimiento & Selección</span>
        </div>

        <div className="relative max-w-lg mx-auto">
          {/* Subtle light effect */}
          <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />
          
          <div className="relative p-8 md:p-12 rounded-3xl bg-neutral-950 border border-white/5 shadow-2xl backdrop-blur-md space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight font-display uppercase">
                Tienda en Reconfiguración
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono tracking-widest">
                MÓDULO DESHABILITADO TEMPORALMENTE
              </p>
            </div>

            <p className="text-xs sm:text-sm text-neutral-350 leading-relaxed font-sans max-w-md mx-auto">
              Estamos definiendo el catálogo óptimo de <strong className="text-white">Bots Autónomos Premium</strong>, herramientas automatizadas y SaaS exclusivos que subiremos en Wentix. Mientras seleccionamos las mejores soluciones para despegar tu facturación, te invitamos a explorar las secciones gratuitas.
            </p>

            <div className="pt-2">
              <div className="inline-block p-3 bg-neutral-900/60 rounded-2xl border border-white/5 text-[10px] sm:text-xs font-mono text-neutral-405">
                🚀 ¡Pronto estará de vuelta con automatizaciones increíbles!
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10" id="wentix-saas-premium-store">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
              ESTUDIO DE SAAS Y CHATBOTS AUTÓNOMOS
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-display flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-cyan-400 shrink-0" />
            Venta de Herramientas Premium y Bots de IA
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-3xl font-sans">
            Adquiere acceso e instala micro-SaaS listos en tu negocio o clona estas herramientas para venderlas a tus propios clientes locales. Incluye <strong className="text-neutral-200">simuladores interactivos en vivo</strong> para testear la potencia del motor tecnológico antes de licenciar.
          </p>
        </div>

        <div className="flex bg-neutral-900/60 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setStoreTab("catalogo")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${storeTab === "catalogo" ? "bg-cyan-500 text-black font-extrabold" : "text-neutral-400 hover:text-white"}`}
          >
            Catálogo & Demos
          </button>
          <button
            onClick={() => setStoreTab("mis-licencias")}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-medium transition-all relative flex items-center gap-1.5 ${storeTab === "mis-licencias" ? "bg-cyan-500 text-black font-extrabold" : "text-neutral-400 hover:text-white"}`}
          >
            Mis Licencias
            {Object.keys(activeLicenses).length > 0 && (
              <span className="absolute -top-1.5 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                {Object.keys(activeLicenses).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* RENDER VIEW TAB: CATALOGO */}
      {storeTab === "catalogo" ? (
        <div className="space-y-12">
          
          {/* SECCIÓN ESPECIALIZADA: SUITE DE AUTOMATIZACIÓN DE REDES SOCIALES */}
          <div className="bg-gradient-to-b from-[#0c0d14] to-[#040407] border border-amber-500/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.04)] text-left space-y-6">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-black tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2.5 py-0.5 rounded-full animate-pulse">
                    MÓDULO EXCLUSIVO DE CRECIMIENTO ORGÁNICO
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2 font-display">
                  <Bot className="w-6 h-6 text-amber-400 shrink-0" />
                  Suite Autónoma de Automatización Social (SocialFlow Pro)
                </h3>
                <p className="text-xs text-neutral-400 max-w-2xl font-sans">
                  Robotiza el engagement, autocommenting, likes de prospección e interacciones cruzadas en X/Twitter, Instagram y LinkedIn 24/7. Genera valor de marca sin perder tu valioso tiempo.
                </p>
              </div>

              {/* Botón CTA Adquirir Licencia */}
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col items-center md:items-end justify-center gap-1 shrink-0">
                <span className="text-[9px] font-mono text-neutral-500 uppercase">Licencia SocialFlow Pro</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-amber-400 font-mono">$24 <span className="text-[10px] text-zinc-500 font-normal">/mes</span></span>
                  <span className="text-xs text-neutral-400 font-mono">o</span>
                  <span className="text-sm font-extrabold text-white font-mono">$119 <span className="text-[10px] text-zinc-500 font-normal">de por vida</span></span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleOpenCheckout(getAppById("saas-social-bot"), "monthly")}
                    className="px-3 py-1 bg-neutral-900 border border-white/10 text-[9.5px] font-mono text-zinc-300 rounded-lg hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Prueba ($24/m)
                  </button>
                  <button
                    onClick={() => handleOpenCheckout(getAppById("saas-social-bot"), "lifetime")}
                    className="px-3.5 py-1 bg-gradient-to-r from-amber-500 to-amber-600 font-bold text-[9.5px] font-mono text-black rounded-lg hover:brightness-110 transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/15"
                  >
                    <Zap className="w-3 h-3 text-black shrink-0" />
                    <span>Licenciar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard interactivo simulando terminal y feeds */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Controles de Configuración de Campaña de Tráfico (Col-span 5) */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest">
                      🎯 Hashtags y Cuentas Competidoras a Escuchar
                    </label>
                    <input
                      type="text"
                      value={socialKeywords}
                      onChange={(e) => setSocialKeywords(e.target.value)}
                      placeholder="#marketing, #ia, @competidor_handles..."
                      className="w-full text-xs font-mono bg-neutral-900 border border-white/5 focus:border-amber-500/30 rounded-xl p-3 text-neutral-250 outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-widest">
                      🎭 Tono de Generación de Comentarios (Smart AI)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Educativo & Persuasivo", "Divertido & Casual", "Técnico & Directo"].map((theTone) => (
                        <button
                          key={theTone}
                          type="button"
                          onClick={() => setSocialBotTone(theTone)}
                          className={`py-2 text-[9.5px] rounded-lg border font-mono transition-all text-center cursor-pointer ${
                            socialBotTone === theTone 
                              ? "border-amber-500/45 bg-amber-950/20 text-amber-400 font-bold" 
                              : "border-white/5 bg-neutral-900/60 text-neutral-400 hover:text-white"
                          }`}
                        >
                          {theTone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interruptores de funcionalidades */}
                  <div className="space-y-2 pt-2 border-t border-white/5 font-sans">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-white/5">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10.5px] font-mono text-zinc-300">Auto-comentarios Inteligentes</span>
                      </div>
                      <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 bg-amber-900/60 text-amber-450 border border-amber-500/20 rounded font-black">AI ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-white/5 font-sans">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[10.5px] font-mono text-zinc-300">Auto-Like a post meta</span>
                      </div>
                      <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 bg-amber-900/60 text-amber-450 border border-amber-500/20 rounded font-black">AI ACTIVE</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-900/40 border border-white/5 font-sans">
                      <div className="flex items-center gap-2 flex-nowrap">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-[10.5px] font-mono text-zinc-300">Auto-DM de bienvenida & gancho</span>
                      </div>
                      <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 bg-amber-900/60 text-amber-450 border border-amber-500/20 rounded font-black">AI ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Big Switch button to Turn ON/OFF */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSocialBotActive(!isSocialBotActive);
                    onShowToast(isSocialBotActive ? "🔴 Robot de automatización desactivado." : "🟢 Robot encendido, escuchando redes...");
                  }}
                  className={`w-full py-3.5 rounded-xl font-bold font-mono tracking-wider text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                    isSocialBotActive 
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-red-500/10 border border-red-500/30" 
                      : "bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black shadow-amber-500/10"
                  }`}
                >
                  <Bot className={`w-4 h-4 shrink-0 ${isSocialBotActive ? "animate-bounce" : ""}`} />
                  <span>{isSocialBotActive ? "DETENER EXPANSIÓN ORGÁNICA 🔴" : "ENCENDER ROBOT SOCIAL AUTÓNOMO 🟢"}</span>
                </button>
              </div>

              {/* Monitor del Bot / Live Sandbox terminal (Col-span 7) */}
              <div className="lg:col-span-7 bg-[#09090d] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-[360px]">
                
                {/* Header status bar */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 items-center justify-center relative">
                      {isSocialBotActive ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-700" />
                      )}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                      <span>MONITOR SOCIALFLOW LIVE</span>
                      {isSocialBotActive && <span className="animate-pulse text-emerald-400 font-extrabold">[ESCUPiendo datos...]</span>}
                    </span>
                  </div>
                  
                  <span className="text-[8.5px] font-mono text-neutral-500 border border-white/10 px-2 py-0.5 rounded uppercase">
                    Wentix Multi-Server IP: ACTIVE
                  </span>
                </div>

                {/* Real-time ticks stats monitor row */}
                <div className="grid grid-cols-4 gap-2 pt-2 pb-2 bg-neutral-950 px-3 rounded-xl border border-white/5 font-mono text-center">
                  <div>
                    <span className="text-zinc-500 text-[8px] uppercase block">Comments</span>
                    <span className="text-xs font-bold text-white block">{socialBotStats.commentsSent}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] uppercase block">Likes Given</span>
                    <span className="text-xs font-bold text-amber-400 block">{socialBotStats.likesEmitted}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] uppercase block">DM Sent</span>
                    <span className="text-xs font-bold text-cyan-400 block">{socialBotStats.dmsDelivered}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[8px] uppercase block">Leads Captured</span>
                    <span className="text-xs font-black text-emerald-400 block animate-pulse">{socialBotStats.leadsCaptured}</span>
                  </div>
                </div>

                {/* Scrolling Logs Display Panel */}
                <div className="flex-1 overflow-y-auto space-y-2.5 py-3 pr-1 text-left scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                  {socialLogs.map((log) => {
                    return (
                      <div key={log.id} className="p-2.5 bg-neutral-900/60 rounded-xl border border-white/5 space-y-2 animate-fade-in relative overflow-hidden">
                        
                        {/* Channel Badge, Time & Handle header */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-300">
                            {log.channel === "twitter" && <span className="px-2 py-0.2 bg-sky-950 text-sky-450 border border-sky-500/20 rounded font-black text-[8px] uppercase">X / TWITTER</span>}
                            {log.channel === "instagram" && <span className="px-2 py-0.2 bg-pink-950 text-pink-400 border border-pink-500/20 rounded font-black text-[8px] uppercase">INSTAGRAM</span>}
                            {log.channel === "linkedin" && <span className="px-2 py-0.2 bg-blue-950 text-blue-400 border border-blue-500/20 rounded font-black text-[8px] uppercase font-mono">LINKEDIN</span>}
                            <span className="text-neutral-200">{log.user}</span>
                          </div>
                          
                          <span className="text-[8.5px] text-neutral-500 font-mono font-semibold">{log.time}</span>
                        </div>

                        {/* Scraped incoming user post */}
                        <div className="text-[11px] text-neutral-400 italic bg-black/40 p-2 rounded-lg leading-relaxed font-sans font-medium">
                          "{log.text}"
                        </div>

                        {/* Completed autonomous execution log */}
                        <div className="bg-black/85 p-2 rounded-lg border border-white/5 font-mono text-[9px] text-zinc-400 space-y-1.5">
                          <p className="text-amber-400 flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-400" />
                            <span>Acción autónoma: {log.action}</span>
                          </p>
                          {log.commentText && (
                            <p className="text-neutral-300 pl-3.5 border-l border-amber-500/30 font-sans italic">
                              🤖 {log.commentText}
                            </p>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

                <div className="text-[9px] text-neutral-500 italic text-center font-mono">
                  {isSocialBotActive ? "● Robot activo detectando hilos de interés cada 3.5 segundos" : "Prácticas de demostración • Haz clic en 'Encender Robot' para ver la automatización en vivo"}
                </div>

              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SAAS CARDS CATALOG GRID (Left side, lg:col-span-5) */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <h3 className="text-xs font-bold text-neutral-400 font-mono uppercase tracking-widest mb-4 flex items-center gap-1">
              <span>Selecciona una herramienta para probar en vivo</span>
            </h3>

            {PREMIUM_SAAS_LIST.map((app) => {
              const IconComponent = app.lucideIcon;
              const isLicensed = !!activeLicenses[app.id];
              const isSelected = activeDemoAppId === app.id;

              return (
                <div 
                  key={app.id}
                  onClick={() => setActiveDemoAppId(app.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isSelected 
                      ? `bg-neutral-900 border-cyan-500 shadow-[0_0_25px_rgba(0,240,255,0.08)]` 
                      : "bg-neutral-950/80 border-white/5 hover:border-white/10 hover:bg-neutral-900/60"
                  }`}
                >
                  {/* Badge position */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {isLicensed && (
                      <span className="text-[8px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/35">
                        Licencia Activa
                      </span>
                    )}
                    <span className="text-[8px] font-bold uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/25">
                      {app.badge}
                    </span>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl border shrink-0 ${app.accentColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 pr-12">
                      <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                        {app.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11.5px] text-neutral-400 leading-relaxed mt-4 font-sans">
                    {app.description}
                  </p>

                  {/* Highlights list snippet */}
                  <ul className="mt-4 space-y-1.5 pt-4 border-t border-white/5">
                    {app.features.slice(0, 2).map((feat, idx) => (
                      <li key={idx} className="text-[10.5px] text-neutral-300 flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buying Buttons Area */}
                  <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 bg-black/20 p-3 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Licencia Completa</span>
                      <span className="text-sm font-extrabold text-white font-mono">
                        ${app.pricingLifetime} <span className="text-[9.5px] font-normal text-neutral-400">único</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCheckout(app, "monthly");
                        }}
                        className="px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200 text-[10px] font-mono font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Suscripción (${app.pricingMonthly}/m)
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenCheckout(app, "lifetime");
                        }}
                        className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-extrabold rounded-lg font-mono transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Comprar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE LIVE SIMULATOR (Right side, lg:col-span-7) */}
          <div className="col-span-1 lg:col-span-7 bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden min-h-[500px]">
            {/* Ambient Background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* SIMULATOR 1: SHORTBLAST AUTO-RENDER POSTER */}
            {activeDemoAppId === "saas-multipost" && (
              <div className="space-y-6 relative" id="simulator-shortblast">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-cyan-950/60 text-cyan-400 border border-cyan-500/30 rounded-xl shrink-0">
                      <Video className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-bold block uppercase">Mesa de Pruebas</span>
                      <h3 className="text-base font-bold text-white tracking-tight">Simulador ShortBlast Multi-Social</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                    PRODUCE Y EXPIDE EN VIVO
                  </span>
                </div>

                {!videoDemoResult ? (
                  <form onSubmit={handleRunVideoDemo} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                        1. Guión o Idea Principal del Micro-Video
                      </label>
                      <textarea
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        className="w-full text-xs font-sans bg-neutral-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-cyan-500 text-neutral-200 resize-none h-20"
                        placeholder="Ingresa la temática general..."
                        disabled={isPlayingVideoDemo}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                          2. Locutor de voz Inteligente
                        </label>
                        <select
                          value={videoVoice}
                          onChange={(e) => setVideoVoice(e.target.value)}
                          className="w-full text-xs bg-neutral-900 border border-white/5 rounded-xl p-3 text-neutral-300 focus:outline-none"
                          disabled={isPlayingVideoDemo}
                        >
                          <option>Voz Masculina Profesional (IA)</option>
                          <option>Voz Femenina Dinámica (IA)</option>
                          <option>Voz Cinematográfica Grave</option>
                          <option>Voz Energética con Entonación Latina</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                          3. Relación de Aspecto
                        </label>
                        <select
                          value={videoRatio}
                          onChange={(e) => setVideoRatio(e.target.value)}
                          className="w-full text-xs bg-neutral-900 border border-white/5 rounded-xl p-3 text-neutral-300 focus:outline-none"
                          disabled={isPlayingVideoDemo}
                        >
                          <option>9:16 (TikTok, Reels, Shorts)</option>
                          <option>16:9 (YouTube Standard)</option>
                          <option>1:1 (Post de Instagram/LinkedIn-X)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPlayingVideoDemo}
                      className="w-full py-3 bg-linear-to-r from-cyan-400 to-purple-500 hover:brightness-110 font-bold font-mono text-black text-xs tracking-wider rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isPlayingVideoDemo ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Simulando renderizado ({videoProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 text-black" />
                          <span>Generar Video y Desplegar Post ✨</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-white">¡Ruta de publicación finalizada de forma exitosa!</p>
                          <p className="text-[10px] text-neutral-400 font-mono">Expedido a las {videoDemoResult.date}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setVideoDemoResult(null)}
                        className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-[10px] font-mono text-neutral-300 border border-white/5 cursor-pointer"
                      >
                        Crear Nuevo
                      </button>
                    </div>

                    {/* Simulating phone mockups side-by-side with ticking counters */}
                    <div className="space-y-3.5">
                      <h4 className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold border-b border-white/5 pb-2">
                        Monitor de Métricas en Redes Sociales (Actualizado en tiempo real)
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* TikTok Card */}
                        <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl space-y-3 text-center">
                          <span className="text-[9px] font-mono bg-black text-white px-2 py-0.5 rounded border border-white/10 font-bold uppercase">
                            🎵 TIKTOK ACTIVE
                          </span>
                          <div className="space-y-1">
                            <span className="block text-lg font-bold text-white font-mono">
                              {mockStatsTikTok.views.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-neutral-400 block font-mono">Views simulados</span>
                          </div>
                          <div className="flex justify-center gap-4 text-[10px] text-neutral-400 font-mono pt-2 border-t border-white/5">
                            <span className="flex items-center gap-1">❤️ {mockStatsTikTok.likes}</span>
                            <span className="flex items-center gap-1">🔗 {mockStatsTikTok.shares}</span>
                          </div>
                        </div>

                        {/* Instagram Reels Card */}
                        <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl space-y-3 text-center">
                          <span className="text-[9px] font-mono bg-linear-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                            📸 INSTAGRAM REELS
                          </span>
                          <div className="space-y-1">
                            <span className="block text-lg font-bold text-white font-mono">
                              {mockStatsInsta.views.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-neutral-400 block font-mono">Views simulados</span>
                          </div>
                          <div className="flex justify-center gap-4 text-[10px] text-neutral-400 font-mono pt-2 border-t border-white/5">
                            <span className="flex items-center gap-1">❤️ {mockStatsInsta.likes}</span>
                            <span className="flex items-center gap-1">🔗 {mockStatsInsta.shares}</span>
                          </div>
                        </div>

                        {/* YouTube Shorts Card */}
                        <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl space-y-3 text-center">
                          <span className="text-[9px] font-mono bg-red-600 text-white px-2 py-0.5 rounded font-bold uppercase">
                            📺 YT SHORTS
                          </span>
                          <div className="space-y-1">
                            <span className="block text-lg font-bold text-white font-mono">
                              {mockStatsShorts.views.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-neutral-400 block font-mono">Views simulados</span>
                          </div>
                          <div className="flex justify-center gap-4 text-[10px] text-neutral-400 font-mono pt-2 border-t border-white/5">
                            <span className="flex items-center gap-1">❤️ {mockStatsShorts.likes}</span>
                            <span className="flex items-center gap-1">🔗 {mockStatsShorts.shares}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-900 border border-white/5 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <Terminal className="text-cyan-400 w-4 h-4 shrink-0" />
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-black">
                          LOG DE SALIDA DE COLA
                        </span>
                      </div>
                      <div className="space-y-1 bg-black p-3 rounded-lg font-mono text-[10px] text-zinc-400 max-h-36 overflow-y-auto no-scrollbar">
                        <p className="text-emerald-400">⚡ [SYS] [OK] Render sequence initialized successfully.</p>
                        <p>[SYS] Guión procesado: "{videoDemoResult.prompt.substring(0, 50)}..."</p>
                        <p>[RENDER] Locución generada utilizando {videoDemoResult.voice}</p>
                        <p>[RENDER] Inserción de subtítulos dinámicos de colores completada.</p>
                        <p>[UPLOADER] Autenticando canal principal canal @WentixCreator...</p>
                        <p className="text-cyan-400">[CONNECTED] Token oAuth de YouTube Shorts - Sesión Abierta.</p>
                        <p className="text-cyan-400">[CONNECTED] API de Meta Reels - Publicación Aprobada.</p>
                        <p className="text-cyan-400">[CONNECTED] API de TikTok Business - Subida de fichero máster completada.</p>
                        <p className="text-emerald-400 font-black">✓ [OK] ¡Entregado de manera global de forma perfecta!</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress rendering states */}
                {isPlayingVideoDemo && (
                  <div className="space-y-2 bg-neutral-900 border border-white/5 p-4 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                      <span>Consola de Renderizado en la Nube</span>
                      <span>{videoProgress}%</span>
                    </div>
                    <div className="w-full bg-neutral-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-linear-to-r from-cyan-400 to-purple-500 h-1.5 rounded-full transition-all duration-300" 
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                    <div className="text-[9.5px] font-mono text-neutral-400 pt-1 space-y-1 h-20 overflow-y-auto no-scrollbar">
                      {videoSteps.slice(0, Math.floor((videoProgress / 100) * videoSteps.length) + 1).map((stp, idx) => (
                        <p key={idx} className="animate-pulse">{stp}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SIMULATOR 2: CONTENT MACHINE CAROUSEL & THREADS */}
            {activeDemoAppId === "saas-content" && (
              <div className="space-y-6 relative" id="simulator-carousel">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-purple-950/60 text-purple-400 border border-purple-500/30 rounded-xl shrink-0">
                      <Layers className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] text-purple-400 font-mono tracking-wider font-bold block uppercase">Estudio Editorial</span>
                      <h3 className="text-base font-bold text-white tracking-tight">Simulador Content Machine Carousel</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                    TEXTO A DISEÑO EN SEGUNDOS
                  </span>
                </div>

                {generatedSlides.length === 0 && !isGeneratingCarousel ? (
                  <form onSubmit={handleRunCarouselDemo} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                        Concepto base, Guión o URL de entrada
                      </label>
                      <textarea
                        value={carouselSource}
                        onChange={(e) => setCarouselSource(e.target.value)}
                        className="w-full text-xs font-sans bg-neutral-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-purple-500 text-neutral-200 resize-none h-24"
                        placeholder="Ingresa de qué quieres que hable el carrusel y el hilo de Twitter..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                        Paleta y Estilo Visual del Carrusel (Instalable)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCarouselStyle("Tech Minimalist Dark")}
                          className={`p-3 text-xs rounded-xl border font-mono transition-all text-left ${carouselStyle === "Tech Minimalist Dark" ? "border-purple-500 bg-purple-950/20 text-white" : "border-white/5 bg-neutral-900 text-neutral-400"}`}
                        >
                          🌌 Minimalist Dark
                        </button>
                        <button
                          type="button"
                          onClick={() => setCarouselStyle("Cyberpunk Cyan-Yellow")}
                          className={`p-3 text-xs rounded-xl border font-mono transition-all text-left ${carouselStyle === "Cyberpunk Cyan-Yellow" ? "border-purple-500 bg-purple-950/20 text-white" : "border-white/5 bg-neutral-900 text-neutral-400"}`}
                        >
                          🛸 Cyberpunk Accent
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-purple-600 hover:bg-purple-500 font-bold font-mono text-white text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span>Generar Carrusel & Hilos Virales ✨</span>
                    </button>
                  </form>
                ) : null}

                {/* Loading state rendering */}
                {isGeneratingCarousel && (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-purple-405 animate-spin" />
                    <div className="text-center">
                      <p className="text-xs font-mono font-bold text-white">Generando guión visual y dividiendo slides...</p>
                      <p className="text-[10px] font-mono text-neutral-500 mt-1">Estructurando hooks virales de lectura rápida</p>
                    </div>
                  </div>
                )}

                {/* Slides and Threads results panel */}
                {generatedSlides.length > 0 && !isGeneratingCarousel && (
                  <div className="space-y-6">
                    {/* Visual Slide graphic mockup slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold border-b border-white/5 pb-2">
                        <span>Carrusel Estético Creado ({carouselSlideIndex + 1}/5)</span>
                        <button 
                          onClick={() => setGeneratedSlides([])} 
                          className="hover:text-red-400 px-2 cursor-pointer outline-none"
                        >
                          Limpiar
                        </button>
                      </div>

                      <div 
                        className={`aspect-video rounded-2xl p-8 flex flex-col justify-between border relative overflow-hidden transition-all duration-300 select-none ${
                          carouselStyle === "Tech Minimalist Dark" 
                            ? "bg-[#0a0a10] border-purple-500/30 text-white" 
                            : "bg-[#030d1a] border-cyan-500/30 text-white"
                        }`}
                      >
                        {/* Decorative layout lines */}
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-linear-to-r from-purple-500 via-pink-500 to-cyan-500" />
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 blur-xl rounded-full" />
                        
                        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500">
                          <span>WENTIX CAROUSEL ENGINE AI</span>
                          <span>HOV SLIDE_0{carouselSlideIndex + 1}</span>
                        </div>

                        <div className="my-auto">
                          <p className={`font-display text-white text-base sm:text-lg font-extrabold tracking-tight leading-relaxed max-w-2xl`}>
                            {generatedSlides[carouselSlideIndex]}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-white/5 text-[9.5px] font-mono text-neutral-400">
                          <span>@WentixEcosistema</span>
                          <span className="bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-white">Desliza para ver más →</span>
                        </div>
                      </div>

                      {/* Slider dots buttons */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-1.5">
                          {generatedSlides.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCarouselSlideIndex(idx)}
                              className={`h-2 rounded-full transition-all cursor-pointer ${carouselSlideIndex === idx ? "w-6 bg-purple-500" : "w-2 bg-neutral-800"}`}
                            />
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setCarouselSlideIndex(p => Math.max(0, p - 1))}
                            disabled={carouselSlideIndex === 0}
                            className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-xs font-mono text-white border border-white/5 cursor-pointer disabled:opacity-40"
                          >
                            Atrás
                          </button>
                          <button
                            onClick={() => setCarouselSlideIndex(p => Math.min(generatedSlides.length - 1, p + 1))}
                            disabled={carouselSlideIndex === generatedSlides.length - 1}
                            className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 rounded-lg text-xs font-mono text-white border border-white/5 cursor-pointer disabled:opacity-40"
                          >
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Twitter thread list */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Twitter className="w-4 h-4 text-sky-400" />
                          <span>Hilo de Twitter (X) Viral Generado</span>
                        </label>
                        <button
                          onClick={() => handleCopyText(generatedThread.join("\n\n"))}
                          className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" /> Copiar Hilo Completo
                        </button>
                      </div>

                      <div className="space-y-3 bg-neutral-900 p-4 rounded-xl border border-white/5 max-h-56 overflow-y-auto no-scrollbar">
                        {generatedThread.map((thr, idx) => (
                          <div key={idx} className="p-3 bg-black/40 rounded-lg space-y-1 border border-white/5 text-xs text-neutral-300">
                            <p className="font-mono text-[9px] text-[#00f0ff] font-extrabold pb-1">Tweet {idx + 1}/5</p>
                            <p className="font-sans leading-relaxed">{thr}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SIMULATOR 3: WHATSAPP OMNI-AGENT PRO */}
            {activeDemoAppId === "saas-whatsapp" && (
              <div className="space-y-6 relative" id="simulator-whatsapp">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-xl shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-bold block uppercase">Sandbox Automatizador</span>
                      <h3 className="text-base font-bold text-white tracking-tight">Simulador OmniAgent WhatsApp</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                    MÁQUINA EXPEDIDORA DE RESPUESTAS
                  </span>
                </div>

                {!isAgentRunning ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                        1. Contextualización del Negocio o FAQ Base
                      </label>
                      <textarea
                        value={waContext}
                        onChange={(e) => setWaContext(e.target.value)}
                        className="w-full text-xs font-sans bg-neutral-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-neutral-200 resize-none h-20"
                        placeholder="Ingresa qué vende, precios, de qué país es, envío, etc..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-neutral-400 font-mono uppercase tracking-wider">
                        2. Saludo Inicial del Agente IA al Cliente
                      </label>
                      <input
                        type="text"
                        value={waGreeting}
                        onChange={(e) => setWaGreeting(e.target.value)}
                        className="w-full text-xs font-sans bg-neutral-900 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-neutral-200"
                        placeholder="Ej. ¡Hola! Soy el asistente de la tienda ¿Cómo te puedo ayudar?"
                      />
                    </div>

                    <button
                      onClick={handleInitAgent}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 font-bold font-mono text-white text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      <Play className="w-4 h-4 text-white" />
                      <span>Configurar y Encender Agente IA 🟢</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                        <span className="text-[10.5px] font-bold text-emerald-300 font-mono">AGENTE DE WHATSAPP EN LÍNEA SIMULADO</span>
                      </div>
                      <button
                        onClick={() => setIsAgentRunning(false)}
                        className="px-2.5 py-1 bg-black/40 hover:bg-black text-[9.5px] text-neutral-300 font-mono rounded-lg border border-white/10 cursor-pointer"
                      >
                        Re-configurar
                      </button>
                    </div>

                    {/* Chat interface mock */}
                    <div className="bg-[#121b22] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[320px]">
                      {/* WhatsApp Header channel */}
                      <div className="bg-[#202c33] p-3 border-b border-white/5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600/60 border border-emerald-400 text-white font-black text-xs flex items-center justify-center uppercase font-mono">
                          ZS
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white font-sans flex items-center gap-1">
                            ZenStride Sales AI Agent
                            <span className="text-[8.5px] bg-emerald-900/60 border border-emerald-500/30 px-1 py-0.2 rounded text-emerald-300 font-mono">
                              AGENT
                            </span>
                          </p>
                          <p className="text-[9.5px] text-neutral-400 font-mono">{isAgentTyping ? "Escribiendo..." : "En línea"}</p>
                        </div>
                      </div>

                      {/* Chat messages body area */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col no-scrollbar">
                        {chatbotMessages.map((msg, idx) => (
                          <div 
                            key={idx}
                            className={`p-2.5 rounded-xl text-xs max-w-sm relative ${
                              msg.sender === "agent" 
                                ? "bg-[#202c33] text-neutral-100 self-start border border-white/5 rounded-tl-none font-sans" 
                                : "bg-[#0b141a] text-white self-end rounded-tr-none border border-emerald-500/20 font-sans"
                            }`}
                          >
                            <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                            <span className="text-[8.5px] text-neutral-500 text-right block pt-1 font-mono">{msg.time}</span>
                          </div>
                        ))}

                        {isAgentTyping && (
                          <div className="p-2.5 bg-[#202c33] text-neutral-400 rounded-xl rounded-tl-none text-xs self-start flex items-center gap-1 select-none font-mono">
                            <span>OmniAgent está redactando</span>
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                          </div>
                        )}
                      </div>

                      {/* Message Typing Panel */}
                      <form onSubmit={handleSendWaMessage} className="bg-[#202c33] p-2 flex gap-2 border-t border-white/5">
                        <input
                          type="text"
                          value={userChatInput}
                          onChange={(e) => setUserChatInput(e.target.value)}
                          placeholder="Simula ser cliente: 'Hola, ¿tienen talla 42? ¿cuánto cuesta?'..."
                          className="flex-1 bg-[#2a3942] border-none rounded-xl px-3 text-xs text-white placeholder-neutral-400 focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                    <p className="text-[10px] text-neutral-500 italic text-center">
                      * El sandbox simula el comportamiento exacto que los leads verán en vivo en sus WhatsApps. Tienes acceso completo para probarlo.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SIMULATOR 4: SOCIAL FLOW LIVE MONITOR LINK */}
            {activeDemoAppId === "saas-social-bot" && (
              <div className="space-y-6 relative text-left bg-gradient-to-b from-amber-950/10 to-neutral-950 p-6 sm:p-8 rounded-3xl border border-amber-500/10" id="simulator-socialflow-detail">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-amber-950/60 text-amber-400 border border-amber-500/30 rounded-xl shrink-0">
                      <Bot className="w-5 h-5 text-amber-400" />
                    </span>
                    <div>
                      <span className="text-[10px] text-amber-500 font-mono tracking-wider font-bold block uppercase">Sandbox Multiredes</span>
                      <h3 className="text-base font-bold text-white tracking-tight">SocialFlow Auto-Bot Pro</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                    TERMINAL EN TIEMPO REAL
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Esta herramienta dispone de un panel principal interactivo y monitor a pantalla completa en la sección superior para que puedas apreciar el flujo de automatización sin saturar el espacio.
                  </p>
                  
                  <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-3">
                    <span className="text-[9.5px] uppercase font-mono text-amber-400 font-bold">🎯 Estado Rápido del Robot:</span>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono font-bold">
                      <div className="bg-neutral-950 p-2 rounded-lg text-left">
                        <span className="text-neutral-500 text-[9px] block">Motor de Escucha:</span>
                        <span className={isSocialBotActive ? "text-emerald-400 font-black animate-pulse" : "text-neutral-550 font-medium"}>
                          {isSocialBotActive ? "● ACTIVO" : "○ INACTIVO"}
                        </span>
                      </div>
                      <div className="bg-neutral-950 p-2 rounded-lg text-left">
                        <span className="text-neutral-500 text-[9px] block">Tono del Bot:</span>
                        <span className="text-white font-black">{socialBotTone}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const section = document.getElementById("simulator-socialflow");
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }
                      onShowToast("Enfocando panel exclusivo superior de SocialFlow...");
                    }}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold font-mono text-xs tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  >
                    <Bot className="w-4 h-4 text-black shrink-0" />
                    <span>Ir a Configuración & Terminal Superior ↑</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      ) : (
        /* TAB: MY COMPLETED LICENSES (storeTab === "mis-licencias") */
        <div className="space-y-6">
          {Object.keys(activeLicenses).length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-white/5 bg-neutral-950 max-w-2xl mx-auto space-y-4">
              <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-neutral-300 font-bold tracking-tight">No tienes licencias activas todavía</h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Entra al Catálogo de Demos, testea las herramientas y adquiere una suscripción de prueba para activar accesos permanentes.
                </p>
              </div>
              <button
                onClick={() => setStoreTab("catalogo")}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl font-mono transition-colors cursor-pointer"
              >
                Volver al Catálogo de Demos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(activeLicenses).map((appId) => {
                const app = getAppById(appId);
                const licenseDetails = activeLicenses[appId];
                const IconComponent = app.lucideIcon;

                return (
                  <div key={appId} className="p-6 bg-neutral-950/90 rounded-2xl border border-emerald-500/20 relative space-y-4">
                    <div className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </div>

                    <div className="flex gap-3 items-center">
                      <div className={`p-2 rounded-xl border shrink-0 ${app.accentColor}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{app.name}</h4>
                        <span className="text-[9px] font-mono text-emerald-400 block font-semibold">LICENCIA PREMIUM HABILITADA</span>
                      </div>
                    </div>

                    <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Tipo Adquisición:</span>
                        <span className="text-neutral-200 capitalize font-bold">{licenseDetails.type === "lifetime" ? "Compra Vitalicia (De por vida)" : "Suscripción Mensual"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Clave de Licencia:</span>
                        <span className="text-cyan-400 font-extrabold flex items-center gap-1">
                          {licenseDetails.key}
                          <button 
                            onClick={() => handleCopyText(licenseDetails.key)}
                            className="hover:text-white px-1 outline-none text-neutral-500"
                          >
                            <Copy className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Estado de Servidores:</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-bold">● OPERATIVO AI CORE</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setActiveDemoAppId(appId);
                          setStoreTab("catalogo");
                          onShowToast(`Abriendo el simulador premium de ${app.name}`);
                        }}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-cyan-500/30 text-xs font-mono text-cyan-400 rounded-xl transition-all cursor-pointer font-bold"
                      >
                        Administrar Sandbox & Integraciones
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* POPUP: GLOWING checkout TRANSACTION MODAL */}
      {checkoutApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0b0f] p-6 rounded-3xl border border-white/10 max-w-sm w-full relative space-y-6 shadow-[0_25px_60px_rgba(0,180,255,0.15)] overflow-hidden">
            {/* Visual Header Decoration */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-linear-to-r from-cyan-400 via-purple-500 to-emerald-500" />
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full" />

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block font-bold mb-1">Pasarela Segura (Simulación)</span>
                <h3 className="text-base font-bold text-white tracking-tight">Licenciar Herramienta</h3>
              </div>
              <button 
                onClick={() => setCheckoutApp(null)}
                className="p-1 px-2.5 hover:bg-neutral-900 border border-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {paymentStep === "idle" && (
              <form onSubmit={handleProcessCheckout} className="space-y-4">
                <div className="p-3 bg-neutral-900/60 rounded-xl space-y-1.5 border border-white/5">
                  <span className="text-[10px] uppercase font-mono text-zinc-400">Producto Seleccionado:</span>
                  <p className="text-xs font-bold text-white font-sans">{checkoutApp.app.name}</p>
                  <p className="text-[10px] text-neutral-400 font-mono">
                    Plan: <span className="text-cyan-400 font-bold uppercase">{checkoutApp.type === "lifetime" ? "Acceso de por vida" : "Suscripción Mensual"}</span>
                  </p>
                  <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neutral-500">Monto total simulado:</span>
                    <span className="text-sm font-extrabold text-white font-mono">${checkoutApp.price} USD</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Nombre del Titular</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Manuel Rocha"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full text-xs bg-neutral-900 border border-white/5 focus:border-cyan-500 rounded-lg p-2.5 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9.5px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Tarjeta de Crédito / Débito (Prueba)</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => {
                          // Simple formatting for simulated cards
                          const val = e.target.value.replace(/\D/g, "");
                          const matches = val.match(/\d{4,16}/g);
                          const match = (matches && matches[0]) || "";
                          const parts = [];
                          for (let i = 0, len = match.length; i < len; i += 4) {
                            parts.push(match.substring(i, i + 4));
                          }
                          if (parts.length > 0) {
                            setCardNumber(parts.join(" "));
                          } else {
                            setCardNumber(val);
                          }
                        }}
                        className="w-full text-xs bg-neutral-900 border border-white/5 focus:border-cyan-500 rounded-lg p-2.5 text-white focus:outline-none font-mono"
                      />
                      <CreditCard className="absolute right-3 top-3 w-4 h-4 text-neutral-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Vence</label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/AA"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full text-xs text-center bg-neutral-900 border border-white/5 focus:border-cyan-500 rounded-lg p-2.5 text-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[9.5px] font-bold text-neutral-400 font-mono uppercase tracking-wider">Cvv</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full text-xs text-center bg-neutral-900 border border-white/5 focus:border-cyan-500 rounded-lg p-2.5 text-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-cyan-500 hover:bg-cyan-400 font-bold font-mono text-black text-xs tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Confirmar Cobro Simulado (${checkoutApp.price} USD)
                </button>
                <p className="text-[8.5px] text-neutral-500 text-center uppercase tracking-wider">
                  ⚠️ ESTO ES UN INTEGRACIÓN SEGURA DE PRUEBA. NUNCA REGISTRE DATOS REALES DE SUS TARJETAS.
                </p>
              </form>
            )}

            {paymentStep === "running" && (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-xs font-mono font-bold text-white">AUTORIZANDO COBRO EN SISTEMA CO...</p>
                  <p className="text-[9.5px] font-mono text-neutral-500">Estableciendo túnel encriptado de prueba y validando fondos</p>
                </div>
              </div>
            )}

            {paymentStep === "success" && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-900/40 border border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white tracking-tight">¡Adquisición Activada!</h4>
                  <p className="text-xs text-neutral-400">Gracias Manuel. Has activado la licencia de servicio premium para tu negocio celular.</p>
                </div>

                <div className="bg-neutral-900 border border-white/5 p-3 rounded-lg text-left space-y-1 font-mono text-[9.5px] text-neutral-300">
                  <p><span className="text-neutral-500">Clave de Activación:</span> <span className="text-emerald-400 font-extrabold">{generatedLicense}</span></p>
                  <p><span className="text-neutral-500">Cliente ID:</span> <span className="text-neutral-300">WNTX-CLIENT-{Math.floor(100 + Math.random() * 900)}</span></p>
                </div>

                <button
                  onClick={() => {
                    setCheckoutApp(null);
                    setStoreTab("mis-licencias");
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
                >
                  Ir a Mis Licencias Premium
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
