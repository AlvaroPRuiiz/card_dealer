import { ArrowRight, Video } from "lucide-react";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { routes } from "../data/site";

export function PrototypeTestsSection() {
  return (
    <section id="pruebas" className="border-t border-white/10 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <Reveal>
          <SectionHeading
            eyebrow="Pruebas reales"
            title="Validación honesta del prototipo."
            text="Los vídeos disponibles muestran pruebas reales de subsistemas del prototipo, como el giro de plataforma y el avance de cartas. Se presentan como evidencias parciales de validación, no como demostración final de extremo a extremo."
            align="center"
          />
        </Reveal>

        <Reveal className="mt-12">
          <div className="premium-panel mx-auto grid max-w-4xl gap-7 rounded-[2rem] border p-7 text-center md:grid-cols-[auto_1fr_auto] md:items-center md:text-left">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold shadow-glow md:mx-0">
              <Video aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                Vídeos del sistema
              </p>
              <h3 className="mt-3 text-2xl font-black text-casino-ivory">
                Giro y reparto, documentados como pruebas de validación.
              </h3>
              <p className="mt-3 leading-7 text-casino-muted">
                Consulta vídeos de prueba, materiales visuales y recursos técnicos del prototipo.
              </p>
            </div>
            <Button to={routes.resources} className="mx-auto md:mx-0">
              Ver pruebas
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
