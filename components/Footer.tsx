import { SITE } from "@/lib/site";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="border-t border-line px-gutter pt-[clamp(56px,8vw,120px)] pb-11"
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-end gap-[clamp(24px,4vw,60px)]">
        <Reveal className="flex flex-col gap-3.5">
          <span className="label">Escríbeme</span>
          <a
            href={`mailto:${SITE.email}`}
            className="self-start border-b border-accent-line pb-[3px] font-sans text-[15px] text-accent"
          >
            {SITE.email}
          </a>
          <a href={SITE.whatsapp} target="_blank" rel="noopener" className="text-sm text-dim">
            {SITE.phone} · WhatsApp
          </a>
        </Reveal>
        <Reveal delay={70} className="flex flex-col gap-3.5 text-sm text-dim">
          <span className="font-sans text-[10px] tracking-[0.1em] text-faint">© 2026 by Jules</span>
        </Reveal>
      </div>
    </footer>
  );
}
