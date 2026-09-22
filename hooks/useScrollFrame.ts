"use client";

import { useEffect, useEffectEvent } from "react";

export type ScrollFrame = {
  y: number;
  /** Scroll del frame anterior, para saber la dirección. */
  prevY: number;
  vh: number;
  docHeight: number;
};

type Subscriber = (frame: ScrollFrame) => void;

// Un único listener de scroll/resize, agrupado en requestAnimationFrame y compartido por todo el sitio.
const subscribers = new Set<Subscriber>();
let prevY = 0;
let pending = false;

function readFrame(): ScrollFrame {
  return {
    y: window.scrollY,
    prevY,
    vh: window.innerHeight || 1,
    docHeight: document.documentElement.scrollHeight,
  };
}

function run() {
  pending = false;
  const frame = readFrame();
  subscribers.forEach((fn) => fn(frame));
  prevY = frame.y;
}

function schedule() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(run);
}

export function useScrollFrame(callback: Subscriber) {
  const onFrame = useEffectEvent(callback);

  useEffect(() => {
    const fn: Subscriber = (frame) => onFrame(frame);
    if (subscribers.size === 0) {
      prevY = window.scrollY;
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
    }
    subscribers.add(fn);
    fn(readFrame());
    return () => {
      subscribers.delete(fn);
      if (subscribers.size === 0) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
      }
    };
  }, []);
}
