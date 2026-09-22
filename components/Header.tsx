"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const ref = useRef<HTMLElement>(null);

  useScrollFrame(({ y, prevY, vh }) => {
    const nav = ref.current;
    if (!nav) return;
    const past = y > vh * 0.82;
    nav.style.background = past ? "var(--nav-bg)" : "transparent";
    nav.style.backdropFilter = past ? "blur(12px)" : "none";
    nav.style.borderBottomColor = past ? "var(--line-soft)" : "transparent";
    const bajando = y > prevY && y > vh * 1.25;
    // Al volver a subir (y > prevY falso) reaparece; si no hay movimiento, conserva el estado.
    if (y !== prevY) nav.style.transform = bajando ? "translateY(-102%)" : "translateY(0)";
  });

  return (
    <header
      ref={ref}
      className="fixed top-0 right-0 left-0 z-80 flex items-center justify-between gap-6 border-b border-transparent px-gutter py-5 [transition:transform_1s_var(--ease-soft),background_0.4s,border-color_0.4s]"
    >
      <a href="#top" className="flex min-w-0 items-baseline gap-[11px]">
        <span className="shrink-0 font-display text-[28px] font-light tracking-[-0.01em]">
          by Jules
        </span>
        <span className="label truncate max-sm:hidden">Desarrollo web freelance</span>
      </a>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menú"
          className="flex h-[34px] w-[34px] cursor-pointer flex-col justify-center gap-[5px] border-0 bg-transparent px-1.5"
        >
          <span className="block h-px bg-fg" />
          <span className="block h-px bg-fg" />
        </button>
      </div>
    </header>
  );
}
