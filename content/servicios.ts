export type Servicio = {
  id: string;
  num: string;
  title: string;
  meta: { duration: string; format: string };
  blurb: string;
  blocks: Array<{ heading: string; kind: "list" | "text"; items?: string[]; body?: string }>;
};

/**
 * 8 service offerings — used by /servicios page.
 * The order matches the prototype's S/01 → S/08 numbering.
 * `format` indicates how the engagement is structured, not how it's billed.
 */
export const servicios: Servicio[] = [
  {
    id: "auditoria-ia",
    num: "S/01",
    title: "Auditoría de IA",
    meta: { duration: "1 semana", format: "Cerrado" },
    blurb:
      "Una semana, su equipo y nosotros. Mapeamos todos los procesos donde la IA tendría sentido (y donde no). Salimos con un informe priorizado: qué hacer primero, qué ahorra más, qué riesgos hay.",
    blocks: [
      {
        heading: "Incluye",
        kind: "list",
        items: [
          "3 sesiones con stakeholders clave",
          "Análisis del stack tecnológico actual",
          "Informe de oportunidades priorizado",
          "Estimación de horas ahorradas por iniciativa",
          "Plan de implementación a 6 meses",
        ],
      },
      {
        heading: "Ejemplo",
        kind: "text",
        body: "Una aseguradora identificó 4 procesos de back-office reemplazables por agentes — ahorro estimado: 1.200h/mes.",
      },
    ],
  },
  {
    id: "agentes",
    num: "S/02",
    title: "Agentes autónomos",
    meta: { duration: "4-8 semanas", format: "Por scope" },
    blurb:
      "Asistentes que no solo responden — actúan. Se conectan a sus sistemas, ejecutan tareas, deciden cuándo escalar a un humano. Construidos para auditarse y debuggearse.",
    blocks: [
      {
        heading: "Stack típico",
        kind: "list",
        items: [
          "LangGraph / CrewAI para orquestación",
          "Anthropic Claude o OpenAI GPT-4",
          "Postgres + pgvector para memoria",
          "OpenTelemetry + LangSmith para trazas",
        ],
      },
      {
        heading: "Ejemplo",
        kind: "text",
        body: "Agente que gestiona el inbox de soporte L1 de una fintech — 3.200 tickets/mes resueltos sin intervención humana, con escalado claro de los casos sensibles.",
      },
    ],
  },
  {
    id: "rag",
    num: "S/03",
    title: "RAG sobre conocimiento interno",
    meta: { duration: "3-6 semanas", format: "Cerrado" },
    blurb:
      "Convertimos sus PDFs, manuales, contratos, wikis y bases de datos en un chat que responde con fuentes citadas. Evaluable, mejorable, no-alucina-y-si-lo-hace-se-detecta.",
    blocks: [
      {
        heading: "Incluye",
        kind: "list",
        items: [
          "Pipeline de ingesta multi-formato",
          "Embeddings + reranking híbrido",
          "UI con citaciones en línea",
          "Evals automatizadas (precision/recall)",
          "Dashboard de calidad de respuestas",
        ],
      },
      {
        heading: "Ejemplo",
        kind: "text",
        body: "12.000 documentos de un despacho legal indexados — los abogados encuentran precedentes en 8s en vez de en 40min.",
      },
    ],
  },
  {
    id: "automatizacion",
    num: "S/04",
    title: "Automatización de procesos",
    meta: { duration: "2-5 semanas", format: "Por scope" },
    blurb:
      "Esos flujos donde alguien copia y pega entre 3 sistemas. Los reemplazamos por pipelines con IA donde haga falta y reglas deterministas donde no. Sin sobre-ingeniería.",
    blocks: [
      {
        heading: "Casos típicos",
        kind: "list",
        items: [
          "Clasificación y enrutado de correos",
          "Extracción de datos de facturas/contratos",
          "Sincronización entre CRM y ERP",
          "Generación automática de informes",
          "Recordatorios de citas, pedidos, pagos",
        ],
      },
      {
        heading: "Ejemplo",
        kind: "text",
        body: "Una distribuidora ahorra 32h/semana en data entry — el agente lee facturas en PDF, valida contra el ERP y solo escala las anomalías.",
      },
    ],
  },
  {
    id: "copilots",
    num: "S/05",
    title: "Copilots verticales",
    meta: { duration: "6-12 semanas", format: "Por scope" },
    blurb:
      "Productos internos hechos a la medida de un equipo concreto: comercial, legal, soporte, finanzas, taller. No es un chat genérico — habla su idioma y conoce sus datos.",
    blocks: [
      {
        heading: "Incluye",
        kind: "list",
        items: [
          "UX a medida (no plantilla)",
          "SSO + permisos por rol",
          "Integraciones con sus herramientas",
          "Streaming UI + feedback loop",
          "Onboarding y formación al equipo",
        ],
      },
      {
        heading: "Ejemplo",
        kind: "text",
        body: "Copilot comercial para un fabricante B2B — preparación automática de visitas, propuestas y seguimiento. Adopción del 89% en 6 semanas.",
      },
    ],
  },
  {
    id: "integracion-llm",
    num: "S/06",
    title: "Integración LLM en producto",
    meta: { duration: "Variable", format: "Sprint semanal" },
    blurb:
      "Su producto ya existe — solo necesita capacidades de IA. Trabajamos integrados con su equipo de producto y diseño, con sprints semanales y acceso directo a nosotros.",
    blocks: [
      {
        heading: "Cómo funciona",
        kind: "list",
        items: [
          "Mínimo de 3 meses para asegurar entrega real",
          "Daily con su equipo si lo desean",
          "Acceso directo a Slack/Discord",
          "Pull requests revisables por su equipo técnico",
        ],
      },
    ],
  },
  {
    id: "vision",
    num: "S/07",
    title: "Visión por computador",
    meta: { duration: "4-10 semanas", format: "Por scope" },
    blurb:
      "Detección, clasificación y extracción de información de imágenes y vídeo. Modelos open-source ajustados a su dominio cuando tiene sentido, APIs cerradas cuando no.",
    blocks: [
      {
        heading: "Casos típicos",
        kind: "list",
        items: [
          "Inspección de calidad en fábrica o almacén",
          "Lectura de albaranes, tickets y documentos manuscritos",
          "Análisis de imágenes médicas (no diagnóstico)",
          "Conteo y seguimiento en retail",
        ],
      },
    ],
  },
  {
    id: "mantenimiento",
    num: "S/08",
    title: "Mantenimiento & evolución",
    meta: { duration: "Retainer", format: "Mes a mes" },
    blurb:
      "Los modelos cambian rápido. Lo que funcionaba con GPT-4 en julio puede mejorar 3x con Claude 4.5. Nos encargamos de que su sistema no envejezca.",
    blocks: [
      {
        heading: "Incluye",
        kind: "list",
        items: [
          "Monitorización 24/7 (latencia, fiabilidad, drift)",
          "Actualización a nuevos modelos cuando convenga",
          "Tuning de prompts según evals",
          "Horas de evolución funcional cada mes",
          "Respuesta a incidencias en 4h",
        ],
      },
    ],
  },
];
