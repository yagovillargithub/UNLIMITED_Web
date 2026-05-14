import type { Metadata } from "next";
import { Marquee } from "@/components/marquee";
import { BigCta } from "@/components/big-cta";
import { ServiciosList } from "@/components/servicios-list";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Catálogo abierto, tiempos cerrados. 8 servicios de IA — desde auditorías de una semana hasta copilots verticales — pensados para PYMEs que quieren ver resultados rápido.",
  openGraph: {
    title: "Servicios — UNLIMITED",
    description:
      "Catálogo abierto, tiempos cerrados. 8 servicios de IA con plazos claros y entregables tangibles.",
    type: "website",
  },
};

const STACK_MARQUEE = [
  "OpenAI",
  "Anthropic Claude",
  "LangGraph",
  "Pinecone",
  "Postgres + pgvector",
  "n8n",
  "Temporal",
  "AWS Bedrock",
  "Azure OpenAI",
];

export default function ServiciosPage() {
  return (
    <>
      <section className="srv-hero" data-screen-label="01 Servicios Hero">
        <div className="wrap">
          <span className="num" data-reveal>
            Servicios — 8 ofertas
          </span>
          <h1 className="display srv-hero-h" data-reveal data-reveal-delay="1">
            Catálogo abierto.<br />
            <em>Tiempos cerrados.</em>
          </h1>
          <p
            className="lede"
            data-reveal
            data-reveal-delay="2"
            style={{ marginTop: "var(--s-4)", maxWidth: "60ch" }}
          >
            Estos son los servicios que más nos pide la gente. Si no encaja exactamente con lo suyo,
            escríbanos — la mayoría de proyectos buenos empiezan con un &ldquo;¿podríais...?&rdquo;.
          </p>
        </div>
      </section>

      <ServiciosList />

      <Marquee items={STACK_MARQUEE} />

      <BigCta
        num="Siguiente paso"
        headingHtml="¿Cuál encaja<br /><em>con su caso?</em>"
        primaryHref="/contacto"
        primaryLabel="Cuéntenos su caso"
      />
    </>
  );
}
