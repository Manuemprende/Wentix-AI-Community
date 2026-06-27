import React, { useState } from "react";
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Check, 
  Copy, 
  AlertTriangle, 
  BookOpen, 
  Flame, 
  RefreshCw, 
  Clock, 
  Zap, 
  Repeat, 
  HelpCircle, 
  ChevronDown, 
  ArrowRight, 
  Award,
  BookMarked,
  Layers,
  Wrench,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Bookmark,
  ChevronLeft,
  XCircle,
  FileCode,
  ShieldAlert,
  Play,
  MessageSquare
} from "lucide-react";
import { PromptItem } from "../types";
import { SKILLS_CATEGORIES, SKILLS_PACKS, PLAN_DAYS, SKILLS_FAQS } from "../skills_data";

interface AIZeroToProProps {
  onShowToast: (message: string) => void;
  prompts?: PromptItem[];
  bookmarks?: string[];
  onToggleBookmark?: (id: string) => void;
}

interface GuideMetadata {
  id: string;
  title: string;
  subtitle: string;
  lead: string;
  level: "principiante" | "intermedio" | "avanzado";
  duration: string;
  lessonNum: string;
  type: string;
  tags: string[];
}

export default function AIZeroToPro({ 
  onShowToast, 
  prompts = [], 
  bookmarks = [], 
  onToggleBookmark 
}: AIZeroToProProps) {
  const [activeLevel, setActiveLevel] = useState<"principiante" | "intermedio" | "avanzado" | "prompts">("principiante");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);
  const [activeSegment, setActiveSegment] = useState<string>("todos");

  // Prompt tab filters:
  const [promptSearch, setPromptSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("Todos");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Todos");

  // 40 Skills de Wentix state
  const [skillsSearch, setSkillsSearch] = useState("");
  const [activeSkillCategory, setActiveSkillCategory] = useState("todos");
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);
  const [activeInstallerTab, setActiveInstallerTab] = useState<"web" | "cli" | "git">("web");

  // Stack IA + Automatización state
  const [stackDomain, setStackDomain] = useState("wentix-stack.com");
  const [stackOllamaGPU, setStackOllamaGPU] = useState(false);
  const [activeStackTab, setActiveStackTab] = useState<"overview" | "compose" | "calculator" | "guide">("overview");
  const [calcSeats, setCalcSeats] = useState(5);
  const [calcZapierTasks, setCalcZapierTasks] = useState(5000);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [id]: true }));
    onShowToast("📋 ¡Prompt copiado al portapapeles con éxito!");
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const METADATA: GuideMetadata[] = [
    // Principiante
    {
      id: "que-automatizar",
      title: "¿Qué vale la pena automatizar?",
      subtitle: "Primero lo haces tú, luego lo dominas, después automatizas",
      lead: "No puedes automatizar algo que no sabes hacer. Aprende la regla de las 3 etapas, las 4 señales y descarga los 6 prompts maestros.",
      level: "principiante",
      duration: "8 min",
      lessonNum: "01",
      type: "Básico",
      tags: ["Clásico", "No-Code", "Estrategia"]
    },
    {
      id: "setup-claude",
      title: "Setup de Claude en 10 Minutos",
      subtitle: "Deja de usar Claude como si fuera Google",
      lead: "Configura tu proyecto de trabajo guiado por una auto-entrevista. Enseña a Claude tu tono con 5 ejemplos de voz y ponle reglas fijas de lo que NO debe hacer.",
      level: "principiante",
      duration: "10 min",
      lessonNum: "02",
      type: "Fácil",
      tags: ["Chat", "Productividad", "Voz"]
    },
    {
      id: "feedback-loop",
      title: "Optimización con Feedback Loop",
      subtitle: "Haz que tus prompts y skills se mejoren solos",
      lead: "Agrega una sección de auto-auditoría al final de tus prompts y skills para que Claude se evalúe solo, aprenda de sus errores en cada sesión y consolide su aprendizaje.",
      level: "principiante",
      duration: "12 min",
      lessonNum: "03",
      type: "Recomendado",
      tags: ["Prompting Pro", "Auditoría", "Skills"]
    },
    {
      id: "claude-tonto",
      title: "Por qué Claude se vuelve tonto a media conversación",
      subtitle: "Reduce el desgaste de tokens y el Context Rot",
      lead: "Domina la limpieza de memoria para evitar que tu asistente te ignore. Utiliza el truco del nombre como alarma y aplica /context, /compact y /clear.",
      level: "principiante",
      duration: "11 min",
      lessonNum: "04",
      type: "Técnico",
      tags: ["Tokens", "Memory", "Contexto"]
    },
    {
      id: "estructura-carpetas",
      title: "Estructura de folders y archivos para Claude",
      subtitle: "Crea tu segundo cerebro sin costosas bases de datos",
      lead: "El 95% de la gente no necesita una base vectorizada. Te conviene estructurar tus carpetas y utilizar CLAUDE.md permanentes por capas.",
      level: "principiante",
      duration: "9 min",
      lessonNum: "05",
      type: "Estructura",
      tags: ["CLAUDE.md", "/init", "Git"]
    },
    {
      id: "terminal-o-app",
      title: "Terminal o App: Diferencia real de Claude Code",
      subtitle: "Elige la puerta de entrada correcta",
      lead: "Lado a lado: el CLI vs el panel visual. Entiende cómo la terminal te da el control de tus tokens locales, tareas cron en segundo plano y automatización extrema.",
      level: "principiante",
      duration: "12 min",
      lessonNum: "06",
      type: "Senior",
      tags: ["CLI vs UI", "Claude Code", "Automatización"]
    },
    {
      id: "claude-fable-5",
      title: "Claude Fable 5: El primer modelo Mythos-class",
      subtitle: "Análisis y benchmarks del cerebro más potente",
      lead: "Descubre las salvaguardas de Fable 5, sus tasas de error, su rendimiento de grado agentic en bases de datos masivas y cómo usarlo en tu beneficio hoy.",
      level: "principiante",
      duration: "15 min",
      lessonNum: "07",
      type: "Frontera",
      tags: ["GPT-5 competitor", "Benchmarks", "API"]
    },
    {
      id: "codex-openai",
      title: "Codex de OpenAI: Guía completa 0 a 100",
      subtitle: "El agente de programación nativo de OpenAI",
      lead: "Instala y opera el CLI agente de OpenAI. Conéctate a gpt-5.5, maneja perfiles de seguridad, AGENTS.md local e intégralo a GitHub en la nube.",
      level: "principiante",
      duration: "14 min",
      lessonNum: "08",
      type: "Multi-modelo",
      tags: ["Codex CLI", "OpenAI", "AGENTS.md"]
    },
    {
      id: "plugins-claude",
      title: "Plugins de Claude Code: los 5 que le faltan a tu Claude",
      subtitle: "Superpoderes para tu consola en un solo comando",
      lead: "Si usas Claude Code sin plugins, lo estás usando a la mitad. Los plugins le suman superpoderes en un comando: que pruebe lo que construye, que diseñe bonito, que maneje el navegador, que no se rinda y que use documentación al día.",
      level: "principiante",
      duration: "11 min",
      lessonNum: "09",
      type: "Colección",
      tags: ["Claude Code", "Plugins", "Terminal"]
    },
    {
      id: "claude-opus-48",
      title: "Claude Opus 4.8: qué trae el modelo nuevo y cómo sacarle jugo sin quemar tu plan",
      subtitle: "Effort control, fast mode y dynamic workflows",
      lead: "Anthropic sacó Opus 4.8 el 28 de mayo. Es más honesto, aguanta tareas largas sin que lo estés correteando y trae tres controles nuevos: effort, fast mode y dynamic workflows.",
      level: "principiante",
      duration: "13 min",
      lessonNum: "10",
      type: "Modelo",
      tags: ["Claude Opus", "Effort", "Workflows"]
    },
    {
      id: "spotify-claude",
      title: "Spotify + Claude: tu DJ personal",
      subtitle: "Fórmula maestra para diseñar e inyectar playlists enteras",
      lead: "Claude se conecta a tu Spotify y te arma playlists enteras — pero solo si le das un buen prompt. Conéctalo y aprende a pedir como un DJ: con artistas, época y lo que NO quieres.",
      level: "principiante",
      duration: "9 min",
      lessonNum: "11",
      type: "Conector",
      tags: ["Spotify", "Music", "Playlists"]
    },
    {
      id: "cinco-preguntas",
      title: "Las 5 preguntas antes de meterle IA a tu negocio",
      subtitle: "Estrategias de auditoría operativa y tu primer plan en 3 fases",
      lead: "Toda la gente comprando la misma computadora carísima para 'meterse a la IA'. La verdad es que no necesitas la Mac Mini. Lo que de verdad necesitas es claridad sobre tu propio negocio.",
      level: "principiante",
      duration: "12 min",
      lessonNum: "12",
      type: "Estrategia",
      tags: ["Negocios", "Procesos", "Plan de IA"]
    },
    {
      id: "prompting-101-anthropic",
      title: "Prompting 101: los 10 pilares de Anthropic, traducidos al español",
      subtitle: "Estrategia para Opus 4.7 y el flujo iterativo del seguro sueco",
      lead: "Hannah y Christian, del equipo Applied AI de Anthropic, destilaron en una clase los 10 pilares que ellos mismos siguen para escribir prompts profesionales. Lo traemos con un caso real de seguro sueco.",
      level: "principiante",
      duration: "13 min",
      lessonNum: "13",
      type: "Prompting",
      tags: ["Anthropic", "Pilares", "Opus 4.7"]
    },
    {
      id: "tres-errores-ia",
      title: "No es la IA, sos vos: los 3 errores y la regla del contexto",
      subtitle: "Los 3 errores con cualquier modelo y las 5 dimensiones del contexto",
      lead: "Cambiás de modelo, pagás otro plan, probás otra herramienta — y la respuesta sigue siendo genérica. El problema viaja con vos. Cero contexto, IA tonta. Contexto completo, IA monstruo.",
      level: "principiante",
      duration: "10 min",
      lessonNum: "14",
      type: "Prompting",
      tags: ["Contexto", "Errores", "Pilares"]
    },
    {
      id: "claude-code-setup",
      title: "Claude Code Setup: el plugin que escanea tu proyecto y te dice qué le falta",
      subtitle: "Escanea tu proyecto y automatiza hooks, skills y MCPs",
      lead: "Claude Code Setup es un plugin oficial read-only de Anthropic que analiza tu codebase y te recomienda las mejores automatizaciones para potenciar tu espacio de trabajo.",
      level: "principiante",
      duration: "15 min",
      lessonNum: "15",
      type: "Claude Code",
      tags: ["Claude Code", "Plugins", "Anthropic"]
    },
    {
      id: "claude-chat-cowork-code",
      title: "Claude Chat, Cowork y Code: los 3 modos en una sola app",
      subtitle: "Usa Chat, Cowork y Code para pensar, delegar y construir",
      lead: "Descarga Claude una vez y obtén tres modos de funcionamiento distintos: Chat para pensar con Projects, Cowork agéntico para delegar y Claude Code para construir.",
      level: "principiante",
      duration: "20 min",
      lessonNum: "16",
      type: "Claude",
      tags: ["Claude Chat", "Cowork", "Claude Code"]
    },
    {
      id: "skills-wentix-40",
      title: "40 Skills de Wentix AI",
      subtitle: "Copia, pega y úsalas hoy mismo para automatizar tu semana",
      lead: "Una skill es un archivo SKILL.md que dejas en una carpeta. Claude lo lee y sabe hacer ese trabajo para siempre. 40 habilidades listas para copiar de escritura, research, código, comms, datos y productividad.",
      level: "principiante",
      duration: "25 min",
      lessonNum: "17",
      type: "Biblioteca",
      tags: ["Skills", "Claude Code", "Productividad"]
    }
  ];

  const PROMPTS_TEXTS = {
    partida: `Voy a ser honesto: quiero automatizar cosas con IA pero no tengo un negocio, proyecto o proceso andando. Tu trabajo NO es ayudarme a automatizar nada hoy. Tu trabajo es bajarme de esa nube y ayudarme a elegir qué empezar a hacer A MANO.

Hazme una pregunta a la vez:
- ¿Qué sé hacer o qué me interesa lo suficiente para trabajarlo varias semanas seguidas?
- ¿Qué quiero lograr: ingresos extra, un proyecto propio, aprender algo?
- ¿Cuánto tiempo real tengo a la semana?

Sé escéptico: si te doy respuestas vagas o demasiado ambiciosas, acótame. No me propongas «montar un negocio automatizado»: proponme UNA actividad concreta que pueda empezar esta semana, hacerla yo mismo y repetirla hasta dominarla.

Cierra con:
- La actividad concreta que me recomiendas (una sola).
- Cómo se ve hacerla a mano la primera semana, paso a paso.
- La señal que me va a avisar, en unas semanas, de que ya apareció algo que vale la pena automatizar.

Y recuérdame la regla cada vez que intente saltarme pasos: primero lo hago yo, luego lo domino, después lo automatizo.`,

    entrevista: `Quiero que me entrevistes para encontrar qué vale la pena automatizar en lo que hago. Reglas de la entrevista:

1) Hazme UNA pregunta a la vez y espera mi respuesta antes de la siguiente.
2) Pregúntame por mi semana REAL: qué hice ayer, qué hago todos los días, qué tarea repetí más veces este mes, cuál me comió más tiempo y cuál pospongo porque me da flojera.
3) Sé escéptico: si te digo algo vago como «quiero automatizar mi negocio», no me sigas la corriente. Pídeme ejemplos concretos de tareas que YO ya hago a mano.
4) Descarta sin pena lo que no califique: si una tarea la hago una vez al mes, casi no me quita tiempo o todavía no la domino, dímelo y sigue con la siguiente.
5) No me halagues ni me des la razón por default. Si después de preguntar concluyes que hoy NO tengo nada que valga la pena automatizar, dímelo tal cual y dime qué debería empezar a hacer a mano primero.

Después de 6 a 10 preguntas, cierra con:
- Mi lista de tareas candidatas (máximo 5), ordenadas de mejor a peor.
- Por cada una: cada cuánto la hago, cuánto tiempo me come y qué tanto la domino, según lo que te conté.
- Tu recomendación honesta de cuál pasar al filtro primero — o ninguna, si ninguna está lista.`,

    filtro: `Voy a describirte UNA tarea que hago y quiero tu veredicto honesto sobre si vale la pena automatizarla contigo.

La tarea: [describe aquí qué haces, con tus palabras]

Evalúala con estos cuatro criterios. Califica cada uno del 1 al 5 y explica por qué:

1) FRECUENCIA — ¿La hago lo suficiente? (diario o varias veces por semana = alta; una vez al mes = baja)
2) TIEMPO — ¿Me come horas reales? Suma cuánto me cuesta por semana.
3) DOMINIO — ¿La hago con los ojos cerrados? ¿Podría explicarle el paso a paso a alguien más sin pensarlo? Si dudo en algún paso, todavía no la domino.
4) RIESGO — ¿Qué pasa si la automatización se equivoca? ¿Lo ve un cliente, pierdo dinero, o solo pierdo cinco minutos?

Reglas para tu veredicto:
- Sé escéptico y directo. No me digas que sí para quedar bien.
- Si me falta dominio, tu veredicto es «TODAVÍA NO: hazla a mano unas semanas más y ve anotando los pasos».
- Si la frecuencia o el tiempo no lo justifican, dímelo: hay tareas que sale más barato seguir haciendo a mano.
- Si el riesgo es alto, sepárame qué parte SÍ se puede automatizar con revisión mía y cuál no se toca.

Termina con una sola línea:
AUTOMATIZA / TODAVÍA NO / NO VALE LA PENA — y la razón principal.`,

    extractor: `Ya decidí qué tarea quiero automatizar y la domino: la hago seguido y me la sé de memoria. Ayúdame a documentarla paso a paso, como si se la explicara a un empleado nuevo en su primer día.

La tarea: [escríbela en una frase]

Entrevístame para sacarme el proceso completo, una pregunta a la vez:
- ¿Con qué empiezo? ¿Qué necesito tener a la mano (archivos, correos, accesos, datos)?
- ¿Cuál es el paso a paso exacto, en orden? No me dejes saltarme pasos «obvios»: pregúntame por lo que hago en automático sin pensar.
- ¿Qué decisiones tomo a la mitad? ¿Cuándo hago A y cuándo hago B, y cómo lo decido?
- ¿Qué errores han salido y cómo los corrijo?
- ¿Cómo se ve el resultado cuando quedó BIEN hecho? Pídeme un ejemplo real.

Sé exigente: si en algún paso te respondo algo vago como «ahí lo reviso y ya», regresa y pregúntame qué reviso exactamente y qué estoy buscando.

Al final entrégame un documento listo para guardar:

# Proceso: [nombre de la tarea]
## Cuándo se hace y qué se necesita
## Paso a paso (numerado, con detalle suficiente para que alguien que nunca la ha hecho la haga igual que yo)
## Decisiones: si pasa X, haz Y
## Errores comunes y cómo corregirlos
## Cómo se ve un resultado bien hecho

Cierra diciéndome qué partes te quedaron flojas y qué deberíamos detallar más.`,

    plan1a1: `Aquí está el documento del proceso de una tarea que domino y quiero automatizar contigo:

[pega aquí el documento completo que armaste con el extractor]

Quiero la PRIMERA versión de esta automatización, mínima y honesta. Reglas:

1) Empieza con lo más chico que ya me ahorre tiempo: una sola parte del proceso, no todo de golpe.
2) Yo reviso TODO lo que produzcas antes de que cuente como terminado. Tú haces el borrador, yo doy el visto bueno. Nada sale al mundo sin que yo lo vea.
3) Dime exactamente cómo va a funcionar nuestro 1 a 1: qué te voy a dar yo cada vez (el correo, los datos, el archivo), qué me vas a devolver tú y en qué formato.
4) Sé honesto con los límites: qué pasos del documento NO puedes hacer tú solo todavía y se quedan conmigo.
5) No me propongas herramientas, integraciones ni nada técnico: la versión uno es «yo te pego el insumo, tú me devuelves el resultado como yo lo haría».

Entrégame:
- El plan de la versión 1 (qué automatizamos hoy y qué se queda manual).
- El mensaje exacto que te voy a pegar cada vez que necesite la tarea (mi «botón» de la automatización).
- Cómo vamos a comprobar que lo haces igual que yo: pídeme 1 o 2 ejemplos reales de cómo me queda a mí, para comparar.

Cuando la versión 1 salga bien 5 veces seguidas, ahí hablamos de automatizar el siguiente pedazo. No antes.`,

    espejo: `Acabo de correr la automatización que armamos y quiero compararla contra cómo lo hago yo a mano.

Mi versión (hecha por mí, a mano):
[pega aquí tu resultado manual]

Tu versión (la que produjo la automatización):
[pega aquí el resultado de Claude]

Compáralas sin piedad y sin defenderte:
1) ¿En qué se diferencian? Lista TODAS las diferencias, hasta las chicas.
2) ¿Cuáles diferencias importan (cambian el resultado, el tono o lo que recibe la otra persona) y cuáles dan igual?
3) ¿Qué tiene mi versión que a la tuya le falta? ¿Qué regla o paso del documento de proceso no estás siguiendo?
4) Propón el ajuste exacto al documento o al prompt para que la próxima corrida salga más parecida a la mía.

No me digas que tu versión «también es válida». Aquí el estándar soy yo: la automatización sirve cuando el resultado se parece tanto al mío que nadie nota la diferencia.`,

    // Setup de Claude
    entrevistaSetup: `Quiero que me conozcas a fondo para ayudarme mejor en todo lo que hagamos juntos. Entrevístame como un periodista curioso y cercano.

Reglas de la entrevista:
- Hazme UNA sola pregunta a la vez y espera mi respuesta antes de seguir. No te adelantes ni hagas varias juntas.
- Empieza por lo básico (quién soy, a qué me dedico) y ve profundizando según lo que yo conteste.
- Si una respuesta mía abre algo interesante, pregúntame más sobre eso antes de cambiar de tema.
- Usa un tono natural y relajado, como una plática, no como un formulario.

Con el tiempo cubre estos temas: quién soy y a qué me dedico; en qué proyecto o meta estoy ahorita; para quién es mi trabajo (mi público o mis clientes); cómo es mi día a día; en qué quiero que me ayudes seguido; qué me frustra de las herramientas de IA; y cómo me gusta que me hablen (directo, con detalle, con humor, formal).

Cuando sientas que ya tienes una imagen clara de mí, dime "creo que ya te conozco" y hazme un resumen de quién soy, en tus palabras, para confirmar que entendiste bien.

Empieza ahora con tu primera pregunta.`,

    limpiaSetup: `Ya me entrevistaste y me conoces. Ahora convierte todo lo que aprendiste de mí en un bloque de instrucciones limpio, para pegarlo en las instrucciones de un proyecto o en mis preferencias.

Que el bloque incluya, en secciones cortas:
- Quién soy y a qué me dedico.
- En qué estoy trabajando y cuáles son mis metas.
- Para quién es mi trabajo (mi público o mis clientes).
- Cómo me gusta que me respondas (tono, nivel de detalle, formato).
- Lo que normalmente te voy a pedir.

Reglas para el resultado:
- Conciso y fácil de leer, sin relleno ni párrafos largos.
- Solo lo que de verdad te ayude a ayudarme; quita lo que no aporte.
- Escríbelo para que cualquier chat nuevo lo lea y de inmediato sepa con quién está hablando.

Dame el bloque listo para copiar y pegar.`,

    estiloTono: `Te voy a pasar 5 ejemplos de cosas que yo he escrito (posts, correos, mensajes de WhatsApp, lo que sea). Quiero que aprendas cómo escribo para que, cuando redactes algo por mí, suene a mí y no a robot.

Cuando te los pegue, haz esto:
1. Léelos con calma y descríbeme mi estilo: qué tan formal o relajado soy, qué tan largas son mis frases, qué palabras o muletillas uso, si uso emojis, cómo arranco y cómo cierro.
2. Resúmeme mi voz en una "guía de estilo" de pocos puntos, para que la tengas siempre presente.
3. Aplica esa guía cada vez que escribas algo en mi nombre, a menos que te diga otra cosa.

Aquí van mis 5 ejemplos:

[Pega aquí tus 5 ejemplos, uno debajo del otro]`,

    noQuieresSetup: `Reglas de cómo NO quiero que me respondas (síguelas siempre):

- No te enrolles. Dame la respuesta primero; los detalles después y solo si hacen falta.
- Nada de relleno ni frases de cortesía vacías ("¡Claro que sí!", "Qué excelente pregunta"). Empieza por lo importante.
- No me sueltes avisos legales, advertencias ni descargos que no te pedí.
- No repitas mi pregunta de vuelta antes de contestar.
- Si no sabes algo o no estás seguro, dímelo claro en lugar de inventar.
- No me des opciones infinitas. Si te pido una recomendación, recomiéndame una y explica por qué.
- No cierres cada respuesta preguntándome si quiero algo más, salvo que de verdad haga falta.
- Habla claro y directo, como una persona, no como un manual.`,

    // Feedback loops
    autoAuditoria: `---
Cuando termines la tarea, antes de cerrar, hazte una auto-auditoría y devuélvemela en este formato exacto:

## Auto-auditoría
✅ Qué salió bien: 1-3 puntos concretos de lo que sí funcionó en esta corrida.
🟡 Qué salió más o menos: 1-3 puntos donde dudaste, te faltó contexto, tuviste que adivinar o el resultado quedó a medias.
🔧 Qué cambiar en el prompt: 1-3 ediciones concretas a ESTE prompt para que la próxima corrida salga mejor. Dame el texto exacto que agregarías o quitarías.

Reglas: sé honesto y específico, no me halagues. Si algo quedó flojo, dilo. Si el prompt fue ambiguo, dime en qué parte. Si todo salió bien, dilo también y no inventes problemas.`,

    copiaRapida: `Al terminar, dame 3 líneas: qué salió bien, qué salió más o menos y qué cambiarías de este prompt para la próxima vez. Honesto y al grano.`,

    metaPromptMeta: `Aquí está tu auto-auditoría de la corrida pasada:

<pega aquí las 3 secciones que te devolvió>

Reescribe mi prompt incorporando SOLO las sugerencias de "🔧 Qué cambiar" que de verdad lo mejoren. No agregues nada que yo no haya pedido. Al final, dime en una lista corta: qué cambiaste, qué dejaste igual y por qué descartaste el resto.`,

    diffSkill: `Esta tarea la hizo una skill. Al terminar, además de la auto-auditoría, dime el cambio exacto que le harías al SKILL.md para que la skill mejore: qué línea o sección editarías, el texto nuevo, y por qué. No edites el archivo todavía; solo propón el diff para que yo lo apruebe.`,

    consolidacionSemanal: `Te voy a pegar las auto-auditorías que junté esta semana de un mismo prompt/skill:

<pega aquí las auditorías de la semana>

Encuentra el patrón: ¿qué problema se repite más de una vez? Dame UNA sola versión mejorada del prompt que ataque los problemas recurrentes (no los de una sola vez), y márcame qué quedó fuera por ser ruido de una corrida puntual.`,

    // Claude tonto
    alarmaNombre: `Empieza tu respuesta diciéndome my_name: [escribe tu nombre aquí].

No lo expliques ni lo comentes, solo hazlo en cada respuesta. Si en algún momento dejas de hacerlo, es mi señal de que tu memoria se está llenando — así que tú también avísame si te das cuenta de que ya no lo estás cumpliendo.`,

    resumenTraspaso: `Antes de cerrar esta conversación, hazme un resumen de traspaso para continuar en un chat nuevo sin perder el hilo. Inclúyelo en este orden:

1) El objetivo: qué estamos haciendo y para qué.
2) Las reglas y decisiones que ya acordamos (cómo quiero las cosas y lo que NO debes hacer).
3) En qué punto vamos exactamente.
4) Los siguientes pasos.

Escríbelo en español claro y listo para pegar tal cual como primer mensaje del chat nuevo.`,

    compactConFoco: `/compact Conserva intacto: el objetivo de la tarea, todas las reglas que te di y las decisiones técnicas que ya tomamos. Puedes resumir el resto (exploraciones, intentos fallidos y detalles que ya no importan).`,

    diagnosticoRapido: `Sin volver a leer nada de lo anterior y con tus propias palabras: dime qué reglas te di al inicio de esta conversación y qué estamos construyendo.

Si no las recuerdas con claridad o tienes que adivinar, dímelo honestamente: significa que tu memoria ya se llenó y conviene compactar o empezar de nuevo.`,

    // Estructura de carpetas
    carpetasDisenar: `Quiero organizar este espacio de trabajo para que tú, Claude, te ubiques solo cuando volvamos a trabajar.

Propón una estructura de carpetas simple: una carpeta por tema o por proyecto, con nombres claros, sin anidar de más. Para cada carpeta dime en una línea qué iría dentro.

No instales nada ni inventes una base de datos. Solo carpetas y archivos de texto. Cuando tenga el árbol claro, espera mi OK antes de crear nada.`,

    claudeRaiz: `Crea el CLAUDE.md de la raíz de este proyecto. Es el mapa que vas a leer al inicio de cada sesión, así que tiene que ser corto y útil. Máximo 60 líneas.

Incluye, en este orden:
1. Un párrafo de 2-3 líneas: qué es este proyecto y para quién.
2. El stack o las herramientas principales.
3. Los comandos clave: cómo se corre, cómo se prueba, cómo se revisa.
4. Dónde vive cada cosa (qué hay en cada carpeta).
5. 3 o 4 reglas concretas de "haz esto / no hagas esto".

Sé específico, no vago: "usa 2 espacios de indentación" en vez de "formatea bonito".`,

    claudeLocalCarpeta: `Crea un CLAUDE.md dentro de la carpeta [NOMBRE DE LA CARPETA].

Son las reglas locales de esta carpeta nada más. No repitas lo que ya está en el CLAUDE.md de la raíz.

Explica en pocas líneas: qué hay en esta carpeta, cómo se nombran los archivos aquí, qué convenciones aplican solo aquí y qué NO se debe tocar.
Máximo 30 líneas y al grano.`,

    mantenloVivo: `Antes de terminar, actualiza los CLAUDE.md con lo que aprendimos en esta sesión, para que la próxima vez no empieces desde cero.

Revisa qué decisiones tomamos, qué convención nueva quedó o qué error evitamos, y guárdalo como una regla corta en el CLAUDE.md que corresponda (raíz o carpeta).

No infles el archivo: agrega solo lo que de verdad te ahorraría tiempo la próxima vez, y bórrame lo que ya quedó obsoleto.`,

    // Fable 5
    fableJustificado: `Te voy a describir una tarea y quiero que me ayudes a decidir qué modelo de Claude me conviene usar, siendo honesto con los costos.

Mi tarea: [DESCRIBE TU TAREA, ej.: refactorizar el módulo de pagos de mi app]

Contexto de los modelos (junio 2026):
- Fable 5: el más capaz, hecho para tareas largas de varios pasos. Cuesta 2× Opus en la API, consume ~30% más tokens por su tokenizer nuevo, y sus turnos en tareas duras toman minutos. Gratis en planes Pro/Max/Team hasta el 22 de junio; después requiere usage credits.
- Opus 4.8: el caballo de batalla. Excelente en casi todo, más rápido y más barato.
- Sonnet/Haiku: para tareas simples o repetitivas, mucho más baratos.

Evalúala y recomiéndame qué modelo usar.`,

    fableEspecificacion: `Quiero delegarte un trabajo completo de principio a fin. Aquí va la especificación entera; trabaja de forma autónoma y no te detengas a pedirme permiso en decisiones menores.

EL OBJETIVO:
[QUÉ QUIERES AL FINAL, ej.: una landing page funcional para mi curso / un análisis de mis ventas del trimestre con conclusiones accionables / la migración de mis notas a una estructura ordenada]

PARA QUÉ ES Y PARA QUIÉN:
[EL CONTEXTO REAL, ej.: es para lanzar la próxima semana a mi audiencia de Instagram, gente que no es técnica]

RESTRICCIONES:
- [RESTRICCIÓN 1, ej.: usa solo las herramientas que ya tengo instaladas]
- [RESTRICCIÓN 2, ej.: en español, tono cercano, sin tecnicismos]
- No agregues funciones, refactors ni abstracciones más allá de lo que pide la tarea.

CRITERIO DE ÉXITO (cómo sabremos que quedó):
[SÉ CONCRETO, ej.: la página carga, el botón de compra funciona y se ve bien en celular]

REGLAS DE TRABAJO:
1. Antes de reportar avances, verifica cada afirmación contra algo que realmente hiciste o probaste. Si algo no está verificado, dilo explícitamente.
2. Si encuentras un bloqueo real que solo yo puedo resolver, anótalo y continúa con el resto.
3. Al final entrégame: qué quedó hecho, qué verificaste y cómo, y qué (si algo) quedó pendiente.`,

    fableSesionLarga: `Vamos a hacer una sesión larga de trabajo y quiero que te auto-verifiques durante todo el proceso.

LA TAREA:
[TU TAREA GRANDE, ej.: revisar todo el contenido de mi web y corregir inconsistencias / reorganizar y limpiar mi proyecto / construir la función X completa]

MODO DE TRABAJO:
1. Primero, establece tu propio método para revisar tu trabajo en esta tarea concreta (qué vas a comprobar y cómo). Escríbelo antes de empezar.
2. Divide el trabajo en tramos. Al terminar cada tramo, corre tu método de verificación contra la especificación antes de pasar al siguiente.
3. Si una verificación falla, corrige antes de avanzar. No acumules deuda.
4. Mantén un registro breve: tramo, qué hiciste, qué verificaste, resultado.

REGLAS:
- No me preguntes "¿quieres que continúe?": continúa hasta terminar o hasta toparte con algo que solo yo pueda decidir.
- Reporta avances con evidencia, no con promesas.
- Al final: resumen de todo el trabajo + lista de verificaciones que pasó.`,

    fableMemoria: `Quiero que armes y uses un sistema de memoria simple para nuestras sesiones de trabajo en este proyecto.

INSTRUCCIONES:
1. Crea (si no existe) un archivo llamado LECCIONES.md en la raíz del proyecto.
2. Formato: una lección por entrada, con un resumen de una línea arriba y, debajo, el porqué y cómo aplicarla. Registra tanto correcciones que yo te haga como enfoques que confirmemos que funcionan.
3. A partir de ahora, al inicio de cada tarea consulta LECCIONES.md y aplica lo que sea relevante sin que yo te lo recuerde.
4. No guardes lo que el propio proyecto ya documenta; si una lección resulta equivocada, bórrala; si ya existe una parecida, actualízala en vez de duplicar.

PRIMERA TAREA:
Revisa nuestro contexto actual y el proyecto, y escribe las primeras 3 a 5 lecciones que ya se pueden registrar (preferencias mías que hayas notado, decisiones tomadas, errores que no queremos repetir). Muéstramelas antes de guardarlas.`,

    codexConfig: `{
  "agent": {
    "model": "gpt-5.5-preview",
    "temperature": 0.1,
    "max_tokens": 8192,
    "safe_mode": true,
    "environment": "development"
  },
  "rules": {
    "local_instructions_path": "./AGENTS.md",
    "allowed_commands": ["npm test", "npm run build", "vitest"],
    "blocked_commands": ["rm -rf", "curl -s", "wget", "ssh"]
  }
}`,

    agentsMd: `# AGENTS.md - CONVENCIONES DEL PROYECTO CODEX

## Identidad del Agente
- Eres un Ingeniero de Software Senior especializado en TypeScript y Tailwind CSS.
- Escribe código limpio, legible y modular. No amontones todo en un solo archivo.

## Stack de Tecnología
- Framework: React 18 con Vite
- Estilos: Tailwind CSS (v4)
- Iconos: Lucide React

## Compuertas de Seguridad
- NUNCA ejecutes comandos de borrado destructivo como \`rm -rf\` fuera de carpetas del proyecto.
- NO descargues scripts externos ni los ejecutes a ciegas.
- No intentes subir variables de entorno a repositorios públicos.`,

    codexAgentsStart: `# AGENTS.md

## Qué es este proyecto
[Una o dos frases: qué hace la app y para quién. Ej.: "Landing y panel de un curso online para gente no técnica."]

## Stack y herramientas
- Lenguaje / framework: [ej.: Next.js + TypeScript + Tailwind]
- Gestor de paquetes: [ej.: usa pnpm, NO npm]
- Base de datos / servicios: [ej.: Supabase; Stripe para pagos]

## Comandos que debes correr
- Instalar: [ej.: pnpm install]
- Desarrollo: [ej.: pnpm dev]
- Lint y formato antes de cada PR: [ej.: pnpm lint && pnpm format]
- Pruebas: [ej.: pnpm test]

## Reglas de trabajo
- Haz cambios mínimos y enfocados; no agregues funciones ni refactors que no pedí.
- Antes de decir que algo quedó, verifícalo corriendo el comando correspondiente.
- Trabaja sobre git: si una tarea es grande, ve por partes y muéstrame el diff.
- Idioma de la interfaz y los textos: español, tono cercano y claro.

## Lo que NO quiero
- [ej.: No toques los archivos de configuración de deploy sin avisarme.]
- [ej.: No subas secretos ni claves al repositorio.]`,

    codexPrimeraTarea: `Trabaja en modo de solo lectura por ahora: no edites ni ejecutes nada que cambie archivos.

Quiero que me ayudes a entender este proyecto:
1. Explícame en lenguaje simple qué hace la app y cómo está organizada (las carpetas y archivos principales).
2. Dime cuál es el flujo principal: dónde empieza todo y cómo se conectan las piezas.
3. Si yo quisiera cambiar [DESCRIBE ALGO QUE QUIERES TOCAR, ej.: el formulario de registro], ¿qué archivo leo primero y qué cuidados debo tener?

No hagas cambios todavía: solo quiero el mapa.`,

    codexConstruirFeature: `Quiero que construyas una feature completa de principio a fin. Trabajaja de forma autónoma y no te detengas a pedirme permiso en decisiones menores.

EL OBJETIVO:
[QUÉ QUIERES, ej.: una pantalla de contacto con su formulario funcional que guarde los mensajes]

PARA QUIÉN ES:
[CONTEXTO, ej.: usuarios no técnicos; tiene que verse bien en celular]

RESTRICCIONES:
- Cambios mínimos y enfocados; no agregues nada que no pedí.
- Respeta el stack y las reglas del AGENTS.md.
- [OTRA RESTRICCIÓN, ej.: en español, sin librerías nuevas pesadas]

CÓMO SABREMOS QUE QUEDÓ:
[CRITERIO CONCRETO, ej.: el formulario valida, guarda el mensaje y muestra confirmación]

REGLAS DE TRABAJO:
1. Antes de decir que algo quedó listo, verifícalo de verdad (córrelo o pruébalo). Si algo no lo pudiste verificar, dímelo.
2. Al final, muéstrame el diff y un resumen de qué hiciste, qué verificaste y qué quedó pendiente.`,

    codexArreglarBug: `Tengo un bug y quiero que lo arregles con el cambio más pequeño posible.

EL PROBLEMA:
[DESCRIBE QUÉ FALLA, ej.: al hacer login con un correo en mayúsculas, dice "usuario no existe"]

CÓMO REPRODUCIRLO:
[PASOS, ej.: entro a /login, escribo MI@CORREO.com y la contraseña correcta, y falla]

LO QUE NECESITO:
1. Rastrea la causa raíz, no solo el síntoma. Explícamela en una o dos frases.
2. Haz el arreglo más pequeño y seguro posible; no aproveches para refactorizar otras cosas.
3. Verifica que el arreglo funciona (corre la app o el test correspondiente).
4. Muéstrame el diff antes de hacer commit, y espera mi OK.`,

    codexConfigurarDeCero: `Quiero dejar Codex bien configurado en este proyecto y soy principiante. Guíame paso a paso, con calma y verificando en cada paso, sin asumir que sé de terminal.

1. Confírmame cómo iniciar sesión y en qué modo de permisos conviene empezar (quiero el más seguro por defecto).
2. Ayúdame a crear un AGENTS.md para este proyecto: hazme las preguntas necesarias sobre qué construyo, mi stack y mis reglas, y luego escríbelo por mí.
3. Recomiéndame un servidor MCP útil para mi caso y dime el comando exacto para agregarlo (explícame qué hace antes de instalarlo).
4. Al final, dame un resumen de cómo quedó todo y 3 primeras tareas pequeñas que podría pedirte para agarrar confianza.

Después de cada paso, espera mi confirmación antes de seguir.`,

    pluginCmdOpen: `/plugin`,
    pluginCmdFrontend: `/plugin install frontend-design@claude-plugins-official`,
    pluginReload: `/reload-plugins`,
    pluginCmdSuperpowers: `/plugin install superpowers@claude-plugins-official`,
    pluginCmdPlaywright: `claude mcp add playwright npx @playwright/mcp@latest`,
    pluginCmdRalph: `/plugin install ralph-loop@claude-plugins-official`,
    pluginCmdContext7: `npx ctx7 setup`,
    pluginCmdMarketplace: `/plugin marketplace add obra/superpowers-marketplace`,

    opusPromptHonestidad: `Antes de darme esto por terminado, sé honesto conmigo:

1. Lista todo lo que NO te quedó claro o donde tuviste que suponer algo.
2. Marca las partes de tu propio resultado que tú mismo señalarías como flojas, riesgosas o sin probar.
3. Si hay algo que no puedes verificar, dímelo en vez de afirmarlo como si fuera seguro.

No quiero una respuesta que se vea bien y por dentro tenga huecos. Prefiero saber dónde están los huecos.`,

    opusPromptPlanFrenar: `Te voy a explicar lo que quiero hacer y cómo pienso hacerlo. Antes de ejecutar nada:

1. Dime si el plan tiene sentido o si hay una forma claramente mejor.
2. Señala los supuestos míos que podrían estar mal.
3. Si crees que me voy a meter en un problema, fréname y dime por qué.

No me sigas la corriente solo por complacerme. Prefiero que me corrijas ahora a descubrirlo después.

Mi objetivo: {describe qué quieres lograr}.
Mi plan: {describe cómo pensabas hacerlo}.`,

    opusPromptTareaLarga: `Te voy a encargar una tarea larga. Trabájala de corrido sin pedirme confirmación en cada paso; solo párate si llegas a una decisión que de verdad cambia el rumbo.

La tarea: {describe el encargo completo}.

Reglas:
- Haz un plan corto primero y luego ejecútalo.
- Verifica tu propio trabajo antes de reportarme (corre lo que tengas para correr).
- Al final, dame un resumen de qué hiciste, qué te faltó y qué dudas te quedaron.

Avísame solo cuando termines o cuando estés genuinamente atascado.`,

    opusPromptSimpleEffort: `Esta es una tarea simple, no la pienses de más. Dame la solución más directa que funcione:

- Nada de abstracciones, capas ni librerías que no te pedí.
- Nada de "por si en el futuro": resuelve lo que estoy pidiendo hoy.
- Si la respuesta cabe en pocas líneas, que quepa en pocas líneas.

La tarea: {describe la tarea simple}.`,

    opusCommandFast: `/fast`,

    spotifyReguetonClasico: `Hazme un playlist en Spotify de clásicos del reguetón de la vieja escuela, los pesos pesados de verdad, y créalo directo en mi cuenta.

Época: 2003 a 2010, la era dorada del género.
Artistas obligados: Daddy Yankee, Don Omar, Tego Calderón, Wisin & Yandel, Héctor "El Father", Zion & Lennox.
Mood: perreo clásico para prender la fiesta — nada de baladas ni versiones acústicas.
Qué evitar: nada de Calle 13 ni reguetón "alternativo" o consciente. Quiero los hits de pista que sonaban en todas partes.

Pon entre 25 y 30 canciones, sin repetir artista más de 3 veces, y llámala "Clásicos del Perreo".`,

    spotifyFormulaMaestra: `Hazme un playlist en Spotify y créalo directo en mi cuenta.

Estilo: [género o estilo, ej. reguetón clásico]
Época: [años o era, ej. 2003-2010]
Artistas de referencia: [3 a 5 nombres que marcan el tono]
Para qué es: [ocasión o mood, ej. fiesta / concentrarme / gym]
Qué evitar: [lo que NO quieres, ej. baladas, remixes, tal artista]
Cantidad: [nº de canciones, ej. 25-30]
Nombre de la playlist: [cómo se va a llamar]

Arma la lista respetando todo lo de arriba y, cuando esté, créala en mi Spotify.`,

    spotifyPromptFoco: `Hazme un playlist en Spotify para concentrarme mientras trabajo y créalo en mi cuenta.

Estilo: instrumental — lo-fi, post-rock suave y piano ambiental.
Mood: calmado pero que no dé sueño, para mantener el foco un par de horas.
Qué evitar: nada con voces ni letras, nada de drops fuertes ni cambios bruscos.
Cantidad: unas 40 canciones (como 2 horas).
Nombre: "Modo Foco".`,

    spotifyPromptPrevia: `Hazme un playlist en Spotify para la previa con amigos y créalo en mi cuenta.

Estilo: reguetón y pop latino actual, bien arriba.
Artistas de referencia: Bad Bunny, Karol G, Feid, Rauw Alejandro, Peso Pluma.
Mood: energía en aumento, puro hit que todos se sepan.
Qué evitar: baladas, nada lento ni triste.
Cantidad: 30 canciones.
Nombre: "Previa 🔥".`,

    spotifyPromptGym: `Hazme un playlist en Spotify para entrenar fuerte y créalo en mi cuenta.

Estilo: hip-hop, trap y algo de rock pesado.
Mood: agresivo, mucha energía, para empujar en las series duras.
Tempo: rápido, nada lento.
Qué evitar: baladas, lo-fi, cualquier cosa tranquila.
Cantidad: 25 canciones.
Nombre: "Sin Excusas".`,

    spotifyPromptViaje: `Hazme un playlist en Spotify para un viaje en carretera de noche y créalo en mi cuenta.

Estilo: rock alternativo, indie y pop nostálgico.
Época: mezcla de clásicos de los 2000 con cosas actuales.
Mood: relajado pero despierto, para cantar a media voz con la ventana abajo.
Cantidad: 35 canciones (como 2 horas y media).
Nombre: "Ruta Nocturna".`,

    spotifyPromptLlorar: `Hazme un playlist en Spotify de puro despecho y créalo en mi cuenta.

Estilo: corridos tumbados tristes, banda y un poco de bachata.
Artistas de referencia: Junior H, Iván Cornejo, Natanael Cano, Aventura.
Mood: para sentir todo y después superarlo.
Cantidad: 25 canciones.
Nombre: "Me Falló".`,

    negocioPregunta1: `Eres un consultor de operaciones directo y práctico. Quiero que me ayudes a identificar qué pasos de mi negocio producen de verdad mis resultados (ventas, clientes, entregas) y cuáles son solo costumbre o teoría.

Mi negocio es: [describe tu negocio en 2 o 3 frases: qué vendes, a quién, cómo ganas dinero].

Hazme preguntas una a la vez (máximo dos juntas) y espera mi respuesta antes de seguir. Empieza por el final: pregúntame cuál es el momento exacto en que un cliente me paga, y vamos hacia atrás desde ahí hasta el primer contacto.

Tu meta: que al terminar tengamos claro, en orden, el camino real que lleva a un cliente desde que me conoce hasta que me paga, marcando cuáles pasos producen el resultado y cuáles solo están porque "siempre se han hecho así". No me dejes adornar: si algo no aporta, dímelo.`,

    negocioPregunta2: `Toma todo lo que platicamos sobre cómo funciona mi negocio y conviértelo en un documento de proceso claro y ordenado.

Estructúralo así:
1. El objetivo del proceso en una sola línea.
2. Los pasos en orden numerado.
3. Quién hace cada paso.
4. Qué herramienta se usa o dónde se hace.
5. Cuánto tarda más o menos cada paso.

Escríbelo en lenguaje simple, como si se lo explicaras a alguien que entra mañana a trabajar conmigo y no sabe nada del negocio. Si te falta información para algún paso, no la inventes: márcalo con [FALTA: ...] para que yo lo complete. Entrégamelo listo para copiar y guardar como un archivo llamado proceso.md.`,

    negocioPregunta3: `Aquí está mi proceso escrito:

[pega aquí el documento proceso.md del paso anterior]

Quiero que lo audites como un consultor al que le pagan por encontrar grasa. Para cada paso dime tres cosas:
1. ¿Esto le importa al cliente o solo a mí?
2. ¿Qué pasaría si lo borro mañana?
3. ¿Se hace por una buena razón o solo porque siempre se ha hecho así?

Al final dame una lista corta de los pasos que recomiendas eliminar, con una frase de por qué cada uno. Sé directo, no me cuides los sentimientos. Si un paso es sagrado y no se toca, dímelo también y explica por qué.`,

    negocioPregunta4: `Con los pasos que sobrevivieron a la auditoría, arma la versión más simple de mi proceso que todavía me dé los mismos resultados.

Reglas:
- Junta pasos donde tenga sentido.
- Elimina traspasos y esperas innecesarias.
- En cada paso deja clarísimo quién lo hace, qué hace, cuándo y por qué.

Entrégamelo en dos partes:
1. El proceso final, limpio y numerado.
2. Un resumen corto de qué cambió respecto a la versión original y qué gané con el cambio.

Esta versión simple es la que voy a usar para meterle IA, así que escríbela para que cualquiera (o cualquier IA) la pueda seguir sin preguntarme nada.`,

    negocioMaestro: `Quiero que actúes como un estratega de IA práctico y honesto, no como un gurú que vende humo. Este es mi negocio y este es mi proceso ya simplificado.

Negocio: [qué vendes, a quién, cómo ganas dinero]
Proceso simple: [pega aquí la versión simple del paso anterior]
Mis herramientas actuales: [por ejemplo: WhatsApp, Excel, correo, Instagram, una libreta]
Lo que más tiempo me quita: [describe la parte más pesada o repetitiva]
Contexto: no sé programar y mi presupuesto es bajo.

Analiza mi proceso paso por paso y dame:
1. En qué pasos exactos la IA me ahorraría más tiempo o dinero. Ordénalos por impacto contra esfuerzo, del más fácil y rentable al más complejo.
2. Para cada uno, qué puedo hacer hoy mismo solo con Claude en el navegador, sin instalar nada.
3. Qué necesitaría llevar más adelante a Claude Code o a una automatización, y por qué.
4. Qué NO vale la pena automatizar todavía, para no perder el tiempo.

Cierra con un plan en 3 fases (esta semana / este mes / más adelante) y dime el primer paso concreto que debo hacer hoy. Nada de teoría: pasos accionables que pueda empezar ya.`,

    negocioClaudeCode: `Estás trabajando en la carpeta de mi negocio. Lee el archivo proceso.md para entender cómo opero.

Quiero construir la primera automatización de mi plan de IA: [pega aquí el paso que salió número 1 en impacto contra esfuerzo].

Antes de crear o tocar cualquier archivo, explícame en español simple qué vas a hacer y por qué, como si yo no supiera programar (porque no sé). Vamos paso a paso, uno a la vez, y después de cada paso dime qué hicimos y qué sigue. Si necesitas algo de mí (una clave, un dato, un decisión), pregúntamelo en lugar de inventarlo.`,

    negocioSkill: `Quiero crear una skill de Claude Code que se llame diagnostico-negocio. Su trabajo es llevar a cualquier persona por las 5 preguntas que preparan un proceso de negocio antes de meterle IA.

La skill debe, en este orden:
1. Hacerme las preguntas una por una, esperando mi respuesta (qué da resultados, dónde está escrito, qué sobra, cuál es la versión más simple).
2. Ir escribiendo todo en un archivo proceso.md a medida que avanzamos.
3. Auditar qué pasos sobran y proponer cuáles eliminar.
4. Entregar la versión más simple del proceso.
5. Cerrar con un plan de IA en 3 fases (esta semana / este mes / más adelante) y el primer paso concreto para hoy.

Créala con su archivo SKILL.md bien escrito. Cuando termines, explícame en español simple cómo se instala y, sobre todo, cómo la vuelvo a usar la próxima vez sin tener que repetir nada de esto.`,

    prompting101Esqueleto: `<role>
[Pilar 1] Eres un [rol específico] que [misión clara, una línea].
</role>

<tone>
[Pilar 2] Mantente [factual / cálido / técnico]. Si [condición de incertidumbre], [acción explícita en lugar de adivinar].
</tone>

<background>
[Pilar 3] Contexto que NO cambia entre llamadas:
- Estructura del input que vas a recibir.
- Glosario o convenciones del dominio.
- Reglas de negocio fijas.
</background>

<examples>
[Pilar 5] Casos difíciles ya resueltos por humanos:
<example>
  <input>...</input>
  <output>...</output>
</example>
</examples>

<rules>
[Pilar 4] Cómo razonar sobre la tarea, paso a paso:
1) [Primer paso, el más simple]
2) [Segundo paso, depende del primero]
3) [Veredicto / output, solo si los pasos previos son consistentes]
</rules>

<conversation_history>
[Pilar 6, opcional] Solo si tu app tiene sesión viva con turnos relevantes.
</conversation_history>

<output_format>
[Pilar 9] Envuelve el resultado final dentro de [<tag>...</tag> o JSON estricto].
[Pilar 8] Antes del resultado, razona dentro de <thinking>...</thinking>.
</output_format>

<task>
[Pilar 7] Para este input específico, ejecuta el flujo de <rules>.
</task>

<!-- Pilar 10 (prefill) lo aplicas en el assistant message: empieza con "{" o "<...>" según el formato deseado. -->`,

    prompting101Auditoria: `Voy a pegarte mi prompt actual. Quiero que lo audites contra los 10 pilares de Prompting 101 de Anthropic Applied AI:

1) Task description / role
2) Tone context
3) Background data, documents & images
4) Detailed task description & rules
5) Examples (few-shot)
6) Conversation history
7) Immediate task description
8) Thinking step-by-step
9) Output formatting
10) Prefilled response

PROMPT ACTUAL:
"""
[pega aquí tu prompt completo]
"""

CASO DE USO:
[describe en 1-2 líneas qué hace este prompt en producción]

ENTRÉGAME:
1. Tabla con los 10 pilares marcando ✅ presente / ⚠️ débil / ❌ ausente y una línea de evidencia.
2. Los 3 pilares con mayor impacto al añadirlos en este prompt específico — y qué mejora esperas.
3. La versión afilada del prompt, listo para copiar, con XML tags si aplica.
4. Una sola línea de estrategia: qué cambió y por qué.`,

    prompting101Evolucion: `Quiero aplicar el flujo iterativo V1 → V5 de Prompting 101 de Anthropic a MI caso de uso. Sigue exacto el patrón del demo del seguro sueco:

MI TAREA:
"""
[describe en 2-3 líneas qué quieres que Claude haga, qué inputs recibe y qué output esperas]
"""

ENTRÉGAME LAS 5 VERSIONES:

v1 — Prompt vago, una sola línea. Para mostrar el modo error.
v2 — v1 + role + tone context. Sin background todavía.
v3 — v2 + background data en lo que iría al system prompt (estructura del input, glosario, reglas fijas).
v4 — v3 + reglas paso a paso de cómo razonar, en orden.
v5 — v4 + output formatting (XML o JSON) + sugerencia de prefill.

Para cada versión:
- Marca qué pilar añadiste con respecto a la previa.
- Pega el prompt completo en bloque copiable.
- En una línea, explica qué error de v(n-1) corrige.

Cierre con: cuál versión recomiendas correr en producción y por qué.`,

    prompting101Refactor: `Tengo este prompt todo en un solo mensaje de usuario. Quiero refactorizarlo a la estructura system + user que recomienda Anthropic Applied AI:

PROMPT ACTUAL (todo junto):
"""
[pégalo entero aquí]
"""

ENTRÉGAME:

1) SYSTEM PROMPT — lo que NO cambia entre llamadas:
- <role>...</role>
- <tone>...</tone>
- <background>...</background>
- <rules>...</rules>
- <examples>...</examples> (si los hay)
- <output_format>... </output_format>

2) USER MESSAGE TEMPLATE — lo que SÍ cambia por cada llamada:
- Placeholders {{...}} marcados.
- Pilar 7 (immediate task) al inicio o al final.

3) NOTA DE PROMPT CACHING — qué bloque del system prompt te conviene cachear y cuánto ahorras aproximado.

4) PREFILL SUGERIDO — qué meter en el primer mensaje del assistant para forzar el formato deseado.`,

    prompting101Largo: `Quiero controlar el largo de tus respuestas. Opus 4.7 calibra el largo según qué tan compleja juzga la tarea, así que te lo dejo explícito.

ELIGE EL MODO SEGÚN LO QUE TE PIDA:

MODO CONCISO (por defecto):
"Da respuestas concisas y al grano. Sáltate el contexto de relleno y mantén los ejemplos al mínimo. Si una frase no agrega información nueva, bórrala."

MODO A DETALLE (cuando lo pida así):
"Dame la respuesta a detalle: explica el porqué de cada paso, incluye ejemplos y cubre los casos límite que se te ocurran."

REGLA EXTRA:
No me digas solo lo que NO debes hacer; muéstrame con un ejemplo corto cómo se ve el largo correcto antes de empezar.`,

    prompting101Normal: `Tengo un prompt escrito "a gritos" (MAYÚSCULAS, "DEBES", "CRÍTICO", signos de adelantamiento) porque así le hablaba a los modelos viejos. Con Opus 4.7 eso lo hace responder peor.

MI PROMPT ACTUAL:
"""
[pega aquí tu prompt tal cual, con todo y mayúsculas]
"""

REESCRÍBELO ASÍ:
1. Tono normal, como si le explicaras a una persona capaz. Sin MAYÚSCULAS de énfasis ni "DEBES / TIENES QUE / CRÍTICO".
2. Cada regla importante con su motivo en una línea (por qué importa), porque eso me da mejores resultados que la orden seca.
3. Las prohibiciones conviértelas en instrucciones en positivo (qué SÍ quiero, no qué no).
4. Entrégame el prompt nuevo en un bloque copiable y, debajo, una línea de qué cambiaste y por qué.`,

    prompting101Alcance: `Opus 4.7 es literal: si le digo algo para "un" caso, no lo extiende solo a los demás. Quiero que apliques una instrucción a TODO, no solo al primer elemento.

LA TAREA:
"""
[describe qué quieres y sobre qué (todas las secciones, todos los archivos, cada fila, etc.)]
"""

HAZLO ASÍ:
1. Aplica la instrucción a cada elemento del conjunto, no solo al primero. Si hay 10 secciones, son las 10.
2. Antes de empezar, dime en una línea cuántos elementos detectaste y cuáles vas a tocar.
3. Al final, confirma que ninguno se quedó sin procesar.`,

    prompting101Voz: `Quiero fijar la voz de tus respuestas. Opus 4.7 por defecto es más directo y con menos validación, así que te la pido explícita.

ELIGE SEGÚN LA QUE NECESITE:

VOZ CÁLIDA / CERCANA:
"Usa un tono cálido y colaborativo. Reconoce lo que planteo antes de responder y escribe como si habláramos en persona, sin sonar a manual."

VOZ DIRECTA / EJECUTIVA:
"Ve al grano. Sin preámbulos del tipo 'claro, aquí tienes'. Afirma con seguridad y deja las salvedades solo cuando de verdad importen."

REGLA EXTRA:
Mantén esta voz en toda la conversación, no solo en la primera respuesta.`,

    tresErroresPresentacion: `Antes de pedirte nada, te cuento quién soy y en qué estoy:

Rol: [tu rol concreto en una línea — no CV, lo relevante para esta conversación]

Proyecto: [qué construís / vendés / operás, en una línea]

Audiencia: [para quién es lo que hacés, con un dato concreto: edad, industria, país, tamaño]

Lo que vendo o entrego: [el sustantivo concreto + el formato]

Situación actual: [dónde estoy hoy con un número o un hecho, y dónde quiero llegar]

Tono que uso: [casual / formal / voseo Latam / inglés profesional / etc.]

Antes de avanzar con cualquier pedido, repetime esto en tus palabras en 4 líneas para confirmar que entendiste bien. Si algo te suena raro o te falta dato, preguntá ahora.`,

    tresErroresAnclaje: `Este es el contexto permanente del proyecto. Léelo cada vez que arranque una conversación nueva acá adentro.

Rol mío: [rol]

Proyecto: [nombre + qué hace + por qué existe, en 3 líneas]

Audiencia: [3 datos concretos: quiénes son, qué les duele, qué los hace decir sí]

Stack / herramientas que uso: [stack relevante o "no aplica"]

Lo que ya intenté y NO funcionó: [2-3 cosas concretas que descartaste]

Lo que SÍ está funcionando hoy: [2-3 anclas vigentes que no querés que rompa]

Tono y voz: [reglas de cómo escribir o hablar — palabras a usar, palabras a evitar]

Forma del output que prefiero: [estructura por defecto: tabla, lista, código con comentarios, etc.]

Cosas que NO querés que haga: [hard nos — formato, contenido, fuentes, etc.]

Cuando trabajemos, asumí este contexto sin que te lo repita. Si una conversación nueva requiere algo que contradice este contexto, marcame la contradicción antes de avanzar.`,

    tresErroresAuditoria: `Estoy a punto de pedirte [describí el pedido en una línea: "ayudame con el copy de mi landing", "armame un plan de 90 días", etc.].

Antes de que arranques, hacéme las 5 preguntas más importantes que necesitarías que conteste para que tu respuesta no salga genérica. No me preguntes lo obvio — preguntá lo que realmente cambia el output según mi respuesta.

Numerá las preguntas del 1 al 5. Esperá a que conteste las 5 antes de mandar tu trabajo final.`,

    claudeCodeRecomendaciones: `Recomiéndame automatizaciones para este proyecto.`,

    claudeCodeNarrativo: `Ayúdame a configurar Claude Code para este proyecto.

Antes de tirarme las recomendaciones, haz esto:
1. Lista los archivos clave que miras para entender el stack (package.json, requirements.txt, go.mod, lo que aplique).
2. Dime en 1-2 líneas qué tipo de proyecto detectas (web, mobile, CLI, data science, etc.) y qué framework principal usa.
3. Después dame la tabla con tus recomendaciones top 1-2 por categoría (Hooks, Skills, MCP servers, Subagents, Slash commands).
4. En cada recomendación, explícame en 1 línea por qué me sirve a mí, no en general.

Si una categoría no te parece relevante para este proyecto, sáltala y dime por qué.`,

    claudeCodeFocalizado: `¿Qué hooks debería usar en este proyecto?

Mira mi stack y mis dependencias, y dame los top 3 hooks que más impacto me darían. Para cada uno:
- Qué hace el hook (en 1 línea simple).
- Por qué me sirve a mí específicamente (no en general).
- El comando exacto para instalarlo o el snippet de configuración que tengo que pegar.

Si crees que necesito un hook que aún no existe como plugin oficial, márcamelo como 'custom' y pásame el código listo para que lo guarde dentro de .claude/hooks/.`,

    claudeCodeExtendido: `Activa la skill claude-automation-recommender y haz un análisis completo de este proyecto.

Formato de salida:

1. RESUMEN DEL PROYECTO (3-5 líneas)
   - Tipo de proyecto y framework principal.
   - Stack tecnológico detectado.
   - Tamaño aproximado (archivos, líneas de código, dependencias).

2. RECOMENDACIONES (top 1-2 por cada categoría)
   Para CADA recomendación incluye:
   - Nombre de la automatización.
   - Qué hace en 1 línea.
   - Por qué me sirve a mí específicamente, referenciando algo real de mi código (no el genérico).
   - Comando exacto, path o snippet que tengo que aplicar.
   - Si requiere setup adicional (API keys, cuenta de pago, permisos), avísame antes de que lo intente.

3. SI ALGUNA CATEGORÍA NO APLICA
   Márcala como 'no aplica' y dime en 1 línea por qué.

4. ORDEN SUGERIDO
   Si fueras yo, ¿en qué orden las aplicarías? La más impactante primero.

Importante: no apliques ninguna recomendación, solo recomienda. Yo decido cuáles aplicar después.`,

    claudeCustomInstructions: `Vamos a armar juntos las Custom Instructions para un Claude Project nuevo que va a funcionar como mi miniagente especializado.

Tu rol: hacerme una INTERROGACIÓN profunda — preguntas específicas que te lleven a entender al 100% qué quiero del agente, antes de escribir una sola línea de instrucciones.

Reglas estrictas de la interrogación:
- Hacé las preguntas DE A UNA. No me tires todas juntas.
- Esperá mi respuesta entre cada pregunta.
- Sondéame con seguimientos cuando algo quede vago o ambiguo.
- No avances al siguiente tema hasta que el actual esté cubierto al 100%.
- Si te respondo algo contradictorio con lo anterior, mostrámelo y pedíme que aclare.

Temas que necesito que cubras (en este orden, una pregunta por tema y los seguimientos que hagan falta):
1. Qué hace mi marca o proyecto.
2. Quién es mi audiencia (demografía, dolor que tienen, lenguaje que usan).
3. El tono y voz que quiero que el agente use (formal, latino directo, técnico, juvenil, etc.).
4. Las 5 cosas que SÍ debe hacer el agente.
5. Las 3 cosas que NO debe hacer NUNCA.
6. Formato de salida preferido (listas, prosa, bullets, respuestas cortas, etc.).
7. Idioma y regionalismo (español Latam neutro, voseo argentino, mexicano, etc.).
8. Casos de uso típicos (qué le voy a preguntar más seguido).
9. Ejemplos de respuestas buenas vs respuestas malas (si los tengo).

Cuando termines TODAS las preguntas, ARMÁ el bloque final de Custom Instructions listo para pegar en el campo del Project. Reglas del bloque final:
- Máximo 600 palabras.
- Segunda persona dirigida a Claude.
- Sin meta-comentarios ni encabezados explicativos.
- Tan específico que el agente pueda seguirlo AL PIE DE LA LETRA sin tener que interpretar nada.
- Solo el contenido que va al campo, ordenado por: rol → reglas duras → tono → formato → casos típicos.

Empezá con la primera pregunta.`
  };

  const handleSelectLevel = (level: "principiante" | "intermedio" | "avanzado" | "prompts") => {
    setActiveLevel(level);
    setSelectedGuideId(null);
  };

  return (
    <div className="w-full bg-neutral-950/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-md" id="wentix-ai-0-to-pro-academy">
      
      {/* SECTION TOP NAV / HEADER */}
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-cyan-950/25 via-neutral-900/40 to-amber-950/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="cursor-pointer" onClick={() => setSelectedGuideId(null)}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
              WENTIX ACADÉMICO • AI 0 A PRO
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight font-display uppercase">
            Ruta de Aprendizaje Profesional
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl">
            Sistematiza tu conocimiento en IA. De novato en chat a Ingeniero Técnico de prompts y agentes autónomos.
          </p>
        </div>

        {/* Tab switcher for Levels */}
        <div className="flex bg-neutral-950/80 p-1 r-level-tab rounded-xl border border-white/5 shrink-0 self-start md:self-center overflow-x-auto gap-0.5 max-w-full">
          <button
            onClick={() => handleSelectLevel("principiante")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeLevel === "principiante"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/15"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Principiante</span>
          </button>
          
          <button
            onClick={() => handleSelectLevel("intermedio")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeLevel === "intermedio"
                ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/15"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Intermedio</span>
          </button>

          <button
            onClick={() => handleSelectLevel("avanzado")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeLevel === "avanzado"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/15"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Avanzado</span>
          </button>

          <button
            onClick={() => handleSelectLevel("prompts")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeLevel === "prompts"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/15"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Biblioteca Prompts</span>
          </button>
        </div>
      </div>

      {/* RENDER LIST OF GUIDES (If none is selected) */}
      {!selectedGuideId ? (
        activeLevel === "prompts" ? (
          <div className="p-6 md:p-8 space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 gap-2">
              <div>
                <h3 className="text-base font-bold text-white uppercase font-display tracking-wide flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Biblioteca Digital de Prompts de Elite</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Prompts 100% listos y curados para ingenieros de software, analistas, redactores y automatizadores. Elige tu arma.
                </p>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center">
                PROMPTS: {prompts.length}
              </div>
            </div>

            {/* Filter controls inside prompts tab */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-neutral-900/30 p-4 rounded-2xl border border-white/5">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Buscar prompt..."
                  value={promptSearch}
                  onChange={(e) => setPromptSearch(e.target.value)}
                  className="w-full bg-black border border-white/5 text-xs text-white rounded-xl py-2 pl-9 pr-4 placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Model select */}
              <div>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-black border border-white/5 text-xs text-white rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Todos">Modelo: Todos</option>
                  <option value="ChatGPT">ChatGPT</option>
                  <option value="Claude">Claude</option>
                  <option value="Gemini">Gemini</option>
                  <option value="Midjourney">Midjourney</option>
                </select>
              </div>

              {/* Difficulty select */}
              <div>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full bg-black border border-white/5 text-xs text-white rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Todos">Dificultad: Todas</option>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            {/* List of prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts
                .filter((p) => {
                  const matchSearch = p.title.toLowerCase().includes(promptSearch.toLowerCase()) || 
                                      p.description.toLowerCase().includes(promptSearch.toLowerCase()) ||
                                      p.promptText.toLowerCase().includes(promptSearch.toLowerCase());
                  const matchModel = selectedModel === "Todos" || p.model === selectedModel;
                  const matchDifficulty = selectedDifficulty === "Todos" || p.difficulty === selectedDifficulty;
                  return matchSearch && matchModel && matchDifficulty;
                })
                .map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl bg-[#0c0c0c] border border-white/5 hover:border-emerald-500/30 p-5 flex flex-col justify-between transition-all group relative text-left"
                  >
                    <div>
                      {/* Header model and stats */}
                      <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                        <div className="flex gap-2">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            p.model === "ChatGPT" ? "bg-emerald-950 text-emerald-400" :
                            p.model === "Claude" ? "bg-orange-950 text-orange-400" :
                            p.model === "Gemini" ? "bg-blue-950 text-blue-400 font-bold" :
                            "bg-purple-950 text-purple-400"
                          }`}>
                            {p.model}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                            {p.difficulty}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-500">
                          🔥 {p.popularCount} copias
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-display text-white mb-2 group-hover:text-emerald-400 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
                        {p.description}
                      </p>

                      {/* Display of prompt code box */}
                      <div className="p-3 bg-black rounded-lg border border-white/5 mb-4 relative max-h-32 overflow-y-auto no-scrollbar font-mono text-[10px] text-zinc-400 leading-relaxed whitespace-pre-wrap select-all">
                        {p.promptText}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <button
                        onClick={() => onToggleBookmark?.(p.id)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          bookmarks.includes(p.id)
                            ? "bg-emerald-950 border-emerald-500 text-emerald-400"
                            : "bg-neutral-900 hover:bg-neutral-800 border-white/5 text-neutral-500 hover:text-white"
                        }`}
                      >
                        <BookMarked className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleCopy(p.promptText, p.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedStates[p.id] ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                        <span>{copiedStates[p.id] ? "¡Copiado!" : "Copiar Prompt"}</span>
                      </button>
                    </div>
                  </div>
                ))}

              {prompts.filter((p) => {
                const matchSearch = p.title.toLowerCase().includes(promptSearch.toLowerCase()) || 
                                    p.description.toLowerCase().includes(promptSearch.toLowerCase()) ||
                                    p.promptText.toLowerCase().includes(promptSearch.toLowerCase());
                const matchModel = selectedModel === "Todos" || p.model === selectedModel;
                const matchDifficulty = selectedDifficulty === "Todos" || p.difficulty === selectedDifficulty;
                return matchSearch && matchModel && matchDifficulty;
              }).length === 0 && (
                <div className="col-span-1 md:col-span-2 py-12 text-center border border-dashed border-white/10 rounded-2xl">
                  <MessageSquare className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <span className="block text-sm font-semibold text-neutral-300">No se encontraron prompts</span>
                  <span className="text-xs text-neutral-500 mt-1 block">Prueba cambiando los filtros o borrando caracteres de tu consulta</span>
                </div>
              )}
            </div>

            {/* Quick academy info rules */}
            <div className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col sm:flex-row items-center gap-4.5 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white uppercase font-display">Acceso Académico Permanente 2026</h5>
                  <p className="text-[11px] text-neutral-400 leading-tight">Guarda estos prompts listos para usarlos directamente en tu proyecto local o celular de automatización.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-neutral-900 border border-white/10 px-3 py-1 rounded-xl">
                Cód. Wentix Academy 2026
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase font-display tracking-wide flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-cyan-400" />
                  <span>Programación de contenidos por Nivel</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Selecciona uno de los manuales estructurados de Wentix para clonar el prompt, ver las reglas y optimizar tus flujos locales.
                </p>
              </div>
              <div className="text-[10px] font-mono text-neutral-500 bg-neutral-900 border border-white/5 px-2.5 py-1 rounded-full shrink-0">
                MÓDULOS: {METADATA.filter(m => m.level === activeLevel).length}
              </div>
            </div>

            {METADATA.filter((m) => m.level === activeLevel).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {METADATA.filter((m) => m.level === activeLevel).map((guide) => (
                  <div 
                    key={guide.id}
                    onClick={() => {
                      setSelectedGuideId(guide.id);
                      onShowToast(`📖 Abriendo manual: ${guide.title}`);
                    }}
                    className="bg-neutral-900/40 hover:bg-neutral-900/90 border border-white/5 hover:border-cyan-500/20 rounded-2xl p-5 transition-all hover:scale-[1.01] cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-800/15 px-2 py-0.5 rounded uppercase">
                          Lección {guide.lessonNum}
                        </span>
                        <span className="text-xs font-mono text-neutral-500 flex items-center gap-1 font-bold">
                          <Clock className="w-3 h-3 text-neutral-500" />
                          {guide.duration}
                        </span>
                      </div>

                      <h4 className="text-base md:text-lg font-black text-white group-hover:text-cyan-400 transition-colors font-display tracking-tight uppercase leading-snug">
                        {guide.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 font-mono tracking-tight text-amber-500 mb-2">
                        {guide.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans mt-2">
                        {guide.lead}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
                      <div className="flex gap-1">
                        {guide.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-white/5 text-neutral-400">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-cyan-400 font-bold flex items-center gap-1 scale-95 group-hover:translate-x-1 transition-transform">
                        <span>Estudiar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl bg-neutral-950/30">
                <BookOpen className="w-8 h-8 text-neutral-600 mx-auto mb-3 animate-pulse" />
                <span className="block text-sm font-semibold text-neutral-300">Nivel sin lecciones asignadas aún</span>
                <p className="text-xs text-neutral-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Todas las 8 lecciones completas de la academia se encuentran localizadas bajo la pestaña de <strong className="text-amber-400">Principiante</strong> por el momento.
                </p>
                <button
                  onClick={() => handleSelectLevel("principiante")}
                  className="mt-4 px-4 py-2 bg-neutral-900 border border-white/10 hover:bg-neutral-800 text-xs font-bold text-amber-400 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer hover:border-amber-500/20"
                >
                  <span>Ver las 8 Lecciones en Principiante</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick academy info rules */}
            <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/5 flex flex-col sm:flex-row items-center gap-4.5 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-left">
                  <h5 className="text-xs font-bold text-white uppercase font-display">Acreditación Académica</h5>
                  <p className="text-[11px] text-neutral-400 leading-tight">Completa todos los contenidos del nivel para desbloquear las micro-automatizaciones nativas de Wentix AI.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-neutral-900 border border-white/10 px-3 py-1 rounded-xl">
                Cód. Wentix Academy 2026
              </span>
            </div>
          </div>
        )
      ) : (
        /* READER MODE (If a specific guide is opened) */
        <div className="animate-fade-in text-left">
          
          {/* Reader Toolbar Navigation */}
          <div className="p-4 bg-neutral-950/80 border-b border-white/5 flex items-center justify-between gap-3 text-left">
            <button
              onClick={() => setSelectedGuideId(null)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Volver a la Ruta</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <span className="uppercase text-amber-400 font-black">{activeLevel}</span>
              <span>/</span>
              <span className="text-neutral-500 truncate max-w-xs">{METADATA.find(m => m.id === selectedGuideId)?.title}</span>
            </div>

            <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-800/30 px-3 py-1 rounded-full font-mono font-bold tracking-wider uppercase">
              {METADATA.find(m => m.id === selectedGuideId)?.duration} LECTURA
            </span>
          </div>

          {/* DYNAMIC GUIDE CONTAINER */}
          <div className="p-6 md:p-10 divide-y divide-white/5">
            
            {/* 1. GUÍA: ¿QUÉ VALE LA PENA AUTOMATIZAR? */}
            {selectedGuideId === "que-automatizar" && (
              <div className="space-y-12">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-500/20 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nivel Principiante • Lección 01 de Wentix</span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    ¿Qué vale la pena automatizar? <span className="text-amber-400 italic">Primero lo haces tú, luego lo dominas, después automatizas</span>
                  </h1>
                  <p className="text-sm text-neutral-350 leading-relaxed max-w-3xl">
                    Andas como loco queriendo automatizar sin tener un proceso que lo ocupe. No puedes automatizar algo que no sabes hacer. Aquí está la regla completa, las 4 señales de que una tarea ya está lista y seis prompts maestros para que Claude te cuestione y encuentren juntos qué sí vale la pena.
                  </p>
                </div>

                <div className="space-y-6 pt-2" id="pro-la-regla">
                  <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase tracking-widest font-bold">
                    <span>01</span>
                    <span className="h-px bg-amber-500/30 w-12" />
                    <span>LA REGLA FÁCIL</span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase font-display">
                    Primero lo haces tú, luego lo dominas, después automatizas
                  </h3>

                  <p className="text-sm text-neutral-300 leading-relaxed">
                    La regla cabe en una sola línea y ordena todo lo demás: se compone de tres etapas que debes seguir religiosamente, en ese orden, sin saltarte ninguna. La automatización es un multiplicador: multiplica lo que ya haces bien. Si haces mucho y muy bien, multiplica eso. Si haces cero, multiplica cero.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-white/5 border border-white/5 rounded-2xl overflow-hidden mt-6 text-left">
                    <div className="bg-neutral-950 p-6 space-y-3 hover:bg-neutral-900/50 transition-colors">
                      <div className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase">ETAPA 1 · REGISTRAR EN SANGRE</div>
                      <h4 className="text-base font-black text-white tracking-wide font-display uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs text-amber-400">1</span>
                        Hazlo a mano
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Te mandas tus correos, haces tus cuentas, respondes a tus clientes. Sin ningún atajo: la tarea pasa por tus manos todas las veces que haga falta para conocer cada uno de sus recovecos. Un día lo notas: hay una tarea repetida que te devora dos horas al día.
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-6 space-y-3 hover:bg-neutral-900/50 transition-colors">
                      <div className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">ETAPA 2 · DOMINAR EL ARTE</div>
                      <h4 className="text-base font-black text-white tracking-wide font-display uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-400">2</span>
                        Domínalo
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        La repites hasta sabértela de memoria: qué dato va primero, qué decisión tomas exactamente a la mitad, cómo luce un resultado excelente de verdad. Podrías explicársela a cualquier persona con un lápiz en una servilleta sin pensarlo.
                      </p>
                    </div>

                    <div className="bg-neutral-950 p-6 space-y-3 hover:bg-neutral-900/50 transition-colors">
                      <div className="text-[10px] font-mono tracking-widest text-purple-400 font-bold uppercase">ETAPA 3 · LIBERAR EL PODER</div>
                      <h4 className="text-base font-black text-white tracking-wide font-display uppercase flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xs text-purple-400">3</span>
                        Automatízalo
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Cuando ya la ejecutas prácticamente con los ojos cerrados, ahí sí: se la enseñas a Claude paso a paso, tal como harías con un empleado nuevo calificado. Él se encarga de ejecutar, tú revisas el borrador, y esas dos valiosas horas diarias vuelven a ser tuyas.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border-2 border-dashed border-amber-500/30 rounded-2xl bg-amber-500/5 relative text-left">
                    <div className="absolute -top-3.5 left-4 px-2 bg-neutral-950 text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase flex items-center gap-1">
                      <span>⚙ wentix · clave de bóveda</span>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-205 leading-relaxed">
                      <strong>Y sí, aplica absolutamente aquí también:</strong> Todo lo que ves en las herramientas gratuitas de Wentix primero se procesó a mano por nosotros. Cada prompt de la academia salió de una tarea específica repetida hasta dominarla; la automatización llegó al final, nunca al principio.
                    </p>
                  </div>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
                    <span>02</span>
                    <span className="h-px bg-red-500/30 w-12" />
                    <span>EL RETO / ADVERTENCIA</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase font-display">
                    Automatizar lo que nunca has hecho es crear basura más rápido
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Si Claude te entrega el primer resultado sistematizado y no puedes juzgar de inmediato si está bien o mal hecho sin tener que consultar a nadie, <strong className="text-white">no estabas listo para automatizar esa tarea</strong>. El criterio indispensable para evaluar solo se gana haciéndola a mano.
                  </p>

                  <div className="pt-2">
                    <div className="bg-neutral-950 rounded-2xl border border-white/5 overflow-hidden">
                      <div className="bg-neutral-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider font-bold text-amber-400 text-left">
                          PROMPT MASTER #0 • EL PUNTO DE PARTIDA (PÁGINA EN BLANCO)
                        </span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.partida, "p0")}
                          className="px-3 py-1 bg-white/5 hover:bg-amber-500 hover:text-black border border-white/5 rounded-lg text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          {copiedStates["p0"] ? <Check className="w-3" /> : <Copy className="w-3" />}
                          <span>{copiedStates["p0"] ? "Copiado" : "Copiar"}</span>
                        </button>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[11px] font-mono text-neutral-400 leading-relaxed whitespace-pre bg-black/40 text-left">
                        {PROMPTS_TEXTS.partida}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">
                    <span>03</span>
                    <span className="h-px bg-cyan-500/30 w-12" />
                    <span>ALERTA DE CONTROL</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase font-display">
                    Las 4 señales de que una tarea ya está lista
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-neutral-955/60 border border-white/5 p-4 rounded-xl">
                      <span className="text-amber-400 font-mono font-bold text-xs">01. FRECUENCIA</span>
                      <p className="text-xs text-neutral-400 mt-1">La haces a diario o varias veces por semana. Tareas de una vez al mes no justifican el esfuerzo.</p>
                    </div>
                    <div className="bg-neutral-955/60 border border-white/5 p-4 rounded-xl">
                      <span className="text-amber-400 font-mono font-bold text-xs">02. TIEMPO</span>
                      <p className="text-xs text-neutral-400 mt-1">Suma cuánto te cuesta por semana. Si son solo cinco minutos sueltos, sigue a mano.</p>
                    </div>
                    <div className="bg-neutral-955/60 border border-white/5 p-4 rounded-xl">
                      <span className="text-amber-400 font-mono font-bold text-xs">03. OJOS CERRADOS</span>
                      <p className="text-xs text-neutral-400 mt-1">La repites de memoria sin dudar. Si improvisas a menudo, la IA no tendrá un patrón que seguir.</p>
                    </div>
                    <div className="bg-neutral-955/60 border border-white/5 p-4 rounded-xl">
                      <span className="text-amber-400 font-mono font-bold text-xs">04. PASOS REPETIBLES</span>
                      <p className="text-xs text-neutral-400 mt-1">Sigue el mismo camino exacto. Si cada corrida es un mundo distinto, Claude no encontrará patrones.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-widest font-bold">
                    <span>04-07</span>
                    <span className="h-px bg-purple-500/30 w-12" />
                    <span>PROMPTS LISTOS</span>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400">PROMPT 1: LA ENTREVISTA</span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.entrevista, "p1")} className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono rounded">Copia</button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-neutral-500 select-all overflow-auto max-h-32 text-left">{PROMPTS_TEXTS.entrevista}</pre>
                    </div>

                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400">PROMPT 2: EL FILTRO</span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.filtro, "p2")} className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono rounded">Copia</button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-neutral-500 select-all overflow-auto max-h-32 text-left">{PROMPTS_TEXTS.filtro}</pre>
                    </div>

                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400">PROMPT 3: EL EXTRACTOR</span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.extractor, "p3")} className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono rounded">Copia</button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-neutral-500 select-all overflow-auto max-h-32 text-left">{PROMPTS_TEXTS.extractor}</pre>
                    </div>

                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400">PROMPT 4: EL PLAN 1 A 1</span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.plan1a1, "p4")} className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono rounded">Copia</button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-neutral-500 select-all overflow-auto max-h-32 text-left">{PROMPTS_TEXTS.plan1a1}</pre>
                    </div>

                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-400">PROMPT 5: EL ESPEJO</span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.espejo, "p5")} className="px-2 py-0.5 bg-neutral-800 text-[10px] font-mono rounded">Copia</button>
                      </div>
                      <pre className="p-3 text-[10px] font-mono text-neutral-500 select-all overflow-auto max-h-32 text-left">{PROMPTS_TEXTS.espejo}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. GUÍA: SETUP DE CLAUDE EN 10 MINUTOS */}
            {selectedGuideId === "setup-claude" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 02 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Deja de usar Claude como Google: <span className="text-amber-400 italic block mt-1">configúralo en 10 minutos</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    Si usas Claude como buscador de Google, lo estás usando mal: por eso sientes que no te sirve y se te acaba la cuenta tan rápido. <strong className="text-white">Con 5 ajustes, Claude sabe quién eres, a qué te dedicas y cómo hablas</strong>: creas un proyecto que es tu cuarto de trabajo, dejas que te entreviste, le pegas el resultado, le enseñas tu tono y le pones reglas. En Wentix AI te dejamos todos los prompts listos para copiar y pegar.
                  </p>
                </div>

                {/* THE GLANCE CELL INTERACTIVE NAVIGATION BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("set-sec-prob")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full animate-fade-in"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">00 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El problema real</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("set-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full animate-fade-in"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">1. Cuarto de trabajo</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("set-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full animate-fade-in"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">2. Auto-entrevista</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("set-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full animate-fade-in"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">3. Instrucciones fijas</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("set-sec-04-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full animate-fade-in"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04/05 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">4/5. Tono &amp; Reglas</span>
                  </button>
                </div>

                {/* THE PILL NAVIGATION LINKS SHORTCUTS */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button onClick={() => document.getElementById("set-sec-prob")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">el problema</button>
                  <button onClick={() => document.getElementById("set-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">1. proyecto</button>
                  <button onClick={() => document.getElementById("set-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">2. entrevista</button>
                  <button onClick={() => document.getElementById("set-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">3. instrucciones</button>
                  <button onClick={() => document.getElementById("set-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">4. tu tono</button>
                  <button onClick={() => document.getElementById("set-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">5. reglas</button>
                  <button onClick={() => document.getElementById("set-sec-faq")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition">faq</button>
                </div>

                {/* SECTION 00: EL PROBLEMA */}
                <div id="set-sec-prob" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">00</strong> • El Problema
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Usas Claude como Google y por eso se te acaba la cuenta
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    El error más común es abrir un chat en blanco cada vez, escribir una pregunta suelta y cerrar. Así Claude nunca sabe quién eres: le repites tu contexto una y otra vez, gastas mensajes en ponerlo al día y aun así te entiende a medias. Sientes que &ldquo;no te sirve&rdquo;, cuando en realidad nunca le diste con quién está hablando.
                  </p>
                  <p className="text-xs md:text-sm text-neutral-305 leading-relaxed">
                    Configurarlo bien cambia eso de raíz. En lugar de empezar de cero cada vez, Claude <strong className="text-amber-400 font-mono text-xs">recuerda</strong> quién eres, a qué te dedicas, cómo hablas y qué no quieres que haga. Las respuestas salen más a tu medida desde el primer mensaje y dejas de quemar la cuenta repitiéndote.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className="p-5 bg-neutral-900/10 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-neutral-500 font-mono tracking-widest text-[9px] font-bold block uppercase">Chat nuevo cada vez, en blanco</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Le repites quién eres una y otra vez, y aun así te entiende a medias.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/15 border border-amber-500/20 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Un proyecto que te conoce</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Arranca sabiendo a qué te dedicas, cómo hablas y qué buscas. No repites nada.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-450 leading-relaxed italic">
                    Lo bueno: configurarlo te toma unos 10 minutos y se hace una sola vez. Aquí van los 5 pasos, con su prompt listo para copiar y pegar.
                  </p>
                </div>

                {/* SECTION 01: PASO 1 */}
                <div id="set-sec-01" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El Cuarto de Trabajo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Crea un proyecto: tu cuarto de trabajo
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Deja de abrir un chat nuevo cada vez que quieras hablar con Claude. En su lugar, crea un <strong className="text-amber-405 font-mono text-xs font-bold">proyecto</strong>. Piénsalo como tu cuarto de trabajo: ahí adentro le metes archivos, textos, PDFs y todo lo que quieras que recuerde de ti, y ya no andas repitiéndole las mismas cosas en cada conversación.
                  </p>

                  <div className="p-5 bg-neutral-900/10 border border-white/5 rounded-2xl space-y-4 text-left">
                    <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                      <span className="font-mono text-amber-500 text-xs font-bold border border-amber-500/30 rounded px-2 py-0.5">Abre</span>
                      <div className="space-y-0.5">
                        <strong className="text-xs text-white uppercase tracking-wider block font-display">Ingresa a la plataforma</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">Entra a Claude.ai y, en el menú de la izquierda, busca &ldquo;Proyectos&rdquo;.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                      <span className="font-mono text-amber-500 text-xs font-bold border border-amber-500/30 rounded px-2 py-0.5">Crea</span>
                      <div className="space-y-0.5">
                        <strong className="text-xs text-white uppercase tracking-wider block font-display">Proyecto Nuevo</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">Dale a &ldquo;Proyecto nuevo&rdquo;, ponle un nombre y una descripción corta de para qué es.</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <span className="font-mono text-amber-500 text-xs font-bold border border-amber-500/30 rounded px-2 py-0.5">Llénalo</span>
                      <div className="space-y-0.5">
                        <strong className="text-xs text-white uppercase tracking-wider block font-display">Carga memorias</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">Sube los archivos, textos o PDFs que quieras que Claude tenga siempre a la mano: tu marca, tu producto, ejemplos de tu trabajo, lo que sea.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Clave</span>
                    <p className="text-xs text-neutral-305 leading-relaxed m-0">
                      <strong>Todo lo que vive dentro del proyecto, Claude lo toma en cuenta en cada chat que abras ahí adentro.</strong> Cada conversación parte del mismo contexto, sin que tú lo cargues de nuevo.
                    </p>
                  </div>
                </div>

                {/* SECTION 02: PASO 2 */}
                <div id="set-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • Tu Identidad
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Deja que te entreviste
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Ahora deja que Claude te conozca. En lugar de escribirle un testamento sobre ti, pídele que te <strong className="text-amber-400 font-mono text-xs">entreviste</strong>: que te haga preguntas, una por una, para entender de verdad quién eres, a qué te dedicas y cómo hablas. Copia el prompt, pégalo en un chat dentro de tu proyecto y contesta como si platicaras.
                  </p>

                  <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                    <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Prompt de la entrevista
                      </span>
                      <button onClick={() => handleCopy(PROMPTS_TEXTS.entrevistaSetup, "pSetEnt")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                        {copiedStates["pSetEnt"] ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all">{PROMPTS_TEXTS.entrevistaSetup}</pre>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">El truco de voz</span>
                    <p className="text-xs text-neutral-305 leading-relaxed m-0">
                      <strong>El truco: contéstale por voz.</strong> Pícale al botón de voz y, en vez de teclear, dicta tus respuestas como un pódcast de 10 a 15 minutos sobre ti. Hablando sueltas mucho más contexto que escribiendo, y Claude te conoce mejor en menos tiempo.
                    </p>
                  </div>
                </div>

                {/* SECTION 03: PASO 3 */}
                <div id="set-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • Durabilidad
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Pega el resultado en las instrucciones
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Todo lo que salió de la entrevista no lo dejes tirado en el chat. Pídele a Claude que lo resuma en un bloque limpio de instrucciones y pégalo donde lo va a leer siempre. Este prompt convierte la plática en una ficha corta y ordenada, sin relleno.
                  </p>

                  <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                    <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Prompt para limpiar el resultado
                      </span>
                      <button onClick={() => handleCopy(PROMPTS_TEXTS.limpiaSetup, "pSetLim")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                        {copiedStates["pSetLim"] ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all">{PROMPTS_TEXTS.limpiaSetup}</pre>
                  </div>

                  <strong className="text-xs font-bold text-white uppercase font-mono tracking-widest text-amber-400 block pt-2">¿Dónde lo pegas?</strong>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-mono">Instrucciones del proyecto</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Si ese contexto es solo para un tema o cliente. Aplica únicamente en los chats de ese proyecto.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-mono">Preferencias / ajustes generales</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Si quieres que Claude te trate igual en cualquier chat, estés o no en un proyecto. Aplica en todo.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-450 leading-relaxed italic">
                    Si Claude es tu asistente de cabecera para todo, pégalo en tus preferencias generales y olvídate: no importa qué chat abras, siempre seguirá esas reglas.
                  </p>
                </div>

                {/* AREA FOR STEP 4 & 5 ANCHOR */}
                <div id="set-sec-04-05" className="scroll-mt-24 inline-block h-0 w-0" />

                {/* SECTION 04: PASO 4 */}
                <div id="set-sec-04" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Tu Voz
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Dale 5 ejemplos de cómo escribes tú
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Si quieres que Claude redacte por ti y no suene a robot, enséñale tu voz. Junta <strong className="text-amber-400 font-mono text-xs font-bold">5 ejemplos de cosas que tú has escrito</strong> &mdash;posts, correos, mensajes de WhatsApp, lo que tengas a la mano&mdash; y pídele que los lea y aprenda cómo escribes. Con eso ya replica tu estilo en lugar del tono genérico de siempre.
                  </p>

                  <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                    <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Prompt para que aprenda tu tono
                      </span>
                      <button onClick={() => handleCopy(PROMPTS_TEXTS.estiloTono, "pSetTono")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                        {copiedStates["pSetTono"] ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all">{PROMPTS_TEXTS.estiloTono}</pre>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Variedad de ejemplos</span>
                    <p className="text-xs text-neutral-305 leading-relaxed m-0">
                      Entre más variados los ejemplos, mejor: uno formal, uno relajado, uno corto, uno largo. Así Claude entiende cómo cambias el tono según el momento, no solo una versión de ti. Cuando te devuelva tu guía de estilo, copia ese resumen y pégalo junto a tus instrucciones (en el proyecto o en tus preferencias) para que no se le olvide en el próximo chat.
                    </p>
                  </div>
                </div>

                {/* SECTION 05: PASO 5 */}
                <div id="set-sec-05" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">05</strong> • Límites
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Ponle reglas de lo que NO quieres que haga
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-305 leading-relaxed">
                    Esta es la que casi nadie usa y la que más se nota. Además de decirle qué quieres, dile <strong className="text-amber-400 font-mono text-xs font-bold">qué no quieres</strong>: que no se enrolle, que no mande relleno, que no te suelte avisos legales ni textos que nunca le pediste. Es ponerle el alto para que deje de darte vueltas.
                  </p>

                  <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                    <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Bloque de reglas (pégalo tal cual)
                      </span>
                      <button onClick={() => handleCopy(PROMPTS_TEXTS.noQuieresSetup, "pSetNo")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                        {copiedStates["pSetNo"] ? "¡Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all">{PROMPTS_TEXTS.noQuieresSetup}</pre>
                  </div>

                  <div className="p-5 bg-neutral-900/10 border border-white/5 rounded-2xl text-left space-y-2">
                    <span className="font-mono text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Pautas rápidas</span>
                    <ul className="text-xs text-neutral-400 space-y-2 list-inside list-disc">
                      <li>Pégalo tal cual junto a tus instrucciones, en el proyecto o en tus preferencias.</li>
                      <li>Quítale o agrégale reglas según lo que a ti te choque.</li>
                      <li>Con esto cierras la configuración: en 10 minutos Claude pasó de buscador genérico a un asistente que sabe quién eres y cómo te gusta que te hablen.</li>
                    </ul>
                  </div>
                </div>

                {/* SECTION 06: PREGUNTAS FRECUENTES */}
                <div id="set-sec-faq" className="space-y-6 pt-4 border-t border-white/10 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">06</strong> • Dudas comunes
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Preguntas frecuentes
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Lo pego en el proyecto o en las preferencias generales?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        En el proyecto si ese contexto es solo para un tema o cliente. En tus preferencias generales si quieres que aplique en todos tus chats, estés o no dentro de un proyecto. Puedes usar los dos a la vez.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Esto es lo mismo que Claude Code?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        No. Aquí hablamos del chat de Claude.ai, con Proyectos y preferencias. Claude Code es la versión de terminal que lee y edita tu código; esa se configura distinto.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Sirve si tengo el plan gratis?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        Los Proyectos y las preferencias están pensados para que cualquiera los use. La función de dictado por voz depende de la app o dispositivo que tengas; si no la ves, escribe la entrevista a mano y funciona igual.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Cada cuánto debo actualizarlo?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        Cuando cambien tus metas, tu proyecto o tu forma de trabajar. Vuelve a entrevistarte de vez en cuando y repega las instrucciones; a Claude le sirve tenerte al día.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Y si trabajo en varias cosas muy distintas?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        Crea un proyecto por cada tema o cliente, cada uno con su propio contexto. Lo general (cómo hablas, tus reglas) déjalo en las preferencias para que aplique en todos.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl text-left space-y-4 pt-6">
                    <strong className="text-sm font-bold text-white uppercase font-display block">Cierre de la guía</strong>
                    <p className="text-xs text-neutral-405 leading-relaxed">
                      Claude no es un buscador: es un asistente que se vuelve útil cuando sabe con quién habla. Un proyecto que te conoce, una entrevista, tus instrucciones, tu tono y tus reglas. Diez minutos una sola vez y cada conversación arranca entendiéndote.
                    </p>
                    <a 
                      href="https://claude.ai" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Abre Claude.ai y configúralo ahora</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 3. GUÍA: OPTIMIZACIÓN CON FEEDBACK LOOP */}
            {selectedGuideId === "feedback-loop" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 03 de Wentix • Nivel Intermedio</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Feedback loop: haz que tus prompts y skills <span className="text-amber-400 italic block mt-1">se mejoren solos</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    ¿Llevas 50 veces corriendo el mismo prompt y siempre te da lo mismo? No eres tú. Es que tu prompt no se está corrigiendo. Aquí montas un <strong className="text-white font-semibold">feedback loop</strong>: una sección de auto-auditoría que pegas al final de cualquier prompt, skill o flujo para que Claude te diga qué salió bien, qué salió más o menos y qué cambiar para la próxima.
                  </p>
                </div>

                {/* THE 4 GLANCE CELLS (INTERACTIVE NAVIGATION BUTTONS) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("fl-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-955/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Por qué tu prompt se quedó estancado</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fl-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-955/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Qué es y cómo funciona la idea</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fl-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-955/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El bloque copy-paste de auto-auditoría</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fl-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-955/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Leerlo, aplicarlo y automatizarlo</span>
                  </button>
                </div>

                {/* SECTION 1: EL SÍNTOMA */}
                <div id="fl-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El síntoma
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Tu prompt no está mal: está estancado
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Llevas 50 veces corriendo el mismo prompt, diciéndole lo mismo y teniendo los mismos resultados. No eres tú. Es que lo usaste una vez, pensaste «esto ya quedó bien» y nunca más lo tocaste. Y un prompt que no se corrige siempre te va a dar lo mismo —correr la misma instrucción esperando un resultado distinto no funciona—.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Estancamiento del resultado</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Le das el mismo prompt una y otra vez y el resultado casi no cambia. No evoluciona.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Correcciones manuales repetitivas</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Cada vez tienes que corregir lo mismo a mano: el tono, el formato, o ciertos detalles que siempre se le olvidan.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">La trampa del prompt "perfecto"</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Sientes que el prompt ya está bien hecho, así que no lo tocas, y por eso se quedó congelado en el tiempo.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Clave</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>La buena noticia:</strong> arreglarlo está fácil y no necesitas saber programar. Le metes un feedback loop al mismo prompt y deja que se corrija solo. En dos semanas siguiendo el flujo, ese prompt que hoy no te da lo que quieres te va a dar algo diez veces mejor.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: LA IDEA */}
                <div id="fl-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • La idea
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Qué es un feedback loop (y por qué se arregla solo)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Un feedback loop es una sección de <strong>auto-auditoría</strong> que le pegas al final de cualquier prompt, skill o trabajo. Cuando Claude termina la tarea, en vez de cerrar nada más, se revisa a sí mismo y te devuelve tres cosas: lo que salió bien, lo que salió más o menos y qué cambiar en el prompt para que la próxima corrida salga mejor.
                  </p>

                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                    Tú lees lo que te dijo, te quedas con lo que sirve, actualizas tu prompt o tu skill, y vuelves a correr. Cada vuelta lo deja un poco mejor. El trabajo de pensar qué falló lo hace Claude; tú solo decides qué cambios entran.
                  </p>

                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Funciona igual sin importar cómo uses Claude:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">Claude · Chat de la web</span>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Lo pegas al final de tu mensaje y listo. Claude te responde con la tarea y la auditoría juntas al final.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">Cowork (proyectos conjuntos)</span>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Al cerrar la tarea o el documento, pides la auditoría antes de dar por terminado el trabajo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">Claude Code (consola)</span>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Va al final del prompt, de la skill o del comando que ya tengas armado. Sin cambios en tu flujo.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: EL BLOQUE COPY-PASTE */}
                <div id="fl-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • El bloque copy-paste
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El bloque de auto-auditoría que pegas al final
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Lo copias y lo pegas <strong>al final</strong> de tu prompt o tu skill —después de tus instrucciones de siempre—. Cuando Claude termine, te va a devolver una sección «Auto-auditoría» con tres apartados:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-emerald-400 font-mono tracking-widest text-[9px] font-bold block uppercase">✅ Qué salió bien</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Lo que sí funcionó. Te sirve para no romper lo que ya jala cuando edites el prompt.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">🟡 Qué salió más o menos</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Dónde dudó, le faltó contexto o quedó a medias. Aquí están las pistas de qué arreglar.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">🔧 Qué cambiar en el prompt</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        El texto exacto que agregaría o quitaría para la próxima. Esto es lo que vas a aplicar.
                      </p>
                    </div>
                  </div>

                  {/* BLOQUE MAESTRO COPY BOX */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Bloque maestro · Pégalo al final de cualquier prompt</h4>
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Bloque completo · Copy-paste
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.autoAuditoria, "flCp1")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["flCp1"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre select-all font-mono">{PROMPTS_TEXTS.autoAuditoria}</pre>
                    </div>
                  </div>

                  {/* MINI VERSION COPY BOX */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Versión corta · Una línea</h4>
                    <p className="text-xs text-neutral-500 italic">Cuando no quieres pegar todo el bloque. Pierdes algo de detalle, pero arrancas el loop hoy mismo.</p>
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Versión rápida
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.copiaRapida, "flCp2")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["flCp2"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre select-all font-mono">{PROMPTS_TEXTS.copiaRapida}</pre>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: CÓMO APLICARLO */}
                <div id="fl-sec-04" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Cómo aplicarlo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Lee, filtra y mejora tu prompt
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    La auto-auditoría no sirve absolutamente de nada si solo la lees y la dejas ahí. El feedback loop se cierra por completo únicamente cuando te decides a <strong>aplicar</strong> de forma activa lo que te sirve. Sigue estos tres pasos, cada vez:
                  </p>

                  {/* STEPS LIST */}
                  <div className="space-y-4">
                    <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-amber-500 text-xs text-amber-400 font-mono font-bold">1</span>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight">Lee sin tragártelo todo</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                          Claude no siempre tiene la razón. Quédate únicamente con lo que de verdad mejora el resultado esperado de forma lógica y descarta el resto. El control y criterio final de cambio siempre es tuyo.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">2</span>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight">Aplica el cambio al prompt</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                          Edita el texto del prompt, la skill o tu flujo general con las sugerencias que pasaron con éxito tu filtro. Agrega o cambia una o dos cosas por vuelta como máximo.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">3</span>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight">Vuelve a correr el prompt</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed mt-1">
                          Corre el prompt ya editado en un chat nuevo y observa las diferencias de salida. Si mejoró en el sentido correcto, lo dejas; en caso contrario, ajustas la regla.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 italic">
                    Si no quieres realizar estas ediciones a mano, por supuesto que puedes delegar eso y dejar que Claude haga el trabajo de actualizar tu prompt de forma directa.
                  </p>

                  {/* META-PROMPT COPY BOX */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Meta-prompt · Actualiza el prompt por ti de un jalón</h4>
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Meta-prompt para actualización
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.metaPromptMeta, "flCp3")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["flCp3"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre select-all font-mono">{PROMPTS_TEXTS.metaPromptMeta}</pre>
                    </div>
                  </div>

                  {/* SUBSECTION: VARIANTE PARA SKILLS/FLUJOS */}
                  <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Variantes para Skills y Flujos Largos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* VARIANT 1: SKILLS */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block">Variante • Skills en archivos locales</span>
                        <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                          <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] tracking-wider text-amber-400 font-bold uppercase font-mono">Diff al SKILL.MD</span>
                            <button onClick={() => handleCopy(PROMPTS_TEXTS.diffSkill, "flCp4")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                              {copiedStates["flCp4"] ? "✓ Copiado" : "Copiar"}
                            </button>
                          </div>
                          <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.diffSkill}</pre>
                        </div>
                      </div>

                      {/* VARIANT 2: FLUJOS LARGOS */}
                      <div className="space-y-2">
                        <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block">Variante • Flujos largos de varios pasos</span>
                        <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                          <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] tracking-wider text-amber-400 font-bold uppercase font-mono">Análisis de Atoro de Flujo</span>
                            <button 
                              onClick={() => handleCopy(
                                `Este fue un flujo de varios pasos. Al terminar, dime: en qué paso se atoró o se fue por las ramas, qué paso sobró, qué paso faltó, y cómo reordenarías o reescribirías las instrucciones para que el flujo completo corra más limpio la próxima vez.`, 
                                "flCp5"
                              )} 
                              className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition"
                            >
                              {copiedStates["flCp5"] ? "✓ Copiado" : "Copiar"}
                            </button>
                          </div>
                          <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-36 leading-relaxed whitespace-pre-wrap">{`Este fue un flujo de varios pasos. Al terminar,
dime: en qué paso se atoró o se fue por las
ramas, qué paso sobró, qué paso faltó, y cómo
reordenarías o reescribirías las instrucciones
para que el flujo completo corra más limpio la
próxima vez.`}</pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: EL SEGUIMIENTO */}
                <div id="fl-sec-05" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">05</strong> • El seguimiento
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      La cadencia: de bueno a 10× en dos semanas
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    El feedback loop no es algo de una sola vez; es un hábito recurrente. Cada corrida te deja una pista valiosa, y la mejora real se da con la acumulación estructurada de aprendizajes. Grábate a fuego esta constante de Wentix AI: <strong>persigue el patrón, no el accidente de una sola vez</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">1. Una sola mejora a la vez</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        No intentes incorporar las tres recomendaciones de la auto-auditoría juntas. Cambia una sola regla o línea y mide el cambio. Así sabrás qué jalonó positivamente.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">2. Guarda tus auto-auditorías</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Copia las respuestas de auto-auditoría en una nota o archivo de texto. Al cabo de los días verás con total claridad qué problemas se repiten.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">3. Ataca lo que se repite</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Si una advertencia vaga o error técnico aparece 3 veces seguidas, es tu prioridad de corrección. Si un tema falló una sola vez, déjalo pasar: es ruido.
                      </p>
                    </div>
                  </div>

                  {/* WEEKLY CONSOLIDATION COPY BOX */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Consolidación semanal al final del ciclo</h4>
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Junta y consolida la semana
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.consolidacionSemanal, "flCp6")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["flCp6"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-450 overflow-x-auto max-h-48 leading-relaxed whitespace-pre select-all font-mono">{PROMPTS_TEXTS.consolidacionSemanal}</pre>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-cyan-500/35 bg-cyan-950/10 rounded-2xl text-left">
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>El resultado acumulado:</strong> dos semanas de vueltas cortas y ese prompt, skill o flujo que hoy te frustra resulta en algo diez veces superior —sin que tú te rompas la cabeza pensando qué falló en cada conversación—.
                    </p>
                  </div>
                </div>

                {/* SECTION 6: AUTOMATÍZALO CON LA SKILL APRENDE */}
                <div id="fl-sec-06" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">06</strong> • Ponlo en automático
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Automatízalo con la skill Aprende
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Hacer este loop a mano funciona a la perfección. Pero si quieres que Claude <strong>aprenda de sus errores constantemente</strong> sin que tú tengas que pegar bloques en cada chat, hay una skill de código abierto diseñada justamente para eso: <a href="https://www.tododeia.com/community/aprende-skill" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline font-bold">Aprende</a>. Es, básicamente, este feedback loop puesto completamente en piloto automático.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="font-mono text-amber-400 text-[10px] font-bold block uppercase">Cómo funciona en tu consola</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        En lugar de pedir la auto-auditoría escribiendo de forma manual, ejecutas <code className="text-white text-xs font-mono">/aprende</code> al final de la sesión en Claude Code: revisa toda la conversación, extrae las lecciones técnicas, te las muestra en una lista compacta y, solo con tu visto bueno, las guarda en la memoria de tu carpeta.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="font-mono text-amber-400 text-[10px] font-bold block uppercase">Siempre con tu visto bueno</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Lo aprendido hoy no se le olvida a Claude mañana. Nada se escribe sin tu aprobación expresa: tú confirmas qué lecciones entran al archivo y cuáles descartas por ser ruido temporal. El control sigue siendo tuyo.
                      </p>
                    </div>
                  </div>

                  {/* SKILL COMMAND INSTALL COPIER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1 grow">
                      <code className="text-amber-400 select-all font-bold font-mono text-[11px] block break-all">/plugin marketplace add Hainrixz/aprende-skill</code>
                      <p className="text-[10px] text-neutral-500 leading-normal">Comando de terminal para instalar la skill de auto-aprendizaje en Claude Code.</p>
                    </div>
                    <button 
                      onClick={() => handleCopy("/plugin marketplace add Hainrixz/aprende-skill", "flInstallBtn")} 
                      className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                    >
                      {copiedStates["flInstallBtn"] ? "✓ Copiado" : "Copiar"}
                    </button>
                  </div>

                  <div className="p-4 bg-neutral-900/30 rounded-xl border border-white/5 text-xs text-neutral-400 flex items-start gap-2.5">
                    <Wrench className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold text-amber-400 uppercase text-[9px] block mb-0.5 font-bold">Open-source · MIT · 30 segundos</span>
                      El código de la skill es 100% libre, abierto y sin dependencias externas ocultas. Puedes auditarlo directamente en <a href="https://github.com/Hainrixz/aprende-skill" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">github.com/Hainrixz/aprende-skill</a>.
                    </div>
                  </div>
                </div>

                {/* SECTION 7: DUDAS RÁPIDAS (PREGUNTAS FRECUENTES) */}
                <div id="fl-sec-faq" className="space-y-6 pt-4 border-t border-white/10 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">07</strong> • Dudas rápidas
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Preguntas frecuentes
                    </h3>
                  </div>

                  {/* FAQ LIST */}
                  <div className="space-y-4 text-xs font-sans">
                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Sirve realmente si no sé programar?</h5>
                      <p className="text-neutral-400 leading-relaxed text-[11px]">
                        Sí, por supuesto. Pegas el bloque maestro de texto al final de tu prompt y de inmediato funciona en el chat de Claude. No requieres conocimientos de programación de ningún tipo para ver los resultados hoy.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿No me va a regalar halagos Claude en vez de criticarse de verdad?</h5>
                      <p className="text-neutral-405 leading-relaxed text-[11px]">
                        Por eso el bloque incluye reglas explícitas exigiéndole que sea honesto y no te adule de forma innecesaria. Aun así, tú tienes el filtro final: si ves que una crítica no tiene sentido, la descartas sin más. El control es de criterio propio.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Cada cuánto conviene aplicar las mejoras sugeridas?</h5>
                      <p className="text-neutral-405 leading-relaxed text-[11px]">
                        Una sola mejora por vuelta. Cambia un detalle, corre el prompt en una ventana limpia y analiza si mejoró de forma deseable. Si cambias tres de golpe, no sabrás cuál sirvió de verdad. Deja la consolidación fuerte para el final de la semana.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Y si Claude se equivoca al hacer su propia auto-auditoría?</h5>
                      <p className="text-neutral-405 leading-relaxed text-[11px]">
                        Pasa a veces, y está perfectamente contemplado. La auditoría es una sugerencia técnica, no una orden inflexible. Tú tienes la última palabra. Persigue solo aquellos temas o problemas que veas repetirse en varias conversaciones seguidas.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿En qué se diferencia esto de la skill de consola Aprende?</h5>
                      <p className="text-neutral-405 leading-relaxed text-[11px]">
                        Es el mismo principio, pero a mano. Con el feedback loop pones tú el bloque maestro de forma manual. La skill Aprende automatiza la extracción y almacenamiento del aprendizaje con el comando <code className="text-white">/aprende</code> al cerrar tu sesión de forma automática.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 8: CIERRE Y RECURSOS */}
                <div id="fl-sec-cierre" className="space-y-6 pt-4 border-t border-white/10 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">08</strong> • Cierre
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      ¿Por dónde empezar hoy?
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    No esperes a diseñar el prompt perfecto y definitivo en tu cabeza. Abre la conversación, el flujo o la skill que más trabajo te esté costando dominar, pega el bloque de auto-auditoría hasta el final y ponlo a correr. Lee los tres puntos que te devuelva, aplica un solo cambio, y repite. En dos semanas notarás un salto abismal en tus resultados habituales.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs pt-4">
                    <button 
                      onClick={() => document.getElementById("fl-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="p-4 bg-neutral-900/40 hover:bg-amber-955/20 border border-white/5 rounded-xl block transition-all hover:-translate-y-0.5 cursor-pointer text-left w-full focus:outline-none"
                    >
                      <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block">Volver Arriba</span>
                      <strong className="text-xs font-bold text-white block mt-1 font-display">El bloque maestro</strong>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 leading-relaxed">Ve al bloque maestro de prompt y copia la versión de una sola línea de jalón.</span>
                    </button>

                    <a 
                      href="https://www.tododeia.com/community/aprende-skill" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-4 bg-neutral-900/40 hover:bg-amber-955/20 border border-white/5 rounded-xl block transition-all hover:-translate-y-0.5 cursor-pointer text-left"
                    >
                      <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block">Skill automática</span>
                      <strong className="text-xs font-bold text-white block mt-1 font-display">Aprende · Automatizado</strong>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 leading-relaxed font-sans">La skill que captura, resume y guarda los aprendizajes técnicos de tu proyecto de forma automática.</span>
                    </a>

                    <a 
                      href="https://www.tododeia.com/community/guia-claude-opus-48" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-4 bg-neutral-900/40 hover:bg-amber-955/20 border border-white/5 rounded-xl block transition-all hover:-translate-y-0.5 cursor-pointer text-left"
                    >
                      <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block">Lectura relacionada</span>
                      <strong className="text-xs font-bold text-white block mt-1 font-display">Guía completa de Opus 4.8</strong>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 leading-relaxed font-sans">El effort control y la renovada honestidad técnica del modelo hacen que su auto-auditoría sea mucho más sincera.</span>
                    </a>
                  </div>

                  <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl text-left space-y-4 pt-6">
                    <strong className="text-sm font-bold text-white uppercase font-display block">Fuentes oficiales</strong>
                    <a 
                      href="https://www.tododeia.com/community/feedback-loop-claude" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition block"
                    >
                      <span>Post original de la guía en TodoDeIA</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 4. GUÍA: POR QUÉ CLAUDE SE VUELVE TONTO */}
            {selectedGuideId === "claude-tonto" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 04 de Wentix • Nivel Intermedio</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Por qué Claude se vuelve tonto a media conversación <span className="text-amber-400 italic block mt-1">y cómo recuperarlo</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    Le das reglas claras al inicio y al rato hace justo lo que le dijiste que no hiciera. No te estás volviendo loco: <strong className="text-white font-semibold">mientras más larga es la conversación, más se le satura la memoria y más te ignora</strong>. En Wentix AI te dejamos el sistema completo para cacharlo en el momento y liberar su memoria sin perder el hilo —en el chat y en Claude Code—.
                  </p>
                </div>

                {/* THE 4 GLANCE CELLS (INTERACTIVE NAVIGATION BUTTONS) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("tonto-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Por qué se vuelve tonto (context rot)</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("tonto-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El truco del nombre: la señal</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("tonto-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">/context, /compact, /clear</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("tonto-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">CLAUDE.md y /rewind: pro</span>
                  </button>
                </div>

                {/* SECTION 1: POR QUE SE VUELVE TONTO */}
                <div id="tonto-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El problema
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      No es que se haga menos listo: es que la conversación se llena
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Piensa en su memoria como el escritorio donde Claude trabaja. Al inicio está despejado y tu nota importante se ve clarísima. Pero cada mensaje deja papeles encima —preguntas, respuestas, archivos— y al rato tu nota sigue ahí, pero quedó sepultada. Por eso deja de hacerte caso: no la borró, ya no la encuentra entre tanto.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Su memoria es finita</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Cada conversación cabe en una ventana de cierto tamaño. No importa el modelo: tarde o temprano se llena. Y mientras más cosas hay dentro, más le cuesta darle peso a cada una.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Lleno no es desordenado</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        La trampa es que la calidad empieza a caer mucho antes de que la memoria esté llena. Un contexto a medias pero revuelto ya lo confunde: es la diferencia entre un cajón vacío y uno hecho un desastre.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Foco no lineal</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Los LLMs prestan más atención al principio y al final de lo que leen; lo de en medio se va perdiendo. Tu regla del primer mensaje, conforme crece el chat, se desplaza hacia ese medio olvidado.
                      </p>
                    </div>
                  </div>

                  {/* VISUAL METER */}
                  <div className="space-y-2 bg-neutral-950 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between font-mono text-[10px] text-neutral-400">
                      <span className="font-bold flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> MEDICIÓN CONTEXT ROT</span>
                      <span className="text-amber-400 font-bold uppercase">75% CARGADO (ALERTA DE DESCOORDINACIÓN)</span>
                    </div>
                    <div className="w-full bg-neutral-900 rounded-full h-5 overflow-hidden border border-white/5 relative flex items-center">
                      <div className="bg-gradient-to-r from-amber-600/30 via-amber-500 to-amber-400 h-full rounded-full transition-all duration-500" style={{ width: "75%" }} />
                      <span className="absolute left-4 text-[9px] font-mono text-white font-extrabold uppercase tracking-widest">75% • Escritorio Mental Saturado</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                      <span>0% · Escritorio despejado</span>
                      <span className="text-amber-400 font-bold">70-80% · ¡HORA DE ORDENAR!</span>
                      <span>100% · Saturación total</span>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Clave</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>La clave que casi nadie te dice:</strong> el problema no es solo que la memoria se llene. Es que se <strong className="text-white font-semibold">ensucia</strong>. Mucho antes de tocar el tope, una conversación larga y revuelta ya hace que Claude recuerde peor, aunque tus instrucciones técnicamente sigan ahí dentro. 
                      <span className="block mt-2">Esto tiene nombre: la investigación lo llama <strong className="text-neutral-200">"context rot"</strong> y lo midió en decenas de modelos, mostrando que la calidad de razonamiento baja conforme crece el texto de entrada. La propia Anthropic construyó herramientas (como compactar y CLAUDE.md) justo para esto.</span>
                    </p>
                  </div>
                </div>

                {/* SECTION 2: EL TRUCO DEL NOMBRE */}
                <div id="tonto-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • La Señal
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El truco del nombre: cáchalo en el momento
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    El problema más traicionero es que no avisa: Claude empieza a ignorarte poco a poco y ni cuenta te das. Este truco le pone una alarma a esa caída, y es de lo más simple y visible que vas a leer hoy.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1 grow">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all font-bold font-mono text-xs">Empieza tu respuesta diciéndome my_name: [tu nombre].</code>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1 py-0.5 rounded uppercase">La Alarma</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">Pega esta regla clave como primer mensaje. Si en un mensaje posterior la omite, es tu señal de purga física.</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(`Empieza tu respuesta diciéndome my_name: [tu nombre].`, "tcN1")} 
                      className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase"
                    >
                      {copiedStates["tcN1"] ? "✓ Copiado" : "Copiar"}
                    </button>
                  </div>

                  {/* STEP BY STEP STEPS */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">El proceso alarma paso a paso:</h4>
                    <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-amber-500 text-xs text-amber-400 font-mono font-bold">1</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Pégala hasta arriba</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                          Al abrir tu chat —o en tu archivo CLAUDE.md si usas Claude Code— pon una línea limpia hasta arriba: "Empieza tu respuesta diciéndome [Nombre]".
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">2</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Observa cada respuesta</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                          Desde ahí, cada respuesta de Claude va a arrancar obligatoriamente diciendo tu nombre. Así de simple y visual.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">3</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Trabaja normal</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                          Mientras siga escribiendo tu nombre al comienzo de cada interacción, las reglas que le diste al inicio siguen activas y dominando el hito conversacional.
                        </p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-amber-500 text-xs text-amber-400 font-mono font-bold">4</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">La omisión es la señal</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                          Si en un mensaje largo Claude omite decir tu nombre, <strong className="text-amber-400">esa es tu alarma visual</strong>: el contexto del chat se saturó, tu regla original fue expulsada del foco útil y es momento de limpiar.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/30 rounded-xl border border-white/5 text-xs text-neutral-400">
                    <span className="font-bold text-neutral-305 block mb-1">Nota honesta:</span>
                    Este truco es una alarma visual práctica, no un diagnóstico analítico físico. Te avisa de la caída de una regla, pero no mide porcentajes. Para medir de verdad, usa el comando nativo de terminal <code className="text-amber-400 font-mono">/context</code>.
                  </div>
                </div>

                {/* SECTION 3: /CONTEXT, /COMPACT, /CLEAR */}
                <div id="tonto-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • Cómo Limpiar
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Liberando la memoria: en la Web y en Claude Code
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Dependiendo de dónde estés operando, tienes controles diferentes para desinfectar el contexto y recuperar el máximo rendimiento.
                  </p>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Opción A: Si trabajas en claude.ai (Chat Web / App básica)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <span className="text-emerald-400 font-mono text-[9px] font-bold block uppercase">Borrón completo</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Abre una conversación nueva</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          La forma básica. Si ya conseguiste lo que querías para un módulo y vas a saltar a otro, no arrastres la basura del anterior. Abre un chat limpio: piensa 3 veces mejor.
                        </p>
                      </div>

                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <span className="text-emerald-400 font-mono text-[9px] font-bold block uppercase">Flujo continuo</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Usa un resumen de traspaso</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Si vas a la mitad de algo complejo, pídele a Claude un resumen de traspaso de status y pégalo como mensaje número uno de un chat nuevo. Te llevas el cerebro fresco de regreso.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Opción B: Los comandos de Claude Code (Terminal)</h4>
                    <p className="text-xs text-neutral-400">
                      Si usas Claude Code, tienes comandos especializados para auditar y manipular la memoria sobre la marcha sin arrancar de cero:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <code className="text-amber-400 font-mono text-xs font-bold">/context</code>
                        <h4 className="text-xs font-bold text-white uppercase mt-1 font-display leading-tight">La Auditoría</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Te entrega un desglose exacto de los tokens del sistema, indicándote cuánta memoria están chupando tus archivos cargados, el historial y las herramientas de ejecución.
                        </p>
                      </div>

                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <code className="text-amber-400 font-mono text-xs font-bold">/compact</code>
                        <h4 className="text-xs font-bold text-white uppercase mt-1 font-display leading-tight">La compactación limpia</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Claude resume los chats anteriores en una versión ultra-corta, eliminando bloques masivos de código viejo o logs redundantes de pruebas, pero conservando las directivas de inicio.
                        </p>
                      </div>

                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <code className="text-amber-400 font-mono text-xs font-bold">/compact enfócate en...</code>
                        <h4 className="text-xs font-bold text-white uppercase mt-1 font-display leading-tight">Memoria guiada</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Te permite guiar la compresión: puedes escribir por ejemplo <code className="text-amber-400 font-mono">/compact enfócate en las decisiones del andamiaje</code> para asegurar que esa parte no se simplifique.
                        </p>
                      </div>

                      <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                        <code className="text-amber-400 font-mono text-xs font-bold">/clear</code>
                        <h4 className="text-xs font-bold text-white uppercase mt-1 font-display leading-tight">Reinicio de sesión</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Borra completamente el historial actual si cambias radicalmente de rumbo o tarea, sin tocar las reglas globales declaradas en tu archivo de base <code className="text-white">CLAUDE.md</code>.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* COPYS */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Comandos listos para invocar en consola:</h4>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <div className="space-y-0.5">
                        <code className="text-amber-400 font-bold select-all">/context</code>
                        <span className="text-[10px] text-neutral-500 block">Muestra el porcentaje del espacio de tokens y qué archivos los consumen.</span>
                      </div>
                      <button onClick={() => handleCopy("/context", "tcContext")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-305 hover:text-amber-400 rounded text-[10px] uppercase font-mono">
                        {copiedStates["tcContext"] ? "✓" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <div className="space-y-0.5">
                        <code className="text-amber-400 font-bold select-all">/compact</code>
                        <span className="text-[10px] text-neutral-500 block">Sintetiza la sesión y libera espacio de tokens en caliente.</span>
                      </div>
                      <button onClick={() => handleCopy("/compact", "tcCompact")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-305 hover:text-amber-400 rounded text-[10px] uppercase font-mono">
                        {copiedStates["tcCompact"] ? "✓" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <div className="space-y-0.5">
                        <code className="text-amber-400 font-bold select-all">/compact enfócate en el objetivo y mis reglas</code>
                        <span className="text-[10px] text-neutral-500 block">Direcciona la compactación priorizando tus metas y restricciones dadas.</span>
                      </div>
                      <button onClick={() => handleCopy("/compact enfócate en el objetivo y mis reglas", "tcCompactF")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-355 hover:text-amber-400 rounded text-[10px] uppercase font-mono">
                        {copiedStates["tcCompactF"] ? "✓" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-3 rounded-lg border border-white/5 font-mono text-xs">
                      <div className="space-y-0.5">
                        <code className="text-amber-400 font-bold select-all">/clear</code>
                        <span className="text-[10px] text-neutral-500 block">Borra el historial conversacional actual pero mantiene tus reglas persistentes en CLAUDE.md.</span>
                      </div>
                      <button onClick={() => handleCopy("/clear", "tcClear")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-305 hover:text-amber-400 rounded text-[10px] uppercase font-mono">
                        {copiedStates["tcClear"] ? "✓" : "Copiar"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: CLAUDE.MD persistente */}
                <div id="tonto-sec-04" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Nivel Pro
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Bonus: CLAUDE.md y /rewind como memoria durable
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    La memoria conversacional del chat efímero termina borrándose o compactándose al 100%. Tu archivo <strong className="text-white">CLAUDE.md</strong> en local persistirá de por vida. Es un archivo que Claude lee de forma exhaustiva al arrancar y mantiene siempre presente en cada interacción de la terminal. Las reglas durables de estilo o veto siempre van ahí.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-1 text-left border border-white/5">
                      <code className="text-amber-400 font-mono text-[11px] block">/memory</code>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Revisa los persistentes</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Abre e inspecciona qué piezas de memoria de andamiaje y de identidad en tu perfil persisten en la sesión actual para detectar sobrecargas.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-1 text-left border border-white/5">
                      <code className="text-amber-400 font-mono text-[11px] block">/init</code>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Inicialización asistida</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Genera el archivo CLAUDE.md inicial en la raíz del proyecto tras una exploración rápida y asertiva que Claude efectúa sobre tus directorios.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-1 text-left border border-white/5">
                      <code className="text-amber-400 font-mono text-[11px] block">/rewind</code>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Retroceder en el tiempo</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Retrocede tu hilo conversacional a un checkpoint estable e intermedio si la respuesta salió mal, ahorrando miles de de tokens.
                      </p>
                    </div>
                  </div>

                  {/* PROMPT CHEETS */}
                  <div className="space-y-6 pt-4">
                    <h4 className="text-xs font-semibold text-neutral-200 uppercase tracking-widest font-mono">Prompts de Diagnóstico y Control (Copia y pega)</h4>
                    
                    <div className="space-y-4">
                      {/* PROMPT 1: ALARMA NOMBRE PERSISTENTE */}
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            1. LA REGLA DEL NOMBRE (PARA EMPEZAR EL CHAT)
                          </span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.alarmaNombre, "tcPAl1")} className="px-2 py-0.5 bg-neutral-805 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition">
                            {copiedStates["tcPAl1"] ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.alarmaNombre}</pre>
                      </div>

                      {/* PROMPT 2: TRASPASO */}
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            2. ENLACE DE TRASPASO DIRECTO A UN CHAT NUEVO (WEB)
                          </span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.resumenTraspaso, "tcPAl2")} className="px-2 py-0.5 bg-neutral-805 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition">
                            {copiedStates["tcPAl2"] ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.resumenTraspaso}</pre>
                      </div>

                      {/* PROMPT 3: CLAUDE.MD Persistente */}
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            3. PLANTILLA ESTÁNDAR PARA TU PERSISTENCIA EN CLAUDE.MD
                          </span>
                          <button onClick={() => handleCopy(`# CLAUDE.md\n\n## Cómo trabajar conmigo\n- Empieza tu respuesta diciéndome mi nombre: [tu nombre]. (Es mi alarma de contexto.)\n- Háblame en español, claro y directo.\n- Antes de un cambio grande, dime tu plan en 2-3 líneas y espera mi ok.\n\n## Reglas que nunca debes romper\n- [Lo que jamás debe hacer: borrar X, tocar Y, subir cambios sin avisar…]\n\n## Sobre este proyecto\n- Qué es: [una o dos frases].\n- Lo importante de saber: [convenciones, comandos, dónde está cada cosa].\n\n## Cuando te pierdas\n- Si ya no recuerdas estas reglas con claridad, dímelo: toca compactar o empezar de nuevo.`, "tcPAl3")} className="px-2 py-0.5 bg-neutral-805 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition">
                            {copiedStates["tcPAl3"] ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
{`# CLAUDE.md

## Cómo trabajar conmigo
- Empieza tu respuesta diciéndome mi nombre: [tu nombre]. (Es mi alarma de contexto.)
- Háblame en español, claro y directo.
- Antes de un cambio grande, dime tu plan en 2-3 líneas y espera mi ok.

## Reglas que nunca debes romper
- [Lo que jamás debe hacer: borrar X, tocar Y, subir cambios sin avisar…]

## Sobre este proyecto
- Qué es: [una o dos frases].
- Lo importante de saber: [convenciones, comandos, dónde está cada cosa].

## Cuando te pierdas
- Si ya no recuerdas estas reglas con claridad, dímelo: toca compactar o empezar de nuevo.`}
                        </pre>
                      </div>

                      {/* PROMPT 4: COMPACT guiado */}
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            4. COMANDO DE COMPACTACIÓN GUIADA (CONSOLA)
                          </span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.compactConFoco, "tcPAl4")} className="px-2 py-0.5 bg-neutral-805 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition">
                            {copiedStates["tcPAl4"] ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-24 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.compactConFoco}</pre>
                      </div>

                      {/* PROMPT 5: DIAGNÓSTICO RAPIDO */}
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            5. DIAGNÓSTICO RÁPIDO DEL ESTADIO CONTEXTUAL
                          </span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.diagnosticoRapido, "tcPAl5")} className="px-2 py-0.5 bg-neutral-805 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition">
                            {copiedStates["tcPAl5"] ? "¡Copiado!" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-28 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.diagnosticoRapido}</pre>
                      </div>
                    </div>
                  </div>

                  {/* RUTAS Y RECURSOS ENLACES */}
                  <div className="space-y-6 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Rutas para profundizar (Exprime la IA)
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <a href="https://code.claude.com/docs/en/context-window" target="_blank" className="p-4 bg-neutral-900/40 hover:bg-amber-950/10 border border-white/5 rounded-xl text-left block transition hover:-translate-y-0.5 active:translate-y-0 relative group">
                        <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block group-hover:text-amber-300 transition-colors">Documentación Oficial de Claude Code</span>
                        <strong className="text-xs font-bold text-white block mt-1 font-display">Ventana de contexto y límites</strong>
                        <span className="text-[11px] text-neutral-400 block mt-0.5 font-sans">La explicación oficial sobre /context, /compact y las rutinas automáticas de compresión de tokens.</span>
                      </a>

                      <a href="https://code.claude.com/docs/en/memory" target="_blank" className="p-4 bg-neutral-900/40 hover:bg-amber-950/10 border border-white/5 rounded-xl text-left block transition hover:-translate-y-0.5 active:translate-y-0 relative group">
                        <span className="font-mono text-[9px] text-amber-400 font-semibold uppercase block group-hover:text-amber-300 transition-colors">Guías Técnicas Anthropic</span>
                        <strong className="text-xs font-bold text-white block mt-1 font-display">Memoria e inicialización por capas</strong>
                        <span className="text-[11px] text-neutral-400 block mt-0.5 font-sans">Cómo organizar sub-carpetas, heredar variables y gestionar de forma limpia tu archivo CLAUDE.md.</span>
                      </a>
                    </div>
                  </div>

                  {/* FAQ SECT */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Preguntas Frecuentes</h4>
                    <div className="space-y-4 text-xs font-sans">
                      <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1">
                        <h5 className="font-bold text-amber-400 uppercase font-display">¿/compact o /clear?</h5>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">
                          Usa <code className="text-white font-mono">/compact</code> si estás a la mitad de una tarea y quieres borrar historial inútil pero mantener el rumbo memorizado. Usa <code className="text-amber-400 font-mono">/clear</code> si cambias radicalmente de proyecto/tema y quieres el canvas conversacional vacío.
                        </p>
                      </div>

                      <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1">
                        <h5 className="font-bold text-amber-400 uppercase font-display">¿Se pierde información crítica al compactar?</h5>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">
                          Claude resume los chats redundantes pero preserva la lógica y el CLAUDE.md. Si hay algo crucial que no quieres perder, de hecho guíalo: <code className="text-white font-mono">/compact enfócate en el objetivo</code>.
                        </p>
                      </div>

                      <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1">
                        <h5 className="font-bold text-amber-400 uppercase font-display">¿Pasa igual en web que en terminal?</h5>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">
                          Sí, el "Context Rot" afecta a todos los LLMs por arquitectura de red neuronal transigente. En web lo solucionas abriendo chats nuevos, en terminal mediante comandos finos de tokens.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONNECTED GUIDES Persistent Footer inside reader */}
                <div className="pt-8 border-t border-white/5">
                  <div className="p-6 bg-gradient-to-br from-amber-950/10 to-transparent border border-amber-500/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-amber-400 font-extrabold uppercase">SIGUE APRENDIENDO CON WENTIX</span>
                      <h4 className="text-sm font-bold text-white font-display uppercase m-0">¡Prueba el Setup de carpetas pro!</h4>
                      <p className="text-xs text-neutral-400 max-w-xl font-sans">
                        Aprende cómo orquestar múltiples ficheros CLAUDE.md de forma estratégica para crear un verdadero mapa mental libre de límites de tokens.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedGuideId("estructura-carpetas");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold rounded-xl text-xs font-sans transition-all cursor-pointer whitespace-nowrap self-start md:self-center uppercase"
                    >
                      Ir a Carpeta Pro &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "estructura-carpetas" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 05 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Estructura de folders y archivos para Claude: <span className="text-amber-400 italic block mt-1">tu segundo cerebro sin base de datos</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    Hay todo un movimiento que te dice que necesitas una base de datos vectorizada, Obsidian y configuraciones que ni sabes hacer. Para el <strong className="text-white font-semibold">95% de la gente eso es matar una mosca a cañonazos</strong>: lo único que necesitas son carpetas bien acomodadas y archivos CLAUDE.md que le dan estructura y memoria a tu agente.
                  </p>
                </div>

                {/* THE GLANCE CELL INTERACTIVE NAVIGATION BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("fol-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El mito del segundo cerebro</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fol-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El CLAUDE.md es tu mapa</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fol-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">La estructura por niveles</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fol-sec-04-06")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04–06 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Arranque, 4 prompts, etc.</span>
                  </button>
                </div>

                {/* THE PILL NAVIGATION LINKS SHORTCUTS */}
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <button onClick={() => document.getElementById("fol-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">el mito</button>
                  <button onClick={() => document.getElementById("fol-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">el mapa</button>
                  <button onClick={() => document.getElementById("fol-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">la estructura</button>
                  <button onClick={() => document.getElementById("fol-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">arranca</button>
                  <button onClick={() => document.getElementById("fol-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">los prompts</button>
                  <button onClick={() => document.getElementById("fol-sec-06")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">mantenlo vivo</button>
                  <button onClick={() => document.getElementById("fol-sec-faq")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="px-3 py-1.5 rounded-full border border-white/5 bg-neutral-950 hover:border-amber-500/30 text-neutral-400 hover:text-amber-400 transition cursor-pointer">faq</button>
                </div>
                {/* SECTION 1: EL MITO */}
                <div id="fol-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • el mito
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      No necesitas un segundo cerebro
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Cada semana sale alguien diciendo que para que Claude funcione de verdad tienes que montarle un segundo cerebro: una base de datos vectorizada, todo Obsidian conectado, embeddings, RAG. Suena impresionante y da la sensación de que sin eso vas atrasado. La verdad es más aburrida y más liberadora: la mayoría no necesita nada de eso.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                       <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Para qué SÍ sirven las bases vectorizadas</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Brillan cuando tienes un corpus enorme &mdash;miles de tickets de soporte, contratos legales, papers&mdash; y quieres buscar por concepto, no por palabra exacta. Si tu caso es ese, adelante. El problema es usarlas para un proyecto normal: ahí es matar una mosca a cañonazos.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">La agentic search que ya tienes</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Para código y proyectos normales, los agentes como Claude Code ya saben buscar solos: leen el árbol de carpetas, abren archivos por nombre y hacen búsquedas de texto. El consenso en 2026 es claro: empieza aquí y agrega búsqueda semántica solo el día que de verdad la necesites.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Clave</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>Entonces, ¿qué le falta a tu agente?</strong> Estructura. Carpetas ordenadas y unos archivos de texto que le digan dónde está todo y qué aprendiste. Eso es lo que vamos a armar aquí. Si más adelante te quedas corto, las herramientas de memoria avanzada están en la guía de <a href="https://www.tododeia.com/community/memoria-claude-code" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">memoria infinita para Claude Code</a>.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: EL MAPA */}
                <div id="fol-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • el mapa
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El CLAUDE.md es tu mapa
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    El primer archivo que pones en tu carpeta se llama <code className="text-white">CLAUDE.md</code>. Es un archivo de texto que tú escribes y que Claude lee automáticamente al inicio de cada sesión, como contexto que no se borra. No es configuración que se ejecuta ni código: es una nota para tu agente. Va en la raíz, el nivel de más arriba de tu proyecto.
                  </p>

                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Así se ve un CLAUDE.md raíz</h4>
                  <p className="text-xs text-neutral-400 italic">Texto plano, nada más. Fíjate: es una nota, no un manual.</p>

                  <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                    <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                      <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        CLAUDE.md · ejemplo raíz
                      </span>
                      <button onClick={() => handleCopy("# Mi proyecto\n\nApp de notas para equipos pequeños.\n\n## Comandos\n- Correr: npm run dev\n- Probar: npm test\n\n## Dónde vive cada cosa\n- src/  → código de la app\n- docs/ → guías y notas", "folRaizEx")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                        {copiedStates["folRaizEx"] ? "✓" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre select-all font-mono">{`# Mi proyecto

App de notas para equipos pequeños.

## Comandos
- Correr: npm run dev
- Probar: npm test

## Dónde vive cada cosa
- src/  → código de la app
- docs/ → guías y notas`}</pre>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Con eso, cuando abres Claude ya sabe qué es el proyecto, cómo correrlo y dónde mirar. No adivina. Lo importante son los comandos &mdash;cómo se corre y se prueba&mdash; y el mapa de carpetas.
                  </p>

                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Los tres niveles de CLAUDE.md</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">Usuario</span>
                      <code className="text-xs font-bold text-white block select-all font-mono">~/.claude/CLAUDE.md</code>
                      <p className="text-xs text-neutral-405 leading-relaxed">
                        Aplica a todos tus proyectos. Tus preferencias globales: idioma, tono, reglas que quieres en todo lugar.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">Proyecto</span>
                      <code className="text-xs font-bold text-white block select-all font-mono">./CLAUDE.md</code>
                      <p className="text-xs text-neutral-405 leading-relaxed">
                        Se sube a git y lo comparte tu equipo. El mapa del proyecto: stack, comandos y dónde vive cada cosa.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">Personal</span>
                      <code className="text-xs font-bold text-white block select-all font-mono">CLAUDE.local.md</code>
                      <p className="text-xs text-neutral-405 leading-relaxed">
                        Va al <code className="text-white">.gitignore</code> y nadie más lo ve. Tus rutas personales, recordatorios y atajos que no quieres compartir.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: LA ESTRUCTURA POR NIVELES */}
                <div id="fol-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • la estructura
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      La estructura por niveles, carpeta por carpeta
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Arriba, en la raíz, va el CLAUDE.md que hace de mapa. Abajo, una carpeta por tema o proyecto, y dentro de cada una su propio CLAUDE.md con las reglas de ese rincón. Es como pegar una nota en la puerta de cada cuarto.
                  </p>

                  <div className="p-5 border border-amber-500/10 rounded-2xl bg-neutral-950/80 font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed text-left shrink-0 overflow-x-auto space-y-1 md:p-6 select-all">
                    <div className="text-neutral-500 uppercase tracking-widest text-[9px] font-bold pb-2 border-b border-white/5 mb-3">Árbol de Directorios por Niveles</div>
                    <div>📁 mi-proyecto/</div>
                    <div className="pl-4">├── <span className="text-amber-400 font-bold font-mono">CLAUDE.md</span> <span className="text-neutral-500 text-xs font-mono"> (el mapa: dónde está todo)</span></div>
                    <div className="pl-4">├── 📁 clientes/</div>
                    <div className="pl-8">└── <span className="text-amber-400 font-bold font-mono">CLAUDE.md</span> <span className="text-neutral-500 text-xs font-mono"> (reglas de esta carpeta)</span></div>
                    <div className="pl-4">├── 📁 facturas/</div>
                    <div className="pl-8">└── <span className="text-amber-400 font-bold font-mono">CLAUDE.md</span> <span className="text-neutral-500 text-xs font-mono"> (reglas de esta carpeta)</span></div>
                    <div className="pl-4">└── 📁 notas/</div>
                    <div className="pl-8">└── <span className="text-amber-400 font-bold font-mono">CLAUDE.md</span> <span className="text-neutral-500 text-xs font-mono"> (reglas de esta carpeta)</span></div>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    El CLAUDE.md de cada carpeta no repite lo de la raíz: solo dice qué hay ahí y cómo se trabaja en ese tema.
                  </p>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">La magia del cargado on-demand</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      El CLAUDE.md de la raíz se carga siempre, pero el de una subcarpeta se carga solo cuando Claude entra a leer o editar algo dentro de ella. Si trabajas en <code className="text-white">facturas/</code>, no se satura con las reglas de <code className="text-white">clientes/</code>. Por eso conviene partir en carpetas con su propio CLAUDE.md en vez de un solo archivo gigante.
                    </p>
                  </div>
                </div>

                {/* SECTION 4: ARRANCA */}
                <div id="fol-sec-04" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • arranca
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Arranca en 2 minutos con /init
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    ¿No quieres escribir el primer CLAUDE.md a mano? No hace falta. Dentro de Claude Code escribes <code className="text-white">/init</code> y él revisa tu proyecto solo, entiende de qué va y te genera un CLAUDE.md inicial.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1">
                      <code className="text-amber-400 font-bold text-sm select-all font-mono">/init</code>
                      <span className="text-[11px] text-neutral-400 block leading-relaxed">Revisa tu proyecto, entiende de qué va y genera el CLAUDE.md inicial. Si ya tenías uno, no lo pisa: te sugiere mejoras.</span>
                    </div>
                    <button onClick={() => handleCopy("/init", "folInitBtn")} className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-355 hover:text-amber-400 rounded text-[10px] uppercase font-mono self-start sm:self-center">
                      {copiedStates["folInitBtn"] ? "✓" : "Copiar"}
                    </button>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    En ese primer archivo te deja el stack, los comandos de correr y probar, y un resumen de la estructura. Tú lo lees, ajustas lo que no cuadre y listo: de adivinar a tener un mapa en menos tiempo del que tardas en buscar dónde iba cada cosa.
                  </p>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Mantenlo corto</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      La recomendación oficial es dejar el CLAUDE.md en unas <strong>60 a 80 líneas</strong>. No es un manual: es un mapa. Si lo llenas de todo, Claude tiene que cargar más en cada sesión y se diluye lo importante. Borra lo obvio y deja solo lo que de verdad le ahorra trabajo.
                    </p>
                  </div>
                </div>

                {/* ANCHOR STEP 4 & 5 */}
                <div id="fol-sec-04-06" className="scroll-mt-24 inline-block h-0 w-0" />

                {/* SECTION 5: LOS PROMPTS */}
                <div id="fol-sec-05" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">05</strong> • los prompts
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Los 4 prompts para armar tu estructura
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    No tienes que escribir nada de esto a mano. Copia el prompt, pégalo en Claude y deja que él haga el trabajo. Van en orden: primero diseñas las carpetas, luego el mapa de la raíz, después las reglas de cada carpeta y al final el que lo mantiene vivo.
                  </p>

                  <div className="space-y-6">
                    {/* PROMPT 1 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Prompt 1 • Diseña las carpetas
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.carpetasDisenar, "folP1")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["folP1"] ? "✓" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all font-mono">{PROMPTS_TEXTS.carpetasDisenar}</pre>
                    </div>

                    {/* PROMPT 2 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Prompt 2 • Crea el CLAUDE.md raíz
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.claudeRaiz, "folP2")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["folP2"] ? "✓" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all font-mono">{PROMPTS_TEXTS.claudeRaiz}</pre>
                    </div>

                    {/* PROMPT 3 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Prompt 3 • Crea el CLAUDE.md de una carpeta
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.claudeLocalCarpeta, "folP3")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["folP3"] ? "✓" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all font-mono">{PROMPTS_TEXTS.claudeLocalCarpeta}</pre>
                    </div>

                    {/* PROMPT 4 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Prompt 4 • Mantenlo vivo
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.mantenloVivo, "folP4")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["folP4"] ? "✓" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap select-all font-mono">{PROMPTS_TEXTS.mantenloVivo}</pre>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Aclaración</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>Con estos cuatro</strong> armas la estructura completa sin tocar una línea de código tú. Recuerda pedirle a Claude que espere tu OK antes de crear archivos, así revisas el árbol antes de que lo escriba.
                    </p>
                  </div>
                </div>

                {/* SECTION 6: MANTENLO VIVO */}
                <div id="fol-sec-06" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">06</strong> • mantenlo vivo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      @imports, /memory y el ciclo que no para
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Cuando un CLAUDE.md empieza a crecer, no hace falta meterlo todo en un archivo. Puedes incluir otros con la sintaxis <code className="text-white">@ruta/al/archivo</code> dentro del CLAUDE.md &mdash;es como decir &ldquo;y aquí también lee este otro&rdquo;&mdash; para separar las reglas por tema y mantener cada archivo legible. Soporta hasta unos cuatro saltos anidados.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">@imports: orden, no ahorro</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Un <code className="text-white text-xs font-mono">@import</code> se carga completo, igual que si lo hubieras pegado. No es para gastar menos contexto: es para tener archivos chicos y claros en vez de uno enorme. Las rutas se resuelven desde donde está el CLAUDE.md que las llama.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">/memory: tu panel de control</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        ¿No sabes por qué una regla no se aplica? <code className="text-white text-xs font-mono">/memory</code> te lista todos los CLAUDE.md que Claude tiene cargados en ese momento y te deja editarlos. Es tu panel para ver qué está leyendo de verdad y arreglar lo que falte.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1">
                      <code className="text-amber-400 font-bold text-sm select-all font-mono">/memory</code>
                      <span className="text-[11px] text-neutral-400 block leading-relaxed">Lista todos los CLAUDE.md activos en esta sesión y te deja editarlos en el momento.</span>
                    </div>
                    <button onClick={() => handleCopy("/memory", "folMemoryBtn")} className="px-3 py-1.5 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-355 hover:text-amber-400 rounded text-[10px] uppercase font-mono self-start sm:self-center">
                      {copiedStates["folMemoryBtn"] ? "✓" : "Copiar"}
                    </button>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">El ciclo que importa</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      Lo último y lo más importante: el archivo tiene que vivir. Cuando termines una sesión, pide a Claude que guarde lo aprendido &mdash;una decisión, una convención, un error que evitar&mdash; en el CLAUDE.md que corresponda. Así, la próxima vez no arranca de cero. Ese ciclo de mejorar las reglas solo está en la guía de <a href="https://www.tododeia.com/community/feedback-loop-claude" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">feedback loop</a>.
                    </p>
                  </div>
                </div>

                {/* SECTION 7: DUDAS RAPIDAS */}
                <div id="fol-sec-faq" className="space-y-6 pt-4 border-t border-white/10 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">07</strong> • dudas rápidas
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Preguntas frecuentes
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Para qué es el CLAUDE.local.md?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        Para tus notas personales del proyecto que no quieres compartir: rutas tuyas, recordatorios, atajos. Es como el CLAUDE.md de proyecto, pero solo para ti: va al <code className="text-white">.gitignore</code> y se queda en tu máquina.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿El CLAUDE.md se sube a git?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        El CLAUDE.md de proyecto sí: la idea es que tu equipo lo comparta. El CLAUDE.local.md no, va al <code className="text-white font-mono">.gitignore</code> y se queda en tu máquina.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Y el viejo atajo de empezar un mensaje con #?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        Quedó retirado en 2026. Creaba memoria escondida que nadie veía. Hoy se edita el CLAUDE.md directo o se usa <code className="text-white font-mono">/memory</code>, todo en texto plano y a la vista.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Esto reemplaza la memoria automática o las herramientas de memoria?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        No compite, complementa. El CLAUDE.md es la estructura base que tú controlas. Si manejas mucho conocimiento y se te queda corto, ahí entran las herramientas de <a href="https://www.tododeia.com/community/memoria-claude-code" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">memoria avanzada</a>; no antes.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Cuántas líneas debe tener?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        El raíz, unas 60 a 80 líneas. Los de carpeta, menos. Si crece de más, recórtalo o parte el contenido en <code className="text-white font-mono">@imports</code>. Mientras más conciso, mejor lo aprovecha Claude.
                      </p>
                    </div>

                    <div className="p-5 border-l-2 border-amber-500 bg-neutral-900/15 text-left space-y-2">
                      <strong className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Sirve fuera de Claude Code?</strong>
                      <p className="text-xs text-neutral-350 leading-relaxed m-0">
                        El principio sí: carpetas ordenadas más archivos de contexto que el agente lee. Otros agentes usan otros normas de nombre, pero la idea de darle estructura por niveles funciona igual.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-950/80 border border-white/5 rounded-2xl text-left space-y-4 pt-6">
                    <strong className="text-sm font-bold text-white uppercase font-display block">Fuentes oficiales</strong>
                    <a 
                      href="https://code.claude.com/docs/en/memory" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition block"
                    >
                      <span>Memoria de Claude Code &bull; Docs oficiales</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                    <a 
                      href="https://code.claude.com/docs/en/large-codebases" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition block"
                    >
                      <span>Claude Code en proyectos grandes &bull; Docs oficiales</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* LESSON SWITCH FOOTER */}
                <div className="pt-8 border-t border-white/5">
                  <div className="p-6 bg-gradient-to-br from-amber-950/10 to-transparent border border-amber-500/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-amber-400 font-extrabold uppercase">SIGUE APRENDIENDO CON WENTIX</span>
                      <h4 className="text-sm font-bold text-white font-display uppercase m-0">¡Compara superficies! Terminal o App</h4>
                      <p className="text-xs text-neutral-400 max-w-xl font-sans">
                        ¿Pantalla negra o interfaz visual de escritorio? Domina la diferencia real de los entornos de Claude para elegir la que mejor se adapte a tu consumo y velocidad.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedGuideId("terminal-o-app");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-neutral-950 font-bold font-sans text-xs rounded-xl hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0 uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Siguiente Lección</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. GUÍA: TERMINAL O APP */}
            {selectedGuideId === "terminal-o-app" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 06 de Wentix • Nivel Avanzado</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Terminal o App: la diferencia real de Claude Code <span className="text-amber-400 italic block mt-1">y cuál te conviene</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    ¿La pantalla negra de comandos o la aplicación? Son la misma herramienta con dos puertas distintas, y <strong className="text-white">la que elijas cambia cuánto gastas y qué tan lejos puedes llegar</strong>. Aquí están las tres diferencias reales ilustradas, una tabla comparativa lado a lado, recursos de profundización y el veredicto honesto.
                  </p>
                </div>

                {/* THE 5 GLANCE CELLS (INTERACTIVE NAVIGATION BUTTONS) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("term-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-305 font-sans block leading-snug group-hover:text-amber-200 transition-colors">La misma herramienta, dos puertas</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("term-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full relative"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-305 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Tu saldo de tokens</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("term-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-305 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Nació en la terminal</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("term-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-305 font-sans block leading-snug group-hover:text-amber-200 transition-colors">La versión completa</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("term-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">05 &rarr;</span>
                    <span className="text-xs text-neutral-305 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Tabla, veredicto, arranque, etc.</span>
                  </button>
                </div>

                {/* SECTION 1: LA MISMA HERRAMIENTA, DOS PUERTAS */}
                <div id="term-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • Antes de comparar
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      La misma herramienta, dos puertas
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Mucha gente cree que está eligiendo entre «el chat» y «Claude Code». No: <strong className="text-white">Claude Code es uno solo</strong>. Lo único que cambia es por dónde entras. Que quede claro antes de comparar: esto no es «una versión buena y una mala». La pregunta no es cuál sirve, sino cuál te conviene según lo que haces.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                    {/* DOOR 1: TERMINAL / CLI */}
                    <div className="p-6 bg-neutral-900/30 text-left space-y-3">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-amber-550/10 border border-amber-500/20 text-amber-400 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest">
                        Terminal • CLI
                      </div>
                      <h4 className="font-bold text-white font-display uppercase text-sm mt-1 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-amber-400" />
                        La pantalla negra
                      </h4>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Corre en tu máquina, sobre tus archivos reales, en Mac, Windows y Linux. Es la versión completa: máximo control y la base de todo lo que puedes construir.
                      </p>
                    </div>

                    {/* DOOR 2: APP / TAB CODE */}
                    <div className="p-6 bg-neutral-900/30 text-left space-y-3">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-555/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest">
                        App • Tab Code
                      </div>
                      <h4 className="font-bold text-white font-display uppercase text-sm mt-1 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        La aplicación
                      </h4>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        La app de escritorio (Mac y Windows) o <code className="text-emerald-400">claude.ai/code</code> en el navegador. Más visual y guiada: árbol de archivos, diffs lado a lado y sesiones en paralelo. Ideal para empezar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: TU SALDO DE TOKENS */}
                <div id="term-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • Diferencia Uno
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Tu saldo de tokens: la terminal te da el control
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Lo verificable primero: la terminal te da los frenos y la visibilidad para gastar menos. Ves a dónde se va tu memoria, la limpias cuando quieres y tienes banderas que la app todavía no expone. La app, en cambio, hace más cosas solita —corre trabajo en el fondo— y eso es cómodo, pero gastas con menos visibilidad.
                  </p>

                  {/* COMMAND ROWS */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                          <code className="text-amber-400 select-all font-bold font-mono text-sm">/context</code>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1 py-0.5 rounded uppercase">El medidor</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-normal">Ve el porcentaje usado de la ventana de contexto y en qué se está yendo. Tu medidor de verdad.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy("/context", "tcC1")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center uppercase font-mono font-medium"
                      >
                        {copiedStates["tcC1"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                          <code className="text-amber-400 select-all font-bold font-mono text-sm">/compact</code>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1 py-0.5 rounded uppercase font-bold">Ahorro</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-normal">Claude resume la conversación en una versión corta y libera espacio. Menos tokens, sin tirar lo importante.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy("/compact", "tcC2")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center uppercase font-mono font-medium"
                      >
                        {copiedStates["tcC2"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                          <code className="text-amber-400 select-all font-bold font-mono text-sm">/clear</code>
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-1 py-0.5 rounded uppercase font-bold">Limpieza</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-normal">Borra la conversación y arrancas limpio. Un chat fresco gasta menos que uno arrastrando media hora de historia.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy("/clear", "tcC3")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center uppercase font-mono font-medium"
                      >
                        {copiedStates["tcC3"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 mt-2">
                    Y hay más control fino que solo vive en la terminal: banderas como <code className="text-amber-400 bg-neutral-950 border border-white/5 px-1.5 py-0.5 rounded">--model</code> (qué modelo usar), <code className="text-amber-400 bg-neutral-950 border border-white/5 px-1.5 py-0.5 rounded">--max-turns</code> (cuántos pasos máximo) o <code className="text-amber-400 bg-neutral-950 border border-white/5 px-1.5 py-0.5 rounded">--permission-mode</code>. Son perillas de gasto y comportamiento que la app, por ahora, no te deja tocar.
                  </p>

                  <div className="p-5 border-l-4 border-amber-500 bg-neutral-900/30 rounded-r-2xl text-left space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold uppercase block">MI EXPERIENCIA • NO ES DATO OFICIAL</span>
                    <p className="text-xs text-neutral-450 leading-relaxed italic">
                      "Yo he usado las dos y, midiendo a ojo, el mismo trabajo me salió como en un tercio de tokens en la terminal. Ojo: esto es experiencia personal —Anthropic no ha publicado números que lo confirmen—. Tómalo como una invitación a medir TU propio gasto con <code className="text-white">/context</code> y sacar tus conclusiones."
                    </p>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-amber-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Clave</span>
                    <p className="text-xs text-neutral-300 leading-relaxed mb-0">
                      <strong>El otro lado:</strong> la app de escritorio incluye Cowork, pensado para trabajo agentic más largo que corre en el fondo. Es genial para soltar tareas, pero si no estás viéndolo, puede ir gastando sin que te des cuenta. En la terminal tú decides cada cuándo y con qué frenos.
                    </p>
                  </div>
                </div>

                {/* SECTION 3: CLAUDE CODE NACIO EN LA TERMINAL */}
                <div id="term-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • Diferencia Dos
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Claude Code nació en la terminal
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Claude Code nació en la terminal. La CLI fue primero y sigue siendo la superficie más completa: las funciones de poder suelen de hecho aterrizar ahí antes y luego, con calma, las van incorporando a la app.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Estreno local</span>
                      <h4 className="text-sm font-bold text-white uppercase font-display">Lo nuevo llega primero a la CLI</h4>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        Comandos nuevos, banderas, formas de orquestar agentes: el patrón es que estrenen en la terminal y después bajan a la aplicación. No es una regla escrita, pero se cumple una y otra vez.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Velocidad de Interfaz</span>
                      <h4 className="text-sm font-bold text-white uppercase font-display">La app va detrás, pero llega</h4>
                      <p className="text-xs text-neutral-450 leading-relaxed">
                        La aplicación no se queda atrás para siempre: incorpora las funciones con su propio ritmo y las envuelve en una interfaz más amigable. Si no te urge lo último, ni lo notas.
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 italic">
                    Traducción práctica: si quieres estar al día con lo más reciente de Claude Code, la terminal es donde primero lo vas a poder probar.
                  </p>
                </div>

                {/* SECTION 4: LA TERMINAL ES LA VERSION COMPLETA */}
                <div id="term-sec-04" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Diferencia Tres
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      La terminal es la versión completa
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Esta es la diferencia más grande, y la mejor documentada. La terminal es la versión completa de Claude Code: <strong className="text-white">agarra tu computadora entera</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-2 text-left border border-white/5">
                      <span className="text-xl">📁</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Acceso total a tus archivos</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Le avientas tus archivos directo y trabaja sobre tu máquina real: lee, edita y corre lo que tengas. No es una copia ni un sandbox: es tu equipo de verdad.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-2 text-left border border-white/5">
                      <span className="text-xl">⏱</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Tareas en segundo plano</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Puedes dejar trabajo corriendo solo: <code className="text-amber-400 font-mono">/loop</code> para repetir un prompt, tareas programadas con cron y recordatorios de una sola vez, todo mientras sigues en tu flujo.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/40 rounded-xl space-y-2 text-left border border-white/5">
                      <span className="text-xl">🔧</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Herramientas propias</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Skills, hooks, comandos a tu medida y MCP: en la terminal armas piezas que se adaptan a tu flujo. Es el nivel donde dejas de usar Claude y empiezas a construir con él.
                      </p>
                    </div>
                  </div>

                  {/* MINI COMMAND ROW */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-xl border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1 grow">
                      <code className="text-amber-400 select-all font-bold font-mono text-xs">/loop 30m "revisa si el deploy terminó y avísame qué pasó"</code>
                      <p className="text-[11px] text-neutral-450 leading-normal">Mientras la sesión sigue abierta, Claude vuelve a correr tu prompt cada cierto tiempo. Es solo un ejemplo del tipo de automatización.</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(`/loop 30m "revisa si el deploy terminó y avísame qué pasó"`, "tcC4")} 
                      className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono font-medium"
                    >
                      {copiedStates["tcC4"] ? "✓ Copiado" : "Copiar"}
                    </button>
                  </div>

                  <div className="p-5 border border-white/5 bg-neutral-900/20 rounded-2xl text-left space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 font-bold uppercase block">DATOS OFICIALES DE ANTHROPIC</span>
                    <p className="text-xs text-neutral-350 leading-relaxed m-0">
                      Según las propias docs de Claude Code, las tareas en la nube (Routines) trabajan sobre una copia limpia de un repo de GitHub y <strong className="text-white">NO tocan tus archivos locales</strong>; las que corren en tu máquina —la terminal con <code className="text-amber-450 font-mono">/loop</code>— <strong className="text-white">SÍ tienen acceso completo</strong> a tu equipo. Esa es, en una línea, la diferencia entre la versión rápida y la versión completa.
                    </p>
                  </div>
                </div>

                {/* SECTION 5: DETALLE FINAL (TABLA, VEREDICTO, ARRANQUE) */}
                <div id="term-sec-05" className="space-y-10 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">05</strong> • Detalle Final
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Lado a lado, veredicto, arranque y recursos
                    </h3>
                  </div>

                  {/* TABLA COMPARATIVA LADO A LADO */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Terminal vs App, de un golpe
                    </h4>
                    <div className="overflow-x-auto border border-white/5 rounded-2xl bg-neutral-900/10">
                      <table className="w-full text-left font-sans text-xs md:text-sm border-collapse">
                        <thead>
                          <tr className="bg-neutral-900/80 text-neutral-400 font-mono text-[10px] tracking-widest uppercase border-b border-white/5">
                            <th className="p-4">Característica</th>
                            <th className="p-4 text-amber-400">Terminal • CLI</th>
                            <th className="p-4 text-emerald-400">App • Tab Code</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-300">
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Control de tokens</td>
                            <td className="p-4 font-mono text-[11px]">Ves conteo con <code className="text-amber-400">/context</code>, configuras banderas como model y turns. Limpieza manual.</td>
                            <td className="p-4">Más automático, con trabajo de fondo (Cowork). Menos medible analíticamente a ojo.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Acceso a archivos</td>
                            <td className="p-4">Total: trabaja directamente sobre tu máquina y archivos reales en local.</td>
                            <td className="p-4">Igual sobre tu equipo; pero las rutinas en la nube corren en copia limpia de GitHub.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Segundo plano</td>
                            <td className="p-4">Nativo mediante comando <code className="text-white">/loop</code>, cron y recordatorios en consola local.</td>
                            <td className="p-4">Tareas de escritorio y rutinas aisladas que corren en la infraestructura de Anthropic.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Herramientas propias</td>
                            <td className="p-4">Automatización de Skills, hook scripts personalizados de Git y MCP local a tu medida.</td>
                            <td className="p-4">Soporta la configuración base, pero con menores opciones de perillas finas de consola.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Novedades</td>
                            <td className="p-4 text-amber-400 font-bold">Frecuentemente llegan primero a la CLI.</td>
                            <td className="p-4 text-neutral-400">Las va incorporando de forma paulatina.</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white whitespace-nowrap">Visualización</td>
                            <td className="p-4 font-mono text-[11px] text-neutral-450">Texto plano directo y rápido, sin gráficos.</td>
                            <td className="p-4 text-green-400 font-medium">Árbol decorado, visualización de diffs y panel de planes.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* EL VEREDICTO BANNER */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      ¿Borro la app? No. Aquí decides:
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* STAY IN APP if */}
                      <div className="p-5 border border-emerald-500/20 bg-emerald-950/5 rounded-2xl text-left space-y-3">
                        <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold block">✓ QUÉDATE EN LA APP SI...</span>
                        <ul className="space-y-2 text-xs text-neutral-350 leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-450 font-bold shrink-0">&raquo;</span>
                            <span>Estás empezando y prefieres una asistencia visual táctica y bien guiada.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-450 font-bold shrink-0">&raquo;</span>
                            <span>Creas páginas web, assets de marketing, HTMLs simples o flujos de poco margen.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-450 font-bold shrink-0">&raquo;</span>
                            <span>Te encanta ver las comparaciones (diffs) lado a lado dentro del editor interactivo.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-450 font-bold shrink-0">&raquo;</span>
                            <span>No te urge exprimir hasta el último token ni experimentar con scripts exóticos.</span>
                          </li>
                        </ul>
                      </div>

                      {/* MOVE TO CLI if */}
                      <div className="p-5 border border-amber-500/20 bg-amber-950/5 rounded-2xl text-left space-y-3">
                        <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold block">&rsaquo; PÁSATE A LA TERMINAL SI...</span>
                        <ul className="space-y-2 text-xs text-neutral-350 leading-relaxed">
                          <li className="flex items-start gap-2">
                            <span className="text-amber-450 font-bold shrink-0">&raquo;</span>
                            <span>Quieres crear automatizaciones robustas en local y exprimir el agente al 100%.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-450 font-bold shrink-0">&raquo;</span>
                            <span>Necesitas automatizar tareas recurrentes interactuando directo con tus binarios.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-450 font-bold shrink-0">&raquo;</span>
                            <span>Te importa auditar métricas contextuales (<code className="text-amber-450 bg-neutral-950 px-1 rounded">/context</code>) para cuidar tus tokens.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-amber-450 font-bold shrink-0">&raquo;</span>
                            <span>Disfrutas programando tus propios comandos personalizados, hooks de git o MCPs locales.</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-900/50 rounded-xl border border-white/5 text-center text-xs text-neutral-300">
                      <strong>En una frase:</strong> La app es perfecta para comenzar; la terminal es la reina para exprimir. Si deseas desbloquear el potencial completo, vale la pena dar el paso técnico.
                    </div>
                  </div>

                  {/* ARRANQUE: TUS PRIMEROS COMANDOS */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        Tus primeros comandos en la terminal (Copia y pega)
                      </h4>
                      <p className="text-xs text-neutral-450">
                        ¿Te animas a usar la terminal? Abre tu consola dentro de la carpeta de proyecto, introduce uno de estos prompts estratégicos que preparamos en Wentix y observa la facilidad de razonamiento:
                      </p>
                    </div>

                    {/* PROMPT 1 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left space-y-px">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase">PROMPT 1 • ENTENDER EL PROYECTO</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(`Esta es mi carpeta de trabajo. Antes de tocar nada, explórala\ny dame un resumen sencillo, en español:\n- qué es este proyecto y para qué sirve\n- cómo está organizado (las carpetas y archivos importantes)\n- cómo se corre o se prueba\n- 3 cosas que mejorarías\n\nNo cambies nada todavía. Solo quiero entender qué tengo.`, "tcP1")} 
                          className="px-2 py-0.5 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["tcP1"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">
                        {`Esta es mi carpeta de trabajo. Antes de tocar nada, explórala
y dame un resumen sencillo, en español:
- qué es este proyecto y para qué sirve
- cómo está organizado (las carpetas y archivos importantes)
- cómo se corre o se prueba
- 3 cosas que mejorarías

No cambies nada todavía. Solo quiero entender qué tengo.`}
                      </pre>
                    </div>

                    {/* PROMPT 2 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left space-y-px">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase">PROMPT 2 • TAREA PROGRAMADA EN FONDO</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(`Quiero probar una tarea en segundo plano. Cada 30 minutos,\nrevisa si hay cambios sin guardar en esta carpeta y, si los\nhay, hazme un resumen corto de qué se modificó. Avísame solo\ncuando encuentres algo. Explícame en una línea cómo detener\nesta tarea cuando ya no la quiera.`, "tcP2")} 
                          className="px-2 py-0.5 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["tcP2"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">
                        {`Quiero probar una tarea en segundo plano. Cada 30 minutos,
revisa si hay cambios sin guardar en esta carpeta y, si los
hay, hazme un resumen corto de qué se modificó. Avísame solo
cuando encuentres algo. Explícame en una línea cómo detener
esta tarea cuando ya no la quiera.`}
                      </pre>
                    </div>

                    {/* PROMPT 3 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left space-y-px">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-[10px] tracking-wide text-amber-400 font-bold uppercase">PROMPT 3 • CREAR DIRECTRIZ CLAUDE.MD</span>
                        </div>
                        <button 
                          onClick={() => handleCopy(`Ayúdame a crear mi archivo CLAUDE.md para este proyecto.\nHazme 5 preguntas cortas sobre cómo me gusta trabajar\n(idioma, tono, qué evitar, cómo correr las cosas) y, con\nmis respuestas, escribe un CLAUDE.md claro y corto.\nDéjalo listo en la raíz del proyecto.`, "tcP3")} 
                          className="px-2 py-0.5 bg-neutral-800 text-[9px] rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["tcP3"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">
                        {`Ayúdame a crear mi archivo CLAUDE.md para este proyecto.
Hazme 5 preguntas cortas sobre cómo me gusta trabajar
(idioma, tono, qué evitar, cómo correr las cosas) y, con
mis respuestas, escribe un CLAUDE.md claro y corto.
Déjalo listo en la raíz del proyecto.`}
                      </pre>
                    </div>
                  </div>

                  {/* RUTAS Y RECURSOS ENLACES */}
                  <div className="space-y-6 pt-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Rutas para profundizar (Exprime cada opción)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* APP PATH LINKS */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Para exprimir la app</span>
                        
                        <a href="https://www.tododeia.com/community/guia-claude-code-completa" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-white block">Claude Code 0 a 100</strong>
                          <span className="text-[11px] text-neutral-400 block">El recorrido completo de la app a la terminal sin miedo técnico.</span>
                        </a>

                        <a href="https://www.tododeia.com/community/10-puntos-app-pro" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-white block">10 puntos para la app</strong>
                          <span className="text-[11px] text-neutral-400 block">Ajustes directos de interfaz para maximizar la navegación diaria.</span>
                        </a>

                        <a href="https://www.tododeia.com/community/comandos-claude-code" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-white block">Comandos útiles integrados</strong>
                          <span className="text-[11px] text-neutral-400 block">Usa los comandos slash directamente desde la barra lateral.</span>
                        </a>
                      </div>

                      {/* Terminal CLI PATH LINKS */}
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">Para exprimir la terminal</span>

                        <a href="https://www.tododeia.com/community/comandos-claude-code" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-amber-400 block">90+ Comandos Ordenados</strong>
                          <span className="text-[11px] text-neutral-400 block">El listado completo de atajos de consola indexados por caso de uso.</span>
                        </a>

                        <a href="https://www.tododeia.com/community/ultracode-claude-code" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-amber-500 block">Ultracode</strong>
                          <span className="text-[11px] text-neutral-400 block">Prende el verdadero esfuerzo múltiple y agentes de razonamiento masivo.</span>
                        </a>

                        <a href="https://www.tododeia.com/community/workflows-dinamicos" target="_blank" rel="noopener noreferrer" className="block p-3.5 bg-neutral-900/60 hover:bg-neutral-900 border border-white/5 hover:border-amber-500/20 rounded-xl space-y-1 transition duration-150">
                          <strong className="text-xs font-bold text-white block">Workflows dinámicos</strong>
                          <span className="text-[11px] text-neutral-400 block">Cómo orquestar multi-agentes sin vaciar tu saldo de tokens mensual.</span>
                        </a>
                      </div>
                    </div>

                    {/* FUENTES OFICIALES SECTION */}
                    <div className="p-5 bg-neutral-950 rounded-2xl border border-white/5 text-left space-y-3.5">
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">FUENTES OFICIALES DE ANTHROPIC CLAUDE</span>
                      
                      <div className="space-y-2">
                        <a href="https://code.claude.com/docs/en/desktop" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-3 bg-neutral-900/40 hover:bg-neutral-900 rounded-xl transition text-xs border border-white/5">
                          <span className="text-neutral-300">App de escritorio &bull; documentación y limitantes en Linux</span>
                          <span className="text-amber-400">&rarr;</span>
                        </a>

                        <a href="https://code.claude.com/docs/en/scheduled-tasks" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-3 bg-neutral-900/40 hover:bg-neutral-900 rounded-xl transition text-xs border border-white/5">
                          <span className="text-neutral-300">Tareas en bucle y programadas &bull; arquitectura local vs Cloud</span>
                          <span className="text-amber-400">&rarr;</span>
                        </a>

                        <a href="https://code.claude.com/docs/en/quickstart" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 p-3 bg-neutral-900/40 hover:bg-neutral-900 rounded-xl transition text-xs border border-white/5">
                          <span className="text-neutral-300">Quickstart oficial &bull; primeros pasos con comandos NPM directos</span>
                          <span className="text-amber-400">&rarr;</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* PREGUNTAS FRECUENTES (FAQ) */}
                  <div className="space-y-4 pt-4 text-left border-t border-white/5">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Preguntas frecuentes
                    </h4>

                    <div className="divide-y divide-white/5">
                      <div className="py-4 space-y-1">
                        <h5 className="text-xs font-bold text-amber-400 uppercase">¿La terminal de verdad gasta menos tokens?</h5>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">Anthropic no ha publicado números oficiales, pero en la terminal puedes visualizar el tamaño contextual y limpiarlo manualmente con <code className="text-neutral-350">/clear</code> y <code className="text-neutral-350">/compact</code> cada vez que notes sobrecostos.</p>
                      </div>

                      <div className="py-4 space-y-1">
                        <h5 className="text-xs font-bold text-amber-400 uppercase">¿«La app» es lo mismo que el chat de Claude.ai?</h5>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">No. Aquí &ldquo;la app&rdquo; hace referencia al tab Code específico de la app de escritorio o de <code className="text-neutral-350">claude.ai/code</code>. El chat normal no posee instrumentación del linter local.</p>
                      </div>

                      <div className="py-4 space-y-1">
                        <h5 className="text-xs font-bold text-amber-400 uppercase">¿Necesito saber programar para usar la terminal?</h5>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">No para el arranque básico. Escribes lo que requieres de forma verbal de la misma forma que en el chat regular, y activas el flujo global pasándole las pautas correspondientes.</p>
                      </div>

                      <div className="py-4 space-y-1">
                        <h5 className="text-xs font-bold text-amber-400 uppercase">¿La app de escritorio funciona en Linux?</h5>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">Actualmente no está disponible de forma nativa la app en Linux. En ese sistema, la terminal (CLI) es el rey absoluto, el cual funciona nativamente en todas las distribuciones.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. GUÍA: CLAUDE FABLE 5 */}
            {selectedGuideId === "claude-fable-5" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-950/20 border border-purple-800/30 text-purple-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-500" />
                    <span>Lección 07 de Wentix • Nivel Avanzado</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Claude Fable 5: el primer modelo <span className="text-purple-400 italic block mt-1">Mythos-class para todos</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
                    El 9 de junio de 2026 Anthropic lanzó Claude Fable 5, el modelo más capaz que ha puesto a disposición del público en su historia. <strong className="text-white">Es el mismo cerebro que Claude Mythos 5 —la versión restringida para socios de máxima confianza— con una capa de seguridad encima</strong>. En Wentix AI te explicamos qué es, cómo funciona, qué puede hacer que antes era imposible, costos, cuándo conviene usarlo (y cuándo no) y cómo sacarle provecho mientras está incluido gratis en planes seleccionados.
                  </p>
                </div>

                {/* THE GLANCE CELL INTERACTIVE NAVIGATION BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("fab-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-purple-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-purple-500/40 w-full"
                  >
                    <span className="font-mono text-purple-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-purple-200 transition-colors">Qué es un modelo Mythos-class</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fab-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-purple-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-purple-500/40 w-full"
                  >
                    <span className="font-mono text-purple-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-purple-200 transition-colors">Fable 5 vs Mythos 5</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fab-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-purple-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-purple-500/40 w-full"
                  >
                    <span className="font-mono text-purple-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-purple-200 transition-colors">Los Safeguards de Anthropic</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fab-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-purple-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-purple-500/40 w-full"
                  >
                    <span className="font-mono text-purple-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-purple-200 transition-colors">Benchmarks y Casos reales</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("fab-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-purple-950/25 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-purple-500/40 w-full"
                  >
                    <span className="font-mono text-purple-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">05 &rarr;</span>
                    <span className="text-xs text-neutral-350 font-sans block leading-snug group-hover:text-purple-200 transition-colors">Precios y Cómo activarlo</span>
                  </button>
                </div>

                {/* SECTION 1: QUE ES UN MODELO MYTHOS-CLASS */}
                <div id="fab-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">01</strong> • El Contexto
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Qué es Claude Fable 5 y qué significa Mythos-class
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Las capacidades de esta nueva gama de misiones superan las de cualquier cerebro que Anthropic haya lanzado antes. La clase Mythos se consideró inicialmente demasiado potente en ciertos dominios regulatorios de riesgo militar para liberarse libremente. Fable 5 es la respuesta inteligente comercial: misma inteligencia, con clasificadores activos de seguridad para el uso de todos.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Una clase completamente nueva</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Anthropic organizes sus peldaños de modelos: Haiku, Sonnet, Opus... y ahora Mythos, un escalón por encima de Opus. Fable 5 es el pionero que cualquiera de nosotros puede usar con confianza de desarrollo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">El mismo cerebro base</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Fable 5 and Mythos 5 comparten exactamente los mismos pesos e inteligencia troncal de su entrenamiento de base. El rediseño radica exclusivamente en filtros especializados integrados externamente.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Pensado para tareas extensas</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Sólida arquitectura autónoma en ingeniería de software, análisis conceptual a gran escala, comprensión visual avanzada y flujos lógicos continuos de múltiples horas seguidas.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Utilidad para no programadores</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Análisis profundos de reportes and documentos gigantescos de una sola pasada, cruce de datos empresariales y orquestadores que investigan por ti de manera independiente sin perder la memoria del contexto.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-purple-500/35 bg-purple-950/10 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-purple-500/30 rounded text-purple-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • El Salto</span>
                    <p className="text-xs text-neutral-305 leading-relaxed m-0">
                      <strong>La diferencia radica en lo que puedes delegarle:</strong> no se trata solo de que responda mejor, sino de la resistencia para no descarrilarse. Las generaciones anteriores solían perder el hilo del plan a mitad de un proceso complejo; Fable 5 sostiene and termina ejecuciones extensas del tirón.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: FABLE 5 VS MYTHOS 5 */}
                <div id="fab-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">02</strong> • La Comparativa
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Fable 5 vs Mythos 5: ¿Qué comparten y qué cambia?
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-305 leading-relaxed">
                    No son modelos con cerebros distintos: son el mismo núcleo base provisto con capas de seguridad adaptativas según su destinatario. Y en términos de costo en la API, su cobro por tokens de inicialización y respuesta es exactamente idéntico.
                  </p>

                  {/* Twin styled side-by-side card structure */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-3">
                      <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider">Lo que comparten</span>
                      <ul className="text-xs text-neutral-400 space-y-2 list-inside list-disc">
                        <li>Mismo modelo de fundición base con los mismos pesos e inteligencia.</li>
                        <li>Precio exacto en la API: $10/M tokens entrada y $50/M tokens salida.</li>
                        <li>Ventana de contexto de 1 millón de tokens y hasta 128K tokens de tokens de salida.</li>
                        <li>Rendimiento idéntico en coding, visión, agentes autónomos y tareas lógicas generales.</li>
                        <li>Retención segura de datos de 30 días garantizada formalmente por Anthropic.</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-purple-500/20 rounded-2xl text-left space-y-3">
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">Lo que cambia</span>
                      <ul className="text-xs text-neutral-450 space-y-2 list-inside list-disc">
                        <li>Fable 5 corre clasificadores de seguridad activos en tiempo real en la consulta.</li>
                        <li>Fable 5 tiene filtros bloqueantes en intrusiones ofensivas y biología de doble uso.</li>
                        <li>Fable 5 es de libre acceso global; Mythos 5 requiere alta aprobación gubernamental o militar.</li>
                        <li>Mythos 5 responde sin restricciones técnicas en hackeo de combate y ciberdefensa crítica.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900/20 rounded-xl border border-white/5 space-y-2 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">¿Qué es el programa Project Glasswing?</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Project Glasswing es el puente restrictivo que Anthropic diseñó para robustecer infraestructuras y software en entornos gubernamentales legítimos, permitiendo el despliegue de Mythos unchained bajo debidas licencias autorizadas. Si tu rol no roza esos nichos bélicos u oficiales, Fable 5 actuará de forma idéntica en toda tu productividad habitual de negocio.
                    </p>
                  </div>
                </div>

                {/* SECTION 3: LOS SAFEGUARDS */}
                <div id="fab-sec-03" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">03</strong> • Capas de Control
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Los Safeguards de Anthropic: qué bloquean y cómo actúan
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    La habilitación de Fable para el mercado general es viable gracias a clasificadores dedicados (modelos ligeros complementarios, no listas primitivas de palabras clave) que filtran tres ámbitos neurálgicos de riesgo.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Ciberseguridad Ofensiva</span>
                      <p className="text-xs text-neutral-455 leading-relaxed">
                        Desarrollo and testeo de exploits de código abierto, malware dinámico o asaltos de hackeo dirigidos sin marco de control legal.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Biología y Química de Doble Uso</span>
                      <p className="text-xs text-neutral-455 leading-relaxed">
                        Formulaciones moleculares críticas y síntesis químicas catalogadas de alto riesgo por tratados de contención de armas.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-purple-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Destilación de Modelos</span>
                      <p className="text-xs text-neutral-455 leading-relaxed">
                        Intentos deliberados de orquestar prompts infinitos estructurados para robar o replicar la lógica de pesos de la red neuronal.
                      </p>
                    </div>
                  </div>

                  {/* Checklist style detail */}
                  <div className="p-5 bg-neutral-900/10 border border-white/5 rounded-2xl space-y-3 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Los datos duros del sistema de control</h4>
                    <ul className="text-xs text-neutral-350 space-y-2 list-inside list-disc">
                      <li>Los evaluadores de entrada corren en fracciones de milisegundos de forma paralela pre-generación.</li>
                      <li><strong>Activación del Fallback:</strong> si un clasificador salta ante un supuesto peligro, la consulta no se congela; se delega en bypass a <strong className="text-white">Claude Opus 4.8</strong>, notificándotelo de inmediato en pantalla.</li>
                      <li>Tasa de falsos positivos en el mercado: menos del 5% de las misiones complejas sufren este desvío preventivo de seguridad.</li>
                      <li>Pruebas de Red-Teaming: resistió más de 1,000 horas continuas de pruebas intensivas de hackeo sin ceder a jailbreaks generalizados de un solo paso.</li>
                    </ul>
                  </div>
                </div>

                {/* SECTION 4: BENCHMARKS Y CASOS REALES */}
                <div id="fab-sec-04" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">04</strong> • Rendimiento Puro
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Benchmarks de frontera y casos de uso real
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Fable 5 destrona a la competencia anterior en todas las misiones de desarrollo, matemáticas complejas y razonamiento de consola. Pero las cifras de laboratorios solo cobran vida cuando se analizan los retornos prácticos de equipos de software reales:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {/* Bench 1 */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-350 font-bold">SWE-Bench Pro (Agente Autónomo)</span>
                          <span className="text-purple-400 font-bold">~80%</span>
                        </div>
                        <div className="h-2 bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: "80%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-400">Medición de codificación multivariada sin asistencia humana.</p>
                      </div>

                      {/* Bench 2 */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-350 font-bold">SWE-bench Verified (Corrección bugs)</span>
                          <span className="text-purple-400 font-bold">95%</span>
                        </div>
                        <div className="h-2 bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: "95%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-400">Resolución impecable de issues lógicos confirmados por ingenieros de software.</p>
                      </div>

                      {/* Bench 3 */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-350 font-bold">Humanity&apos;s Last Exam (Razonamiento extremo)</span>
                          <span className="text-purple-400 font-bold">64.5%</span>
                        </div>
                        <div className="h-2 bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: "64.5%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-400">Una de las pruebas académicas y científicas más retadoras del mundo hoy.</p>
                      </div>

                      {/* Bench 4 */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="text-neutral-350 font-bold">GDPval-AA (Conocimiento analítico)</span>
                          <span className="text-purple-400 font-bold">1932 Elo • #1</span>
                        </div>
                        <div className="h-2 bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-full" style={{ width: "100%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-400">Artificial Analysis califica a Fable como el oráculo corporativo supremo.</p>
                      </div>
                    </div>

                    {/* Casos reales */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-4 bg-neutral-950/80 border border-white/5 rounded-xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-purple-400 font-bold block">Refactor de 50M de líneas de Ruby</span>
                        <p className="text-xs text-neutral-350 leading-relaxed">
                          Un gran procesador de pagos estadounidense migró de manera autónoma en menos de 24 horas un backend gigante que originalmente demandaba 2 meses enteros de desarrollo manual.
                        </p>
                      </div>

                      <div className="p-4 bg-neutral-950/80 border border-white/5 rounded-xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-purple-400 font-bold block">Pokémon completo sin mandiles JSON</span>
                        <p className="text-xs text-neutral-350 leading-relaxed">
                          El modelo completó Pokémon FireRed navegando e interactuando de forma autónoma con la pantalla de juego con visión artificial directa, sin andamiajes estructurados externos de coordenadas.
                        </p>
                      </div>

                      <div className="p-4 bg-neutral-950/80 border border-white/5 rounded-xl text-left space-y-1">
                        <span className="text-[9px] font-mono text-purple-400 font-bold block">Reconstrucción visual de layouts</span>
                        <p className="text-xs text-neutral-350 leading-relaxed">
                          Fable extrae con precisión decimal cualquier métrica de esquemas, planos o capturas, siendo capaz de generar el código fuente exacto para clonar una interfaz partiendo de una imagen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: PRECIOS Y DISPONIBILIDAD */}
                <div id="fab-sec-05" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">05</strong> • El Bolsillo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Precio, ventanas libres y fechas críticas
                    </h3>
                  </div>

                  <div className="p-5 border-2 border-purple-500/30 rounded-2xl bg-purple-950/10 text-left space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold block uppercase tracking-widest">⚠️ Ventana Clave: 22 de Junio</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0">
                      <strong>Hasta el 22 de junio de 2026</strong>, Fable 5 está incluido sin costo de uso en los planes Pro, Max, Team and Enterprise de Claude. A partir del 23 de junio, requerirá créditos de consumo adicionales en el medidor directo mientras Anthropic consolida el total escalado de servidores. La recomendación de Wentix es tajante: exprime esta ventana gratuita para realizar tus misiones más de grado frontera.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-xs font-bold text-white uppercase font-mono tracking-widest text-purple-400">API y Costo de Tokens</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Fijado en $10 el millón de tokens de entrada and $50 el millón de salida. Ojo con el nuevo tokenizador integrado: codifica el lenguaje natural con mayor granularidad técnica, consumiendo en promedio ~30% más volumen técnico que Claude Opus en idénticos bloques semánticos de texto.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-xs font-bold text-white uppercase font-mono tracking-widest text-purple-400">Ecosistemas Disponibles</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Directo desde el backend de Wentix AI o de forma nativa en tus consolas mediante el identificador <code className="text-white font-mono">claude-fable-5</code> en la consola de la API, las plataformas corporativas asociadas de Amazon Bedrock, Google Vertex AI y entornos como GitHub Copilot.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 6: CUANDO USAR Y CUANDO NO */}
                <div className="space-y-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">06</strong> • Guía de Selección
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Criterio de Wentix: Cuándo usar Fable 5 (y cuándo no)
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/40 border border-emerald-500/20 rounded-2xl text-left space-y-3">
                      <span className="font-mono text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Úsalo con prioridad en</span>
                      <ul className="text-xs text-neutral-450 space-y-2 list-inside list-disc">
                        <li>Refactors y reestructuraciones de software de docenas de archivos enteros.</li>
                        <li>Cruce masivo de documentos extensos e investigación autónoma con herramientas.</li>
                        <li>Análisis de diagramas conceptuales complejos o diagramas corporativos pesados.</li>
                        <li>Despliegue de misiones lógicas donde requieras completa autonomía de desarrollo.</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-neutral-900/40 border border-rose-500/20 rounded-2xl text-left space-y-3">
                      <span className="font-mono text-[10px] text-rose-400 font-bold block uppercase tracking-wider">Opta por otro modelo si</span>
                      <ul className="text-xs text-neutral-455 space-y-2 list-inside list-disc">
                        <li>Chat diario o preguntas inmediatas cortas (gastarás recursos en vano).</li>
                        <li>Edición de scripts aislados y micro-funciones simples (Sonnet o Haiku bastan).</li>
                        <li>Consultas rápidas sobre servidores donde requieras respuestas de milisegundos.</li>
                        <li>Consultas complejas de ciberdefensa ofensiva (serás derivado a Opus de todos modos).</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-purple-500/25 bg-neutral-950 rounded-2xl text-left space-y-1">
                    <span className="font-mono text-[9px] text-purple-400 font-bold block uppercase">La letra pequeña técnica</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0">
                      Su razonamiento interno de múltiples vías siempre corre activo sin opción de apagado, por ende, en ejecuciones de alto nivel es natural que Claude tarde algunos minutos en concluir su trabajo. Combina con inteligencia: cerebro maestro para misiones grandes y Sonnet/Opus para el flujo cotidiano.
                    </p>
                  </div>
                </div>

                {/* SECTION 7: PROMPTS CLAVE DE DELEGACIÓN */}
                <div className="space-y-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">07</strong> • Práctica de prompt
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Prompts estrellas optimizados para Fable 5
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Aprovecha que Fable 5 rinde al máximo ante especificaciones extensas de entrada. Utiliza estas plantillas para tus flujos autónomos diario:
                  </p>

                  <div className="p-3 bg-neutral-900 border border-white/5 rounded-xl flex items-center justify-between font-mono text-xs text-neutral-300">
                    <span><code>/model claude-fable-5</code> <span className="text-neutral-500 hidden sm:inline">(Activa la consola principal de Claude Code)</span></span>
                    <button 
                      onClick={() => handleCopy("/model claude-fable-5", "console-f5")}
                      className="px-2 py-0.5 bg-neutral-800 text-[10px] text-white rounded hover:bg-neutral-700 transition"
                    >
                      {copiedStates["console-f5"] ? "¡Copiado!" : "Copiar"}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Prompt Box 1 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-purple-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          ¿Esta tarea amerita Fable 5? (Toma de decisión)
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.fableJustificado, "pFabDec")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["pFabDec"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.fableJustificado}</pre>
                    </div>

                    {/* Prompt Box 2 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-purple-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          Delegar un trabajo completo (Especificación de entrada)
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.fableEspecificacion, "pFabEsp")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["pFabEsp"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-40 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.fableEspecificacion}</pre>
                    </div>

                    {/* Prompt Box 3 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-purple-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          Sesión larga con auto-verificación (Modo Maratón)
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.fableSesionLarga, "pFabLarga")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["pFabLarga"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.fableSesionLarga}</pre>
                    </div>

                    {/* Prompt Box 4 */}
                    <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden text-[11px] font-mono text-left">
                      <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                        <span className="text-[10px] tracking-wide text-purple-400 font-bold uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          Dale memoria de largo plazo (Archivado de lecciones)
                        </span>
                        <button onClick={() => handleCopy(PROMPTS_TEXTS.fableMemoria, "pFabMemo")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition">
                          {copiedStates["pFabMemo"] ? "¡Copiado!" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.fableMemoria}</pre>
                    </div>
                  </div>
                </div>

                {/* SECTION 8: LA VOZ DE LA COMUNIDAD */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">08</strong> • Feedback Real
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Primeras impresiones de investigadores reales
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 border-l-2 border-purple-500 bg-neutral-900/15 text-left space-y-2">
                      <p className="text-xs sm:text-sm text-neutral-300 italic m-0">
                        &ldquo;Fable es el mejor modelo con el que he interactuado para escribir código, con diferencia absoluta. Reduce la necesidad de aclaraciones constantes o revisiones manuales, expande los límites de retención y ofrece seguridad de cara a despliegues autónomos de larga duración.&rdquo;
                      </p>
                      <cite className="font-mono text-[10px] text-neutral-400 block not-italic font-bold">&mdash; Boris Cherny, Equipo de Claude Code (Anthropic)</cite>
                    </div>

                    <div className="p-5 border-l-2 border-purple-500 bg-neutral-900/15 text-left space-y-2">
                      <p className="text-xs sm:text-sm text-neutral-300 italic m-0">
                        &ldquo;Pulverizó de forma contundente todos nuestros benchmarks locales especializados: alcanzó una puntuación senior de 91/100 en nuestra evaluación automatizada de ingeniería compleja. Se siente como dar soporte motor warp a la codificación moderna.&rdquo;
                      </p>
                      <cite className="font-mono text-[10px] text-neutral-400 block not-italic font-bold">&mdash; Dan Shipper, Co-founder of Every (Cuerpos de pruebas de sistemas de IA)</cite>
                    </div>
                  </div>
                </div>

                {/* SECTION 9: PREGUNTAS FRECUENTES (FAQ) */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-purple-500 font-sans">09</strong> • Soporte técnico
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Dudas Comunes sobre Claude Fable 5
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase font-display">¿Qué ocurrirá específicamente desde el 23 de junio?</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Se cerrará el acceso gratuito por defecto y requerirás cargar créditos específicos e individuales en tu medidor premium de API o chat para continuar explotando el cerebro Fable 5, mientras asumen el total escalado global.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase font-display">¿Existe riesgo de desvío de fallback preventivo?</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Totalmente. Dado que los filtros de Anthropic operan con sensibilidades preventivas muy estrictas, consultas normales con palabras limítrofes sobre medicina o análisis de redes defensivas legítimas pueden redireccionarse automáticamente al motor general Claude Opus 4.8.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase font-display">¿Cómo opera la retención de tokens de 30 de Fable?</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        La infraestructura entera de misiones Mythos requiere auditoría secuencial preventiva para depurar falsos positivos y proteger ciberinfraestructuras nacionales. Vencidos los 30 días, la data se anonimiza y purga definitivamente según estándares estrictos.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1.5">
                      <h4 className="text-xs font-bold text-amber-400 uppercase font-display">¿Fable 5 suprime por completo a Opus 4.8?</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Negativo. Claude Opus 4.8 continúa erigiéndose como el caballo de batalla predilecto por excelencia para interacciones cotidianas breves: menor latencia de respuesta, menor consumo de tokens generales y libre de redirecciones de clasificadores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* DOCUMENTACION / FUENTES */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Fuentes de Consulta Oficiales
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a href="https://www.anthropic.com/news/claude-fable-5-mythos-5" target="_blank" rel="noreferrer" className="p-4 bg-neutral-900/40 hover:bg-purple-950/10 border border-white/5 rounded-xl text-left block transition hover:-translate-y-0.5 active:translate-y-0 relative group">
                      <span className="font-mono text-[9px] text-purple-400 font-semibold uppercase block group-hover:text-purple-300 transition-colors">Anthropic Newsroom</span>
                      <strong className="text-xs font-bold text-white block mt-1 font-display">Anuncio Oficial del Ecosistema Mythos-class</strong>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 font-sans">Métricas técnicas de fundición, programas regulatorios integrados y disponibilidad por regiones comerciales.</span>
                    </a>

                    <a href="https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5" target="_blank" rel="noreferrer" className="p-4 bg-neutral-900/40 hover:bg-purple-950/10 border border-white/5 rounded-xl text-left block transition hover:-translate-y-0.5 active:translate-y-0 relative group">
                      <span className="font-mono text-[9px] text-purple-400 font-semibold uppercase block group-hover:text-purple-300 transition-colors">Claude API Docs</span>
                      <strong className="text-xs font-bold text-white block mt-1 font-display">Documentación Técnica de Consolas de Fable 5</strong>
                      <span className="text-[11px] text-neutral-400 block mt-0.5 font-sans">Parámetros lógicos de inicialización, límites técnicos de tokens de contexto y compatibilidad de JSON Schema.</span>
                    </a>
                  </div>
                </div>

                {/* LESSON SWITCH FOOTER */}
                <div className="pt-8 border-t border-white/5">
                  <div className="p-6 bg-gradient-to-br from-purple-950/10 to-transparent border border-purple-500/10 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono tracking-widest text-purple-400 font-extrabold uppercase">SIGUE APRENDIENDO CON WENTIX</span>
                      <h4 className="text-sm font-bold text-white font-display uppercase m-0">¡Prueba el Codex de OpenAI!</h4>
                      <p className="text-xs text-neutral-400 max-w-xl font-sans">
                        Descubre cómo instalar y usar de forma extrema el agente de programación de OpenAI para alternar misiones según conveniencia técnica y arquitectura libre de tokens.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedGuideId("codex-openai");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold font-sans text-xs rounded-xl hover:brightness-110 active:scale-95 transition cursor-pointer shrink-0 uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Siguiente Lección</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "codex-openai" && (
              <div className="space-y-12 text-left animate-fade-in">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                    <span>Lección 08 de Wentix • Nivel Avanzado</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase">
                    Codex de OpenAI: la guía completa de <span className="text-amber-400 italic">0 a 100</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-350 leading-relaxed max-w-3xl">
                    Codex es el agente de programación de OpenAI: no solo sugiere código, <strong className="text-white">entiende tu proyecto completo, edita archivos, ejecuta comandos y pruebas, y deja el trabajo listo para que tú lo revises</strong>. Es el competidor directo de Claude Code, y en Wentix AI lo explicamos de 0 a 100 en español simple: qué es, los modelos que lo mueven, cómo instalarlo y usarlo paso a paso, planes y precios, qué puede y qué no puede hacer, seguridad y todo lo nuevo de 2026 — aunque no programes.
                  </p>
                </div>

                {/* THE 5 GLANCE CELLS (INTERACTIVE NAVIGATION BUTTONS) */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("codex-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-xs font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Qué es Codex y de dónde viene</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("codex-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-xs font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Los modelos que lo mueven</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("codex-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-xs font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Instalarlo paso a paso</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("codex-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-xs font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Planes y precios</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("codex-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-xs font-bold block group-hover:translate-x-0.5 transition-transform">05 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Qué puede, qué no, y seguridad</span>
                  </button>
                </div>

                {/* SECTION 1: QUE ES CODEX Y POR QUE ES DISRUPTIVO */}
                <div id="codex-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El Punto de Partida
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Qué es Codex y por qué es disruptivo
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                    Codex es el <strong className="text-amber-400 font-mono">agente de programación de OpenAI</strong>. La palabra clave es <em className="text-white italic">agente</em>: no se queda en sugerir, sino que entiende tu proyecto, toca los archivos, corre comandos y te devuelve el trabajo hecho. Es lo más fuerte que sacó OpenAI para programar con IA y la competencia directa de Claude Code.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        Un agente, no un autocompletado
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Codex no solo te sugiere la siguiente línea: entiende la base de código entera, edita varios archivos, corre comandos en la terminal, ejecuta tus pruebas y te entrega el trabajo listo para revisar. Tú diriges y apruebas; él hace el trabajo pesado.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        Codex actúa; ChatGPT conversa
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        ChatGPT normal platica y te sugiere texto. Codex tiene acceso a tu código real: lo lee, lo cambia y lo ejecuta, en tu computadora o en su propia nube. Es la diferencia entre pedir consejo y delegar la tarea completa.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        La competencia directa de Claude Code
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Mismo paradigma que Claude Code: un agente que vive en la terminal, el editor y la nube, lee tu repo y propone cambios. OpenAI quedó como líder en el Cuadrante Mágico de Gartner 2026 de agentes de codificación. Saber usar ambos es una ventaja, no una disyuntiva.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        Importa aunque no programes
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Si haces apps con IA (vibe coding), Codex es de las formas más directas de pasar de una idea a algo que corre, se prueba solo y se publica. Tú describes lo que quieres en lenguaje natural; él lo construye y te muestra el resultado.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-amber-500/20 bg-amber-950/10 rounded-2xl text-left">
                    <p className="text-xs text-amber-200 leading-relaxed mb-0">
                      <strong>Postura Wentix AI:</strong> no te pedimos que te cambies de nada. Conocer las dos herramientas te hace más fuerte y amplía tu caja de opciones.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: POR QUE HAY DOS CODEX */}
                <div className="space-y-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">02</strong> • La Confusión del Nombre
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Por qué hay dos "Codex" (y cuál es el de hoy)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-355 leading-relaxed">
                    Si buscas Codex te vas a topar con información contradictoria, y tiene una explicación simple: el nombre tuvo dos vidas. Esta línea de tiempo evita que mezcles el Codex viejo con el de ahora.
                  </p>

                  <div className="border-l-2 border-dashed border-white/10 pl-6 ml-4 space-y-8 text-left">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">2021</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Codex era un MODELO</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">El primer Codex fue un modelo de IA (descendiente de GPT-3, entrenado con código público de GitHub). Fue el cerebro que dio vida al primer GitHub Copilot y demostró que la IA podía programar de verdad.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Marzo 2023</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Ese modelo se descontinuó</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">OpenAI dio de baja los modelos Codex de 2021 y Copilot pasó a GPT-4. El nombre "Codex" quedó guardado un tiempo.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">Mayo 2025</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Codex renace, ahora como AGENTE</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">OpenAI relanzó "Codex" con un significado nuevo: ya no es un modelo, es un agente de ingeniería de software que trabaja en tareas en paralelo, se conecta a tu repo y abre pull requests solo.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">El "Codex" vive en el producto, no en el modelo</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Hoy Codex es una familia de apps (terminal, editor, nube, móvil) movida por los modelos GPT-5.5 y compañía. Curiosamente, los modelos por defecto ya ni llevan "codex" en el nombre.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: LAS SUPERFICIES */}
                <div className="space-y-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">03</strong> • Canales de Interacción
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Las superficies: terminal, editor, nube, móvil y GitHub
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Codex no es una sola app: es un agente con varias entradas que comparten tu cuenta, tu historial y tu archivo de instrucciones (AGENTS.md). Entras por donde te quede cómodo y alternas sin perder el contexto.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 01</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">CLI de terminal</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        El agente que corre en tu terminal y trabaja sobre los archivos de tu computadora. Es de código abierto (escrito en Rust). El corazón de Codex para quien vive en la consola.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 02</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Extensión de IDE</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Lleva a Codex dentro de tu editor: VS Code, Cursor, Windsurf y los IDEs de JetBrains. Chateas, editas y ves los cambios como diffs sin salir del editor.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 03</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Codex en la nube</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Tareas que corren solas en un contenedor aislado de OpenAI, incluso varias en paralelo. Se conecta a GitHub y te entrega un pull request. Vive en chatgpt.com/codex.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 04</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">App de escritorio</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Una app para macOS y Windows para manejar varios hilos de Codex a la vez, con revisión de diffs, automatizaciones y "computer use" (usa apps y el navegador por ti).
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 05</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Desde el móvil</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Desde la app de ChatGPT (iOS y Android) lanzas, supervisas y apruebas tareas de Codex que corren en otra máquina. Tu teléfono es el control remoto.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1.5">
                      <span className="text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Superficie 06</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Code review en GitHub + SDK</h4>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Codex revisa tus pull requests como un compañero (marca lo crítico, P0 y P1) y hasta los corrige. Y con su SDK lo integras en tus propias apps o en tu CI/CD.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: MODELOS QUE IMPULSAN CODEX */}
                <div id="codex-sec-02" className="space-y-6 pt-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">04</strong> • El Cerebro
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Los modelos que impulsan Codex (mediados de 2026)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Codex es la app; el modelo es el cerebro que la mueve por dentro. A mediados de 2026 el motor por defecto es <strong className="text-amber-400">GPT-5.5</strong>, acompañado de un par de hermanos más económicos. No tienes que memorizarlos: con cambiar un valor eliges el que mejor encaje con la tarea y tu presupuesto.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        GPT-5.5 · por defecto
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        El modelo recomendado y el que arranca por defecto. Pensado para coding complejo, uso de computadora, trabajo de conocimiento e investigación. Lanzado el 23 de abril de 2026.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        GPT-5.4 · más económico
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        El frontera insignia, más barato que 5.5. Muy fuerte en coding, razonamiento y flujos agénticos cuando quieres cuidar el consumo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        GPT-5.4-mini · rápido y barato
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        El mini veloz para tareas ágiles, paralelizables y subagentes. Ideal cuando la tarea es chica o cuando quieres de verdad estirar tu cupo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left">
                      <span className="text-amber-400 font-mono tracking-widest text-[10px] font-bold block uppercase">
                        GPT-5.3-codex-spark · preview, solo Pro
                      </span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Un preview de investigación, solo texto, optimizado para iteración de código casi instantánea. Disponible únicamente para suscriptores de ChatGPT Pro.
                      </p>
                    </div>
                  </div>

                  {/* ESFUERZO DE RAZONAMIENTO */}
                  <div className="space-y-3 pt-2 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      El esfuerzo de razonamiento (cuánto piensa antes de responder)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-1">
                        <code className="text-amber-400 font-mono text-xs font-bold block">minimal / low</code>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">Rápido y barato. Para tareas ultra simples y respuestas ágiles.</p>
                      </div>
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-1">
                        <code className="text-amber-400 font-mono text-xs font-bold block">medium</code>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">El punto balanceado y el valor por defecto. Empieza siempre aquí.</p>
                      </div>
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-1">
                        <code className="text-amber-400 font-mono text-xs font-bold block">high</code>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">Para tareas agénticas duras donde no te importa esperar un poco más.</p>
                      </div>
                      <div className="p-4 bg-neutral-950 border border-white/5 rounded-xl space-y-1">
                        <code className="text-amber-400 font-mono text-xs font-bold block">xhigh</code>
                        <p className="text-[10px] text-neutral-400 leading-relaxed">Lo más duro: refactors gigantes, migración compleja y análisis.</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Cambias de modelo o de nivel a mitad de sesión con los comandos <code className="text-amber-400">/model</code> y <code className="text-amber-400">/reasoning</code>, o los fijas en tu archivo de configuración (<code className="text-amber-400">~/.codex/config.toml</code>). Empieza en <code className="text-white">medium</code> y sube solo si tus pruebas muestran una mejora real que justifique más tiempo y costo.
                    </p>
                  </div>

                  <div className="p-5 border border-white/5 bg-neutral-900/20 rounded-2xl space-y-3 text-left">
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      <strong className="text-white">Ojo con las guías viejas:</strong> si una guía te dice que el modelo de Codex es "GPT-5-Codex", "GPT-5.1-Codex" o "GPT-5.3-Codex", está completamente desactualizada — toda esa familia con "-Codex" en el nombre quedó deprecada y fuera del selector para quien entra con cuenta de ChatGPT. El "codex" hoy vive en el producto, no en el nombre del modelo.
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed border-t border-white/5 pt-2">
                      Sobre la "ventana de contexto" (cuánto puede leer de un jalón): en la API, GPT-5.5 llega a ~1 millón de tokens. Dentro de Codex la cifra publicada es de 400.000, aunque hay reportes de usuarios de que en la práctica el límite efectivo es menor. No asumas un número exacto; separa proyectos distintos para que cada sesión vaya enfocada.
                    </p>
                  </div>
                </div>

                {/* SECTION 5: INSTALAR Y USAR PASO A PASO */}
                <div id="codex-sec-03" className="space-y-6 pt-4 text-left scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">05</strong> • Manos a la obra
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Instalar y usar Codex paso a paso
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    La forma más directa de empezar es el CLI: el agente que corre en tu terminal. Es de código abierto y funciona en macOS, Linux y Windows. Elige una forma de instalarlo y sigue los pasos; los comandos son para copiar y pegar.
                  </p>

                  {/* COPIADORES DE CONSOLA */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all overflow-x-auto">npm install -g @openai/codex</code>
                      </div>
                      <span className="text-[10px] text-neutral-500 tracking-wider">Opción 1 • NPM</span>
                      <button onClick={() => handleCopy("npm install -g @openai/codex", "idxCop1")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center">
                        Copiar
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all overflow-x-auto">brew install --cask codex</code>
                      </div>
                      <span className="text-[10px] text-neutral-500 tracking-wider">Opción 2 • Homebrew</span>
                      <button onClick={() => handleCopy("brew install --cask codex", "idxCop2")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center">
                        Copiar
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all overflow-x-auto">curl -fsSL https://chatgpt.com/codex/install.sh | sh</code>
                      </div>
                      <span className="text-[10px] text-neutral-500 tracking-wider">Opción 3 • Script</span>
                      <button onClick={() => handleCopy("curl -fsSL https://chatgpt.com/codex/install.sh | sh", "idxCop3")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center">
                        Copiar
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all overflow-x-auto">codex login</code>
                      </div>
                      <span className="text-[10px] text-neutral-500 tracking-wider">Inicia Sesión</span>
                      <button onClick={() => handleCopy("codex login", "idxCop4")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center">
                        Copiar
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-white/5 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <code className="text-amber-400 select-all overflow-x-auto">codex login status</code>
                      </div>
                      <span className="text-[10px] text-neutral-500 tracking-wider">Verifica login</span>
                      <button onClick={() => handleCopy("codex login status", "idxCop5")} className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center">
                        Copiar
                      </button>
                    </div>
                  </div>

                  {/* STEPS LIST */}
                  <div className="space-y-4 pt-4">
                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">01</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Instala Codex</h4>
                        <p className="text-neutral-400 leading-normal">Elige una de las opciones de arriba (npm, Homebrew o el script). Corre en macOS, Linux y Windows (en Windows, con PowerShell nativo o con WSL2).</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">02</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Inicia sesión</h4>
                        <p className="text-neutral-400 leading-normal">Corre <code className="text-amber-400">codex login</code> y entra con tu cuenta de ChatGPT (de pago) o con una API key de OpenAI. No hay acceso gratis ilimitado: necesitas un plan o saldo de la API.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">03</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Métete a tu proyecto</h4>
                        <p className="text-neutral-400 leading-normal">Abre la terminal dentro de la carpeta de tu proyecto, idealmente un repositorio de git para poder revertir cambios con un clic si algo no te gusta.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">04</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Crea tu AGENTS.md con /init</h4>
                        <p className="text-neutral-400 leading-normal">Dentro de Codex escribe <code className="text-amber-400">/init</code> y te genera un archivo AGENTS.md: las instrucciones de tu proyecto (qué eres, qué reglas seguir, qué comandos correr). Es el equivalente del CLAUDE.md de Claude Code, y Codex lo lee antes de cada tarea.</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">05</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Dale tu primera tarea</h4>
                        <p className="text-neutral-400 leading-normal">Lanza la interfaz con <code className="text-amber-400">codex</code> y pídele algo sin riesgo para ver cómo razona: "explícame este proyecto y qué archivo leo primero". Después sube a tareas concretas: "arregla este bug y muéstrame el diff".</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start border-t border-white/5 pt-4">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">06</span>
                      <div className="space-y-1 text-xs md:text-sm grow">
                        <h4 className="font-bold text-white uppercase">Retoma cuando quieras</h4>
                        <p className="text-neutral-400 leading-normal">Cierra la terminal y vuelve después con <code className="text-amber-400">codex resume --last</code> (o <code className="text-amber-400">codex resume</code> y eliges la sesión). Tu contexto sigue ahí. Para automatizar sin intervención, usa <code className="text-amber-400">codex exec 'tu tarea'</code>.</p>
                      </div>
                    </div>
                  </div>

                  {/* MODOS DE PERMISOS */}
                  <div className="space-y-3 pt-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Los tres modos de permiso (de menos a más libre)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1.5">
                        <span className="text-amber-400 font-mono text-[10px] font-bold block uppercase">Read Only (solo lectura)</span>
                        <p className="text-[11px] text-neutral-400 leading-normal">Codex mira y aconseja, pero no toca nada. Perfecto para explorar un proyecto nuevo o pedir explicaciones sin riesgo.</p>
                      </div>
                      <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1.5">
                        <span className="text-amber-400 font-mono text-[10px] font-bold block uppercase">Auto (por defecto)</span>
                        <p className="text-[11px] text-neutral-400 leading-normal">Edita y ejecuta dentro de tu carpeta, pero te pide permiso para salir de ahí o tocar la red. El modo recomendado para el día a día.</p>
                      </div>
                      <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1.5">
                        <span className="text-amber-400 font-mono text-[10px] font-bold block uppercase">Full Access (todo sin preguntar)</span>
                        <p className="text-[11px] text-neutral-400 leading-normal">Hace lo que quiera sin pedir permiso. Más rápido, más riesgo. Úsalo solo cuando ya confíes en la tarea, y mejor dentro de un contenedor aislado.</p>
                      </div>
                    </div>
                  </div>

                  {/* COMANDOS RAPIDOS */}
                  <div className="space-y-3 pt-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Comandos rápidos (escribes / dentro de Codex)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/init</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Genera el AGENTS.md de tu proyecto.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/model</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Cambia de modelo en tiempo real.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/reasoning</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Ajusta el nivel de razonamiento.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/permissions</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Cambia el modo de seguridad.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/review</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Pide una revisión del trabajo hecho.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/diff</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Muestra los cambios pendientes.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/mcp</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Gestiona tus servidores MCP.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/status</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Ve tu sesión, modelo y cupo.</p>
                      </div>
                      <div className="p-3 bg-neutral-950 border border-white/5 rounded-xl text-left">
                        <code className="text-amber-400 font-mono text-xs font-bold block">/resume</code>
                        <p className="text-[10px] text-neutral-500 leading-relaxed mt-0.5">Retoma una sesión anterior.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 6: CODEX EN TU EDITOR Y EN LA NUBE */}
                <div className="space-y-6 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">06</strong> • Entornos de Trabajo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Codex en tu editor y en la nube
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    ¿Prefieres tu editor? La extensión lleva a Codex dentro de VS Code, Cursor, Windsurf o JetBrains. Y para lo pesado, la nube hace el trabajo sola mientras tú sigues en lo tuyo.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">
                        En tu editor (extensión de IDE)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">1.</span>
                          <p className="text-neutral-400"><strong className="text-white">Busca la extensión:</strong> en tu editor (VS Code, Cursor, Windsurf o IDE de JetBrains) abre Extensiones y busca "OpenAI Codex". Es la oficial de OpenAI, gratuita y con más de 10 millones de instalaciones.</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">2.</span>
                          <p className="text-neutral-400"><strong className="text-white">Inicia sesión:</strong> pulsa "Sign in with ChatGPT" (tu plan ya incluye el uso) o pega una API key. El panel de Codex aparece a un lado del editor.</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">3.</span>
                          <p className="text-neutral-400"><strong className="text-white font-sans">Dale contexto:</strong> abre o selecciona archivos, o referéncialos con @nombre. Elige modo (Chat, Agent o Full Access), modelo y razonamiento, pide cambios y revisa los diffs en línea antes de aplicarlos.</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">4.</span>
                          <p className="text-neutral-400"><strong className="text-white">Delega lo pesado:</strong> para tareas grandes, pulsa "Run in the cloud" desde tu conversación local. Codex sigue trabajando en segundo plano y tú revisas el resultado sin perder el contexto. Es el mismo agente y la misma cuenta en terminal, editor y nube.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/5 pb-2">
                        En la nube (tareas que corren solas)
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">1.</span>
                          <p className="text-neutral-400"><strong className="text-white font-sans">Entra a chatgpt.com/codex:</strong> con un plan ChatGPT Plus, Pro, Business, Edu o Enterprise. (El plan Free sirve para explorar; las tareas en la nube que hacen útil a Codex aparecen desde Plus.)</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">2.</span>
                          <p className="text-neutral-400"><strong className="text-white">Conecta tu GitHub:</strong> autoriza el o los repositorios donde quieres que Codex trabaje. Esa conexión le permite leer tu código y crear pull requests.</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">3.</span>
                          <p className="text-neutral-400"><strong className="text-white">Describe la tarea y suéltala:</strong> elige repo y rama, describe lo que quieres en lenguaje natural ("encuentra y arregla bugs con cambios mínimos") y envía. Corre en un contenedor aislado, en segundo plano, incluso varias tareas a la vez.</p>
                        </div>
                        <div className="flex gap-3 text-xs leading-relaxed">
                          <span className="text-amber-400 font-bold shrink-0 font-mono">4.</span>
                          <p className="text-neutral-400"><strong className="text-white font-sans">Revisa el diff y crea el PR:</strong> cuando termina, ves todos los cambios como diff. Aceptas y creas el pull request en GitHub, o lo pruebas en local con <code className="text-amber-400">git fetch && git checkout &lt;rama&gt;</code>.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-white/5 bg-neutral-900/20 rounded-2xl text-left">
                    <p className="text-xs text-neutral-350 leading-relaxed mb-0">
                      <strong className="text-white">Bonus — code review en GitHub:</strong> Codex puede revisar tus pull requests como un compañero. Se activa en <code className="text-amber-400">chatgpt.com/codex/settings/code-review</code> (o comentando <code className="text-amber-400">@codex review</code> en cualquier PR). Razona sobre todo el repo, corre el código para validar, y marca solo lo serio (P0 y P1) para no llenarte de ruido. Si quieres que corrija lo que encontró, le respondes <code className="text-amber-400">@codex fix</code>.
                    </p>
                  </div>
                </div>

                {/* SECTION 7: PLANTILLAS Y PROMPTS */}
                <div className="space-y-6 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">07</strong> • Para estrenarlo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Plantillas y prompts para tus primeras sesiones
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Ya lo instalaste; ahora estrénalo bien. Primero tu <strong className="text-amber-400">AGENTS.md</strong> (el manual que Codex lee antes de cada tarea); después, prompts listos para tus primeros encargos. Rellena lo que está entre [corchetes] y pégalos tal cual.
                  </p>

                  <div className="space-y-6">
                    {/* Prompt 1 */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display">Tu AGENTS.md de arranque (el "manual" de tu proyecto)</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Codex lee este archivo antes de cada tarea — es su contexto fijo, el equivalente del CLAUDE.md de Claude Code. Créalo en la raíz de tu proyecto (o deja que /init lo genere) y pega esto adentro, ajustando lo que esté entre corchetes.</p>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">AGENTS.md • WENTIX</span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.codexAgentsStart, "pCodex1")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] font-mono rounded hover:bg-neutral-700 transition-colors">Copia</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-48 text-left">{PROMPTS_TEXTS.codexAgentsStart}</pre>
                      </div>
                    </div>

                    {/* Prompt 2 */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display">Primera tarea sin riesgo (conoce cómo razona)</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Antes de dejarlo tocar nada, ponlo en modo solo lectura y pídele que te explique tu proyecto. Así ves cómo entiende tu código sin arriesgar un solo archivo.</p>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">PROMPT • WENTIX</span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.codexPrimeraTarea, "pCodex2")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] font-mono rounded hover:bg-neutral-700 transition-colors">Copia</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-40 text-left">{PROMPTS_TEXTS.codexPrimeraTarea}</pre>
                      </div>
                    </div>

                    {/* Prompt 3 */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display">Construir una feature completa (con verificación)</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">Para delegar un trabajo entero. Le das el objetivo, las restricciones y cómo sabremos que quedó bien, y le pides que verifique antes de cantar victoria.</p>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">PROMPT • WENTIX</span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.codexConstruirFeature, "pCodex3")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] font-mono rounded hover:bg-neutral-700 transition-colors">Copia</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-48 text-left">{PROMPTS_TEXTS.codexConstruirFeature}</pre>
                      </div>
                    </div>

                    {/* Prompt 4 */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display">Arreglar un bug y mostrar el diff</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">El clásico: describe el problema, deja que rastree la causa raíz y exige ver el cambio antes de aceptarlo. Trabaja sobre git para revertir si hace falta.</p>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">PROMPT • WENTIX</span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.codexArreglarBug, "pCodex4")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] font-mono rounded hover:bg-neutral-700 transition-colors">Copia</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-40 text-left">{PROMPTS_TEXTS.codexArreglarBug}</pre>
                      </div>
                    </div>

                    {/* Prompt 5 */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display">Que te configure Codex (o tu agente) de cero</h4>
                        <p className="text-xs text-neutral-400 mt-0.5">¿No sabes por dónde empezar? Pega esto en Codex (o en tu agente de confianza) y deja que él te guíe por la instalación, el login, el AGENTS.md y un primer MCP útil.</p>
                      </div>
                      <div className="border border-white/5 rounded-xl bg-neutral-950 overflow-hidden">
                        <div className="p-3 bg-neutral-900 border-b border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">PROMPT • WENTIX</span>
                          <button onClick={() => handleCopy(PROMPTS_TEXTS.codexConfigurarDeCero, "pCodex5")} className="px-2.5 py-0.5 bg-neutral-800 text-[10px] font-mono rounded hover:bg-neutral-700 transition-colors">Copia</button>
                        </div>
                        <pre className="p-3 text-[10px] font-mono text-neutral-400 select-all overflow-auto max-h-40 text-left">{PROMPTS_TEXTS.codexConfigurarDeCero}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 8: PLANES Y PRECIOS */}
                <div id="codex-sec-04" className="space-y-6 pt-4 text-left scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">08</strong> • El Dinero
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Planes, precios y cómo se mide el uso
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Codex no se vende aparte: viene incluido en los planes de ChatGPT. Lo que cambia entre planes es <strong className="text-amber-400">cuánto puedes usarlo</strong> antes de toparte con el límite. Aquí está el panorama, con una advertencia por delante: estos números cambian seguido.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-neutral-400 font-display uppercase tracking-widest">Free</h4>
                      <strong className="text-amber-400 text-xl font-display font-black block">$0</strong>
                      <p className="text-[10px] text-neutral-400">Para explorar y tareas locales simples. Sin lo bueno de la nube.</p>
                    </div>

                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-neutral-400 font-display uppercase tracking-widest">Plus</h4>
                      <strong className="text-amber-400 text-xl font-display font-black block">$20/mes</strong>
                      <p className="text-[10px] text-neutral-400">El punto de entrada real: ya incluye las tareas en la nube y el code review.</p>
                    </div>

                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-neutral-400 font-display uppercase tracking-widest">Pro 5x</h4>
                      <strong className="text-amber-400 text-xl font-display font-black block">$100/mes</strong>
                      <p className="text-[10px] text-neutral-400">5× más uso de Codex que Plus. El salto natural si Codex se te queda corto.</p>
                    </div>

                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-neutral-400 font-display uppercase tracking-widest">Pro 20x</h4>
                      <strong className="text-amber-400 text-xl font-display font-black block">$200/mes</strong>
                      <p className="text-[10px] text-neutral-400">20× el uso de Plus. Para quien vive dentro de Codex todo el día.</p>
                    </div>

                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-neutral-400 font-display uppercase tracking-widest font-sans">Business / Edu</h4>
                      <strong className="text-amber-400 text-lg font-display uppercase tracking-wide block">Por asiento</strong>
                      <p className="text-[10px] text-neutral-400">Para equipos. Con precio flexible, compran créditos de workspace sin límites fijos.</p>
                    </div>

                    <div className="p-5 border border-white/5 bg-neutral-900/30 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-white font-display uppercase tracking-widest">Enterprise</h4>
                      <strong className="text-amber-400 text-lg font-display uppercase block">Ventas</strong>
                      <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">Controles de gasto, créditos de workspace y administración global.</p>
                    </div>
                  </div>

                  {/* PRICING TABLE */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                      Lo que cuesta por tokens (créditos por 1 millón de tokens)
                    </h4>
                    <div className="overflow-x-auto border border-white/5 rounded-2xl bg-neutral-900/10">
                      <table className="w-full text-left font-sans text-xs md:text-sm">
                        <thead>
                          <tr className="bg-neutral-900/80 text-neutral-400 font-mono text-[10px] tracking-widest uppercase border-b border-white/5">
                            <th className="p-4">Modelo</th>
                            <th className="p-4 text-amber-500">Entrada</th>
                            <th className="p-4 text-cyan-400">Entrada cacheada</th>
                            <th className="p-4 text-purple-400">Salida</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-neutral-300 font-mono text-xs">
                          <tr>
                            <td className="p-4 font-bold text-white font-sans">GPT-5.5</td>
                            <td className="p-4">125</td>
                            <td className="p-4">12.50</td>
                            <td className="p-4">750</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white font-sans">GPT-5.4</td>
                            <td className="p-4">62.50</td>
                            <td className="p-4">6.25</td>
                            <td className="p-4">375</td>
                          </tr>
                          <tr>
                            <td className="p-4 font-bold text-white font-sans">GPT-5.4-mini</td>
                            <td className="p-4">18.75</td>
                            <td className="p-4">1.875</td>
                            <td className="p-4">113</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* QUOTA RULES CHECKLIST */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Cómo funciona el cupo (en simple)
                    </h4>
                    <ul className="space-y-2.5 text-xs text-neutral-400 leading-relaxed">
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>El uso se mide en una ventana móvil de 5 horas que comparten tus tareas locales (en tu máquina) y las de la nube: gastar en una te resta de la otra.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>Encima puede aplicar un límite semanal adicional. Su día y hora de reinicio no son fijos, así que no cuentes con un horario exacto.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>Desde abril de 2026 el cobro es por tokens (créditos por millón), no por mensaje. La "entrada cacheada" tiene cerca de 90% de descuento.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>Si te quedas sin cupo (en Plus y Pro): compras créditos extra en Codex Settings → Usage → Credits, o bajas a un modelo más chico como GPT-5.4-mini.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>Puedes activar la recarga automática (auto top-up) para no quedarte a media tarea, con un tope mensual si quieres.</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-amber-400 select-none">•</span>
                        <span>¿Prefieres pagar solo por lo que usas, por token? Entra con una API key: pagas a tarifas estándar de la API, pero pierdes las funciones de nube (como el code review en GitHub).</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-5 border border-amber-500/20 bg-amber-950/10 rounded-2xl text-left">
                    <p className="text-xs text-amber-200 leading-relaxed mb-0">
                      <strong>Léelo antes de presupuestar:</strong> los números de Codex cambian muy seguido y los rangos de mensajes dependen del tamaño de cada tarea. Toma estas cifras como referencia, no como contrato: antes de presupuestar, confírmalas en <code className="text-white">developers.openai.com/codex/pricing</code>. Un dato que OpenAI no publica claro es cuántos dólares vale un crédito, así que no te fíes de conversiones que veas por ahí.
                    </p>
                  </div>
                </div>

                {/* SECTION 9: QUE PUEDE HACER CODEX */}
                <div id="codex-sec-05" className="space-y-6 pt-4 text-left scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">09</strong> • Funcionalidades
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Qué puede hacer Codex (casos concretos)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Codex hace el ciclo completo de programación, pero no necesitas ser programador para aprovecharlo. Estos son casos reales que puedes pedirle desde el primer día — cada uno con un ejemplo para que veas cómo se le habla.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 01</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Construye features de punta a punta</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Crea el andamiaje (carpetas, módulos, stubs de API) y arma funciones completas. Ejemplo: "agrega un componente nuevo con sus pruebas y abre un PR".</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 02</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Caza y arregla bugs</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Rastrea la causa raíz, propone el arreglo y te muestra el diff. Ejemplo: "arregla el bug del login, enséñame el cambio y haz commit".</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 03</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Escribe y corre pruebas</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Tiene terminal integrada: escribe los tests y los ejecuta hasta que pasan. Ejemplo: "escribe pruebas del módulo de pagos y córrelas".</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 04</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Te explica un proyecto que no conoces</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Mapea bases de código nuevas y te dice qué leer antes de tocar nada. Ejemplo: "explícame cómo funciona la autenticación y qué archivo edito primero".</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 05</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Entiende imágenes y capturas</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans font-sans">Arrastras una captura de una pantalla rota y la arregla. Hasta abre su propio navegador, mira lo que construyó y adjunta una captura del resultado.</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 06</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Trabaja en paralelo en la nube</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Lanzas varias features o bugs a la vez, cada uno en su propio espacio aislado, y los revisas a medida que terminan.</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 07</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Se conecta a tus herramientas (MCP)</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal font-sans">Vía MCP usa Figma, Linear, GitHub, el navegador, documentación al día o Sentry. Se agrega con un comando: <code className="text-amber-400 font-mono">codex mcp add &lt;nombre&gt;</code>.</p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-1">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase">Capacidad 08</span>
                      <h4 className="text-xs font-bold text-white uppercase font-display">Se personaliza con AGENTS.md y Skills</h4>
                      <p className="text-[11px] text-neutral-400 leading-normal text-left">El AGENTS.md le da reglas fijas por proyecto, y las Skills empaquetan flujos reutilizables que carga solo cuando hacen falta.</p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 leading-normal pt-2">
                    En benchmarks de coding, OpenAI reporta para GPT-5.5 alrededor de 88.7% en <strong className="text-white font-sans">SWE-bench Verified</strong> y más de 2 millones de usuarios semanales de Codex. Como todo benchmark, tómalo como brújula: lo que importa es cómo rinde con tus tareas reales.
                  </p>
                </div>

                {/* SECTION 10: LIMITES, SEGURIDAD Y PRIVACIDAD */}
                <div className="space-y-6 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">10</strong> • Advertencias
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Límites, seguridad y privacidad
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350">
                    Codex es potente, pero no es magia y no es autónomo: es un colaborador junior muy rápido al que hay que revisar. Saber esto desde el principio te ahorra sustos.
                  </p>

                  {/* CHECKLIST */}
                  <div className="space-y-3.5">
                    <div className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-amber-500 font-bold">›</span>
                      <p className="text-neutral-400"><strong className="text-white">No reemplaza la revisión humana:</strong> OpenAI lo diseña como herramienta supervisada: revisa siempre lo que te entrega, sobre todo si toca seguridad, datos o dinero.</p>
                    </div>
                    <div className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-amber-500 font-bold">›</span>
                      <p className="text-neutral-400"><strong className="text-white">Puede ejecutar acciones destructivas:</strong> un "limpia esta carpeta" o "resetea la rama" puede esconder un borrado irreversible. Trabaja sobre git y haz checkpoints antes y después.</p>
                    </div>
                    <div className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-amber-500 font-bold">›</span>
                      <p className="text-neutral-400"><strong className="text-white">Sigue alucinando:</strong> es mucho mejor que antes, pero todavía puede inventar; no des por hecho lo que escribe sin verificarlo.</p>
                    </div>
                    <div className="flex gap-3 text-xs leading-relaxed">
                      <span className="text-amber-500 font-bold">›</span>
                      <p className="text-neutral-400"><strong className="text-white">No todo está en todas las superficies:</strong> la nube y el trabajo en paralelo son lo más potente, pero requieren configurar el entorno.</p>
                    </div>
                  </div>

                  {/* SAFETY GRIDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1 text-xs">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase bg-neutral-950 px-2 py-0.5 rounded w-max">Protección</span>
                      <h4 className="font-bold text-white uppercase font-display mt-2 mb-1">Dos candados: sandbox + aprobaciones</h4>
                      <p className="text-neutral-400 leading-normal font-sans">
                        El sandbox limita técnicamente qué puede tocar (archivos de tu proyecto, y la red apagada por defecto). Las aprobaciones deciden cuándo debe detenerse a pedirte permiso. Trabajan juntos de manera transparente.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1 text-xs">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase bg-neutral-950 px-2 py-0.5 rounded w-max">Amenaza P0</span>
                      <h4 className="font-bold text-white uppercase font-display mt-2 mb-1">El mayor riesgo: prompt injection</h4>
                      <p className="text-neutral-400 leading-normal font-sans">
                        Contenido de una web o una herramienta puede engañar al agente para que siga instrucciones maliciosas. Por eso la red va cerrada por defecto y la búsqueda web usa caché. Trata siempre lo que llega de internet como no confiable.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1 text-xs">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase bg-neutral-950 px-2 py-0.5 rounded w-max">Peligro</span>
                      <h4 className="font-bold text-white uppercase font-display mt-2 mb-1">Abrir internet = asumir riesgos</h4>
                      <p className="text-neutral-400 leading-normal font-sans">
                        Si habilitas acceso a la red, podrías exponerte a inyección de prompts, fuga de credenciales o código con licencias restringidas. Hazlo solo cuando la tarea lo pida y limita de forma explícita los dominios de confianza.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-1 text-xs">
                      <span className="text-amber-400 font-mono text-[9px] font-bold block uppercase bg-neutral-950 px-2 py-0.5 rounded w-max">Privacidad</span>
                      <h4 className="font-bold text-white uppercase font-display mt-2 mb-1">Tus datos y la privacidad</h4>
                      <p className="text-neutral-400 leading-normal font-sans">
                        Por defecto, los datos que mandas a la API de OpenAI no se usan para entrenar modelos. Las peticiones a los modelos de Codex se fuerzan a no guardarse a largo plazo (ZDR a nivel de modelo). El borrado total a nivel de cuenta existe, pero se solicita y aprueba aparte.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 11: LAS NOVEDADES DE 2026 */}
                <div className="space-y-6 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500">11</strong> • Lo Nuevo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Las novedades de 2026, en orden
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-350 leading-relaxed">
                    Codex se mueve casi cada semana. Esta línea de tiempo te pone al día con lo más importante del año para que entiendas en qué punto está hoy de la ingeniería.
                  </p>

                  <div className="border-l-2 border-dashed border-white/10 pl-6 ml-4 space-y-8">
                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">5 Feb 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">GPT-5.3-Codex</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Primer modelo que OpenAI trata como de "alta capacidad" en ciberseguridad, con salvaguardas activadas por precaución.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">12 Feb 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">GPT-5.3-Codex-Spark</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">El primer modelo de OpenAI pensado para coding en tiempo real (+1000 tokens/segundo), y el primero desplegado de forma nativa en hardware Cerebras.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">2 Apr 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Cobro por tokens</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Codex deja de cobrar por mensaje y pasa a cobrar por tokens (créditos por millón), con entrada de caché con gran descuento de casi el 90%.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">9 Apr 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Nuevo plan Pro de $100 (5x)</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Aparece un nivel intermedio entre Plus ($20) y el Pro de $200, con 5× el uso de Codex frente a Plus.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">16 Apr 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">La gran actualización</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Computer Use en segundo plano, navegador integrado (prueba tu app y verifica visualmente el arreglo), revisión de PRs, modo Goals y más de 90 plugins oficiales.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">23 Apr 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">GPT-5.5, el nuevo default</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">El modelo frontera más reciente de OpenAI para coding y trabajo profesional pasa a ser el predeterminado de Codex.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">14 May 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Codex en el móvil</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Llega a la app de ChatGPT (iOS y Android), para todos los planes: lanzas, supervisas y apruebas tareas desde el teléfono.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-neutral-950" />
                      <span className="text-[10px] font-mono font-bold text-amber-500 block uppercase font-sans tracking-wider">Junio 2026</span>
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display mt-0.5">Sites, Bedrock y migración</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1">Plugin "Sites" para crear y publicar sitios, integración con Amazon Bedrock, y flujos para importar tu setup desde Claude Code y Claude Cowork.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 12: PREGUNTAS FRECUENTES */}
                <div className="space-y-6 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">12</strong> • Dudas Comunes
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Preguntas frecuentes
                    </h3>
                  </div>

                  <div className="space-y-6 divide-y divide-white/5">
                    <div className="space-y-2 text-xs md:text-sm text-left">
                      <h4 className="font-bold text-amber-400 mt-2">¿Codex es gratis?</h4>
                      <p className="text-neutral-450 leading-relaxed font-sans">Viene incluido en todos los planes de ChatGPT (no se vende aparte). Hay un nivel Free para explorar y tareas locales simples, pero las funciones que de verdad lo hacen útil — como las tareas en la nube y el code review — aparecen desde el plan Plus ($20/mes).</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400">¿Necesito saber programar para usarlo?</h4>
                      <p className="text-neutral-450 leading-relaxed font-sans">Para empezar, no: le hablas en lenguaje natural y él construye. Pero sí necesitas revisar y aprobar lo que hace, sobre todo en cambios delicados. Piénsalo como un colaborador junior muy rápido al que hay que dirigir y supervisar.</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400 font-display">¿En qué se diferencia de ChatGPT normal?</h4>
                      <p className="text-neutral-450 leading-relaxed font-sans">ChatGPT conversa y te sugiere texto; Codex actúa sobre tu código real: lo lee, lo edita y lo ejecuta, en tu computadora o en su nube. ChatGPT te da consejo; Codex hace la tarea.</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400">¿Qué modelo me conviene usar?</h4>
                      <p className="text-neutral-450 leading-relaxed font-sans font-sans">Deja GPT-5.5 (el default) para lo complejo. Para tareas chicas o para estirar tu cupo, baja a GPT-5.4-mini. Cambias en un segundo con <code className="text-amber-400">/model</code>. Y recuerda: la vieja familia con "-Codex" en el nombre ya está deprecada.</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400 font-display">¿Es seguro darle acceso a mi código?</h4>
                      <p className="text-neutral-450 leading-relaxed font-sans">Sí, si respetas los modos. Empieza en Read Only o Auto, trabaja sobre git para revertir fácil, y reserva Full Access (y el flag --yolo) para entornos aislados. El mayor riesgo es la inyección de prompts, por eso la red va cerrada por defecto.</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400 font-display">¿OpenAI entrena con mi código?</h4>
                      <p className="text-neutral-450 leading-relaxed">Por defecto, lo que mandas a la API no se usa para entrenar modelos, y las peticiones a los modelos de Codex se fuerzan a no guardarse a largo plazo. El borrado total a nivel de cuenta (ZDR) existe pero se solicita y aprueba aparte, sobre todo para empresas.</p>
                    </div>

                    <div className="space-y-2 text-xs md:text-sm text-left pt-4">
                      <h4 className="font-bold text-amber-400">¿En qué se parece a Claude Code?</h4>
                      <p className="text-neutral-455 leading-relaxed font-sans">Muchísimo: ambos son agentes de codificación que viven en terminal, editor y nube, leen tu repo y proponen cambios. Hasta los archivos de instrucciones se parecen (AGENTS.md en Codex ≈ CLAUDE.md en Claude Code). No tienes que elegir uno: saber usar los dos es una ventaja.</p>
                    </div>
                  </div>

                  <div className="p-5 border border-white/5 bg-neutral-900/10 rounded-2xl text-left font-sans text-xs mt-6 leading-relaxed">
                    <p className="text-neutral-400 mb-0">
                      <strong>Cierre de la guía:</strong> Codex es un agente de programación de primera línea y la competencia directa de Claude Code. La jugada inteligente no es elegir un bando, sino entender las dos herramientas: lo que aprendes en una se transfiere casi tal cual a la otra (hasta los archivos de instrucciones se parecen). Empieza en los modos seguros, trabaja sobre git y revisa siempre lo que te entrega.
                    </p>
                  </div>

                  {/* FUENTES OFICIALES SECTION */}
                  <div className="space-y-3 pt-4 text-left">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                      Fuentes oficiales externas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <a 
                        href="https://openai.com/codex/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Página oficial de Codex</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal">openai.com/codex: la visión general del agente y sus superficies integradas.</span>
                        </div>
                      </a>

                      <a 
                        href="https://developers.openai.com/codex" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Doc. para desarrolladores</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal">developers.openai.com/codex: instalación, modelos, precios y configuración.</span>
                        </div>
                      </a>

                      <a 
                        href="https://github.com/openai/codex" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Repositorio del CLI (open source)</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal">github.com/openai/codex: el código abierto de la interfaz CLI (Apache-2.0, en Rust).</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "plugins-claude" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                    <span>Lección 09 de Wentix • Claude Code</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Plugins de Claude Code: los <span className="text-amber-400 italic">5</span> que le faltan a tu Claude
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Si usas Claude Code sin plugins, lo estás usando a la mitad. Los plugins le suman <strong className="text-white font-semibold">superpoderes en un comando</strong>: que pruebe lo que construye, que diseñe bonito, que maneje el navegador, que no se rinda y que use documentación al día. En Wentix AI te dejamos qué son, cómo funciona el directorio oficial y cómo instalar los cinco más útiles —copiando y pegando—.
                  </p>
                </div>

                {/* THE 4 GLANCE CELLS (INTERACTIVE NAVIGATION BUTTONS) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("pclip-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Qué es un plugin (y qué te suma)</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("pclip-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">El directorio oficial y cómo instalar</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("pclip-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Los 5 imprescindibles</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("pclip-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 focus:outline-none border-b-2 border-transparent hover:border-amber-500/40 w-full"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Más marketplaces, seguridad y FAQ</span>
                  </button>
                </div>

                {/* SECTION 1: QUE ES UN PLUGIN */}
                <div id="pclip-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • La Idea Base
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      ¿Qué es un plugin de Claude?
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Un plugin es como una <strong className="font-mono text-amber-400">app para tu Claude Code</strong>: un paquetito que le agrega habilidades, comandos o herramientas que no traía de fábrica. No cambias nada de tu computadora ni escribes código — solo lo instalas y Claude empieza a hacer cosas nuevas.
                  </p>

                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-sans">
                    Claude Code es muy bueno tal cual, pero genérico. Los plugins lo afilan para lo que tú haces: uno lo vuelve mejor probando, otro mejor diseñando, otro le da ojos para navegar la web. Por eso se dice que sin plugins lo estás usando a la mitad.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 font-sans">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Habilidades</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Le enseñan a Claude a hacer algo nuevo: probar tu código de forma automática, diseñar interfaces coherentes y depurar solo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 font-sans">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">Comandos</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Atajos rápidos que escribes con <code className="text-white">/</code> para lanzar una tarea, como <code className="text-white">/ralph-loop</code> sin escribir un prompt largo.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 font-sans">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase font-bold">Herramientas</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Conexiones directas a cosas de afuera, como el navegador Playwright o documentación web real para evitar alucinaciones.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Wentix • Importante</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0 font-sans">
                      <strong>Ojo:</strong> los plugins son de <strong>Claude Code</strong> (la versión que corre en tu terminal o editor como VS Code). Si todavía no lo tienes configurado, instálalo primero en tu computadora; después vuelves aquí a sumarle superpoderes.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: COMO SE INSTALAN */}
                <div id="pclip-sec-02" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • El Procedimiento
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Cómo se instalan: el directorio oficial y 3 pasos
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Todos los plugins viven en un mismo lugar: el <strong>directorio oficial de Anthropic</strong>. Lo puedes abrir en la web en <a href="https://claude.com/plugins" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">claude.com/plugins</a> —ahí buscas, ves cuántas instalaciones tiene cada uno y cuáles traen el sello "Anthropic verified"— o directo dentro de Claude Code escribiendo el comando principal <code className="text-white">/plugin</code>.
                  </p>

                  <div className="space-y-4">
                    <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
                      <div className="relative text-left">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-amber-500 text-xs text-amber-400 font-mono font-bold">1</span>
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight">Encuéntralo</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1 font-sans">
                          En claude.com/plugins busca el plugin que quieres y abre su página (o usa el buscador del comando /plugin).
                        </p>
                      </div>

                      <div className="relative text-left">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">2</span>
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight">Copia el comando</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1 font-sans">
                          Cada plugin de la web oficial trae su comando de instalación, casi siempre con esta forma: <code className="text-white">nombre@claude-plugins-official</code>.
                        </p>
                      </div>

                      <div className="relative text-left">
                        <span className="absolute -left-[35px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-400 font-mono font-bold">3</span>
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight">Pégalo y ejecuta</h4>
                        <p className="text-[11px] text-neutral-400 leading-relaxed mt-1 font-sans">
                          Lo pegas en la terminal interactiva de Claude Code, das Enter y se instalará automáticamente. Luego corres el comando de recarga para activarlo en caliente.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* STEP COMMAND COPIERS */}
                  <div className="space-y-2 pt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <code className="text-amber-400 font-bold select-all break-all">{PROMPTS_TEXTS.pluginCmdOpen}</code>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">Paso 1: Abre el gestor de plugins local en tu terminal con interfaz interactiva.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdOpen, "pInst1")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                      >
                        {copiedStates["pInst1"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <code className="text-amber-400 font-bold select-all break-all">{PROMPTS_TEXTS.pluginCmdFrontend}</code>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">Paso 2: Instala el plugin frontend-design desde el catálogo por defecto.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdFrontend, "pInst2")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                      >
                        {copiedStates["pInst2"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-955 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <code className="text-amber-400 font-bold select-all break-all">{PROMPTS_TEXTS.pluginReload}</code>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">Paso 3: Recarga todos tus plugins instalados en caliente para activarlos de inmediato.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.pluginReload, "pInst3")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                      >
                        {copiedStates["pInst3"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 text-left font-sans">
                    El marketplace oficial (<code className="text-white">claude-plugins-official</code>) viene preconfigurado y listo de fábrica en Claude Code: no tienes que registrar nada externo para descargar los paquetes básicos de Anthropic.
                  </p>
                </div>

                {/* SECTION 3: LOS 5 IMPRESCINDIBLES */}
                <div id="pclip-sec-03" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • El Top 5
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Los 5 plugins imprescindibles que le faltan a tu Claude
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed text-left font-sans">
                    Estos son los cinco plugins que más transforman tu experiencia con la terminal de Anthropic. Instalados en orden: primero para programar con método estructurado, segundo para diseño estético, tercero para navegación del navegador, cuarto para no rendirse y quinto para la documentación más reciente.
                  </p>

                  {/* PLUGIN CARDS COMPONENT-STYLE LIST */}
                  <div className="space-y-6 font-sans">
                    {/* 01: Superpowers */}
                    <div className="p-6 bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 rounded-2xl relative pl-16 md:pl-20 text-left space-y-3 transition-colors">
                      <div className="absolute left-4 top-6 w-10 h-10 border border-amber-500/40 rounded-xl bg-neutral-950 flex items-center justify-center font-display font-black text-amber-400 text-lg">
                        01
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight m-0">Superpowers</h4>
                        <span className="font-mono text-amber-500 text-[9px] font-semibold uppercase tracking-widest block mt-0.5">Como tener un programador senior vigilando tu código</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Le inyecta a Claude un set completo de habilidades avanzadas: escribe pruebas automatizadas para asegurar la estabilidad, depura errores complejos él solo mediante logs estructurados y te plantea un plan de acción estructurado antes de empezar a escribir código que pueda romper el stack.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-left">
                        <code className="text-amber-400 font-bold select-all truncate shrink grow">{PROMPTS_TEXTS.pluginCmdSuperpowers}</code>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdSuperpowers, "pTop1")} 
                          className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded font-medium text-[9px] uppercase shrink-0 hover:bg-neutral-800 transition"
                        >
                          {copiedStates["pTop1"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-950/40 border border-white/5 rounded-lg text-neutral-300 text-[11px] leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[9px] block uppercase font-bold tracking-widest mb-1">CÓMO USARLO</strong>
                        Pídele una lluvia de ideas o un plan técnico inicial: las habilidades de depuración se activan de fondo solas en cuanto sean necesarias.
                      </div>
                    </div>

                    {/* 02: Frontend Design */}
                    <div className="p-6 bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 rounded-2xl relative pl-16 md:pl-20 text-left space-y-3 transition-colors">
                      <div className="absolute left-4 top-6 w-10 h-10 border border-amber-500/40 rounded-xl bg-neutral-950 flex items-center justify-center font-display font-black text-amber-400 text-lg">
                        02
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight m-0">Frontend Design</h4>
                        <span className="font-mono text-amber-500 text-[9px] font-semibold uppercase tracking-widest block mt-0.5">Le quita la firma visual 'Hecho por IA'</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Obliga a Claude a no usar tarjetas de Tailwind generas por default que todo el mundo reconoce instantáneamente: aplica tipografía coherente (Inter + Space Grotesk), transiciones limpias y paletas de color con alta jerarquía estética.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-955 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-left">
                        <code className="text-amber-400 font-bold select-all truncate shrink grow">{PROMPTS_TEXTS.pluginCmdFrontend}</code>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdFrontend, "pTop2")} 
                          className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded font-medium text-[9px] uppercase shrink-0 hover:bg-neutral-800 transition"
                        >
                          {copiedStates["pTop2"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-950/40 border border-white/5 rounded-lg text-neutral-300 text-[11px] leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[9px] block uppercase font-bold tracking-widest mb-1">CÓMO USARLO</strong>
                        Solo pídele las interfaces del front como siempre en tu prompt regular; el plugin altera sus prioridades de diseño implícitamente de fondo.
                      </div>
                    </div>

                    {/* 03: Playwright */}
                    <div className="p-6 bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 rounded-2xl relative pl-16 md:pl-20 text-left space-y-3 transition-colors">
                      <div className="absolute left-4 top-6 w-10 h-10 border border-amber-500/40 rounded-xl bg-neutral-950 flex items-center justify-center font-display font-black text-amber-400 text-lg">
                        03
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight m-0">Playwright MCP</h4>
                        <span className="font-mono text-amber-500 text-[9px] font-semibold uppercase tracking-widest block mt-0.5">Le da ojos y manos reales a Claude de tu navegador</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Le da la habilidad técnica de levantar un navegador web silencioso (Chromium) de forma local. Claude puede dar clics en botones reales, llenar formularios extensos de registro, tomar capturas de pantalla de tu web encendida locales para auditar su responsive y hacer testing funcional completo.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-left">
                        <code className="text-amber-400 font-bold select-all truncate shrink grow">{PROMPTS_TEXTS.pluginCmdPlaywright}</code>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdPlaywright, "pTop3")} 
                          className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded font-medium text-[9px] uppercase shrink-0 hover:bg-neutral-800 transition"
                        >
                          {copiedStates["pTop3"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-950/40 border border-white/5 rounded-lg text-neutral-300 text-[11px] leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[9px] block uppercase font-bold tracking-widest mb-1">CÓMO USARLO</strong>
                        Pídele expresamente interactuar con tu web local encendida: "Levanta el local, entra a localhost:3000 con el navegador y verifícame que el modal de cobro cargue sin bugs."
                      </div>
                    </div>

                    {/* 04: Ralph Loop */}
                    <div className="p-6 bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 rounded-2xl relative pl-16 md:pl-20 text-left space-y-3 transition-colors">
                      <div className="absolute left-4 top-6 w-10 h-10 border border-amber-500/40 rounded-xl bg-neutral-950 flex items-center justify-center font-display font-black text-amber-400 text-lg">
                        04
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight m-0">Ralph Loop</h4>
                        <span className="font-mono text-amber-500 text-[9px] font-semibold uppercase tracking-widest block mt-0.5">Vuelve a Claude excepcionalmente persistente</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        A veces el agente de consola se detiene o se desvía a mitad de un proceso iterativo de optimización. Ralph fuerza loops de retroalimentación interna persistentes, repitiendo y limando los archivos hasta cumplir las especificaciones lógicas garantizadas que le pediste.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-left">
                        <code className="text-amber-400 font-bold select-all truncate shrink grow">{PROMPTS_TEXTS.pluginCmdRalph}</code>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdRalph, "pTop4")} 
                          className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded font-medium text-[9px] uppercase shrink-0 hover:bg-neutral-800 transition"
                        >
                          {copiedStates["pTop4"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-950/40 border border-white/5 rounded-lg text-neutral-300 text-[11px] leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[9px] block uppercase font-bold tracking-widest mb-1">CÓMO USARLO</strong>
                        Lánzalo diciendo: <code className="text-white">/ralph-loop "tu tarea aquí" --max-iterations 10 --completion-promise "DONE"</code>. Se detendrá únicamente cuando verifique de verdad que se cumplió el criterio.
                      </div>
                    </div>

                    {/* 05: Context7 */}
                    <div className="p-6 bg-neutral-900/30 border border-white/5 hover:border-amber-500/20 rounded-2xl relative pl-16 md:pl-20 text-left space-y-3 transition-colors">
                      <div className="absolute left-4 top-6 w-10 h-10 border border-amber-500/40 rounded-xl bg-neutral-950 flex items-center justify-center font-display font-black text-amber-400 text-lg">
                        05
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-tight m-0">Context7</h4>
                        <span className="font-mono text-amber-500 text-[9px] font-semibold uppercase tracking-widest block mt-0.5">Se acabó el Claude inventando funciones obsoletas</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Inyecta de forma precisa documentación fresca y oficial de librerías modernas directo desde la API de Upstash. De esta manera, Claude no asume sintaxis antiguas ni inventa propiedades obsoletas: lee los tipos de datos actualizados al día.
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-955 p-2.5 rounded-lg border border-white/5 font-mono text-[11px] text-left">
                        <code className="text-amber-400 font-bold select-all truncate shrink grow">{PROMPTS_TEXTS.pluginCmdContext7}</code>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdContext7, "pTop5")} 
                          className="px-2 py-0.5 bg-neutral-900 border border-white/10 text-neutral-300 rounded font-medium text-[9px] uppercase shrink-0 hover:bg-neutral-800 transition"
                        >
                          {copiedStates["pTop5"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <div className="p-3 bg-neutral-950/40 border border-white/5 rounded-lg text-neutral-300 text-[11px] leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono text-[9px] block uppercase font-bold tracking-widest mb-1">CÓMO USARLO</strong>
                        Su setup gratuito genera una API Key rápida. Luego agrega <code className="text-white">"use context7"</code> al final de tu prompt: "cómo configuro la autenticación JWT en Next 16, use context7".
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: MAS ALLA DEL TOP 5, SEGURIDAD & FAQ */}
                <div id="pclip-sec-04" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Buenas Prácticas y FAQ
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Administración, Seguridad y Dudas Frecuentes
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed text-left font-sans">
                    El gestor interactivo local en tu consola (<code className="text-white">/plugin</code>) abre una vista cómoda con 4 pestañas organizadas para controlar todo: <strong>Discover</strong> (para explorar nuevos complementos), <strong>Installed</strong> (lo que ya descargaste), <strong>Marketplaces</strong> y <strong>Errors</strong>.
                  </p>

                  <p className="text-xs md:text-sm text-neutral-400 leading-relaxed text-left font-sans">
                    Incluso tienes la posibilidad lógica de agregar otros plugins de la comunidad registrando un marketplace externo con un solo comando:
                  </p>

                  {/* CUSTOM MARKETPLACE COPIER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-955 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                    <div className="space-y-1 grow">
                      <code className="text-amber-400 font-bold select-all break-all">{PROMPTS_TEXTS.pluginCmdMarketplace}</code>
                      <p className="text-[10px] text-neutral-500 leading-normal font-sans">Agrega el marketplace secundario de Superpowers que cuenta con más herramientas hechas por el mismo autor.</p>
                    </div>
                    <button 
                      onClick={() => handleCopy(PROMPTS_TEXTS.pluginCmdMarketplace, "pMktBtn")} 
                      className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                    >
                      {copiedStates["pMktBtn"] ? "✓ Copiado" : "Copiar"}
                    </button>
                  </div>

                  <div className="p-5 border border-amber-500/20 bg-neutral-900/40 rounded-2xl text-left space-y-2">
                    <h4 className="text-xs font-bold text-white uppercase font-display leading-tight m-0">Reglas Críticas de Seguridad</h4>
                    <ul className="list-disc pl-5 text-xs text-neutral-400 space-y-1.5 leading-relaxed font-sans mt-2">
                      <li><strong>Descarga solo de fuentes conocidas:</strong> Un plugin puede correr comandos en tu terminal con tus privilegios del sistema. Prefiere complementos oficiales u "Anthropic verified".</li>
                      <li><strong>No instales todo por default:</strong> Cada plugin que agregas consume contexto valioso en la cabecera de tus mensajes con Claude. Apágalos con <code className="text-white text-[10px]">/plugin disable</code> cuando no los requieras activos.</li>
                    </ul>
                  </div>

                  {/* FAQ LIST */}
                  <div className="space-y-3 font-sans text-xs">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">Dudas Rápidas (FAQ)</h4>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Se requiere saber programar para montarlos?</h5>
                      <p className="text-neutral-400 leading-relaxed text-[11px] font-sans">
                        No. Instalar en tu consola es copiar el comando de arriba, pegarlo en tu terminal encendida con Claude Code, oprimir Enter y recargar con /reload-plugins. Eso es todo.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Cuestan dinero de verdad?</h5>
                      <p className="text-neutral-400 leading-relaxed text-[11px] font-sans">
                        Los del almacén oficial de Anthropic son 100% gratuitos. Context7 te regala un límite holgado en su capa gratuita (setup automático con tu API Key); solo se paga si superas cuotas de peticiones.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                      <h5 className="font-bold text-amber-400 uppercase font-display">¿Se actualizan solos o hay que reinstalar?</h5>
                      <p className="text-neutral-400 leading-relaxed text-[11px] font-sans">
                        Sí, se actualizan de forma automática cada vez que arrancas tu sesión local conectándote al servidor oficial de Claude Code. No tienes que tocarlos.
                      </p>
                    </div>
                  </div>

                  {/* ORIGINAL URLS AND REPOS */}
                  <div className="space-y-3 pt-4 text-left">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                      Fuentes externas y repos originales
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a 
                        href="https://claude.com/plugins" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Directorio de plugins oficial</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">claude.com/plugins: busca los mejores plugins oficiales y marcas de verificación.</span>
                        </div>
                      </a>

                      <a 
                        href="https://code.claude.com/docs/en/discover-plugins" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Guía de instalación de plugins</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">code.claude.com/docs: documentación del CLI oficial para complementos locales.</span>
                        </div>
                      </a>

                      <a 
                        href="https://github.com/obra/superpowers" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Repo de Superpowers (GitHub)</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">github.com/obra/superpowers: las mecánicas detrás de las habilidades de testing.</span>
                        </div>
                      </a>

                      <a 
                        href="https://github.com/microsoft/playwright-mcp" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Repo de Playwright MCP (GitHub)</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">github.com/microsoft/playwright-mcp: el repo oficial de Microsoft para dar ojos a Claude.</span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* NAVIGATION TO BACK & HOME */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "claude-opus-48" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 10 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Claude Opus 4.8: qué trae el modelo nuevo y cómo sacarle jugo <span className="text-amber-400 italic">sin quemar tu plan</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Anthropic sacó Opus 4.8 el 28 de mayo. Es más honesto, aguanta tareas largas sin que lo estés correteando y trae tres controles nuevos: <strong className="text-white font-semibold">effort, fast mode y dynamic workflows</strong>. En Wentix AI te dejamos qué cambió y cómo configurarlo, en español simple y al mismo precio que 4.7.
                  </p>
                </div>

                {/* INTERACTIVE GLANCE CELLS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("opus-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Qué cambió respecto a 4.7</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("opus-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Effort control: el slider clave</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("opus-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Fast mode &amp; Workflows</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("opus-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Ficha técnica, Benchmarks &amp; FAQ</span>
                  </button>
                </div>

                {/* SECTION 1: QUE ES OPUS 4.8 Y QUE CAMBIO */}
                <div id="opus-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El Salto Evolutivo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Opus 4.8 en comparación directa con 4.7
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    El 28 de mayo de 2026 Anthropic liberó <strong className="font-mono text-amber-400">Claude Opus 4.8</strong>. No es una revisión menor ni un truco publicitario: es una optimización profunda de Opus 4.7 en áreas de usabilidad crítica ("quality-of-life update"), garantizando respuestas rápidas y asertivas sin cambiar la tarifa por token de salida.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans leading-normal">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Juicio más afilado</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Toma mejores decisiones en solitario: prefiere el sentido pragmático en la selección de código y requiere un 35% menos aclaraciones de tu parte.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Honestidad técnica</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Se redujo ~4&times; la probabilidad de que admita código erróneo o alucine implementaciones ficticias. Avisa de inmediato lo que no puede verificar.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Autonomía prolongada</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Capacidad de operar por largos lapsos sin pedir confirmación. Un gran avance para integraciones como Claude Code o dev environments.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-amber-400 font-mono tracking-widest text-[9px] font-bold block uppercase">Autocorrección natural</span>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Audita sus propias respuestas antes de enviarlas al stream y se rehusa de manera cordial si tus instrucciones resultan incompatibles lógicamente.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Dato Extra</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0 font-sans">
                      <strong>Lo mejor del precio:</strong> Todo este combo mejorado mantiene exactamente la misma estructura de costo que su predecesor ($5/M tokens de entrada &middot; $25/M tokens de salida). No hay penalización por usar el modelo estrella en ningún entorno de desarrollo.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: SLIDER INTERACTIVO DE EFFORT CONTROL */}
                <div id="opus-sec-02" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • Configuración Clave
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Effort control: el slider interactivo que decide su razonamiento
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    El control más innovador de Opus 4.8. Al igual que una perilla de potencia, regula la profundidad analítica que Claude invertirá antes de empezar a contestar. Puedes simularlo a continuación para entender cómo funciona la lógica:
                  </p>

                  {/* INTERACTIVE SIMULATOR CARD */}
                  <div className="p-6 bg-neutral-900/50 rounded-2xl border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Simulador de potencia</span>
                      <span className="px-2 py-0.5 bg-amber-500 text-black text-[9px] font-mono font-bold rounded uppercase">claude-opus-4-8</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 font-mono text-center">
                      {[
                        { key: "low", label: "Low", sub: "Rápido" },
                        { key: "medium", label: "Medium", sub: "Equilibrio" },
                        { key: "high", label: "High", sub: "Por Defecto" },
                        { key: "extra", label: "Extra", sub: "A Fondo" },
                        { key: "max", label: "Max", sub: "Todo el Jugo" }
                      ].map((eff) => (
                        <button
                          key={eff.key}
                          onClick={() => {
                            setCopiedStates((prev) => ({ ...prev, currentSimEffort: eff.key as any }));
                            onShowToast(`🎚️ Nivel de Effort cambiado a: ${eff.label}`);
                          }}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            (copiedStates["currentSimEffort"] === eff.key || (!copiedStates["currentSimEffort"] && eff.key === "high"))
                              ? "bg-amber-500 border-amber-600 text-black font-black scale-105 shadow-lg shadow-amber-500/10"
                              : "bg-neutral-950 border-white/5 text-neutral-400 hover:border-white/10 hover:text-white"
                          } cursor-pointer`}
                        >
                          <span className="text-xs block font-bold">{eff.label}</span>
                          <span className="text-[9px] block opacity-85">{eff.sub}</span>
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-neutral-950 rounded-xl text-xs text-neutral-300 font-sans leading-relaxed text-left">
                      {(!copiedStates["currentSimEffort"] || copiedStates["currentSimEffort"] === "high") && (
                        <span>
                          <strong className="text-amber-400 font-mono text-[10px] block uppercase">Estilo: High (Por Defecto)</strong>
                          El estándar de Anthropic. Logra respuestas estructuradas de alto nivel con un consumo de tokens de contexto muy equilibrado. Ideal para las sesiones laborales regulares de programación del día a día.
                        </span>
                      )}
                      {copiedStates["currentSimEffort"] === "low" && (
                        <span>
                          <strong className="text-amber-400 font-mono text-[10px] block uppercase">Estilo: Low (Bajo)</strong>
                          Consumo mínimo de tokens de pensamiento. Ideal para cosas mecánicas (formatear json, renombrar rutas, arreglos tipográficos ultra-básicos) en las que prefieres velocidad pura y poco desperdicio de cotización.
                        </span>
                      )}
                      {copiedStates["currentSimEffort"] === "medium" && (
                        <span>
                          <strong className="text-amber-400 font-mono text-[10px] block uppercase">Estilo: Medium (Moderado)</strong>
                          Aporta un análisis ligero antes de soltar la sintaxis. Es un buen término medio cuando quieres validar scripts de complejidad media.
                        </span>
                      )}
                      {copiedStates["currentSimEffort"] === "extra" && (
                        <span>
                          <strong className="text-amber-400 font-mono text-[10px] block uppercase">Estilo: Extra (XHigh)</strong>
                          Excelente para auditorías estructuradas. Despierta bucles auto-críticos más maduros para resolver refactorizaciones de múltiples archivos a la vez. No se apresura a dar la salida estándar.
                        </span>
                      )}
                      {copiedStates["currentSimEffort"] === "max" && (
                        <span>
                          <strong className="text-amber-400 font-mono text-[10px] block uppercase">Estilo: Max (Máximo Esfuerzo)</strong>
                          Desbloquea el análisis completo de Opus 4.8. Revisa flujos asíncronos complejos, concurrencias, bases de datos complejas e integra múltiples librerías a la vez. Tarda unos segundos adicionales en iniciar, pero garantiza un plan impecable.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-2">
                       <span className="text-emerald-400 font-mono tracking-widest text-[9px] font-bold block uppercase">&uarr; Súbelo a Max cuando...</span>
                      <ul className="list-disc pl-4 text-neutral-400 space-y-1">
                        <li>Estás ante bugs sumamente lógicos difíciles de rastrear solo con consola.</li>
                        <li>Quieres estructurar la arquitectura del proyecto antes de tirar líneas.</li>
                        <li>Permitirás a Claude Code operar de manera autónoma en múltiples archivos.</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-red-400 font-mono tracking-widest text-[9px] font-bold block uppercase">&darr; Bájalo a Low cuando...</span>
                      <ul className="list-disc pl-4 text-neutral-400 space-y-1">
                        <li>Es una tarea sumamente simple y predecible de escribir.</li>
                        <li>Prefieres velocidad bruta para obtener la estructura base de un componente.</li>
                        <li>Tu plan mensual de tokens se encuentra bajo en recursos y deseas economizar.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: FAST MODE & WORKFLOWS */}
                <div id="opus-sec-03" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • Nuevos Modos de Salida
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Fast Mode y Dynamic Workflows
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Para escenarios corporativos y sesiones maratónicas de código donde los segundos cuentan, Opus 4.8 introduce dos estructuras asombrosas:
                  </p>

                  <div className="p-6 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Fast Mode: El mismo Opus 2.5&times; más veloz</h4>
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">Ahorro Extremo</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      No compromete la inteligencia. Fast Mode procesa la inferencia en hardware optimizado para stream, ofreciendo respuestas casi instantáneas a un precio 3&times; más accesible que la cuota regular. Actívalo en Claude Code mediante el comando directo:
                    </p>

                    {/* COPY LINE FOR FAST CMD */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950 p-4 rounded-lg border border-white/5 font-mono text-xs text-left">
                      <div className="space-y-1 grow">
                        <code className="text-amber-400 font-bold select-all break-all">{PROMPTS_TEXTS.opusCommandFast}</code>
                        <p className="text-[10px] text-neutral-500 leading-normal font-sans">Paso simple: Alterna Fast mode de encendido a apagado en consola.</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.opusCommandFast, "cmdFst")} 
                        className="px-2.5 py-1 bg-neutral-900 border border-white/10 hover:border-amber-400/20 text-neutral-300 hover:text-amber-400 rounded-lg text-[10px] transition-colors cursor-pointer self-start sm:self-center font-mono uppercase shrink-0"
                      >
                        {copiedStates["cmdFst"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Dynamic Workflows: Orquestación multihilo</h4>
                      <span className="text-[9px] font-mono font-bold text-amber-500 uppercase">Versión Enterprise</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      ¿Tienes migraciones gigantescas de código o una auditoría de base de datos que abarca miles de módulos? Con <strong>Dynamic Workflows</strong>, Claude Opus 4.8 hace un desglose analítico, lanza cientos de subagentes locales en paralelo para atacar cada archivo de forma simultánea, y consolida todo al final de manera síncrona. Una máquina de demolición técnica para proyectos inmensos. Operativo en planes Enterprise, Team y Max.
                    </p>
                  </div>
                </div>

                {/* SECTION 4: BENCHMARKS, DETAILS & PROMPTS & FAQ */}
                <div id="opus-sec-04" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Referencia Técnica y Práctica
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Benchmarks, Especificaciones Técnicas y Prompts Listos
                    </h3>
                  </div>

                  {/* BENCHMARKS */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">Resultados en Laboratorio (Benchmarks)</span>
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl space-y-4">
                      {/* Bench 1 */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white font-bold">Online-Mind2Web (Navegación humana)</span>
                          <span className="text-amber-400 font-bold">84%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-neutral-800 to-amber-500 rounded-full" style={{ width: "84%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-tight">Mide la precisión simulando comportamiento e interacción fluida en entornos web complejos.</p>
                      </div>

                      {/* Bench 2 */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white font-bold">SWE-Bench Pro (Coding Agéntico)</span>
                          <span className="text-amber-400 font-bold">69.2%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-neutral-800 to-amber-500 rounded-full" style={{ width: "69.2%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-tight">Mide la habilidad de arreglar de forma autónoma repos de producción gigantes. Sube notablemente respecto al 4.7 previo.</p>
                      </div>

                      {/* Bench 3 */}
                      <div className="space-y-1 text-left">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white font-bold">Legal Agent &amp; Doc Accuracy</span>
                          <span className="text-amber-400 font-bold">1er Lugar</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-neutral-800 to-amber-500 rounded-full" style={{ width: "100%" }} />
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-tight">Primer modelo en romper el 10% en el exigente estándar all-pass.</p>
                      </div>
                    </div>
                  </div>

                  {/* TABLA TECNICA */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">Ficha Técnica Oficial</span>
                    <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-950/40 text-left">
                      <table className="w-full border-collapse text-xs">
                        <thead>
                          <tr className="bg-neutral-900/60 font-mono text-amber-400 text-[10px] tracking-wider uppercase border-b border-white/10">
                            <th className="p-3">Parámetro</th>
                            <th className="p-3">Detalle</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans text-neutral-300">
                          <tr>
                            <td className="p-3 font-mono font-bold text-white">Model ID (API)</td>
                            <td className="p-3">claude-opus-4-8</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono font-bold text-white">Context Window</td>
                            <td className="p-3">1.000.000 tokens (alta retención del hilo lógico sin pérdida de memoria)</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono font-bold text-white">Caché Mínimo</td>
                            <td className="p-3">1.024 tokens (mucho más refinado y económico en peticiones frecuentes)</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono font-bold text-white">Tarifa Base</td>
                            <td className="p-3">$5 / M de entrada &middot; $25 / M de salida (Mantiene el precio estándar)</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-mono font-bold text-white">Disponibilidad</td>
                            <td className="p-3">Claude.ai (Pro/Team/Max/Enterprise), API oficial, AWS Bedrock, Google Vertex AI, Azure Foundry e integraciones en Copilot.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* PROMPTS COPIERS (INTEGRATED EXPERIENCES) */}
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">4 Prompts listos para copiar de Wentix AI</span>

                    {/* Prompt 1 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt 01: Forzar la Honestidad (Avisar dudas)</h4>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Alineación</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mt-1">
                        Hace que Claude sea sumamente transparente en su toma de decisiones antes de cerrar la tarea, evitando que oculte fallos en el código.
                      </p>
                      <div className="flex items-center justify-between gap-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5 font-mono text-[10px]">
                        <span className="truncate text-amber-500">{PROMPTS_TEXTS.opusPromptHonestidad.substring(0, 60)}...</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.opusPromptHonestidad, "opPr1")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["opPr1"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.opusPromptHonestidad}</pre>
                    </div>

                    {/* Prompt 2 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt 02: Detenerte si tu plan es malo</h4>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Criterio Crítico</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mt-1">
                        Estimula la mentalidad pro-activa del modelo exigiendo que debata tu enfoque antes de empezar a construir.
                      </p>
                      <div className="flex items-center justify-between gap-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5 font-mono text-[10px]">
                        <span className="truncate text-amber-500">{PROMPTS_TEXTS.opusPromptPlanFrenar.substring(0, 60)}...</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.opusPromptPlanFrenar, "opPr2")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["opPr2"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.opusPromptPlanFrenar}</pre>
                    </div>

                    {/* Prompt 3 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt 03: Tareas de corrido de larga duración</h4>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Autonomía</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mt-1">
                        Establece reglas claras de cuándo está permitido al agente tomar decisiones ejecutivas en solitario y cuándo detenerse.
                      </p>
                      <div className="flex items-center justify-between gap-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5 font-mono text-[10px]">
                        <span className="truncate text-amber-500">{PROMPTS_TEXTS.opusPromptTareaLarga.substring(0, 60)}...</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.opusPromptTareaLarga, "opPr3")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["opPr3"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.opusPromptTareaLarga}</pre>
                    </div>

                    {/* Prompt 4 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt 04: Economía ante todo (Keep simple)</h4>
                        <span className="text-[9px] font-mono text-neutral-500 uppercase">Economía</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans mt-1">
                        Obliga a Claude a descartar razonamientos abstractos innecesarios o sobrediseños que incrementan drásticamente el uso de tokens.
                      </p>
                      <div className="flex items-center justify-between gap-2 bg-neutral-900/60 p-2 rounded-lg border border-white/5 font-mono text-[10px]">
                        <span className="truncate text-amber-500">{PROMPTS_TEXTS.opusPromptSimpleEffort.substring(0, 60)}...</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.opusPromptSimpleEffort, "opPr4")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition"
                        >
                          {copiedStates["opPr4"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-36 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.opusPromptSimpleEffort}</pre>
                    </div>
                  </div>

                  {/* FAQ LIST */}
                  <div className="space-y-3 text-xs">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">Preguntas frecuentes (FAQ)</span>

                    {[
                      {
                        q: "¿Qué precio final tiene Opus 4.8 frente a sus predecesores?",
                        a: "Exactamente el mismo. Cuesta $5 por millón de tokens de entrada (Prompt tokens) y $25 por millón de tokens de salida (Completion tokens). Puedes migrar hoy sin alterar la cotización de tus aplicaciones."
                      },
                      {
                        q: "¿Cómo se activa el Fast Mode en entornos de desarrollo?",
                        a: "En Claude Code corre simplemente '/fast'. Para integraciones vía API oficial o SDK, añade el parámetro speed: 'fast' dentro de la carga JSON. Te da un rendimiento 2.5× más rápido a un tercio de su costo de salida regular."
                      },
                      {
                        q: "¿Qué significa que el contexto mínimo bajó a 1.024 tokens?",
                        a: "Quiere decir que la caché de prompts (Prompt Caching) ahora procesa lotes lógicos mucho más compactos. Antes debías alcanzar bloques inmensos para recibir descuentos por caché. Ahora, te beneficias en interacciones de chat breves."
                      }
                    ].map((faq, idx) => (
                      <div key={idx} className="p-4 bg-neutral-950 rounded-xl border border-white/5 space-y-1 text-left">
                        <strong className="text-amber-400 uppercase font-display block">{faq.q}</strong>
                        <p className="text-neutral-400 leading-relaxed text-[11px] font-sans">{faq.a}</p>
                      </div>
                    ))}
                  </div>

                  {/* FONTS AND ORIGINAL LINKS */}
                  <div className="space-y-3 pt-4 text-left">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                      Documentos oficiales de referencia
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a 
                        href="https://www.anthropic.com/news/claude-opus-4-8" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Anuncio oficial de Opus 4.8</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">anthropic.com/news: blog corporativo describiendo el lanzamiento del 28 de mayo.</span>
                        </div>
                      </a>

                      <a 
                        href="https://platform.claude.com/docs/en/about-claude/models/whats-new-claude-4-8" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-4 rounded-xl border border-white/5 bg-neutral-900/30 hover:border-amber-400/20 group transition-all text-left flex flex-col justify-between cursor-pointer font-sans"
                      >
                        <div>
                          <strong className="text-amber-400 text-xs font-sans font-bold group-hover:underline block">Guía oficial para Desarrolladores</strong>
                          <span className="text-[10px] text-neutral-400 mt-1 block leading-normal font-sans">platform.claude.com: desglose técnico de parámetros como 'speed' y 'effort'.</span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* BOTTOM RECRUIT BUTTON CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "spotify-claude" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 11 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Spotify + Claude: tu <span className="text-amber-400 italic">DJ personal</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Claude se conecta a tu Spotify y te arma playlists enteras — pero solo si le das un buen prompt. Lo conectas en <strong className="text-white font-semibold">4 clics</strong> y aprendes a pedir como un DJ de verdad: con artistas, época y lo que NO quieres. En Wentix AI te dejamos el paso a paso de conexión, la fórmula del buen prompt musical y 6 playlists listas para copiar.
                  </p>
                </div>

                {/* QUICK GLANCE CELLS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("spot-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Conexión de Spotify</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("spot-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">Antes vs. Después</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("spot-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">La Receta del Prompt</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("spot-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-xs text-neutral-300 font-sans block leading-snug group-hover:text-amber-200 transition-colors">6 Playlists Listas</span>
                  </button>
                </div>

                {/* SECTION 1: CONEXION */}
                <div id="spot-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • Configuración única
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Conecta Spotify a Claude en 4 clics
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Solo lo haces una vez. Después, cada vez que abras Claude, ya tendrás a tu DJ listo para armar playlists directo en tu cuenta de Spotify.
                  </p>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    <li className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 relative pl-12 font-sans">
                      <span className="absolute left-4 top-5 font-mono text-amber-400 font-black text-sm">01</span>
                      <strong className="text-white text-xs block uppercase font-display">Abre Customize</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0">Inicia sesión en Claude, busca el botón de Customize (el del maletín). Ahí viven tus habilidades y tus conectores.</p>
                    </li>
                    <li className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 relative pl-12 font-sans">
                      <span className="absolute left-4 top-5 font-mono text-amber-400 font-black text-sm">02</span>
                      <strong className="text-white text-xs block uppercase font-display">Entra a Conectores</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0">Dentro de Customize vas a ver Habilidades y Conectores. Toca Conectores.</p>
                    </li>
                    <li className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 relative pl-12 font-sans">
                      <span className="absolute left-4 top-5 font-mono text-amber-400 font-black text-sm">03</span>
                      <strong className="text-white text-xs block uppercase font-display">Explorar conectores</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0">Toca el botón + y elige "Explorar conectores" para ver todos los que puedes agregar de forma nativa.</p>
                    </li>
                    <li className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl text-left space-y-2 relative pl-12 font-sans">
                      <span className="absolute left-4 top-5 font-mono text-amber-400 font-black text-sm">04</span>
                      <strong className="text-white text-xs block uppercase font-display">Conéctalo</strong>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0">Busca Spotify en la lista, dale Conectar, inicia sesión en tu cuenta, autoriza y ¡listo!</p>
                    </li>
                  </ul>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Clave</span>
                    <p className="text-xs text-neutral-300 leading-relaxed m-0 font-sans">
                      Spotify aparece etiquetado como "Interactivo": eso significa que Claude puede crear y editar playlists directo en tu cuenta. Con Spotify conectado, abre un chat nuevo, elige <strong className="text-white font-semibold">Opus 4.7</strong> y pídele tu primer playlist con un prompt preciso.
                    </p>
                  </div>
                </div>

                {/* SECTION 2: ANTES VS DESPUES */}
                <div id="spot-sec-02" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • El Factor Diferencial
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El mismo pedido, dos resultados (Antes vs. Después)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Si le pides a secas "reguetón antiguo", Claude rellenará la lista con lo primero que encuentre (como Calle 13, que no es perreo clásico de pista). Pero si le aportas cultura, artistas clave y lo que NO quieres, se vuelve un DJ infalible:
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-sans text-xs">
                    <div className="lg:col-span-12 xl:col-span-5 p-5 bg-neutral-900/20 border border-white/5 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-red-400 font-mono text-[9px] uppercase tracking-widest font-black block">❌ El prompt vago</span>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">Esto nos devolvió pura música alternativa o Calle 13 porque no especificamos épocas ni deconstrucción de artistas.</p>
                      </div>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between gap-2 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono text-[10px]">
                          <span className="truncate text-red-400">Créame un playlist muy bueno de música de reguetón antiguo...</span>
                          <button 
                            onClick={() => handleCopy("Créame un playlist muy bueno de música de reguetón antiguo.", "spotBad")} 
                            className="px-2 py-0.5 bg-neutral-900 text-[10.5px] hover:text-white rounded text-white font-mono cursor-pointer"
                          >
                            {copiedStates["spotBad"] ? "✓" : "Copiar"}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-12 xl:col-span-2 flex items-center justify-center font-mono text-amber-400 text-xl font-bold">
                      &rarr;
                    </div>

                    <div className="lg:col-span-12 xl:col-span-5 p-5 bg-neutral-900/40 border border-amber-500/20 rounded-2xl space-y-3 flex flex-col justify-between font-sans">
                      <div className="space-y-2">
                        <span className="text-emerald-400 font-mono text-[9px] uppercase tracking-widest font-black block">✅ El prompt preciso</span>
                        <p className="text-neutral-400 leading-relaxed text-[11px]">Misma idea, pero con cultura: artistas específicos, época de oro cerrada y exclusión directa de baladas o reguetón consciente.</p>
                      </div>
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between gap-2 bg-neutral-950 p-2.5 rounded-lg border border-white/5 font-mono text-[10px]">
                          <span className="truncate text-amber-500">{PROMPTS_TEXTS.spotifyReguetonClasico.substring(0, 40)}...</span>
                          <button 
                            onClick={() => handleCopy(PROMPTS_TEXTS.spotifyReguetonClasico, "spotGood")} 
                            className="px-2 py-0.5 bg-neutral-900 text-[10.5px] hover:text-amber-400 rounded text-white font-mono cursor-pointer"
                          >
                            {copiedStates["spotGood"] ? "✓" : "Copiar"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: LA FORMULA */}
                <div id="spot-sec-03" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • El Formato Ideal
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      La receta maestra para un buen prompt musical
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Para que Claude sea un DJ perfecto, tu prompt debe cubrir estos ingredientes. No necesitas todos siempre, pero aumentarán significativamente la precisión de la playlist creada:
                  </p>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-xs text-left">
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Género o estilo</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: reguetón clásico, salsa brava, lo-fi, indie.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Época o era</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: 2003-2010, los 90, lo nuevo de 2025.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Referencias claves</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: Daddy Yankee, Don Omar, Héctor El Father.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Ocasión o Mood</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: entrenar, enfocar, previa con amigos.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Filtros y exclusiones</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: nada de baladas, evitar remixes o Calle 13.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Límite de temas</span>
                      <p className="text-neutral-400 leading-snug m-0">ej: entre 25 a 30 canciones, sin repetir autor.</p>
                    </div>
                  </div>

                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Fórmula Maestra a rellenar:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.spotifyFormulaMaestra, "spotForm")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer"
                      >
                        {copiedStates["spotForm"] ? "✓ Copiado" : "Copiar Fórmula"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.spotifyFormulaMaestra}</pre>
                  </div>
                </div>

                {/* SECTION 4: PLAYLISTS COPIERS */}
                <div id="spot-sec-04" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Catálogo musical Wentix
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      6 Playlists prediseñadas listas para usar (Copiar y Pegar)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Copia cualquiera de las siguientes estructuras preconfiguradas y pégala en Claude con Spotify conectado. Puedes modificarlas a tu gusto:
                  </p>

                  <div className="space-y-6">
                    {/* PL 1 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">🔥 01 &middot; Clásicos del Perreo</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyReguetonClasico, "spotPl1")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl1"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyReguetonClasico}</pre>
                    </div>

                    {/* PL 2 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">🎧 02 &middot; Modo Foco (Estudiar / Trabajar)</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyPromptFoco, "spotPl2")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl2"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyPromptFoco}</pre>
                    </div>

                    {/* PL 3 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">🎉 03 &middot; Previa entre Amigos</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyPromptPrevia, "spotPl3")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl3"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyPromptPrevia}</pre>
                    </div>

                    {/* PL 4 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">💪 04 &middot; Modo Gym (Energía pesada)</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyPromptGym, "spotPl4")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl4"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyPromptGym}</pre>
                    </div>

                    {/* PL 5 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">🌙 05 &middot; Viaje de noche en ruta</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyPromptViaje, "spotPl5")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl5"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyPromptViaje}</pre>
                    </div>

                    {/* PL 6 */}
                    <div className="p-5 bg-neutral-900/20 border border-white/5 rounded-2xl text-left space-y-3 font-sans">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold text-sm block font-sans">💔 06 &middot; Modo Despecho (Me falló)</span>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.spotifyPromptLlorar, "spotPl6")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] hover:bg-neutral-700 transition rounded cursor-pointer"
                        >
                          {copiedStates["spotPl6"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/25 rounded-xl font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.spotifyPromptLlorar}</pre>
                    </div>
                  </div>

                  {/* SPOTIFY CONSTRAINTS & DETAILS */}
                  <div className="space-y-2 text-left font-sans">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold block">Tips extras para mejorar tu DJ</span>
                    <div className="p-5 bg-neutral-950/40 rounded-xl border border-white/5 font-sans text-xs space-y-4">
                      <div className="space-y-1">
                        <strong className="text-amber-400 uppercase font-display block">Ajusta sobre la marcha</strong>
                        <p className="text-neutral-400 leading-relaxed">No hace falta empezar de cero. Si no te gusta algún tema de la playlist creada, dile directo en chat: <em>"Quita todas las canciones de tal autor y agregegue 3 de este otro"</em>. Claude las actualizará al instante en tu Spotify.</p>
                      </div>
                      <div className="space-y-1">
                        <strong className="text-amber-400 uppercase font-display block">Colaborativas o Privadas</strong>
                        <p className="text-neutral-400 leading-relaxed">Por defecto, Claude las creará de forma privada en tu biblioteca. Pero si le pides: <em>"Ponla pública o colaborativa"</em>, modificará el alcance del canal para que puedas compartir el link al instante con tus amigos.</p>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM RECRUIT BUTTON CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "cinco-preguntas" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 12 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Las 5 preguntas antes de meterle IA a tu negocio <span className="text-amber-400 italic">(no necesitas la Mac Mini)</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Toda la gente comprando la misma computadora carísima para "meterse a la IA". La verdad es que <strong className="text-white">no necesitas la Mac Mini</strong>. Lo que de verdad necesitas es claridad sobre tu propio negocio: cinco preguntas que casi nadie te enseña, y un prompt para contestar cada una. En Wentix AI bajamos esas 5 preguntas a un proceso real, con el prompt maestro que le suelta a Claude tu negocio entero y te devuelve un plan de IA en 3 fases.
                  </p>
                </div>

                {/* QUICK GLANCE CELLS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("q-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">¿Qué te da resultado?</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("q-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">¿Dónde está escrito?</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("q-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">¿Qué no debe existir?</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("q-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold font-semibold">La Versión Mínima</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("q-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">05 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold font-semibold">¿Cómo le meto IA?</span>
                  </button>
                </div>

                {/* SECTION 1: EL MITO */}
                <div id="q-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El Mito del Hardware
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      No necesitas la Mac Mini
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Hay una ola de gente comprando la misma computadora carísima para "meterse a la IA". Es el síntoma de un error de fondo: creer que la IA es un problema de hardware. No lo es. Si vas a meterle IA a tu negocio, la herramienta más potente ya corre en cualquier navegador, en la laptop que tienes hoy.
                  </p>

                  {/* HIGH-END METRIC VS BOX */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                    <div className="p-5 bg-neutral-900/10 border border-white/5 opacity-60 rounded-2xl text-center space-y-2">
                      <span className="text-2xl">🖥️</span>
                      <strong className="text-neutral-400 uppercase font-display block">Equipo carísimo</strong>
                      <p className="text-[11px] text-neutral-500 leading-normal">Síntoma de creer que la IA es un problema de hardware. Una excusa para postergar.</p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-amber-500/20 rounded-2xl text-center space-y-2">
                      <span className="text-2xl">📝</span>
                      <strong className="text-amber-400 uppercase font-display block">Claridad de negocio</strong>
                      <p className="text-[11px] text-neutral-300 leading-normal">Saber qué pasos exactos producen dinero hoy en tu empresa. Eso cuesta cero dólares y representa el 90% del éxito real.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Claridad operativa</span>
                      <p className="text-neutral-400 leading-snug m-0">Saber qué pasos te dan dinero. Consola vs. Procesos.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Claude de Navegador</span>
                      <p className="text-neutral-400 leading-snug m-0">Abres claude.ai y empiezas gratis hoy mismo, sin terminales complejas.</p>
                    </div>
                    <div className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl space-y-1">
                      <span className="text-amber-400 font-bold block">Una hora de trabajo</span>
                      <p className="text-neutral-400 leading-snug m-0">El método completo en una sola sentada sin pagar ningún consultor.</p>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LAS 5 PREGUNTAS */}
                <div id="q-sec-02" className="space-y-8 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • El Core Metodológico
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Las preguntas que casi nadie te hace (y cómo responderlas)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans font-normal text-neutral-300">
                    Contesta las primeras cuatro preguntas en orden. Cada una construye sobre la anterior, terminando con un documento simple de tu proceso (<code className="font-mono text-amber-500 text-[11px] bg-neutral-900 px-1 py-0.5 rounded">proceso.md</code>) que alimentará a tu estrategia final.
                  </p>

                  <div className="space-y-6">
                    {/* PREGUNTA 1 CARD */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative pl-16 text-left font-sans">
                      <div className="absolute left-4 top-5 w-8 h-8 rounded-lg border border-amber-500/35 flex items-center justify-center font-mono text-amber-400 font-bold text-xs bg-amber-950/20 font-semibold text-amber-400">1</div>
                      <h4 className="text-xs font-bold text-white uppercase font-display leading-tight m-0">¿Qué es lo que en serio te da el resultado?</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1 mb-3">
                        Los pasos que de verdad producen ventas y retención. Vamos del cobro hacia el primer contacto para cortar la teoría bonita que no produce dinero.
                      </p>
                      
                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 font-sans space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Prompt Entrevista de Diagnóstico</span>
                          <button 
                            onClick={() => handleCopy(PROMPTS_TEXTS.negocioPregunta1, "qPr1")}
                            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-white rounded font-mono text-[9px] cursor-pointer"
                          >
                            {copiedStates["qPr1"] ? "✓ Copiado" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-2 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/20 font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.negocioPregunta1}</pre>
                      </div>
                    </div>

                    {/* PREGUNTA 2 CARD */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative pl-16 text-left font-sans">
                      <div className="absolute left-4 top-5 w-8 h-8 rounded-lg border border-amber-500/35 flex items-center justify-center font-mono text-amber-400 font-bold text-xs bg-amber-950/20 font-semibold text-amber-400">2</div>
                      <h4 className="text-xs font-bold text-white uppercase font-display leading-tight m-0">¿Dónde está escrito eso que funciona?</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1 mb-3">
                        Escríbelo en algún lado. Si la inteligencia artificial no lo puede ver ni leer, no te puede ayudar a optimizarlo.
                      </p>

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 font-sans space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Prompt de Estructuración de Proceso</span>
                          <button 
                            onClick={() => handleCopy(PROMPTS_TEXTS.negocioPregunta2, "qPr2")}
                            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-white rounded font-mono text-[9px] cursor-pointer"
                          >
                            {copiedStates["qPr2"] ? "✓ Copiado" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-2 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/20 font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.negocioPregunta2}</pre>
                      </div>
                    </div>

                    {/* PREGUNTA 3 CARD */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative pl-16 text-left font-sans">
                      <div className="absolute left-4 top-5 w-8 h-8 rounded-lg border border-amber-500/35 flex items-center justify-center font-mono text-amber-400 font-bold text-xs bg-amber-950/20 font-semibold text-amber-400">3</div>
                      <h4 className="text-xs font-bold text-white uppercase font-display leading-tight m-0">¿Qué ya no debería existir en tu proceso?</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1 mb-3">
                        No tiene sentido automatizar un paso improductivo que ni siquiera debería existir en tu día a día: primero quitas grasa, después metes IA.
                      </p>

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 font-sans space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Prompt de Auditoría Operativa</span>
                          <button 
                            onClick={() => handleCopy(PROMPTS_TEXTS.negocioPregunta3, "qPr3")}
                            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-white rounded font-mono text-[9px] cursor-pointer"
                          >
                            {copiedStates["qPr3"] ? "✓ Copiado" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-2 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/20 font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.negocioPregunta3}</pre>
                      </div>
                    </div>

                    {/* PREGUNTA 4 CARD */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative pl-16 text-left font-sans">
                      <div className="absolute left-4 top-5 w-8 h-8 rounded-lg border border-amber-500/35 flex items-center justify-center font-mono text-amber-400 font-bold text-xs bg-amber-950/20 font-semibold text-amber-400">4</div>
                      <h4 className="text-xs font-bold text-white uppercase font-display leading-tight m-0">¿Cuál es la versión más simple que funciona?</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed mt-1 mb-3">
                        Juntamos pasos, eliminamos traspasos lentos y creamos la versión mínima de operaciones que alimentará tus automatizaciones.
                      </p>

                      <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 font-sans space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">Prompt de Versión Simplificada</span>
                          <button 
                            onClick={() => handleCopy(PROMPTS_TEXTS.negocioPregunta4, "qPr4")}
                            className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 hover:text-white text-white rounded font-mono text-[9px] cursor-pointer"
                          >
                            {copiedStates["qPr4"] ? "✓ Copiado" : "Copiar"}
                          </button>
                        </div>
                        <pre className="p-2 text-[10px] text-neutral-400 overflow-x-auto max-h-32 bg-black/20 font-mono leading-relaxed whitespace-pre-wrap">{PROMPTS_TEXTS.negocioPregunta4}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: EL PROMPT MAESTRO */}
                <div id="q-sec-03" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • El Prompt Maestro
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Le avientas todo a Claude (Estrategia IA)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans font-normal">
                    Esta es la quinta pregunta: <strong className="text-white font-semibold">¿Cómo le meto IA?</strong>. Pega tu negocio, proceso simple, herramientas y cuellos de botella para que Claude actúe como tu estratega real y te arme un plan en 3 fases:
                  </p>

                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt Maestro de Estrategia IA:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.negocioMaestro, "qMaestro")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                      >
                        {copiedStates["qMaestro"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.negocioMaestro}</pre>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Clave</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      Lo que sale de este prompt maestro no es humo: es una lista de impacto vs esfuerzo priorizada. Lo que caiga en "esta semana" lo resuelves en el chat. Lo que caiga en "más adelante" o requiera manejo de archivos automatizados, va directo a <strong className="text-white font-sans">Claude Code</strong> en la siguiente sección.
                    </p>
                  </div>
                </div>

                {/* SECTION 4: CLAUDE CODE */}
                <div id="q-sec-04" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Operaciones de Archivos
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Llévalo a Claude Code (Automatizaciones reales)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans font-normal">
                    El chat web es genial para platicar, pero Claude Code puede leer tus archivos operativos (<code className="font-mono text-amber-500 text-[11px] bg-neutral-900 px-1 py-0.5 rounded">proceso.md</code>, planillas, plantillas de correo) y construir herramientas duraderas. No necesitas la Mac Mini, corre directo en la terminal de tu computadora de siempre.
                  </p>

                  <div className="p-5 bg-neutral-905 border border-white/5 rounded-2xl space-y-3 font-sans">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <span className="text-[11px] font-sans text-neutral-400">Instala Claude Code globalmente (una sola vez)</span>
                      <button 
                        onClick={() => handleCopy("npm install -g @anthropic-ai/claude-code", "instCl")}
                        className="px-2.5 py-1 bg-neutral-950 rounded text-amber-400 text-[10px] font-mono border border-amber-500/20 hover:bg-neutral-900 transition cursor-pointer"
                      >
                        {copiedStates["instCl"] ? "✦ Copiado" : "npm install ..."}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold block">Antes de tu primer prompt</span>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 list-none p-0">
                      <li className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl text-left font-sans">
                        <strong className="text-white text-xs block uppercase font-display mb-1">1. Crea una carpeta</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0">En tu disco crea una carpeta con el nombre de tu negocio.</p>
                      </li>
                      <li className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl text-left font-sans">
                        <strong className="text-white text-xs block uppercase font-display mb-1">2. Archivo proceso.md</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0">Pega tu documento de proceso simplificado en un archivo de texto.</p>
                      </li>
                      <li className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl text-left font-sans">
                        <strong className="text-white text-xs block uppercase font-display mb-1">3. Llama a Claude Code</strong>
                        <p className="text-[11px] text-neutral-400 leading-relaxed m-0">Abre esa carpeta usando tu app de escritorio o comando <code className="font-mono text-amber-400 text-[10px]">claude</code>.</p>
                      </li>
                    </ol>
                  </div>

                  {/* PROMPT AUTOMATIZACIÓN EN CONSOLA */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt para construir tu primer script / flujo:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.negocioClaudeCode, "qClCode")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                      >
                        {copiedStates["qClCode"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.negocioClaudeCode}</pre>
                  </div>

                  {/* BOTTOM SWITCH CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "tres-errores-ia" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 14 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    No es la IA, sos vos: <span className="text-amber-400 italic font-sans normal-case font-normal">los 3 errores y la regla del contexto</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Cambiás de modelo, pagás otro plan, probás otra herramienta — y la respuesta sigue siendo genérica. El problema viaja con vos. <strong className="text-white">Cero contexto, IA tonta. Contexto completo, IA monstruo.</strong> Entendé el poder del anclaje.
                  </p>
                </div>

                {/* QUICK GLANCE CELLS */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  {[
                    { num: "01", name: "Le echás la culpa", id: "t-err-01" },
                    { num: "02", name: "Asumís que te conoce", id: "t-err-02" },
                    { num: "03", name: "Diseñás vs Construís", id: "t-err-03" },
                    { num: "04", name: "Las 5 Dimensiones", id: "t-err-04" },
                    { num: "05", name: "3 Prompts & Checklist", id: "t-err-05" },
                  ].map((cell, cIdx) => (
                    <button 
                      key={cIdx}
                      onClick={() => document.getElementById(cell.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                    >
                      <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">{cell.num} &rarr;</span>
                      <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">{cell.name}</span>
                    </button>
                  ))}
                </div>

                {/* SECTION 1: INTRO: No es la IA, sos vos */}
                <div className="p-6 bg-amber-950/10 border border-amber-500/10 rounded-2xl space-y-3 font-sans relative">
                  <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/20 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest">Analogía</span>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 translate-y-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-[12px] font-mono text-amber-400 block uppercase font-bold m-0">El conductor y el carro:</h4>
                      <p className="text-xs text-neutral-300 leading-normal m-0 font-sans">
                        Imaginá que cambiás de carro cada vez que llegás tarde al trabajo. Compraste tres carros, cambiaste cuatro motores, y seguís llegando tarde. En algún momento te das cuenta que el problema no era el carro. Con la IA pasa lo mismo: el problema viaja con vos. Es el conductor, no el carro.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ERROR 01 */}
                <div id="t-err-01" className="space-y-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Error 01 • El chivo expiatorio</span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Le echás la culpa al modelo</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans text-neutral-350">
                    Le pediste <em>&ldquo;hacé un video viral&rdquo;</em> o <em>&ldquo;escribime un email bueno&rdquo;</em> — y la IA te contestó algo genérico salido de un blog obsoleto. La IA te contestó exactamente lo que le pediste: una respuesta promedio para un input vacío.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MAL */}
                    <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-red-400 font-mono text-[10px] font-bold uppercase">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Prompt Vacío Malo</span>
                      </div>
                      <pre className="p-3 bg-black/25 text-[10px] font-mono text-neutral-400 rounded border border-red-900/10 whitespace-pre-wrap">Hacéme un video viral.</pre>
                    </div>

                    {/* BIEN */}
                    <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mismo pedido con contexto</span>
                      </div>
                      <pre className="p-3 bg-black/25 text-[10px] font-mono text-neutral-300 rounded border border-emerald-900/10 whitespace-pre-wrap">Rol: Creador educativo de marketing digital.
Audiencia: Emprendedores de 25-40 que recién empiezan.
Formato: Instagram Reels (45 segundos). Hook, cuerpo, cierre.</pre>
                    </div>
                  </div>
                </div>

                {/* ERROR 02 */}
                <div id="t-err-02" className="space-y-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Error 02 • El egocentrismo implícito</span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Asumís que la IA te conoce</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans text-neutral-350">
                    Trabajás en un hilo y de repente tirás un <em>&ldquo;dame ideas para mi proyecto&rdquo;</em>. La IA tiene acceso a medio internet, pero de vos no sabe absolutamente nada. Si no le explicás tu situación, te contesta para alguien que no sos.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* MAL */}
                    <div className="p-4 bg-red-950/10 border border-red-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-red-400 font-mono text-[10px] font-bold uppercase">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Asunción Incorrecta</span>
                      </div>
                      <pre className="p-3 bg-black/25 text-[10px] font-mono text-neutral-400 rounded border border-red-900/10 whitespace-pre-wrap">¿Qué tipo de contenido debería postear esta semana en mi proyecto?</pre>
                    </div>

                    {/* BIEN */}
                    <div className="p-4 bg-emerald-950/10 border border-emerald-500/10 rounded-xl space-y-2">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mismo pedido con anclaje</span>
                      </div>
                      <pre className="p-3 bg-black/25 text-[10px] font-mono text-neutral-300 rounded border border-emerald-900/10 whitespace-pre-wrap">Mi proyecto: Academia online de español para profesionales tech.
Esta semana publiqué: 1 thread sobre subjuntivo y 1 reel corporativo.
Quiero: Mix balanceado.</pre>
                    </div>
                  </div>
                </div>

                {/* ERROR 03 */}
                <div id="t-err-03" className="space-y-4 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Error 03 • La Costura de Modelos</span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Diseñás con uno y construís con otro</h3>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    Le pedís a ChatGPT que te arme el plan, copiás la respuesta y se la pegás a Claude para que construya. Cada modelo tiene su propio estilo de razonar, su vocabulario interno y sus asunciones implícitas. Al pegar pedazos sin recontextualizar se rompe el alineamiento del pipeline.
                  </p>
                </div>

                {/* THE 5 DIMENSIONS */}
                <div id="t-err-04" className="space-y-6 scroll-mt-24 border-t border-white/5 pt-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">La Regla de Oro</span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Cero contexto, IA tonta • Contexto completo, IA monstruo
                    </h3>
                  </div>

                  {/* 5 DIMENSIONS GRID */}
                  <div className="grid grid-cols-1 gap-3.5 text-left font-sans">
                    {[
                      { num: "01", dim: "ROL Y PROYECTO", title: "Quién sos y qué construís", desc: "No tu currículum, sino tu rol en este pedido y una oración clara del negocio. Si no, asume el estándar promedio.", ex: "Ejemplo: 'Soy fundadora de una agencia de Meta Ads para Shopify en LatAm. Llevo 18 meses operando.'" },
                      { num: "02", dim: "AUDIENCIA", title: "Para quién es el output", desc: "Decile exactamente quién va a leer, usar o comprar el entregable final.", ex: "Ejemplo: 'Dueños de tiendas Shopify que facturan entre 20k y 200k USD y ya han fallado con agencias de marketing.'" },
                      { num: "03", dim: "QUÉ VENDÉS / CONSTRUÍS", title: "El qué + el porqué", desc: "Especificar el producto y el problema real que solucionás. Evita que la IA invente objeciones fantasiosas.", ex: "Ejemplo: 'Gestión completa de Meta Ads con fee fijo aliado al ROAS.'" },
                      { num: "04", dim: "SITUACIÓN ACTUAL", title: "Dónde estás vs Dónde quieres llegar", desc: "La situación con números exactos y lo que ya intentaste para no sugerirte obviedades que ya descartaste.", ex: "Ejemplo: 'Facturamos 45k USD con 8 clientes. Queremos subir a 75k sin contratar personal extra.'" },
                      { num: "05", dim: "QUÉ QUERÉS QUE PASE", title: "Formato y forma esperada", desc: "Dale estructura explícita, longitud, tono, exclusiones y límites para que el parser o tu vista no se desborden.", ex: "Ejemplo: 'Output: 3 propuestas de servicio premium detalladas en una tabla comparativa.'" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl flex items-start gap-4 text-xs font-sans">
                        <span className="font-mono text-amber-500 font-extrabold text-sm translate-y-0.5 bg-amber-950/20 px-2.5 py-0.5 rounded border border-amber-800/35 font-bold">{item.num}</span>
                        <div className="space-y-1 flex-1 font-sans">
                          <span className="text-[9px] font-mono text-amber-400 font-bold block uppercase tracking-wider">{item.dim}</span>
                          <h4 className="text-[12px] font-bold text-white uppercase m-0 leading-none">{item.title}</h4>
                          <p className="text-[11px] text-neutral-400 leading-normal m-0">{item.desc}</p>
                          <div className="text-[10px] font-mono text-neutral-500 bg-black/20 p-1.5 rounded border border-white/5 mt-1 leading-snug">
                            {item.ex}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* THE 3 PROMPTS */}
                <div id="t-err-05" className="space-y-6 scroll-mt-24 border-t border-white/5 pt-6 text-left">
                  <div className="space-y-1 font-sans">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Caja de Herramientas</span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">Plantillas de contexto listas para usar</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Los tres prompts que cambian de raíz cómo arranca una sesión de trabajo con IA:
                    </p>
                  </div>

                  {/* PRESENTACION */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">1. Prompt de Presentación (Arrancá un hilo nuevo):</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.tresErroresPresentacion, "tErrPres")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["tErrPres"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.tresErroresPresentacion}</pre>
                  </div>

                  {/* ANCLAJE */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">2. Prompt de Anclaje de Proyecto (Largo plazo):</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.tresErroresAnclaje, "tErrAnc")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["tErrAnc"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.tresErroresAnclaje}</pre>
                    <div className="p-3 bg-neutral-900 border border-amber-500/10 rounded-xl">
                      <p className="text-[10px] text-amber-300 font-sans leading-relaxed m-0 italic font-mono">
                        * Consejo: Poner explícito lo que NO funcionó evita que la IA te sugiera obviedades tontas y acelera el brainstorming.
                      </p>
                    </div>
                  </div>

                  {/* AUDITORIA INVERSA */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">3. Prompt de Auditoría Inversa (Dejá que pregunte):</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.tresErroresAuditoria, "tErrAud")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["tErrAud"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.tresErroresAuditoria}</pre>
                  </div>

                  {/* CHECKLIST DE 7 PREGUNTAS */}
                  <div className="space-y-3 font-sans pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-white uppercase font-display leading-tight">Escaneo rápido mental de 7 puntos antes de enviar:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-sans">
                      {[
                        { n: "1", q: "¿Le dije quién soy?", d: "Tu rol concreto en esta sesión." },
                        { n: "2", q: "¿Dije para quién es?", d: "Saber exactamente la audiencia final." },
                        { n: "3", q: "¿Sabe qué proyecto es?", d: "Sustantivo claro y no palabras vagas." },
                        { n: "4", q: "¿Expliqué qué ya intenté?", d: "Evita perder tiempo con respuestas idénticas." },
                        { n: "5", q: "¿Establecí un formato?", d: "Tabla, bullets, extensión de página." },
                        { n: "6", q: "¿Dije cuándo cortar?", d: "Criterios de finalización para la IA." },
                        { n: "7", q: "¿Pedí feedback primero?", d: "Confirmación en tareas de alta complejidad." },
                      ].map((chk, cIdx) => (
                        <div key={cIdx} className="p-3 bg-neutral-900/40 rounded-xl border border-white/5 space-y-1 flex gap-2 font-sans">
                          <span className="font-mono text-amber-400 font-extrabold text-[12px] bg-amber-950/20 px-2 py-0.5 rounded border border-amber-800/30 self-start">{chk.n}</span>
                          <div>
                            <span className="text-white font-bold block leading-none mb-1">{chk.q}</span>
                            <span className="text-[10px] text-neutral-400 block leading-tight">{chk.d}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">La Regla del 60/20</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      Dedicarles <strong className="text-white">60 segundos</strong> a rellenar el alcance y situación del proyecto al inicio de cada conversación te ahorra <strong className="text-white">20 minutos</strong> batallando con respuestas redundantes. No asumas que la IA lee mentes.
                    </p>
                  </div>

                  {/* BOTTOM SWITCH CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {selectedGuideId === "prompting-101-anthropic" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 13 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Prompting 101: <span className="text-amber-400 italic font-sans normal-case font-normal">los 10 pilares de Anthropic</span>, traducidos al español
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Hannah y Christian, del equipo Applied AI de Anthropic, destilaron en una clase los 10 pilares que ellos mismos siguen para escribir prompts profesionales. Lo traemos con un caso real —un parte de accidente sueco— donde un prompt vago confunde un choque con un <strong className="text-white">accidente de esquí</strong> y, tras cinco versiones, termina dando un veredicto en XML listo para tu base de datos.
                  </p>
                </div>

                {/* QUICK GLANCE CELLS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("p101-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">Por qué falla (Opus 4.7)</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("p101-sec-02")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">Los 10 Pilares</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("p101-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold font-semibold">v1 &rarr; v5 Evolución</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("p101-sec-04")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-amber-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-amber-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-amber-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-amber-200 transition-colors font-semibold">Técnicas y Prompts</span>
                  </button>
                </div>

                {/* SECTION 1: OPUS 4.7 POR QUÉ CLAUDE SE SIENTE MÁS TONTO */}
                <div id="p101-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">01</strong> • El Contexto y Opus 4.7
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Opus 4.7: por qué Claude se siente &ldquo;más tonto&rdquo; (y tres cambios clave)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Si usas Claude y sientes que se volvió <strong className="text-white">más tonto</strong>, no es tu imaginación. El modelo nuevo, Opus 4.7, cambió cómo hay que pedirle las cosas. La buena noticia: no se volvió peor, dejó de adivinar. Ahora hace tal cual lo que le pides. Es ciencia empírica: lanzas, lees el output, identificas el error y ajustas.
                  </p>

                  <div className="space-y-4">
                    {/* CAMBIO 1 */}
                    <div className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-950/40 border border-amber-800/30 flex items-center justify-center font-mono text-amber-400 font-bold text-xs">1</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-none m-0">Claude dejó de adivinar (ahora es más literal)</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        <div className="p-3 bg-red-950/20 border border-red-900/20 rounded-xl text-neutral-400">
                          <span className="text-red-400 font-mono font-bold block uppercase text-[9px] mb-1">Antes</span>
                          Le aventabas algo vago como &ldquo;límpiame este texto&rdquo; y Claude adivinaba: arreglaba ortografía y acomodaba las frases por su cuenta.
                        </div>
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/20 rounded-xl text-neutral-300">
                          <span className="text-emerald-400 font-mono font-bold block uppercase text-[9px] mb-1">Ahora en Opus 4.7</span>
                          Claude hace literal lo que le dices. Ya no infiere lo que no pediste. Debes darle los pasos exactos y el alcance explícito.
                        </div>
                      </div>
                    </div>

                    {/* CAMBIO 2 */}
                    <div className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-950/40 border border-amber-800/30 flex items-center justify-center font-mono text-amber-400 font-bold text-xs">2</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-none m-0">El largo de la respuesta lo calibra solo</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        <div className="p-3 bg-red-950/20 border border-red-900/20 rounded-xl text-neutral-400">
                          <span className="text-red-400 font-mono font-bold block uppercase text-[9px] mb-1">Antes</span>
                          Claude de forma predeterminada soltaba respuestas de extensiones largas y elocuentes sin importar la complejidad.
                        </div>
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/20 rounded-xl text-neutral-300">
                          <span className="text-emerald-400 font-mono font-bold block uppercase text-[9px] mb-1">Ahora en Opus 4.7</span>
                          Juzga la complejidad: si dices &ldquo;resúmeme esto&rdquo;, te suelta una sola línea porque cree que eso es lo que asumes cómodo. Pide el nivel de detalle de antemano.
                        </div>
                      </div>
                    </div>

                    {/* CAMBIO 3 */}
                    <div className="p-5 bg-neutral-900/40 border border-white/5 rounded-2xl space-y-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-amber-950/40 border border-amber-800/30 flex items-center justify-center font-mono text-amber-400 font-bold text-xs">3</span>
                        <h4 className="text-xs font-bold text-white uppercase font-display leading-none m-0">Deja de gritar (nada de MAYÚSCULAS ni &ldquo;DEBES&rdquo;)</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                        <div className="p-3 bg-red-950/20 border border-red-900/20 rounded-xl text-neutral-400">
                          <span className="text-red-400 font-mono font-bold block uppercase text-[9px] mb-1">Antes</span>
                          Escribíamos: &ldquo;CRÍTICO: TIENES que hacer esto&rdquo;, en mayúsculas de énfasis para forzar obediencia.
                        </div>
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/20 rounded-xl text-neutral-300">
                          <span className="text-emerald-400 font-mono font-bold block uppercase text-[9px] mb-1">Ahora en Opus 4.7</span>
                          El lenguaje agresivo hace que el modelo responda peor. Háblale normal, como a una persona, y explícale el motivo de cada regla. Claude generaliza a partir de explicaciones.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: LOS 10 PILARES */}
                <div id="p101-sec-02" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">02</strong> • Estructura Maestra
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Los 10 pilares de Anthropic (Estructura de System + User)
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Anthropic recomienda construir el prompt como una sola pieza con estos 10 elementos en orden. Los primeros 6 normalmente viven en el <strong>system prompt</strong> (IDEALES para Prompt Caching); los últimos 4 van en los mensajes de usuario y modelan la respuesta.
                  </p>

                  {/* 10 PILARES VERTICAL LIST */}
                  <div className="grid grid-cols-1 gap-2.5 text-left">
                    {[
                      { num: "01", name: "Task description / Role", desc: "Le dices a Claude qué papel toma y para qué está aquí. Sin esto, adivina el dominio erróneamente.", badge: "System Prompt", ex: "Eres un asistente AI de un ajustador humano de seguros que revisa partes de accidente." },
                      { num: "02", name: "Tone context", desc: "Cómo debe sonar Claude (factual, conciso, sin adivinar). Si no está seguro de algo, que lo diga.", badge: "System Prompt", ex: "Mantente factual y directo. No inventes datos que no se puedan verificar." },
                      { num: "03", name: "Background data & Documents", desc: "La parte que NO cambia entre llamadas. Estructura de documentos, glosarios. Ideal para caching.", badge: "System Prompt", ex: "El formulario sueco tiene 17 filas numeradas y dos columnas (vehículo A y B)." },
                      { num: "04", name: "Detailed rules & Steps", desc: "Paso a paso de cómo razonar sobre la tarea. El orden importa para evitar sesgos.", badge: "System Prompt", ex: "1) Lee el formulario fila por fila. 2) Cruza con el sketch. 3) Emite el veredicto." },
                      { num: "05", name: "Examples (Few-Shot)", desc: "Casos reales resueltos con su entrada y salida esperada para modelar casos límite difíciles.", badge: "System/User", ex: "<example><input>...</input><output><verdict>A</verdict></output></example>" },
                      { num: "06", name: "Conversation history", desc: "Solo si hay historia previa relevante en sesiones de chats conversacionales largos.", badge: "System/User", ex: "El usuario ya autorizó el acceso a su póliza básica." },
                      { num: "07", name: "Immediate task description", desc: "El recordatorio de qué quieres en esta llamada específica, reduciendo la deriva del modelo.", badge: "User Message", ex: "Para este parte específico: ejecuta las reglas y danos el resultado." },
                      { num: "08", name: "Thinking step-by-step", desc: "Chain of Thought o Extended Thinking. Pide a Claude que piense antes de dar la respuesta.", badge: "User/System", ex: "Razona paso a paso dentro de un bloque <thinking> antes de contestar." },
                      { num: "09", name: "Output formatting", desc: "Cómo quieres el formato de salida: JSON, XML, Markdown para interactuar con parsers downstream.", badge: "User Message", ex: "Envuelve tu veredicto final en tags XML <final_verdict>...</final_verdict>." },
                      { num: "10", name: "Prefilled response", desc: "Párate en los zapatos del assistant y pre-llena su mensaje con el primer tag o carácter.", badge: "Assistant Prefill", ex: "Iniciar el mensaje del asistente con '<final_verdict>'" }
                    ].map((pilar, idx) => (
                      <div key={idx} className="p-4 bg-neutral-900/30 border border-white/5 rounded-xl flex items-start gap-4 text-xs font-sans">
                        <span className="font-mono text-amber-500 font-extrabold text-sm translate-y-0.5 bg-amber-950/20 px-2.5 py-0.5 rounded border border-amber-800/35 font-bold">{pilar.num}</span>
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-1.5">
                            <h4 className="text-[12px] font-bold text-white uppercase m-0 leading-none">{pilar.name}</h4>
                            <span className="px-1.5 py-0.5 bg-neutral-800 text-neutral-400 font-mono text-[8px] uppercase rounded font-bold">{pilar.badge}</span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-normal m-0">{pilar.desc}</p>
                          <div className="text-[10px] font-mono text-neutral-500 bg-black/20 p-1.5 rounded border border-white/5 mt-1">
                            Ejemplo: {pilar.ex}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 3: EL DEMO V1 A V5 */}
                <div id="p101-sec-03" className="space-y-6 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">03</strong> • Caso de Estudio
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El flujo iterativo real: del Accidente de Esquí al XML de Producción
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans text-neutral-300">
                    Hannah y Christian usaron un caso de seguros real: un formulario sueco con 17 checkboxes y un dibujo a mano alzada. Mira cómo evoluciona la instrucción agregando pilares paso a paso:
                  </p>

                  {/* STACKED EVOLUTION VIEWS */}
                  <div className="space-y-4">
                    {/* V1 */}
                    <div className="p-5 bg-red-950/5 border border-red-500/10 rounded-2xl relative text-left font-sans">
                      <span className="absolute right-4 top-4 font-mono text-red-500 text-xs font-extrabold bg-red-950/20 border border-red-900/30 px-1.5 py-0.5 rounded">v1 Falla</span>
                      <strong className="text-white text-xs block uppercase font-display mb-1 text-red-400">v1: Prompt vago monolítico</strong>
                      <p className="text-[11.5px] text-neutral-400 leading-relaxed mb-1.5 font-mono text-xs text-amber-500/90">
                        &ldquo;Revisa este parte y dime quién tuvo la culpa.&rdquo;
                      </p>
                      <p className="text-[10.5px] text-red-300/80 leading-snug m-0 italic bg-red-950/20 p-2 rounded-lg border border-red-900/10">
                        * Resultado: Claude se confunde con el sueco y asume que es un parte de accidente de esquí en una calle helada porque no tiene contexto del dominio automotriz.
                      </p>
                    </div>

                    {/* V2 */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative text-left font-sans">
                      <span className="absolute right-4 top-4 font-mono text-neutral-500 text-xs font-bold bg-neutral-800 px-1.5 py-0.5 rounded">v2</span>
                      <strong className="text-white text-xs block uppercase font-display mb-1">v2: Añadiendo Rol y Tono</strong>
                      <p className="text-[11.5px] text-neutral-300 leading-relaxed mb-1.5">
                        &ldquo;Eres un asistente de seguros que analiza un parte de accidente de auto sueco... Sé factual, no inventes.&rdquo;
                      </p>
                      <p className="text-[10.5px] text-neutral-400 leading-snug m-0 italic bg-black/20 p-2 rounded-lg border border-white/5">
                        * Corrige: Identifica el dominio automotriz y sabe que es un choque. Lee correctamente que el Vehículo A marcó la fila 1, pero duda en dar el veredicto definitivo.
                      </p>
                    </div>

                    {/* V3 */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative text-left font-sans">
                      <span className="absolute right-4 top-4 font-mono text-neutral-500 text-xs font-bold bg-neutral-800 px-1.5 py-0.5 rounded">v3</span>
                      <strong className="text-white text-xs block uppercase font-display mb-1">v3: Cacheando el Formulario sueco</strong>
                      <p className="text-[11.5px] text-neutral-300 leading-relaxed mb-1.5">
                        &ldquo;El formulario sueco contiene 17 filas numeradas... Cada una representa una maniobra en el momento del impacto.&rdquo;
                      </p>
                      <p className="text-[10.5px] text-neutral-400 leading-snug m-0 italic bg-black/20 p-2 rounded-lg border border-white/5">
                        * Corrige: Da un veredicto firme (Vehículo B responsable), pues ahora entiende el significado del formulario. Aprovecha la caché para ahorrar tokens.
                      </p>
                    </div>

                    {/* V4 */}
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl relative text-left font-sans">
                      <span className="absolute right-4 top-4 font-mono text-neutral-500 text-xs font-bold bg-neutral-800 px-1.5 py-0.5 rounded">v4</span>
                      <strong className="text-white text-xs block uppercase font-display mb-1">v4: Ordenando el Razonamiento y el Sketch</strong>
                      <p className="text-[11.5px] text-neutral-300 leading-relaxed mb-1.5">
                        &ldquo;Reglas: 1) Lista los casilleros del papel. 2) Compara con el dibujo del sketch. 3) Evalúa consistencia antes de sentenciar.&rdquo;
                      </p>
                      <p className="text-[10.5px] text-neutral-400 leading-snug m-0 italic bg-black/20 p-2 rounded-lg border border-white/5">
                        * Corrige: Ordena el CoT de Claude para evitar sesgos. Primero analiza la estructura textual, luego el sketch espacial y luego emite conclusiones paso a paso.
                      </p>
                    </div>

                    {/* V5 */}
                    <div className="p-5 bg-emerald-950/5 border border-emerald-500/10 rounded-2xl relative text-left font-sans">
                      <span className="absolute right-4 top-4 font-mono text-emerald-500 text-xs font-extrabold bg-emerald-950/20 border border-emerald-900/30 px-1.5 py-0.5 rounded">v5 Listo</span>
                      <strong className="text-white text-xs block uppercase font-display mb-1 text-emerald-400 font-bold">v5: Output Estructurado Parsable</strong>
                      <p className="text-[11.5px] text-neutral-350 leading-relaxed mb-1.5 font-mono text-xs text-amber-500/95">
                        &ldquo;Razona en &lt;thinking&gt; y danos el veredicto final envuelto strictly en &lt;final_verdict&gt;... Prefill message con: &lt;final_verdict&gt;&rdquo;
                      </p>
                      <p className="text-[10.5px] text-emerald-300/80 leading-snug m-0 italic bg-emerald-950/20 p-2 rounded-lg border border-emerald-900/10">
                        * Corrige: Se elimina todo el preámbulo parlanchín de Claude. El veredicto sale limpio y listo para ser parseado e insertado en tu base de datos mediante un script.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: TÉCNICAS Y PROMPTS */}
                <div id="p101-sec-04" className="space-y-8 pt-4 scroll-mt-24 border-t border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans">04</strong> • Caja de Herramientas
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      XML Tags, Prefill y Extended Thinking en Acción
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans text-neutral-300">
                    Claude se entrena específicamente para aislar bloques marcados en tags XML. Combinar esto con el pre-llenado de respuestas (Prefill) es la forma más barata y confiable de garantizar JSON o veredictos limpios.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left font-sans">
                      <span className="px-2 py-0.5 bg-neutral-800 font-mono text-amber-400 text-[10px] rounded uppercase font-bold">XML VS PROSA</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Envolver tus secciones en tags XML (<code className="font-mono text-[10px] text-amber-500 px-0.5">&lt;rules&gt;</code>, <code className="font-mono text-[10px] text-amber-500 px-0.5">&lt;background&gt;</code>) evita que Claude confunda datos de contexto con instrucciones de la tarea, activando además mejor el caching de Anthropic.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-900/30 border border-white/5 rounded-2xl space-y-2 text-left font-sans">
                      <span className="px-2 py-0.5 bg-neutral-800 font-mono text-amber-400 text-[10px] rounded uppercase font-bold">PREFILLED RESPONSES</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        En lugar de pedir por favor que no añada preámbulos, pon un tag (<code className="font-mono text-[10px] text-amber-500 px-0.5">&lt;final_verdict&gt;</code> o <code className="font-mono text-[10px] text-amber-500 px-0.5">&#123;</code>) como primer mensaje de respuesta de Claude. Completará el cuerpo directamente y sin preámbulos.
                      </p>
                    </div>
                  </div>

                  {/* PROMPT SKELETON COPIABLE */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Esqueleto estructurado de los 10 Pilares:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Esqueleto, "p101Esq")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Esq"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Esqueleto}</pre>
                  </div>

                  {/* AUDIT PROMPT */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans text-left">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Audita tu prompt actual contra los 10 pilares:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Auditoria, "p101Aud")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Aud"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Auditoria}</pre>
                  </div>

                  {/* ITERATIVE V1-v5 GENERATOR PROMPT */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Genera el flujo v1 a v5 para tu propia tarea:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Evolucion, "p101Ev")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Ev"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Evolucion}</pre>
                  </div>

                  {/* SYSTEM AND USER REFACTOR */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Refactoriza un prompt a System + User:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Refactor, "p101Ref")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Ref"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Refactor}</pre>
                  </div>

                  {/* OPUS 4.7 TOOLS HEADER */}
                  <div className="space-y-1 pt-4 border-t border-white/5">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-amber-500 font-sans font-bold">OPUS 4.7</strong> • Ajustes de Precisión
                    </span>
                    <h3 className="text-md font-bold text-white uppercase tracking-tight">
                      Afinando para la era Opus 4.7
                    </h3>
                  </div>

                  {/* 4.7 LARGE */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0 font-bold">Prompt: Controla la longitud de tus respuestas:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Largo, "p101Lar")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Lar"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Largo}</pre>
                  </div>

                  {/* 4.7 NORMAL */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Traduce prompts &ldquo;a gritos&rdquo; a tono normal:</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Normal, "p101Nor")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Nor"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Normal}</pre>
                  </div>

                  {/* 4.7 ALCANCE */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans text-left">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Forzar alcance a cada elemento (no solo el primero):</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Alcance, "p101Alc")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Alc"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Alcance}</pre>
                  </div>

                  {/* 4.7 VOZ */}
                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt: Configura la voz (cálida o ejecutiva):</h4>
                      <button 
                        onClick={() => handleCopy(PROMPTS_TEXTS.prompting101Voz, "p101Voz")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans font-bold"
                      >
                        {copiedStates["p101Voz"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">{PROMPTS_TEXTS.prompting101Voz}</pre>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Clave</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      No salgas a producción en tu plataforma o consola con un prompt simple. Sigue el flujo metodológico. Usa la caché de system prompt, define y limita el output con XML y Prefill para un pipeline de software impecable.
                    </p>
                  </div>

                  {/* BOTTOM SWITCH CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "claude-code-setup" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/20 border border-cyan-800/30 text-cyan-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                    <span>Lección 15 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    Claude Code Setup: <span className="text-cyan-400 italic font-sans normal-case font-normal">el plugin que escanea tu proyecto y te dice qué le falta</span>
                  </h1>
                  <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl font-sans font-sans">
                    Abres un proyecto nuevo en Claude Code y no sabes por dónde empezar a configurarlo. Anthropic publicó un plugin oficial que resuelve exactamente eso: <strong className="text-white">escanea tu codebase y te recomienda las top 1-2 automatizaciones de cada categoría</strong> — Hooks, Skills, MCP servers, Subagents y Slash commands. Es 100% read-only, no toca tus archivos, y tú decides qué aplicar.
                  </p>
                </div>

                {/* QUICK GLANCE CELLS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <button 
                    onClick={() => document.getElementById("cc-sec-00")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-cyan-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-cyan-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-cyan-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">01 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-cyan-200 transition-colors font-semibold">Qué es y por qué importa</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("cc-sec-01")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-cyan-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-cyan-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-cyan-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">02 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-cyan-200 transition-colors font-semibold">Cómo Instalar Claude Code</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("cc-sec-03")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-cyan-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-cyan-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-cyan-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">03 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-cyan-200 transition-colors font-semibold">Instalación del Plugin</span>
                  </button>

                  <button 
                    onClick={() => document.getElementById("cc-sec-05")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className="p-4 bg-neutral-900/40 hover:bg-cyan-950/20 text-left space-y-2 transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-95 border-b-2 border-transparent hover:border-cyan-500/40 w-full focus:outline-none"
                  >
                    <span className="font-mono text-cyan-400 text-[10px] font-bold block group-hover:translate-x-0.5 transition-transform">04 &rarr;</span>
                    <span className="text-[10.5px] text-neutral-300 font-sans block leading-tight group-hover:text-cyan-200 transition-colors font-semibold">Prompts de Escaneo</span>
                  </button>
                </div>

                {/* SECTION 00: QUE ES */}
                <div id="cc-sec-00" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">00</strong> • Qué es Claude Code Setup
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Un consejero, no un wizard: escanea y recomienda, tú decides
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Todos los que construimos con Claude Code venimos del mismo lugar: abres un proyecto nuevo, lo quieres configurar bien y no sabes por dónde empezar. ¿Le instalo hooks? ¿Cuáles? ¿Un MCP server me sirve aquí? ¿Qué skills necesito? Anthropic publicó un plugin oficial que resuelve exactamente esa pregunta.
                  </p>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Se llama <strong className="text-cyan-400 font-mono">claude-code-setup</strong> y vive en el marketplace oficial <strong className="text-white">claude-plugins-official</strong>. Con un solo comando escanea tu proyecto, entiende tu stack y te recomienda las top 1-2 automatizaciones de cada categoría. Tú decides cuáles aplicar.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-neutral-950/50 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-xs font-bold text-cyan-400 font-sans uppercase block">&#10003; Plugin oficial de Anthropic</span>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                        Lo mantiene el equipo de Anthropic (Isabella He). Vive en el repo público anthropics/claude-plugins-official (~20K estrellas).
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-950/50 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-xs font-bold text-cyan-400 font-sans uppercase block">&#10003; 100% read-only</span>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                        Escanea tus archivos pero no cambia nada. Tú sigues siendo el dueño absoluto de qué se aplica y qué no.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-950/50 border border-white/5 rounded-2xl text-left space-y-2">
                      <span className="text-xs font-bold text-cyan-400 font-sans uppercase block">&#10003; Top 1-2 por categoría</span>
                      <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                        No te tira una lista infinita. Eligen las 2 automatizaciones más valiosas de acuerdo a tu stack real de frameworks y dependencias.
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-dashed border-cyan-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-cyan-500/30 rounded text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Clave</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      <strong>Piénsalo así:</strong> es como cuando un amigo dev experto entra a tu proyecto, mira el package.json, los archivos, la estructura, y te dice "acá te falta un hook de auto-format, este MCP te ahorra horas, este subagent te va a salvar en producción". Pero no toca nada: tú decides qué aplicar. Esa es la diferencia entre claude-code-setup y un wizard de scaffolding: el wizard arma todo solo, este te pregunta antes.
                    </p>
                  </div>
                </div>

                {/* SECTION 01: INSTALAR CC */}
                <div id="cc-sec-01" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">01</strong> • Requisito previo
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Tener Claude Code listo: Dos caminos
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Antes de instalar el plugin, necesitas tener Claude Code corriendo en tu computadora. Hay dos caminos: la app oficial de escritorio (lo más fácil si es tu primera vez) o el CLI en tu terminal (más liviano para devs). El plugin funciona exactamente igual en ambos.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono m-0">Camino A • App de Escritorio</h4>
                      <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-2 font-sans pl-1">
                        <li>
                          <strong className="text-white">Descarga desde la web oficial:</strong> Ve a <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">claude.ai/download</a> y descarga el cliente adecuado para tu sistema.
                        </li>
                        <li>
                          <strong className="text-white">Instalación directa:</strong> Ejecuta el instalador e inicia sesión con tu cuenta existente de Claude.
                        </li>
                        <li>
                          <strong className="text-white">Confirma la versión 2.x:</strong> Ve a Settings &rarr; About y verifica que estés en la versión 2.0 o superior para habilitar el uso de plugins.
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono m-0">Camino B • CLI de Consola</h4>
                      <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-2 font-sans pl-1">
                        <li>
                          <strong className="text-white">Valida Node.js 18+:</strong> Ejecuta <code>node --version</code> para confirmar compatibilidad mínima.
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCopy("npm install -g @anthropic-ai/claude-code", "npmCC")} 
                            className="bg-neutral-900 border border-white/5 hover:border-cyan-500/20 px-2.5 py-1 text-[11px] text-cyan-400 rounded-lg cursor-pointer flex items-center gap-1.5 font-mono mb-2"
                          >
                            <span>npm install -g @anthropic-ai/claude-code</span>
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </li>
                        <li>
                          <button 
                            onClick={() => handleCopy("brew install --cask claude-code", "brewCC")} 
                            className="bg-neutral-900 border border-white/5 hover:border-cyan-500/20 px-2.5 py-1 text-[11px] text-cyan-400 rounded-lg cursor-pointer flex items-center gap-1.5 font-mono"
                          >
                            <span>brew install --cask claude-code</span>
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      </ol>
                    </div>
                  </div>

                  {/* SECTION 02: ABRIR PROYECTO */}
                  <div id="cc-sec-02" className="pt-4 space-y-3 text-left">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">02</strong> • Abrir tu Proyecto
                    </span>
                    <h4 className="text-sm font-black text-white font-display uppercase tracking-tight m-0">
                      Claude tiene que ver tu codebase
                    </h4>
                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                      Para que el recomendador pueda leer tu stack, debes abrir Claude Code dentro de la raíz de la carpeta del proyecto. 
                      En la app de escritorio, usa <strong className="text-white">File &rarr; Open Folder</strong>. 
                      En la terminal, haz un <code className="text-white font-mono">cd ~/tu-proyecto</code> y luego escribe <code className="text-white font-mono">claude</code> para arrancar.
                    </p>
                  </div>
                </div>

                {/* SECTION 03: INSTALACION PLUGIN */}
                <div id="cc-sec-03" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">03</strong> • Instalación en un paso
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Instalar el plugin: 1 comando, 5 segundos
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Con Claude Code abierto, pega este comando directamente en el chat para instalar el recomendador de forma global desde el marketplace oficial:
                  </p>

                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full font-sans">
                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Comando de Instalación:</h4>
                      <button 
                        onClick={() => handleCopy("/plugin install claude-code-setup@claude-plugins-official", "pluginInstallCmd")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                      >
                        {copiedStates["pluginInstallCmd"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">
/plugin install claude-code-setup@claude-plugins-official
                    </pre>

                    <p className="text-[11px] text-neutral-400 leading-relaxed font-sans pt-2">
                      Posteriormente, ejecuta esto para recargar todos tus plugins activos sin necesidad de reiniciar la app:
                    </p>

                    <div className="flex items-center justify-between font-sans">
                      <h4 className="text-xs font-bold text-white uppercase font-mono m-0">Comando de Recarga:</h4>
                      <button 
                        onClick={() => handleCopy("/reload-plugins", "reloadPluginsCmd")} 
                        className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                      >
                        {copiedStates["reloadPluginsCmd"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">
/reload-plugins
                    </pre>
                  </div>

                  <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2">
                    <span className="text-xs font-bold text-cyan-400 font-sans uppercase">Si te sale error: "plugin not found"</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      Si por alguna razón tu instalación no trae preconfigurado el marketplace, puedes meterlo de forma manual con el comando: 
                      <span className="text-white block font-mono text-center font-bold bg-neutral-900 py-1.5 rounded-lg border border-white/5 mt-2 select-all font-mono">/plugin marketplace add anthropics/claude-plugins-official</span>
                    </p>
                  </div>
                </div>

                {/* SECTION 04: LAS 5 CATEGORIAS */}
                <div id="cc-sec-04" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">04</strong> • Áreas de Análisis
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Las 5 categorías que el plugin te recomienda
                    </h3>
                  </div>

                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    Cuando le pides que escanee tu proyecto, el recomendador separa sus propuestas en estas 5 vertientes fundamentales:
                  </p>

                  <div className="space-y-4 font-sans">
                    {/* CATEGORY 1 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2 flex gap-4 items-start font-sans">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 mt-1 font-mono">1</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-none m-0">Hooks (Acciones Automáticas)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Disparadores que ejecutan formateadores (auto-format como Prettier), linter (auto-lint) u otras validaciones de Git antes de que guardes cambios de manera totalmente transparente.
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY 2 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2 flex gap-4 items-start font-sans">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 mt-1 font-mono">2</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-none m-0">Skills (Capacidades de Conocimiento)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Manuales de instrucciones inyectados en Claude (SKILL.md) que le dotan de experiencia modular inmediata, por ejemplo, diseño guiado de interfaces, revisiones técnicas estructuradas, etc.
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY 3 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2 flex gap-4 items-start font-sans">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 mt-1 font-mono">3</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-none m-0">MCP Servers (Conectores Externos)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Soporte para bases de datos, APIs o navegadores virtuales avanzados por medio de automatizaciones en terminal (como Playwright para scraping).
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY 4 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2 flex gap-4 items-start font-sans">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 mt-1 font-mono">4</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-none m-0">Subagents (Especialistas de Tarea)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Llamado automático de consultores temáticos en background (revisiones de seguridad, rendimiento, patrones SQL ineficientes), regresando con diagnósticos refinados.
                        </p>
                      </div>
                    </div>

                    {/* CATEGORY 5 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-2 flex gap-4 items-start font-sans">
                      <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 font-bold flex items-center justify-center font-mono text-xs shrink-0 mt-1 font-mono">5</div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase font-display leading-none m-0">Slash Commands (Atajos de Acción)</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Comandos inmediatos como <code>/test</code>, <code>/explain</code>, <code>/pr-review</code> que ejecutan flujos de trabajo extensos y formatean sus respuestas de forma estricta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 05: PROMPTS */}
                <div id="cc-sec-05" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">05</strong> • Biblioteca de Prompts
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      4 Prompts maestros para disparar el análisis
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* PROMPT 1 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full">
                      <div className="flex items-center justify-between font-sans">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0">Prompt 01: El más directo (del README oficial)</h4>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.claudeCodeRecomendaciones, "pCCRec")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                        >
                          {copiedStates["pCCRec"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto leading-relaxed whitespace-pre font-mono bg-black/20 rounded-lg">
                        {PROMPTS_TEXTS.claudeCodeRecomendaciones}
                      </pre>
                    </div>

                    {/* PROMPT 2 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full font-sans">
                      <div className="flex items-center justify-between font-sans">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0 font-sans">Prompt 02: Narrativo (ideal al arrancar de cero)</h4>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.claudeCodeNarrativo, "pCCNarr")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                        >
                          {copiedStates["pCCNarr"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">
                        {PROMPTS_TEXTS.claudeCodeNarrativo}
                      </pre>
                    </div>

                    {/* PROMPT 3 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full font-sans">
                      <div className="flex items-center justify-between font-sans">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0 font-sans">Prompt 03: Focalizado (solo para Hooks)</h4>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.claudeCodeFocalizado, "pCCFoc")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                        >
                          {copiedStates["pCCFoc"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">
                        {PROMPTS_TEXTS.claudeCodeFocalizado}
                      </pre>
                    </div>

                    {/* PROMPT 4 */}
                    <div className="p-5 bg-neutral-950 border border-white/5 rounded-2xl text-left space-y-3 font-sans w-full font-sans">
                      <div className="flex items-center justify-between font-sans">
                        <h4 className="text-xs md:text-sm font-bold text-white uppercase font-display leading-tight m-0 font-sans">Prompt 04: Extendido con Justificaciones</h4>
                        <button 
                          onClick={() => handleCopy(PROMPTS_TEXTS.claudeCodeExtendido, "pCCExt")} 
                          className="px-2.5 py-0.5 bg-neutral-800 text-[10px] text-white rounded font-medium hover:bg-neutral-700 transition cursor-pointer font-sans"
                        >
                          {copiedStates["pCCExt"] ? "✓ Copiado" : "Copiar"}
                        </button>
                      </div>
                      <pre className="p-3.5 text-[10.5px] text-neutral-400 overflow-x-auto max-h-56 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-lg">
                        {PROMPTS_TEXTS.claudeCodeExtendido}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* SECTION 06: EL FLOW */}
                <div id="cc-sec-06" className="space-y-6 pt-2 scroll-mt-24">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      <strong className="text-cyan-500">06</strong> • Qué Esperar
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      El flujo del análisis en 5 instantes
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <ol className="list-decimal list-inside text-xs text-neutral-400 space-y-3 font-sans pl-1">
                      <li>
                        <strong className="text-white font-sans">Escaneo inteligente read-only:</strong> Claude lee tus configuraciones y package.json, identificando frameworks al instante sin tocar un solo archivo.
                      </li>
                      <li>
                        <strong className="text-white font-sans">Procesamiento de 30s-1min:</strong> Tarda apenas unos segundos en destilar la estructura según la complejidad de la codebase.
                      </li>
                      <li>
                        <strong className="text-white font-sans">Output resumido:</strong> Te devuelve una propuesta limpia con los comandos para aplicar la configuración deseada en cada categoría.
                      </li>
                      <li>
                        <strong className="text-white font-sans">Evaluación manual:</strong> Tú decides qué elementos instalar de forma consciente; ninguno se activa en background de manera oculta o automática.
                      </li>
                      <li>
                        <strong className="text-white font-sans">Fácil setup de plugins:</strong> Las propuestas traen listas y comandos claros optimizados para meter al marketplace global.
                      </li>
                    </ol>
                  </div>
                </div>

                {/* SECTION 07: TRAMPAS */}
                <div id="cc-sec-07" className="space-y-6 pt-2 scroll-mt-24 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">
                      Advertencias Reales
                    </span>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      Las 6 trampas de las que nadie habla
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">1. Requiere versión 2.x</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        La API de plugins no está disponible en las versiones 1.x antiguas. Actualiza antes de correrlo.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">2. Marketplace ausente</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Si te da error "not found", es que el marketplace oficial de Anthropic no viene auto-cargado. Agregalo con el comando manual indicado en Paso 3.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">3. Selección acotada</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Solo te recomienda de las mejores 1-2 automatizaciones para mantenerlo limpio. Si quieres ver el catálogo completo usa la pestaña Discover del control de plugins.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">4. Instalación manual</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        El plugin proporciona las instrucciones pero no instala directamente nada en tu computadora por cuestiones de seguridad.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">5. Timeout en repos grandiosos</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Si tu proyecto tiene decenas de miles de archivos, Claude puede quedarse atascado. Apunta el escaneo solo a un subdirectorio si es el caso.
                      </p>
                    </div>

                    <div className="p-4 bg-neutral-950/40 rounded-xl space-y-1 border border-white/5 font-sans">
                      <span className="text-xs font-bold text-cyan-400 font-mono block font-mono">6. Dependencias o claves de terceros</span>
                      <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                        Ciertas integraciones recomendables (como las de Notion o servidores MCP específicos) igual requerirán que crees tus propias claves en esos portales de terceros.
                      </p>
                    </div>
                  </div>

                  {/* CHECKLIST */}
                  <div className="p-5 border border-dashed border-cyan-500/35 bg-neutral-900/40 rounded-2xl relative text-left my-6">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-cyan-500/30 rounded text-cyan-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Lista para principiantes</span>
                    <ul className="list-disc list-inside text-xs text-neutral-400 space-y-2 font-sans pt-1">
                      <li>Confirma que tienes Claude Code v2.x corriendo.</li>
                      <li>Abre cualquier proyecto tuyo (o crea una carpeta vacía).</li>
                      <li>Instala el plugin con <code>/plugin install claude-code-setup@claude-plugins-official</code> y recarga.</li>
                      <li>Pega el Prompt 01 y deja que analice tu espacio de trabajo.</li>
                    </ul>
                  </div>

                  {/* RESOURCES AND LINKS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 border-t border-white/5">
                    <a href="https://github.com/anthropics/claude-plugins-official" target="_blank" rel="noopener noreferrer" className="p-4 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-cyan-500/35 rounded-2xl text-left block transition-all group">
                      <strong className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase font-mono block mb-1">Repo Oficial en GitHub</strong>
                      <p className="text-[11px] text-neutral-400 leading-relaxed m-0 font-sans">
                        Marketplace oficial de Anthropic (~20K estrellas) donde viven claude-code-setup y docenas de otros plugins oficiales.
                      </p>
                    </a>

                    <a href="https://code.claude.com/docs/en/discover-plugins" target="_blank" rel="noopener noreferrer" className="p-4 bg-neutral-950 hover:bg-neutral-900 border border-white/5 hover:border-cyan-500/35 rounded-2xl text-left block transition-all group">
                      <strong className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors uppercase font-mono block mb-1">Docs de Plugins de Claude</strong>
                      <p className="text-[11px] text-neutral-400 leading-relaxed m-0 font-sans">
                        Documentación de Anthropic sobre cómo descubrir, instalar y auditar el sistema de seguridad y permisos de plugins.
                      </p>
                    </a>
                  </div>

                  {/* BOTTOM SWITCH CONTROLS */}
                  <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                    <button 
                      onClick={() => setSelectedGuideId(null)}
                      className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Volver al Catálogo</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedGuideId("que-automatizar");
                        onShowToast("🔄 Saltando a la primera lección...");
                      }}
                      className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Volver al inicio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGuideId === "skills-wentix-40" && (
              <div className="space-y-12 text-left animate-fade-in text-neutral-200">
                {/* HERO OVERVIEW */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/20 border border-amber-800/30 text-amber-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>Lección 17 de Wentix • Nivel Principiante</span>
                  </div>
                  <h1 className="text-2xl md:text-3.5xl font-extrabold text-white tracking-tight leading-none font-display uppercase font-mono">
                    40 Skills de Wentix AI: <span className="text-amber-400 italic font-sans normal-case font-normal">copia, pega y úsalas hoy mismo</span>
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl font-sans">
                    Una skill es un archivo <strong className="text-white font-mono text-xs bg-neutral-900 px-1 py-0.5 rounded border border-white/5">SKILL.md</strong> que dejas en una carpeta. Claude lo lee, y desde ese momento sabe hacer ese trabajo sin que se lo vuelvas a explicar. <strong className="text-amber-400">La diferencia entre un Claude prendido y un Claude operando tu semana es esa carpeta.</strong> Aquí tienes las 40 que armamos en Wentix AI para que cualquiera las pegue hoy mismo.
                  </p>
                </div>

                {/* METRICS / GLANCE */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">01–07</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Escritura</span>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">08–14</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Research</span>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">15–21</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Código</span>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">22–27</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Comms</span>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">28–34</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Datos</span>
                  </div>
                  <div className="p-4 bg-neutral-950 border border-white/5 rounded-2xl text-center space-y-1">
                    <span className="text-xs font-mono text-amber-400 block font-bold">35–40</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-sans">Personal</span>
                  </div>
                </div>

                {/* HOW IT WORKS / CONCEPT */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">¿Qué es una Skill?</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">Un archivo SKILL.md en una carpeta</h2>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans m-0">
                    Una skill de Claude es un archivo de Markdown llamado <strong className="text-white">SKILL.md</strong> con dos partes: un <strong className="text-amber-400 font-mono">frontmatter</strong> en YAML con <code>name</code> y <code>description</code>, y un <strong className="text-amber-400 font-mono">cuerpo</strong> con las instrucciones que el agente sigue. El campo más importante es <code>description</code>: funciona como gatillo. Si dice "Úsala cuando quieras redactar un cold email", Claude la activa de forma automática cuando tu instrucción calza con esa tarea.
                  </p>

                  <div className="p-4 bg-[#07070a] border border-white/5 rounded-2xl space-y-2">
                    <div className="flex bg-[#030305] justify-between items-center py-1.5 px-3 rounded-lg border border-white/5">
                      <span className="text-[10px] font-sans font-extrabold text-neutral-400 uppercase">Ejemplo mínimo de SKILL.md</span>
                      <button 
                        onClick={() => handleCopy(`---\nname: arquitecto-de-hilos\ndescription: Úsala cuando quieras convertir un tema, artículo o idea en un hilo de X.\n---\n\nEscribes hilos de X que la gente guarda.`, "exMin")}
                        className="px-2 py-0.5 bg-neutral-800 text-[9px] hover:bg-neutral-700 rounded text-neutral-200 transition font-sans font-black cursor-pointer"
                      >
                        {copiedStates["exMin"] ? "✓ Copiado" : "Copiar"}
                      </button>
                    </div>
                    <pre className="p-2.5 text-[11px] text-neutral-400 leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap rounded bg-black/20">
{`---
name: arquitecto-de-hilos
description: Úsala cuando quieras convertir un tema, artículo o idea en un hilo de X.
---

Escribes hilos de X que la gente guarda.`}
                    </pre>
                  </div>
                </div>

                {/* INSTALLATION FLOW */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Superficies admitidas</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">Cómo instalar una skill en 5 minutos</h2>
                  </div>

                  {/* TABS SELECTOR */}
                  <div className="flex border-b border-white/5 gap-1 pt-2">
                    <button
                      onClick={() => { setActiveInstallerTab("web"); onShowToast("📋 Guía para Claude.ai (Web / Desktop)"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer ${activeInstallerTab === "web" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      Claude.ai (Web / Desktop)
                    </button>
                    <button
                      onClick={() => { setActiveInstallerTab("cli"); onShowToast("📋 Guía para Claude Code (CLI)"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer ${activeInstallerTab === "cli" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      Claude Code (CLI)
                    </button>
                    <button
                      onClick={() => { setActiveInstallerTab("git"); onShowToast("📋 Guía para Equipos (Git / Repo)"); }}
                      className={`px-4 py-2 text-xs font-mono border-b-2 transition cursor-pointer ${activeInstallerTab === "git" ? "border-amber-400 text-amber-400 font-bold" : "border-transparent text-neutral-500 hover:text-white"}`}
                    >
                      Equipo / Repo
                    </button>
                  </div>

                  {/* TAB OUTPUTS */}
                  {activeInstallerTab === "web" && (
                    <div className="space-y-4 animate-fade-in">
                      <ol className="space-y-4 text-xs font-sans">
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 1: Crea la carpeta</strong>
                          <p className="text-neutral-400 m-0">En tu disco local, crea una carpeta con el nombre de la skill (ej. <code className="text-amber-400 font-mono">arquitecto-de-hilos</code>).</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 2: Pega el SKILL.md</strong>
                          <p className="text-neutral-400 m-0">Copia el contenido del bloque de cualquier skill deseada, crea un archivo de texto plano llamado <code className="text-amber-400 font-mono">SKILL.md</code> dentro de la carpeta y pega las instrucciones.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 3: Comprime como ZIP</strong>
                          <p className="text-neutral-400 m-0">Comprime la carpeta en formato ZIP para generar un archivo con el mismo nombre.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 4: Sube en tu cuenta de Claude</strong>
                          <p className="text-neutral-400 m-0">Entra a <strong className="text-white">claude.ai → Settings → Skills → Add Skill</strong> y sube el archivo ZIP. Claude la activará automáticamente en cada conversación que cumpla con el gatillo.</p>
                        </li>
                      </ol>
                    </div>
                  )}

                  {activeInstallerTab === "cli" && (
                    <div className="space-y-4 animate-fade-in text-xs">
                      <div className="p-4 bg-[#07070a] border border-white/5 rounded-2xl space-y-3">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 block">Comando de terminal rápida</span>
                        <div className="flex bg-[#030305] border border-white/5 px-3 py-2 rounded-xl justify-between items-center font-mono">
                          <code className="text-amber-400 text-xs overflow-x-auto whitespace-nowrap mr-2 select-all">mkdir -p ~/.claude/skills/arquitecto-de-hilos && touch ~/.claude/skills/arquitecto-de-hilos/SKILL.md</code>
                          <button 
                            onClick={() => handleCopy("mkdir -p ~/.claude/skills/arquitecto-de-hilos && touch ~/.claude/skills/arquitecto-de-hilos/SKILL.md", "cliIns")}
                            className="text-neutral-400 hover:text-amber-400 text-xs transition px-2 py-1 h-fit cursor-pointer font-bold font-sans"
                          >
                            {copiedStates["cliIns"] ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                      </div>

                      <ol className="space-y-4 text-xs font-sans mt-3">
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 1: Corre el comando anterior</strong>
                          <p className="text-neutral-400 m-0">Esto creará la estructura global de folders para tu terminal de Claude Code.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 2: Rellena el archivo SKILL.md</strong>
                          <p className="text-neutral-400 m-0">Abre el archivo creado en tu editor de código o consola y pega las instrucciones de la skill.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 3: Listo en la próxima sesión</strong>
                          <p className="text-neutral-400 m-0">En tu próxima terminal de Claude Code, las nuevas capacidades se cargarán automáticamente.</p>
                        </li>
                      </ol>
                    </div>
                  )}

                  {activeInstallerTab === "git" && (
                    <div className="space-y-4 animate-fade-in">
                      <ol className="space-y-4 text-xs font-sans">
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 1: Crea las carpetas en el repositorio</strong>
                          <p className="text-neutral-400 m-0">En la raíz del proyecto Git de tu equipo, crea el directorio de configuración <code className="text-amber-400 font-mono">.claude/skills/&lt;nombre_skill&gt;/</code>.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 2: Pon las instrucciones</strong>
                          <p className="text-neutral-400 m-0">Crea el archivo <code className="text-amber-400 font-mono">SKILL.md</code> dentro de ese folder local y guarda tus pautas de automatización.</p>
                        </li>
                        <li className="p-4 bg-neutral-950/50 rounded-2xl border border-white/5 space-y-1">
                          <strong className="text-white block font-sans text-xs">Paso 3: Haz Commit & Push</strong>
                          <p className="text-neutral-400 m-0">Sube tus cambios a Git. Cuando un compañero de software clone el repositorio de tu proyecto y use Claude, la skill ya vendrá integrada en el repositorio.</p>
                        </li>
                      </ol>

                      <div className="p-4 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl text-left">
                        <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                          Añadir skills a Git es la forma más rápida de que un equipo entero use las mismas instrucciones técnicas. Los SKILL.md en Git se pueden auditar con pull requests como cualquier otro archivo de código.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* INTERACTIVE SKILLS LIBRARY */}
                <div id="skills-library-indicator" className="space-y-6 pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Biblioteca de Skills de Wentix</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">Explora las 40 Skills de Alto Rendimiento</h2>
                  </div>

                  {/* SEARCH & FILTERS BAR */}
                  <div className="flex flex-col md:flex-row gap-3 pt-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        value={skillsSearch}
                        onChange={(e) => setSkillsSearch(e.target.value)}
                        placeholder="Buscar entre las 40 skills por título, descripción, gatillo o código..."
                        className="w-full bg-neutral-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans"
                      />
                      {skillsSearch && (
                        <button
                          onClick={() => setSkillsSearch("")}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white font-sans text-xs cursor-pointer bg-transparent border-0 font-bold"
                        >
                          Limpiar
                        </button>
                      )}
                    </div>

                    {/* SELECT CATEGORY PILLS */}
                    <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
                      <button
                        onClick={() => { setActiveSkillCategory("todos"); onShowToast("🔍 Mostrando todas las categorías"); }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-mono whitespace-nowrap transition cursor-pointer select-none ${activeSkillCategory === "todos" ? "bg-amber-400 text-black font-bold" : "bg-neutral-950 border border-white/5 text-neutral-400 hover:text-white"}`}
                      >
                        Todos
                      </button>
                      {SKILLS_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveSkillCategory(cat.id); onShowToast(`🔍 Categoría: ${cat.name}`); }}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono whitespace-nowrap transition cursor-pointer select-none ${activeSkillCategory === cat.id ? "bg-amber-400 text-black font-bold" : "bg-neutral-950 border border-white/5 text-neutral-400 hover:text-white"}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SKILLS CONTAINER */}
                  <div className="space-y-8 pt-4">
                    {(() => {
                      const filteredCategories = SKILLS_CATEGORIES.map(category => {
                        const matchesCategory = activeSkillCategory === "todos" || activeSkillCategory === category.id;
                        if (!matchesCategory) return { ...category, skills: [] };

                        const filteredSkills = category.skills.filter(skill => {
                          const query = skillsSearch.toLowerCase();
                          return skill.name.toLowerCase().includes(query) || 
                                 skill.description.toLowerCase().includes(query) || 
                                 skill.body.toLowerCase().includes(query);
                        });

                        return {
                          ...category,
                          skills: filteredSkills
                        };
                      }).filter(category => category.skills.length > 0);

                      if (filteredCategories.length > 0) {
                        return filteredCategories.map((cat) => (
                          <div key={cat.id} className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-950/20 text-amber-400 border border-amber-800/30 text-xs font-mono font-bold">
                                {cat.num}
                              </span>
                              <div className="text-left">
                                <h3 className="text-sm font-black text-white uppercase font-display tracking-wider leading-none m-0">
                                  {cat.name}
                                </h3>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {cat.skills.length} skills encontradas
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {cat.skills.map((skill) => {
                                const isExpanded = expandedSkillId === skill.id;
                                const diffColor = 
                                  skill.difficulty === "Principiante" ? "text-amber-400 border-amber-500/20 bg-amber-950/10" :
                                  skill.difficulty === "Intermedio" ? "text-cyan-400 border-cyan-500/20 bg-cyan-950/10" :
                                  "text-purple-400 border-purple-500/20 bg-purple-950/10";

                                return (
                                  <div 
                                    key={skill.id} 
                                    className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all self-start ${isExpanded ? "bg-neutral-950 border-amber-500/25 shadow-lg shadow-amber-500/5 col-span-1 md:col-span-2" : "bg-neutral-950/60 hover:bg-neutral-950 border-white/5 hover:border-amber-500/10"}`}
                                  >
                                    <div>
                                      <div className="flex justify-between items-start gap-2">
                                        <span className="text-2xs font-mono text-amber-400 font-black tracking-widest uppercase">
                                          Skill {skill.num}
                                        </span>
                                        <span className={`text-[9px] font-mono border rounded-full px-2 py-0.5 font-bold uppercase select-none ${diffColor}`}>
                                          {skill.difficulty}
                                        </span>
                                      </div>
                                      <h4 className="text-sm font-bold text-white uppercase font-display leading-tight mt-1.5 m-0">
                                        {skill.name}
                                      </h4>
                                      <p className="text-xs text-neutral-400 leading-normal mt-2 font-sans m-0">
                                        {skill.description}
                                      </p>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col space-y-3">
                                      <div className="flex justify-between items-center text-xs">
                                        <button
                                          onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                                          className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer font-sans h-fit py-1 bg-transparent border-0"
                                        >
                                          <span>{isExpanded ? "Ocultar SKILL.md" : "Ver SKILL.md"}</span>
                                          <ChevronDown className={`w-3.5 h-3.5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                        </button>
                                        
                                        <button
                                          onClick={() => handleCopy(skill.body, skill.id)}
                                          className="px-3 py-1 bg-neutral-900 border border-white/5 rounded-lg hover:bg-neutral-800 text-white font-mono select-none h-fit hover:border-amber-500/20 transition cursor-pointer"
                                        >
                                          {copiedStates[skill.id] ? "✓ Copiado" : "Copiar Código"}
                                        </button>
                                      </div>

                                      {isExpanded && (
                                        <div className="space-y-2 animate-slide-up mt-2">
                                          <div className="flex justify-between items-center bg-[#07070a] px-3 py-1.5 rounded-t-lg border-t border-x border-white/5 font-mono text-[9px] text-neutral-400">
                                            <span>FORMATO SKILL.md</span>
                                            <button 
                                              onClick={() => handleCopy(skill.body, `inner-${skill.id}`)}
                                              className="text-[9px] text-neutral-400 hover:text-amber-400 cursor-pointer bg-transparent border-0 font-bold"
                                            >
                                              {copiedStates[`inner-${skill.id}`] ? "✓ Copiado" : "Copiar"}
                                            </button>
                                          </div>
                                          <pre className="p-4 text-xs text-neutral-300 font-mono overflow-x-auto leading-relaxed max-h-[400px] bg-[#030305] border border-white/5 rounded-b-lg whitespace-pre-wrap select-text m-0">
                                            {skill.body}
                                          </pre>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ));
                      } else {
                        return (
                          <div className="py-12 bg-neutral-950 border border-white/5 rounded-3xl text-center space-y-2">
                            <p className="text-xs text-neutral-500 font-mono m-0">No se encontraron skills que coincidan con tu búsqueda.</p>
                            <button
                              onClick={() => { setSkillsSearch(""); setActiveSkillCategory("todos"); }}
                              className="px-3.5 py-1.5 bg-neutral-900 text-xs text-white rounded-xl hover:bg-neutral-800 cursor-pointer border-0"
                            >
                              Restablecer filtros
                            </button>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </div>

                {/* PACKS & RECOMMENDATIONS */}
                <div className="space-y-6 pt-6 border-t border-white/5 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Adopción inteligente</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">No instales las 40: Elige tu Pack ideal</h2>
                  </div>
                  <p className="text-xs text-neutral-400 leading-normal font-sans m-0">
                    La regla de oro para adoptar automatización: elige las 5 que tu día a día de verdad usa, instálalas en un solo día, y úsalas por dos semanas consecutivas. Si alguna no te funciona, la descartas y la cambias por otra del catálogo.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SKILLS_PACKS.map((pack) => (
                      <div key={pack.name} className="p-5 bg-neutral-950 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-mono text-amber-400 block font-bold uppercase">{pack.name}</span>
                          <p className="text-xs text-neutral-400 leading-normal font-sans m-0">{pack.description}</p>
                        </div>
                        <ul className="text-xs leading-relaxed font-sans space-y-1 pl-0 list-none pt-2 border-t border-white/5 m-0">
                          {pack.skillsList.map((skillRef) => (
                            <li 
                              key={skillRef} 
                              onClick={() => {
                                const plainName = skillRef.split(" · ")[1] || skillRef;
                                setSkillsSearch(plainName);
                                setActiveSkillCategory("todos");
                                onShowToast(`🔍 Buscando: ${plainName}`);
                                const element = document.getElementById("skills-library-indicator");
                                if (element) {
                                  element.scrollIntoView({ behavior: "smooth" });
                                }
                              }}
                              className="text-neutral-400 hover:text-amber-400 cursor-pointer flex items-center gap-1 font-mono transition-colors text-[10px]"
                            >
                              <span className="text-amber-500 font-bold">&#8250;</span>
                              <span>{skillRef}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* THE 30 DAYS PLAN */}
                <div id="skills-library-indicator" className="space-y-6 pt-6 border-t border-white/5 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Metodología de incorporación</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">Tu Plan de Implementación de 30 Días</h2>
                  </div>
                  <p className="text-xs text-neutral-400 leading-normal font-sans m-0">
                    Claude es el motor. Las skills son el volante. Sin skills, estás pisando el acelerador esperando llegar a algún lado bueno de forma fortuita. La buena noticia: tomar el volante te costará menos de 5 minutos por skill siguiendo este flujo de 30 días.
                  </p>

                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-neutral-950 font-sans">
                    <table className="w-full text-xs text-left text-neutral-400 border-collapse">
                      <thead>
                        <tr className="bg-[#0b0b10] border-b border-white/5 text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                          <th className="p-3.5 font-bold">Cuándo</th>
                          <th className="p-3.5 font-bold">Acción o Instrucción Concreta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PLAN_DAYS.map((p, idx) => (
                          <tr key={idx} className="border-b border-white/5 hover:bg-neutral-900/10">
                            <td className="p-3.5 font-bold text-white whitespace-nowrap font-mono">{p.day}</td>
                            <td className="p-3.5 leading-relaxed text-neutral-300 font-sans">{p.task}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-5 border border-dashed border-amber-500/35 bg-neutral-900/40 rounded-2xl relative text-left">
                    <span className="absolute -top-3 left-4 px-2 bg-neutral-950 border border-amber-500/30 rounded text-amber-400 font-mono text-[9px] font-bold uppercase tracking-widest text-[10px]">Wentix • Clave</span>
                    <p className="text-xs text-neutral-400 leading-relaxed m-0 font-sans">
                      <strong>Si llegaste hasta aquí pero todavía no abriste la primera carpeta:</strong> Abre tu terminal de Claude Code, pega el primer comando de la sección de instalación, copia el SKILL.md de la skill 01 y termina la jugada. La diferencia entre guardar esta guía y mejorar tu semana de trabajo se decide en tus próximos 5 minutos de acción real.
                    </p>
                  </div>
                </div>

                {/* FAQs */}
                <div className="space-y-6 pt-6 border-t border-white/5 text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block">Resolución de dudas</span>
                    <h2 className="text-lg md:text-xl font-bold text-white uppercase font-display leading-none">Preguntas Frecuentes sobre las Skills</h2>
                  </div>

                  <div className="space-y-3">
                    {SKILLS_FAQS.map((faq, idx) => {
                      const isFaqExpanded = expandedFaq === idx;
                      return (
                        <div key={idx} className="p-4 bg-neutral-950/60 hover:bg-neutral-950 border border-white/5 rounded-2xl transition">
                          <button
                            onClick={() => { setExpandedFaq(isFaqExpanded ? null : idx); onShowToast(`💬 Pregunta: ${faq.q}`); }}
                            className="w-full flex justify-between items-center text-left text-xs font-bold text-white uppercase font-display leading-relaxed cursor-pointer bg-transparent border-0"
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

                {/* BOTTOM SWITCH CONTROLS */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs font-sans">
                  <button 
                    onClick={() => setSelectedGuideId(null)}
                    className="px-4 py-2 bg-neutral-900 border border-white/10 text-neutral-300 rounded-xl hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Volver al Catálogo</span>
                  </button>

                  <button 
                    onClick={() => {
                      setSelectedGuideId("que-automatizar");
                      onShowToast("🔄 Saltando a la primera lección...");
                    }}
                    className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 shadow-md shadow-amber-500/15 transition flex items-center gap-1.5 cursor-pointer border-0"
                  >
                    <span>Volver al inicio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* CONNECTED GUIDES Persistent Footer inside reader */}
            <div className="pt-10 space-y-6 text-left">
              <h4 className="text-sm font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Repeat className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Otras guías recomendadas de Wentix</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {METADATA.filter(m => m.id !== selectedGuideId).slice(0, 3).map((linked) => (
                  <div
                    key={linked.id}
                    onClick={() => {
                      setSelectedGuideId(linked.id);
                      onShowToast(`🔄 Saltando a: ${linked.title}`);
                    }}
                    className="group bg-neutral-900/40 hover:bg-neutral-900/90 border border-white/5 hover:border-cyan-500/20 p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-neutral-500 uppercase tracking-widest block">
                        Lección {linked.lessonNum} • {linked.level}
                      </span>
                      <h5 className="text-xs font-black text-white uppercase font-display mt-1.5 leading-snug group-hover:text-cyan-400 transition-colors">
                        {linked.title}
                      </h5>
                      <p className="text-[11px] text-neutral-400 font-sans mt-1.5 leading-normal line-clamp-2">
                        {linked.lead}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
