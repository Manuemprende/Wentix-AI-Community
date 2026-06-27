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
  Heart,
  AlertTriangle,
  FileText,
  UploadCloud,
  CheckCircle2,
  Download,
  Search,
  Compass,
  Database,
  Server,
  TrendingDown,
  Star,
  Clock
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
  const [activeDemoAppId, setActiveDemoAppId] = useState<string>("saas-whatsapp-analyzer");

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
  // SIMULATOR 0 STATES: RADAR WENTIX AI WIND (WINNER)
  // ----------------------------------------------------
  const [radarCountry, setRadarCountry] = useState<"Todos" | "CL" | "CO" | "EC" | "GT">("Todos");
  const [radarSearchKeyword, setRadarSearchKeyword] = useState("");
  const [radarSelectedCategory, setRadarSelectedCategory] = useState<string>("Todos");
  const [radarSelectedSupplier, setRadarSelectedSupplier] = useState<string>("Todos");
  const [radarSelectedSorting, setRadarSelectedSorting] = useState<string>("Días vendiendo");
  const [radarSelectedProductId, setRadarSelectedProductId] = useState<string | null>(null);
  const [radarSimSidebarTab, setRadarSimSidebarTab] = useState<"productos" | "proveedores" | "anuncios" | "configuracion">("productos");
  
  // States for Radar Live Video Showcase
  const [radarVideoUrl, setRadarVideoUrl] = useState<string>("");
  const [radarVideoFile, setRadarVideoFile] = useState<string | null>(null);
  const [radarVideoName, setRadarVideoName] = useState<string>("");
  const [radarVideoPlaying, setRadarVideoPlaying] = useState(false);
  
  // Custom mock product objects that match the user screenshot exactly
  const [radarProducts, setRadarProducts] = useState([
    {
      id: "gt-1",
      rank: "#1283",
      change: "▼6",
      changeType: "down",
      country: "GT",
      name: "KINOKI DESINTOXICACION 20848-46",
      price: 59,
      cost: 23,
      currency: "GTQ",
      stock: 98,
      maxStock: 200,
      category: "BELLEZA",
      adsCount: 6,
      alert: "🔥 ¡Descuento de stock crítico: alta demanda local!",
      storeName: "DISTRIBUIDORA GT",
      dailySales: 15,
      growth: "61%",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=300",
      sparkSales: [14, 8, 20, 15, 12, 6]
    },
    {
      id: "cl-1",
      rank: "#45",
      change: "▼4",
      changeType: "down",
      country: "CL",
      name: "ANILLO DE PROMESA AJUSTABLE",
      price: 190,
      cost: 55,
      currency: "CLP",
      stock: 33,
      maxStock: 100,
      category: "BISUTERÍA",
      adsCount: 16,
      alert: "⚠️ Pocas unidades en bodega de Joyería Elite",
      storeName: "JOYERIA DE LA ELITE",
      dailySales: 22,
      growth: "71%",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=300",
      sparkSales: [5, 12, 4, 16, 8, 4]
    },
    {
      id: "ec-1",
      rank: "#36",
      change: "▲1",
      changeType: "up",
      country: "EC",
      name: "Set pulsera llave",
      price: 120,
      cost: 55,
      currency: "USD",
      stock: 1871,
      maxStock: 2500,
      category: "BISUTERÍA",
      adsCount: 5,
      alert: null,
      storeName: "JOYERIA DE LA ELITE",
      dailySales: 35,
      growth: "54%",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=300",
      sparkSales: [25, 28, 37, 3, 16, 1]
    },
    {
      id: "co-1",
      rank: "#10043",
      change: "▼45",
      changeType: "down",
      country: "CO",
      name: "AIRI - Vital Source Nutrition",
      price: 60,
      cost: 60,
      currency: "COP",
      stock: 4819,
      maxStock: 6000,
      category: "SALUD",
      adsCount: 53,
      alert: "🔥 Top ventas en Colombia hoy",
      storeName: "ALTAMIRA",
      dailySales: 112,
      growth: "89%",
      image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=300",
      sparkSales: [11, 40, 19, 53, 45, 17]
    },
    {
      id: "cl-2",
      rank: "#7426",
      change: "▼21",
      changeType: "down",
      country: "CL",
      name: "EVIL GOODS",
      price: 149,
      cost: 40,
      currency: "CLP",
      stock: 4893,
      maxStock: 8000,
      category: "SALUD",
      adsCount: 20,
      alert: null,
      storeName: "NATURAL LABS ORGANIC",
      dailySales: 89,
      growth: "73%",
      image: "https://images.unsplash.com/photo-1527960656366-ee2a999e32e6?auto=format&fit=crop&q=80&w=300",
      sparkSales: [68, 46, 20, 48, 21, 15]
    },
    {
      id: "co-2",
      rank: "#69746",
      change: "▼18",
      changeType: "down",
      country: "CO",
      name: "Polvo Limpiador De Drenaje",
      price: 1,
      cost: 810,
      currency: "COP",
      stock: 48628,
      maxStock: 60000,
      category: "COCINA",
      adsCount: 12,
      alert: "🔥 Limpieza profunda garantizada",
      storeName: "VIDA Y HOGAR SPA",
      dailySales: 74,
      growth: "65%",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300",
      sparkSales: [38, 58, 7, 12, 33, 18]
    },
    {
      id: "cl-3",
      rank: "#120738",
      change: "▼16",
      changeType: "down",
      country: "CL",
      name: "Crema Anti Verrugas",
      price: 1,
      cost: 2691,
      currency: "CLP",
      stock: 3418,
      maxStock: 5000,
      category: "BELLEZA",
      adsCount: 7,
      alert: "⭐ Novedad en el catálogo",
      storeName: "VIDA Y HOGAR SPA",
      dailySales: 45,
      growth: "90%",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=300",
      sparkSales: [12, 7, 7, 2, 16, 16]
    },
    {
      id: "cl-4",
      rank: "#4600",
      change: "▼9",
      changeType: "down",
      country: "CL",
      name: "Shampoo Batana Oil",
      price: 120,
      cost: 60,
      currency: "CLP",
      stock: 3924,
      maxStock: 5000,
      category: "BELLEZA",
      adsCount: 15,
      alert: "✨ Ideal para dropshipping estético",
      storeName: "NATURAL LABS ORGANIC",
      dailySales: 55,
      growth: "50%",
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=300",
      sparkSales: [23, 18, 6, 23, 9, 16]
    },
    {
      id: "cl-5",
      rank: "#86785",
      change: "▼8",
      changeType: "down",
      country: "CL",
      name: "Consola juego Retro M15",
      price: 1,
      cost: 19990,
      currency: "CLP",
      stock: 519,
      maxStock: 1000,
      category: "JUGUETERÍA",
      adsCount: 18,
      alert: "🔥 Alza en búsquedas Meta",
      storeName: "VIDA Y HOGAR SPA",
      dailySales: 24,
      growth: "80%",
      image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=300",
      sparkSales: [21, 18, 15, 14, 8, 8]
    },
    {
      id: "co-3",
      rank: "#4749",
      change: "▼6",
      changeType: "down",
      country: "CO",
      name: "Te Chino x 20",
      price: 120,
      cost: 60,
      currency: "COP",
      stock: 8481,
      maxStock: 10000,
      category: "BIENESTAR",
      adsCount: 16,
      alert: null,
      storeName: "NATURAL LABS ORGANIC",
      dailySales: 63,
      growth: "50%",
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=300",
      sparkSales: [13, 15, 31, 6, 17, 6]
    }
  ]);

  const [activeAdsSearchKeyword, setActiveAdsSearchKeyword] = useState<string | null>(null);
  const [isSearchingAds, setIsSearchingAds] = useState(false);
  const [adsResultsList, setAdsResultsList] = useState<Array<{ id: string; title: string; activeDays: number; copy: string; imgUrl: string; platform: string }>>([]);

  // ----------------------------------------------------
  // SIMULATOR 5 STATES: WHATSAPP SALES DECODER (GRATIS)
  // ----------------------------------------------------
  const [waConv1, setWaConv1] = useState("");
  const [waConv2, setWaConv2] = useState("");
  const [waConv3, setWaConv3] = useState("");
  
  const [waError1, setWaError1] = useState<string | null>(null);
  const [waError2, setWaError2] = useState<string | null>(null);
  const [waError3, setWaError3] = useState<string | null>(null);

  const [isAnalyzingWa, setIsAnalyzingWa] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStepLog, setAnalysisStepLog] = useState("");
  const [waAnalysisReport, setWaAnalysisReport] = useState<any | null>(null);

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
      id: "saas-whatsapp-analyzer",
      name: "WhatsApp Sales Decoder AI",
      tagline: "Auditor de Cierres de Ventas & Analizador Conversacional (100% GRATIS)",
      badge: "NUEVO",
      description: "Audita inmediatamente hasta 3 conversaciones de WhatsApp para detectar errores garrafales de cierre de ventas, medir la tasa de conversión, resolver pautas fallidas y obtener scripts correctores descargables.",
      pricingMonthly: 0,
      pricingLifetime: 0,
      rating: 4.99,
      accentColor: "border-emerald-500 text-emerald-400 bg-emerald-950/20 shadow-emerald-950/40",
      features: [
        "Identifica de inmediato si los archivos corresponden a chats reales de WhatsApp",
        "Audita en detalle 3 situaciones críticas: Sin Ventas, Con Ventas, y Sin Respuesta (Ghosted)",
        "Desglose meticuloso estructurado en puntos positivos primero y falencias negativas después",
        "Detección de cierres equivocados, falta de urgencia, y mala estructuración del valor",
        "Genera documentos / reportes de corrección completos listos para descargar o copiar"
      ],
      lucideIcon: MessageSquare
    },
    {
      id: "saas-radar-winner",
      name: "Radar Wentix AI Wind",
      tagline: "Extractor y Analizador de Productos Ganadores para Dropshipping Local",
      badge: "RECOMENDADO",
      description: "Escanea y detecta los productos que más se están vendiendo en tiempo real en Chile, Colombia, Ecuador y Guatemala. Monitorea el descuento de stock, analiza la velocidad de compra y comprueba anuncios de competidores activos con un solo clic.",
      pricingMonthly: 7, // represents the server fee in UI/billing, but with a note of $180 single payment
      pricingLifetime: 180,
      rating: 5.00,
      accentColor: "border-amber-500 text-amber-400 bg-amber-950/20 shadow-amber-950/40",
      features: [
        "Base de datos de volumen de ventas actualizada para Chile, Colombia, Ecuador y Guatemala 🗺️",
        "Escaner inteligente de stock promedio con cálculo y descuento en vivo (Velocidad de compra)",
        "Alertas automáticas de reabastecimiento o aumentos drásticos de stock competidor",
        "Análisis profundo de competidores calientes con enlaces directos integrados",
        "Acceso directo a la Biblioteca de Anuncios con palabras clave del producto principal",
        "Dominio incluido y auto-configurado por Wentix gratis (Soporte servidor de $7 USD/mes)"
      ],
      lucideIcon: Compass
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

  // ----------------------------------------------------
  // RADAR WENTIX AI WIND (WINNER DROPSHIPPING) EFFECTS
  // ----------------------------------------------------
  // Live stock discounting simulation
  useEffect(() => {
    const stockInterval = setInterval(() => {
      let selectedProduct: any = null;
      setRadarProducts(prevProducts => {
        // Find a random product index
        const idx = Math.floor(Math.random() * prevProducts.length);
        const updated = [...prevProducts];
        const p = updated[idx];
        
        // Random decrement between 1 and 3
        const dec = Math.floor(Math.random() * 3) + 1;
        const newStock = Math.max(5, p.stock - dec);
        
        updated[idx] = {
          ...p,
          stock: newStock,
          dailySales: p.dailySales + dec
        };
        
        selectedProduct = updated[idx];
        return updated;
      });
    }, 6000);

    return () => clearInterval(stockInterval);
  }, []);

  // Ads simulation effect
  useEffect(() => {
    if (!activeAdsSearchKeyword) {
      setAdsResultsList([]);
      return;
    }

    setIsSearchingAds(true);
    const adTimer = setTimeout(() => {
      // Mock some highly engaging ads based on research keyword
      const copies = [
        `🔥 ¡TENDENCIA 2026! 🚨 Quedan pocas unidades en bodega con DESCUENTO especial. Envío GRATUITO a domicilio + Opción de Pago Contra Entrega. ¡Compra aquí antes de que se agote! 📦👇`,
        `¿Buscas calidad y durabilidad? ❌ Olvida réplicas baratas. Consigue el original con 50% de DESCUENTO y paga al recibir en tu puerta. 🚚 Despacho express en 24-48 horas.`,
        `⭐ EL MÁS VENDIDO DE LA SEMANA ⭐ Pide HOY mismo desde casa. Ideal para modernizar tu espacio o regalárselo a alguien especial. 🇨🇱🇨🇴🇪🇨🇬🇹 Oferta por tiempo súper limitado.`
      ];

      const platforms = ["Facebook Ads Library", "Instagram Stories Ads", "TikTok Spark Ads"];

      const mockAds = [
        {
          id: "ad-1",
          title: `Meta Ads - Active Creative`,
          activeDays: Math.floor(Math.random() * 25) + 3,
          copy: copies[0],
          imgUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80",
          platform: platforms[0]
        },
        {
          id: "ad-2",
          title: `Instagram Placement - Reels`,
          activeDays: Math.floor(Math.random() * 14) + 1,
          copy: copies[1],
          imgUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
          platform: platforms[1]
        },
        {
          id: "ad-3",
          title: `TikTok Ads Manager - Video Feed`,
          activeDays: Math.floor(Math.random() * 8) + 2,
          copy: copies[2],
          imgUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
          platform: platforms[2]
        }
      ];

      setAdsResultsList(mockAds);
      setIsSearchingAds(false);
      onShowToast(`🎯 Se extrajeron anuncios de competidores activos para: "${activeAdsSearchKeyword}"`);
    }, 1500);

    return () => clearTimeout(adTimer);
  }, [activeAdsSearchKeyword]);

  // Method to simulate Restock or Trigger surge stock alerts
  const handleSimulateRestock = (productId: string) => {
    setRadarProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const added = Math.floor(Math.random() * 150) + 100;
        onShowToast(`⚡ Simulación: Re-stock de +${added} unidades aplicado a ${p.name}`);
        return {
          ...p,
          stock: p.stock + added,
          alert: `🚀 ¡Se detectó ingreso de mercadería: +${added} un.! (${new Date().toLocaleTimeString()})`
        };
      }
      return p;
    }));
  };

  // ----------------------------------------------------
  // HELPER METRICS AND EFFECTS FOR WHATSAPP ANALYZER
  // ----------------------------------------------------
  const validateWhatsAppFormat = (text: string): boolean => {
    if (!text || text.trim().length === 0) return true;
    const clean = text.trim();
    if (clean.length < 15) return false;
    
    // Check if the text contains speakers (at least one colon with a word/sender prefix)
    const hasSpeakers = /([A-Za-z0-9_\-\s]{2,15}\s*:)/.test(clean) || /\]\s*[A-Za-z0-0_\-\s]{2,15}\s*:/.test(clean);
    
    // Check for timestamps: brackets [12:34] or simple hours 12:34 or pm/am patterns
    const hasTime = /\b\d{1,2}[:.]\d{2}\b/.test(clean) || /\[\d{1,2}[:.]\d{2}/.test(clean) || /\b\d{1,2}-\d{1,2}-\d{2,4}\b/.test(clean);
    
    // Also support classic Dialogue
    const hasDialogue = clean.toLowerCase().includes("vendedor") || clean.toLowerCase().includes("cliente") || clean.toLowerCase().includes("consultor") || clean.toLowerCase().includes("academia") || clean.toLowerCase().includes("hola");
    
    return (hasSpeakers || hasDialogue) && hasTime;
  };

  useEffect(() => {
    if (waConv1 && !validateWhatsAppFormat(waConv1)) {
      setWaError1("⚠️ No son conversaciones de WhatsApp o no tienen el formato correcto (ej: '[10:15] Cliente: Hola')");
    } else {
      setWaError1(null);
    }
  }, [waConv1]);

  useEffect(() => {
    if (waConv2 && !validateWhatsAppFormat(waConv2)) {
      setWaError2("⚠️ No son conversaciones de WhatsApp o no tienen el formato correcto (ej: '[11:02] Consultor: Hola')");
    } else {
      setWaError2(null);
    }
  }, [waConv2]);

  useEffect(() => {
    if (waConv3 && !validateWhatsAppFormat(waConv3)) {
      setWaError3("⚠️ No son conversaciones de WhatsApp o no tienen el formato correcto (ej: '[14:30] Academia: Hola')");
    } else {
      setWaError3(null);
    }
  }, [waConv3]);

  const handleLoadMockCases = () => {
    setWaConv1(
`[10:15 AM] Cliente: Hola buenas, vi las zapatillas Wentix de la publicidad. ¿Qué precio tienen?
[10:16 AM] Vendedor: Hola buenos días, salen a $59.000 pesos chilenos.
[10:18 AM] Cliente: Ah ya, entiendo. ¿Y son de cuero o son sintéticas?
[10:19 AM] Vendedor: Hola, no, son sintéticas pero de alta resistencia. ¿Te interesa alguna?
[10:25 AM] Cliente: Dale gracias. Te aviso cualquier cosa.
[10:26 AM] Vendedor: Ya, súper. Quedo atento si te decides.`
    );
    setWaConv2(
`[11:02 AM] Cliente: Hola! Me interesa la consultoría Wentix Pro. ¿Cuál es el valor?
[11:03 AM] Consultor: ¡Hola! Qué gusto saludarte. El valor depende del tamaño de tu negocio para diseñarlo a medida. Cuéntame, ¿cuántas personas atienden o qué producto vendes hoy para ver el potencial?
[11:05 AM] Cliente: Tengo una tienda ecommerce de calzado y somos 3 personas. Vendemos unos 150 pedidos al mes y queremos automatizar respuestas de WhatsApp.
[11:07 AM] Consultor: Excelente, calzado tiene alta recompra. Automatizar las FAQs te liberará el 70% del tiempo para concentrarte en el marketing. El plan Pro para ecommerce de 3 usuarios cuesta $150 USD mensuales e incluye todo el montaje.
[11:08 AM] Cliente: Súper bueno. ¿Cómo haríamos el pago?
[11:09 AM] Consultor: Te puedo generar un enlace seguro para transferencia o tarjeta de crédito. ¿Prefieres que lo paguemos en dólares o en tu moneda local para emitir la factura hoy mismo?
[11:10 AM] Cliente: Tarjeta de crédito en dólares me sirve más. Mándame el link!
[11:11 AM] Consultor: ¡Perfecto! Aquí tienes el enlace de pago seguro...`
    );
    setWaConv3(
`[14:30 PM] Cliente: Hola, info sobre los cursos de automatización de n8n porfa.
[14:31 PM] Academia: Hola! El curso online de n8n consta de 12 módulos de video interactivo, clases por zoom grabadas los sábados a las 11:00 am, tareas semanales corregidas por un tutor experto y acceso para siempre a la comunidad exclusiva de discord. El valor regular es de $299 USD pero tenemos descuento esta semana de $199 USD. Avísame si quieres unirte porque cerramos mañana en la noche.
[14:35 PM] (Entregado y Visto por el Cliente)
[18:00 PM] Academia: Hola, ¿pudiste revisar la info? Nos quedan pocos cupos.
[18:10 PM] (Visto por el Cliente - Sin respuesta)`
    );

    setWaError1(null);
    setWaError2(null);
    setWaError3(null);
    
    onShowToast("💼 Casos de prueba de ventas cargados en los slots. ¡Formato validado!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (slot === 1) setWaConv1(content);
      if (slot === 2) setWaConv2(content);
      if (slot === 3) setWaConv3(content);
      onShowToast(`📁 Conversación cargada desde: ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleRunWaAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!waConv1.trim() && !waConv2.trim() && !waConv3.trim()) {
      onShowToast("❌ Inserta al menos una conversación de WhatsApp para realizar la auditoría.");
      return;
    }

    if (waError1 || waError2 || waError3) {
      onShowToast("❌ Error de Formato: Una o más conversaciones no tienen formato de WhatsApp. Corrige antes de procesar.");
      return;
    }

    setIsAnalyzingWa(true);
    setAnalysisProgress(0);
    setAnalysisStepLog("Iniciando auditor híbrido de ventas...");
    setWaAnalysisReport(null);

    const steps = [
      { p: 15, log: "🔍 Escaneando estructura y diálogos del archivo de WhatsApp..." },
      { p: 40, log: "❌ Buscando falencias de cierre, respuestas tardías y objeciones..." },
      { p: 65, log: "⚙️ Estructurando embudo: Evaluando tipo de cierre y coherencia AIDA..." },
      { p: 85, log: "📝 Formulando reporte pormenorizado (Primero puntos positivos, luego negativos)..." },
      { p: 100, log: "🚀 Auditoría finalizada éxitosamente. ¡Reporte listo!" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setAnalysisProgress(steps[current].p);
        setAnalysisStepLog(steps[current].log);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzingWa(false);
          generateAuditReportResult();
        }, 800);
      }
    }, 700);
  };

  const generateAuditReportResult = () => {
    const report: any = {
      overallScore: 78,
      veredict: "Estructuras de cierres mixtas con falencia crítica de valorización previa y preguntas cerradas.",
      scenarios: []
    };

    if (waConv1.trim()) {
      const isCustom1 = waConv1.includes("wentix") || waConv1.includes("Wentix") || waConv1.includes("zapatillas");
      report.scenarios.push({
        id: "scenario-1",
        title: "Conversación 1: Sin Ventas (Caso Objeción)",
        status: "OPORTUNIDAD PERDIDA (Falta de Valorización previa al Precio)",
        statusColor: "text-red-400 border-red-500/25 bg-red-950/20",
        positives: [
          "Establece un saludo inicial cordial al recibir al prospecto",
          "Atención rápida y oportuna (menos de 1 minuto de demora)",
          "Trato respetuoso y ameno que genera agrado inicial"
        ],
        negatives: [
          "Falla Estructural de Cierre: Arroja el precio de inmediato ($59.000) sin explicar primero las características del material o beneficios.",
          "Tipo de Cierre Equivocado: Empleó un cierre cerrado que facilita la salida rápida del prospecto: '¿Te interesa alguna?'.",
          "Urgencia Nula: Ausencia total de llamados de urgencia, stocks limitados, o ganchos promocionales para incentivar la decisión pasiva.",
          "Falta de Proactividad: Aceptó con pasividad absoluta el enfriamiento ('Te aviso cualquier cosa' -> 'Súper, quedo atento') perdiendo contacto."
        ],
        redesign: isCustom1 ? 
`[10:15 AM] Cliente: Hola buenas, ¿Qué precio tienen las zapatillas Wentix?
[10:16 AM] Vendedor: ¡Hola! Qué gusto saludarte. Te cuento que las Wentix Pro son ultraligeras, con suela ergonómica de alto rendimiento ideales para uso diario y deporte intenso. Su valor promocional con envío gratis es de solo $59.000.
[10:18 AM] Cliente: Ah ya de acuerdo. ¿Y son de cuero o sintéticas?
[10:19 AM] Vendedor: Son sintéticas de microfibra de alta resistencia y respirables (duran el doble que el cuero común y no se agrietan). ¿Prefieres despacho gratis para Santiago o regiones para revisar disponibilidad hoy mismo? (Cierre de Doble Alternativa)` :
`[Formato Sugerido - Cierre de Doble Alternativa]
Vendedor: En vez de preguntar "¿Te interesa?", utiliza cierres de doble alternativa: 
"¿Prefieres que programemos la entrega para mañana por la mañana o el sábado en la tarde?"
O en vez de dar el precio directo:
"Te comento que incluye garantía de 30 días, materiales premium... el valor es de [X]. ¿Prefieres pagar con tarjeta o transferencia?"`
      });
    }

    if (waConv2.trim()) {
      const isCustom2 = waConv2.includes("consultoría") || waConv2.includes("Pro") || waConv2.includes("ecommerce");
      report.scenarios.push({
        id: "scenario-2",
        title: "Conversación 2: Con Ventas (Caso de Éxito)",
        status: "ÉXITO DE CIERRE (Cierre de Doble Alternativa Aplicado)",
        statusColor: "text-emerald-400 border-emerald-500/25 bg-emerald-950/20",
        positives: [
          "Fase de descubrimiento estelar: Investiga y califica al prospecto antes de soltar un precio de la nada.",
          "Anclaje de Valor robusto: Explica que la solución le ahorrará el 70% del tiempo de FAQs antes de mencionar los $150 USD.",
          "Cierre Asertivo de Doble Opción: Pregunta astutamente '¿Prefieres pagar en dólares o en moneda local?' facilitando el sí directo."
        ],
        negatives: [
          "El vendedor omitió dar un gancho de urgencia de contratación inmediata, aunque cerró con éxito por la asertividad del cliente.",
          "Falta de empaquetamiento opcional para escalabilidad futura del contrato sobre otros canales de marketing."
        ],
        redesign: isCustom2 ?
`[11:08 AM] Cliente: Súper bueno. ¿Cómo haríamos el pago?
[11:09 AM] Consultor: ¡Excelente elección! Te mandaré el link de pago encriptado de Stripe a tu WhatsApp. ¿Deseas emitir la boleta de forma personal o con datos tributarios de tu empresa para mandarte el link exacto? (Excelente cierre asertivo)` :
`[Estructura Exitosa Aplicada]
1. Saludo cordial y empático.
2. Descubrimiento de necesidades ("¿De qué es tu negocio para guiarte?").
3. Presentación de valor ("Te ayudará a ahorrar un 70% de tiempo").
4. Cierre de Doble Alternativa ("¿Dólares o moneda local?"). ¡Estructura PERFECTA!`
      });
    }

    if (waConv3.trim()) {
      const isCustom3 = waConv3.includes("n8n") || waConv3.includes("Academia") || waConv3.includes("curso");
      report.scenarios.push({
        id: "scenario-3",
        title: "Conversación 3: Visto o Ghosteado (Fallas de Infoxicación)",
        status: "AUDITORÍA DE EN VISTO (Decision Paralysis - Ladrillo Infor.)",
        statusColor: "text-amber-400 border-amber-500/25 bg-amber-955/20",
        positives: [
          "Entrega de información completa y detallada de los 12 módulos y canales de Discord.",
          "Brinda incentivo económico por tiempo limitado ($299 a $199) buscando apelar a la escasez."
        ],
        negatives: [
          "Infoxicación Extrema: Lanza un 'ladrillo de texto' impenetrable de un solo golpe. Produce pereza intelectual en el prospecto e incita a dejarlo en visto para 'revisar con calma'.",
          "Entrega pasiva de la iniciativa: Redacta 'Avísame si quieres unirte...', delegando el esfuerzo de cierre totalmente en el cliente.",
          "Seguimiento reactivo estéril: El recordatorio ('¿Pudiste revisar la info?') genera presión directa y culpabilidad en el prospecto en lugar de ofrecer un gancho interactivo."
        ],
        redesign: isCustom3 ?
`[14:30 PM] Cliente: Hola, info sobre los cursos de automatización de n8n porfa.
[14:31 PM] Academia: ¡Hola! Con gusto. Te cuento brevemente: nuestro curso de n8n te enseña a conectar sistemas y crear robots de IA para tu empresa. ¿Tienes ya alguna idea de automatización que quieras implementar en tu negocio, o partes de cero? (Pregunta de enganche interactivo)
---
[Evita enviar todo el temario en un solo párrafo. Revela conforme el cliente te vaya respondiendo. Mantén viva la interacción.]` :
`[Formato de Seguimiento Persuasivo Recomendado]
En lugar de: "¿Pudiste revisar la info?", utiliza un gancho de valor o una pregunta de baja fricción:
"Hola, un colega me preguntó hoy si el diplomado incluye plantilla de cobros automáticos y me acordé de ti. Sí lo incluye. ¿Te gustaría que te mande un video corto de 2 minutos mostrando esa automatización específica?"`
      });
    }

    setWaAnalysisReport(report);
    onShowToast("📈 Auditoría completada con éxito. Revisa el reporte detallado.");
  };

  const handleDownloadWaReport = () => {
    if (!waAnalysisReport) return;
    
    let text = `=======================================================\n`;
    text    += `   REPORTE DE AUDITORÍA: WHATSAPP VENTAS - WENTIX       \n`;
    text    += `   Fecha: ${new Date().toLocaleDateString()} - GRATUITO       \n`;
    text    += `=======================================================\n\n`;
    text    += `VEREDICTO GENERAL:\n${waAnalysisReport.veredict}\n\n`;
    
    waAnalysisReport.scenarios.forEach((sc: any) => {
      text += `-------------------------------------------------------\n`;
      text += `${sc.title.toUpperCase()}\n`;
      text += `ESTADO: ${sc.status}\n`;
      text += `-------------------------------------------------------\n\n`;
      
      text += `COSAS POSITIVAS:\n`;
      sc.positives.forEach((pos: string) => {
        text += ` [+] ${pos}\n`;
      });
      text += `\n`;
      
      text += `COSAS NEGATIVAS / FALENCIAS Y FALLAS:\n`;
      sc.negatives.forEach((neg: string) => {
        text += ` [-] ${neg}\n`;
      });
      text += `\n`;
      
      text += `ESTRUCTURA DE RE-DISEÑO / GUIÓN RECOMENDADO:\n`;
      text += `${sc.redesign}\n\n\n`;
    });
    
    text += `=======================================================\n`;
    text += `  Estudio de Ventas de WhatsApp - Wentix Decodificador  \n`;
    text += `=======================================================\n`;

    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "Auditoria_Conversaciones_WhatsApp_Wentix.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast("💾 Reporte de WhatsApp descargado correctamente.");
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

  const IS_STORE_DISABLED = false;

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
                    {app.pricingLifetime === 0 ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">Acceso de Por Vida</span>
                          <span className="text-sm font-extrabold text-emerald-400 font-mono flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            GRATUITO
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDemoAppId(app.id);
                            onShowToast(`Abriendo el analizador gratuito de WhatsApp: ${app.name}`);
                          }}
                          className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-neutral-950 font-black text-[10px] rounded-xl font-mono transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                        >
                          <Play className="w-3 h-3 text-black fill-black shrink-0" />
                          <span>Auditar Gratis 🚀</span>
                        </button>
                      </>
                    ) : app.id === "saas-radar-winner" ? (
                      <>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider">Pago Único</span>
                          <span className="text-sm font-extrabold text-amber-400 font-mono">
                            $180 USD
                          </span>
                          <span className="text-[8.5px] text-neutral-400 font-mono mt-0.5">
                            + Mantenimiento Servidor (~$7/m)
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCheckout(app, "lifetime");
                            }}
                            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-neutral-950 text-[10.5px] font-extrabold rounded-lg font-mono transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-amber-500/10"
                          >
                            <Zap className="w-3 h-3 text-black shrink-0 fill-black" />
                            <span>Adquirir Radar ($180)</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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

            {/* SIMULATOR 0: WHATSAPP sales decoder AI */}
            {activeDemoAppId === "saas-whatsapp-analyzer" && (
              <div className="space-y-6 relative" id="simulator-whatsapp-analyzer">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 rounded-xl shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono tracking-wider font-bold block uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                        Herramienta Gratuita
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">WhatsApp Sales Decoder AI</h3>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-lg border border-white/5 font-mono">
                    AUDITOR DE CONVERSACIONES
                  </span>
                </div>

                {/* Case Selector and descriptive intro */}
                <div className="bg-neutral-950 border border-white/5 p-4 rounded-2xl space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-transparent blur-xl pointer-events-none" />
                  <p className="text-xs text-neutral-300 leading-relaxed text-left">
                    Sube y analiza hasta <strong className="text-white">3 conversaciones de clientes reales de WhatsApp</strong> para auditar tu flujo de ventas. El algoritmo evaluará aciertos y falencias críticas en el proceso de cierre de forma instantánea.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center pt-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase text-left">¿Quieres probar rápido con plantillas reales?</span>
                    <button
                      type="button"
                      onClick={handleLoadMockCases}
                      className="px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 text-emerald-400 hover:text-white font-mono text-[10px] font-black rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      Cargar Casos de Estudio Reales 💼
                    </button>
                  </div>
                </div>

                {/* Form Inputs for 3 slots */}
                <form onSubmit={handleRunWaAnalysis} className="space-y-5">
                  <div className="space-y-4">
                    
                    {/* Slot 1: Conversación Sin Ventas */}
                    <div className="bg-neutral-900/40 border border-white/5 p-4 rounded-2xl space-y-3 text-left">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-red-955 text-red-400 border border-red-500/20 flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                          <span className="text-xs font-bold text-neutral-200">Requisito: Conversación Sin Ventas</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-2 py-1 bg-black/45 hover:bg-black/90 border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white rounded-md transition-colors flex items-center gap-1 leading-none select-none">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Sustituir .txt</span>
                            <input
                              type="file"
                              accept=".txt,.log"
                              onChange={(e) => handleFileUpload(e, 1)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => { setWaConv1(""); onShowToast("🧹 Conversación 1 limpia"); }}
                            className="text-[9px] font-mono text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={waConv1}
                          onChange={(e) => setWaConv1(e.target.value)}
                          placeholder="Pega aquí la conversación o arrastra tu archivo de chat (ej: '[10:15 AM] Cliente: Hola buenas, ¿Qué precio tienen?...')"
                          className="w-full text-xs font-mono bg-neutral-950 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-neutral-200 resize-none h-24"
                        />
                        {waConv1 && (
                          <div className="absolute bottom-2.5 right-2 text-[8.5px] font-mono font-bold uppercase py-0.5 px-2 bg-neutral-900 rounded border border-white/10">
                            {waError1 ? (
                              <span className="text-red-400">Sin Formato</span>
                            ) : (
                              <span className="text-emerald-400">Formato OK ✓</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Immediate Error Notification */}
                      {waError1 && (
                        <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2 text-[10px] font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                          <span>{waError1}</span>
                        </div>
                      )}
                    </div>

                    {/* Slot 2: Conversación Con Ventas */}
                    <div className="bg-neutral-900/40 border border-white/5 p-4 rounded-2xl space-y-3 text-left">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-955 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                          <span className="text-xs font-bold text-neutral-200">Requisito: Conversación Con Ventas</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-2 py-1 bg-black/45 hover:bg-black/90 border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white rounded-md transition-colors flex items-center gap-1 leading-none select-none">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Sustituir .txt</span>
                            <input
                              type="file"
                              accept=".txt,.log"
                              onChange={(e) => handleFileUpload(e, 2)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => { setWaConv2(""); onShowToast("🧹 Conversación 2 limpia"); }}
                            className="text-[9px] font-mono text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={waConv2}
                          onChange={(e) => setWaConv2(e.target.value)}
                          placeholder="Pega aquí la conversación o arrastra tu archivo de chat (ej: '[11:02 AM] Consultor: Hola...')"
                          className="w-full text-xs font-mono bg-neutral-950 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-neutral-200 resize-none h-24"
                        />
                        {waConv2 && (
                          <div className="absolute bottom-2.5 right-2 text-[8.5px] font-mono font-bold uppercase py-0.5 px-2 bg-neutral-900 rounded border border-white/10">
                            {waError2 ? (
                              <span className="text-red-400">Sin Formato</span>
                            ) : (
                              <span className="text-emerald-400">Formato OK ✓</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Immediate Error Notification */}
                      {waError2 && (
                        <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2 text-[10px] font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                          <span>{waError2}</span>
                        </div>
                      )}
                    </div>

                    {/* Slot 3: Conversación En Visto/Ghosted */}
                    <div className="bg-neutral-900/40 border border-white/5 p-4 rounded-2xl space-y-3 text-left">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-amber-955 text-amber-500 border border-amber-500/20 flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                          <span className="text-xs font-bold text-neutral-200">Requisito: Conversación que el Cliente vio la información y no respondió</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer px-2 py-1 bg-black/45 hover:bg-black/90 border border-white/10 text-[9px] font-mono text-neutral-400 hover:text-white rounded-md transition-colors flex items-center gap-1 leading-none select-none">
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>Sustituir .txt</span>
                            <input
                              type="file"
                              accept=".txt,.log"
                              onChange={(e) => handleFileUpload(e, 3)}
                              className="hidden"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => { setWaConv3(""); onShowToast("🧹 Conversación 3 limpia"); }}
                            className="text-[9px] font-mono text-neutral-500 hover:text-red-400 transition-colors"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={waConv3}
                          onChange={(e) => setWaConv3(e.target.value)}
                          placeholder="Pega aquí la conversación o arrastra tu archivo de chat (ej: '[14:30 PM] Academia: Hola...')"
                          className="w-full text-xs font-mono bg-neutral-950 border border-white/5 rounded-xl p-3 focus:outline-none focus:border-emerald-500 text-neutral-200 resize-none h-24"
                        />
                        {waConv3 && (
                          <div className="absolute bottom-2.5 right-2 text-[8.5px] font-mono font-bold uppercase py-0.5 px-2 bg-neutral-900 rounded border border-white/10">
                            {waError3 ? (
                              <span className="text-red-400">Sin Formato</span>
                            ) : (
                              <span className="text-emerald-400">Formato OK ✓</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Immediate Error Notification */}
                      {waError3 && (
                        <div className="p-2.5 bg-red-950/20 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-2 text-[10px] font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-400" />
                          <span>{waError3}</span>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Submission and loading states */}
                  {!isAnalyzingWa ? (
                    <button
                      type="submit"
                      disabled={!!(waError1 || waError2 || waError3 || (!waConv1.trim() && !waConv2.trim() && !waConv3.trim()))}
                      className={`w-full py-3.5 font-bold font-mono text-xs tracking-wider rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        (waError1 || waError2 || waError3 || (!waConv1.trim() && !waConv2.trim() && !waConv3.trim()))
                          ? "bg-neutral-900 text-neutral-600 border border-white/5 cursor-not-allowed" 
                          : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-neutral-950 shadow-lg shadow-emerald-500/10"
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-black" />
                      <span>INICIAR AUDITORÍA DE VENTAS GRATIS ⚡</span>
                    </button>
                  ) : (
                    <div className="space-y-3 bg-neutral-900 p-4 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center text-[10.5px] font-mono">
                        <span className="text-cyan-400 font-bold animate-pulse">{analysisStepLog}</span>
                        <span className="text-white font-bold">{analysisProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-500 h-full transition-all duration-300"
                          style={{ width: `${analysisProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </form>

                {/* ADVANCED DYNAMIC REPORT VIEW */}
                {waAnalysisReport && (
                  <div className="space-y-6 pt-4 border-t border-white/5 animate-fade-in text-left">
                    <div className="bg-[#0b0c10] p-4 rounded-2xl border border-white/5 space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-2xl pointer-events-none" />
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Resumen de Diagnóstico</span>
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-500/25 rounded font-mono text-[9px] font-black">
                          INFORME CONSOLIDADO
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-white font-sans flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        Veredicto General de Cierres:
                      </h4>
                      <p className="text-xs text-neutral-300 leading-relaxed pl-5.5 font-sans">
                        {waAnalysisReport.veredict}
                      </p>
                    </div>

                    {/* Scenarios detailed loop */}
                    <div className="space-y-6">
                      {waAnalysisReport.scenarios.map((sc: any) => (
                        <div key={sc.id} className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4 shadow-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                            <h5 className="text-xs font-black font-mono text-white tracking-wider flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                              {sc.title}
                            </h5>
                            <span className={`px-2.5 py-0.5 text-[8.5px] font-mono font-bold rounded border ${sc.statusColor}`}>
                              {sc.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Puntos Positivos */}
                            <div className="space-y-2 bg-neutral-950/60 p-3 rounded-xl border border-white/5">
                              <h6 className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                                <span>Cosas Positivas de la Atención 👍</span>
                              </h6>
                              <ul className="space-y-1.5">
                                {sc.positives.map((pos: string, pIdx: number) => (
                                  <li key={pIdx} className="text-xs text-neutral-300 font-sans flex items-start gap-1.5 leading-relaxed">
                                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                    <span>{pos}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Puntos Negativos / Falencias */}
                            <div className="space-y-2 bg-neutral-950/60 p-3 rounded-xl border border-white/5">
                              <h6 className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                                <span>Falencias y Fallas en Detalle (Errores de Ventas) 👎</span>
                              </h6>
                              <ul className="space-y-1.5">
                                {sc.negatives.map((neg: string, nIdx: number) => (
                                  <li key={nIdx} className="text-xs text-neutral-300 font-sans flex items-start gap-1.5 leading-relaxed">
                                    <span className="text-red-500 font-bold shrink-0">✕</span>
                                    <span>{neg}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Corrective script */}
                          <div className="space-y-2 bg-[#050508] p-3.5 rounded-xl border border-white/5">
                            <div className="flex justify-between items-center">
                              <span className="text-[9.5px] font-mono text-cyan-400 uppercase font-black">Estructura Guión de Re-diseño Recomendado:</span>
                              <button
                                type="button"
                                onClick={() => handleCopyText(sc.redesign)}
                                className="px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-white/5 tracking-wider rounded text-[8.5px] font-mono cursor-pointer transition-colors"
                              >
                                Copiar Guión
                              </button>
                            </div>
                            <pre className="font-mono text-[10px] text-zinc-300 leading-relaxed bg-black/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap select-text max-h-44 scrollbar-thin scrollbar-thumb-zinc-850">
                              {sc.redesign}
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Download button row */}
                    <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-white/5">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        Wentix WhatsApp Sales Decoder AI • 100% Gratuito
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleDownloadWaReport}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/10"
                      >
                        <Download className="w-4 h-4 text-neutral-950" />
                        <span>Descargar Reporte en Documento (.txt) 💾</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* SIMULATOR: RADAR WENTIX AI WIND (LANDING PORTFOLIO SCREEN WITHOUT COMPROMISING GRAPHICS) */}
                        {activeDemoAppId === "saas-radar-winner" && (
              <div className="text-left space-y-12" id="simulator-radar-winner">
                
                {/* BRAND HERO HEADER CONTAINER */}
                <div className="relative overflow-hidden bg-gradient-to-b from-[#090d16] via-[#05050a] to-[#040406] p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                  
                  {/* Glowing ambient dots in the background */}
                  <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

                  {/* Micro pill badge on top */}
                  <div className="flex justify-center md:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/60 border border-cyan-500/35 text-cyan-400 rounded-full text-[10px] font-mono font-black tracking-widest uppercase shadow-sm shadow-cyan-500/10 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      PRESENTANDO WENTIX WINS - RADAR AI
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <div className="mt-6 max-w-4xl space-y-4 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none font-sans">
                      El Radar de <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Productos Ganadores</span> más Potente de Latinoamérica
                    </h2>
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed font-sans max-w-3xl">
                      Deja de improvisar e imitar tiendas saturadas. Wentix Wins Radar AI es una herramienta de clase mundial que escanea y rastrea el inventario físico en vivo de bodegas en Chile, Colombia, Ecuador y Guatemala. Descubre tendencias de escalado real antes de que se saturen en Ads.
                    </p>
                  </div>

                  {/* Action row */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                    <button
                      type="button"
                      onClick={() => {
                        const target = document.getElementById("pago-unico-compra-form");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                          onShowToast("Redireccionando al formulario de compra...");
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-black text-xs font-sans uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 text-black fill-black" />
                      <span>Adquirir Licencia Wentix Wins 📡</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const target = document.getElementById("demo-video-walkthrough-section");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                          onShowToast("Abriendo video demostrativo...");
                        }
                      }}
                      className="w-full sm:w-auto px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-zinc-200 hover:text-white border border-white/10 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Video className="w-4 h-4 text-cyan-400" />
                      <span>Ver Video Demostrativo 📺</span>
                    </button>
                  </div>

                  {/* Country coverage markers */}
                  <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs text-zinc-500 font-mono">
                    <span className="text-zinc-404 uppercase tracking-wider text-[10px] font-bold">Cobertura de Bodegas Localizadas:</span>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-2.5 py-1 bg-neutral-900 border border-white/5 rounded-lg text-white flex items-center gap-1.5">
                        <span>🇨🇱</span> Chile
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-900 border border-white/5 rounded-lg text-white flex items-center gap-1.5">
                        <span>🇨🇴</span> Colombia
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-900 border border-white/5 rounded-lg text-white flex items-center gap-1.5">
                        <span>🇪🇨</span> Ecuador
                      </span>
                      <span className="px-2.5 py-1 bg-neutral-900 border border-white/5 rounded-lg text-white flex items-center gap-1.5">
                        <span>🇬🇹</span> Guatemala
                      </span>
                    </div>
                  </div>
                </div>




                {/* THE PORTFOLIO WALKTHROUGH VIDEO HERO SHOWCASE SECTION */}
                <div id="demo-video-walkthrough-section" className="bg-[#090a0f] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 relative shadow-2xl">
                  
                  {/* Glowing light background accent */}
                  <div className="absolute top-12 right-12 w-64 h-64 bg-cyan-500/5 rounded-full blur-[90px] pointer-events-none" />

                  {/* Icon & Section title */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#22d3ee] font-black block uppercase">
                        MATERIAL DEMOSTRATIVO EXCLUSIVO
                      </span>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans tracking-tight mt-1 flex items-center gap-2 text-left">
                        <Video className="w-5 h-5 text-cyan-400" />
                        Video Oficial de Funcionamiento
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5 font-sans text-left">
                        Visualiza de primera mano cómo funciona nuestro scraper, el monitoreo de existencias y los embudos directos de espionaje.
                      </p>
                    </div>

                    {/* Quick status label */}
                    <div className="self-start md:self-center px-3 py-1.5 bg-[#0c222b] text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-mono font-semibold">
                      UHD 4K RESOLUTION
                    </div>
                  </div>

                  {/* Immersive centered clean player frame */}
                  <div className="max-w-5xl mx-auto w-full">
                    <div className="relative w-full aspect-video rounded-2xl bg-black border border-white/10 shadow-2xl overflow-hidden group/player">
                      <video
                        src="https://qoujzzazlzdxfmitqmcd.supabase.co/storage/v1/object/sign/videos/radarwins1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mNTRlYTIxOC04N2E4LTQ3Y2MtOTZmNS00N2E1MjNmMjg1M2YiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ2aWRlb3MvcmFkYXJ3aW5zMS5tcDQiLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgxNzM3NzY1LCJleHAiOjMzNTg1Mzc3NjV9.WE6cxGHnlrel_1rIkEvLNxA_yqGlpPsCEbKPZMXPAxU"
                        className="w-full h-full object-cover rounded-2xl"
                        controls
                        autoPlay
                        loop
                        playsInline
                      />
                    </div>
                  </div>

                </div>

              </div>
            )}{/* SIMULATOR 2: CONTENT MACHINE CAROUSEL & THREADS */}
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
