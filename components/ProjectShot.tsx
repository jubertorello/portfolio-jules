import Image from "next/image";
import type { Project } from "@/lib/projects";

type Props = {
  project: Pick<Project, "cliente" | "screenshot" | "screenshotMobile">;
  /** `mobile` usa la captura de móvil (tarjetas verticales y miniaturas móviles del hero). */
  variant?: "desktop" | "mobile";
  sizes: string;
  preload?: boolean;
  className?: string;
};

/** Captura del proyecto o, mientras no exista, un hueco rayado con los tokens del tema. */
export default function ProjectShot({
  project,
  variant = "desktop",
  sizes,
  preload,
  className = "",
}: Props) {
  const src = variant === "mobile" ? project.screenshotMobile : project.screenshot;
  const alt = `Captura ${variant === "mobile" ? "móvil " : ""}de ${project.cliente}`;

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${alt} (pendiente)`}
      className={`absolute inset-0 flex items-center justify-center bg-chrome bg-[repeating-linear-gradient(135deg,var(--line-soft)_0_1px,transparent_1px_14px)] ${className}`}
    >
      <span className="px-3 text-center font-mono text-[11px] text-muted">{alt}</span>
    </div>
  );
}
