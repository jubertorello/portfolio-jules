# Handoff: Portfolio de Jules — desarrollo web freelance

## Overview
Landing de portfolio de una sola página para **Jules**, desarrolladora freelance (webs, tiendas Shopify, apps/automatizaciones e invitaciones digitales). Estructura: hero animado por scroll con collage de miniaturas → intro «Sobre mí» → feed de proyectos filtrable en columnas tipo masonry → modal de detalle con **preview en vivo de la web real dentro de un marco de navegador** → footer de contacto. Tema claro/oscuro conmutable, cursor personalizado y parallax de ratón y scroll.

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML** — prototipos que muestran el aspecto y el comportamiento buscados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno del codebase destino** (React/Next.js, Astro, Vue, etc.) siguiendo sus patrones y librerías establecidas. Si todavía no hay codebase, la recomendación para este proyecto es **Next.js (App Router) + Tailwind**, porque el sitio es estático con una sola pieza de estado cliente (filtro + modal) y se beneficia de `next/image` para las capturas.

Nota técnica sobre el formato: `Portfolio v3.dc.html` está escrito con un runtime de plantillas propio (`<x-dc>`, `{{ hole }}`, `<sc-for>`, `<sc-if>`, `<image-slot>` y una clase `Component extends DCLogic`). Léelo como pseudo-JSX: `<sc-for list as>` ≈ `.map()`, `<sc-if value>` ≈ render condicional, `{{ x }}` ≈ `{x}`, y el método `renderVals()` ≈ el cuerpo de un componente antes del `return`. `<image-slot>` es un placeholder de imagen del entorno de prototipado: en producción es un `<img>`/`next/image` normal.

## Fidelity
**Alta fidelidad (hifi).** Colores, tipografías, escalas, radios, sombras, duraciones y easings son definitivos y están listados abajo; recréalos con precisión. Lo único deliberadamente provisional:
- Las **capturas de los proyectos** son huecos vacíos (`image-slot`) salvo las dos del panel de Mariu & Nacho, incluidas en `uploads/`.
- **Datos de contacto de relleno**: `hola@byjules.dev`, `+34 600 00 00 00`, y los enlaces sociales (Instagram/LinkedIn/GitHub) apuntan a `#`. Sustituir por los reales.

---

## Screens / Views

### 1. Header fijo
- **Propósito**: identidad + acceso a menú y conmutador de tema.
- **Layout**: `position:fixed; top:0; left:0; right:0; z-index:80`, `display:flex; align-items:center; justify-content:space-between; gap:24px`, padding `20px clamp(18px,4vw,56px)`, `border-bottom:1px solid transparent` (pasa a `var(--line)` al hacer scroll).
- **Componentes**:
  - Logotipo: `<a href="#top">` flex `align-items:baseline; gap:11px`. «by Jules» en Cormorant 300, 28px, `letter-spacing:-0.01em`. Al lado, «Desarrollo web freelance» en Schibsted Grotesk 18px, `letter-spacing:1px`, `text-transform:uppercase`, color `--muted`.
  - Conmutador de tema: botón circular 34×34, `border:1px solid var(--line-strong)`, fondo `linear-gradient(90deg, var(--fg) 0 50%, transparent 50% 100%)` (media luna). Al pulsar, rota 180° (`transform 0.55s cubic-bezier(0.2,0.7,0.3,1)`) y cambia `html[data-theme]`.
  - Botón de menú: 34×34, dos líneas de 1px (`gap:5px`) en `var(--fg)`.
- **Comportamiento**: al bajar, el header se oculta (`transform:translateY(-100%)`, `transition 1s cubic-bezier(0.16,0.84,0.24,1)`); al subir reaparece con fondo `--nav-bg` + `backdrop-filter:blur()`.

### 2. Hero (`#top`)
- **Propósito**: primera impresión; el título crece al primer scroll.
- **Layout**: `height:100vh; min-height:480px; overflow:hidden`, flex centrado.
- **Título** `h1`: Cormorant 300, texto «Mi Portfolio», `line-height:0.9`, `letter-spacing:-0.02em`, `white-space:nowrap`. Arranca en **75px con `opacity:0`** y, al primer evento de scroll, pasa a `font-size: min(12.2vw, 232px)` y `opacity:1`. Transición ease-out ~0,8–1,15s.
- **Collage**: contenedor absoluto `left:0; right:0; top:0; bottom:clamp(96px,15vh,130px)`, `pointer-events:none` (cada miniatura reactiva el puntero). Seis miniaturas `position:absolute`, `border-radius:6px`, `object-fit:cover`, estado inicial `opacity:0.22; transform:translateY(26px)`:

  | # | Proyecto | Posición | Tamaño | z-index |
  |---|---|---|---|---|
  | 1 | All in Sports | `top:12%; left:3%` | 196×148 | 3 |
  | 2 | UNRATED | `bottom:7%; left:3%` | 170×190 | 3 |
  | 3 | Andrea Sartori | `top:14%; right:5%` | 206×146 | 1 |
  | 4 | Kish&Go | `top:16%; left:32%` | 150×118 | — |
  | 5 | Oma by Luchi | `bottom:7%; right:31%` | 184×138 | — |
  | 6 | F.A.R.O | `bottom:10%; right:7%` | 158×120 | — |

  La banda central queda libre a propósito: es donde crece el título.
