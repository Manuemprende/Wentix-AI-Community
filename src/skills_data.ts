export interface SkillItem {
  id: string;
  num: string;
  name: string;
  difficulty: "Principiante" | "Intermedio" | "Avanzado";
  description: string;
  body: string;
}

export interface SkillCategory {
  id: string;
  num: string;
  name: string;
  skills: SkillItem[];
}

export interface SkillPack {
  name: string;
  description: string;
  skillsList: string[]; // references of shape "XX · Name"
}

export const SKILLS_CATEGORIES: SkillCategory[] = [
  {
    id: "escritura",
    num: "01",
    name: "Escritura y contenido",
    skills: [
      {
        id: "s1",
        num: "01",
        name: "El Arquitecto de Hilos",
        difficulty: "Principiante",
        description: "Convierte una idea cruda en un hilo de redes con gancho, cuerpo y cierre que la gente guarda.",
        body: `---
name: arquitecto-de-hilos
description: Úsala cuando quieras convertir un tema, artículo o idea en un hilo de varios posts para redes sociales.
---

Escribes hilos que la gente guarda.

Cuando se invoque:
1. Pide la idea central si no la dieron.
2. Abre con un gancho de una línea que atrape. Sin rodeos, sin "¿alguna vez te has preguntado...".
3. En el segundo post, suma una línea tipo "guarda esto" para que se nota que vale la pena seguir leyendo.
4. Cuerpo: 5 posts, una idea por post, con números o ejemplos concretos, en segunda persona.
5. Cierra con una línea fuerte y una invitación suave a comentar o compartir.

Reglas: nada de relleno. Cada post cabe en el límite de la plataforma que el usuario indique. Sin emojis salvo que los pidan.`
      },
      {
        id: "s2",
        num: "02",
        name: "El Esqueleto de Artículo",
        difficulty: "Principiante",
        description: "Genera un esquema completo de artículo desde una sola frase, listo para sobrevivir al borrador.",
        body: `---
name: esqueleto-de-articulo
description: Úsala cuando el usuario te dé un tema y quiera un esquema completo de artículo antes de escribirlo.
---

Construyes esquemas de artículo que sobreviven al borrador.

Cuando se invoque:
1. Reformula el tema en una sola frase clara.
2. Propón 3 opciones de gancho de apertura. El usuario elige una.
3. Arma el esquema: gancho, contexto breve, 4-6 secciones numeradas, un punto incómodo o sorprendente, cierre.
4. Cada sección lleva una idea central de una línea y 3 viñetas de apoyo.
5. Suma una estimación de palabras y tiempo de lectura.

Output en formato de encabezados, sin párrafos introductorios largos.`
      },
      {
        id: "s3",
        num: "03",
        name: "El Email en Frío",
        difficulty: "Intermedio",
        description: "Redacta un correo en frío que se lee como humano y que de verdad recibe respuesta.",
        body: `---
name: email-en-frio
description: Úsala cuando el usuario quiera redactar un correo en frío para un prospecto o cliente potencial.
---

Escribes correos en frío que reciben respuesta.

Cuando se invoque, pide: rol del destinatario, empresa del destinatario, qué ofrece quien escribe, y un detalle reciente y específico sobre esa empresa o persona.

Después redacta:
- Asunto de menos de 6 palabras, sin signos de exclamación ni palabras de venta agresivas.
- Línea 1: referencia ese detalle específico que notaste.
- Línea 2: una frase sobre lo que haces para empresas como la suya.
- Línea 3: una petición suave y concreta ("¿te late una llamada de 15 minutos?").
- Cierre: solo el nombre, sin frases de cortesía vacías.

Sin "espero que este correo te encuentre bien". Sin "solo quería dar seguimiento".`
      },
      {
        id: "s4",
        num: "04",
        name: "El Repurposeador",
        difficulty: "Principiante",
        description: "Convierte un artículo largo en piezas cortas nativas para varias plataformas, sin perder la voz original.",
        body: `---
name: repurposeador
description: Úsala cuando el usuario quiera convertir una pieza larga en posts cortos para distintas plataformas.
---

Conviertes contenido largo en piezas cortas nativas por plataforma.

Cuando se invoque, pide el artículo de origen y las plataformas destino.

Genera una variante por plataforma:
- Red social tipo X: hilo de 5-7 posts con gancho y cierre.
- LinkedIn: post de 5-6 párrafos cortos, ángulo distinto, cierra con una pregunta.
- Newsletter: introducción de 100-120 palabras, tono conversado, termina invitando a seguir leyendo.
- Instagram: caption de 4 líneas, con salto de línea entre cada una.
- Video corto: guion de 45 segundos en 3 momentos clave.

Conserva la voz original. Saca los números y ejemplos concretos de la pieza fuente.`
      },
      {
        id: "s5",
        num: "05",
        name: "La Forja de Titulares",
        difficulty: "Intermedio",
        description: "Saca 10 variantes de titular con ángulos distintos de curiosidad, sin caer en clickbait.",
        body: `---
name: forja-de-titulares
description: Úsala cuando el usuario quiera opciones de titular para un artículo, video o post.
---

Escribes titulares que se ganan el clic sin engañar a nadie.

Cuando se invoque, pide: tema, audiencia, y un dato o número específico de la pieza.

Genera 10 variantes en estos ángulos:
1. Número más resultado concreto.
2. "La mayoría no sabe que…"
3. El error que costó algo específico.
4. Una acción que se puede copiar y aplicar directo.
5. Urgencia con un límite de tiempo real.
6. Una verdad contraintuitiva.
7. Un caso o ejemplo con nombre específico.
8. Una pregunta que persigue al lector.
9. Transformación de antes a después.
10. El ángulo incómodo que nadie dice en voz alta.

Marca cada uno con una predicción de qué tan llamativo es. Cero clickbait: cada número y afirmación tiene que ser real.`
      },
      {
        id: "s6",
        num: "06",
        name: "El Imitador de Voz",
        difficulty: "Avanzado",
        description: "Estudia muestras de escritura y produce contenido nuevo en esa misma voz, con precisión.",
        body: `---
name: imitador-de-voz
description: Úsala cuando el usuario quiera igualar la voz de escritura de una persona o marca existente.
---

Replicas voces de escritura con precisión.

Cuando se invoque:
1. Pide 3 muestras de escritura de la voz objetivo.
2. Extrae el perfil de voz: largo típico de oración, nivel de vocabulario, densidad de los párrafos, frases que se repiten, manejo de la puntuación, formas de abrir y de cerrar un texto.
3. Devuelve ese perfil como una lista de 10 puntos.
4. Pide al usuario que confirme si el perfil quedó bien.
5. Redacta el contenido nuevo respetando cada dimensión del perfil.

Nunca inventes muletillas que las muestras no muestran. Si hay algo que no estás seguro de replicar bien, márcalo.`
      },
      {
        id: "s7",
        num: "07",
        name: "El Doctor de Guiones",
        difficulty: "Intermedio",
        description: "Reescribe cualquier guion con un gancho fuerte al inicio y ritmo que mantiene la atención.",
        body: `---
name: doctor-de-guiones
description: Úsala cuando el usuario tenga un guion de video o audio que necesite ajustar para retener mejor a la audiencia.
---

Ajustas guiones de video o audio para que la gente no se vaya a mitad de camino.

Cuando se invoque, pide el guion fuente y la duración objetivo.

Después:
1. Reconstruye los primeros 5 segundos como un gancho con algo en juego de verdad.
2. Mete un cambio de ritmo cada 5-8 segundos (un corte, un contraste, una pregunta, un número, un nombre).
3. Quita relleno: "solo", "realmente", "básicamente", "muy", "actualmente".
4. Convierte frases en voz pasiva a voz activa.
5. Termina con una sola línea de cierre, sin pedir que sigan el canal de forma genérica.

Entrega en dos columnas: línea original y línea ajustada, con una nota corta de por qué se cambió.`
      }
    ]
  },
  {
    id: "research",
    num: "02",
    name: "Research y análisis",
    skills: [
      {
        id: "s8",
        num: "08",
        name: "El Cazador de Fuentes",
        difficulty: "Intermedio",
        description: "Devuelve fuentes primarias con cita y enlace para cualquier afirmación, nada de resúmenes genéricos.",
        body: `---
name: cazador-de-fuentes
description: Úsala cuando el usuario necesite fuentes confiables y verificables para una afirmación o artículo.
---

Encuentras fuentes primarias y sacas citas textuales.

Cuando se invoque, pide la afirmación específica que necesita respaldo.

Después:
1. Busca 5 fuentes primarias: documentos oficiales, estudios, comunicados, artículos firmados por periodistas reconocidos.
2. Para cada fuente: enlace, fecha de publicación, autor o institución, cita textual que respalde la afirmación.
3. Evita enciclopedias colaborativas, foros, agregadores y resúmenes generados por IA sin verificar.
4. Marca cualquier afirmación donde no encuentres una fuente primaria confiable.

Entrega en tabla numerada. Siempre incluye el enlace.`
      },
      {
        id: "s9",
        num: "09",
        name: "La Autopsia de Competencia",
        difficulty: "Avanzado",
        description: "Mapea posicionamiento, precios y huecos de un competidor con honestidad directa.",
        body: `---
name: autopsia-de-competencia
description: Úsala cuando el usuario quiera un análisis estructurado de un competidor.
---

Analizas competidores con honestidad directa.

Cuando se invoque, pide el nombre del competidor y el producto o ángulo propio del usuario.

Genera 6 secciones:
1. Posicionamiento: cómo se describen ellos versus cómo los describen sus clientes.
2. Precios: cada precio público, forma de cobro, niveles escondidos.
3. Su fortaleza más sólida: lo único que hacen mejor que nadie.
4. Su punto más débil: el hueco sin cubrir por donde se les puede ganar.
5. Movimientos recientes: 3 cambios de producto o marketing en los últimos meses.
6. Veredicto: dónde puedes ganarles y dónde mejor no competir de frente.

Usa números y enlaces concretos. Evita frases vagas como "parece que ellos…".`
      },
      {
        id: "s10",
        num: "10",
        name: "El Estimador de Mercado",
        difficulty: "Avanzado",
        description: "Construye un cálculo de tamaño de mercado defendible, con la matemática a la vista.",
        body: `---
name: estimador-de-mercado
description: Úsala cuando el usuario necesite un estimado defendible de tamaño de mercado para un producto o servicio.
---

Construyes estimados de mercado con rigor de presentación ejecutiva.

Cuando se invoque, pide producto, geografía y horizonte de tiempo.

Después:
1. Define al comprador objetivo en una sola frase.
2. Saca 3 fuentes de datos independientes para el conteo de compradores y la disposición a pagar.
3. Calcula el mercado total, el que puedes servir y el que puedes ganar en 3 años.
4. Muestra cada multiplicación. Etiqueta cada supuesto usado.
5. Pon a prueba el cálculo: reduce cada supuesto a la mitad y ve en qué se convierte el resultado final.

Entrega como resumen de una página con la matemática visible. Cita cada número.`
      },
      {
        id: "s11",
        num: "11",
        name: "El Mapeador de Tendencias",
        difficulty: "Intermedio",
        description: "Saca tendencias emergentes en cualquier nicho con evidencia real, no intuición.",
        body: `---
name: mapeador-de-tendencias
description: Úsala cuando el usuario quiera identificar tendencias emergentes en una industria específica.
---

Detectas tendencias antes de que sean noticia mainstream.

Cuando se invoque, pide el nicho y la ventana de tiempo (por defecto, los últimos 90 días).

Para cada una de 5 tendencias, entrega:
- Nombre de la tendencia en pocas palabras.
- 3 puntos de evidencia concretos: un lanzamiento, una contratación, una inversión, una declaración pública de alguien del sector.
- Velocidad: lenta, acelerando, o disparada.
- Quién gana y quién pierde con esta tendencia.
- Una lectura contraintuitiva sobre hacia dónde va.

Evita frases vagas como "la IA está creciendo". Si no hay evidencia concreta, no lo incluyas.`
      },
      {
        id: "s12",
        num: "12",
        name: "El Auditor de Citas",
        difficulty: "Avanzado",
        description: "Verifica cada cita en un documento y marca las inventadas, las mal atribuidas y los enlaces rotos.",
        body: `---
name: auditor-de-citas
description: Úsala cuando el usuario tenga un documento con citas que necesitan verificación antes de publicarse.
---

Auditas citas con el mismo rigor que un verificador de hechos.

Cuando se invoque, pide el documento.

Para cada cita:
1. Confirma que la fuente exista en el enlace indicado.
2. Confirma que el texto citado aparezca de forma textual en la fuente.
3. Confirma que la fuente respalde de verdad la afirmación a la que está pegada.
4. Marca cualquiera de estos casos: enlace roto, paráfrasis presentada como cita directa, fuente que contradice la afirmación, fuente que parece generada por IA sin verificar.

Entrega: cita original, estado (verificada, rota, engañosa, sin respaldo), y sugerencia de corrección.`
      },
      {
        id: "s13",
        num: "13",
        name: "El Sintetizador de Research",
        difficulty: "Intermedio",
        description: "Comprime varios artículos o estudios en un resumen de decisión corto, con cada afirmación citada.",
        body: `---
name: sintetizador-de-research
description: Úsala cuando el usuario tenga varios artículos o estudios que necesitan resumirse en una sola pieza.
---

Comprimes research en algo que se puede usar para decidir.

Cuando se invoque, pide las fuentes (archivos o enlaces) y la decisión que el usuario está tomando con esa información.

Después:
1. Extrae las 3 afirmaciones más fuertes que se repiten entre las fuentes.
2. Anota cualquier contradicción entre fuentes, de forma explícita.
3. Saca 5 datos específicos, cada uno con su fuente.
4. Identifica el consenso general y la postura contraintuitiva.
5. Cierra con una recomendación de una frase, atada a la decisión del usuario.

Límite de 400 palabras. Cita cada afirmación.`
      },
      {
        id: "s14",
        num: "14",
        name: "El Generador de Preguntas",
        difficulty: "Principiante",
        description: "Saca preguntas afiladas para cualquier reunión o entrevista, las que casi nadie piensa hacer.",
        body: `---
name: generador-de-preguntas
description: Úsala cuando el usuario se esté preparando para una entrevista, llamada de venta o reunión con un experto.
---

Escribes las preguntas que los demás se olvidan de hacer.

Cuando se invoque, pide: tipo de reunión, con quién es, y el objetivo del usuario.

Genera 20 preguntas en 4 grupos:
- Diagnóstico (5): para sacar a la luz qué está realmente roto.
- Lo que está en juego (5): para revelar el costo de no actuar.
- Historial (5): qué ya se intentó antes.
- Cierre (5): para comprometer a un siguiente paso concreto.

Cada pregunta en una sola frase corta. Evita preguntas de sí o no. Evita preguntas que sugieran la respuesta.`
      }
    ]
  },
  {
    id: "codigo",
    num: "03",
    name: "Código e ingeniería",
    skills: [
      {
        id: "s15",
        num: "15",
        name: "La Descripción de PR",
        difficulty: "Principiante",
        description: "Escribe la descripción de un pull request limpia a partir de los cambios, en segundos.",
        body: `---
name: descripcion-de-pr
description: Úsala cuando el usuario quiera la descripción de un pull request a partir de los cambios hechos.
---

Escribes descripciones de pull request que los revisores realmente leen.

Cuando se invoque, pide el diff o el nombre de la rama.

Entrega exactamente:
- Título: en modo imperativo, corto.
- Qué cambia: 2 viñetas resumiendo el cambio.
- Por qué: una frase con la razón de negocio o de usuario.
- Cómo: 3 viñetas sobre la implementación.
- Plan de prueba: 3 pasos concretos que un revisor puede seguir.
- Capturas: un espacio reservado si cambia algo visual, omítelo si no.

Evita frases vacías como "este PR" o "ajuste menor". Sé específico.`
      },
      {
        id: "s16",
        num: "16",
        name: "El Repro de Bug",
        difficulty: "Intermedio",
        description: "Convierte un reporte de error vago en una reproducción mínima con causas posibles ordenadas.",
        body: `---
name: repro-de-bug
description: Úsala cuando el usuario tenga un reporte de error que carece de pasos claros para reproducirlo.
---

Aíslas errores en reproducciones mínimas.

Cuando se invoque, pide la descripción del error y el contexto del proyecto.

Después:
1. Reformula el error como: lo esperado contra lo que pasa de verdad.
2. Lista 5 datos mínimos del entorno (sistema, versión, paquetes relevantes).
3. Reduce el error al código más pequeño posible que aún lo produce.
4. Da los pasos exactos para reproducirlo, en lista numerada.
5. Sugiere 3 causas probables, ordenadas de más a menos probable.

Nunca adivines sin avisar. Marca explícitamente lo que no sabes con certeza.`
      },
      {
        id: "s17",
        num: "17",
        name: "El Generador de Tests",
        difficulty: "Intermedio",
        description: "Genera una suite de pruebas completa para cualquier función, con casos extremos cubiertos.",
        body: `---
name: generador-de-tests
description: Úsala cuando el usuario tenga una función y quiera cobertura de pruebas para ella.
---

Escribes pruebas que de verdad detectan errores.

Cuando se invoque, pide la función y el framework de pruebas que se usa.

Genera:
- 1 prueba del caso normal y esperado.
- 3 pruebas de límites (entrada vacía, entrada máxima, un caso justo en el borde).
- 2 pruebas de entrada inválida (tipo equivocado, mal formada).
- 1 prueba de concurrencia si aplica al caso.
- 1 prueba de regresión si se mencionó algún error anterior.

Cada prueba lleva un nombre que describe qué valida. Evita nombres como "prueba1" o "debería funcionar".`
      },
      {
        id: "s18",
        num: "18",
        name: "El Planeador de Refactor",
        difficulty: "Avanzado",
        description: "Planea un refactor de varios archivos en pasos seguros e independientes, sin romper producción.",
        body: `---
name: planeador-de-refactor
description: Úsala cuando el usuario quiera refactorizar código sin arriesgar lo que ya está en producción.
---

Planeas refactors que se entregan en pasos pequeños y seguros.

Cuando se invoque, pide: el código, el objetivo del refactor, y la tolerancia al riesgo.

Después:
1. Mapea qué funciones se afectan y cómo se relacionan entre ellas.
2. Divide el refactor en 5-8 pasos, cada uno entregable por sí solo.
3. Para cada paso: qué cambia, qué pruebas se agregan, y cómo revertirlo si algo sale mal.
4. Identifica el paso con más riesgo de romper algo.
5. Sugiere una bandera de activación gradual si el riesgo de afectar el servicio es alto.

Nada de cambios enormes de un solo golpe. Cada paso se puede entregar por separado.`
      },
      {
        id: "s19",
        num: "19",
        name: "El Diseñador de API",
        difficulty: "Avanzado",
        description: "Diseña una API con nombres, errores y manejo de versiones que envejecen bien.",
        body: `---
name: disenador-de-api
description: Úsala cuando el usuario esté diseñando una nueva superficie de API.
---

Diseñas APIs que envejecen bien con el tiempo.

Cuando se invoque, pide: el dominio, quién la va a consumir, y el presupuesto de rendimiento esperado.

Entrega:
1. Modelo de recursos: 3-7 sustantivos, con una frase de descripción cada uno.
2. Endpoints: método, ruta, autenticación, si es repetible sin efectos extra, y categoría de límite de uso.
3. Formatos de petición y respuesta con ejemplos.
4. Códigos de error con mensajes claros y estructurados.
5. Esquema de versionado y política de cuándo algo queda obsoleto.
6. Tres cambios que rompían compatibilidad y que evitaste a propósito.

Usa sustantivos en plural. Usa fechas en formato estándar. Devuelve los errores como objetos estructurados.`
      },
      {
        id: "s20",
        num: "20",
        name: "El Esquema de Base de Datos",
        difficulty: "Intermedio",
        description: "Diseña un esquema normalizado con índices atados a consultas reales y plan de migración.",
        body: `---
name: esquema-de-base-de-datos
description: Úsala cuando el usuario esté modelando datos para una nueva función o producto.
---

Diseñas esquemas de base de datos que escalan más allá del prototipo.

Cuando se invoque, pide: descripción de la función, patrones de consulta esperados, y volumen de escritura esperado.

Entrega:
1. Tablas con columnas, tipos de dato, si aceptan vacíos, y valores por defecto.
2. Llaves primarias, llaves foráneas, y restricciones de unicidad.
3. Índices atados a consultas específicas que se van a usar.
4. Decisiones de desnormalización y el balance entre lectura y escritura.
5. Un plan de migración para los próximos 30 días de cambios esperados.

Nombra las tablas en plural y minúsculas. Incluye siempre fecha de creación y fecha de última modificación.`
      },
      {
        id: "s21",
        num: "21",
        name: "El Escritor de Docstrings",
        difficulty: "Principiante",
        description: "Agrega documentación clara a un archivo sin tocar la lógica, respetando el estilo del proyecto.",
        body: `---
name: escritor-de-docstrings
description: Úsala cuando el usuario quiera agregar documentación a código que ya existe.
---

Escribes documentación que los desarrolladores sí leen.

Cuando se invoque, pide el archivo o la función.

Para cada función pública:
- Resumen de una línea, en tiempo presente.
- Parámetros con su tipo y restricciones.
- Qué devuelve y qué significa ese resultado.
- Errores que puede lanzar, si aplica.
- Un ejemplo con datos realistas.

Respeta el estilo de documentación que ya tiene el proyecto. Nunca modifiques el cuerpo de la función, solo la documentación.`
      }
    ]
  },
  {
    id: "comms",
    num: "04",
    name: "Email y comunicación",
    skills: [
      {
        id: "s22",
        num: "22",
        name: "El Triaje de Inbox",
        difficulty: "Principiante",
        description: "Ordena tu bandeja en cinco grupos claros, de lo urgente a lo que se puede archivar.",
        body: `---
name: triaje-de-inbox
description: Úsala cuando el usuario quiera organizar un lote de correos pendientes.
---

Organizas bandejas de entrada en grupos claros.

Cuando se invoque, pide el lote de correos (asunto, remitente, y primeras líneas de cada uno).

Para cada correo, asígnalo a uno de estos grupos:
- RESPONDE YA: estás bloqueando a alguien, hay una fecha límite hoy, o lo pide alguien de peso.
- RESPONDE HOY: pregunta de cliente, fecha límite suave, algo que agendar.
- RESPONDE ESTA SEMANA: algo que está bien tener, informativo, o una actualización que no urge.
- ARCHIVA: boletines, invitaciones ya resueltas.
- ESCALA: temas legales, de seguridad, o riesgo de perder un cliente.

Entrega en tabla de 5 columnas, una línea por correo.`
      },
      {
        id: "s23",
        num: "23",
        name: "La Respuesta Difícil",
        difficulty: "Avanzado",
        description: "Redacta una respuesta a un correo hostil o delicado sin escalar el conflicto ni ceder de más.",
        body: `---
name: respuesta-dificil
description: Úsala cuando el usuario tenga que responder un correo enojado, acusatorio o legalmente delicado.
---

Escribes respuestas que calman la situación sin ceder de más.

Cuando se invoque, pide el correo original y el resultado que el usuario prefiere lograr.

Redacta una respuesta que:
1. Reconozca la preocupación específica en una frase.
2. Establezca los hechos de forma que el usuario pueda defender después.
3. Ofrezca un siguiente paso concreto.
4. Cierre la puerta a especulaciones sin sustento.

Reglas: nunca te disculpes por algo que el usuario no hizo. Nunca aceptes una versión de los hechos que es falsa. Nunca prometas algo fuera de su control. Revisa al final que nada se pueda usar en contra del usuario fuera de contexto.`
      },
      {
        id: "s24",
        num: "24",
        name: "El Recap de Junta",
        difficulty: "Principiante",
        description: "Convierte notas sueltas de una reunión en un resumen limpio con decisiones, tareas y responsables.",
        body: `---
name: recap-de-junta
description: Úsala cuando el usuario tenga notas de una reunión que necesitan organizarse en un resumen.
---

Escribes resúmenes de reunión que la gente reenvía sin pena.

Cuando se invoque, pide las notas sueltas y quién estuvo en la reunión.

Entrega:
- Asunto: [Fecha] [Tema] — resumen y siguientes pasos.
- Decisiones: 3-5 viñetas, cada una con un resultado claro.
- Tareas: nombre, qué hay que hacer, y fecha límite, en tabla.
- Preguntas abiertas: 2-3 viñetas con quién debe responderlas.
- Próxima reunión: fecha y objetivo en una línea.

Quita conversaciones laterales que no llevaron a nada. Quita nombres de personas que no estuvieron, salvo que una decisión los mencione directamente.`
      },
      {
        id: "s25",
        num: "25",
        name: "El Status Update",
        difficulty: "Principiante",
        description: "Escribe una actualización semanal que un directivo de verdad lee completa en 30 segundos.",
        body: `---
name: status-update
description: Úsala cuando el usuario tenga que mandar una actualización semanal o de proyecto.
---

Escribes actualizaciones que los directivos leen completas.

Cuando se invoque, pide: proyecto, avance de la semana, bloqueos, y el plan de la próxima semana.

Formato:
- Estado general en una frase (verde, amarillo o rojo).
- Entregado esta semana: 3 viñetas con resultados, no actividades.
- A entregar la próxima semana: 3 viñetas con responsables.
- Bloqueos: una viñeta más la ayuda concreta que se necesita.
- Una métrica de la semana con una línea de contexto.

Evita frases como "estamos trabajando en…". Solo resultados.`
      },
      {
        id: "s26",
        num: "26",
        name: "El Brief de Negociación",
        difficulty: "Avanzado",
        description: "Te prepara para una negociación con tu mejor alternativa, punto de partida y límite claro.",
        body: `---
name: brief-de-negociacion
description: Úsala cuando el usuario tenga una negociación próxima y quiera prepararse.
---

Preparas negociaciones con números claros, sin adivinar.

Cuando se invoque, pide: con quién se negocia, tipo de acuerdo, y las alternativas reales del usuario si no se llega a un acuerdo.

Entrega:
1. La mejor alternativa propia si no hay acuerdo, en una frase.
2. La alternativa probable de la otra parte (con tu nivel de confianza en esa suposición).
3. El primer número o posición que conviene poner sobre la mesa.
4. El resultado objetivo con el que conviene entrar a negociar.
5. El límite que no se debe cruzar.
6. 3 cosas que cuestan poco dar pero valen mucho para la otra parte.
7. 2 momentos donde conviene quedarse callado y dejar que hable el otro lado.

Solo números específicos. Porcentajes donde aplique.`
      },
      {
        id: "s27",
        num: "27",
        name: "La Disculpa",
        difficulty: "Intermedio",
        description: "Escribe una disculpa real que no culpa al otro ni se escabulle, y que reconstruye la confianza.",
        body: `---
name: disculpa
description: Úsala cuando el usuario necesite disculparse con un cliente, colega o socio.
---

Escribes disculpas que reconstruyen confianza de verdad.

Cuando se invoque, pide: qué pasó, a quién afectó, y qué se perdió por el error.

El texto final debe:
1. Nombrar el error específico, en voz activa.
2. Reconocer el impacto en la persona afectada, mencionándola.
3. Evitar frases como "si te sentiste mal" o "lamentamos cualquier inconveniente".
4. Mencionarla solución concreta que ya está en marcha.
5. Comprometerse a un cambio específico para que no se repita.
6. Cerrar sin sonar a que se está rogando perdón.

Menos de 200 palabras. Sin lenguaje corporativo vacío.`
      }
    ]
  },
  {
    id: "data",
    num: "05",
    name: "Datos y reportes",
    skills: [
      {
        id: "s28",
        num: "28",
        name: "El Narrador de Hojas",
        difficulty: "Intermedio",
        description: "Lee una hoja de datos y escribe los hallazgos que un humano se perdería, citados a celda exacta.",
        body: `---
name: narrador-de-hojas
description: Úsala cuando el usuario tenga una hoja de cálculo que necesita interpretarse.
---

Encuentras la historia escondida dentro de los números.

Cuando se invoque, pide el archivo de datos y la pregunta que le importa al usuario.

Después:
1. Describe los datos: cuántas filas, columnas, valores faltantes y el rango de fechas que cubre.
2. Saca 5 hallazgos, ordenados por qué tan útiles son.
3. Marca 2 cosas que se ven mal en la calidad de los datos.
4. Anota 1 pregunta que los datos no pueden contestar.
5. Sugiere un tipo de gráfico por cada hallazgo, con sus ejes.

Cita filas y valores específicos. Evita frases como "las tendencias sugieren…" sin un número detrás.`
      },
      {
        id: "s29",
        num: "29",
        name: "El Tracker de KPIs",
        difficulty: "Principiante",
        description: "Construye un reporte semanal de métricas con cambios, estado contra meta y comentario corto.",
        body: `---
name: tracker-de-kpis
description: Úsala cuando el usuario quiera un resumen semanal de sus métricas clave.
---

Reportas métricas que de verdad mueven decisiones.

Cuando se invoque, pide: lista de métricas, valores actuales, valores del periodo anterior, y la meta de cada una.

Por cada métrica, entrega:
- Nombre y definición en una frase.
- Valor actual, valor anterior, y el cambio en porcentaje y en número absoluto.
- Estado contra la meta: adelantado, en línea, o atrasado.
- Un comentario de una línea sobre por qué se movió así.

Ordena primero las que están atrasadas. Resalta cualquier métrica que cambió más de 10 por ciento.`
      },
      {
        id: "s30",
        num: "30",
        name: "El Analista de Cohortes",
        difficulty: "Avanzado",
        description: "Corre un análisis de cohortes desde datos crudos y explica qué cambió, con la matemática visible.",
        body: `---
name: analista-de-cohortes
description: Úsala cuando el usuario tenga datos de eventos y necesite analizarlos por cohorte.
---

Lees cohortes con el mismo rigor que alguien que decide en qué invertir.

Cuando se invoque, pide: datos de eventos, qué define la cohorte (mes de registro, canal, plan), y la métrica a analizar (retención, ingresos, activación).

Después:
1. Construye la tabla de cohorte: filas por cohorte, columnas por periodo, valores con la métrica elegida.
2. Identifica la cohorte que rompe el patrón general.
3. Calcula la diferencia en porcentaje entre la mejor y la peor cohorte.
4. Lista 3 explicaciones posibles para esa diferencia.
5. Sugiere un análisis de seguimiento para confirmar la causa.

Muestra la matemática completa. Nunca redondees con un "más o menos".`
      },
      {
        id: "s31",
        num: "31",
        name: "El Constructor de Forecast",
        difficulty: "Avanzado",
        description: "Construye una proyección de corto plazo con rangos y los supuestos más sensibles marcados.",
        body: `---
name: constructor-de-forecast
description: Úsala cuando el usuario necesite una proyección de corto plazo (ingresos, personal, demanda).
---

Construyes proyecciones que se pueden defender frente a un equipo.

Cuando se invoque, pide: la métrica, el historial (mínimo las últimas 26 semanas), y eventos ya conocidos que la puedan afectar.

Después:
1. Elige el método: lineal, estacional, o basado en criterio experto. Justifica la elección en una línea.
2. Entrega la proyección de las próximas 12 semanas con un rango bajo, uno base, y uno alto.
3. Lista cada supuesto usado con su nivel de confianza.
4. Identifica los 2 supuestos donde la proyección es más sensible.
5. Pon a prueba qué pasa si esos 2 supuestos cambian un 20 por ciento.

Muestra la fórmula usada. Nunca esconda la matemática detrás del resultado.`
      },
      {
        id: "s32",
        num: "32",
        name: "El Cazador de Anomalías",
        difficulty: "Intermedio",
        description: "Marca picos y caídas raras en cualquier serie de tiempo, con causas posibles ordenadas por impacto.",
        body: `---
name: cazador-de-anomalias
description: Úsala cuando el usuario quiera encontrar patrones inusuales en datos que cambian con el tiempo.
---

Cazas las anomalías que de verdad importan.

Cuando se invoque, pide los datos de serie de tiempo y qué cuenta como "inusual" para el usuario.

Después:
1. Calcula la línea base (promedio móvil, desviación estándar).
2. Marca los puntos que se salen claramente del rango normal, indicando si es un pico o una caída.
3. Para cada punto marcado: fecha, magnitud, línea base, y diferencia.
4. Ordena por impacto real, no solo por tamaño de la desviación.
5. Sugiere 3 causas probables por anomalía: problema en los datos, evento real, o efecto de temporada.

Evita falsos positivos. Si algo es ambiguo, márcalo como "necesita revisión humana".`
      },
      {
        id: "s33",
        num: "33",
        name: "El Auditor de Funnel",
        difficulty: "Intermedio",
        description: "Audita un embudo de conversión y encuentra el paso con más fuga, con la pérdida cuantificada.",
        body: `---
name: auditor-de-funnel
description: Úsala cuando el usuario tenga datos de un embudo de conversión y quiera encontrar dónde se pierde más gente.
---

Encuentras la fuga que más le cuesta al negocio.

Cuando se invoque, pide: los pasos del embudo, el volumen en cada paso, y la ventana de tiempo.

Entrega:
- Tasa de conversión por paso (total y de un paso al siguiente).
- El paso con más fuga, con la pérdida en ingresos o registros cuantificada.
- 3 hipótesis de por qué se pierde gente en ese paso.
- 1 prueba económica para validar la hipótesis principal.
- Un punto de comparación de la industria para ese paso, si se conoce.

Usa números y montos específicos siempre que sea posible.`
      },
      {
        id: "s34",
        num: "34",
        name: "El Traductor a SQL",
        difficulty: "Principiante",
        description: "Convierte una pregunta en español sencillo en una consulta SQL que funciona, con comentarios.",
        body: `---
name: traductor-a-sql
description: Úsala cuando el usuario quiera consultar una base de datos sin escribir SQL él mismo.
---

Traduces preguntas en español sencillo a consultas SQL.

Cuando se invoque, pide: la pregunta, la estructura de la tabla (o una fila de ejemplo), y el tipo de base de datos.

Después:
1. Reformula la pregunta en términos precisos.
2. Escribe la consulta con un comentario en cada parte.
3. Predice cuántas filas debería devolver el resultado.
4. Marca cualquier supuesto que hiciste sobre la estructura de los datos.
5. Sugiere una mejora de rendimiento si aplica (un índice, una vista).

Prefiere subconsultas con nombre antes que anidadas. Nunca uses selección de todas las columnas sin filtrar. Formatea para que se lea fácil.`
      }
    ]
  },
  {
    id: "personal",
    num: "06",
    name: "Personal y productividad",
    skills: [
      {
        id: "s35",
        num: "35",
        name: "La Revisión Semanal",
        difficulty: "Principiante",
        description: "Corre una revisión de fin de semana sobre tu agenda y entrega las prioridades de la semana siguiente.",
        body: `---
name: revision-semanal
description: Úsala cuando el usuario quiera revisar la semana que pasó y planear la siguiente.
---

Corres revisiones semanales sin adornos.

Cuando se invoque, pide: el historial de agenda de los últimos 7 días, la lista de tareas, y las metas actuales.

Entrega:
1. Lo logrado: 3 cosas específicas que se terminaron.
2. Lo que distrajo: 3 cosas que consumieron tiempo sin resultado.
3. Alineación con metas: horas dedicadas a cada meta contra lo planeado.
4. Las 3 prioridades de la próxima semana, con el sacrificio que cada una implica.
5. Una sola cosa a la que decir que no esta semana.

Sé directo y honesto, sin frases de autoayuda genéricas.`
      },
      {
        id: "s36",
        num: "36",
        name: "El Diario de Decisiones",
        difficulty: "Intermedio",
        description: "Registra una decisión con su razonamiento y la única condición que te haría cambiar de opinión.",
        body: `---
name: diario-de-decisiones
description: Úsala cuando el usuario esté tomando una decisión importante que quiera poder revisar después.
---

Registras decisiones para poder auditarlas en el futuro.

Cuando se invoque, pide: la decisión, las opciones que se consideraron, la elección final, y el razonamiento detrás.

Captura:
- Fecha y la decisión en una frase.
- Opciones consideradas (mínimo 3), cada una con su ventaja y desventaja en una línea.
- Información disponible al momento de decidir.
- Información que faltaba.
- El resultado esperado, con un plazo.
- Nivel de confianza (de 1 a 10).
- La condición de revisión: el único hecho que haría cambiar de opinión.

Guárdalo con fecha. La condición de revisión es el campo más útil — permite auditar después si de verdad se cumplió.`
      },
      {
        id: "s37",
        num: "37",
        name: "El Pipeline de Lectura",
        difficulty: "Principiante",
        description: "Procesa artículos guardados en resúmenes cortos con una etiqueta de acción concreta.",
        body: `---
name: pipeline-de-lectura
description: Úsala cuando el usuario tenga artículos guardados pendientes de revisar.
---

Limpias listas de lectura pendiente sin perder lo valioso.

Cuando se invoque, pide los enlaces o archivos guardados.

Por cada artículo:
- Resumen de una línea.
- 3 ideas concretas con su cita o referencia exacta.
- Etiqueta: APLICAR, COMPARTIR, ARCHIVAR, o IGNORAR.
- Si es APLICAR: una acción concreta con fecha límite.
- Si es COMPARTIR: a quién enviárselo y por qué le serviría.

Salta los artículos que no pasan una revisión rápida de 30 segundos.`
      },
      {
        id: "s38",
        num: "38",
        name: "El Traductor de Metas",
        difficulty: "Intermedio",
        description: "Parte una meta anual vaga en hitos verificables a 90 días, 30 días y por semana.",
        body: `---
name: traductor-de-metas
description: Úsala cuando el usuario tenga una meta anual que necesita dividirse en pasos concretos.
---

Traduces metas anuales en algo que cabe en un calendario.

Cuando se invoque, pide: la meta, el punto de partida actual, y la fecha límite.

Entrega:
1. Reformula la meta como un resultado medible.
2. 3 hitos a 90 días, cada uno con algo concreto que se pueda verificar.
3. 3 hitos a 30 días por trimestre, cada uno alcanzable en menos de 2 semanas de trabajo enfocado.
4. Las 3 acciones de esta semana, cada una que quepa en un bloque de agenda.
5. Una sola cosa que hay que dejar de hacer para abrir espacio.

Nada de frases motivacionales vagas. Solo resultados concretos.`
      },
      {
        id: "s39",
        num: "39",
        name: "El Diseñador de Hábitos",
        difficulty: "Principiante",
        description: "Diseña un hábito con disparador, acción mínima y un plan de recuperación cuando se falla un día.",
        body: `---
name: disenador-de-habitos
description: Úsala cuando el usuario quiera instalar un hábito nuevo en su rutina.
---

Diseñas hábitos que sobreviven a las semanas difíciles.

Cuando se invoque, pide: el hábito deseado, la frecuencia actual, y la frecuencia objetivo.

Diseña:
- Disparador: un momento ya existente en el día (después del café, antes de revisar el correo).
- Acción: algo que tome menos de 2 minutos durante las primeras 2 semanas.
- Encadenado: a qué otro hábito ya existente se puede pegar.
- Reducción de fricción: una sola cosa que se deja lista la noche anterior.
- Regla de recuperación: si se falla un día, nunca fallar dos seguidos.
- Revisión: un recordatorio semanal por 8 semanas.

Enfócate en el cambio de comportamiento real, no en frases de motivación.`
      },
      {
        id: "s40",
        num: "40",
        name: "El Ordenador de Brain Dump",
        difficulty: "Principiante",
        description: "Toma una lista caótica de pensamientos sueltos y la convierte en tareas claras y accionables.",
        body: `---
name: ordenador-de-brain-dump
description: Úsala cuando el usuario tenga una lista desordenada de pensamientos y necesite estructura.
---

Ordenas pensamientos sueltos en algo que se puede ejecutar.

Cuando se invoque, pide la lista cruda de pensamientos.

Después:
1. Clasifica cada línea como: TAREA, IDEA, PREGUNTA, SENTIMIENTO, o RUIDO.
2. TAREAS: reescríbelas en modo imperativo con fecha límite (o "sin fecha" si no hay una clara).
3. IDEAS: etiqueta con el proyecto al que pertenecen y guárdalas en una lista de ideas.
4. PREGUNTAS: identifica quién puede responderla y redacta el mensaje para enviarla.
5. SENTIMIENTOS: déjalos como una nota corta de diario.
6. RUIDO: descártalo.

Entrega la lista limpia. El usuario debe poder abrir su lista y ver solo TAREAS claras.`
      }
    ]
  }
];

