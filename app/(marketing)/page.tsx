import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Marquee } from "@/components/marquee";
import { LandingServices } from "@/components/landing-services";
import { ProcessTabs } from "@/components/process-tabs";
import { Stats } from "@/components/stats";
import { BigCta } from "@/components/big-cta";

const MARQUEE_ITEMS = [
  "Agentes autónomos",
  "RAG sobre datos internos",
  "Copilots verticales",
  "Automatización de procesos",
  "Pipelines de datos",
  "Visión por computador",
  "Integración a medida",
];

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Marquee items={MARQUEE_ITEMS} />
      <LandingServices />
      <ProcessTabs />
      <Stats />
      <BigCta
        num="04 — Hablemos"
        headingHtml="¿Tiene un proceso<br />que podría<br /><em>pensar solo?</em>"
        primaryHref="/contacto"
        primaryLabel="Enviar mensaje"
      />
    </>
  );
}
