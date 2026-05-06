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

export interface TweakState {
  palette: Palette;
  font: FontFamily;
  dark: boolean;
  heroVariant: HeroVariant;
}

const DEFAULTS: TweakState = {
  palette: "ink-sage",
  font: "editorial",
  dark: true,
  heroVariant: "orbital",
};

const STORAGE_KEY = "unlimited.tweaks";

interface TweaksContextValue {
  state: TweakState;
  setTweak: <K extends keyof TweakState>(key: K, value: TweakState[K]) => void;
  reset: () => void;
}

const TweaksContext = createContext<TweaksContextValue | null>(null);

function applyToHtml(s: TweakState) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.setAttribute("data-palette", s.palette);
  html.setAttribute("data-font", s.font);
  html.setAttribute("data-theme", s.dark ? "dark" : "light");
  html.setAttribute("data-hero", s.heroVariant);
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  // SSR renders with defaults; the hydration effect below replays anything
  // the user previously saved without a flash because both branches share
  // the same data-* keys (just different values).
  const [state, setState] = useState<TweakState>(DEFAULTS);

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
  }, []);

  const setTweak = useCallback<TweaksContextValue["setTweak"]>((key, value) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* quota exceeded — ignore */
      }
      applyToHtml(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    applyToHtml(DEFAULTS);
  }, []);

  const value = useMemo<TweaksContextValue>(
    () => ({ state, setTweak, reset }),
    [state, setTweak, reset]
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
(function(){try{var raw=localStorage.getItem(${JSON.stringify(STORAGE_KEY)});var d={palette:"ink-sage",font:"editorial",dark:true,heroVariant:"orbital"};var s=raw?Object.assign({},d,JSON.parse(raw)):d;var h=document.documentElement;h.setAttribute("data-palette",s.palette);h.setAttribute("data-font",s.font);h.setAttribute("data-theme",s.dark?"dark":"light");h.setAttribute("data-hero",s.heroVariant);}catch(e){}})();
`;