- **Interacción**: parallax de ratón (título y fotos siguen al cursor con profundidad distinta) + parallax de scroll (título a velocidad 0,46; fotos 0,07–0,13). Al pasar sobre una miniatura: `scale(1.28)` y las demás `scale(0.84)` con menos opacidad.
- **Descriptor**: abajo a la izquierda, «Desarrollo web & producto digital», Schibsted Grotesk 18px, uppercase, `letter-spacing:1px`, color `--muted`. Indicador «SCROLL DOWN ↘» que se desvanece al bajar.

### 3. Intro «Sobre mí» (`#overview`)
- **Layout**: grid `minmax(0,0.28fr) minmax(0,0.72fr)`, `gap:clamp(24px,5vw,72px)`, `align-items:start`, padding `clamp(64px,11vw,160px) clamp(18px,4vw,56px)`.
- **Contenido**: etiqueta «Sobre mí» (Schibsted 18px uppercase, `--muted`) + párrafo en Cormorant 300, `clamp(28px,3.6vw,56px)`, `line-height:1.22`, `letter-spacing:-0.02em`, `max-width:34ch`, `text-wrap:pretty`:
  > Soy Jules, desarrolladora freelance. Diseño y programo webs, tiendas, aplicaciones y automatizaciones *a medida*.

  «a medida» en cursiva y color `--accent`.
- Ambos elementos entran con reveal hacia arriba al aparecer en viewport.

### 4. Barra de filtros (`#trabajo`)
- **Layout**: `position:sticky; top:0; z-index:40`, flex con `justify-content:space-between`, `gap:18px`, padding `18px clamp(18px,4vw,56px)`, `border-bottom:1px solid var(--line)`, fondo `rgba(245,241,233,0.93)` + `backdrop-filter:blur(10px)`.
- **Chips**: `Todo · Webs · Tiendas · Apps · Invitaciones`. Base: `padding:9px 17px; border-radius:999px`, Schibsted 18px, `letter-spacing:1px`, uppercase. Activo: fondo `--fg`, texto `--bg`. Inactivo: borde `--line`, texto `--muted`.
- **Contador**: «{n} proyectos» a la derecha, Schibsted 18px uppercase `--muted`.

### 5. Feed de proyectos (masonry)
- **Layout**: `columns:3 320px; column-gap:clamp(18px,2.4vw,34px)`, padding `clamp(30px,4vw,56px) clamp(18px,4vw,56px) clamp(60px,8vw,110px)`. Cada tarjeta `break-inside:avoid; display:inline-block; width:100%; margin-bottom:clamp(20px,2.6vw,38px)`.
- **Tarjeta**: `border-radius:12px; overflow:hidden`, fondo `--panel`, `border:1px solid var(--line-soft)`, sombra `0 1px 2px rgba(27,25,23,0.05), 0 22px 40px -28px rgba(27,25,23,0.35)`.
  - *Chrome de navegador*: fila con tres puntos de 7px (`--dot`) + pill con el dominio (`--pill`, JetBrains Mono 11px, `--muted`, elipsis), fondo `--chrome`, `border-bottom:1px solid var(--line-soft)`.
  - *Imagen*: `aspect-ratio` variable por proyecto (rota entre 4/3, 16/10, 1/1, 3/4 — ver `ratio` en el código), `object-fit:cover`. En hover, zoom interno `transform 1.1s cubic-bezier(0.16,0.84,0.24,1)`.
  - *Pie*: nombre (Cormorant 300, 28px) y año (Schibsted 10.5px, `letter-spacing:0.12em`, `--muted`) en la misma línea; debajo tipo (13.5px, `--dim`) y stack (Schibsted 10.5px, `--faint`).
- **Hover de tarjeta**: elevación + sombra más profunda, `transition 0.9–1s cubic-bezier(0.16,0.84,0.24,1)`. El cursor personalizado crece y muestra una etiqueta.
- **Click**: abre el modal de detalle.

