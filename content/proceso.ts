export type Fase = {
  id: string;
  week: string;
  label: string;
  heading: string;
  body: string;
  rows: Array<{ k: string; v: string; accent?: boolean }>;
};

export const fases: Fase[] = [
  {
    id: "discovery",
    week: "w1",
    label: "Discovery",
    heading: "Entendemos su negocio antes de tocar código.",
    body: "Sentamos a su equipo durante una semana. Mapeamos procesos, identificamos cuellos de botella, separamos lo que merece IA de lo que solo necesita un buen script. Salimos con un documento de scope claro y un plan cerrado.",
    rows: [
      { k: "duración", v: "5 días laborables" },
      { k: "entregable", v: "scope.md + plan" },
      { k: "su tiempo", v: "~6 horas en total" },
      { k: "arranque", v: "Hablamos en 24h", accent: true },
    ],
  },
  {
    id: "prototipo",
    week: "w2",
    label: "Prototipo",
    heading: "Prototipo navegable en su entorno.",
    body: "A los 7-10 días tiene un prototipo funcional con sus datos reales (anonimizados si conviene). No vendemos PowerPoints — vendemos algo en lo que se puede hacer clic, romper y validar internamente.",
    rows: [
      { k: "duración", v: "7-10 días" },
      { k: "entregable", v: "app desplegada · staging" },
      { k: "stack", v: "según caso" },
      { k: "demos", v: "2 sesiones internas" },
    ],
  },
  {
    id: "integracion",
    week: "w3",
    label: "Integración",
    heading: "Conectamos a sus sistemas reales.",
    body: "CRMs, ERPs, bases de datos, APIs internas, Outlook, Google Workspace. Trabajamos con sus equipos de IT, respetamos sus políticas de seguridad y dejamos auditoría completa de cada llamada al modelo.",
    rows: [
      { k: "integraciones", v: "SAP · Salesforce · Hubspot · custom" },
      { k: "seguridad", v: "SSO · audit logs · PII filter" },
      { k: "testing", v: "evals automatizadas" },
    ],
  },
  {
    id: "despliegue",
    week: "w4",
    label: "Despliegue",
    heading: "Producción + formación a su equipo.",
    body: "Desplegamos en su infraestructura o en la nuestra. Documentamos cada decisión. Formamos a 2-4 personas de su equipo para que lo entiendan a fondo. No queremos ser imprescindibles.",
    rows: [
      { k: "deploy", v: "AWS · Azure · GCP · on-prem" },
      { k: "docs", v: "arquitectura + runbooks" },
      { k: "formación", v: "2 talleres · 4h cada uno" },
    ],
  },
  {
    id: "mantenimiento",
    week: "∞",
    label: "Mantenimiento",
    heading: "Soporte continuo, sin sorpresas.",
    body: "Un acompañamiento mensual cubre monitorización, actualizaciones de modelos y ajustes de prompts. Los modelos evolucionan rápido — un copilot de hace 8 meses ya está obsoleto. Estamos para que el suyo no lo esté.",
    rows: [
      { k: "SLA", v: "4h respuesta · 24h fix" },
      { k: "monitoring", v: "latencia · fiabilidad · drift" },
      { k: "compromiso", v: "Mes a mes — sin permanencia", accent: true },
    ],
  },
];
