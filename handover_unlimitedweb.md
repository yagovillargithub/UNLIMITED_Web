# Handover — UNLIMITED Web (Next.js 15)

> Documento de traspaso. Pensado para que cualquier agente o persona que herede este proyecto pueda levantar, modificar y desplegar la web sin volver a aprender de cero.
> Fecha de redacción: **2026-05-06**.

---

## 1. Visión general

Web corporativa de **UNLIMITED**, consultora de IA con sede en Madrid (remoto + EU). Se ha migrado un prototipo HTML/CSS/JS aprobado por el cliente a un proyecto **Next.js 15 + React 19 + TypeScript + Tailwind v4** listo para producción.

- **Repositorio local**: `c:\GitHub\UNLIMITED_Web\`.
- **Origen visual** (no se importa en build, solo referencia): `c:\GitHub\UNLIMITED_Web\Interfaz generada con IA\` — 12 archivos del prototipo original (3 HTML + CSS + JS + JSX del panel de tweaks).
- **Dominio en producción**: **`unlimited-systems.net`** (comprado el 2026-05-06 en Cloudflare, gestionado desde la cuenta de Yago). El handover original mencionaba `unlimited.systems` como objetivo — finalmente se eligió `unlimited-systems.net` por disponibilidad/precio.
- **Hosting actual**: **VPS Contabo** `185.213.25.188` (el mismo que ya hospeda Stalwart mail y otras webs). Apache 2.4 hace reverse proxy hacia un proceso `next start` corriendo bajo `systemd`. **No se usa Vercel** aunque `vercel.json` y `@vercel/analytics` siguen en el repo (no hacen daño — Analytics se desactiva si no detecta entorno Vercel). Ver §11 "Despliegue en producción" para detalles.
- **Estado**: la web está **en vivo** en https://unlimited-systems.net con HTTPS Let's Encrypt. Falta contenido del cliente (logo definitivo, casos de éxito reales, foto/equipo, textos legales) y configurar el envío real de correo (ahora mismo `/api/contact` devuelve éxito y loguea en `journalctl` sin enviar nada — falta `RESEND_API_KEY` o reescritura para usar el Stalwart self-hosted).

---

## 2. Stack

| Capa | Tecnología | Por qué |
|---|---|---|
| Framework | **Next.js 15** App Router (RSC donde tiene sentido) | Estática rápida, server components para SEO, API route nativa para el form |
| UI | **React 19** + **TypeScript** strict | — |
| Estilos | **Tailwind CSS v4** con `@theme inline` | Tokens reactivos a las variables CSS de paleta — Tailwind v4 ya no usa `tailwind.config.js`, todo va en `globals.css` |
| Animaciones | **Framer Motion** + **Lenis** (smooth scroll) | Lenis para scroll global, Framer disponible si se necesitan animaciones más complejas (no se ha usado todavía — los reveals actuales son CSS + IntersectionObserver puro) |
| Tipografías | **next/font** — Instrument Serif, Inter Tight, JetBrains Mono | Auto-hospedadas, sin FOIT/CLS |
| Form | **react-hook-form** + **Zod** + `@hookform/resolvers` | Validación on-blur, server-side compartida |
| Email | **Resend** v4 SDK (`emails.send`, `replyTo` camelCase) | Transaccional simple |
| Rate limit | **@upstash/ratelimit** + **@upstash/redis** | Sliding window 5 reqs / 10 min por IP. **No-op si faltan las env vars** |
| Analytics | **@vercel/analytics/next** + **@vercel/speed-insights/next** | Auto-detecta Vercel |
| Tests | **Playwright** (chromium-only en CI) | 3 specs: landing, servicios, contacto |
| Lint | ESLint `next/core-web-vitals` + `next/typescript` | — |
| CI | GitHub Actions (`.github/workflows/ci.yml`) | lint + typecheck + build → e2e con upload de report |

**Nada de shadcn/ui, nada de CSS modules, nada de styled-components**. Casi todo el styling está en `app/globals.css` (port directo del prototipo). Tailwind v4 se usa solo donde aporta — la mayoría del CSS es custom.

---

## 3. Estado actual (qué funciona)

Comprobado el **2026-05-06** con dev server en local:

| Endpoint | Estado | Observaciones |
|---|---|---|
| `GET /` | 200, ~80 KB | Hero (3 variantes vía Tweaks), manifesto, marquee, services sticky-scroll, process tabs (auto-rotate 5s), stats, big CTA |
| `GET /servicios` | 200, ~69 KB | 8 filas interactivas + sticky detail card que cambia on hover/focus/click |
| `GET /contacto` | 200, ~48 KB | Form con barra de progreso, chips multi/radio, validación on-blur, success animado, WA float |
| `POST /api/contact` | 200 + `{ ok, ref }` | Sin `RESEND_API_KEY` loguea por consola y devuelve éxito (preview-friendly). Honeypot + rate limit funcionan. |
| `GET /sitemap.xml` | (auto) | Generado por `app/sitemap.ts` |
| `GET /robots.txt` | (auto) | Generado por `app/robots.ts` |

**Tests E2E**: 3 specs en `e2e/` (`landing.spec.ts`, `servicios.spec.ts`, `contacto.spec.ts`). El POST a `/api/contact` se mockea con `page.route` para no depender de credenciales.

**Typecheck**: limpio (`npm run typecheck` → 0 errores).

---

## 4. Estructura del repo

```
c:\GitHub\UNLIMITED_Web\
├── app/
│   ├── layout.tsx                  # next/font + TweaksProvider + boot script anti-FOUC + Vercel Analytics
│   ├── globals.css                 # ⚠️ ARCHIVO GRANDE — port del prototipo + @theme + media queries + reduced-motion
│   ├── sitemap.ts · robots.ts
│   ├── api/contact/route.ts        # Resend + Slack opcional + Upstash + honeypot
│   └── (marketing)/                # route group → Nav + Footer + Tweaks comparten layout
│       ├── layout.tsx
│       ├── page.tsx                # Landing
│       ├── servicios/page.tsx
│       └── contacto/page.tsx
├── components/
│   ├── nav.tsx · footer.tsx · marquee.tsx · big-cta.tsx · stats.tsx · wa-float.tsx
│   ├── hero.tsx · manifesto.tsx
│   ├── landing-services.tsx        # client — sticky scroll + IO observer del card activo
│   ├── servicios-list.tsx          # client — 8 botones que swappean detail card
│   ├── process-tabs.tsx            # client — auto-rotate 5s, pausa al click
│   ├── contact-form.tsx            # client — RHF + Zod + chips + progreso + success
│   ├── reveal.tsx                  # client — char-split + IO; re-corre por pathname
│   ├── cursor-blob.tsx             # client — solo desktop, no-op si reduced-motion
│   ├── smooth-scroll.tsx           # client — Lenis, no-op si reduced-motion
│   └── tweaks/
│       ├── provider.tsx            # estado + persistencia + boot script
│       └── panel.tsx               # FAB + panel flotante
├── content/
│   ├── servicios.ts                # 8 servicios tipados (la fuente para /servicios)
│   └── proceso.ts                  # 5 fases del proceso (Discovery → Mantenimiento)
├── hooks/
│   └── use-reduced-motion.ts       # SSR-safe
├── lib/
│   ├── schemas.ts                  # Zod del form de contacto (incluye honeypot `website`)
│   ├── utils.ts                    # cn(), SITE_URL, WA_NUMBER, waLink()
│   └── rate-limit.ts               # Limiter cacheado, no-op si faltan claves Upstash
├── e2e/
│   ├── landing.spec.ts · servicios.spec.ts · contacto.spec.ts
├── .github/workflows/ci.yml        # lint + typecheck + build + e2e
├── Interfaz generada con IA/       # 📌 PROTOTIPO ORIGINAL — fuente de verdad visual, NO importar
├── package.json · tsconfig.json · next.config.ts · postcss.config.mjs · .eslintrc.json
├── playwright.config.ts · vercel.json · README.md · .env.example · .gitignore
└── next-env.d.ts                   # auto-generado por Next 15 (incluye .next/types/routes.d.ts)
```

`tsconfig.json` excluye `Interfaz generada con IA/` y `e2e/` del compile. Path alias `@/*` mapea a la raíz del repo (`@/components/...`, `@/lib/...`, etc.).

---

## 5. Setup local — leer antes de tocar nada

### 5.1 Node.js — instalado de forma portable, no MSI

**Crítico**: en esta máquina (Windows 11) el MSI de Node fallaba con error 1618 (Windows Installer mutex bloqueado, sin un `msiexec` visible). Solución aplicada:

- Descargado **Node.js 22.11.0 LTS portable** (zip oficial de nodejs.org) a `%LOCALAPPDATA%\nodejs-portable\node-v22.11.0-win-x64\`.
- Añadido a la **PATH de usuario** (no de sistema) — las nuevas terminales lo ven sin más.
- `node --version` → `v22.11.0`. `npm --version` → `10.9.0`.

Si se quiere actualizar:
- Bajar el .zip nuevo de `https://nodejs.org/dist/vXX.YY.Z/node-vXX.YY.Z-win-x64.zip`.
- Reemplazar la carpeta extraída.
- O instalar con MSI cuando el mutex no esté bloqueado (reinicio suele desatascarlo).

### 5.2 Comandos

```powershell
cd c:\GitHub\UNLIMITED_Web
npm install                # 361 paquetes, ~2 min
Copy-Item .env.example .env.local
# (opcional: rellenar RESEND_API_KEY si quieres probar el envío real)
npm run dev                # http://localhost:3000
```

### 5.3 Scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Dev server con HMR |
| `npm run build` | Build de producción (output en `.next/`) |
| `npm start` | Sirve el build (necesario para Playwright) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` — usar antes de cualquier PR |
| `npm run test:e2e` | Playwright (necesita `npm run build` previo en CI) |
| `npm run test:e2e:install` | Instala chromium para Playwright |

---

## 6. Variables de entorno

Todas en `.env.example`. Resumen:

| Variable | Uso | Sin ella… |
|---|---|---|
| `RESEND_API_KEY` | Clave de Resend para envío | El endpoint loguea + devuelve éxito (útil en preview) |
| `CONTACT_TO_EMAIL` | Destinatario del form (default `hola@unlimited-systems.net` en prod) | — |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend | — |
| `SLACK_WEBHOOK_URL` | Espeja submission en Slack (fire-and-forget) | No hay mirror, no rompe nada |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Rate limit 5 req / 10 min por IP | No-op limiter, sin rate limiting |
| `NEXT_PUBLIC_WA_NUMBER` | Número WhatsApp sin `+` (default `34600000000`) | Default placeholder |
| `NEXT_PUBLIC_SITE_URL` | URL canónica para `metadataBase`, sitemap, robots. En prod = `https://unlimited-systems.net` (definida en `/opt/unlimited-web/.env.production.local` del VPS) | Default placeholder `https://unlimited.systems` |

**`NEXT_PUBLIC_*`** se exponen al cliente — usar solo para datos públicos. El resto solo viven en el server.

---

## 7. Sistema de Tweaks (no obvio)

Panel flotante esquina inferior derecha (FAB con dot ámbar + texto "Tweaks"). Permite cambiar en vivo:

- **Paleta**: `ink-sage` (default) · `bone-ink` · `forest` · `mono`
- **Modo**: oscuro / claro (toggle)
- **Tipografía**: `editorial` (default, Instrument Serif) · `modern` (Inter Tight) · `techno` (JetBrains Mono)
- **Hero**: `orbital` (default) · `grid` · `type` (variantes visuales del hero del landing)

**Cómo funciona**:

1. El estado vive en React Context (`components/tweaks/provider.tsx`) y se persiste en `localStorage` bajo la clave `unlimited.tweaks`.
2. Cada cambio escribe atributos `data-palette`, `data-theme`, `data-font`, `data-hero` en `<html>`.
3. `app/globals.css` define los tokens (`--bg`, `--fg`, `--accent`, `--f-display`, etc.) en `:root` y los **sobrescribe** dentro de selectores `[data-palette="..."]`, `[data-theme="light"]`, etc.
4. Para evitar **FOUC**, hay un script inline (`TWEAKS_BOOT_SCRIPT` en `provider.tsx`) que se ejecuta en `<head>` antes del primer paint y aplica los `data-*` desde localStorage.
5. El panel cierra con Escape, click-outside, y el FAB ignora click-outside (si no, el toggle no cerraría — tuve que añadir `fabRef` para excluirlo del handler).

**Si añades una nueva paleta o variante**:
- Define los tokens en `globals.css` bajo `[data-palette="nueva"]`.
- Añade la opción en `PALETTES` / `FONTS` / `HEROES` en `components/tweaks/panel.tsx`.
- Actualiza el `TweakState` y el tipo correspondiente en `provider.tsx`.

---

## 8. Reveals y animaciones (sutilezas)

`components/reveal.tsx` controla todas las animaciones de scroll:

- **`data-reveal`**: el elemento se oculta + slide-up; al entrar en viewport con `IntersectionObserver` (threshold 0.12), se le añade `is-in` y aparece.
- **`data-reveal-delay="1..5"`**: stagger de 80ms cada uno.
- **`data-reveal="char"`**: se aplica a títulos del hero. **Mejora respecto al prototipo**: el splitter walked text-nodes en lugar de usar `element.textContent`, así sobreviven `<br>` y `<em>` dentro del h1 (el prototipo los aplastaba silenciosamente).
- **Re-corre en cada `pathname`**: el marketing layout no se desmonta al navegar entre `/`, `/servicios`, `/contacto`, así que el effect depende de `usePathname()` para observar elementos nuevos.

**Defensivo**: `reveal-ready` se añade a `<html>` solo cuando JS confirma que está corriendo. Sin JS la página queda visible (no en blanco).

**`prefers-reduced-motion`**: en `globals.css` desactiva marquee, orbital, char-reveal, dot-live, hero-scroll-line, ag-line typewriter. `cursor-blob` y `Lenis` también respetan el flag (no-op).

---

## 9. API de contacto — comportamiento exacto

`app/api/contact/route.ts`, runtime `nodejs` (Resend SDK lo necesita), `dynamic = "force-dynamic"`.

**Flujo**:

1. Parsea el JSON. Inválido → 400.
2. Valida con `contactSchema` (Zod). Inválido → 400 con el primer mensaje.
3. **Honeypot**: si `data.website` no está vacío (un bot lo rellenó), devuelve 200 con un ref falso para no enseñarle que lo detectamos. **No se envía nada**.
4. Rate limit: `getLimiter().limit("contact:<ip>")`. Si Upstash no está configurado, el limiter siempre devuelve `success: true` (no-op). Si rebasa, 429 + `Retry-After`.
5. Genera `ref` `UNL-XXXX` (4 dígitos random).
6. Si `RESEND_API_KEY` falta → loguea por consola + devuelve `{ ok: true, ref }`. **El form parece funcionar pero no se envía nada.** Esto es intencionado para que reviewers sin secretos puedan probar el flujo end-to-end.
7. Si está → llama `resend.emails.send({ from, to, replyTo, subject, text, html })`. Error → 502.
8. `SLACK_WEBHOOK_URL` opcional: dispara fire-and-forget con el resumen. No bloquea la respuesta al usuario.
9. Devuelve `{ ok: true, ref }`.

**Para activar el envío real en producción** — dos caminos:
- **Vía Resend (camino original)**: alta de `unlimited-systems.net` en Resend, publicar SPF + DKIM en Cloudflare, meter `RESEND_API_KEY` en `/opt/unlimited-web/.env.production.local` y `systemctl restart unlimited-web`. Hasta entonces se puede usar `CONTACT_FROM_EMAIL="UNLIMITED <onboarding@resend.dev>"` (sandbox).
- **Vía Stalwart self-hosted (alternativa que aprovecha lo ya montado)**: añadir `unlimited-systems.net` como dominio adicional al Stalwart de `mail.jamonparadise.com`, generar selectores DKIM nuevos, publicar SPF/DMARC en CF, crear buzón `info@unlimited-systems.net`, y reescribir `app/api/contact/route.ts` para usar SMTP (nodemailer/MailKit) apuntando al Stalwart en `:465`. Implica cambio de código, no solo config.

---

## 10. Convenciones de código

- **No cambiar copy ni paleta sin pedir permiso al cliente** — el prototipo HTML es la fuente de verdad visual.
- **Server components por defecto**, `"use client"` solo cuando se usa state, refs, effects o navigation hooks.
- **Path alias `@/*`** siempre, nunca rutas relativas profundas (`../../components/...`).
- **CSS custom en `globals.css`** para todo lo que sea reproducible 1:1 del prototipo. Tailwind solo donde aporta (utilidades de spacing puntuales).
- **Comentarios mínimos**: solo cuando el "por qué" no se deduce del código.
- **Commits atómicos** por feature, en español o inglés (consistente).
- Datos como `servicios` y `proceso` en `content/*.ts` (tipados), no hardcodeados en componentes.

---

## 11. Operaciones cotidianas

### Modificar el catálogo de servicios

Editar `content/servicios.ts`. La página `/servicios` y la sección de stats del landing leen de aquí. Los 4 primeros servicios del landing están hardcodeados en `components/landing-services.tsx` (porque incluyen mocks visuales específicos — agente, RAG, flow, copilot).

### Cambiar el número de WhatsApp o número de oficina

`NEXT_PUBLIC_WA_NUMBER` en `.env.local` (dev) o `/opt/unlimited-web/.env.production.local` (prod, requiere rebuild — es una var pública, va al bundle de cliente). La utilidad `waLink(message)` en `lib/utils.ts` construye el deep link.

### Añadir una página nueva

Crear `app/(marketing)/nueva/page.tsx` (server component por defecto), exportar `metadata`. Heredará Nav + Footer + Tweaks del layout. Para que aparezca en el sitemap, añadirla a `app/sitemap.ts`.

### Despliegue en producción (VPS Contabo)

La web está hospedada en `root@185.213.25.188` (mismo VPS que el Stalwart mail). Topología:

```
Internet ─► Cloudflare (DNS only, gris) ─► Apache 2.4 (vhost SSL) ─► 127.0.0.1:3000 (next start, systemd)
```

Componentes:

| Item | Ubicación / nombre |
|---|---|
| Código + build | `/opt/unlimited-web/` (dueño `www-data`) |
| Env de producción | `/opt/unlimited-web/.env.production.local` (chmod 600) |
| Servicio Node | `systemctl status unlimited-web` (unit en `/etc/systemd/system/unlimited-web.service`, escucha `:3000`) |
| Vhost Apache HTTP | `/etc/apache2/sites-available/unlimited-systems.net.conf` (redirect 80→443) |
| Vhost Apache HTTPS | `/etc/apache2/sites-available/unlimited-systems.net-le-ssl.conf` (proxy a `:3000`, `X-Forwarded-Proto: https`) |
| Cert TLS | `/etc/letsencrypt/live/unlimited-systems.net/` (apex + www, auto-renueva por timer de certbot) |
| Logs Apache | `/var/log/apache2/unlimited-systems.net-{access,error}.log` |
| Logs Next.js | `journalctl -u unlimited-web -f` |
| DNS Cloudflare | A `unlimited-systems.net` y A `www` → `185.213.25.188`, ambos **DNS only (gris)**. Si se pasan a naranja (Proxied), antes poner SSL/TLS de CF en **Full (strict)**. |

**Redespliegue tras cambios de código** (desde la máquina local con SSH key ya configurada):

```powershell
# 1. Empaquetar el repo (excluye node_modules, .next, gitignored, y la carpeta del prototipo visual)
cd c:\GitHub\UNLIMITED_Web
git ls-files | grep -v "^Interfaz generada con IA/" | tar -czf /tmp/unlimited-web.tar.gz -T -

# 2. Subirlo
scp /tmp/unlimited-web.tar.gz root@185.213.25.188:/tmp/

# 3. Extraer + reinstalar deps + rebuild + restart, todo en un comando
ssh root@185.213.25.188 "cd /opt/unlimited-web && tar -xzf /tmp/unlimited-web.tar.gz && npm ci --no-audit --no-fund && npx next build --no-lint && chown -R www-data:www-data /opt/unlimited-web && systemctl restart unlimited-web && systemctl is-active unlimited-web"
```

⚠️ **El build se hace con `--no-lint`** porque `components/contact-form.tsx:119` tiene un `<a href="/">` que falla la regla `no-html-link-for-pages` y rompería el build. Cuando se corrija a `<Link>`, quitar el `--no-lint`.

**Operación rápida en el VPS**:

```bash
ssh root@185.213.25.188

# Ver estado
systemctl status unlimited-web
journalctl -u unlimited-web -n 100 --no-pager
ss -tlnp | grep :3000

# Reiniciar solo el servicio
systemctl restart unlimited-web

# Recargar Apache tras cambios de vhost (siempre con configtest antes)
apache2ctl configtest && systemctl reload apache2
```

### Lanzar tests E2E en local

```powershell
npm run build
npm run test:e2e:install      # solo la primera vez
npm run test:e2e
```

El config de Playwright arranca `npm run start` automáticamente y mockea `/api/contact` para no necesitar Resend.

---

## 12. Troubleshooting

| Síntoma | Causa probable | Fix |
|---|---|---|
| `node` no se reconoce en una terminal nueva | PATH de usuario no se ha refrescado | Cierra y reabre la terminal, o ejecuta `$env:PATH = [Environment]::GetEnvironmentVariable("PATH","User") + ";" + $env:PATH` |
| `winget install Node` falla con 1618 | Mutex de Windows Installer atascado | Reiniciar Windows, o usar la versión portable ya instalada |
| FOUC al cargar la página (paleta default 1 frame, luego se aplica la guardada) | El boot script no está corriendo antes del paint | Verificar que `<script dangerouslySetInnerHTML={{ __html: TWEAKS_BOOT_SCRIPT }} />` sigue en `<head>` de `app/layout.tsx` |
| El hero h1 sale como una línea sola sin italic | El reveal char-split está aplastando `<br>` y `<em>` | Revisar `reveal.tsx` — el splitter debe usar `walk(textNode)`, no `element.textContent` |
| Reveals no se disparan al navegar a `/servicios` desde `/` | RevealController no re-corre por pathname | El effect debe depender de `usePathname()` (ya lo hace, no rompas esta dep) |
| El form devuelve éxito pero no llega ningún email | Falta `RESEND_API_KEY` (comportamiento intencionado) | Añadir la clave en `.env.local`, reiniciar dev server |
| Resend devuelve "Domain not verified" | Dominio del `from` no está verificado en Resend | Cambiar a `onboarding@resend.dev` en `CONTACT_FROM_EMAIL` o verificar el dominio (SPF + DKIM) |
| Tailwind v4 no aplica utilidades nuevas | Cache de Next o falta el `@import "tailwindcss"` arriba del todo | `rm -rf .next && npm run dev`, y verificar `app/globals.css` línea 1 |
| `next-env.d.ts` se modifica solo | Lo regenera Next 15 con `<reference path="./.next/types/routes.d.ts" />` | Es esperado, no revertir. El comentario del archivo dice "should not be edited" — se refiere al contenido manual, las refs de Next sí se regeneran |
| El WA float aparece en todas las páginas | Solo está en `/contacto` por diseño | Si lo quieres global, mover de `app/(marketing)/contacto/page.tsx` al `(marketing)/layout.tsx` |
| Lighthouse < 95 en algún apartado | Suele ser por imágenes externas, fuentes, o el grain SVG en `body::before` | Comprobar con `npm run build && npm start` (no en dev) |
| `502 Proxy Error` en https://unlimited-systems.net | El servicio Next se cayó o no escucha en `:3000` | `ssh root@185.213.25.188 "systemctl restart unlimited-web && journalctl -u unlimited-web -n 50"` |
| Build en VPS falla con `no-html-link-for-pages` | Regla ESLint del `<a href="/">` en contact-form.tsx | Buildar con `npx next build --no-lint` (es el comando del redespliegue documentado en §11) |
| URLs de sitemap salen como `http://` en vez de `https://` | El vhost SSL no manda `X-Forwarded-Proto: https` | Verificar que `unlimited-systems.net-le-ssl.conf` tiene `RequestHeader set X-Forwarded-Proto "https"` (no "http") |
| Cert Let's Encrypt no renueva | Cron de certbot no encuentra el endpoint `/.well-known/acme-challenge/` | El vhost ya excluye esa ruta del proxy (`ProxyPass /.well-known/acme-challenge/ !`). Si renovación manual: `certbot renew --dry-run` |
| Cambio en `NEXT_PUBLIC_*` no se ve en prod tras editar `.env.production.local` | Las vars públicas se incrustan en build, no en runtime | Hay que rebuild: `npx next build --no-lint && systemctl restart unlimited-web` |

---

## 13. Roadmap pendiente

### Bloqueado por el cliente

- [ ] **Logo definitivo** — actualmente se usa el wordmark `UNLIMITED.` con punto en color accent.
- [ ] **Casos de éxito reales** — el prototipo no incluye sección de cases. **NO INVENTAR**, esperar contenido real.
- [ ] **Foto / equipo** — no hay sección de equipo todavía.
- [ ] **Textos legales** (`/aviso-legal`, `/privacidad`, `/cookies`) — los links del footer apuntan a estas rutas pero las páginas no existen. Crear stubs cuando llegue el contenido legal.
- [ ] **Verificar dominio en Resend** (o decisión de migrar a Stalwart self-hosted, ver §9). El dominio `unlimited-systems.net` ya está comprado y desplegado, pero el envío real de correo no está activo: `RESEND_API_KEY` está vacía en el `.env.production.local` del VPS y el form responde éxito sin enviar nada.
- [ ] **Número WhatsApp real** — `NEXT_PUBLIC_WA_NUMBER=34600000000` es placeholder. Cambiar en `.env.production.local` y rebuild.

### Mejoras técnicas posibles

- [ ] **Sanity Studio embebido en `/studio`** como CMS para servicios/casos (mencionado en el brief original como "fase 2"). La estructura tipada de `content/servicios.ts` ya está preparada para mapear desde Sanity.
- [ ] **Storybook** para los componentes de Tweaks (mencionado opcional en el brief).
- [ ] Convertir `Marquee` en server component con datos pasados por prop (ya está así, pero podríamos parametrizar duración / dirección).
- [ ] OG images dinámicas con `@vercel/og` para las 3 páginas.
- [ ] Habilitar `experimental.optimizePackageImports` para más libs si se añaden.
- [ ] Hook de pre-commit (Husky + lint-staged) para typecheck + lint local.

### Casi-bugs conocidos a vigilar

- El `<Field>` en `components/contact-form.tsx` para el grupo de chips de "interés" usa `htmlFor="ctInterest"` pero no hay `<input id="ctInterest">` (los chips son `<button>`s). Browsers no se quejan, pero un linter de a11y podría. Si molesta, envolver con `<fieldset>` + `<legend>`.
- El `useMemo` de `progress` en `contact-form.tsx` depende del array `watched.interest`, que tiene nueva ref en cada render — el memo no aporta. Funcional, pero sin efecto. Podría inlinearse.

---

## 14. Cosas que NO hacer

- **No editar `Interfaz generada con IA/`**. Es la fuente visual original, congelada. Si se cambia el copy, hacerlo en el .tsx correspondiente.
- **No subir `.env.local`** a git (`.gitignore` ya lo cubre).
- **No añadir `tailwind.config.js`** — Tailwind v4 lo configura todo via CSS (`@theme inline` en `globals.css`).
- **No tocar `next-env.d.ts`** (Next lo regenera).
- **No quitar `suppressHydrationWarning`** del `<html>` de `app/layout.tsx` — los tweaks que el boot script aplica antes de la hidratación causarían warnings molestos.
- **No usar `<a>` para navegación interna** — usar `<Link>` de `next/link`.
- **No mockear cosas en `components/landing-services.tsx`** que vayan a producción literal (los textos del agent mock, RAG mock, flow mock, copilot mock son ilustrativos del prototipo y deberían cambiarse a casos reales cuando se tengan).

---

## 15. Glosario rápido

- **Marketing layout** (`app/(marketing)/`): route group de Next.js — el paréntesis hace que la URL no incluya `/marketing`. Comparte Nav + Footer + Tweaks entre `/`, `/servicios`, `/contacto`.
- **Server component**: por defecto en App Router. No tiene `useState`/`useEffect`. Más rápido y SEO-friendly.
- **Client component**: lleva `"use client"` arriba. Necesario para interactividad y hooks de browser.
- **Char-reveal**: animación que muestra los caracteres de un título uno a uno con stagger.
- **Honeypot**: campo invisible (`ct-honeypot` con `position: absolute; left: -10000px`) que los bots rellenan y los humanos no ven. Si llega con valor, se descarta el envío silenciosamente.
- **`@theme inline`** (Tailwind v4): permite definir tokens del tema referenciando CSS variables existentes (en lugar de duplicar valores). Es lo que conecta `--color-bg` con `var(--bg)`.
- **Lenis**: librería de smooth scroll que reemplaza el scroll nativo del navegador con un efecto inercial. La usamos sólo si el usuario no prefiere reduced-motion.
- **`metadataBase`** en `app/layout.tsx`: URL base que Next usa para resolver paths relativos en OG images, sitemap, etc.

---

## 16. Estado de git

Working tree limpio (al cierre de la sesión 2026-05-06):

```
$ git status --short
(empty)

$ git log --oneline -5
6b037cd initial
81b1af9 Initial commit
```

Branch `main`. Sin remoto configurado todavía — habrá que `git remote add origin ...` cuando exista el repo en GitHub/GitLab.

---

## 17. Contacto y autoría

- Autor del setup: **Yago** (`yagogurru77@gmail.com`), email de git local: `ricardo.delgado`.
- Repositorio del proyecto: `c:\GitHub\UNLIMITED_Web\`.
- Prototipo original (referencia visual): `c:\GitHub\UNLIMITED_Web\Interfaz generada con IA\`.
- Documento hermano (servidor de correo, otro proyecto): `c:\GitHub\handover_mailServer.md`.
