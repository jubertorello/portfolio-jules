"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Project } from "@/lib/projects";
import BrowserChrome from "./BrowserChrome";
import LiveViewer, { type Vista } from "./LiveViewer";

type Props = {
  project: Project;
  vista: Vista;
  onVista: (v: Vista) => void;
  onClose: () => void;
};

const toggleBtn = (on: boolean) =>
  `cursor-pointer rounded-full border px-[13px] py-[5px] font-sans text-[11px] tracking-[0.1em] uppercase transition-all duration-300 ease-[ease] ${
    on ? "border-transparent bg-fg text-bg" : "border-line bg-transparent text-muted hover:text-fg"
  }`;

export default function ProjectModal({ project: p, vista, onVista, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // Si la web prohíbe incrustarse, el visor muestra la captura y «En vivo» abre una pestaña nueva.
  const embebible = p.embeddable !== false;
  const vistaEfectiva: Vista = embebible ? vista : "captura";
  const extraVertical = p.extraImages?.every((img) => img.height > img.width) ?? false;

  // Foco al abrir y devolución del foco al cerrar.
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus({ preventScroll: true });
    return () => previo?.focus({ preventScroll: true });
  }, []);

  const filas: [string, string][] = [
    ["Cliente", p.cliente],
    ["Tipo", p.tipo],
    ["Año", p.anio],
    ["Stack", p.stack],
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-100 flex animate-fade items-center justify-center bg-overlay p-[clamp(14px,4vw,52px)] backdrop-blur-[7px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-full w-[min(1080px,100%)] animate-pop overflow-auto rounded-modal bg-bg shadow-modal"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar ficha"
          className="absolute top-4 right-4 z-2 size-[34px] cursor-pointer rounded-full border border-line bg-close-bg text-[15px] leading-none text-fg"
        >
          ×
        </button>

        <div className="border-b border-line-soft bg-panel">
          <BrowserChrome dominio={p.dominio} size="modal">
            {/* margin-right reserva la esquina del botón de cerrar. */}
            <div role="group" aria-label="Modo del visor" className="mr-[46px] ml-auto flex shrink-0 gap-1.5">
              {embebible ? (
                <button type="button" aria-pressed={vistaEfectiva === "vivo"} onClick={() => onVista("vivo")} className={toggleBtn(vistaEfectiva === "vivo")}>
                  En vivo
                </button>
              ) : (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener"
                  title="Esta web no permite incrustarse: se abre en una pestaña nueva"
                  className={toggleBtn(false)}
                >
                  En vivo ↗
                </a>
              )}
              <button type="button" aria-pressed={vistaEfectiva === "captura"} onClick={() => onVista("captura")} className={toggleBtn(vistaEfectiva === "captura")}>
                Captura
              </button>
            </div>
          </BrowserChrome>

          <LiveViewer project={p} vista={vistaEfectiva} />

          {p.extra && p.extraImages && (
            <div className="flex flex-col gap-2.5 px-[18px] pt-4 pb-[18px]">
              <span className="font-sans text-[11px] tracking-[0.14em] text-muted uppercase">{p.extra}</span>
              <div
                className={
                  extraVertical
                    ? "grid grid-cols-[repeat(auto-fit,minmax(140px,220px))] justify-center gap-3"
                    : "grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
                }
              >
                {p.extraImages.map((img) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes={extraVertical ? "220px" : "(max-width: 600px) 100vw, 540px"}
                    className="block h-auto w-full rounded-shot border border-line-soft object-cover object-top"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(22px,3vw,44px)] p-[clamp(24px,3.4vw,40px)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="label text-accent">{p.tipo}</span>
              <h3 id="modal-titulo" className="m-0 font-display text-[clamp(34px,3.8vw,54px)] font-light tracking-[-0.025em]">
                {p.cliente}
              </h3>
            </div>
            <p className="m-0 text-[15.5px] leading-[1.7] text-pretty text-dim">{p.desc}</p>
            <a
              href={p.url}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-[9px] self-start rounded-full bg-fg px-6 py-[13px] text-sm text-bg transition-[background-color,color] duration-250 hover:bg-accent hover:text-panel"
            >
              Ver la web en vivo →
            </a>
          </div>
          <dl className="m-0 flex flex-col gap-4 text-sm">
            {filas.map(([k, v], i) => (
              <div
                key={k}
                className={`flex justify-between gap-3.5 ${i < filas.length - 1 ? "border-b border-line-soft pb-3" : ""}`}
              >
                <dt className="label">{k}</dt>
                <dd className="m-0 text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
