"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Palette = "ink-sage" | "bone-ink" | "forest" | "mono";
export type FontFamily = "editorial" | "modern" | "techno";
export type HeroVariant = "orbital" | "grid" | "type";
export type Density = "compact" | "normal" | "spacious";
export type Radius = "sharp" | "soft" | "round";
export type AccentIntensity = "subtle" | "normal" | "bold";
export type Contrast = "low" | "normal" | "high";
export type Motion = "still" | "calm" | "lively";
export type Grain = "off" | "subtle" | "strong";

export interface TweakState {
  palette: Palette;
  font: FontFamily;
  dark: boolean;
  heroVariant: HeroVariant;
  density: Density;
  radius: Radius;
  accentIntensity: AccentIntensity;
  contrast: Contrast;
  motion: Motion;
  grain: Grain;
}

export interface SavedPreset {
  /** Unique id (timestamp-based) so we can delete a specific entry. */
  id: string;
  /** Display name — auto-generated if the user didn't type one. */
  name: string;
  /** Snapshot of state at the moment of saving. */
  state: TweakState;
  /** Unix ms — used for ordering. */
  createdAt: number;
}

export const DEFAULTS: TweakState = {
  palette: "ink-sage",
  font: "editorial",
  dark: true,
  heroVariant: "orbital",
  density: "normal",
  radius: "soft",
  accentIntensity: "normal",
  contrast: "normal",
  motion: "calm",
  grain: "subtle",
};

/**
 * Factory presets — curated combinations meant to give a head-start.
 * Anything not specified falls back to DEFAULTS.
 */
export const FACTORY_PRESETS: Array<{ id: string; name: string; description: string; state: TweakState }> = [
  {
    id: "factory-editorial",
    name: "Editorial",
    description: "Lo que ve ahora — paleta tinta-salvia, serif, orbital.",
    state: { ...DEFAULTS },
  },
  {
    id: "factory-claro",
    name: "Claro",
    description: "Fondo hueso, tipo serif, contraste calmo. Buena lectura.",
    state: { ...DEFAULTS, palette: "bone-ink", dark: false, grain: "off", motion: "calm" },
  },
  {
    id: "factory-tecno",
    name: "Tecno",
    description: "Mono fríamente — tipos monoespaciados, hero retícula, motion vivo.",
    state: {
      ...DEFAULTS,
      palette: "mono",
      font: "techno",
      heroVariant: "grid",
      motion: "lively",
      grain: "off",
      contrast: "high",
      radius: "sharp",
    },
  },
  {
    id: "factory-bosque",
    name: "Bosque",
    description: "Paleta forestal, acento ámbar suave, denso y orgánico.",
    state: {
      ...DEFAULTS,
      palette: "forest",
      font: "modern",
      density: "spacious",
      accentIntensity: "subtle",
      grain: "strong",
    },
  },
  {
    id: "factory-impacto",
    name: "Impacto",
    description: "Acento muy fuerte, tipografía dramática, hero tipográfico.",
    state: {
      ...DEFAULTS,
      heroVariant: "type",
      font: "editorial",
      accentIntensity: "bold",
      contrast: "high",
      motion: "lively",
      radius: "round",
    },
  },
];

const STORAGE_KEY = "unlimited.tweaks";
const PRESETS_KEY = "unlimited.tweaks.presets";

interface TweaksContextValue {
  state: TweakState;
  setTweak: <K extends keyof TweakState>(key: K, value: TweakState[K]) => void;
  setAll: (next: TweakState) => void;
  reset: () => void;
  presets: SavedPreset[];
  addPreset: (name: string) => SavedPreset;
  removePreset: (id: string) => void;
  applyPreset: (id: string) => void;
}

const TweaksContext = createContext<TweaksContextValue | null>(null);

function applyToHtml(s: TweakState) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-palette", s.palette);
  html.setAttribute("data-font", s.font);
  html.setAttribute("data-theme", s.dark ? "dark" : "light");
  html.setAttribute("data-hero", s.heroVariant);
  html.setAttribute("data-density", s.density);
  html.setAttribute("data-radius", s.radius);
  html.setAttribute("data-accent-intensity", s.accentIntensity);
  html.setAttribute("data-contrast", s.contrast);
  html.setAttribute("data-motion", s.motion);
  html.setAttribute("data-grain", s.grain);
}

