import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      id="overview"
      className="grid grid-cols-[minmax(0,0.28fr)_minmax(0,0.72fr)] items-start gap-[clamp(24px,5vw,72px)] px-gutter py-[clamp(64px,11vw,160px)] max-sm:grid-cols-1"
    >
      <Reveal as="span" className="label">
        Sobre mí
      </Reveal>
      <Reveal
        as="p"
        delay={70}
        className="m-0 max-w-[34ch] font-display text-[clamp(28px,3.6vw,56px)] leading-[1.22] font-light tracking-[-0.02em] text-pretty text-fg"
      >
        Soy Jules, desarrolladora freelance. Diseño y programo webs, tiendas, aplicaciones y
        automatizaciones <em className="text-accent italic">a medida</em>.
      </Reveal>
    </section>
  );
}