export const SKILLS_PACKS: SkillPack[] = [
  {
    name: "Freelancer",
    description: "Cierra clientes, prepara llamadas y maneja conflictos sin que escalen.",
    skillsList: [
      "03 · El Email en Frío",
      "26 · El Brief de Negociación",
      "25 · El Status Update",
      "27 · La Disculpa",
      "14 · El Generador de Preguntas"
    ]
  },
  {
    name: "Creador de contenido",
    description: "Una idea cruda en la mañana, lista para 5 plataformas en la tarde.",
    skillsList: [
      "01 · El Arquitecto de Hilos",
      "02 · El Esqueleto de Artículo",
      "04 · El Repurposeador",
      "05 · La Forja de Titulares",
      "06 · El Imitador de Voz"
    ]
  },
  {
    name: "Ingeniero / dev",
    description: "Menos pull requests trabados, menos refactors a ciegas, pruebas que sí detectan errores.",
    skillsList: [
      "15 · La Descripción de PR",
      "16 · El Repro de Bug",
      "17 · El Generador de Tests",
      "18 · El Planeador de Refactor",
      "21 · El Escritor de Docstrings"
    ]
  },
  {
    name: "Founder / emprendedor",
    description: "Bandeja en cero, métricas leídas, decisiones auditables, metas que aterrizan.",
    skillsList: [
      "22 · El Triaje de Inbox",
      "35 · La Revisión Semanal",
      "29 · El Tracker de KPIs",
      "36 · El Diario de Decisiones",
      "38 · El Traductor de Metas"
    ]
  },
  {
    name: "Analista",
    description: "De una hoja de datos a una recomendación con fuentes reales, en una sola sesión.",
    skillsList: [
      "08 · El Cazador de Fuentes",
      "28 · El Narrador de Hojas",
      "30 · El Analista de Cohortes",
      "31 · El Constructor de Forecast",
      "33 · El Auditor de Funnel"
    ]
  }
];

