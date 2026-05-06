"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    num: "01.",
    title: "Agentes autónomos a medida",
    body: "Asistentes que ejecutan tareas reales en sus sistemas: leen correos, actualizan CRMs, generan informes, contestan tickets. Construidos sobre LangGraph, OpenAI y Anthropic.",
    tags: ["LangGraph", "Tool use", "Memoria persistente"],
  },
  {
    num: "02.",
    title: "RAG sobre conocimiento interno",
    body: "Convertimos sus documentos, manuales y bases de datos en un chat que responde con fuentes citadas. Pinecone, Weaviate o pgvector según el caso.",
    tags: ["Embeddings", "Hybrid search", "Citations"],
  },
  {
    num: "03.",
    title: "Automatización de procesos",
    body: "Identificamos los flujos repetitivos y los reemplazamos por pipelines con IA: clasificación de documentos, extracción de datos, validación, ruteo.",
    tags: ["n8n / Temporal", "OCR + LLM", "Webhooks"],
  },
  {
    num: "04.",
    title: "Copilots verticales",
    body: "Productos internos para equipos concretos — comercial, legal, soporte. Integrados con sus herramientas, con su lenguaje, con sus permisos.",
    tags: ["Auth + RBAC", "Streaming UI", "Evaluation"],
  },
];

export function LandingServices() {
  const [active, setActive] = useState(0);

  // Snap the sticky card to whichever .srv block is closest to ~40% of the
  // viewport. Replicates the prototype's IntersectionObserver + scroll fallback.
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".srv");
    if (!items.length) return;

    const pickActive = () => {
      const mid = window.innerHeight * 0.42;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = it;
        }
      });
      if (best) setActive(Number((best as HTMLElement).dataset.srv));
    };

    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, []);

  return (
    <section id="servicios" className="services" data-screen-label="03 Servicios">
      <div className="wrap services-head">
        <span className="num" data-reveal>02 — Servicios</span>
        <h2 className="section-h" data-reveal data-reveal-delay="1">
          Cuatro formas de <em>poner IA</em>
          <br />a trabajar en su empresa.
        </h2>
      </div>

      <div className="wrap services-sticky">
        <div className="services-list" id="servicesList">
          {ITEMS.map((it, i) => (
            <article key={i} className="srv" data-srv={i}>
              <div className="srv-num">{it.num}</div>
              <h3 className="srv-h">{it.title}</h3>
              <p className="srv-p">{it.body}</p>
              <ul className="srv-tags">
                {it.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <aside className="services-side">
          <div className={cn("srv-card", active === 0 && "active")} data-card={0}>
            <div className="srv-card-frame">
              <div className="ag-window">
                <div className="ag-bar">
                  <span /><span /><span />
                  <b className="mono">agent.run()</b>
                </div>
                <div className="ag-body">
                  <div className="ag-line mono"><span className="text-accent">›</span> recibo email · cliente@empresa.com</div>
                  <div className="ag-line mono">→ extraigo intención · &ldquo;factura agosto&rdquo;</div>
                  <div className="ag-line mono">→ consulto ERP · invoice_id: 4421</div>
                  <div className="ag-line mono">→ genero PDF + envío respuesta</div>
                  <div className="ag-line mono text-sage">✓ resuelto · 12s · sin humano</div>
                </div>
              </div>
            </div>
            <div className="srv-card-meta mono">[01] Agente / Producción · 3.2k tareas/día</div>
          </div>

          <div className={cn("srv-card", active === 1 && "active")} data-card={1}>
            <div className="srv-card-frame">
              <div className="rag-search">
                <div className="rag-input mono">¿cuál es la política de devoluciones B2B?</div>
                <div className="rag-result">
                  <div className="rag-line">
                    Las devoluciones B2B se aceptan dentro de 30 días desde la factura, sujeto a estado del producto.
                  </div>
                  <div className="rag-cites mono">
                    <span>política-comercial.pdf · p.14</span>
                    <span>contrato-marco.docx · §4.2</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="srv-card-meta mono">[02] RAG / 12k docs indexados</div>
          </div>

          <div className={cn("srv-card", active === 2 && "active")} data-card={2}>
            <div className="srv-card-frame">
              <div className="flow">
                <div className="flow-step"><b className="mono">01</b><span>Email entrante</span></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step"><b className="mono">02</b><span>Clasificar</span></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step"><b className="mono">03</b><span>Extraer</span></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step active"><b className="mono">04</b><span>Validar</span></div>
                <div className="flow-arrow">→</div>
                <div className="flow-step"><b className="mono">05</b><span>Routear</span></div>
              </div>
            </div>
            <div className="srv-card-meta mono">[03] Pipeline / 99.2% precisión</div>
          </div>

          <div className={cn("srv-card", active === 3 && "active")} data-card={3}>
            <div className="srv-card-frame">
              <div className="copilot">
                <div className="cop-side">
                  <div className="cop-item active">Pipeline Q3</div>
                  <div className="cop-item">Cuentas top</div>
                  <div className="cop-item">Forecast</div>
                  <div className="cop-item">Coaching</div>
                </div>
                <div className="cop-main">
                  <div className="cop-h mono">copilot · comercial</div>
                  <div className="cop-msg">
                    Resumen de las 5 oportunidades en negociación esta semana, con probabilidad y siguiente paso recomendado.
                  </div>
                  <div className="cop-bar"><div className="cop-bar-fill" /></div>
                  <div className="cop-msg small text-faint">3 deals en riesgo — clic para ver acciones</div>
                </div>
              </div>
            </div>
            <div className="srv-card-meta mono">[04] Copilot / Equipo comercial · 24 usuarios</div>
          </div>
        </aside>
      </div>
    </section>
  );
}
