import React, { useState, useEffect } from "react";
import {
  Wrench,
  Github,
  GitBranch,
  MessageSquareCode,
  Bot,
  Cpu,
  Code,
  Zap,
  ShoppingBag,
  Megaphone,
  Paintbrush,
  Video,
  Binary,
  Heart,
  FileText,
  Search,
  BookMarked,
  Copy,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  Lock,
  Award,
  Terminal,
  Play,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  DollarSign,
  Star,
  Users,
  MessageSquare,
  Compass,
  ArrowRight,
  Mail,
  Loader2,
  Trash2,
  Filter,
  Bell,
  BellOff,
  Share2,
  Menu,
  X
} from "lucide-react";

import { 
  CATEGORIES_LIST, 
  INITIAL_AI_TOOLS, 
  INITIAL_GITHUB_REPOS, 
  INITIAL_PROMPTS_LIBRARY, 
  INITIAL_WORKFLOWS, 
  INITIAL_RESOURCE_ARTICLES, 
  GRATIS_STACK 
} from "./data";
import { AITool, GitHubRepo, PromptItem, WorkflowItem, ResourceArticle } from "./types";
import DonationCenter from "./components/DonationCenter";
import ViralGrowthSystem from "./components/ViralGrowthSystem";
import { WentixLogo } from "./components/WentixLogo";
import SaaSStore from "./components/SaaSStore";
import AIZeroToPro from "./components/AIZeroToPro";

type RadarArticlePayload = Partial<ResourceArticle> & {
  title?: string;
  name?: string;
  summary?: string;
  description?: string;
  read_time?: string;
  publishedAt?: string;
  difficulty?: "Principiante" | "Intermedio" | "Avanzado";
};