### 6. Modal de detalle
- **Overlay**: `position:fixed; inset:0; z-index:100`, `background:rgba(20,18,16,0.66)`, `backdrop-filter:blur(7px)`, centrado, padding `clamp(14px,4vw,52px)`, animación `fade 0.22s ease`.
- **Panel**: `width:min(1080px,100%)`, `max-height:100%; overflow:auto`, fondo `--bg`, `border-radius:14px`, sombra `0 40px 90px -30px rgba(0,0,0,0.5)`, animación `pop 0.32s cubic-bezier(0.2,0.7,0.3,1)` (desde `translateY(24px) scale(0.985)`).
- **Cerrar**: botón circular 34×34 en `top:16px; right:16px; z-index:2`, borde `--line`, fondo `rgba(253,251,247,0.92)`.
- **Chrome + conmutador de vista**: misma fila de tres puntos + pill de dominio; a la derecha, grupo «En vivo / Captura» con `margin-right:46px` **para no solaparse con el botón de cerrar** (defecto ya corregido: reservar la esquina). Botones: `padding:5px 13px; border-radius:999px`, Schibsted 11px uppercase `letter-spacing:0.1em`; activo con fondo `--fg` y texto `--bg`, inactivo con borde `--line` y texto `--muted`; `transition:all 0.3s ease`.
- **Visor** (`aspect-ratio:16/9; overflow:hidden; background:var(--panel)`):
  - Modo **En vivo** (por defecto): `<iframe>` con `src` = la URL del proyecto, renderizado a **1440×810 px** y escalado con `transform:scale(--vscale)` / `transform-origin:top left`, donde `--vscale = contenedor.clientWidth / 1440` (recalculado con `ResizeObserver`). `loading="lazy"`, `sandbox="allow-scripts allow-same-origin allow-popups"`.
  - **Fallback de bloqueo**: si el `onLoad` del iframe no llega en **5000 ms**, se superpone un aviso a pantalla completa del visor (fondo `--panel`, centrado): «Esta web no permite incrustarse» (Cormorant 24px) + «Ábrela en una pestaña nueva o mira la captura» (Schibsted 12px, `--muted`). Motivo real: `X-Frame-Options` / `frame-ancestors`. En un backend propio conviene sustituir esto por capturas generadas en build (p. ej. Playwright) y usar el iframe solo donde se sepa que funciona.
  - Modo **Captura**: imagen estática del proyecto.
- **Capturas extra** (solo proyectos con `hasExtra`): bloque con rótulo uppercase 11px `letter-spacing:0.14em` `--muted` y grid `repeat(auto-fit, minmax(220px,1fr)); gap:12px` de imágenes `border:1px solid var(--line-soft); border-radius:4px; object-position:top`. Hoy lo usa **Mariu & Nacho**: «Panel de control privado: confirmaciones, autobús, dietas y export a Excel» con las dos imágenes de `uploads/`.
- **Cuerpo**: grid `repeat(auto-fit,minmax(min(100%,280px),1fr))`, `gap:clamp(22px,3vw,44px)`, padding `clamp(24px,3.4vw,40px)`. Columna izquierda: tipo (Schibsted 18px uppercase `--accent`), nombre (Cormorant 300 `clamp(34px,3.8vw,54px)`), descripción (15.5px, `line-height:1.7`, `--dim`) y botón pill «ver web» (`padding:13px 24px; border-radius:999px`). Columna derecha: lista Cliente / Tipo / Año / Stack, cada fila `justify-content:space-between` con `border-bottom:1px solid var(--line-soft)` salvo la última.
- **Cierre**: click en overlay, click en ×, o tecla `Escape`.

### 7. Menú a pantalla completa
`position:fixed; inset:0; z-index:99`, fondo `--bg`, flex columna centrada, padding `0 clamp(18px,4vw,56px)`. Entra con `opacity` (`transition 0.9s cubic-bezier(0.16,0.84,0.24,1)`) y `pointer-events` conmutado. Enlaces «Trabajo» y «Contacto» en Cormorant 300 `clamp(44px,9vw,110px)`, `line-height:1.05`, `letter-spacing:-0.03em`; debajo el email en Schibsted 18px uppercase `--muted`. Botón × en `top:22px; right:clamp(18px,4vw,56px)`.

