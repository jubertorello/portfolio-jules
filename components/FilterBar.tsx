import { CATEGORIAS, type Categoria } from "@/lib/projects";

type Props = {
  activo: Categoria;
  total: number;
  onChange: (c: Categoria) => void;
};

export default function FilterBar({ activo, total, onChange }: Props) {
  return (
    <div
      id="trabajo"
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-[18px] border-b border-line bg-bar-bg px-gutter py-[18px] backdrop-blur-[10px] max-md:flex-nowrap max-md:gap-3 max-md:py-3"
    >
      <div role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2 max-md:-my-1 max-md:min-w-0 max-md:flex-1 max-md:flex-nowrap max-md:gap-1.5 max-md:overflow-x-auto max-md:py-1 max-md:[scrollbar-width:none]">
        {CATEGORIAS.map((c) => {
          const on = c === activo;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(c)}
              className={`shrink-0 cursor-pointer rounded-full border px-[17px] py-[9px] font-sans text-[18px] tracking-[1px] uppercase transition-all duration-250 max-md:px-3 max-md:py-1.5 max-md:text-[13px] ${
                on
                  ? "border-fg bg-fg text-bg"
                  : "border-line-strong bg-transparent text-dim hover:border-fg hover:text-fg"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <span className="label shrink-0 max-md:text-[13px]" aria-live="polite">
        {total}<span className="max-md:sr-only"> proyectos</span>
      </span>
    </div>
  );
}
