const STATS = [
  { num: "+14", suffix: "",   suffixClass: "text-accent", label: "proyectos en producción" },
  { num: "1",   suffix: " sem", suffixClass: "text-faint", label: "hasta el primer prototipo" },
  { num: "24",  suffix: "h",  suffixClass: "text-accent", label: "para la primera respuesta" },
  { num: "100", suffix: "%",  suffixClass: "text-accent", label: "código entregado al cliente" },
];

export function Stats() {
  return (
    <section className="stats" data-screen-label="05 Stats">
      <div className="wrap stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="stat" data-reveal data-reveal-delay={i || undefined}>
            <div className="stat-num">
              {s.num}
              {s.suffix && <span className={s.suffixClass}>{s.suffix}</span>}
            </div>
            <div className="stat-lbl mono">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