### 8. Footer (`#contacto`)
Padding `clamp(56px,8vw,120px) clamp(18px,4vw,56px) 44px`, `border-top:1px solid var(--line)`. Grid `repeat(auto-fit,minmax(min(100%,240px),1fr))`, `gap:clamp(24px,4vw,60px)`, `align-items:end`. Tres columnas: «Escríbeme» (email en `--accent` con `border-bottom:1px solid var(--accent-line)` + teléfono), «Dónde encontrarme» (Instagram / LinkedIn / GitHub, subrayado `--line-strong`), y «© 2026 by Jules» (Schibsted 10px, `letter-spacing:0.1em`, `--faint`).

### 9. Elementos globales
- **Barra de progreso de scroll**: `position:fixed; top:0; height:2px`, ancho = % leído, color `--accent`, `z-index:90`.
- **Cursor personalizado**: punto de 6px (`--fg`, `z-index:96`) + círculo de 46px con borde 1px (`z-index:95`) que sigue al ratón con retardo y crece mostrando texto sobre elementos interactivos. Desactivable por prop; ocultar en dispositivos touch / `prefers-reduced-motion`.

---

## Interactions & Behavior
- **Scroll**: primer scroll dispara el crecimiento del título; parallax por capas; header oculto al bajar / visible al subir; reveals `[data-reveal="up"]` al entrar en viewport.
- **Ratón**: parallax de hero; hover de miniaturas (1.28 / 0.84); hover de tarjetas (elevación + zoom interno); cursor personalizado.
- **Tema**: `html[data-theme="light"|"dark"]`; persistir la elección en `localStorage` e inicializar desde `prefers-color-scheme`. Todas las propiedades de color transicionan en 0,45s ease.
- **Filtro**: cambia la lista sin recargar; «Todo» muestra los 11.
- **Modal**: abrir por click en tarjeta, cerrar por overlay/×/Escape; el timeout de 5s de detección de bloqueo se limpia al cerrar.
- **Responsive**: el grid pasa de 3 a 1 columna por `columns:3 320px`; los paddings usan `clamp()`. El hero mantiene `100vh` con `min-height:480px`; en móvil conviene reducir el número de miniaturas del collage y desactivar el parallax de ratón.
- **Accesibilidad**: respetar `prefers-reduced-motion` (desactivar parallax, crecimiento del título y cursor); contraste ya verificado en ambos temas; `aria-label` en los botones de icono.

## State Management
Todo el estado vive en el componente raíz:
- `filtro: string` — chip activo (`"Todo"` por defecto).
- `sel: string | null` — id del proyecto abierto en el modal.
- `vista: "vivo" | "captura"` — modo del visor (`"vivo"` por defecto).
- `frameOk: boolean` — el iframe disparó `onLoad`.
- `bloqueada: boolean` — se activa si a los 5000 ms `frameOk` sigue en `false`.
- Refs/efectos: `ResizeObserver` sobre el contenedor del visor para `--vscale`; listeners de `scroll`, `mousemove`, `keydown` (Escape); `IntersectionObserver` para los reveals.
Sin data fetching: el array de proyectos es estático (candidato a JSON/CMS o `content/projects.json`).

## Design Tokens

**Colores — claro** (`:root, html[data-theme="light"]`)
`--bg:#F4F1E9` · `--fg:#1E1E1E` · `--panel:#FBF8F1` · `--chrome:#EFEBE2` · `--pill:#E6E1D6` · `--accent:#3E7FA6` · `--accent-line:rgba(62,127,166,0.45)` · `--muted:#8C8578` · `--dim:#5A554C` · `--faint:#A79F94` · `--line:rgba(30,30,30,0.12)` · `--line-soft:rgba(30,30,30,0.09)` · `--line-strong:rgba(30,30,30,0.2)` · `--dot:rgba(30,30,30,0.16)` · `--nav-bg:rgba(244,241,233,0.9)` · `--inv-dim:rgba(244,241,233,0.7)`

**Colores — oscuro** (`html[data-theme="dark"]`)
`--bg:#1E1E1E` · `--fg:#F4F1E9` · `--panel:#252523` · `--chrome:#2B2A28` · `--pill:#343230` · `--accent:#7FC0DE` · `--accent-line:rgba(127,192,222,0.5)` · `--muted:#8F8880` · `--dim:#A9A29A` · `--faint:#726C65` · `--line:rgba(244,241,233,0.14)` · `--line-soft:rgba(244,241,233,0.1)` · `--line-strong:rgba(244,241,233,0.24)` · `--dot:rgba(244,241,233,0.18)` · `--nav-bg:rgba(30,30,30,0.9)`

Otros: overlay del modal `rgba(20,18,16,0.66)`; fondo de la barra sticky `rgba(245,241,233,0.93)`; `::selection` `#BFE1F2`.

