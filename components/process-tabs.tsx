"use client";

import { useEffect, useRef, useState } from "react";
import { fases } from "@/content/proceso";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5000;

export function ProcessTabs() {
  const [active, setActive] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!autoRotate) return;
    intervalRef.current = setInterval(() => {
      setActive((cur) => (cur + 1) % fases.length);
    }, ROTATE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRotate]);

  const select = (i: number) => {
    setAutoRotate(false);
    setActive(i);
  };

  return (
    <section id="proceso" className="process" data-screen-label="04 Proceso">
      <div className="wrap">
        <span className="num" data-reveal>03 — Proceso</span>
        <h2 className="section-h" data-reveal data-reveal-delay="1">
          Cuatro semanas para <em>ver algo</em>
          <br />funcionando.
        </h2>

        <div className="process-tabs" id="processTabs" role="tablist">
          {fases.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`process-panel-${i}`}
              id={`process-tab-${i}`}
              className={cn("process-tab", active === i && "active")}
              data-tab={i}
              onClick={() => select(i)}
            >
              <span className="mono">{f.week}</span> {f.label}
            </button>
          ))}
        </div>

        <div className="process-content">
          {fases.map((f, i) => (
            <div
              key={f.id}
              id={`process-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`process-tab-${i}`}
              className={cn("process-panel", active === i && "active")}
              data-panel={i}
              hidden={active !== i}
            >
              <div className="process-panel-l">
                <h3>{f.heading}</h3>
                <p className="lede">{f.body}</p>
              </div>
              <div className="process-panel-r mono">
                {f.rows.map((r) => (
                  <div key={r.k} className="pp-row">
                    <span className="text-faint">{r.k}</span>
                    <span className={r.accent ? "text-accent" : undefined}>{r.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
