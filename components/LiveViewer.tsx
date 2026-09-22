"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import ProjectShot from "./ProjectShot";

export type Vista = "vivo" | "captura";

const FRAME_W = 1440;
const FRAME_H = 810;
const BLOQUEO_MS = 5000;

/**
 * Visor 16/9 del modal. En vivo: la web real en un iframe de 1440×810 escalado al ancho del contenedor.
 * Si el iframe no dispara onLoad en 5 s, se muestra el aviso. Las webs con `embeddable: false` no llegan
 * aquí en modo vivo: el modal las fuerza a «Captura».
 */
export default function LiveViewer({ project, vista }: { project: Project; vista: Vista }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [frameOk, setFrameOk] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const vivo = vista === "vivo";

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => el.style.setProperty("--vscale", (el.clientWidth / FRAME_W).toFixed(4));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // El temporizador se limpia al cerrar el modal (desmontaje) o al cambiar de vista.
  useEffect(() => {
    if (!vivo || frameOk) return;
    const t = setTimeout(() => setTimedOut(true), BLOQUEO_MS);
    return () => clearTimeout(t);
  }, [vivo, frameOk]);

  const bloqueada = vivo && timedOut && !frameOk;

  return (
    <div ref={boxRef} className="relative aspect-video overflow-hidden bg-panel">
      {!vivo && <ProjectShot project={project} sizes="(max-width: 1080px) 100vw, 1080px" />}

      {vivo && (
        <iframe
          src={project.url}
          title={`Web de ${project.cliente} en vivo`}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-popups"
          onLoad={() => {
            setFrameOk(true);
            setTimedOut(false);
          }}
          className="absolute top-0 left-0 origin-top-left border-0"
          style={{ width: FRAME_W, height: FRAME_H, transform: "scale(var(--vscale, 0.75))" }}
        />
      )}

      {bloqueada && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-panel p-6 text-center">
          <span className="font-display text-2xl text-fg">Esta web no permite incrustarse</span>
          <span className="font-sans text-xs tracking-[0.06em] text-muted">
            Ábrela en una pestaña nueva o mira la captura
          </span>
        </div>
      )}
    </div>
  );
}
