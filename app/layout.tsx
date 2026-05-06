import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { TweaksProvider, TWEAKS_BOOT_SCRIPT } from "@/components/tweaks/provider";
import { SITE_URL } from "@/lib/utils";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "UNLIMITED — Consultoría de IA & sistemas",
    template: "%s — UNLIMITED",
  },
  description:
    "Diseñamos, integramos y desplegamos inteligencia artificial dentro de empresas reales — no demos. Cercanos, claros, con código que funciona el lunes por la mañana.",
  keywords: ["IA", "consultoría", "agentes", "RAG", "automatización", "Madrid", "Spain"],
  authors: [{ name: "UNLIMITED Systems" }],
  creator: "UNLIMITED",
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "UNLIMITED",
    title: "UNLIMITED — Consultoría de IA & sistemas",
    description:
      "Diseñamos, integramos y desplegamos IA en empresas reales. Madrid + remoto.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "UNLIMITED — Consultoría de IA & sistemas",
    description:
      "Diseñamos, integramos y desplegamos IA en empresas reales. Madrid + remoto.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0b" },
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${instrumentSerif.variable} ${interTight.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Pre-paint script — applies persisted tweaks before first frame to
            prevent FOUC. Inline so it runs synchronously before hydration. */}
        <script dangerouslySetInnerHTML={{ __html: TWEAKS_BOOT_SCRIPT }} />
      </head>
      <body>
        <TweaksProvider>{children}</TweaksProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
