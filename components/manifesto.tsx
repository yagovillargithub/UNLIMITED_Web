export function Manifesto() {
  return (
    <section id="manifesto" data-screen-label="02 Manifesto">
      <div className="wrap manifesto">
        <span className="num" data-reveal>01 — Manifiesto</span>
        <h2 className="section-h" data-reveal data-reveal-delay="1">
          La IA no es magia.<br />
          <em className="text-sage">Es ingeniería bien hecha.</em>
        </h2>
        <div className="manifesto-grid" data-reveal data-reveal-delay="2">
          <p className="lede">
            Llevamos años integrando sistemas. La IA generativa cambió las herramientas,
            no los principios: entender el negocio, mapear los datos, escribir código que
            no se rompe.
          </p>
          <p className="lede">
            Trabajamos cerca. Sin agencias intermediarias, sin presentaciones de 80 slides,
            sin <span className="italic text-sage">&ldquo;vendor lock-in&rdquo;</span>. Te enseñamos cómo
            funciona para que tu equipo lo mantenga.
          </p>
        </div>
      </div>
    </section>
  );
}
