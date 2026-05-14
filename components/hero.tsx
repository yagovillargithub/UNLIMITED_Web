import Link from "next/link";

/**
 * Single hero markup for the landing page. The three Tweaks variants
 * (orbital / grid / type) are achieved purely via CSS overrides keyed off
 * `[data-hero]` on <html> — no JS variant switching needed here.
 */
export function Hero() {
  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div className="wrap hero-grid">
        <div className="hero-meta">
          <span className="mono text-faint">UNL / 2026 · Madrid — Remoto</span>
          <span className="mono text-faint hero-status">
            <span className="dot-live" /> Aceptando 3 proyectos en Q3
          </span>
        </div>

        <h1 className="display hero-h" data-reveal="char">
          Sistemas que piensan<br />
          <em>contigo.</em>
        </h1>

        <div className="hero-side" data-reveal data-reveal-delay="2">
          <p className="lede">
            Somos UNLIMITED. Llevamos IA práctica a empresas reales — talleres,
            hostelería, clínicas, despachos, ganaderías, almacenes — y en pocas
            semanas tiene un sistema que le ahorra horas cada día. Código propio
            que funciona el lunes por la mañana.
          </p>
          <div className="hero-cta">
            <Link className="btn btn--accent" href="/contacto">
              Empezar un proyecto <span className="arrow">→</span>
            </Link>
            <Link className="btn" href="/servicios">
              Ver servicios
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="orbit">
            <div className="orbit-ring r1" />
            <div className="orbit-ring r2" />
            <div className="orbit-ring r3" />
            <div className="orbit-pulse" />
            <div className="orbit-core" />
            <div className="orbit-node n1"><span className="mono">Pedidos</span></div>
            <div className="orbit-node n2"><span className="mono">Agenda</span></div>
            <div className="orbit-node n3"><span className="mono">Facturas</span></div>
            <div className="orbit-node n4"><span className="mono">Stock</span></div>
            <div className="orbit-node n5"><span className="mono">Clientes</span></div>
          </div>
        </div>

        <div className="hero-scroll mono text-faint">
          <span>Desplázate</span>
          <span className="hero-scroll-line" />
        </div>
      </div>
    </section>
  );
}
