"use client";

import { useState } from "react";
import { servicios } from "@/content/servicios";
import { cn } from "@/lib/utils";

export function ServiciosList() {
  const [active, setActive] = useState(0);

  return (
    <section className="srv-list-section">
      <div className="wrap">
        <div className="srv-listing" id="srvListing" role="tablist" aria-label="Catálogo de servicios">
          {servicios.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`srv-detail-${s.id}`}
              id={`srv-row-${s.id}`}
              className={cn("srv-row", active === i && "active")}
              data-srv={i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <div className="srv-row-num mono">{s.num}</div>
              <div className="srv-row-title">{s.title}</div>
              <div className="srv-row-tags mono">
                <span>{s.meta.format}</span>
              </div>
              <div className="srv-row-price mono">{s.meta.duration}</div>
            </button>
          ))}
        </div>

        <aside className="srv-detail" id="srvDetail">
          {servicios.map((s, i) => (
            <div
              key={s.id}
              id={`srv-detail-${s.id}`}
              role="tabpanel"
              aria-labelledby={`srv-row-${s.id}`}
              className={cn("srv-detail-card", active === i && "active")}
              data-detail={i}
              hidden={active !== i}
            >
              <span className="mono text-faint">
                {s.num} · {s.meta.duration} · {s.meta.format}
              </span>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              {s.blocks.map((b, j) => (
                <div key={j} className="sd-block">
                  <h4 className="mono">{b.heading}</h4>
                  {b.kind === "list" && b.items && (
                    <ul>
                      {b.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  )}
                  {b.kind === "text" && b.body && (
                    <p className="text-faint small">{b.body}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
