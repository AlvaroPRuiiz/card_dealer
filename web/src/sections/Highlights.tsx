import { highlights } from "../data/site";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

export function Highlights() {
  return (
    <section id="highlights" className="border-t border-white/10 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <Reveal>
          <SectionHeading
            eyebrow="Highlights"
            title="Claridad de hardware con acabado casino-tech."
            text="Una web pequeña pero pensada como presentación pública de producto: directa, visual y defendible desde el prototipo real."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <article className="premium-panel h-full rounded-3xl border p-6 transition duration-300 hover:-translate-y-1 hover:border-casino-gold/45 hover:bg-casino-gold/[0.06] hover:shadow-glow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 font-mono font-black text-casino-gold">
                  {item.eyebrow}
                </span>
                <h3 className="mt-8 text-2xl font-black leading-tight text-casino-ivory">
                  {item.title}
                </h3>
                <p className="mt-4 leading-7 text-casino-muted">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