**Tipografía**
- Títulos y texto expresivo: **Cormorant** (Google Fonts), weight 300, itálica para énfasis. Escalas: 28px (nombre de tarjeta / logo), `clamp(28px,3.6vw,56px)` (intro), `clamp(34px,3.8vw,54px)` (título del modal), `clamp(44px,9vw,110px)` (menú), `min(12.2vw,232px)` (hero).
- Cuerpo e interfaz: **Schibsted Grotesk** (fallback `system-ui, sans-serif`). Escalas: 18px uppercase `letter-spacing:1px` (etiquetas), 15.5px / 15px / 14px / 13.5px (texto), 11px `letter-spacing:0.1em` y 10.5px `letter-spacing:0.12em` (metadatos), 10px `letter-spacing:0.1em` (copyright).
- Monoespaciada: **JetBrains Mono**, 11–12px, solo en las pills de dominio.

**Espaciado**: escala fluida con `clamp()` — horizontal de sección `clamp(18px,4vw,56px)`; vertical `clamp(56px,8vw,120px)` y `clamp(64px,11vw,160px)`; gaps 6 / 8 / 12 / 14 / 16 / 18 / 24 / `clamp(22px,3vw,44px)`.

**Radios**: 4px (capturas extra), 6px (miniaturas del hero), 12px (tarjeta), 14px (panel del modal), 999px (pills y botones), 50% (circulares).

**Sombras**: tarjeta `0 1px 2px rgba(27,25,23,0.05), 0 22px 40px -28px rgba(27,25,23,0.35)`; modal `0 40px 90px -30px rgba(0,0,0,0.5)`.

**Movimiento**: easing principal `cubic-bezier(0.16,0.84,0.24,1)` (0,8–1,15s en hovers y reveals); `cubic-bezier(0.2,0.7,0.3,1)` para pop del modal y giro del conmutador; `ease` 0,45s para transiciones de color; `0.22s ease` para el fade del overlay. Keyframes: `bob` (indicador de scroll), `fade`, `pop`.

## Assets
- `uploads/pasted-1789638015057-0.png` — 2940×1592, panel de control de confirmaciones de Mariu & Nacho.
- `uploads/pasted-1789638046135-0.png` — 1194×1222, modal de detalle de una confirmación.
- **Capturas de los 11 proyectos: pendientes.** En el prototipo son huecos vacíos. Recomendación: generarlas en build con Playwright a 1440×900 (o 1440×810 para respetar el 16/9 del visor) y servirlas por `next/image`.
- Fuentes: Cormorant, Schibsted Grotesk y JetBrains Mono desde Google Fonts. Sin iconografía externa (los iconos son formas CSS).

## Proyectos (datos reales)
Campos: `cliente, tipo, cat, stack, anio, dominio, desc` (+ `extra` y capturas adicionales en Mariu & Nacho). `url = "https://" + dominio`.

| Cliente | Tipo | Cat | Dominio |
|---|---|---|---|
| All in Sports Group | Web corporativa | Webs | allinsports.group |
| UNRATED | Web de agencia creativa | Webs | unratedagency.com |
| Andrea Sartori Inmobiliaria | Web inmobiliaria | Webs | andreasartoriinmobiliaria.com |
| Kish&Go | Tienda Shopify | Tiendas | kishandgo.com |
| Oma by Luchi | Tienda Shopify | Tiendas | omabyluchi.com |
| F.A.R.O | App de planificación personal | Apps | planificadorfaro.com |
| Éter | Web de bar de cócteles | Webs | eter-bar.vercel.app |
| Jarana | Web de eventos | Webs | jaranaparatodos.com |
| Twenty4 Studios | Web de estudio creativo | Webs | twenty4studios.com |
| Patsy | Tienda Shopify | Tiendas | patsy.shoes |
| Mariu & Nacho | Invitación digital de boda | Invitaciones | mariu-y-nacho.vercel.app |

Los textos descriptivos exactos de cada proyecto están en el array del final de `Portfolio v3.dc.html` (dentro de `renderVals()`); cópialos literalmente.

## Files
- `Portfolio v3.dc.html` — **diseño final, la referencia a implementar.**
- `Portfolio v2.dc.html` — iteración anterior conservada como respaldo (hero y collage distintos). Solo contexto.
- `image-slot.js` — web component de placeholder de imagen usado por los prototipos; **no se lleva a producción**.
- `support.js` — runtime del entorno de prototipado; **no se lleva a producción**.
- `uploads/` — las dos capturas reales del panel de administración.

Para abrir los prototipos basta servir la carpeta con un servidor estático (`npx serve .`) y abrir `Portfolio v3.dc.html`.
