"use client";

import { useEffect } from "react";
import { DAY_END, DAY_START, THEME_STORAGE_KEY } from "@/lib/site";

type Theme = "light" | "dark";

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
}

/** Media luna que gira 180° en oscuro (el giro está en globals.css, ligado a html[data-theme]). */
export default function ThemeToggle() {
  // Sin elección guardada, el tema sigue la hora: si la página queda abierta, cambia al amanecer/anochecer.
  useEffect(() => {
    const sync = () => {
      if (readStored()) return;
      const h = new Date().getHours();
      document.documentElement.setAttribute(
        "data-theme",
        h >= DAY_START && h < DAY_END ? "light" : "dark",
      );
    };
    const id = setInterval(sync, 60_000);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next: Theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  return (
    <button
      type="button"
      data-theme-toggle
      onClick={toggle}
      aria-label="Cambiar entre modo claro y oscuro"
      title="Modo claro / oscuro"
      className="size-[34px] cursor-pointer rounded-full border border-line-strong bg-[linear-gradient(90deg,var(--fg)_0_50%,transparent_50%_100%)] p-0 [transition:transform_0.55s_var(--ease-pop),border-color_0.45s]"
    />
  );
}
