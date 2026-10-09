"use client";

import { useRef, useSyncExternalStore } from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

// Desfase vertical por columna: cada tarjeta se desplaza según su distancia al centro del viewport.
const PARALLAX = [22, -14, 8];

// 3 columnas desde el corte de `columns: 3 320px`; por debajo, 2 (también en móvil).
const MQ_3 = "(min-width: 1101px)";

function subscribeColumns(onChange: () => void) {
  const mql = window.matchMedia(MQ_3);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
const getColumns = () => (window.matchMedia(MQ_3).matches ? 3 : 2);

/** Alto relativo de una tarjeta (ancho = 1): imagen + barra de navegador y pie. */
const cardHeight = (ratio: string) => {
  const [w, h] = ratio.split("/").map(Number);
  return h / w + 0.37;
};

/**
 * Reparte las tarjetas por filas: cada una entra en la columna más corta, así las primeras del JSON
 * quedan arriba. En el servidor (0 columnas) se usa `columns` de CSS; el feed está bajo el hero,
 * así que el cambio tras hidratar no se ve.
 */
function distribute(projects: Project[], n: number) {
  const cols: { items: { p: Project; i: number }[]; h: number }[] = Array.from({ length: n }, () => ({
    items: [],
    h: 0,
  }));
  projects.forEach((p, i) => {
    const col = cols.reduce((min, c) => (c.h < min.h - 0.01 ? c : min), cols[0]);
    col.items.push({ p, i });
    col.h += cardHeight(p.ratio);
  });

  // Igualar columnas: intercambia tarjetas entre la más larga y la más corta mientras eso reduzca la
  // diferencia. La primera de cada columna no se mueve, para no alterar la fila de arriba.
  for (let paso = 0; paso < 20; paso++) {
    const orden = [...cols].sort((a, b) => a.h - b.h);
    const corta = orden[0];
    const larga = orden[orden.length - 1];
    const diff = larga.h - corta.h;
    let mejor: { a: number; b: number; diff: number } | null = null;
    larga.items.forEach((x, ix) => {
      if (ix === 0) return;
      const hx = cardHeight(x.p.ratio);
      corta.items.forEach((y, iy) => {
        if (iy === 0) return;
        const hy = cardHeight(y.p.ratio);
        const nuevo = Math.abs(diff - 2 * (hx - hy));
        if (nuevo < diff - 0.01 && (!mejor || nuevo < mejor.diff)) mejor = { a: ix, b: iy, diff: nuevo };
      });
    });
    if (!mejor) break;
    const { a: ix, b: iy } = mejor;
    const x = larga.items[ix];
    const y = corta.items[iy];
    larga.items[ix] = y;
    corta.items[iy] = x;
    larga.h += cardHeight(y.p.ratio) - cardHeight(x.p.ratio);
    corta.h += cardHeight(x.p.ratio) - cardHeight(y.p.ratio);
  }

  // Dentro de cada columna, mantener el orden del JSON.
  return cols.map((c) => c.items.sort((a, b) => a.i - b.i));
}

type Props = {
  projects: Project[];
  onOpen: (slug: string) => void;
  parallax?: boolean;
};

export default function ProjectFeed({ projects, onOpen, parallax = true }: Props) {
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const active = parallax && !reducedMotion;
  const columns = useSyncExternalStore(subscribeColumns, getColumns, () => 0);

  useScrollFrame(({ vh }) => {
    cards.current.forEach((el, i) => {
      if (!el) return;
      if (!active) {
        el.style.transform = "";
        return;
      }
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const centro = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translateY(${(centro * PARALLAX[i % PARALLAX.length]).toFixed(2)}px)`;
    });
  });

  const card = (p: Project, i: number) => (
    <ProjectCard
      key={p.slug}
      project={p}
      onOpen={onOpen}
      ref={(el) => {
        cards.current[i] = el;
      }}
    />
  );

  const gap = "gap-x-[clamp(18px,2.4vw,34px)] max-md:gap-x-3";
  const padding =
    "px-gutter pt-[clamp(30px,4vw,56px)] pb-[clamp(60px,8vw,110px)]";

  if (columns === 0) {
    return (
      <section className={`columns-2 min-[1101px]:columns-3 ${gap} ${padding}`}>
        {projects.map(card)}
      </section>
    );
  }

  return (
    <section className={`flex items-start ${gap} ${padding}`}>
      {distribute(projects, columns).map((col, c) => (
        <div key={c} className="flex min-w-0 flex-1 flex-col">
          {col.map(({ p, i }) => card(p, i))}
        </div>
      ))}
    </section>
  );
}
