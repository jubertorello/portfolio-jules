"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  as?: "div" | "span" | "p";
  /** Retardo en ms (el prototipo escalona 70 ms por elemento). */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Entrada hacia arriba al aparecer en viewport (`data-reveal="up"`). Los estilos están en globals.css. */
export default function Reveal({ as: Tag = "div", delay = 0, className, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = setTimeout(() => setRevealed(true), delay);
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal="up"
      data-revealed={revealed ? "" : undefined}
    >
      {children}
    </Tag>
  );
}
