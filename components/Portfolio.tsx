"use client";

import { useEffect, useState } from "react";
import type { Categoria, Project } from "@/lib/projects";
import About from "./About";
import CursorProvider from "./CustomCursor";
import FilterBar from "./FilterBar";
import Footer from "./Footer";
import Header from "./Header";
import Hero from "./Hero";
import type { Vista } from "./LiveViewer";
import MenuOverlay from "./MenuOverlay";
import ProjectFeed from "./ProjectFeed";
import ProjectModal from "./ProjectModal";
import ScrollProgress from "./ScrollProgress";

type Props = {
  projects: Project[];
  /** Equivale a la prop `cursorPersonalizado` del prototipo. */
  cursorPersonalizado?: boolean;
  /** Equivale a la prop `parallaxTarjetas` del prototipo. */
  parallaxTarjetas?: boolean;
};

export default function Portfolio({
  projects,
  cursorPersonalizado = true,
  parallaxTarjetas = true,
}: Props) {
  const [filtro, setFiltro] = useState<Categoria>("Todo");
  const [sel, setSel] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>("vivo");
  const [menu, setMenu] = useState(false);

  const lista = projects.filter((p) => filtro === "Todo" || p.cat === filtro);
  const abierto = projects.find((p) => p.slug === sel) ?? null;

  // Escape cierra modal y menú; con cualquiera abierto se bloquea el scroll de la página.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setSel(null);
      setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = abierto || menu ? "hidden" : "";
    return () => {
      root.style.overflow = "";
    };
  }, [abierto, menu]);

  return (
    <CursorProvider enabled={cursorPersonalizado}>
      <ScrollProgress />
      <div className="relative bg-bg" inert={!!abierto || menu}>
        <Header onOpenMenu={() => setMenu(true)} />
        <main>
          <Hero projects={projects} />
          <About />
          <FilterBar activo={filtro} total={lista.length} onChange={setFiltro} />
          <ProjectFeed projects={lista} onOpen={setSel} parallax={parallaxTarjetas} />
        </main>
        <Footer />
      </div>

      <MenuOverlay open={menu} onClose={() => setMenu(false)} />

      {abierto && (
        <ProjectModal
          key={abierto.slug}
          project={abierto}
          vista={vista}
          onVista={setVista}
          onClose={() => setSel(null)}
        />
      )}
    </CursorProvider>
  );
}
