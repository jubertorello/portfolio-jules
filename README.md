# by Jules — Portfolio

Portfolio de una sola página de Jules, desarrolladora web freelance: webs, tiendas Shopify, apps e invitaciones digitales.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Playwright (capturas).

## Desarrollo

```bash
npm install
npm run dev
```

## Proyectos

Los proyectos viven en [`content/projects.json`](content/projects.json). El orden del JSON es el orden del feed (los tres primeros forman la fila de arriba). Campos principales:

- `formato`: `horizontal` (captura de escritorio, 16/9) o `vertical` (captura de móvil, 3/4).
- `screenshot` / `screenshotMobile`: rutas en `public/screenshots/`. Si pones una ruta propia, el script de capturas no la pisa.
- `embeddable`: `false` si la web prohíbe incrustarse; entonces la ficha abre en «Captura» y «En vivo ↗» abre la web en una pestaña nueva.
- `extra` / `extraImages`: bloque de capturas adicionales en la ficha.

## Capturas

```bash
npx playwright install chromium   # solo la primera vez
npm run screenshots               # todos los proyectos
npm run screenshots -- patsy      # solo esos slugs
```

Genera una captura de escritorio (1440×810) y otra de móvil (393×852) por proyecto en WebP, y actualiza `screenshot`, `screenshotMobile` y `embeddable` en el JSON.

## Diseño

El handoff de diseño original (tokens, tipografías, comportamiento) está en [`docs/handoff-diseno.md`](docs/handoff-diseno.md).
