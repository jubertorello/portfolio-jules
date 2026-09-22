"use client";

import type { Ref } from "react";
import { useCursorLabel } from "@/hooks/useCursorLabel";
import type { Project } from "@/lib/projects";
import BrowserChrome from "./BrowserChrome";
import ProjectShot from "./ProjectShot";

type Props = {
  project: Project;
  onOpen: (slug: string) => void;
  ref?: Ref<HTMLButtonElement>;
};

export default function ProjectCard({ project: p, onOpen, ref }: Props) {
  const setCursor = useCursorLabel();

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => {
        setCursor(null);
        onOpen(p.slug);
      }}
      onMouseEnter={() => setCursor("Ver ficha")}
      onMouseLeave={() => setCursor(null)}
      aria-label={`Ver ficha de ${p.cliente}`}
      className="group mb-[clamp(20px,2.6vw,38px)] max-md:mb-6 inline-block w-full cursor-pointer break-inside-avoid border-0 bg-transparent p-0 text-left text-fg will-change-transform focus-visible:outline-none"
    >
      <span className="block overflow-hidden rounded-card border border-line-soft bg-panel shadow-card [transition:box-shadow_0.9s_var(--ease-soft),translate_1s_var(--ease-soft),background-color_0.45s,border-color_0.45s] group-hover:-translate-y-2 group-hover:shadow-card-hover group-focus-visible:-translate-y-2 group-focus-visible:shadow-card-hover group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-accent">
        <BrowserChrome dominio={p.dominio} />
        <span className="relative block overflow-hidden" style={{ aspectRatio: p.ratio }}>
          <span className="absolute inset-0 block transition-transform duration-1100 ease-soft group-hover:scale-105">
            <ProjectShot
              project={p}
              variant={p.formato === "vertical" ? "mobile" : "desktop"}
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            />
          </span>
        </span>
      </span>
      <span className="flex flex-col gap-1.5 px-0.5 pt-[15px] max-md:gap-1 max-md:pt-2.5">
        <span className="flex items-baseline justify-between gap-3 max-md:flex-col max-md:gap-0.5">
          <span className="font-display text-[28px] leading-tight font-light tracking-[-0.015em] max-md:text-[21px]">
            {p.cliente}
          </span>
          <span className="font-sans text-[10.5px] tracking-[0.12em] text-muted">{p.anio}</span>
        </span>
        <span className="text-[13.5px] text-dim max-md:text-xs">{p.tipo}</span>
        <span className="font-sans text-[10.5px] tracking-[0.05em] text-faint">{p.stack}</span>
      </span>
    </button>
  );
}