export default function App() {
  // Main Databases (Persisted locally in the session/localStorage to show the CMS works in real-time!)
  const [tools, setTools] = useState<AITool[]>(() => {
    const saved = localStorage.getItem("wentix_tools");
    if (saved) {
      try {
        const parsed: AITool[] = JSON.parse(saved);
        // Dynamically filter out any stale community, academy, or tododeia/atodoia tools from localStorage
        const cleaned = parsed.filter(item => {
          const nameLower = (item.name || "").toLowerCase();
          const descLower = (item.description || "").toLowerCase();
          const urlLower = (item.url || "").toLowerCase();
          const catLower = (item.category || "").toLowerCase();

          if (catLower === "comunidad") return false;
          if (nameLower.includes("academia") || descLower.includes("academia") || urlLower.includes("academia")) return false;
          if (nameLower.includes("tododeia") || descLower.includes("tododeia") || urlLower.includes("tododeia")) return false;
          if (nameLower.includes("atodoia") || descLower.includes("atodoia") || urlLower.includes("atodoia")) return false;
          return true;
        });

        // Ensure new tools like ollama and stable diffusion are always available
        const missing = INITIAL_AI_TOOLS.filter(t => !cleaned.some(p => p.id === t.id));
        if (missing.length > 0) {
          return [...missing, ...cleaned];
        }
        return cleaned;
      } catch (e) {
        return INITIAL_AI_TOOLS;
      }
    }
    return INITIAL_AI_TOOLS;
  });

  const [repos, setRepos] = useState<GitHubRepo[]>(() => {
    const saved = localStorage.getItem("wentix_repos");
    if (saved) {
      try {
        const parsed: GitHubRepo[] = JSON.parse(saved);
        // Force-clean the repos to only preserve actual GitHub repositories
        const cleaned = parsed.filter(item => {
          const urlLower = (item.url || "").toLowerCase();
          return urlLower.includes("github.com");
        });
        
        // Ensure new repos from INITIAL_GITHUB_REPOS are always loaded
        const missing = INITIAL_GITHUB_REPOS.filter(r => !cleaned.some(p => p.id === r.id));
        if (missing.length > 0) {
          return [...missing, ...cleaned];
        }
        return cleaned;
      } catch (e) {
        return INITIAL_GITHUB_REPOS;
      }
    }
    return INITIAL_GITHUB_REPOS;
  });

  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    const saved = localStorage.getItem("wentix_prompts");
    return saved ? JSON.parse(saved) : INITIAL_PROMPTS_LIBRARY;
  });

  const normalizeImportedPrompt = (raw: any): PromptItem | null => {
    const title = String(raw?.title || "").trim();
    const promptText = String(raw?.promptText || "").trim();
    if (!title || !promptText) return null;

    const difficulty = raw?.difficulty === "Principiante" || raw?.difficulty === "Intermedio" || raw?.difficulty === "Avanzado"
      ? raw.difficulty
      : "Intermedio";

    return {
      id: String(raw.id || `prompt-${Date.now()}-${Math.random().toString(36).slice(2)}`),
      title,
      promptText,
      description: String(raw.description || "Prompt externo modelado para Wentix en español.").trim(),
      model: String(raw.model || "ChatGPT"),
      category: String(raw.category || "Prompts"),
      difficulty,
      popularCount: Number(raw.popularCount || 1000)
    };
  };

  const mergePromptsAtTop = (incoming: PromptItem[], existing: PromptItem[]) => {
    const seen = new Set<string>();
    const merged: PromptItem[] = [];

    [...incoming, ...existing].forEach((prompt) => {
      const key = prompt.promptText.slice(0, 260).trim().toLowerCase();
      const idKey = String(prompt.id || "").trim().toLowerCase();
      const dedupeKey = key || idKey;
      if (!dedupeKey || seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      if (idKey) seen.add(idKey);
      merged.push(prompt);
    });

    return merged;
  };

  const [workflows, setWorkflows] = useState<WorkflowItem[]>(() => {
    const saved = localStorage.getItem("wentix_workflows");
    return saved ? JSON.parse(saved) : INITIAL_WORKFLOWS;
  });

  const [articles, setArticles] = useState<ResourceArticle[]>(() => {
    const saved = localStorage.getItem("wentix_articles");
    return saved ? JSON.parse(saved) : INITIAL_RESOURCE_ARTICLES;
  });

  const normalizeArticleTitle = (title: string) => title.trim().toLocaleLowerCase("es");

  const normalizeRadarArticle = (raw: RadarArticlePayload, index: number): ResourceArticle | null => {
    const title = (raw.title || raw.name || "").trim();
    if (!title) return null;

    const tags = Array.isArray(raw.tags)
      ? raw.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
      : [];

    return {
      id: raw.id || `radar-${Date.now()}-${index}`,
      title,
      category: raw.category || "Radar IA",
      difficulty: raw.difficulty,
      readTime: raw.readTime || raw.read_time || "4 min de lectura",
      excerpt: raw.excerpt || raw.summary || raw.description || "Insight detectado por el radar Wentix.",
      author: raw.author || "Wentix Radar",
      date: raw.date || raw.publishedAt || new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
      tags: tags.length > 0 ? tags : ["IA", "Radar"],
      views: typeof raw.views === "number" ? raw.views : Math.floor(1400 + Math.random() * 5200),
      imageUrl: raw.imageUrl,
      sourceUrl: raw.sourceUrl,
      learningGoals: Array.isArray((raw as any).learningGoals) ? (raw as any).learningGoals : undefined,
      contentSections: Array.isArray((raw as any).contentSections) ? (raw as any).contentSections : undefined,
      actionSteps: Array.isArray((raw as any).actionSteps) ? (raw as any).actionSteps : undefined,
      closingNote: typeof (raw as any).closingNote === "string" ? (raw as any).closingNote : undefined
    };
  };

  const extractRadarArticles = (data: any): ResourceArticle[] => {
    const candidates = Array.isArray(data)
      ? data
      : data?.articles || data?.newArticles || data?.createdArticles || data?.importedArticles || data?.items || data?.results || (data?.article ? [data.article] : []);

    if (!Array.isArray(candidates)) return [];

    return candidates
      .map((item: any, index: number) => normalizeRadarArticle(item?.article || item, index))
      .filter((article: ResourceArticle | null): article is ResourceArticle => article !== null);
  };

  const mergeArticlesAtTop = (incoming: ResourceArticle[], current: ResourceArticle[]) => {
    const seenTitles = new Set<string>();
    const merged: ResourceArticle[] = [];

    [...incoming, ...current].forEach((article) => {
      const key = normalizeArticleTitle(article.title);
      if (!key || seenTitles.has(key)) return;
      seenTitles.add(key);
      merged.push(article);
    });

    return merged;
  };

  const homeRadarArticles = articles.slice(0, 3);

  // User Bookmark storage
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    const saved = localStorage.getItem("wentix_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // State Save Effect
  useEffect(() => {
    localStorage.setItem("wentix_tools", JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem("wentix_repos", JSON.stringify(repos));
  }, [repos]);

  useEffect(() => {
    localStorage.setItem("wentix_prompts", JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    let cancelled = false;

    const loadRadarPrompts = async () => {
      try {
        const response = await fetch("/api/gemini/prompts?limit=300");
        if (!response.ok) return;
        const data = await response.json();
        const importedPrompts = Array.isArray(data.prompts)
          ? data.prompts.map(normalizeImportedPrompt).filter(Boolean) as PromptItem[]
          : [];
        if (!cancelled && importedPrompts.length) {
          setPrompts((prev) => mergePromptsAtTop(importedPrompts, prev));
        }
      } catch (err) {
        console.warn("Could not load PromptRadar library:", err);
      }
    };

    loadRadarPrompts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadRadarArticles = async () => {
      try {
        const response = await fetch("/api/gemini/radar/articles?limit=300");
        if (!response.ok) return;
        const data = await response.json();
        const radarArticles = extractRadarArticles(data);
        if (!cancelled && radarArticles.length) {
          setArticles((prev) => mergeArticlesAtTop(radarArticles, prev));
        }
      } catch (err) {
        console.warn("Could not load RadarAgent articles:", err);
      }
    };

    loadRadarArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("wentix_workflows", JSON.stringify(workflows));
  }, [workflows]);

  useEffect(() => {
    localStorage.setItem("wentix_articles", JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem("wentix_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  
  // Tab selector for resources display
  const [activeTab, setActiveTab] = useState<"home" | "tools" | "repos" | "prompts" | "bookmarks" | "admin" | "saas" | "0-a-pro">("home");

  // Mobile menu open / closed state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // "Trabaja conmigo" Form State
  const [collabName, setCollabName] = useState("");
  const [collabEmail, setCollabEmail] = useState("");
  const [collabMessage, setCollabMessage] = useState("");
  const [collabBudget, setCollabBudget] = useState("Por definir");
  const [isSubmittingCollab, setIsSubmittingCollab] = useState(false);

  // Dynamic categories helper based on active databases
  const getApplicableCategoriesForTab = (tab: "tools" | "repos" | "prompts") => {
    if (tab === "tools") {
      const cats = Array.from(new Set(tools.map(t => t.category))).filter((c): c is string => !!c && c !== "Todos");
      return cats.sort();
    }
    if (tab === "repos") {
      const cats = Array.from(new Set(repos.map(r => r.category))).filter((c): c is string => !!c && c !== "Todos");
      return cats.sort();
    }
    if (tab === "prompts") {
      const cats = Array.from(new Set(prompts.map(p => p.category))).filter((c): c is string => !!c && c !== "Todos");
      return cats.sort();
    }
    return [];
  };

  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = collabEmail.trim();
    if (!email || !email.includes("@")) {
      showToast("❌ Por favor, ingresa un correo de contacto válido.");
      return;
    }
    setIsSubmittingCollab(true);
    try {
      const res = await fetch("/api/leads/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          name: collabName, 
          message: `[Trabaja Conmigo - Presupuesto: ${collabBudget}] ${collabMessage}` 
        })
      });
      setIsSubmittingCollab(false);
      if (res.ok) {
        showToast("🚀 ¡Propuesta de consultoría enviada con éxito! Te contactaremos.");
        setCollabName("");
        setCollabEmail("");
        setCollabMessage("");
        setCollabBudget("Por definir");
        fetchLeadStats();
        
        // Play sweet success sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.41);
        } catch (e) {}
      } else {
        showToast("❌ Error al procesar propuesta.");
      }
    } catch (err) {
      console.warn("Collab error:", err);
      setIsSubmittingCollab(false);
      showToast("❌ Error de red.");
    }
  };

  // Track which item has the quick share popup open
  const [activeShareItemId, setActiveShareItemId] = useState<string | null>(null);

  // Helper integration to reward points on immediate item share action
  const handleShareItemAwardPoints = (itemName: string, platform: string) => {
    const shareUrl = `https://wentix.ai/resource/${encodeURIComponent(itemName)}`;
    navigator.clipboard.writeText(shareUrl);
    
    showToast(`🔥 ¡Compartido en ${platform}! • Enlace de recurso copiado al portapapeles.`);
    
    // Play sweet short MIDI note
    try {
      const aCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = aCtx.createOscillator();
      const vol = aCtx.createGain();
      osc.connect(vol);
      vol.connect(aCtx.destination);
      osc.frequency.setValueAtTime(587.33, aCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, aCtx.currentTime + 0.1); // A5
      vol.gain.setValueAtTime(0.04, aCtx.currentTime);
      vol.gain.exponentialRampToValueAtTime(0.001, aCtx.currentTime + 0.35);
      osc.start();
      osc.stop(aCtx.currentTime + 0.36);
    } catch (e) {}
  };

  // Donors/Backers database (persisted locally as backup, synchronized with real-time server database)
  const [backers, setBackers] = useState<{ id: string; name: string; amount: number; message: string; date: string }[]>(() => {
    const saved = localStorage.getItem("wentix_backers");
    return saved ? JSON.parse(saved) : [
      { id: "1", name: "Gabriel Soto", amount: 15, message: "¡Increíble herramienta para automatizar mi agencia!", date: "2026-05-28" },
      { id: "2", name: "Estefanía Ruiz", amount: 29, message: "El ebook de Claude es oro puro.", date: "2026-05-29" },
      { id: "3", name: "Alejandro M.", amount: 50, message: "Soporte total a Wentix AI. ¡Mucha fuerza!", date: "2026-05-29" }
    ];
  });

  const [leadStats, setLeadStats] = useState<{
    visitorsCount: number;
    leadsCount: number;
    registrosDiarios: number;
    registrosSemanales: number;
    registrosMensuales: number;
    tasaConversion: string;
    donacionesRecibidas: number;
    leadsList: { email: string; createdAt: string }[];
    donationsList: { id: string; name: string; amount: number; message: string; date: string }[];
  }>({
    visitorsCount: 9482,
    leadsCount: 10,
    registrosDiarios: 3,
    registrosSemanales: 8,
    registrosMensuales: 10,
    tasaConversion: "0.11%",
    donacionesRecibidas: 75,
    leadsList: [],
    donationsList: []
  });

  const [leadEmailInput, setLeadEmailInput] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const fetchLeadStats = async () => {
    try {
      const res = await fetch("/api/leads/stats");
      if (res.ok) {
        const data = await res.json();
        setLeadStats(data);
        if (data.donationsList && data.donationsList.length > 0) {
          setBackers(data.donationsList);
        }
      }
    } catch (err) {
      console.warn("Could not fetch lead stats from backend: dynamic fallback active.", err);
    }
  };

  const trackVisitor = async () => {
    try {
      const hasTracked = sessionStorage.getItem("wentix_visitor_tracked");
      if (!hasTracked) {
        const res = await fetch("/api/leads/visitor", { method: "POST" });
        if (res.ok) {
          sessionStorage.setItem("wentix_visitor_tracked", "true");
        }
      }
      fetchLeadStats();
    } catch (err) {
      console.warn("Could not track visitor: dynamic fallback active.", err);
      fetchLeadStats();
    }
  };

  useEffect(() => {
    trackVisitor();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadRadarArticles = async () => {
      try {
        const response = await fetch("/api/gemini/radar/articles");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los articulos del radar");
        }

        const data = await response.json();
        const radarArticles = extractRadarArticles(data);
        if (!cancelled && radarArticles.length > 0) {
          setArticles((prev) => mergeArticlesAtTop(radarArticles, prev));
        }
      } catch (err) {
        console.warn("Could not load radar articles from backend: local articles active.", err);
      }
    };

    loadRadarArticles();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLeadJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = leadEmailInput.trim();
    if (!email || !email.includes("@")) {
      showToast("❌ Por favor, ingresa un correo electrónico válido.");
      return;
    }
    setIsSubmittingLead(true);
    try {
      const res = await fetch("/api/leads/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsSubmittingLead(false);
      if (res.ok) {
        if (data.alreadyExists) {
          showToast("ℹ️ Este correo ya está registrado en Wentix AI.");
        } else {
          showToast("🚀 ¡Unido con éxito! Bienvenido al ecosistema Wentix.");
          setLeadEmailInput("");
          fetchLeadStats();
          
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
            osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.41);
          } catch (e) {}
        }
      } else {
        showToast("❌ Error al registrar correo.");
      }
    } catch (err) {
      console.warn("Error registering email capture:", err);
      setIsSubmittingLead(false);
      showToast("❌ Error de red.");
    }
  };

  const handleAddNewDonation = async (backer: { name: string; amount: number; message: string; date: string }) => {
    try {
      const res = await fetch("/api/leads/donation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backer)
      });
      if (res.ok) {
        fetchLeadStats();
      } else {
        setBackers(prev => [backer, ...prev]);
      }
    } catch (err) {
      console.warn("Could not handle donation, falling back to local list addition:", err);
      setBackers(prev => [backer, ...prev]);
    }
  };

  useEffect(() => {
    localStorage.setItem("wentix_backers", JSON.stringify(backers));
  }, [backers]);

  // Global search input
  const [searchQuery, setSearchQuery] = useState("");

  // Copy toast status alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Advanced filters state
  const [pricingFilter, setPricingFilter] = useState<string>("All");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [onlyTrending, setOnlyTrending] = useState<boolean>(false);

  // Workflow play / logic simulation state
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(-1);

  // Scraping URL inputs
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeSource, setScrapeSource] = useState("Repositorio GitHub");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapingStatusText, setScrapingStatusText] = useState("");
  const [newsUrl, setNewsUrl] = useState("");
  const [newsAngle, setNewsAngle] = useState("");
  const [isModelingNews, setIsModelingNews] = useState(false);
  const [newsStatusText, setNewsStatusText] = useState("");
  const [newsBatchUrls, setNewsBatchUrls] = useState("");
  const [isModelingNewsBatch, setIsModelingNewsBatch] = useState(false);
  const [isRunningRadar, setIsRunningRadar] = useState(false);
  const [radarRunStatusText, setRadarRunStatusText] = useState("");
  const [isRunningPromptRadar, setIsRunningPromptRadar] = useState(false);
  const [promptRadarStatusText, setPromptRadarStatusText] = useState("");
  
  // Custom manual insert form open state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newToolForm, setNewToolForm] = useState({
    name: "",
    description: "",
    pricing: "Freemium",
    category: "Herramientas IA",
    score: 4.8,
    tags: "",
    url: "",
    stars: ""
  });

  // Admin mode state (defaulting to false, toggling of scraping/admin console features)
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("wentix_is_admin") === "true";
  });

  // Passcode modal state triggers
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Web Push Subscription System states
  const [pushSubscribed, setPushSubscribed] = useState<boolean>(() => {
    return localStorage.getItem("wentix_push_subscribed") === "true";
  });

  const [simulatedAlert, setSimulatedAlert] = useState<{
    title: string;
    body: string;
    timestamp: string;
    category?: string;
  } | null>(null);

  // Stack IA + Automatización interactive states (detailed github view)
  const [stackDomain, setStackDomain] = useState("wentix-stack.com");
  const [stackOllamaGPU, setStackOllamaGPU] = useState(false);
  const [activeStackTab, setActiveStackTab] = useState<"overview" | "compose" | "calculator" | "guide">("overview");
  const [calcSeats, setCalcSeats] = useState(5);
  const [calcZapierTasks, setCalcZapierTasks] = useState(5000);
  const [copiedStackCompose, setCopiedStackCompose] = useState(false);
  const [expandedStackFaq, setExpandedStackFaq] = useState<number | null>(null);

  // Active floating details modal data (ventana aparte)
  const [selectedDetailItem, setSelectedDetailItem] = useState<{
    type: "tool" | "repo" | "prompt";
    item: any;
  } | null>(null);

  // Trigger web push native notification and stunning on-screen simulated OS notification toast
  const triggerPushNotification = (title: string, body: string, category: string = "Wentix AI") => {
    // 1. Play high-tech notification chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = "sine";
      // Chime arpeggio
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); // A5
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      // Audio context block fallback
    }

    // 2. Play native browser notification if allowed and iframe doesn't block
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico"
        });
      } catch (err) {
        console.warn("Fallo al enviar notificación nativa (posible iframe sandbox)", err);
      }
    }

    // 3. Set the simulated sliding OS-style banner state
    setSimulatedAlert({
      title,
      body,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category
    });

    // Auto-remove after 6s
    setTimeout(() => {
      setSimulatedAlert(null);
    }, 6000);
  };

  const handlePushSubscriptionToggle = async () => {
    if (pushSubscribed) {
      setPushSubscribed(false);
      localStorage.setItem("wentix_push_subscribed", "false");
      showToast("🔕 Notificaciones push desactivadas.");
    } else {
      // Ask native permission
      if (typeof window !== "undefined" && "Notification" in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            setPushSubscribed(true);
            localStorage.setItem("wentix_push_subscribed", "true");
            showToast("🔔 ¡Suscripción Web Push activada con permisos nativos!");
            setTimeout(() => {
              triggerPushNotification(
                "🟢 ¡Alertas Wentix Activas!",
                "Has activado las alertas web push de nuevas herramientas y automatizaciones.",
                "Suscripción"
              );
            }, 600);
          } else if (permission === "denied") {
            // sandbox / blocked -> fallback graceful
            setPushSubscribed(true);
            localStorage.setItem("wentix_push_subscribed", "true");
            showToast("🔔 Suscripción activada en modo interno interactivo.");
            setTimeout(() => {
              triggerPushNotification(
                "🛡️ Wentix Alertas (Suscrito)",
                "Permisos bloqueados por navegador/iframe, pero recibirás alertas interactivas dentro de Wentix AI.",
                "Suscrito"
              );
            }, 600);
          } else {
            // Default response (closed/ignored popup)
            setPushSubscribed(true);
            localStorage.setItem("wentix_push_subscribed", "true");
            showToast("🔔 Alertas activadas con éxito.");
            setTimeout(() => {
              triggerPushNotification(
                "🚀 Alertas Wentix Activadas",
                "Te notificaremos de inmediato ante cualquier nueva adición en Wentix AI.",
                "Ecosistema"
              );
            }, 600);
          }
        } catch (err) {
          // Exception fallback (common in iframe)
          setPushSubscribed(true);
          localStorage.setItem("wentix_push_subscribed", "true");
          showToast("🔔 Alertas activadas (modo compatible con iFrame)");
          setTimeout(() => {
            triggerPushNotification(
              "🚀 Alertas Wentix habilitadas",
              "Suscripción realizada con éxito con nuestro canal seguro y compatible.",
              "Ecosistema"
            );
          }, 600);
        }
      } else {
        setPushSubscribed(true);
        localStorage.setItem("wentix_push_subscribed", "true");
        showToast("🔔 Activado en modo interno del navegador.");
      }
    }
  };

  const toggleAdminMode = () => {
    const next = !isAdmin;
    setIsAdmin(next);
    localStorage.setItem("wentix_is_admin", String(next));
    showToast(next ? "⚙️ ¡Modo Administrador activado! Consola de Scraper disponible." : "🔒 Modo Administrador desactivado.");
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === "WentixAI2026") {
      setIsAdmin(true);
      localStorage.setItem("wentix_is_admin", "true");
      setActiveTab("admin");
      setShowPasscodeModal(false);
      setPasscodeInput("");
      setPasscodeError("");
      showToast("🔑 ¡Acceso concedido! Bienvenido, Manuel Torres.");
      
      // Play a high premium electronic chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.40);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.41);
      } catch (err) {}
    } else {
      setPasscodeError("Clave incorrecta. Acceso Denegado.");
      
      // Play a short error bass note
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(146.83, audioCtx.currentTime); // D3
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.36);
      } catch (err) {}
    }
  };

  // Toast auto-dismisser helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
      showToast("Marcador eliminado del ecosistema.");
    } else {
      setBookmarks([...bookmarks, id]);
      showToast("¡Recurso guardado en tus marcadores locales!");
    }
  };

  // Copy standard text helper
  const copyText = (txt: string, label: string) => {
    navigator.clipboard.writeText(txt);
    showToast(`¡Copiado al portapapeles: ${label}!`);
  };

  // Run/Simulate a workflow process
  const startWorkflowSimulation = (wf: WorkflowItem) => {
    if (runningWorkflowId) return; // Wait
    setRunningWorkflowId(wf.id);
    setActiveNodeIndex(0);
    showToast(`Iniciando simulación del workflow: ${wf.title}`);

    const interval = setInterval(() => {
      setActiveNodeIndex((prevIdx) => {
        if (prevIdx >= wf.nodes.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setRunningWorkflowId(null);
            setActiveNodeIndex(-1);
            showToast("✅ ¡Workflow ejecutado con éxito y resultados publicados!");
          }, 1000);
          return prevIdx;
        }
        return prevIdx + 1;
      });
    }, 1200);
  };

  // Integrated curator using the server API `/api/gemini/scrape`
  const handleUrlScraping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scrapeUrl.trim() || isScraping) return;

    setIsScraping(true);
    setScrapingStatusText("Extrayendo datos reales de la fuente...");
    
    // Step simulation logs
    setTimeout(() => setScrapingStatusText("Detectando si es GitHub, herramienta o recurso web..."), 800);
    setTimeout(() => setScrapingStatusText("Modelando contenido para el catálogo Wentix..."), 1600);

    try {
      const response = await fetch("/api/gemini/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: scrapeUrl.trim(),
          sourcePlatform: scrapeSource
        })
      });

      if (!response.ok) {
        throw new Error("La API de síntesis falló");
      }

      const data = await response.json();
      if (data.success && data.processedItem) {
        const item = data.processedItem;
        
        // Let's decide of it's a GitHub repo or regular tool based on category result or url
        const isRepoCategory = item.category === "Repositorios GitHub" || scrapeUrl.toLowerCase().includes("github.com");

        if (isRepoCategory) {
          const parsedRepo: GitHubRepo = {
            id: `repo-${Date.now()}`,
            name: item.title || "Nuevo Repo Procesado",
            owner: item.owner || data.extracted?.owner || "WentixCurator",
            description: item.description || "Sin descripción proporcionada",
            stars: item.stars || Math.floor(Math.random() * 2000) + 150,
            forks: item.forks || data.extracted?.forks || Math.floor((item.stars || 1000) * 0.15),
            language: item.language || data.extracted?.language || "Open Source",
            tags: item.tags || ["ai", "scraper", "open-source"],
            category: "Open Source AI",
            url: data.extracted?.normalizedUrl || scrapeUrl.trim()
          };
          setRepos((prev) => [parsedRepo, ...prev]);
          setActiveTab("repos");
          showToast(`¡Repositorio procesado e indexado con éxito por IA! (${item.title})`);
          
          if (pushSubscribed) {
            setTimeout(() => {
              triggerPushNotification(
                `⚡ Repo Trending: ${parsedRepo.name}`,
                `Descubierto y procesado: "${parsedRepo.description.slice(0, 75)}..."`,
                "Repositorio"
              );
            }, 1000);
          }
        } else {
          const parsedTool: AITool = {
            id: `tool-${Date.now()}`,
            name: item.title || "Nueva Herramienta Procesada",
            description: item.description || "Herramienta optimizada con IA",
            pricing: item.pricing || "Freemium",
            category: item.category || "Herramientas IA",
            score: item.score || 4.8,
            tags: item.tags || ["automatizacion", "wentix-scraped"],
            url: data.extracted?.normalizedUrl || scrapeUrl.trim(),
            stars: item.stars || undefined,
            isLatest: true,
            isTrending: true
          };
          setTools((prev) => [parsedTool, ...prev]);
          setActiveTab("tools");
          showToast(`¡Herramienta indexada con éxito! Hacks de Creators: ${item.viralHacks || "N/A"}`);
          
          if (pushSubscribed) {
            setTimeout(() => {
              triggerPushNotification(
                `🛠️ Nueva Herramienta IA: ${parsedTool.name}`,
                `Se acaba de indexar en Wentix: "${parsedTool.description.slice(0, 75)}..."`,
                "Herramientas"
              );
            }, 1000);
          }
        }
        setScrapeUrl("");
      }
    } catch (err) {
      console.warn("URL scrape error:", err);
      showToast("Error al modelar la URL. Revisa que el enlace sea público y vuelve a intentar.");
    } finally {
      setIsScraping(false);
      setScrapingStatusText("");
    }
  };

  const handleRunRadarNow = async () => {
    if (isRunningRadar) return;

    setIsRunningRadar(true);
    setRadarRunStatusText("Lanzando crawler en segundo plano...");

    try {
      const response = await fetch("/api/gemini/radar/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background: true,
          crawl: true
        })
      });

      if (!response.ok && response.status !== 409) {
        throw new Error("La corrida del radar fallo");
      }

      setRadarRunStatusText("Crawler activo: descubriendo URLs internas y modelando contenido...");

      for (let attempt = 0; attempt < 60; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const statusResponse = await fetch("/api/gemini/radar/status");
        if (!statusResponse.ok) continue;
        const statusData = await statusResponse.json();
        if (!statusData.running) break;
        setRadarRunStatusText(`Crawler trabajando en segundo plano... ${attempt + 1}`);
      }

      const articlesResponse = await fetch("/api/gemini/radar/articles?limit=60");
      if (!articlesResponse.ok) {
        throw new Error("No se pudieron cargar los articulos del radar");
      }

      const data = await articlesResponse.json();
      const radarArticles = extractRadarArticles(data);
      if (radarArticles.length > 0) {
        setArticles((prev) => mergeArticlesAtTop(radarArticles, prev));
        setActiveTab("home");
        setRadarRunStatusText(`Radar finalizado: ${radarArticles.length} articulos disponibles.`);
        showToast(`Radar finalizado: ${radarArticles.length} articulos disponibles en el inicio.`);
      } else {
        setRadarRunStatusText("Radar finalizado sin articulos nuevos.");
        showToast("Radar ejecutado sin articulos nuevos.");
      }
    } catch (err) {
      console.warn("Radar run error:", err);
      setRadarRunStatusText("Error al ejecutar el radar backend.");
      showToast("Error al ejecutar el radar. Revisa el backend e intenta nuevamente.");
    } finally {
      setIsRunningRadar(false);
      setTimeout(() => setRadarRunStatusText(""), 4500);
    }
  };

  const handleRunPromptRadarNow = async () => {
    if (isRunningPromptRadar) return;

    setIsRunningPromptRadar(true);
    setPromptRadarStatusText("Importando prompts.chat en segundo plano...");

    try {
      const response = await fetch("/api/gemini/prompts/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          background: true,
          limit: 200
        })
      });

      if (!response.ok && response.status !== 409) {
        throw new Error("La corrida de PromptRadar fallo");
      }

      setPromptRadarStatusText("PromptRadar activo: filtrando prompts en ingles y modelando metadata en español...");

      for (let attempt = 0; attempt < 60; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const statusResponse = await fetch("/api/gemini/prompts/status");
        if (!statusResponse.ok) continue;
        const statusData = await statusResponse.json();
        if (!statusData.running) break;
        setPromptRadarStatusText(`PromptRadar trabajando en segundo plano... ${attempt + 1}`);
      }

      const promptsResponse = await fetch("/api/gemini/prompts?limit=160");
      if (!promptsResponse.ok) {
        throw new Error("No se pudieron cargar los prompts importados");
      }

      const data = await promptsResponse.json();
      const importedPrompts = Array.isArray(data.prompts)
        ? data.prompts.map(normalizeImportedPrompt).filter(Boolean) as PromptItem[]
        : [];

      if (importedPrompts.length > 0) {
        setPrompts((prev) => mergePromptsAtTop(importedPrompts, prev));
        setActiveTab("prompts");
        setPromptRadarStatusText(`PromptRadar finalizado: ${importedPrompts.length} prompts disponibles.`);
        showToast(`PromptRadar importo ${importedPrompts.length} prompts con metadata en español.`);
      } else {
        setPromptRadarStatusText("PromptRadar finalizado sin prompts nuevos.");
        showToast("PromptRadar ejecutado sin prompts nuevos.");
      }
    } catch (err) {
      console.warn("PromptRadar run error:", err);
      setPromptRadarStatusText("Error al ejecutar PromptRadar.");
      showToast("Error al importar prompts. Revisa el backend e intenta nuevamente.");
    } finally {
      setIsRunningPromptRadar(false);
      setTimeout(() => setPromptRadarStatusText(""), 4500);
    }
  };

  const handleNewsModeling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsUrl.trim() || isModelingNews) return;

    setIsModelingNews(true);
    setNewsStatusText("Leyendo fuente publica...");
    setTimeout(() => setNewsStatusText("Separando hechos, contexto y ruido..."), 800);
    setTimeout(() => setNewsStatusText("Reescribiendo como insight Wentix para el inicio..."), 1600);

    try {
      const response = await fetch("/api/gemini/model-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newsUrl.trim(),
          angle: newsAngle.trim()
        })
      });

      if (!response.ok) {
        throw new Error("La API de noticias fallo");
      }

      const data = await response.json();
      if (data.success && data.article) {
        const article: ResourceArticle = {
          id: `news-${Date.now()}`,
          title: data.article.title,
          category: data.article.category || "Radar IA",
          difficulty: data.article.difficulty,
          readTime: data.article.readTime || "4 min de lectura",
          excerpt: data.article.excerpt,
          author: data.article.author || "Wentix Radar",
          date: data.article.date || new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
          tags: data.article.tags || ["IA", "Tendencias"],
          views: data.article.views || Math.floor(1400 + Math.random() * 5200)
        };

        setArticles((prev) => [article, ...prev]);
        setActiveTab("home");
        setNewsUrl("");
        setNewsAngle("");
        showToast(`Noticia modelada y publicada en el inicio: ${article.title}`);
      }
    } catch (err) {
      console.warn("News modeling error:", err);
      showToast("Error al modelar la noticia. Usa una URL publica y vuelve a intentar.");
    } finally {
      setIsModelingNews(false);
      setNewsStatusText("");
    }
  };

  const handleNewsBatchModeling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsBatchUrls.trim() || isModelingNewsBatch) return;

    setIsModelingNewsBatch(true);
    setNewsStatusText("Escaneando fuentes por lote...");

    try {
      const response = await fetch("/api/gemini/model-news-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: newsBatchUrls,
          angle: newsAngle.trim(),
          limit: 6
        })
      });

      if (!response.ok) {
        throw new Error("La API batch de noticias fallo");
      }

      const data = await response.json();
      const importedArticles: ResourceArticle[] = (data.results || [])
        .filter((item: any) => item.article)
        .map((item: any, index: number) => ({
          id: `news-batch-${Date.now()}-${index}`,
          title: item.article.title,
          category: item.article.category || "Radar IA",
          difficulty: item.article.difficulty,
          readTime: item.article.readTime || "4 min de lectura",
          excerpt: item.article.excerpt,
          author: item.article.author || "Wentix Radar",
          date: item.article.date || new Date().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }),
          tags: item.article.tags || ["IA", "Tendencias"],
          views: item.article.views || Math.floor(1400 + Math.random() * 5200)
        }));

      if (importedArticles.length > 0) {
        setArticles((prev) => [...importedArticles, ...prev]);
        setActiveTab("home");
        setNewsBatchUrls("");
        showToast(`Radar Wentix publico ${importedArticles.length} noticias modeladas.`);
      } else {
        showToast("No se pudo modelar ninguna fuente del lote.");
      }
    } catch (err) {
      console.warn("News batch modeling error:", err);
      showToast("Error al escanear el lote. Revisa que las URLs sean publicas.");
    } finally {
      setIsModelingNewsBatch(false);
      setNewsStatusText("");
    }
  };

  // Add custom manual tool with the form
  const handleAddNewTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolForm.name || !newToolForm.url) {
      showToast("Por favor introduce el nombre y URL");
      return;
    }

    const created: AITool = {
      id: `tool-${Date.now()}`,
      name: newToolForm.name,
      description: newToolForm.description || "Herramienta añadida a través de Wentix CMS",
      pricing: newToolForm.pricing,
      category: newToolForm.category,
      score: Number(newToolForm.score) || 4.8,
      tags: newToolForm.tags ? newToolForm.tags.split(",").map(t => t.trim()) : ["custom", "creator"],
      url: newToolForm.url,
      stars: newToolForm.stars ? Number(newToolForm.stars) : undefined,
      isLatest: true
    };

    setTools((prev) => [created, ...prev]);
    showToast(`¡${newToolForm.name} agregada manualmente al ecosistema!`);
    
    if (pushSubscribed) {
      setTimeout(() => {
        triggerPushNotification(
          `🛠️ Nueva Herramienta: ${created.name}`,
          `Agregada manualmente al catálogo: "${created.description.slice(0, 75)}..."`,
          "Administración"
        );
      }, 1000);
    }

    setShowAddForm(false);
    setActiveTab("tools");
    setNewToolForm({
      name: "",
      description: "",
      pricing: "Freemium",
      category: "Herramientas IA",
      score: 4.8,
      tags: "",
      url: "",
      stars: ""
    });
  };

  // Helper to calculate real-time, dynamic database item counts per category
  const getLiveCategoryCount = (categoryName: string) => {
    if (categoryName === "Repositorios GitHub") {
      return repos.length;
    }
    if (categoryName === "Prompts") {
      return prompts.length;
    }
    if (categoryName === "Automatizaciones" || categoryName === "Automatización") {
      return workflows.length;
    }

    // Count exact matches in databases
    const countInTools = tools.filter((t) => t.category === categoryName).length;
    const countInRepos = repos.filter((r) => r.category === categoryName).length;
    const countInPrompts = prompts.filter((p) => p.category === categoryName).length;

    return countInTools + countInRepos + countInPrompts;
  };

  // Helper dictionary lookup for Category Icons
  const getCategoryIcon = (iconName: string, classNameString?: string) => {
    const defaultCls = classNameString || "w-5 h-5";
    switch (iconName) {
      case "Wrench": return <Wrench className={`${defaultCls} text-cyan-400`} />;
      case "Github": return <Github className={`${defaultCls} text-purple-400`} />;
      case "GitBranch": return <GitBranch className={`${defaultCls} text-blue-400`} />;
      case "MessageSquareCode": return <MessageSquareCode className={`${defaultCls} text-emerald-400`} />;
      case "Bot": return <Bot className={`${defaultCls} text-yellow-400`} />;
      case "Cpu": return <Cpu className={`${defaultCls} text-pink-400`} />;
      case "Code": return <Code className={`${defaultCls} text-amber-500`} />;
      case "Zap": return <Zap className={`${defaultCls} text-orange-400`} />;
      case "ShoppingBag": return <ShoppingBag className={`${defaultCls} text-indigo-400`} />;
      case "Megaphone": return <Megaphone className={`${defaultCls} text-rose-400`} />;
      case "Paintbrush": return <Paintbrush className={`${defaultCls} text-teal-400`} />;
      case "Video": return <Video className={`${defaultCls} text-violet-400`} />;
      case "Binary": return <Binary className={`${defaultCls} text-sky-400`} />;
      case "Heart": return <Heart className={`${defaultCls} text-red-500`} />;
      case "FileText": return <FileText className={`${defaultCls} text-emerald-400`} />;
      default: return <Sparkles className={`${defaultCls} text-neutral-400`} />;
    }
  };

  // Filter systems triggered inside views
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category check: strict database matching
    const matchesCategory = selectedCategory === "Todos" || 
                            tool.category === selectedCategory ||
                            (selectedCategory === "Herramientas IA" && tool.category === "Herramientas IA") ||
                            (selectedCategory === "Open Source" && (
                              tool.pricing.toLowerCase() === "open source" ||
                              tool.tags.some(t => t.toLowerCase() === "open source" || t.toLowerCase() === "opensource")
                            ));
    const matchesPricing = pricingFilter === "All" || tool.pricing.toLowerCase() === pricingFilter.toLowerCase();
    const matchesTrending = !onlyTrending || tool.isTrending || (tool.stars && tool.stars > 8000);

    return matchesSearch && matchesCategory && matchesPricing && matchesTrending;
  });

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          repo.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    // Category check: strict database matching
    const matchesCategory = selectedCategory === "Todos" || 
                            repo.category === selectedCategory ||
                            (selectedCategory === "Repositorios GitHub" && repo.category === "Repositorios GitHub") ||
                            (selectedCategory === "Open Source" && (
                              repo.category === "Open Source AI" ||
                              repo.tags.some(t => t.toLowerCase() === "open source" || t.toLowerCase() === "opensource")
                            ));
    return matchesSearch && matchesCategory;
  });

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    // Category check: strict database matching
    const matchesCategory = selectedCategory === "Todos" || 
                            prompt.category === selectedCategory ||
                            (selectedCategory === "Prompts" && prompt.category === "Prompts");
    const matchesDifficulty = difficultyFilter === "All" || prompt.difficulty === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate bookmark counts and bookmark items
  const bookmarkedToolsList = tools.filter((t) => bookmarks.includes(t.id));
  const bookmarkedReposList = repos.filter((r) => bookmarks.includes(r.id));
  const bookmarkedPromptsList = prompts.filter((p) => bookmarks.includes(p.id));

  const totalBookmarksLength = bookmarks.length;

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans selection:bg-cyan-500 selection:text-black relative tech-grid tech-grid-moving" id="wentix-platform-root">
      
      {/* Decorative Blur Backgrounds Vercel-Stripe aesthetics */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 left-1/3 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* FIXED TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-cyan-500/50 text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.2)] flex items-center gap-3 transition-all duration-300 transform animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span className="text-xs font-mono tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* SECURE CYBERPUNK PASSCODE MODAL */}
      {showPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          {/* Backdrop lock */}
          <div 
            className="absolute inset-0 bg-[#020204]/85 backdrop-blur-md"
            onClick={() => {
              setShowPasscodeModal(false);
              setPasscodeInput("");
              setPasscodeError("");
            }}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-sm bg-[#09090d]/95 border border-white/10 rounded-2xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Glowing Accent Ring */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Ecosistema Wentix</h3>
                  <p className="text-[9px] text-neutral-400 font-mono">Panel Administrativo Privado</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPasscodeModal(false);
                  setPasscodeInput("");
                  setPasscodeError("");
                }}
                className="w-6 h-6 rounded-md hover:bg-white/5 text-neutral-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed mb-4">
              Por motivos de seguridad, las métricas de scraping y bases de datos están restringidas. Introduce la clave de creador para continuar:
            </p>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div>
                <label className="block text-[8px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">CLAVE DE ACCESO REQUERIDA (CLAVE_WENTIX)</label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="••••••••••••••"
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (passcodeError) setPasscodeError("");
                  }}
                  className="w-full bg-black border border-white/10 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-neutral-700 tracking-widest focus:outline-none focus:ring-0 text-center"
                />
              </div>

              {passcodeError && (
                <div className="text-[10px] text-rose-450 font-mono text-center bg-rose-950/20 py-1.5 rounded-lg border border-rose-500/10 animate-pulse">
                  ❌ {passcodeError}
                </div>
              )}

              <div className="flex gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasscodeModal(false);
                    setPasscodeInput("");
                    setPasscodeError("");
                  }}
                  className="flex-1 py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-white/5 text-neutral-300 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-purple-600/20 transition-all cursor-pointer text-center select-none"
                >
                  Desbloquear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. NAVBAR MINIMALISTA */}
      <header className="sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 flex flex-col" id="navbar">
        {/* Top Mini Gamer/Creator Bar */}
        <div className="w-full bg-[#09090d]/80 border-b border-white/[0.03] py-1.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Left side: status */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-neutral-400">
              <span 
                onClick={() => setShowPasscodeModal(true)}
                className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse cursor-pointer" 
                title="Status Connection"
              />
              <span>Ecosistema de IA en Español</span>
              <span className="hidden md:inline text-neutral-700">|</span>
              <span className="hidden md:inline text-[9px] uppercase tracking-wider text-neutral-500">Recursos de Libre Acceso</span>
            </div>
            
            {/* Right side: quick access */}
            <div className="flex items-center gap-1.5">
              {isAdmin && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setActiveTab("admin");
                      const el = document.getElementById("directorio-directo");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap border ${
                      activeTab === "admin"
                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/15"
                        : "text-neutral-300 hover:text-white hover:bg-white/5 border-white/15"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 text-purple-400" />
                    <span>Admin Metrics</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      localStorage.setItem("wentix_is_admin", "false");
                      if (activeTab === "admin") {
                        setActiveTab("tools");
                      }
                      showToast("🔒 Acceso administrativo bloqueado.");
                    }}
                    className="p-1 rounded bg-red-950/40 border border-red-500/30 text-red-100 hover:text-red-300 hover:bg-red-900/60 transition-all cursor-pointer flex items-center justify-center"
                    title="Cerrar Panel / Bloquear Métricas"
                  >
                    <Lock className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Header Container (Primary Directories & Search) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 w-full flex items-center justify-between">
          
          {/* Left: Logo Brand (Visible always) */}
          <div className="flex items-center group cursor-pointer shrink-0" onClick={() => { setSelectedCategory("Todos"); setActiveTab("home"); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            <WentixLogo size="sm" />
          </div>

          {/* MIDDLE: DESKTOP PRIMARY DECK NAVIGATION (Only visible on lg:flex, which is widescreen!) */}
          <div className="hidden lg:flex items-center gap-1.5 bg-[#09090d]/80 p-1 rounded-2xl border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => {
                setActiveTab("home");
                setSelectedCategory("Todos");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTab === "home"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm shadow-cyan-500/10"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("tools");
                setSelectedCategory("Todos");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTab === "tools"
                  ? "bg-cyan-500 text-black shadow-sm"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span>Herramientas IA</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ${activeTab === "tools" ? "bg-black/15 text-black font-extrabold" : "bg-neutral-950 text-neutral-400"}`}>{tools.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("repos");
                setSelectedCategory("Todos");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
                activeTab === "repos"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Github className="w-3.5 h-3.5 shrink-0" />
              <span>GitHub Repos</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ${activeTab === "repos" ? "bg-black/30 text-white font-extrabold" : "bg-neutral-950 text-neutral-400"}`}>{repos.length}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("0-a-pro");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "0-a-pro"
                  ? "bg-amber-500 text-black shadow-sm font-extrabold"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>0 a PRO</span>
              <span className="text-[7.5px] font-mono px-1 py-0.2 rounded bg-neutral-950 text-amber-400 font-extrabold shrink-0 border border-amber-500/10">ACADEMIA</span>
            </button>



            <button
              onClick={() => {
                setActiveTab("saas");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap border ${
                activeTab === "saas"
                  ? "bg-neutral-900 border-amber-500/30 text-amber-400 font-extrabold shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-amber-300 border-white/5"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Tienda (Próximamente)</span>
              <span className="text-[7.5px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-amber-400 font-extrabold shrink-0 border border-amber-500/10">PRONTO</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("bookmarks");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "bookmarks"
                  ? "bg-white text-black font-bold"
                  : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono font-black shrink-0 ${activeTab === "bookmarks" ? "bg-cyan-500 text-black" : "bg-[#0c0c0c] text-cyan-400"}`}>{bookmarks.length}</span>
            </button>
          </div>

          {/* RIGHT: DESKTOP SEARCH (Only visible on lg:flex, which is widescreen!) */}
          <div className="hidden lg:block relative w-48 xl:w-52 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab === "home") {
                  setActiveTab("tools");
                }
              }}
              placeholder="Buscar..."
              className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-8.5 pr-8 py-1.5 text-xs text-white placeholder-neutral-550 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-2xs text-neutral-450 hover:text-white font-mono cursor-pointer transition-colors p-1">✕</button>
            )}
          </div>

          {/* MOBILE/TABLET SIDE CONTROLS: Hamburger button (Only visible on < lg, i.e., mobile/tablet) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("bookmarks");
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="p-2 rounded-xl bg-neutral-900 border border-white/5 text-neutral-300 hover:text-white flex items-center gap-1 hover:bg-neutral-800 transition-all cursor-pointer"
              title="Mis Guardados"
            >
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
              <span className="text-[10px] font-mono font-bold bg-[#0c0c0c] px-1.5 py-0.2 text-cyan-400 rounded-md">{bookmarks.length}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center select-none"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-300" />
              )}
            </button>
          </div>

        </div>

        {/* MOBILE/TABLET SLIDE-DOWN DRAWER (Only visible when mobileMenuOpen is true & screen width is < lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-[#050505]/98 border-t border-white/5 py-4 px-4 sm:px-6 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Search Input for Mobile */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab === "home") {
                    setActiveTab("tools");
                  }
                }}
                placeholder="Buscar herramientas, prompts..."
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl pl-10 pr-8 py-3 text-xs text-white placeholder-neutral-550 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-450 hover:text-white font-mono cursor-pointer transition-colors p-1">✕</button>
              )}
            </div>

            {/* Nav Links Stack */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab("home");
                  setSelectedCategory("Todos");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === "home"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Inicio</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("tools");
                  setSelectedCategory("Todos");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === "tools"
                    ? "bg-cyan-500 text-black"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span>Herramientas IA</span>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-extrabold ${activeTab === "tools" ? "bg-black/15 text-black" : "bg-neutral-900 text-neutral-400"}`}>{tools.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("repos");
                  setSelectedCategory("Todos");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === "repos"
                    ? "bg-purple-600 text-white"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Github className="w-4 h-4 shrink-0" />
                  <span>GitHub Repos</span>
                </div>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-extrabold ${activeTab === "repos" ? "bg-black/30 text-white" : "bg-neutral-900 text-neutral-400"}`}>{repos.length}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("0-a-pro");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  activeTab === "0-a-pro"
                    ? "bg-amber-500 text-black shadow-sm"
                    : "text-neutral-300 hover:bg-neutral-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className="w-4 h-4 shrink-0" />
                  <span>🎓 Academia 0 a PRO</span>
                </div>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-950 text-amber-400 font-extrabold border border-amber-500/10">NUEVO</span>
              </button>



              <button
                onClick={() => {
                  setActiveTab("saas");
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold tracking-wide transition-all cursor-pointer border ${
                  activeTab === "saas"
                    ? "bg-neutral-900 border-amber-500/30 text-amber-400 font-extrabold shadow-sm"
                    : "text-neutral-450 hover:bg-neutral-900 border-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Tienda (Próximamente)</span>
                </div>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-amber-400 font-extrabold border border-amber-500/10">PRONTO</span>
              </button>
            </div>
          </div>
        )}

          {/* Right Action CTAs Desktop removed */}

      </header>

      {activeTab === "home" && (
        <>
          {/* 2. HERO SECTION */}
          <section className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden" id="hero-section">
            {/* Animated backdrop light indicator */}
            <div className="absolute top-1/4 w-32 h-32 bg-cyan-400/20 blur-3xl rounded-full" />
            
            {/* Majestic Centered Logo */}
            <WentixLogo size="lg" className="mb-10" />

            {/* Floating ORBI Hologram Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-neutral-900/80 hover:bg-neutral-900 border border-cyan-500/20 text-xs text-neutral-300 font-mono tracking-wide mb-6 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:scale-105 transition-transform">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold">ORBI ASSISTANT:</span>
              <span>¿Cómo te ayudo hoy a monetizar o automatizar mañana?</span>
              <Bot className="w-4 h-4 text-cyan-400 animate-float" />
            </div>

            {/* Headline Gigante */}
            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-display mb-6 leading-tight">
              El ecosistema definitivo de <br />
              <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent italic font-mono pr-2">inteligencia artificial</span> en español.
            </h1>

            {/* Subtitle description */}
            <p className="max-w-2xl text-sm sm:text-base lg:text-lg text-neutral-400 font-sans leading-relaxed mb-10">
              Descubre herramientas IA contrastadas, copia prompts profesionales listos para producción, ejecuta automatizaciones optimizadas para redes sociales y accede al stack gratuito para creadores y emprendedores digitales.
            </p>

            {/* NEW LEAD CAPTURE SECTION (SECCIÓN PRINCIPAL) */}
            <div className="w-full max-w-2xl bg-neutral-950/80 border border-white/10 p-6 md:p-8 rounded-3xl mt-8 shadow-[0_10px_40px_rgba(0,180,255,0.06)] relative overflow-hidden backdrop-blur-md">
              {/* subtle decorative radial lights */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-2xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-550/10 blur-2xl rounded-full" />
              
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 leading-tight flex items-center justify-center gap-2">
                🚀 Somos +{(1358 + leadStats.leadsCount).toLocaleString()} personas construyendo con IA
              </h2>
              
              <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed mb-6">
                Recibe nuevas herramientas, prompts, automatizaciones y recursos gratuitos.
              </p>

              <form onSubmit={handleLeadJoin} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={leadEmailInput}
                    onChange={(e) => setLeadEmailInput(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full bg-black border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-550 focus:outline-none focus:ring-0 font-mono transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none whitespace-nowrap"
                >
                  <span>{isSubmittingLead ? "Registrando..." : "Quiero unirme"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-[10px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">🔒 Sin contraseñas ni registros invasivos</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">⚡ Acceso 100% libre e inmediato</span>
              </div>
            </div>

            {/* Buttons and Exploration CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md mt-6">
              <button
                onClick={() => {
                  setActiveTab("tools");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-350 hover:text-white border border-white/5 font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95 text-center"
              >
                <span>Explorar Directorio IA</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-purple-400 font-medium text-xs tracking-wider border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Consola Scraper</span>
                </button>
              )}
            </div>

            {/* CONTADOR SOCIAL - ACTUALIZACIÓN AUTOMÁTICA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mt-12 p-4 rounded-2xl bg-neutral-900/30 backdrop-blur-xs relative border border-white/5">
              <div className="p-4 text-center">
                <span className="block text-2xl lg:text-3xl font-extrabold text-white font-display">
                  +{(1358 + leadStats.leadsCount).toLocaleString()}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Personas Registradas</span>
              </div>
              <div className="p-4 text-center border-l border-white/5">
                <span className="block text-2xl lg:text-3xl font-extrabold text-cyan-400 font-display">
                  {tools.length}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Herramientas Publicadas</span>
              </div>
              <div className="p-4 text-center border-l border-white/5">
                <span className="block text-2xl lg:text-3xl font-extrabold text-purple-400 font-display">
                  {repos.length}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Repositorios Agregados</span>
              </div>
              <div className="p-4 text-center border-l border-white/5">
                <span className="block text-2xl lg:text-3xl font-extrabold text-emerald-400 font-display">
                  {prompts.length}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono">Recursos Disponibles</span>
              </div>
            </div>
          </section>

          {/* DYNAMIC CATEGORY BENTO HUB - NAVEGACIÓN AISLADA */}
          <section className="px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto border-t border-white/5" id="categorias-landing">
            <div className="mb-8">
              <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> EXPLORA EL ECOSISTEMA POR SECTORES
              </div>
              <h2 className="text-3xl font-black tracking-tight font-display text-white">Navegación Especializada</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl font-mono">Haz clic en cualquier sector para cargar las herramientas, código abierto o prompts correspondientes de manera separada.</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    if (cat.name === "Repositorios GitHub") {
                      setActiveTab("repos");
                      setSelectedCategory("Todos");
                      showToast(`Explorando todos los Repositorios GitHub`);
                    } else if (cat.name === "Prompts") {
                      setActiveTab("prompts");
                      setSelectedCategory("Todos");
                      showToast(`Explorando todas las Plantillas de Prompts`);
                    } else if (cat.name === "Herramientas IA") {
                      setActiveTab("tools");
                      setSelectedCategory("Todos");
                      showToast(`Explorando todas las Herramientas IA`);
                    } else {
                      setSelectedCategory(cat.name);
                      
                      // Dynamically choose where this subcategory is represented
                      const hasTools = tools.some(t => t.category === cat.name);
                      const hasRepos = repos.some(r => r.category === cat.name);
                      const hasPrompts = prompts.some(p => p.category === cat.name);
                      
                      if (hasPrompts) {
                        setActiveTab("prompts");
                      } else if (hasRepos) {
                        setActiveTab("repos");
                      } else {
                        setActiveTab("tools"); // Default fallback
                      }
                      showToast(`Filtro activo: ${cat.name}`);
                    }
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-5 rounded-2xl text-left transition-all duration-300 relative overflow-hidden cursor-pointer select-none border group glass-panel border-white/5 hover:border-white/15 hover:bg-neutral-900/40 hover:-translate-y-1 block"
                >
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-linear-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-neutral-950 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                      {getCategoryIcon(cat.icon)}
                    </div>
                    {getLiveCategoryCount(cat.name) > 0 && (
                      <span className="text-[10px] font-mono font-bold text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded-full">
                        +{getLiveCategoryCount(cat.name)}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold font-display text-white mb-1 group-hover:text-cyan-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* NEW: PERMANENT DONATION CENTER RIGHT BELOW STATIC HERO */}
          <section className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto border border-orange-500/10 bg-orange-950/5 relative rounded-3xl mb-12 relative overflow-hidden" id="permanent-donation-panel">
            <div className="absolute top-3 right-6 flex items-center gap-1.5 bg-orange-950/40 border border-orange-500/10 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold text-orange-400 animate-pulse">
              <Heart className="w-3 h-3 text-orange-500 fill-orange-500/20" />
              <span>SOPORTE PERMANENTE WENTIX AI COMMUNITY</span>
            </div>
            <DonationCenter
              backers={backers}
              onAddBacker={(newBacker) => {
                setBackers(prev => [newBacker, ...prev]);
                handleAddNewDonation(newBacker);
              }}
              onShowToast={(msg) => showToast(msg)}
            />
          </section>

          {/* TRABAJA CONMIGO / SOLICITUD DE DESARROLLO */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/5" id="trabaja-conmigo">
            <div className="max-w-4xl mx-auto bg-neutral-950/40 p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
              {/* Neon corner decorative light */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/40 border border-cyan-850 text-cyan-400 rounded-full text-[10px] tracking-wide font-mono mb-3">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>COLABORACIÓN Y CONSULTORÍA IA</span>
                </div>
                <h2 className="text-3xl font-bold font-display text-white tracking-tight text-center">¿Tienes un proyecto? Trabajemos juntos</h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed text-center">
                  ¿Quieres automatizar los procesos de tu agencia, lanzar un micro-SaaS, integrar asistentes de inteligencia artificial personalizados (como ORBI) o escalar tu tienda online con automatizaciones avanzadas? Cuéntame tu proyecto y definiremos el mejor camino.
                </p>
              </div>

              <form onSubmit={handleCollabSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Tu Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Manuel Benítez"
                      value={collabName}
                      onChange={(e) => setCollabName(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Correo de Contacto</label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo@correo.com"
                      value={collabEmail}
                      onChange={(e) => setCollabEmail(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Presupuesto Estimado</label>
                    <select
                      value={collabBudget}
                      onChange={(e) => setCollabBudget(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-neutral-300 focus:outline-none transition-colors font-mono"
                    >
                      <option>Por definir / No estoy seguro</option>
                      <option>&lt; $500 USD (Microconsultorías / Scripts simples)</option>
                      <option>$500 - $1,500 USD (Automatizaciones / Flujos n8n / Bots)</option>
                      <option>$1,500 - $4,000 USD (Asistentes nativos / Multiagentes en la nube)</option>
                      <option>+$4,000 USD (Plataforma Completa / MicroSaaS / IA a medida)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Especialidad de Trabajo Requerida</label>
                    <div className="relative">
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-md">Verificado</span>
                      <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-neutral-400 font-mono select-none">
                        Ecosistema Wentix Dev Core
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-2">Describe brevemente tu idea de automatización, SaaS o negocio</label>
                  <textarea
                    required
                    rows={4}
                    maxLength={800}
                    placeholder="Por favor dinos qué te gustaría desarrollar o automatizar. Explica qué herramientas usas actualmente y cómo la IA puede ayudarte a escalar..."
                    value={collabMessage}
                    onChange={(e) => setCollabMessage(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 hover:border-white/15 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmittingCollab}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:brightness-110 text-black font-extrabold text-xs tracking-wider transition-all shadow-md shadow-cyan-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
                  >
                    {isSubmittingCollab ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>Enviando propuesta...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-black" />
                        <span>Enviar Solicitud de Proyecto</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </>
      )}

      {/* 4. MAIN CENTRAL HUB DIRECTORY SECTION */}
      {activeTab !== "home" && (
        <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto scroll-mt-20" id="directorio-directo">
        
        {/* Elegant Dynamic Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
              {activeTab === "tools" && "🛠️ Catálogo de Herramientas de IA"}
              {activeTab === "repos" && "🧑‍💻 Repositorios y Automatizaciones"}
              {activeTab === "workflows" && "🔄 Workflows y Plantillas de Trabajo"}
              {activeTab === "0-a-pro" && "🎓 Academia de IA de 0 a PRO"}
              {activeTab === "bookmarks" && "⭐ Tus Elementos Guardados"}
            </h2>
            <p className="text-xs text-neutral-450 mt-1 max-w-2xl font-mono">
              Procesando recursos avanzados de inteligencia artificial listos para usar e implementar hoy.
            </p>
          </div>
        </div>

        {/* Active Filters Display & Quick Tools bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-neutral-950 p-3.5 rounded-xl border border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Filtros:
            </span>

            {/* Price Filter for tools */}
            {activeTab === "tools" && (
              <select
                value={pricingFilter}
                onChange={(e) => setPricingFilter(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-neutral-300"
              >
                <option value="All">Cualquier Precio</option>
                <option value="Gratis">Gratis</option>
                <option value="Freemium">Freemium</option>
                <option value="Open Source">Open Source</option>
              </select>
            )}

            {/* Difficulty Filter for Prompts */}
            {activeTab === "prompts" && (
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="bg-neutral-900 border border-white/10 rounded-lg py-1 px-2.5 text-xs text-neutral-300"
              >
                <option value="All">Cualquier Dificultad</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            )}

            {/* General selected category tracker reset badge */}
            {selectedCategory !== "Todos" && (
              <button
                onClick={() => setSelectedCategory("Todos")}
                className="text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/30 px-2 py-0.5 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Categoría: <strong>{selectedCategory}</strong> (Quitar ×)
              </button>
            )}

            {activeTab === "tools" && (
              <label className="flex items-center gap-1.5 text-xs text-neutral-400 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyTrending}
                  onChange={(e) => setOnlyTrending(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-cyan-500 focus:outline-none focus:ring-0 focus:ring-offset-0"
                />
                <span>Solo populares (&gt; 4.8★)</span>
              </label>
            )}
          </div>

          <div className="text-[10px] font-mono text-neutral-500">
            Mostrando {
              activeTab === "tools" ? filteredTools.length :
              activeTab === "repos" ? filteredRepos.length :
              activeTab === "prompts" ? filteredPrompts.length :
              bookmarks.length
            } resultados
          </div>
        </div>

        {/* ======== 4.A DIRECTORIO DE HERRAMIENTAS IA VIEW ======== */}
        {activeTab === "tools" && (
          <div className="space-y-8">
            
            {/* Elegant category pills at top of Tools view for agile toggling */}
            <div className="pb-4 border-b border-white/5">
              <div className="text-[10px] font-bold text-cyan-400 font-mono uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Filter className="w-3 h-3" /> Filtrar por Especialidad IA:
              </div>
              <div className="flex flex-wrap items-center gap-2 py-1">
                <button
                  onClick={() => {
                    setSelectedCategory("Todos");
                    showToast(`Mostrando todo el catálogo`);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                    selectedCategory === "Todos"
                      ? "bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/15"
                      : "bg-neutral-900/60 text-neutral-400 border-white/5 hover:border-white/10 hover:text-white"
                  }`}
                >
                  <span>Todos</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${selectedCategory === "Todos" ? "bg-black/15 text-black font-extrabold" : "bg-neutral-950 text-neutral-500"}`}>
                    {tools.length}
                  </span>
                </button>

                {CATEGORIES_LIST.filter(c => c.name !== "Herramientas IA" && c.name !== "Repositorios GitHub" && c.name !== "Prompts").map((cat) => {
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        showToast(`Filtrado por ${cat.name}`);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? "bg-cyan-500 text-black border-cyan-450 shadow-md shadow-cyan-500/15"
                          : "bg-neutral-900/60 text-neutral-400 border-white/5 hover:border-white/10 hover:text-white"
                      }`}
                    >
                      <span>{getCategoryIcon(cat.icon, "w-3 h-3")}</span>
                      <span>{cat.name}</span>
                      {getLiveCategoryCount(cat.name) > 0 && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-black/15 text-black font-extrabold" : "bg-neutral-950 text-neutral-500"}`}>
                          {getLiveCategoryCount(cat.name)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catalog list header */}
            <div className="pt-2">
              <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-widest mb-1.5">CATÁLOGO CURADO</div>
              <h2 className="text-2xl font-bold font-display text-white tracking-tight">Directorio Principal de IA</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
                    setSelectedDetailItem({ type: "tool", item: tool });
                  }}
                  className="rounded-2xl glass-panel border border-white/5 hover:border-cyan-400/30 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative group cursor-pointer"
                >
                  {/* Subtle dynamic glow corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-tr from-transparent to-cyan-500/5 rounded-tr-2xl pointer-events-none" />

                  <div>
                    {/* Header line info */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-900 text-cyan-400 border border-cyan-800/20">
                          {tool.category}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                          tool.pricing === "Gratis" || tool.pricing === "Open Source"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                            : "bg-neutral-900 text-neutral-400"
                        }`}>
                          {tool.pricing}
                        </span>
                      </div>
                      
                      {/* Bookmark & Share Icons */}
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => toggleBookmark(tool.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            bookmarks.includes(tool.id)
                              ? "bg-cyan-550/20 border-cyan-400 text-cyan-400"
                              : "bg-neutral-900 hover:bg-neutral-800 border-white/5 text-neutral-500 hover:text-white"
                          }`}
                          title="Guardar marcador"
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setActiveShareItemId(activeShareItemId === tool.id ? null : tool.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            activeShareItemId === tool.id
                              ? "bg-purple-950/45 border-purple-500 text-purple-400"
                              : "bg-neutral-900 hover:bg-neutral-800 border-white/5 text-neutral-500 hover:text-white"
                          }`}
                          title="Compartir y ganar puntos"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Logo substitution, Stars & Title styling */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-950/80 border border-white/5 flex items-center justify-center shrink-0">
                        <Wrench className="w-4.5 h-4.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-display text-white tracking-wide flex items-center gap-1.5 group-hover:text-cyan-400 transition-colors">
                          {tool.name}
                          {tool.isTrending && (
                            <TrendingUp className="w-3 h-3 text-rose-500 animate-pulse" title="Trending" />
                          )}
                          {tool.isLatest && (
                            <span className="bg-purple-950 text-purple-400 border border-purple-800/30 text-[8px] font-mono px-1 rounded animate-pulse">NUEVO</span>
                          )}
                        </h3>
                        <div className="flex items-center gap-1">
                          <div className="flex gap-0.5 text-amber-400">
                            <span className="text-xs">★</span>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {tool.score} {tool.stars ? `(${tool.stars} votos)` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4 min-h-[36px] line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tool.tags.map((tg, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-neutral-400 bg-neutral-900/60 px-2 py-0.5 rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3.5">
                      <span className="text-[10px] font-mono text-neutral-500">
                        wentix metadata verified
                      </span>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 group-hover:bg-white group-hover:text-black cursor-pointer"
                      >
                        <span>Visitar</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {activeShareItemId === tool.id && (
                    <div className="absolute inset-x-0 bottom-0 bg-[#0c0c10]/98 border-t border-purple-500/30 rounded-b-2xl p-4 z-30 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">🎯 Compartir & ganar +5 PTS:</span>
                        <button 
                          onClick={() => setActiveShareItemId(null)}
                          className="text-neutral-500 hover:text-white text-xs font-mono font-bold cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[9px] font-mono">
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "WhatsApp"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-neutral-900 border border-white/5 hover:border-emerald-500/30 text-emerald-450 hover:text-white font-bold cursor-pointer">WhatsApp</button>
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "X / Twitter"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-neutral-900 border border-white/5 hover:border-white text-zinc-100 hover:text-white font-bold cursor-pointer">X (Twitter)</button>
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "LinkedIn"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-neutral-900 border border-white/5 hover:border-blue-500/30 text-blue-450 hover:text-white font-bold cursor-pointer">LinkedIn</button>
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "Telegram"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-neutral-900 border border-white/5 hover:border-sky-500/30 text-sky-450 hover:text-white font-bold cursor-pointer">Telegram</button>
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "Facebook"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-neutral-900 border border-white/5 hover:border-indigo-500/30 text-indigo-400 hover:text-white font-bold cursor-pointer">Facebook</button>
                        <button onClick={() => { handleShareItemAwardPoints(tool.name, "Amigo"); setActiveShareItemId(null); }} className="py-1 px-0.5 rounded bg-purple-950/30 border border-purple-800/30 text-purple-400 hover:text-purple-300 hover:bg-purple-950/50 text-[8.5px] font-black cursor-pointer">Amigo 📧</button>
                      </div>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="col-span-3 py-16 text-center border border-dashed border-white/10 rounded-2xl">
                <Info className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <span className="block text-sm font-semibold text-neutral-300">No se encontraron herramientas</span>
                <span className="text-xs text-neutral-500 mt-1 block">Prueba borrando tu búsqueda o seleccionando "Todos"</span>
              </div>
            )}
          </div>
          </div>
        )}

        {/* ======== 4.B REPOSITORIOS GITHUB VIEW ======== */}
        {activeTab === "repos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRepos.length > 0 ? (
              filteredRepos.map((repo) => (
                <div
                  key={repo.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
                    setSelectedDetailItem({ type: "repo", item: repo });
                  }}
                  className="rounded-2xl bg-neutral-950 border border-white/5 hover:border-purple-500/30 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 relative cursor-pointer"
                >
                  <div>
                    {/* Top Owner / Stars Line */}
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono">
                      <span className="text-neutral-500">{repo.owner} /</span>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Star className="w-3.5 h-3.5 fill-purple-400/20" />
                        <span>{(repo.stars / 1000).toFixed(1)}k stars</span>
                      </div>
                    </div>

                    {/* Icon and Name */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-950/40 rounded-xl border border-purple-900/30 flex items-center justify-center">
                        <Github className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-sm font-bold font-mono text-white hover:text-purple-400 transition-colors">
                        {repo.name}
                      </h3>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed mb-4 min-h-[36px] line-clamp-2">
                      {repo.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {repo.tags.map((tg, idx) => (
                        <span key={idx} className="text-[9px] font-mono text-neutral-400 bg-neutral-900 border border-white/5 px-2 py-0.5 rounded">
                          {tg}
                        </span>
                      ))}
                    </div>

                    {/* Tech details and fork link */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          {repo.language}
                        </span>
                        <span>Forks: {repo.forks}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleBookmark(repo.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            bookmarks.includes(repo.id)
                              ? "bg-purple-950/80 border-purple-500 text-purple-400"
                              : "bg-neutral-900 hover:bg-neutral-800 border-white/5 text-neutral-500 hover:text-white"
                          }`}
                        >
                          <BookMarked className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-white text-xs font-mono font-bold text-neutral-300 hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Terminal className="w-3 h-3 text-purple-400" />
                          <span>Code</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-16 text-center border border-dashed border-white/10 rounded-2xl">
                <Github className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                <span className="block text-sm font-semibold text-neutral-300">No se encontraron repositorios</span>
                <span className="text-xs text-neutral-500 mt-1 block">Prueba ampliando tu criterio de búsqueda en la barra global</span>
              </div>
            )}
          </div>
        )}



        {/* ======== 4.E USUARIOS FAVORITOS / MARCADOS VIEW ======== */}
        {activeTab === "bookmarks" && (
          <div className="space-y-6">
            <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Tu Lista Personalizada de Tesoros IA Guardada
            </h3>

            {bookmarks.length > 0 ? (
              <div className="space-y-4">
                
                {/* Bookmarked Tools */}
                {bookmarkedToolsList.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-white mb-2.5 font-mono uppercase tracking-wider">Herramientas IA Guardadas ({bookmarkedToolsList.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bookmarkedToolsList.map((tool) => (
                        <div key={tool.id} className="p-4 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">{tool.name}</span>
                            <span className="text-[10px] text-neutral-400">{tool.description.substring(0, 50)}...</span>
                          </div>
                          <button onClick={() => toggleBookmark(tool.id)} className="text-xs text-red-500 hover:underline">Quitar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookmarked Repos */}
                {bookmarkedReposList.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-xs font-bold text-white mb-2.5 font-mono uppercase tracking-wider">Repositorios Guardados ({bookmarkedReposList.length})</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {bookmarkedReposList.map((repo) => (
                        <div key={repo.id} className="p-4 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-mono font-bold text-white block">{repo.owner}/{repo.name}</span>
                            <span className="text-[10px] text-neutral-400">{repo.stars} stars</span>
                          </div>
                          <button onClick={() => toggleBookmark(repo.id)} className="text-xs text-red-500 hover:underline">Quitar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bookmarkedPromptsList.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-xs font-bold text-white mb-2.5 font-mono uppercase tracking-wider">Prompts Guardados ({bookmarkedPromptsList.length})</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {bookmarkedPromptsList.map((prompt) => (
                        <div key={prompt.id} className="p-4 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white block">{prompt.title}</span>
                            <span className="text-[10px] text-neutral-400">{prompt.model} ({prompt.difficulty})</span>
                          </div>
                          <button onClick={() => toggleBookmark(prompt.id)} className="text-xs text-red-500 hover:underline">Quitar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


                
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <BookMarked className="w-12 h-12 text-cyan-400/30 mx-auto mb-4" />
                <h4 className="text-base text-white font-semibold">Aún no tienes tesoros guardados</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-2 leading-relaxed">
                  Para guardar marcadores, simplemente haz clic en el icono del marcador de cualquier recurso, prompt, o repositorio dentro de la sección principal.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "0-a-pro" && (
          <AIZeroToPro 
            onShowToast={showToast} 
            prompts={prompts} 
            articles={articles}
            bookmarks={bookmarks} 
            onToggleBookmark={toggleBookmark} 
          />
        )}

        {activeTab === "saas" && (
          <SaaSStore 
            onShowToast={showToast} 
            onAddBacker={handleAddNewDonation} 
          />
        )}

        {activeTab === "admin" && isAdmin && (
          <div className="pt-2 space-y-12 animate-fade-in text-left">
            
            {/* Scraper and CMS module moved here out of general landing */}
            <div className="p-6 md:p-8 rounded-3xl bg-neutral-950 border border-white/5 relative" id="admin-cms-scrapers">
              <div className="absolute top-3 right-6 flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/10 px-2.5 py-1 rounded-full text-[9px] font-mono font-semibold text-purple-400 animate-pulse">
                <span>CONSOLA SCRAPER DE CONTROL</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-950/40 border border-purple-800/30 text-purple-400 rounded-full text-[10px] tracking-wide font-mono">
                    <Sparkles className="w-3 h-3" />
                    <span>ENTORNO SEGURO ADMIN</span>
                  </div>
                  <h2 className="text-2xl font-bold font-display text-white">
                    Célula de Curación Wentix
                  </h2>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Extrae datos públicos, detecta repositorios GitHub y modela cada recurso como ficha propia para el catálogo Wentix. No copia contenido: lo reescribe y lo adapta a nuestra plataforma.
                    </p>
                </div>

                <div className="lg:col-span-7 bg-neutral-900/50 p-5 rounded-2xl border border-white/5">
                  <form onSubmit={handleUrlScraping} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-neutral-400 mb-1.5 uppercase tracking-wider">Origen de Datos</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Herramienta IA", "Repositorio GitHub", "Artículo / Recurso"].map((src) => (
                          <button
                            key={src}
                            type="button"
                            onClick={() => setScrapeSource(src)}
                            className={`py-1.5 px-2 border text-[9px] font-semibold rounded-lg transition-colors cursor-pointer select-none text-center ${
                              scrapeSource === src 
                                ? "bg-purple-950/50 text-purple-400 border-purple-500/70" 
                                : "bg-white/5 text-neutral-400 border-white/5 hover:bg-white/10"
                            }`}
                          >
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">URL de Referencia</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={scrapeUrl}
                          onChange={(e) => setScrapeUrl(e.target.value)}
                          placeholder="https://github.com/google/gemma-2"
                          className="flex-1 bg-black border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-650 font-mono"
                        />
                        <button
                          type="submit"
                          disabled={isScraping || !scrapeUrl.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 hover:brightness-110 disabled:opacity-50 text-black rounded-xl font-bold text-xs cursor-pointer min-w-[100px]"
                        >
                          {isScraping ? "Modelando..." : "Modelar"}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Terminal feedback logs */}
                  {isScraping && (
                    <div className="mt-3 p-3 bg-black rounded-xl border border-white/5 font-mono text-[9px] text-emerald-400 space-y-1">
                      <div>&gt; [AGENT STATUS]: {scrapingStatusText}</div>
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/5 rounded-xl bg-purple-950/10 border border-purple-500/10 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-purple-300 uppercase tracking-wider">Radar autonomo backend</label>
                        <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                          Ejecuta la cola del radar y publica arriba solo los articulos nuevos por titulo.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRunRadarNow}
                        disabled={isRunningRadar}
                        className="shrink-0 px-4 py-2 bg-purple-400 hover:bg-purple-300 disabled:opacity-50 text-black rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isRunningRadar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunningRadar ? "Ejecutando..." : "Ejecutar Radar Ahora"}</span>
                      </button>
                    </div>

                    {radarRunStatusText && (
                      <div className="p-3 bg-black rounded-xl border border-white/5 font-mono text-[9px] text-purple-300">
                        &gt; [RADAR AUTO]: {radarRunStatusText}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-emerald-950/10 border border-emerald-500/10 p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-emerald-300 uppercase tracking-wider">PromptRadar prompts.chat</label>
                        <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                          Importa prompts en ingles y los publica con titulo, descripcion, categoria y nivel en español.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRunPromptRadarNow}
                        disabled={isRunningPromptRadar}
                        className="shrink-0 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {isRunningPromptRadar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isRunningPromptRadar ? "Importando..." : "Importar Prompts"}</span>
                      </button>
                    </div>

                    {promptRadarStatusText && (
                      <div className="p-3 bg-black rounded-xl border border-white/5 font-mono text-[9px] text-emerald-300">
                        &gt; [PROMPT RADAR]: {promptRadarStatusText}
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleNewsModeling} className="mt-5 pt-4 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Radar de Noticias IA</label>
                        <p className="mt-1 text-[10px] text-neutral-500 leading-relaxed">
                          Pega una fuente publica. Wentix la resume, reescribe y publica como insight del inicio.
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-cyan-500/20 bg-cyan-950/30 px-2.5 py-1 text-[9px] font-mono font-bold text-cyan-400">
                        HOME FEED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr_auto] gap-2">
                      <input
                        type="url"
                        required
                        value={newsUrl}
                        onChange={(e) => setNewsUrl(e.target.value)}
                        placeholder="https://fuente.com/noticia-ia"
                        className="bg-black border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-650 font-mono"
                      />
                      <input
                        type="text"
                        value={newsAngle}
                        onChange={(e) => setNewsAngle(e.target.value)}
                        placeholder="Angulo: builders, ecommerce, creators..."
                        className="bg-black border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-650"
                      />
                      <button
                        type="submit"
                        disabled={isModelingNews || !newsUrl.trim()}
                        className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black rounded-xl font-bold text-xs cursor-pointer min-w-[110px]"
                      >
                        {isModelingNews ? "Publicando..." : "Publicar"}
                      </button>
                    </div>
                  </form>

                  {(isModelingNews || isModelingNewsBatch) && (
                    <div className="mt-3 p-3 bg-black rounded-xl border border-white/5 font-mono text-[9px] text-cyan-400 space-y-1">
                      <div>&gt; [RADAR STATUS]: {newsStatusText}</div>
                    </div>
                  )}

                  <form onSubmit={handleNewsBatchModeling} className="mt-3 rounded-xl border border-cyan-500/10 bg-cyan-950/10 p-3 space-y-2">
                    <label className="block text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Radar por lote</label>
                    <textarea
                      rows={3}
                      value={newsBatchUrls}
                      onChange={(e) => setNewsBatchUrls(e.target.value)}
                      placeholder={"https://fuente.com/noticia-1\nhttps://otrafuente.com/reporte-ia\nhttps://github.com/org/repo"}
                      className="w-full bg-black border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-650 font-mono resize-none"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] text-neutral-500">Una URL por linea. Maximo 6 por corrida para evitar timeouts.</span>
                      <button
                        type="submit"
                        disabled={isModelingNewsBatch || !newsBatchUrls.trim()}
                        className="px-4 py-2 bg-neutral-100 hover:bg-white disabled:opacity-50 text-black rounded-xl font-bold text-xs cursor-pointer"
                      >
                        {isModelingNewsBatch ? "Escaneando..." : "Escanear lote"}
                      </button>
                    </div>
                  </form>

                  {/* Manual add button toggle */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Añadir elemento de prueba directa</span>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      {showAddForm ? "Cerrar" : "Añadir Manual"}
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleAddNewTool} className="mt-4 p-4 bg-black rounded-xl border border-white/5 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Nombre"
                          value={newToolForm.name}
                          onChange={(e) => setNewToolForm({ ...newToolForm, name: e.target.value })}
                          className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-xs text-white"
                        />
                        <input
                          type="url"
                          required
                          placeholder="URL"
                          value={newToolForm.url}
                          onChange={(e) => setNewToolForm({ ...newToolForm, url: e.target.value })}
                          className="bg-neutral-900 border border-white/5 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Descripción"
                        value={newToolForm.description}
                        onChange={(e) => setNewToolForm({ ...newToolForm, description: e.target.value })}
                        className="w-full bg-neutral-900 border border-white/5 rounded-lg p-2 text-xs text-white"
                      />
                      <button type="submit" className="w-full py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer">
                        Publicar Directamente
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <ViralGrowthSystem
              onShowToast={(msg) => showToast(msg)}
              triggerPushNotification={(title, body, cat) => triggerPushNotification(title, body, cat)}
              leadStats={leadStats}
              onRefreshStats={fetchLeadStats}
            />
          </div>
        )}
        </section>
      )}

      {activeTab === "home" && (
        <>
          {/* 5. RECURSOS / BLOG SELECTION STYLED NOTION + MEDIUM */}
          <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/5" id="blog-recursos">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-xs font-bold text-purple-400 font-mono uppercase tracking-widest mb-1.5">RADAR WENTIX</div>
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">Selección IA del Día</h2>
          <p className="text-xs text-neutral-400 mt-2">
            Solo 3 piezas importantes en portada. El resto queda modelado dentro de la academia y el radar interno.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {homeRadarArticles.map((art) => (
            <article 
              key={art.id} 
              className="rounded-2xl glass-panel border border-white/5 hover:border-white/12 p-6 flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-neutral-400">
                  <span className="text-cyan-400 font-bold bg-cyan-950/40 px-2 py-0.5 rounded">
                    {art.category}
                  </span>
                  <span>{art.difficulty || "Intermedio"} · {art.readTime}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors mb-3.5 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed mb-5">
                  {art.excerpt}
                </p>
              </div>

              <div>
                {/* Meta content tags */}
                <div className="flex flex-wrap gap-1 mb-5">
                  {art.tags.map((tg, idx) => (
                    <span key={idx} className="text-[9px] font-mono text-neutral-500">
                      #{tg}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono text-neutral-400">
                  <span>Por <strong>{art.author}</strong></span>
                  <span>{art.views.toLocaleString()} vistas</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. STACK GRATUITO PARA EMPRENDER */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/5" id="stack-gratis">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-sm font-bold text-cyan-400 font-mono uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4" /> RECOMENDADO POR WENTIX CO
          </div>
          <h2 className="text-3xl font-bold font-display text-white tracking-tight">El Stack Gratuito Perfecto Para Emprender</h2>
          <p className="text-xs text-neutral-400 mt-2">
            No necesitas $500/mes de prepagos. Con estos servicios puedes estructurar, alojar, orquestar y escalar micro-SaaS y ecommerces prácticamente gratis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GRATIS_STACK.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl glass-panel border border-white/5 hover:border-cyan-400/20 transition-all duration-300 relative group"
            >
              {item.badge && (
                <span className="absolute top-4 right-4 text-[9px] font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-900/50 uppercase tracking-widest">
                  {item.badge}
                </span>
              )}

              <h3 className="text-sm font-bold font-display text-white tracking-wide mb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                {item.name}
              </h3>
              <span className="text-[9px] font-mono text-neutral-450 uppercase tracking-wider block mb-3">
                {item.category}
              </span>

              <p className="text-xs text-neutral-350 font-sans leading-relaxed mb-4 min-h-[48px]">
                {item.description}
              </p>

              <div className="p-3 bg-black/50 rounded-lg text-[10px] border border-white/5 text-cyan-200">
                ⚡ <strong>Free Tier:</strong> {item.freeTierInfo}
              </div>

              {item.url && (
                <div className="mt-4 flex justify-end">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <span>Abrir Consola</span>
                    <ExternalLink className="w-3 h-3 text-purple-400" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. COMUNIDAD SOCIAL Y ESTADÍSTICAS */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto border-t border-white/5" id="comunidad">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 rounded-full text-[10px] tracking-wide font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>SÉ PARTE DEL CAMBIO</span>
            </div>
            <h2 className="text-3xl font-display font-bold text-white leading-tight">
              Una comunidad que construye proyectos reales
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No estamos aquí para debatir noticias teóricas de IA. En Wentix nos enfocamos en **crear**, lanzar y automatizar. Comparte tus prompts, obtén métricas, halla socios co-fundadores y presume tus micro-SaaS a nuestra creciente comunidad de miembros hispanos activos.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-950 rounded-xl border border-white/5">
                <span className="block text-xl font-bold tracking-tight text-white font-display">{(1358 + leadStats.leadsCount).toLocaleString()}+</span>
                <span className="text-[9px] text-neutral-550 uppercase tracking-widest font-mono">Emprendedores</span>
              </div>
              <div className="p-4 bg-neutral-950 rounded-xl border border-white/5">
                <span className="block text-xl font-bold tracking-tight text-purple-450 font-display">124</span>
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono">Proyectos Lanzados</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-white/5">
            <div className="text-xs font-bold text-neutral-300 mb-4 font-mono uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Conversaciones en la nave Wentix
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-neutral-450">
                  <span>@Carlos_Web_Creator</span>
                  <span>Hace 4 min</span>
                </div>
                <p className="text-neutral-200">
                  "Logré conectar el webhook de **Bolt.new** con **n8n** y guardo los leads directo en Supabase. ¡Me ahorro $150 dólares al mes de automatizadores caros!"
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-neutral-450">
                  <span>@Elena_Shop_SaaS</span>
                  <span>Hace 42 min</span>
                </div>
                <p className="text-neutral-200">
                  "El prompt estético de Midjourney para retratos cinematográficos que subieron es una obra maestra de consistencia. Mis CTRs de anuncios subieron un 4%"
                </p>
              </div>

              {/* Discord Telegram Buttons */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <a 
                  href="https://discord.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-[#5865F2] hover:bg-[#5865F2]/90 rounded-xl font-mono text-white text-[11px] font-bold text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>ENTRAR AL DISCORD</span>
                </a>
                <a 
                  href="https://telegram.org" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-3 bg-[#0088cc] hover:bg-[#0088cc]/90 rounded-xl font-mono text-white text-[11px] font-bold text-center transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>CANAL TELEGRAM</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
        </>
      )}

      {/* 8. CTA FINAL CON ORBI COMPANION */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto text-center relative overflow-hidden" id="cta-final">
        
        {/* Cinematic Backdrop visual glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Big visual mascot icon represented floating */}
        <div className="w-20 h-20 bg-linear-to-tr from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(0,240,255,0.4)] relative animate-float">
          <Bot className="w-10 h-10 text-black" />
          {/* Neon crown overlay */}
          <div className="absolute -top-1 -right-1 bg-white text-[9px] text-black font-extrabold px-1.5 py-0.5 rounded-full font-mono shadow-md animate-pulse">
            ORBI AI
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display mb-4">
          Construye el futuro con inteligencia artificial.
        </h2>
        <p className="max-w-xl text-xs sm:text-sm text-neutral-400 mx-auto mb-8 font-sans leading-relaxed">
          Accede al repositorio curado, automatiza procesos monótonos y conversa con ORBI en vivo para descubrir tu próximo modelo de negocio digital lucrativo.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => {
              const trigger = document.getElementById("orbi-mascot-trigger");
              trigger?.click();
              showToast("¡ORBI dice hola desde su núcleo espacial!");
            }}
            className="w-full sm:w-auto px-7 py-3 bg-linear-to-r from-cyan-400 to-purple-500 hover:brightness-110 text-black font-bold text-xs tracking-wider rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
          >
            Chatear con ORBI Mascot 🤖
          </button>
          
          <button
            onClick={() => {
              setSelectedCategory("Todos");
              setActiveTab("tools");
              document.getElementById("directorio-directo")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-7 py-3 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-white font-medium text-xs tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Explorar Catálogo Curado
          </button>
        </div>
      </section>

      {/* 9. FOOTER MINIMALISTA PREMIUM */}
      <footer className="border-t border-white/5 bg-neutral-950/80 py-12 px-4 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="flex flex-col gap-3">
            <WentixLogo size="sm" />
            <p className="text-[11px] leading-relaxed text-neutral-400 max-w-xs">
              Ecosistema futurista premium en español enfocado en creadores de contenido, automatización de negocios y Micro-SaaS lucrativos.
            </p>
          </div>

          <div>
            <span className="block font-bold text-white mb-3 tracking-wider font-display text-[10px] uppercase">Recursos</span>
            <ul className="space-y-2">
              <li><button onClick={() => { setActiveTab("tools"); setSelectedCategory("Todos"); }} className="hover:text-cyan-400 font-mono transition-colors cursor-pointer text-[11px]">Directorio Herramientas</button></li>
              <li><button onClick={() => { setActiveTab("repos"); setSelectedCategory("Todos"); }} className="hover:text-cyan-400 font-mono transition-colors cursor-pointer text-[11px]">Repositores GitHub</button></li>
              <li><button onClick={() => { setActiveTab("prompts"); setSelectedCategory("Todos"); }} className="hover:text-cyan-400 font-mono transition-colors cursor-pointer text-[11px]">Biblioteca Prompts</button></li>
            </ul>
          </div>

          <div>
            <span className="block font-bold text-white mb-3 tracking-wider font-display text-[10px] uppercase">Comunidad</span>
            <ul className="space-y-2">
              <li><a href="#comunidad" className="hover:text-cyan-400 transition-colors text-[11px]">Canal de Telegram</a></li>
              <li><a href="#comunidad" className="hover:text-cyan-400 transition-colors text-[11px]">Servidor Discord</a></li>
              <li><a href="#blog-recursos" className="hover:text-cyan-400 transition-colors text-[11px]">Blog & Casos de Éxito</a></li>
            </ul>
          </div>

          <div>
            <span className="block font-bold text-white mb-3 tracking-wider font-display text-[10px] uppercase">Herramientas</span>
            <ul className="space-y-2">
              <li><a href="#stack-gratis" className="hover:text-cyan-400 transition-colors text-[11px]">Stack de Emprendimiento Wentix</a></li>
              <li><span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono">WENTIX WEB APP & APK READY</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-neutral-500">
          <div>
            <span>© 2026 Wentix AI. Desarrollado con tecnología de procesamiento de última generación.</span>
          </div>
        </div>
      </footer>

      {/* STELLAR SLIDING SIMULATED OS PUSH NOTIFICATION OVERLAY */}
      {simulatedAlert && (
        <div 
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#08080c]/95 backdrop-blur-lg border border-cyan-500/30 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,180,255,0.2)] text-white relative overflow-hidden transition-all duration-300" 
          style={{ 
            animation: "wentix-push-slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards"
          }}
          id="internal-pushed-popup"
        >
          {/* Custom micro CSS keyframes injection specifically for this notification module */}
          <style>{`
            @keyframes wentix-push-slide-in {
              from { transform: translateY(50px) scale(0.9); opacity: 0; }
              to { transform: translateY(0) scale(1); opacity: 1; }
            }
          `}</style>

          {/* Glowing colorful top accent bar */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />
          
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="relative rounded bg-cyan-500 text-black flex items-center justify-center text-[10px] font-extrabold font-mono px-1.5 py-0.5">W</div>
              <div>
                <span className="text-[10px] font-bold uppercase font-mono text-cyan-400 tracking-wider">Wentix AI</span>
                <span className="text-[8px] text-neutral-500 ml-1.5 font-mono">• Alerta Push</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-neutral-500">{simulatedAlert.timestamp}</span>
              <button 
                onClick={() => setSimulatedAlert(null)}
                className="text-neutral-500 hover:text-neutral-200 transition-colors cursor-pointer text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[8px] font-extrabold font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 border border-white/5 text-purple-400 tracking-wider">
                {simulatedAlert.category || "Ecosistema"}
              </span>
              <h4 className="text-xs font-bold text-neutral-100 tracking-wide font-sans">{simulatedAlert.title}</h4>
            </div>
            <p className="text-[11px] text-neutral-350 leading-relaxed font-sans">{simulatedAlert.body}</p>
          </div>
          
          <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[9px] font-semibold text-cyan-450">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Notificación activa
            </span>
            <span className="text-neutral-500 font-mono text-4xs uppercase">Cierre Automático</span>
          </div>
        </div>
      )}

      {/* 11. LUXURY FLOATING DETAILS MODAL (VENTANA DE DETALLE APARTE) */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
          <div 
            className="relative w-full max-w-2xl bg-[#09090c] border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,240,255,0.15)] flex flex-col max-h-[90vh] transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "wentix-popup-slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            {/* Embedded Keyframes for popup slide-up for native performance */}
            <style>{`
              @keyframes wentix-popup-slide-up {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>

            {/* Top gradient decorative header bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${
              selectedDetailItem.type === "tool" ? "from-cyan-400 to-blue-500" :
              selectedDetailItem.type === "repo" ? "from-purple-500 to-indigo-600" :
              "from-emerald-400 to-teal-500"
            }`} />

            {/* Header section with brand info */}
            <div className="p-6 pb-4 border-b border-white/5 flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  selectedDetailItem.type === "tool" ? "bg-cyan-950/60 text-cyan-400 border border-cyan-800/30" :
                  selectedDetailItem.type === "repo" ? "bg-purple-950/60 text-purple-400 border border-purple-800/30" :
                  "bg-emerald-950/60 text-emerald-400 border border-emerald-800/30"
                }`}>
                  {selectedDetailItem.type === "tool" ? `Herramienta • ${selectedDetailItem.item.category}` :
                   selectedDetailItem.type === "repo" ? `Código Abierto • ${selectedDetailItem.item.category}` :
                   `Prompt Inteligente • ${selectedDetailItem.item.category}`}
                </span>
                
                <h3 className="text-xl font-bold font-display text-white mt-2 tracking-tight flex items-center gap-2">
                  {selectedDetailItem.type === "repo" ? (
                    <span>{selectedDetailItem.item.owner}/<strong className="text-purple-400">{selectedDetailItem.item.name}</strong></span>
                  ) : (
                    selectedDetailItem.item.name || selectedDetailItem.item.title
                  )}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetailItem(null)}
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable description & details body */}
            <div className="p-6 overflow-y-auto space-y-6 no-scrollbar flex-1 text-sm text-neutral-300">
              {/* Summary field */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Ficha Técnica Detallada</h4>
                <p className="leading-relaxed text-neutral-200 text-sm">
                  {selectedDetailItem.item.description}
                </p>
              </div>

              {/* Tools metadata overview */}
              {selectedDetailItem.type === "tool" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Métricas de Experiencia</span>
                    <strong className="text-neutral-100 flex items-center gap-1 mt-1 text-xs sm:text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {selectedDetailItem.item.score} / 5.0
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Esquema de Precios</span>
                    <strong className="text-neutral-100 mt-1 block text-xs sm:text-sm">{selectedDetailItem.item.pricing || "Freemium"}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-[10px] font-mono text-neutral-500">Verificado en base de datos</span>
                    <strong className="text-cyan-400 mt-1 block text-xs font-mono">Wentix AI Verified ✓</strong>
                  </div>
                </div>
              )}

              {/* Repo metadata overview */}
              {selectedDetailItem.type === "repo" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Popularidad GitHub</span>
                    <strong className="text-neutral-100 flex items-center gap-1 mt-1 text-xs sm:text-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {selectedDetailItem.item.stars?.toLocaleString() || "N/A"} estrellas
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Lenguaje del Código</span>
                    <strong className="text-neutral-100 mt-1 block text-xs sm:text-sm">{selectedDetailItem.item.language}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Forks del Proyecto</span>
                    <strong className="text-neutral-100 mt-1 block text-xs sm:text-sm">{selectedDetailItem.item.forks?.toLocaleString() || "N/A"}</strong>
                  </div>
                </div>
              )}

              {/* REPO-SPECIFIC EXTENDED GUIDES (E.G. OPENWA FULL GUIDE) */}
              {selectedDetailItem.type === "repo" && selectedDetailItem.item.id === "github-openwa" && (
                <div className="space-y-8 border-t border-white/5 pt-6 text-left text-neutral-200">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/20 border border-purple-800/30 text-purple-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                      <span>Guía de Integración Local y VPS • Para Principiantes</span>
                    </div>
                    <h3 className="text-lg font-black text-white font-mono uppercase tracking-tight">
                      OpenWA: MANUAL DE INSTALACIÓN Y CONSUMO API
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl font-sans">
                      OpenWA es una API de WhatsApp <strong className="text-white">gratuita, open source y auto-hospedada</strong>. La instalas en tu propio servidor (VPS o local), le mandas mensajes por API REST y todo se queda bajo tu control, sin depender de intermediarios de pago ni incurrir en suscripciones mensuales.
                    </p>
                  </div>

                  {/* SECTION 1: QUE ES */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                        <strong className="text-purple-500 font-sans">01</strong> • Qué es OpenWA
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      Si alguna vez has intentado conectar WhatsApp a tu negocio —para calificar leads, enviar recordatorios o integrar soporte inteligente— seguro te topaste con la barrera de las tarifas abusivas. <strong className="text-white">OpenWA resuelve esto de raíz</strong>. Consiste en un sistema auto-hospedado que actúa como intermediario local y te provee endpoints RESTful limpios, webhooks para recibir mensajes en tiempo real y una interfaz gráfica (dashboard) de control.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-1">
                        <span className="text-xs font-bold text-purple-400 font-sans uppercase">Soberanía de Datos</span>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0 font-sans">
                          Tus conversaciones, contactos e imágenes jamás cruzan por servidores externos ajenos. Al correr en tu propia infraestructura, garantizas la privacidad total de tus clientes.
                        </p>
                      </div>

                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-1">
                        <span className="text-xs font-bold text-purple-400 font-sans uppercase">Cero Costos Ocultos</span>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0 font-sans">
                          A diferencia de la API de Cloud oficial de Meta, con OpenWA puedes enviar millones de mensajes mensuales sin pagar un solo centavo más que el costo básico de tu VPS.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: QUE INCLUYE Y STACK */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                        <strong className="text-purple-500 font-sans">02</strong> • Características y Arquitectura
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl space-y-1.5">
                        <div className="font-bold text-[10px] text-white uppercase tracking-wider font-mono">⚡ El Núcleo</div>
                        <ul className="text-[10px] text-neutral-400 space-y-0.5 font-sans list-disc list-inside">
                          <li>API REST unificada</li>
                          <li>Multi-sesión activa</li>
                          <li>Swagger Docs</li>
                          <li>Web Dashboard</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl space-y-1.5">
                        <div className="font-bold text-[10px] text-white uppercase tracking-wider font-mono">💬 Canales</div>
                        <ul className="text-[10px] text-neutral-400 space-y-0.5 font-sans list-disc list-inside">
                          <li>Mensajería de Texto</li>
                          <li>Fotos, Audio y PDF</li>
                          <li>Manejo de Reacciones</li>
                          <li>Confirmaciones</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl space-y-1.5">
                        <div className="font-bold text-[10px] text-white uppercase tracking-wider font-mono">🛠️ Avanzado</div>
                        <ul className="text-[10px] text-neutral-400 space-y-0.5 font-sans list-disc list-inside">
                          <li>Gestión de Grupos</li>
                          <li>Canales de Difusión</li>
                          <li>Soporte de Proxies</li>
                          <li>Límites de Envío</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl space-y-1.5">
                        <div className="font-bold text-[10px] text-white uppercase tracking-wider font-mono">📦 Infraestructura</div>
                        <ul className="text-[10px] text-neutral-400 space-y-0.5 font-sans list-disc list-inside">
                          <li>SQL / Postgres</li>
                          <li>Caché interno Redis</li>
                          <li>Almacenamiento S3</li>
                          <li>Health status check</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2">
                      <h4 className="text-[10px] font-bold text-white uppercase tracking-wider font-mono m-0">Stack Tecnológico Principal:</h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {["Node.js v20", "NestJS v11", "TypeScript 5", "Docker & Compose", "PostgreSQL", "Redis", "MinIO / AWS S3"].map((tech, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-neutral-900 border border-white/10 rounded text-[9px] font-mono text-neutral-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: COMPARATIVA */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                        <strong className="text-purple-500 font-sans">03</strong> • Comparativa Comercial
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-white/5 rounded-2xl">
                      <table className="w-full text-left border-collapse font-sans text-xs">
                        <thead>
                          <tr className="bg-neutral-950 border-b border-white/10">
                            <th className="p-3 text-white font-mono uppercase text-[9px] tracking-wider text-left">Función</th>
                            <th className="p-3 text-purple-400 font-mono uppercase text-[9px] tracking-wider text-center bg-purple-500/5">OpenWA</th>
                            <th className="p-3 text-neutral-400 font-mono uppercase text-[9px] tracking-wider text-center">API Cloud Meta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-300 bg-neutral-900/10 text-[11px]">
                          <tr>
                            <td className="p-3 font-semibold text-white">Precio Inicial</td>
                            <td className="p-3 text-center text-purple-400 font-mono font-bold bg-purple-500/5">Gratis total</td>
                            <td className="p-3 text-center">Pago por mensaje</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">Código Abierto</td>
                            <td className="p-3 text-center text-purple-400 font-semibold bg-purple-500/5">✓ Sí (MIT)</td>
                            <td className="p-3 text-center text-neutral-500">✗ No</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">Soberanía Máxima</td>
                            <td className="p-3 text-center text-purple-400 bg-purple-500/5">✓ Local o VPS</td>
                            <td className="p-3 text-center text-neutral-500">✗ En nube de Meta</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-semibold text-white">Multi-sesión</td>
                            <td className="p-3 text-center text-purple-400 bg-purple-500/5">✓ Sin límite</td>
                            <td className="p-3 text-center">✓ Soportado</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SECTION 4: INSTALACION Y USO */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                        <strong className="text-purple-500 font-sans">04</strong> • Guía de Despliegue y Pruebas
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      La forma más aconsejada, limpia e inmediata de arrancar el servidor en producción o local es utilizando <strong className="text-white">Docker Compose</strong>. Esto levantará automáticamente el backend, la base de datos y la interfaz web.
                    </p>

                    <div className="space-y-4">
                      {/* INSTALACION DOCKER */}
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                        <div className="flex items-center justify-between font-sans">
                          <h4 className="text-xs font-bold text-white uppercase font-mono leading-tight m-0">Instalar con Docker Compose:</h4>
                          <button 
                            onClick={() => copyText("git clone https://github.com/rmyndharis/OpenWA.git\ncd OpenWA\ndocker compose up -d", "Comando Docker")} 
                            className="px-2 py-0.5 bg-neutral-850 text-[9px] text-white rounded font-mono hover:bg-neutral-705 transition cursor-pointer"
                          >
                            Copiar Código
                          </button>
                        </div>
                        <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-5s leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">
{`# 1. Clona el repositorio oficial (fork activo)
git clone https://github.com/rmyndharis/OpenWA.git

# 2. Entra al directorio
cd OpenWA

# 3. Levanta los contenedores en modo detached
docker compose up -d`}
                        </pre>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-neutral-955/70 border border-white/5 rounded-xl text-left space-y-1">
                          <span className="font-mono text-[11px] text-purple-400">http://localhost:2886</span>
                          <p className="text-[10px] text-neutral-400 leading-normal m-0 font-sans">
                            <strong>Dashboard Web:</strong> Escanea el QR para habilitar tu celular en el bot.
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-955/70 border border-white/5 rounded-xl text-left space-y-1">
                          <span className="font-mono text-[11px] text-purple-400">http://localhost:2785/api</span>
                          <p className="text-[10px] text-neutral-400 leading-normal m-0 font-sans">
                            <strong>Endpoints REST:</strong> La base limpia para que tus scripts y webhooks se comuniquen.
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-955/70 border border-white/5 rounded-xl text-left space-y-1">
                          <span className="font-mono text-[11px] text-purple-400">/api/docs</span>
                          <p className="text-[10px] text-neutral-400 leading-normal m-0 font-sans">
                            <strong>Swagger Docs:</strong> Testea cada webhook y endpoint directamente.
                          </p>
                        </div>
                      </div>

                      {/* ENVIAR PRIMER MENSAJE */}
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                        <div className="flex items-center justify-between font-sans">
                          <h4 className="text-xs font-bold text-white uppercase font-mono leading-tight m-0">Enviar un Mensaje de Prueba (cURL):</h4>
                          <button 
                            onClick={() => copyText(`curl -X POST http://localhost:2785/api/sessions/mi-bot/messages/send-text \\\n  -H "Content-Type: application/json" \\\n  -H "X-API-Key: TU_API_KEY" \\\n  -d '{\n    "chatId": "5215512345678@c.us",\n    "text": "Hola desde OpenWA 🚀"\n  }'`, "cURL")} 
                            className="px-2 py-0.5 bg-neutral-800 text-[9px] text-white rounded font-mono hover:bg-neutral-700 transition cursor-pointer"
                          >
                            Copiar cURL
                          </button>
                        </div>
                        <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-5s leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">
{`curl -X POST http://localhost:2785/api/sessions/mi-bot/messages/send-text \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: TU_API_KEY" \\
  -d '{
    "chatId": "5215512345678@c.us",
    "text": "Hola desde OpenWA 🚀"
  }'`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="space-y-4 border-t border-white/5 pt-6">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      Preguntas Frecuentes • FAQs
                    </span>

                    <div className="space-y-3 text-left">
                      <div className="p-3.5 bg-neutral-950 rounded-xl space-y-1 border border-white/5">
                        <span className="text-[11px] font-bold text-purple-400 font-mono block">¿Es seguro para mis números de negocio?</span>
                        <p className="text-[10.5px] text-neutral-400 leading-relaxed m-0 font-sans">
                          Aconsejamos respetar tiempos para prevenir bloqueos y habilitar políticas de límite integradas en OpenWA.
                        </p>
                      </div>

                      <div className="p-3.5 bg-neutral-950 rounded-xl space-y-1 border border-white/5">
                        <span className="text-[11px] font-bold text-purple-400 font-mono block">¿Cómo lo conecto con Claude o agentes?</span>
                        <p className="text-[10.5px] text-neutral-400 leading-relaxed m-0 font-sans">
                          Al proveer OpenAPI standard en /api/docs, puedes copiar la especificación y dárselas a Claude Code u otros agentes para generar herramientas MCP en segundos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RESOURCES AND LINKS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                    <a href="https://github.com/rmyndharis/OpenWA" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-purple-500/35 rounded-xl text-left block transition-all group">
                      <strong className="text-[11px] font-bold text-white group-hover:text-purple-400 transition-colors uppercase font-mono block mb-1">Repositorio Original</strong>
                      <p className="text-[10px] text-neutral-400 leading-relaxed m-0 font-sans">
                        Código fuente, commits y control directo del core del software.
                      </p>
                    </a>

                    <a href="https://github.com/rmyndharis/OpenWA/blob/main/docs/README.md" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-purple-500/35 rounded-xl text-left block transition-all group">
                      <strong className="text-[11px] font-bold text-white group-hover:text-purple-400 transition-colors uppercase font-mono block mb-1">Guías de Configuración</strong>
                      <p className="text-[10px] text-neutral-400 leading-relaxed m-0 font-sans">
                        Detalle paso a paso sobre S3 remoto, Postgres y variables avanzadas.
                      </p>
                    </a>

                    <a href="https://www.open-wa.org/" target="_blank" rel="noopener noreferrer" className="p-3 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-purple-500/35 rounded-xl text-left block transition-all group">
                      <strong className="text-[11px] font-bold text-white group-hover:text-purple-400 transition-colors uppercase font-mono block mb-1">Sitio Web Oficial</strong>
                      <p className="text-[10px] text-neutral-400 leading-relaxed m-0 font-sans">
                        Noticias, comunidad de desarrollo y demo interactiva para probar.
                      </p>
                    </a>
                  </div>
                </div>
              )}

              {/* STACK IA + AUTOMATIZACION INTERACTIVE GUIDE FOR GITHUB REPO DETAIL VIEW */}
              {selectedDetailItem.type === "repo" && selectedDetailItem.item.id === "github-stack-ia" && (
                <div className="space-y-8 border-t border-white/5 pt-6 text-left text-neutral-200">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                      <span>Sustitución SaaS de Alto Rendimiento • Nivel Avanzado</span>
                    </div>
                    <h3 className="text-lg font-black text-white font-mono uppercase tracking-tight">
                      Wentix Stack: IA Local + Automatización Visual + Sprints
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed max-w-3xl font-sans">
                      Hospeda Ollama, n8n y Plane en un solo Docker Compose. Reemplaza ChatGPT Plus, Zapier y Jira/Linear para ahorrar miles de dólares al año operando de forma 100% privada y soberana.
                    </p>
                  </div>

                  {/* TAB SELECTOR FOR STACK GUIDES */}
                  <div className="flex border-b border-white/5 gap-1 pt-2 overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => { setActiveStackTab("overview"); showToast("💡 Las 3 Piezas del Stack"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer shrink-0 ${activeStackTab === "overview" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      💡 Las 3 Piezas
                    </button>
                    <button
                      onClick={() => { setActiveStackTab("compose"); showToast("🐳 Docker Compose Configurator"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer shrink-0 ${activeStackTab === "compose" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      🐳 Docker Compose
                    </button>
                    <button
                      onClick={() => { setActiveStackTab("calculator"); showToast("📊 Calculadora de Ahorro SaaS"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer shrink-0 ${activeStackTab === "calculator" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      📊 Calculadora de Ahorro
                    </button>
                    <button
                      onClick={() => { setActiveStackTab("guide"); showToast("🚀 Guía de Venta e Implementación"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer shrink-0 ${activeStackTab === "guide" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      🚀 Venta / Implementación
                    </button>
                  </div>

                  {/* TAB 1: OVERVIEW */}
                  {activeStackTab === "overview" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* OLLAMA CARD */}
                        <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl space-y-3">
                          <span className="px-2 py-0.5 bg-cyan-950/40 text-cyan-400 border border-cyan-800/20 rounded text-[9px] font-mono uppercase font-black block w-fit">
                            Reemplaza: ChatGPT Plus / APIs
                          </span>
                          <h4 className="text-sm font-black text-white uppercase font-mono mt-1">Ollama</h4>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mb-0">
                            Ejecuta LLMs de forma local para chats, procesamiento de datos, clasificación y código sin llamadas de pago externas.
                          </p>
                          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px] font-sans">
                            <span className="text-neutral-500 font-mono block">Uso principal:</span>
                            <span className="text-neutral-300">Resúmenes, bots automáticos lógicos con token coste $0.</span>
                          </div>
                        </div>

                        {/* N8N CARD */}
                        <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl space-y-3">
                          <span className="px-2 py-0.5 bg-yellow-950/40 text-amber-400 border border-yellow-800/20 rounded text-[9px] font-mono uppercase font-black block w-fit">
                            Reemplaza: Zapier / Make
                          </span>
                          <h4 className="text-sm font-black text-white uppercase font-mono mt-1">n8n</h4>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mb-0">
                            Flujos de trabajo visuales con nodos AI nativos para sincronizar CRMs, webhooks, planillas y asistentes autónomos.
                          </p>
                          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px] font-sans">
                            <span className="text-neutral-500 font-mono block">Uso principal:</span>
                            <span className="text-neutral-300">Disparadores automáticos, webhooks y automatización pura de tareas.</span>
                          </div>
                        </div>

                        {/* PLANE CARD */}
                        <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl space-y-3">
                          <span className="px-2 py-0.5 bg-purple-950/40 text-purple-400 border border-purple-800/20 rounded text-[9px] font-mono uppercase font-black block w-fit">
                            Reemplaza: Jira / Linear
                          </span>
                          <h4 className="text-sm font-black text-white uppercase font-mono mt-1">Plane</h4>
                          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mb-0">
                            Gestión ágil de proyectos con tableros Kanban, ciclos de sprints, bugs, roadmaps y control del backlog sin licencias por usuario.
                          </p>
                          <div className="space-y-1.5 pt-2 border-t border-white/5 text-[10px] font-sans">
                            <span className="text-neutral-500 font-mono block">Uso principal:</span>
                            <span className="text-neutral-300">Estructuración de épicas, organización de tickets y tareas de tu equipo.</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl space-y-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">La Ventaja Estratégica del Auto-Hospedaje</span>
                        <p className="text-xs text-neutral-300 leading-relaxed font-sans m-0">
                          La mayoría de las empresas gasta sumas absurdas en cargos por usuario adicional (asientos). Al consolidar este stack open-source sobre Docker Compose en tu propio VPS de alto rendimiento, logras escalabilidad ilimitada, seguridad local inquebrantable y recuperas el control absoluto de tus datos de cliente.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DOCKER COMPOSE CONFIGURATOR */}
                  {activeStackTab === "compose" && (
                    <div className="space-y-5 animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Despliegue unificado</span>
                        <h4 className="text-sm font-bold text-white uppercase font-mono">Creador en Vivo de docker-compose.yml</h4>
                        <p className="text-xs text-neutral-400 font-sans">
                          Establece los parámetros de red y copia la receta YAML lista para levantar con un comando en consola.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl space-y-3.5">
                          <span className="text-xs font-mono text-amber-400 block font-bold uppercase">Parámetros del Servidor</span>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block">Dominio (ej. para webhooks de n8n)</label>
                            <input
                              type="text"
                              value={stackDomain}
                              onChange={(e) => setStackDomain(e.target.value)}
                              className="w-full bg-[#07070a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                              placeholder="servidor.com"
                            />
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-white/5">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase block">Aceleración Gráfica GPU en Ollama (Nvidia)</label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => { setStackOllamaGPU(!stackOllamaGPU); showToast(`GPU local ${!stackOllamaGPU ? "Activada" : "Desactivada"}`); }}
                                className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer border-0 ${stackOllamaGPU ? "bg-amber-400" : "bg-neutral-800"}`}
                              >
                                <div className={`bg-neutral-950 w-5 h-5 rounded-full shadow-md transform transition-transform ${stackOllamaGPU ? "translate-x-6" : "translate-x-0"}`} />
                              </button>
                              <span className="text-xs font-sans text-neutral-300">
                                {stackOllamaGPU ? "GPU Nvidia Activa" : "Solo CPU (VPS Básico)"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-neutral-950/40 border border-dashed border-white/5 rounded-2xl flex flex-col justify-center space-y-2.5">
                          <span className="text-xs font-mono text-cyan-400 block font-bold">Levanta la Infraestructura</span>
                          <ol className="text-[10px] font-sans text-neutral-400 space-y-1.5 pl-4 list-decimal leading-relaxed">
                            <li>Entra a tu servidor virtual: <code className="text-neutral-200">ssh admin@vps-ip</code></li>
                            <li>Crea el directorio local: <code className="text-neutral-200">mkdir -p ~/wentix-stack && cd ~/wentix-stack</code></li>
                            <li>Abre el editor: <code className="text-neutral-200">nano docker-compose.yml</code></li>
                            <li>Pega la receta y guarda el archivo (<code className="text-amber-400">Ctrl+O</code> y <code className="text-amber-400">Ctrl+X</code>).</li>
                            <li>Inicia el stack: <code className="text-amber-400 font-bold">docker compose up -d</code></li>
                          </ol>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex bg-[#07070a] px-4 py-2 rounded-t-2xl border-t border-x border-white/5 justify-between items-center font-mono">
                          <span className="text-neutral-400 uppercase text-[9px] font-bold">docker-compose.yml</span>
                          <button
                            onClick={() => {
                              const yaml = `version: '3.8'\n\nservices:\n  # Ollama - IA Local\n  ollama:\n    image: ollama/ollama:latest\n    container_name: ollama\n    ports:\n      - "11434:11434"\n    volumes:\n      - ollama_data:/root/.ollama\n    restart: unless-stopped${stackOllamaGPU ? `\n    deploy:\n      resources:\n        reservations:\n          devices:\n            - driver: nvidia\n              count: 1\n              capabilities: [gpu]` : ""}\n\n  # Base de Datos para n8n\n  postgres-n8n:\n    image: postgres:16-alpine\n    container_name: postgres-n8n\n    environment:\n      POSTGRES_USER: n8n_admin\n      POSTGRES_PASSWORD: password_super_seguro\n      POSTGRES_DB: n8n_db\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    restart: unless-stopped\n\n  # n8n - Motor de Automatización\n  n8n:\n    image: docker.n8n.io/n8nio/n8n:latest\n    container_name: n8n\n    ports:\n      - "5678:5678"\n    environment:\n      - DB_TYPE=postgresdb\n      - DB_POSTGRESDB_HOST=postgres-n8n\n      - DB_POSTGRESDB_DATABASE=n8n_db\n      - DB_POSTGRESDB_USER=n8n_admin\n      - DB_POSTGRESDB_PASSWORD=password_super_seguro\n      - N8N_HOST=n8n.${stackDomain}\n      - N8N_PORT=5678\n      - N8N_PROTOCOL=https\n      - WEBHOOK_URL=https://n8n.${stackDomain}/\n      - GENAI_OLLAMA_HOST=http://ollama:11434\n    volumes:\n      - n8n_data:/home/node/.n8n\n    restart: unless-stopped\n    depends_on:\n      - postgres-n8n\n      - ollama\n\n  # Plane Project Management Web Client\n  plane-web:\n    image: makeplane/plane-frontend:latest\n    container_name: plane-web\n    ports:\n      - "8000:8000"\n    environment:\n      - API_URL=http://plane-api:8000\n    restart: unless-stopped\n\nvolumes:\n  ollama_data:\n    name: ollama_data\n  postgres_data:\n    name: postgres_data\n  n8n_data:\n    name: n8n_data`;
                              navigator.clipboard.writeText(yaml);
                              setCopiedStackCompose(true);
                              showToast("📋 ¡Docker Compose copiado al portapapeles!");
                              setTimeout(() => setCopiedStackCompose(false), 2000);
                            }}
                            className="px-3 py-1 bg-amber-400 text-black hover:bg-amber-300 font-bold rounded-lg font-mono transition text-[10px] cursor-pointer border-0"
                          >
                            {copiedStackCompose ? "✓ Copiado" : "Copiar Recta YAML"}
                          </button>
                        </div>
                        <pre className="p-4 text-xs font-mono overflow-x-auto max-h-72 bg-[#030305] border border-white/5 rounded-b-2xl whitespace-pre text-neutral-300 m-0">
{`version: '3.8'

services:
  # Ollama - IA Local
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped`}
{stackOllamaGPU ? `
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]` : ""}
{`

  # Base de Datos para n8n
  postgres-n8n:
    image: postgres:16-alpine
    container_name: postgres-n8n
    environment:
      POSTGRES_USER: n8n_admin
      POSTGRES_PASSWORD: password_super_seguro
      POSTGRES_DB: n8n_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  # n8n - Motor de Automatización
  n8n:
    image: docker.n8n.io/n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres-n8n
      - DB_POSTGRESDB_DATABASE=n8n_db
      - DB_POSTGRESDB_USER=n8n_admin
      - DB_POSTGRESDB_PASSWORD=password_super_seguro
      - N8N_HOST=n8n.${stackDomain}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.${stackDomain}/
      - GENAI_OLLAMA_HOST=http://ollama:11434
    volumes:
      - n8n_data:/home/node/.n8n
    restart: unless-stopped
    depends_on:
      - postgres-n8n
      - ollama

  # Plane Web
  plane-web:
    image: makeplane/plane-frontend:latest
    container_name: plane-web
    ports:
      - "8000:8000"
    environment:
      - API_URL=http://plane-api:8000
    restart: unless-stopped

volumes:
  ollama_data:
    name: ollama_data
  postgres_data:
    name: postgres_data
  n8n_data:
    name: n8n_data`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SAVINGS CALCULATOR */}
                  {activeStackTab === "calculator" && (
                    <div className="space-y-6 animate-fade-in font-sans">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Análisis Financiero de T.I.</span>
                        <h4 className="text-sm font-bold text-white uppercase font-mono">Calculadora de Ahorro SaaS del Stack</h4>
                        <p className="text-xs text-neutral-400 font-sans">
                          Compara las licencias de usuario en ChatGPT Plus, Zapier/Make y Jira frente a operar tu propio hosting VPS unificado.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Inputs Zone */}
                        <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl space-y-5 text-left">
                          <span className="text-xs font-mono text-amber-400 block font-bold uppercase tracking-wider">Tus suscripciones de hoy</span>

                          {/* Seats parameter for Chat (ChatGPT/Opus) and Jira */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-neutral-300 uppercase">Licencias de Equipo (Usuarios)</span>
                              <span className="text-amber-400 font-bold">{calcSeats} usuarios</span>
                            </div>
                            <input
                              type="range"
                              min="1"
                              max="50"
                              step="1"
                              value={calcSeats}
                              onChange={(e) => setCalcSeats(Number(e.target.value))}
                              className="w-full accent-amber-400 bg-neutral-900 cursor-pointer h-1 rounded appearance-none"
                            />
                            <p className="text-[10px] text-neutral-500 leading-tight">
                              Número de miembros que pagan licencias concurrentes en Jira/Linear y ChatGPT Plus.
                            </p>
                          </div>

                          {/* Zapier tasks parameter */}
                          <div className="space-y-1.5 pt-3.5 border-t border-white/5">
                            <div className="flex justify-between items-center text-xs font-mono">
                              <span className="text-neutral-300 uppercase">Tareas Mensuales (Zapier)</span>
                              <span className="text-amber-400 font-bold">{calcZapierTasks.toLocaleString()} ejecuciones</span>
                            </div>
                            <input
                              type="range"
                              min="500"
                              max="100000"
                              step="500"
                              value={calcZapierTasks}
                              onChange={(e) => setCalcZapierTasks(Number(e.target.value))}
                              className="w-full accent-amber-400 bg-neutral-900 cursor-pointer h-1 rounded appearance-none"
                            />
                            <p className="text-[10px] text-neutral-500 leading-tight">
                              Volumen de tareas o llamadas lógicas procesadas en Zapier o Make al mes.
                            </p>
                          </div>
                        </div>

                        {/* Calculations & Results Zone */}
                        <div className="p-5 bg-neutral-950/80 border border-amber-500/10 rounded-2xl flex flex-col justify-between space-y-4">
                          {(() => {
                            const chatCost = calcSeats * 20; // $20/seat
                            const jiraCost = calcSeats * 10; // $10/seat
                            
                            let zapierEstimate = 29;
                            if (calcZapierTasks > 1000) zapierEstimate = 49;
                            if (calcZapierTasks > 5000) zapierEstimate = 129;
                            if (calcZapierTasks > 10000) zapierEstimate = 199;
                            if (calcZapierTasks > 25000) zapierEstimate = 299;
                            if (calcZapierTasks > 50000) zapierEstimate = 599;
                            if (calcZapierTasks > 75000) zapierEstimate = 899;
                            
                            const totalSaaSMonthly = chatCost + jiraCost + zapierEstimate;
                            const totalHostingMonthly = 15; // standard Docker Hosting price
                            const monthlySavings = totalSaaSMonthly - totalHostingMonthly;
                            const yearlySavings = monthlySavings * 12;

                            return (
                              <div className="space-y-3.5 text-left">
                                <span className="text-xs font-mono text-center block tracking-widest text-neutral-500 uppercase">Resultados del Ahorro</span>
                                
                                {/* Cost Breakdown */}
                                <div className="space-y-1.5 text-xs font-mono">
                                  <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-neutral-400">Planes Chat AI (${calcSeats} x $20)</span>
                                    <span className="text-white">${chatCost} /mes</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-neutral-400">Linear o Jira (${calcSeats} x $10)</span>
                                    <span className="text-white">${jiraCost} /mes</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-white/5">
                                    <span className="text-neutral-400">Zapier o Make</span>
                                    <span className="text-white">${zapierEstimate} /mes</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-white/5 text-red-400 font-bold">
                                    <span>Total Suscripciones SaaS</span>
                                    <span>${totalSaaSMonthly} /mes</span>
                                  </div>
                                  <div className="flex justify-between py-1 border-b border-white/5 text-amber-400 font-black">
                                    <span>Hospedaje de Wentix Stack (Host VPS)</span>
                                    <span>$15 /mes</span>
                                  </div>
                                </div>

                                {/* Metrics box */}
                                <div className="bg-neutral-900 border border-white/5 rounded-xl p-3.5 text-center space-y-1">
                                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block font-bold">Ahorro Neto Estimado</span>
                                  <div className="text-white font-mono font-black text-2xl">
                                    ${monthlySavings.toLocaleString()} <span className="text-[10px] text-neutral-400 font-normal">/mes</span>
                                  </div>
                                  <div className="text-emerald-400 font-mono text-xs font-bold">
                                    ${yearlySavings.toLocaleString()} USD al año de ahorro garantizado
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DEPLOYMENT MANUAL */}
                  {activeStackTab === "guide" && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Modelo de Negocio e Integración</span>
                        <h4 className="text-sm font-bold text-white uppercase font-mono">Guía de Comercialización e Implementación de Sistemas</h4>
                        <p className="text-xs text-neutral-400 font-sans">
                          Aprende a cobrar la configuración, despliegue y entrenamiento de este stack para agencias, startups y negocios locales.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-white font-mono uppercase block">El Paquete Comercial Básico</span>
                          <p className="text-[11px] text-neutral-400 leading-normal font-sans m-0">
                            <strong>"La Solución de Soberanía Digital":</strong> Instalas el Docker Compose completo en el VPS propio del cliente, asocias sus dominios con SSL/HTTPS seguros, realizas copias de seguridad de las bases de datos y les provees 1 hora de capacitación integral.
                          </p>
                          <div className="pt-2 border-t border-white/5 text-[10px] font-sans">
                            <span className="text-neutral-500 font-mono block">Tarifa sugerida:</span>
                            <span className="text-amber-400 font-bold">$300 - $800 USD pago de configuración inicial</span>
                          </div>
                        </div>

                        <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-white font-mono uppercase block">El Retenedor Mensual de Soporte</span>
                          <p className="text-[11px] text-neutral-400 leading-normal font-sans m-0">
                            <strong>"Mantenedor de Flujos y Mantenimiento":</strong> Ofreces auditorías periódicas, copias de seguridad remotas diarias y desarrollo asistido de nuevos flujos o webhooks integrados con Ollama y sus bases de datos en n8n.
                          </p>
                          <div className="pt-2 border-t border-white/5 text-[10px] font-sans">
                            <span className="text-neutral-500 font-mono block">Tarifa sugerida:</span>
                            <span className="text-amber-400 font-bold">$100 - $250 USD al mes por soporte activo</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl text-left">
                        <span className="px-2 py-0.5 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest block w-fit mb-2">Mensaje Comercial Clave</span>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          <em>"Te consolido un sistema operativo empresarial en tu propio servidor dedicado. No solo reducimos tus licencias fijas recurrentes de software hoy, sino que preparamos a tu negocio para flujos de automatización locales seguros con IA que escala con cero costos por token."</em>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* FAQ SYSTEM FOR STACK */}
                  <div className="space-y-4 pt-6 border-t border-white/5 text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Resolución de dudas</span>
                      <h4 className="text-sm font-bold text-white uppercase font-mono">Preguntas Frecuentes sobre el Stack</h4>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          q: "¿Cuáles son los requisitos de hardware recomendados para el VPS de este stack?",
                          a: "Con un VPS básico de 4 núcleos de CPU y 8 GB de RAM (como los de Hetzner, DigitalOcean o AWS) puedes hospedar n8n, postgres y Plane fluidamente, junto con modelos ligeros de Ollama como Llama-3-8B. Para modelos masivos (de más de 14B de parámetros) o procesos concurrentes muy extensos, se aconseja contar con aceleración Nvidia (vGPU o VM dedicada)."
                        },
                        {
                          q: "¿Es seguro procesar webhooks externos con n8n auto-hospedado?",
                          a: "Totalmente. Al configurar tu dominio con SSL seguro (mediante Traefik, Nginx o Cloudflare), todas las llamadas de red entrantes para webhooks lógicos se cifran de extremo a extremo. Puedes recibir datos externos de Stripe, Typeform o CRM nativos de forma 100% segura."
                        },
                        {
                          q: "¿Cómo se gestionan las actualizaciones del sistema de Plane y n8n?",
                          a: "Es tan simple como cambiar la tag de la versión de la imagen en tu docker-compose.yml y refrescar los contenedores corriendo: `docker compose pull && docker compose up -d`. Las bases de datos migrarán sus esquemas automáticamente al iniciar."
                        }
                      ].map((faq, idx) => {
                        const isFaqExpanded = expandedStackFaq === idx;
                        return (
                          <div key={idx} className="p-4 bg-neutral-950/60 hover:bg-neutral-950 border border-white/5 rounded-2xl transition">
                            <button
                              onClick={() => { setExpandedStackFaq(isFaqExpanded ? null : idx); showToast(`💬 Duda: ${faq.q}`); }}
                              className="w-full flex justify-between items-center text-left text-xs font-bold text-white uppercase font-mono cursor-pointer bg-transparent border-0 font-sans"
                            >
                              <span className="text-neutral-200">{faq.q}</span>
                              <ChevronDown className={`w-4 h-4 text-amber-400 shrink-0 transform transition-transform ${isFaqExpanded ? "rotate-180" : ""}`} />
                            </button>
                            {isFaqExpanded && (
                              <p className="text-xs text-neutral-400 leading-relaxed mt-3 font-sans pb-1 m-0">
                                {faq.a}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* AUXILIARY REVENUE RESOURCES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 border-t border-white/5 text-left">
                    <a href="https://github.com/n8n-io/n8n" target="_blank" rel="noopener noreferrer" className="p-4 bg-neutral-950 hover:bg-[#0f0f18] border border-white/5 hover:border-amber-500/35 rounded-2xl block transition-all group no-underline">
                      <strong className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase font-mono block mb-1">Repositorio de n8n</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                        Encuentra nodos comunitarios, plantillas oficiales de automatización y guías específicas para configurar integraciones.
                      </p>
                    </a>

                    <a href="https://github.com/makeplane/plane" target="_blank" rel="noopener noreferrer" className="p-4 bg-neutral-950 hover:bg-[#0f0f18] border border-white/5 hover:border-amber-500/35 rounded-2xl block transition-all group no-underline">
                      <strong className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors uppercase font-mono block mb-1">Repositorio de Plane</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                        La de todo el código de Plane para Docker, Kubernetes, migraciones avanzadas y despliegues self-hosted escalables.
                      </p>
                    </a>
                  </div>
                </div>
              )}

              {/* Prompts metadata overview */}
              {selectedDetailItem.type === "prompt" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-900/60 p-4 rounded-2xl border border-white/5">
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Modelo Optimizado</span>
                    <strong className="text-neutral-100 mt-1 block text-xs sm:text-sm">{selectedDetailItem.item.model}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Nivel de Dificultad</span>
                    <strong className="text-neutral-100 mt-1 block text-xs sm:text-sm">{selectedDetailItem.item.difficulty}</strong>
                  </div>
                  <div>
                    <span className="block text-[10px] font-mono text-neutral-500">Instrucciones Copiadas</span>
                    <strong className="text-emerald-400 mt-1 block text-xs sm:text-sm">🔥 {selectedDetailItem.item.popularCount} veces</strong>
                  </div>
                </div>
              )}

              {/* Copy prompt section directly if it's prompt type */}
              {selectedDetailItem.type === "prompt" && (
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono">Texto de Instrucción del Prompt</h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedDetailItem.item.promptText);
                        showToast("📋 ¡Prompt de alta fidelidad copiado al portapapeles!");
                      }}
                      className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black text-2xs font-mono font-bold cursor-pointer flex items-center gap-1 select-none transition-colors border border-emerald-400/20"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Prompt</span>
                    </button>
                  </div>
                  <div className="p-4 bg-black rounded-2xl border border-white/5 font-mono text-xs text-zinc-300 leading-relaxed max-h-56 overflow-y-auto no-scrollbar select-all whitespace-pre-wrap select-text">
                    {selectedDetailItem.item.promptText}
                  </div>
                  <p className="text-[11px] text-neutral-500 italic">
                    *Tip: Modifica las variables encerradas en corchetes antes de enviarlo a tu modelo.
                  </p>
                </div>
              )}

              {/* Quality analyses */}
              {selectedDetailItem.type !== "prompt" && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider font-mono">Análisis Estratégico de Curación (Wentix AI)</h4>
                  <ul className="space-y-2.5">
                    <li className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Optimización Semántica:</strong> Indexación refinada que filtra el exceso de publicidad y ruido corporativo para presentar el foco de automatización.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Seguridad de Destino:</strong> Acceso verificado y libre de enlaces patrocinados o re-ruteadores maliciosos. Conexión nativa de canal.</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-xs text-neutral-300 leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span><strong>Integración de Trabajo:</strong> Estructura compatible para integrarse de inmediato en pipelines locales, interfaces n8n o Workflows de Wentix.</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Tags panel inside modal */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Clasificación de Indexado</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailItem.item.tags?.map((tag: string, idx: number) => (
                    <span key={idx} className="text-[11px] font-mono text-cyan-400 bg-[#0c0c10] border border-cyan-500/10 px-2.5 py-1 rounded-xl">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="p-6 bg-neutral-900/60 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => {
                  toggleBookmark(selectedDetailItem.item.id);
                }}
                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 select-none border ${
                  bookmarks.includes(selectedDetailItem.item.id)
                    ? "bg-cyan-500/10 border-cyan-400 text-cyan-400"
                    : "bg-neutral-950 hover:bg-neutral-900 border-white/10 text-neutral-400 hover:text-white"
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>{bookmarks.includes(selectedDetailItem.item.id) ? "Guardado en Favoritos" : "Guardar en Favoritos"}</span>
              </button>

              <div className="w-full sm:w-auto flex items-center gap-2">
                {selectedDetailItem.item.url && (
                  <a
                    href={selectedDetailItem.item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/10 select-none"
                  >
                    <span>{selectedDetailItem.type === "repo" ? "Ver Repositorio" : "Visitar Plataforma Directa"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
