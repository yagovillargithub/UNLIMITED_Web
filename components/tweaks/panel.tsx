"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  useTweaks,
  type FontFamily,
  type HeroVariant,
  type Palette,
} from "./provider";

const PALETTES: Array<{ value: Palette; label: string; hero: string; rest: string[] }> = [
  { value: "ink-sage", label: "Ink",    hero: "#0d0d0b", rest: ["#c9cbbe", "#d4a574"] },
  { value: "bone-ink", label: "Bone",   hero: "#f3f1ea", rest: ["#0d0d0b", "#a8521c"] },
  { value: "forest",   label: "Forest", hero: "#0a0e0c", rest: ["#a8b5a0", "#e8c887"] },
  { value: "mono",     label: "Mono",   hero: "#0a0a0a", rest: ["#a8a8a8", "#fafafa"] },
];

const FONTS: Array<{ value: FontFamily; label: string }> = [
  { value: "editorial", label: "Editorial" },
  { value: "modern",    label: "Modern" },
  { value: "techno",    label: "Techno" },
];

const HEROES: Array<{ value: HeroVariant; label: string }> = [
  { value: "orbital", label: "Orbital" },
  { value: "grid",    label: "Grid" },
  { value: "type",    label: "Type" },
];

/** Floating Tweaks panel — collapsed dot + expanded card. Persists open
 * state in memory only; intentionally collapses on every page load. */
