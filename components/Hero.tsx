"use client";

import { useEffect, useRef } from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import type { Project } from "@/lib/projects";
import HeroCollage, { THUMB_DEPTHS } from "./HeroCollage";

const EASE = "cubic-bezier(0.16,0.84,0.24,1)";
const COLOR = "color 0.45s ease";

export default function Hero({ projects }: { projects: Project[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const discRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Estado de animación mutable (se lee en cada frame; no provoca renders).
  const anim = useRef({
    reduced: false,
    done: false, // primer scroll ya disparado
    settled: false, // miniaturas terminaron su entrada
    y: 0,
    mx: 0, my: 0, tmx: 0, tmy: 0, // ratón suavizado / objetivo, en [-0.5, 0.5]
    focus: null as number | null,
    scale: [] as number[],
    opacity: [] as number[],
  });

  const layout = () => {
    const a = anim.current;
    if (a.reduced) return;
    const vh = window.innerHeight || 1;
    if (a.y > vh * 1.35) return;

    const tit = titleRef.current;
    if (tit) {
      const px = (a.mx * -16).toFixed(1);
      tit.style.transform = a.done
        ? `translate(calc(3.5% + ${px}px), ${(a.y * -0.46 + a.my * -10).toFixed(1)}px)`
        : `translate(${px}px, ${(a.my * -10).toFixed(1)}px)`;
    }

    if (!a.settled) return;
    const libre = a.focus === null;
    const t = performance.now() / 1000;
    thumbRefs.current.forEach((el, i) => {
      if (!el) return;
      const depth = THUMB_DEPTHS[i % THUMB_DEPTHS.length];
      // Flotación lenta y sutil, con fase y amplitud distintas por miniatura.
      const fx = Math.sin(t * 0.5 + i * 1.7) * (4 + depth * 3);
      const fy = Math.cos(t * 0.4 + i * 2.3) * (5 + depth * 4);
      const sx = a.mx * -34 * depth + fx;
      const sy = a.my * -22 * depth + a.y * -(0.05 + depth * 0.055) + fy;
      const scaleTarget = libre ? 1 : a.focus === i ? 1.28 : 0.84;
      const opTarget = libre || a.focus === i ? 1 : 0.62;
      a.scale[i] ??= 1;
      a.opacity[i] ??= 1;
      a.scale[i] += (scaleTarget - a.scale[i]) * 0.07;
      a.opacity[i] += (opTarget - a.opacity[i]) * 0.07;
      el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) scale(${a.scale[i].toFixed(4)})`;
      el.style.opacity = a.opacity[i].toFixed(3);
    });
  };

  const fire = () => {
    const a = anim.current;
    if (a.done || a.reduced) return;
    a.done = true;
    const tit = titleRef.current;
    if (tit) {
      tit.style.fontSize = "var(--hero-end)";
      tit.style.letterSpacing = "-0.04em";
      tit.style.transform = "translateX(0)";
    }
    // Solo las visibles (el collage de escritorio y el de móvil conviven en el DOM).
    const thumbs = thumbRefs.current.filter((el): el is HTMLDivElement => !!el?.offsetParent);
    thumbs.forEach((el, i) => {
      const d = (i * 0.08).toFixed(2); // más miniaturas que en el prototipo (6 × 0,12 s): escalonado más corto
      el.style.transition = `opacity 1.1s ease-out ${d}s, transform 1.2s ${EASE} ${d}s`;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    setTimeout(() => {
      thumbs.forEach((el) => (el.style.transition = "none"));
      if (tit)
        tit.style.transition = `opacity 0.9s ease-out, font-size 1.2s ${EASE}, letter-spacing 1.2s ${EASE}, ${COLOR}`;
      a.settled = true;
      layout();
    }, 1300 + thumbs.length * 80);
  };

  // Entrada inicial, reduced motion y parallax de ratón.
  useEffect(() => {
    const a = anim.current;
    const hero = heroRef.current!;
    const tit = titleRef.current!;
    const disc = discRef.current!;
    a.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (a.reduced) {
      tit.style.fontSize = "var(--hero-end)";
      tit.style.letterSpacing = "-0.04em";
      tit.style.opacity = "1";
      disc.style.opacity = "1";
      disc.style.transform = "none";
      thumbRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    tit.style.transition = `opacity 0.9s ease-out, font-size 1.2s ${EASE}, transform 1.2s ${EASE}, ${COLOR}`;
    disc.style.transition = `opacity 1s ease-out, transform 1s ${EASE}, ${COLOR}`;
    const t1 = setTimeout(() => (tit.style.opacity = "1"), 260);
    const t2 = setTimeout(() => {
      disc.style.opacity = "1";
      disc.style.transform = "translateY(0)";
    }, 620);

    // Bucle de animación (flotación + parallax de ratón) solo mientras el hero está en pantalla.
    // El parallax de ratón solo con puntero fino.
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0;
    let visible = true;
    const loop = () => {
      a.mx += (a.tmx - a.mx) * 0.07;
      a.my += (a.tmy - a.my) * 0.07;
      layout();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      a.tmx = (e.clientX - r.left) / r.width - 0.5;
      a.tmy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => {
      a.tmx = 0;
      a.tmy = 0;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(hero);
    if (finePointer) {
      hero.addEventListener("mousemove", onMove, { passive: true });
      hero.addEventListener("mouseleave", onLeave);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf);
      io.disconnect();
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useScrollFrame(({ y, vh }) => {
    const a = anim.current;
    a.y = y;
    if (y > 4) fire();
    if (y < vh * 1.35) {
      layout();
      const disc = discRef.current;
      if (disc && a.done) disc.style.opacity = String(Math.max(0, 1 - y / (vh * 0.5)));
    }
    const cue = cueRef.current;
    if (cue) {
      const off = y > vh * 0.4;
      cue.style.opacity = off ? "0" : "1";
      cue.style.pointerEvents = off ? "none" : "auto";
    }
  });

  const onThumbEnter = (i: number) => {
    anim.current.focus = i;
    const el = thumbRefs.current[i];
    if (el) el.style.zIndex = "7";
  };
  const onThumbLeave = (i: number) => {
    const a = anim.current;
    if (a.focus === i) a.focus = null;
    setTimeout(() => {
      const el = thumbRefs.current[i];
      if (el && a.focus !== i) el.style.zIndex = el.dataset.z ?? "";
    }, 700);
  };

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex h-screen min-h-[480px] items-center justify-center overflow-hidden bg-bg"
    >
      <h1
        ref={titleRef}
        // Tamaño inicial → final (al primer scroll). En móvil el título va en dos líneas y más grande.
        className="relative z-2 m-0 text-center font-display text-(length:--hero-start) leading-[0.9] font-light tracking-[-0.02em] whitespace-nowrap text-fg opacity-0 will-change-[font-size,transform] [--hero-end:min(12.2vw,232px)] [--hero-start:min(75px,7vw)] max-md:[--hero-end:21vw] max-md:[--hero-start:11vw]"
      >
        Mi <br className="md:hidden" />
        Portfolio
      </h1>

      <span
        ref={discRef}
        className="label absolute bottom-[clamp(24px,4vh,42px)] left-gutter z-6 max-w-[min(52vw,420px)] leading-[1.3] opacity-0"
        style={{ transform: "translateY(14px)" }}
      >
        Desarrollo web &amp; producto digital
      </span>

      <HeroCollage
        projects={projects}
        thumbRefs={thumbRefs}
        onEnter={onThumbEnter}
        onLeave={onThumbLeave}
      />

      <a
        ref={cueRef}
        href="#trabajo"
        className="label fixed right-gutter bottom-[clamp(24px,4vh,42px)] z-70 flex items-center gap-2.5 [transition:opacity_0.9s_var(--ease-soft),color_0.45s]"
      >
        <span className="max-sm:sr-only">Scroll down</span>
        <span aria-hidden className="inline-block animate-bob">
          ↘
        </span>
      </a>
    </section>
  );
}
