import { engineeringCards } from "../data/site";
import { DealSimulator } from "../components/DealSimulator";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

export function Engineering() {
  return (
    <section id="engineering" className="border-t border-white/10 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <Reveal>
          <SectionHeading
            eyebrow="Engineering"
            title="Arquitectura pensada para no bloquearse."
            text="La arquitectura combina control por máquina de estados, sensores de referencia, motores DC y una interfaz física para configurar el reparto."
          />
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {engineeringCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.05}>
              <article className="premium-panel h-full rounded-3xl border p-6">
                <span className="font-mono text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
                  {card.code}
                </span>
                <h3 className="mt-5 text-2xl font-black text-casino-ivory">{card.title}</h3>
                <p className="mt-4 leading-7 text-casino-muted">{card.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12">
          <DealSimulator />
        </Reveal>
      </div>
    </section>
  );
}