function defaultPresetName() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `Mi plantilla · ${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  // SSR renders with defaults; the hydration effect replays anything the user
  // previously saved without a flash because both branches share the same
  // data-* keys (just different values).
  const [state, setState] = useState<TweakState>(DEFAULTS);
  const [presets, setPresets] = useState<SavedPreset[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<TweakState>;
        const next = { ...DEFAULTS, ...parsed };
        setState(next);
        applyToHtml(next);
      } else {
        applyToHtml(DEFAULTS);
      }
    } catch {
      applyToHtml(DEFAULTS);
    }
    try {
      const rawP = localStorage.getItem(PRESETS_KEY);
      if (rawP) {
        const parsed = JSON.parse(rawP) as SavedPreset[];
        if (Array.isArray(parsed)) setPresets(parsed);
      }
    } catch {
      /* ignore corrupt presets */
    }
  }, []);

  const persistState = useCallback((next: TweakState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* quota exceeded — ignore */
    }
    applyToHtml(next);
  }, []);

  const setTweak = useCallback<TweaksContextValue["setTweak"]>(
    (key, value) => {
      setState((prev) => {
        const next = { ...prev, [key]: value };
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const setAll = useCallback<TweaksContextValue["setAll"]>(
    (next) => {
      const merged = { ...DEFAULTS, ...next };
      setState(merged);
      persistState(merged);
    },
    [persistState]
  );

  const reset = useCallback(() => {
    setState(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    applyToHtml(DEFAULTS);
  }, []);

  const persistPresets = useCallback((next: SavedPreset[]) => {
    try {
      localStorage.setItem(PRESETS_KEY, JSON.stringify(next));
    } catch {
      /* quota exceeded — drop oldest */
    }
  }, []);

  const addPreset = useCallback<TweaksContextValue["addPreset"]>(
    (name) => {
      const preset: SavedPreset = {
        id: `user-${Date.now().toString(36)}`,
        name: name.trim() || defaultPresetName(),
        state,
        createdAt: Date.now(),
      };
      setPresets((prev) => {
        const next = [preset, ...prev].slice(0, 20); // keep last 20
        persistPresets(next);
        return next;
      });
      return preset;
    },
    [state, persistPresets]
  );

  const removePreset = useCallback<TweaksContextValue["removePreset"]>(
    (id) => {
      setPresets((prev) => {
        const next = prev.filter((p) => p.id !== id);
        persistPresets(next);
        return next;
      });
    },
    [persistPresets]
  );

  const applyPreset = useCallback<TweaksContextValue["applyPreset"]>(
    (id) => {
      const factory = FACTORY_PRESETS.find((p) => p.id === id);
      if (factory) {
        setAll(factory.state);
        return;
      }
      const saved = presets.find((p) => p.id === id);
      if (saved) setAll(saved.state);
    },
    [presets, setAll]
  );

  const value = useMemo<TweaksContextValue>(
    () => ({ state, setTweak, setAll, reset, presets, addPreset, removePreset, applyPreset }),
    [state, setTweak, setAll, reset, presets, addPreset, removePreset, applyPreset]
  );

  return <TweaksContext.Provider value={value}>{children}</TweaksContext.Provider>;
}

export function useTweaks() {
  const ctx = useContext(TweaksContext);
  if (!ctx) throw new Error("useTweaks must be used inside <TweaksProvider>");
  return ctx;
}

/**
 * Pre-hydration script. Runs before React paints so the first frame
 * already has the right palette/theme and there is no FOUC.
 */
export const TWEAKS_BOOT_SCRIPT = `
(function(){try{var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var d={palette:"ink-sage",font:"editorial",dark:true,heroVariant:"orbital",density:"normal",radius:"soft",accentIntensity:"normal",contrast:"normal",motion:"calm",grain:"subtle"};var s=raw?Object.assign({},d,JSON.parse(raw)):d;var h=document.documentElement;h.setAttribute("data-palette",s.palette);h.setAttribute("data-font",s.font);h.setAttribute("data-theme",s.dark?"dark":"light");h.setAttribute("data-hero",s.heroVariant);h.setAttribute("data-density",s.density);h.setAttribute("data-radius",s.radius);h.setAttribute("data-accent-intensity",s.accentIntensity);h.setAttribute("data-contrast",s.contrast);h.setAttribute("data-motion",s.motion);h.setAttribute("data-grain",s.grain);}catch(e){}})();
`;
