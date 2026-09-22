"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useScrollFrame(({ y, vh, docHeight }) => {
    const max = Math.max(1, docHeight - vh);
    if (ref.current) ref.current.style.width = `${Math.min(100, (y / max) * 100)}%`;
  });
  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 z-90 h-0.5 w-0 bg-accent transition-none"
    />
  );
}
