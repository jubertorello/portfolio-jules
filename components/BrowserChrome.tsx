import type { ReactNode } from "react";

type Props = {
  dominio: string;
  size?: "card" | "modal";
  /** Contenido a la derecha de la barra (conmutador de vista del modal). */
  children?: ReactNode;
};

/** Barra de navegador: tres puntos + pill con el dominio. */
export default function BrowserChrome({ dominio, size = "card", children }: Props) {
  const modal = size === "modal";
  const dot = modal ? "size-2" : "size-[7px]";
  return (
    <div
      className={`flex items-center gap-2 border-b border-line-soft bg-chrome ${
        modal ? "px-3.5 py-[11px]" : "px-[11px] py-[9px] max-md:gap-1.5 max-md:px-2 max-md:py-1.5"
      }`}
    >
      <span className={`${dot} shrink-0 rounded-full bg-dot`} />
      <span className={`${dot} shrink-0 rounded-full bg-dot`} />
      <span className={`${dot} shrink-0 rounded-full bg-dot`} />
      <span
        data-pill
        className={
          modal
            ? "ml-1.5 min-w-0 truncate rounded-full bg-pill px-3 py-1 font-mono text-xs text-muted"
            : "ml-[5px] min-w-0 flex-1 truncate rounded-full bg-pill px-2.5 py-1 font-mono text-[11px] max-md:ml-0.5 max-md:px-2 max-md:py-0.5 max-md:text-[9px] text-muted transition-[background-color,color] duration-800 ease-soft group-hover:bg-accent group-hover:text-panel group-focus-visible:bg-accent group-focus-visible:text-panel"
        }
      >
        {dominio}
      </span>
      {children}
    </div>
  );
}
