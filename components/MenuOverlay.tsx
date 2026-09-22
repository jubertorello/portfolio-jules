"use client";

import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "#trabajo", label: "Trabajo" },
  { href: "#contacto", label: "Contacto" },
];

export default function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  return (
    <nav
      aria-label="Menú principal"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-99 flex flex-col justify-center gap-2 bg-bg px-gutter [transition:opacity_0.9s_var(--ease-soft),background-color_0.45s] ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar menú"
        className="absolute top-[22px] right-gutter size-9 cursor-pointer rounded-full border border-line-strong bg-transparent text-[17px] leading-none text-fg"
      >
        ×
      </button>
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onClick={onClose}
          className="font-display text-[clamp(44px,9vw,110px)] leading-[1.05] font-light tracking-[-0.03em]"
        >
          {l.label}
        </a>
      ))}
      <span className="label mt-[26px]">{SITE.email}</span>
    </nav>
  );
}
