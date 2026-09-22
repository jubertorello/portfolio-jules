import data from "@/content/projects.json";

export const CATEGORIAS = ["Todo", "Webs", "Tiendas", "Apps", "Invitaciones"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export type ExtraImage = { src: string; alt: string; width: number; height: number };

export type ProjectData = {
  slug: string;
  cliente: string;
  tipo: string;
  cat: Exclude<Categoria, "Todo">;
  stack: string;
  anio: string;
  dominio: string;
  desc: string;
  /** Formato de la tarjeta: horizontal usa la captura de escritorio; vertical, la de móvil. */
  formato: "horizontal" | "vertical";
  /** Ruta pública de la captura de escritorio (1440×810). La rellena `npm run screenshots`. */
  screenshot?: string;
  /** Ruta pública de la captura de móvil (393×852). La rellena `npm run screenshots` salvo que sea una ruta propia. */
  screenshotMobile?: string;
  /** `false` si la web envía X-Frame-Options / frame-ancestors. Lo detecta `npm run screenshots`. */
  embeddable?: boolean;
  extra?: string;
  extraImages?: ExtraImage[];
};

export type Project = ProjectData & { url: string; ratio: string };

// Horizontal = mismo 16/9 que la captura de escritorio (sin recorte). Vertical = 3/4 sobre la captura
// móvil, que solo se recorta por abajo. Sin cuadradas.
const RATIO_H = "16/9";
const RATIO_V = "3/4";

export function getProjects(): Project[] {
  return (data as ProjectData[]).map((p) => ({
    ...p,
    url: `https://${p.dominio}`,
    ratio: p.formato === "vertical" ? RATIO_V : RATIO_H,
  }));
}
