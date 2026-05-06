# UNLIMITED — Web

Web corporativa de **UNLIMITED**, consultora de IA con sede en Madrid. Migración a producción del prototipo HTML/CSS/JS aprobado por cliente, ahora sobre Next.js 15.

## Stack

- **Next.js 15** (App Router, RSC) + React 19 + TypeScript
- **Tailwind CSS v4** con `@theme` (tokens reactivos a las variables CSS de paleta)
- **Framer Motion** + **Lenis** (smooth scroll) — listo para animaciones avanzadas
- **next/font** — Instrument Serif, Inter Tight, JetBrains Mono autohospedadas
- **Zod** + **react-hook-form** — validación del formulario
- **Resend** — envío transaccional del formulario de contacto
- **Upstash Redis** (opcional) — rate limiting del endpoint
- **Vercel Analytics** + **Speed Insights**
- **Playwright** — smoke tests E2E
- **ESLint** (`next/core-web-vitals` + `next/typescript`)

## Estructura

```
app/
  layout.tsx                # fonts + providers + analytics + tweaks boot
  globals.css               # tokens + tailwind + estilos portados del prototipo
  sitemap.ts · robots.ts
  api/contact/route.ts      # Resend + Slack + Upstash + honeypot
  (marketing)/
    layout.tsx              # Nav + Footer + CursorBlob + SmoothScroll + Reveal + Tweaks
    page.tsx                # Landing
    servicios/page.tsx
    contacto/page.tsx
components/
  hero · manifesto · marquee · landing-services · process-tabs · stats · big-cta
  servicios-list · contact-form · wa-float
  nav · footer · cursor-blob · reveal · smooth-scroll
  tweaks/{provider,panel}
content/
  servicios.ts              # 8 servicios tipados
  proceso.ts                # 5 fases tipadas
hooks/
  use-reduced-motion.ts
lib/
  schemas.ts · utils.ts · rate-limit.ts
e2e/
  landing.spec.ts · servicios.spec.ts · contacto.spec.ts
```

El prototipo original sigue en `Interfaz generada con IA/` como referencia visual; **no se importa en build**.

## Setup local

Requiere Node 20+ y npm.

```powershell
# 1. instala dependencias
npm install

# 2. copia variables de entorno
Copy-Item .env.example .env.local
# (rellena RESEND_API_KEY si quieres probar el envío real;
#  si lo dejas vacío el formulario funciona y el payload se loguea por consola)

# 3. arranca dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Sirve el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Playwright (requiere `npm run build` previo en CI) |
| `npm run test:e2e:install` | Instala el browser de Chromium |

## Variables de entorno

Ver [`.env.example`](./.env.example). Resumen:

| Variable | Uso |
|---|---|
| `RESEND_API_KEY` | Clave de Resend. Si falta, el endpoint loguea y devuelve éxito (útil en preview). |
| `CONTACT_TO_EMAIL` | Destinatario del formulario. Por defecto `hola@unlimited.systems`. |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend. |
| `SLACK_WEBHOOK_URL` | Opcional — espeja el envío en Slack. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Opcional — rate limit (5 reqs / 10 min por IP). Sin estas claves no se limita. |
| `NEXT_PUBLIC_WA_NUMBER` | Número de WhatsApp (sin `+`). |
| `NEXT_PUBLIC_SITE_URL` | URL canónica para `metadataBase`, sitemap y robots. |

## Sistema de Tweaks

Panel flotante (esquina inferior derecha) que persiste en `localStorage` (`unlimited.tweaks`):

- **Paleta** — `ink-sage` · `bone-ink` · `forest` · `mono`
- **Modo oscuro** — toggle
- **Tipografía** — `editorial` · `modern` · `techno`
- **Hero** — `orbital` · `grid` · `type`

Las preferencias se aplican vía `data-*` sobre `<html>`. Para evitar FOUC, un script inline en `app/layout.tsx` lee `localStorage` antes del primer paint.

## Deploy a Vercel

1. Importa el repo en Vercel (framework Next.js — autodetecta).
2. Añade las variables de `.env.example` en _Project Settings → Environment Variables_.
3. Domain: añade `unlimited.systems` (y `www`).
4. El primer deploy fallará al enviar el form si `RESEND_API_KEY` está vacío — no bloquea el resto del sitio.

`vercel.json` está preconfigurado a la región `fra1` (Frankfurt) por proximidad a Madrid.

## Accesibilidad y rendimiento

- Contraste AA en todas las paletas
- `prefers-reduced-motion` desactiva marquee, orbital, char-reveal, cursor blob y Lenis
- Roles ARIA en chips, tabs, switch del Tweaks panel
- Skip-friendly: focus visible + navegación con teclado en todos los interactivos
- `next/font` evita FOIT y CLS de fuentes
- Headers de seguridad básicos en `next.config.ts`

## Tests

```powershell
npm run build
npm run test:e2e:install
npm run test:e2e
```

Cubren: carga del landing y panel de Tweaks, hover/click en `/servicios`, envío válido + validación en vivo en `/contacto`. La llamada a `/api/contact` se mockea para no depender de credenciales.

## Convenciones

- Commits en inglés o español, atómicos por feature.
- No cambies copy ni paleta sin pedir permiso — el prototipo HTML es la fuente de verdad visual.
- Pendiente cliente: logo definitivo, casos de éxito reales, foto/equipo, textos legales.
