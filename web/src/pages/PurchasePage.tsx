import { CalendarCheck, Mail, ShieldCheck, Star } from "lucide-react";
import { Button } from "../components/Button";
import { PageTransition } from "../components/PageTransition";
import { Reveal } from "../components/Reveal";
import { assetPaths, routes } from "../data/site";

export function PurchasePage() {
  const interestPoints = [
    "Prototipo universitario en desarrollo",
    "Pruebas parciales de subsistemas",
    "Sin venta online activa",
  ];

  return (
    <PageTransition>
      <section className="mx-auto grid w-[min(1180px,calc(100%-28px))] gap-10 py-14 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <Reveal className="lg:pt-10">
          <div className="premium-panel relative overflow-hidden rounded-[2rem] border gold-line p-4">
            <div className="absolute inset-x-8 bottom-8 top-1/2 rounded-full bg-casino-gold/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[1.55rem] border border-casino-gold/20 bg-[#f4f3f1] shadow-[0_34px_90px_rgba(0,0,0,0.62)]">
              <img
                className="aspect-[4/3] h-full w-full object-cover object-center"
                src={assetPaths.productHero}
                alt="Prototipo real ELCO-DEALER preparado para demostracion"
              />
              <div className="absolute right-4 top-4 rounded-full border border-casino-gold/30 bg-casino-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
                Prototype 01
              </div>
            </div>

            <div className="relative mt-4 grid gap-3 sm:grid-cols-3">
              {interestPoints.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Star className="mb-3 text-casino-gold" size={17} aria-hidden="true" />
                  <p className="text-sm font-bold leading-5 text-casino-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="lg:max-w-[43rem]">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-casino-gold">
              Solicitud de demo
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-casino-ivory md:text-6xl">
              Conoce ELCO-DEALER en una demostración guiada.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-casino-muted">
              ELCO-DEALER se presenta como prototipo universitario en desarrollo. Esta página
              permite solicitar información, coordinar una demo o registrar interés para futuras
              iteraciones del diseño.
            </p>

            <div className="mt-6 inline-flex items-center gap-4 rounded-full border border-casino-gold/25 bg-casino-gold/[0.08] px-5 py-3">
              <span className="text-3xl font-black text-casino-ivory">79,99 €</span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
                Concept price
              </span>
            </div>

            <div className="mt-7 rounded-3xl border border-casino-gold/25 bg-[linear-gradient(135deg,rgba(214,169,79,0.12),rgba(255,255,255,0.03))] p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
                  <ShieldCheck aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-casino-ivory">
                    Acceso a demostración
                  </h2>
                  <p className="mt-2 leading-7 text-casino-muted">
                    Proyecto preparado para presentación, pruebas guiadas y futuras iteraciones
                    de diseño. Sin venta online activa actualmente.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row">
              <Button href="mailto:hello@elcodealer.com?subject=Demo%20ELCO-DEALER" className="sm:flex-1">
                <CalendarCheck size={17} aria-hidden="true" />
                Solicitar demo
              </Button>
              <Button to={routes.contact} tone="ghost" className="sm:flex-1">
                <Mail size={17} aria-hidden="true" />
                Solicitar información
              </Button>
            </div>

            <Button to={routes.resources} tone="dark" className="mt-6">
              Ver pruebas y recursos
            </Button>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
