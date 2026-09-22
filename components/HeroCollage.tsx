import type { CSSProperties, RefObject } from "react";
import type { Project } from "@/lib/projects";
import ProjectShot from "./ProjectShot";

type Thumb = {
  slug: string;
  /** `mobile` = captura de móvil en vertical; `desktop` = captura de escritorio en 16/10. */
  variant: "desktop" | "mobile";
  pos: CSSProperties;
  w: number;
  h: number;
  z: number;
  /** Collage de escritorio (≥768px) o de móvil, cada uno con su propia composición. */
  only: "desktop" | "mobile";
};

// Escritorio: un proyecto por miniatura, tamaños en px a 1440 de ancho que escalan con el viewport (--u).
// Las de escritorio van en 16/9 aprox. y las de móvil en ~1/2 para no recortar las capturas.
// La banda central queda libre: ahí crece el título.
const D = "desktop" as const;
const M = "mobile" as const;
const THUMBS: Thumb[] = [
  // Fila superior
  { only: D, slug: "all-in-sports", variant: D, pos: { top: "12%", left: "3%" }, w: 196, h: 122, z: 3 },
  { only: D, slug: "eter", variant: M, pos: { top: "20%", left: "19.5%" }, w: 84, h: 172, z: 2 },
  { only: D, slug: "kish-and-go", variant: D, pos: { top: "16%", left: "32%" }, w: 150, h: 94, z: 1 },
  { only: D, slug: "mariu-y-nacho", variant: M, pos: { top: "9%", left: "53%" }, w: 86, h: 176, z: 2 },
  { only: D, slug: "patsy", variant: D, pos: { top: "22%", right: "21%" }, w: 168, h: 105, z: 1 },
  { only: D, slug: "andrea-sartori", variant: D, pos: { top: "14%", right: "5%" }, w: 206, h: 129, z: 1 },
  // Fila inferior
  { only: D, slug: "unrated", variant: M, pos: { bottom: "7%", left: "4%" }, w: 92, h: 190, z: 3 },
  { only: D, slug: "jarana", variant: D, pos: { bottom: "11%", left: "17%" }, w: 184, h: 115, z: 3 },
  { only: D, slug: "twenty4-studios", variant: M, pos: { bottom: "5%", left: "37%" }, w: 84, h: 172, z: 2 },
  { only: D, slug: "oma-by-luchi", variant: D, pos: { bottom: "7%", right: "31%" }, w: 184, h: 115, z: 3 },
  { only: D, slug: "volver-a-casa", variant: M, pos: { bottom: "14%", right: "19.5%" }, w: 84, h: 172, z: 2 },
  { only: D, slug: "faro", variant: M, pos: { bottom: "9%", right: "8%" }, w: 90, h: 186, z: 3 },

  // Móvil (px reales a 375 de ancho): tres arriba y cuatro abajo del título en dos líneas.
  { only: M, slug: "all-in-sports", variant: D, pos: { top: "11%", left: "4%" }, w: 148, h: 83, z: 3 },
  { only: M, slug: "kish-and-go", variant: D, pos: { top: "26%", left: "24%" }, w: 144, h: 81, z: 2 },
  { only: M, slug: "mariu-y-nacho", variant: M, pos: { top: "10%", right: "5%" }, w: 68, h: 148, z: 3 },
  { only: M, slug: "unrated", variant: M, pos: { bottom: "6%", left: "5%" }, w: 66, h: 144, z: 3 },
  { only: M, slug: "oma-by-luchi", variant: D, pos: { bottom: "17.5%", left: "31%" }, w: 144, h: 81, z: 2 },
  { only: M, slug: "patsy", variant: D, pos: { bottom: "2%", left: "31%" }, w: 144, h: 81, z: 3 },
  { only: M, slug: "faro", variant: M, pos: { bottom: "5%", right: "5%" }, w: 68, h: 148, z: 3 },
];

/** Profundidad de parallax de cada miniatura (ratón y scroll). */
export const THUMB_DEPTHS = [1, 0.85, 0.75, 1.3, 0.6, 1.5, 0.55, 1.15, 0.9, 1.25, 0.7, 0.4, 1, 0.6, 1.3, 0.8, 0.5, 1.2, 0.9];

type Props = {
  projects: Project[];
  thumbRefs: RefObject<(HTMLDivElement | null)[]>;
  onEnter: (i: number) => void;
  onLeave: (i: number) => void;
};

export default function HeroCollage({ projects, thumbRefs, onEnter, onLeave }: Props) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 bottom-[clamp(96px,15vh,130px)] [--u:min(1px,calc(100vw/1440))] max-md:[--u:1px]"
    >
      {THUMBS.map((t, i) => {
        const project = projects.find((p) => p.slug === t.slug);
        if (!project) return null;
        return (
          <div
            key={`${t.only}-${t.slug}`}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            data-z={t.z}
            onMouseEnter={() => onEnter(i)}
            onMouseLeave={() => onLeave(i)}
            className={`pointer-events-auto absolute overflow-hidden rounded-thumb opacity-[0.22] ${
              t.only === "desktop" ? "max-md:hidden" : "md:hidden"
            }`}
            style={{
              ...t.pos,
              zIndex: t.z,
              transform: "translateY(26px)",
              width: `calc(var(--u) * ${t.w})`,
              height: `calc(var(--u) * ${t.h})`,
            }}
          >
            <ProjectShot project={project} variant={t.variant} sizes={`${t.w}px`} />
          </div>
        );
      })}
    </div>
  );
}