export const PLAN_DAYS = [
  { day: "Día 1", task: "Elige tu pack de la sección anterior. Instala las 5 en una sola sesión, usando el método que más uses (Claude.ai web o Claude Code)." },
  { day: "Días 2-14", task: "Usa cada skill al menos 2 veces. Anota cuáles se sienten naturales y cuáles no se activan solas — esas necesitan una description más afilada." },
  { day: "Días 15-30", task: "Descarta las 1-2 que no usaste. Cámbialas por otras del catálogo. Después de 30 días tienes 5 skills ajustadas a tu día, y eso vale más que las 40 sin usar." }
];

export const SKILLS_FAQS = [
  {
    q: "¿Qué es una skill de Claude y de qué se compone?",
    a: "Una skill de Claude es un archivo de Markdown llamado SKILL.md que contiene un encabezado en formato YAML (frontmatter) que define su nombre ('name') y gatillo de activación ('description'), seguido por un conjunto de instrucciones que guían el comportamiento del asistente cuando el gatillo se dispara."
  },
  {
    q: "¿Cómo se instala una skill de forma global en Claude?",
    a: "Para Claude.ai (Web / Desktop / Cowork), crea una carpeta con el nombre de la skill, coloca dentro el archivo SKILL.md y compresiónala en formato ZIP. Luego, ve a claude.ai → Settings → Skills → Add Skill y sube el archivo ZIP. Para Claude Code, colócala en ~/.claude/skills/tu-skill/SKILL.md."
  },
  {
    q: "¿Puedo tener skills específicas por proyecto?",
    a: "Sí, en Claude Code o repositorios de desarrollo puedes guardar el archivo SKILL.md dentro de la carpeta .claude/skills/tu-skill/ de tu proyecto. Al realizar commit, la skill se guardará con el código y se compartirá con todos los desarrolladores del equipo."
  }
];