export function TweaksPanel() {
  const { state, setTweak, reset } = useTweaks();
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Close on Escape / click-outside. Skip clicks on the FAB so that a
  // second tap on the toggle still closes (otherwise mousedown closes,
  // click reopens).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (cardRef.current?.contains(target)) return;
      if (fabRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
    };
  }, [open]);

  return (
    <>
      <style>{TWEAK_STYLES}</style>
      <button
        ref={fabRef}
        type="button"
        className="twk-fab"
        aria-label="Abrir panel de personalización"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="twk-fab-dot" />
        <span className="twk-fab-lbl mono">Tweaks</span>
      </button>

      {open && (
        <div ref={cardRef} className="twk-panel" role="dialog" aria-label="Tweaks UNLIMITED">
          <div className="twk-hd">
            <b>Tweaks · UNLIMITED</b>
            <button
              type="button"
              className="twk-x"
              aria-label="Cerrar panel"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="twk-body">
            <div className="twk-sect">Paleta</div>
            <div className="twk-chips" role="radiogroup" aria-label="Paleta">
              {PALETTES.map((p) => {
                const on = state.palette === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    aria-label={p.label}
                    title={p.label}
                    className={cn("twk-chip", on && "is-on")}
                    style={{ background: p.hero }}
                    onClick={() => setTweak("palette", p.value)}
                  >
                    <span>
                      {p.rest.map((c) => (
                        <i key={c} style={{ background: c }} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="twk-row twk-row-h">
              <span className="twk-lbl">Modo oscuro</span>
              <button
                type="button"
                role="switch"
                aria-checked={state.dark}
                aria-label="Alternar modo oscuro"
                className={cn("twk-toggle", state.dark && "is-on")}
                onClick={() => setTweak("dark", !state.dark)}
              >
                <i />
              </button>
            </div>

            <div className="twk-sect">Tipografía</div>
            <SegmentedRadio
              label="Familia"
              value={state.font}
              options={FONTS}
              onChange={(v) => setTweak("font", v)}
            />

            <div className="twk-sect">Hero</div>
            <SegmentedRadio
              label="Variante"
              value={state.heroVariant}
              options={HEROES}
              onChange={(v) => setTweak("heroVariant", v)}
            />

            <div className="twk-row twk-row-h" style={{ marginTop: 6 }}>
              <button type="button" className="twk-btn-secondary" onClick={reset}>
                Restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SegmentedRadio<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div className="twk-row">
      <span className="twk-lbl">{label}</span>
      <div className="twk-seg" role="radiogroup" aria-label={label}>
        <span
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${options.length})`,
            width: `calc((100% - 4px) / ${options.length})`,
          }}
        />
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const TWEAK_STYLES = `
.twk-fab{position:fixed;right:18px;bottom:18px;z-index:60;display:flex;align-items:center;gap:8px;
  padding:10px 14px;border:1px solid var(--rule);background:rgba(20,20,15,.8);color:var(--fg);
  border-radius:999px;backdrop-filter:blur(12px) saturate(140%);-webkit-backdrop-filter:blur(12px) saturate(140%);
  cursor:pointer;transition:transform .25s var(--easing),background .25s}
.twk-fab:hover{transform:translateY(-1px)}
.twk-fab-dot{width:8px;height:8px;border-radius:50%;background:var(--accent)}
.twk-fab-lbl{font-family:var(--f-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase}
[data-theme="light"] .twk-fab{background:rgba(243,241,234,.85)}

.twk-panel{position:fixed;right:18px;bottom:64px;z-index:61;width:280px;max-height:calc(100vh - 100px);
  display:flex;flex-direction:column;background:rgba(20,20,15,.92);color:var(--fg);
  -webkit-backdrop-filter:blur(20px) saturate(160%);backdrop-filter:blur(20px) saturate(160%);
  border:1px solid var(--rule);border-radius:14px;
  box-shadow:0 12px 40px rgba(0,0,0,.4);font:11.5px/1.4 var(--f-sans);overflow:hidden;
  animation:twkIn .25s var(--easing)}
@keyframes twkIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
[data-theme="light"] .twk-panel{background:rgba(250,249,247,.92);color:#29261b}

.twk-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 10px 12px 14px;
  border-bottom:1px solid var(--rule)}
.twk-hd b{font-size:12px;font-weight:600;letter-spacing:.02em;font-family:var(--f-mono);text-transform:uppercase}
.twk-x{appearance:none;border:0;background:transparent;color:var(--fg-faint);width:22px;height:22px;
  border-radius:6px;cursor:pointer;font-size:13px;line-height:1}
.twk-x:hover{background:rgba(255,255,255,.05);color:var(--fg)}

.twk-body{padding:8px 14px 14px;display:flex;flex-direction:column;gap:10px;overflow-y:auto;min-height:0}
.twk-sect{font-family:var(--f-mono);font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
  color:var(--fg-faint);padding:10px 0 0}
.twk-sect:first-child{padding-top:0}

.twk-row{display:flex;flex-direction:column;gap:6px}
.twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
.twk-lbl{font-size:12px;color:var(--fg-dim)}

.twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;background:rgba(255,255,255,.06);user-select:none}
[data-theme="light"] .twk-seg{background:rgba(0,0,0,.06)}
.twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;background:var(--fg);
  transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
.twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;background:transparent;
  color:var(--fg-dim);font:inherit;font-weight:500;min-height:24px;border-radius:6px;cursor:pointer;
  padding:4px 6px;line-height:1.2}
.twk-seg button[aria-checked="true"]{color:var(--bg)}

.twk-toggle{position:relative;width:34px;height:20px;border:0;border-radius:999px;background:rgba(255,255,255,.15);
  transition:background .15s;cursor:pointer;padding:0}
[data-theme="light"] .twk-toggle{background:rgba(0,0,0,.15)}
.twk-toggle.is-on{background:var(--accent)}
.twk-toggle i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;
  box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
.twk-toggle.is-on i{transform:translateX(14px)}

.twk-chips{display:flex;gap:6px}
.twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;padding:0;border:0;border-radius:6px;
  overflow:hidden;cursor:pointer;box-shadow:0 0 0 .5px rgba(0,0,0,.2),0 1px 2px rgba(0,0,0,.06);
  transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
.twk-chip:hover{transform:translateY(-1px)}
.twk-chip.is-on{box-shadow:0 0 0 1.5px var(--accent),0 2px 6px rgba(0,0,0,.15)}
.twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;display:flex;flex-direction:column;
  box-shadow:-1px 0 0 rgba(0,0,0,.2)}
.twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.2)}
.twk-chip>span>i:first-child{box-shadow:none}

.twk-btn-secondary{appearance:none;height:28px;padding:0 14px;border:1px solid var(--rule);border-radius:7px;
  background:transparent;color:var(--fg-dim);font:inherit;font-family:var(--f-mono);font-size:11px;
  letter-spacing:.04em;cursor:pointer;transition:color .2s,border-color .2s;width:100%}
.twk-btn-secondary:hover{color:var(--fg);border-color:var(--fg-dim)}
`;
