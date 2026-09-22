"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CursorContext } from "@/hooks/useCursorLabel";
import { useFinePointer, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Proveedor del cursor personalizado: punto de 6px + círculo de 46px con retardo que muestra etiquetas. */
export default function CursorProvider({
  enabled = true,
  children,
}: {
  enabled?: boolean;
  children: ReactNode;
}) {
  const [label, setLabel] = useState<string | null>(null);
  const finePointer = useFinePointer();
  const reducedMotion = usePrefersReducedMotion();
  const active = enabled && finePointer && !reducedMotion;

  return (
    <CursorContext.Provider value={setLabel}>
      {children}
      {active && <Cursor label={label} />}
    </CursorContext.Provider>
  );
}

function Cursor({ label }: { label: string | null }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, seen = false;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        cx = x;
        cy = y;
      }
      dot.style.opacity = ring.style.opacity = "1";
      dot.style.transform = `translate(${x}px, ${y}px)`;
    };
    const onLeave = () => {
      dot.style.opacity = ring.style.opacity = "0";
    };
    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      ring.style.left = `${cx}px`;
      ring.style.top = `${cy}px`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  const big = label !== null;
  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-96 -mt-[3px] -ml-[3px] size-1.5 rounded-full bg-fg opacity-0 [transition:opacity_0.3s,background-color_0.45s]"
      />
      <div
        ref={ringRef}
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 z-95 flex items-center justify-center overflow-hidden rounded-full border border-fg text-center font-sans text-[11px] leading-none font-medium tracking-[0.9px] whitespace-nowrap text-bg uppercase opacity-0 [transition:width_0.3s,height_0.3s,margin_0.3s,background_0.3s,opacity_0.3s,transform_0.15s_ease-out] ${
          big ? "-mt-12 -ml-12 size-24 bg-fg" : "-mt-[23px] -ml-[23px] size-[46px] bg-transparent"
        }`}
      >
        {label}
      </div>
    </>
  );
}
