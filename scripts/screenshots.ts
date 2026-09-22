/**
 * Genera dos capturas por proyecto: escritorio a 1440×810 (el 16/9 del visor del modal) y móvil a
 * 393×852 con perfil de iPhone 15 (tarjetas verticales y miniaturas móviles del hero).
 *
 *   npx playwright install chromium   # solo la primera vez
 *   npm run screenshots               # todos los proyectos
 *   npm run screenshots -- kish-and-go patsy   # solo esos slugs
 *
 * Por cada web: guarda public/screenshots/{slug}.webp y {slug}-mobile.webp y actualiza
 * content/projects.json con `screenshot`, `screenshotMobile` y `embeddable` (false si la web envía
 * X-Frame-Options o CSP frame-ancestors: el modal abre entonces la captura y «En vivo» va a una
 * pestaña nueva).
 *
 * Si en el JSON pones una ruta propia (p. ej. capturas reales de una app), el script no la pisa.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium, devices, type BrowserContext, type Response } from "playwright";
import type { ProjectData } from "../lib/projects";

const ROOT = process.cwd(); // npm run ejecuta desde la raíz del proyecto
const JSON_PATH = path.join(ROOT, "content/projects.json");
const OUT_DIR = path.join(ROOT, "public/screenshots");
const VIEWPORT = { width: 1440, height: 810 };
const MOBILE = { ...devices["iPhone 15"], viewport: { width: 393, height: 852 }, deviceScaleFactor: 2 };
const SETTLE_MS = 2000; // margen para animaciones de entrada y lazy-loading

// Banners de consentimiento que tapan la captura. Se ocultan con CSS (no se acepta nada).
const HIDE_CSS = `
  #shopify-pc__banner, .shopify-pc__banner__dialog { display: none !important; }
`;

function isEmbeddable(res: Response | null): boolean {
  if (!res) return true;
  const h = res.headers();
  const xfo = h["x-frame-options"]?.toLowerCase();
  if (xfo && (xfo.includes("deny") || xfo.includes("sameorigin"))) return false;
  const fa = h["content-security-policy"]
    ?.split(";")
    .map((d) => d.trim().toLowerCase())
    .find((d) => d.startsWith("frame-ancestors"));
  if (fa && !fa.split(/\s+/).slice(1).includes("*")) return false;
  return true;
}

const defaultPath = (slug: string, kind: "desktop" | "mobile") =>
  `/screenshots/${slug}${kind === "mobile" ? "-mobile" : ""}.webp`;

/** Carga la web y guarda la captura del viewport. Devuelve la respuesta del documento principal. */
async function capture(context: BrowserContext, url: string, file: string) {
  const page = await context.newPage();
  try {
    let res: Response | null;
    try {
      res = await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
    } catch {
      // Webs con conexiones persistentes nunca llegan a networkidle.
      res = await page.goto(url, { waitUntil: "load", timeout: 45_000 });
    }
    if (res && !res.ok()) throw new Error(`HTTP ${res.status()}`);
    await page.addStyleTag({ content: HIDE_CSS });
    await page.waitForTimeout(SETTLE_MS);
    // WebP: ~12× más ligero que PNG y mucho más rápido de servir por next/image.
    const png = await page.screenshot({ fullPage: false });
    await sharp(png).webp({ quality: 82 }).toFile(path.join(ROOT, "public", file));
    return res;
  } finally {
    await page.close();
  }
}

async function main() {
  const projects: ProjectData[] = JSON.parse(await readFile(JSON_PATH, "utf8"));
  const only = process.argv.slice(2);
  const targets = only.length ? projects.filter((p) => only.includes(p.slug)) : projects;
  if (only.length && targets.length !== only.length) {
    const known = new Set(projects.map((p) => p.slug));
    console.warn(`Slugs desconocidos: ${only.filter((s) => !known.has(s)).join(", ")}`);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const desktop = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    locale: "es-ES",
    colorScheme: "light",
  });
  const mobile = await browser.newContext({ ...MOBILE, locale: "es-ES", colorScheme: "light" });

  const fallos: string[] = [];
  for (const p of targets) {
    const url = `https://${p.dominio}`;
    const hechas: string[] = [];
    try {
      for (const kind of ["desktop", "mobile"] as const) {
        const key = kind === "mobile" ? "screenshotMobile" : "screenshot";
        const destino = defaultPath(p.slug, kind);
        if (p[key] && p[key] !== destino) {
          hechas.push(`${kind}: ruta propia, se conserva`);
          continue;
        }
        const res = await capture(kind === "mobile" ? mobile : desktop, url, destino);
        p[key] = destino;
        if (kind === "desktop") p.embeddable = isEmbeddable(res);
        hechas.push(kind);
      }
      console.log(`✓ ${p.slug.padEnd(18)} ${url}  [${hechas.join(", ")}]${p.embeddable === false ? "  (no embebible)" : ""}`);
    } catch (err) {
      fallos.push(p.slug);
      console.error(`✗ ${p.slug.padEnd(18)} ${url}  ${(err as Error).message.split("\n")[0]}`);
    }
  }

  await browser.close();
  await writeFile(JSON_PATH, JSON.stringify(projects, null, 2) + "\n");

  console.log(`\n${targets.length - fallos.length}/${targets.length} proyectos capturados.`);
  if (fallos.length) {
    console.log(`Fallidas (se mantiene el placeholder): ${fallos.join(", ")}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
