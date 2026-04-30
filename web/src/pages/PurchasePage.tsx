import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { HardwareShowcase } from "../components/HardwareShowcase";
import { PageTransition } from "../components/PageTransition";
import { Reveal } from "../components/Reveal";
import { routes } from "../data/site";

export function PurchasePage() {
  const [quantity, setQuantity] = useState(1);

  return (
    <PageTransition>
      <section className="mx-auto grid w-[min(1180px,calc(100%-28px))] gap-12 py-16 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <HardwareShowcase />
        </Reveal>

        <Reveal delay={0.06}>
          <div>
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-casino-gold">
              Página de compra integrada
            </p>
            <h1 className="text-5xl font-black leading-[0.9] tracking-tight text-casino-ivory md:text-7xl">
              Reserva premium del prototipo.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-casino-muted">
              Esta ruta queda preparada para integrar la web de compra externa dentro de la
              identidad visual de ELCO-DEALER. No hay pagos reales ni backend conectado.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <span className="text-4xl font-black text-casino-ivory">99,99 €</span>
              <span className="rounded-full border border-casino-gold/30 bg-casino-gold/10 px-3 py-1 text-sm font-black text-casino-gold">
                Concept price
              </span>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <div className="inline-flex h-14 items-center rounded-2xl border border-white/10 bg-casino-black/70">
                <button
                  className="grid h-14 w-14 place-items-center text-casino-muted transition hover:text-casino-amber"
                  type="button"
                  aria-label="Reducir cantidad"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus aria-hidden="true" />
                </button>
                <span className="grid h-14 w-16 place-items-center border-x border-white/10 font-mono text-xl font-black text-casino-amber">
                  {quantity}
                </span>
                <button
                  className="grid h-14 w-14 place-items-center text-casino-muted transition hover:text-casino-amber"
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  <Plus aria-hidden="true" />
                </button>
              </div>

              <Button href="mailto:hello@elcodealer.com?subject=Reserva%20ELCO-DEALER" className="sm:flex-1">
                <ShoppingBag size={17} aria-hidden="true" />
                Solicitar reserva
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Prototipo universitario", "Sin pago real", "Preparado para integración"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <Star className="mb-3 text-casino-gold" size={17} aria-hidden="true" />
                  <p className="text-sm font-bold text-casino-muted">{item}</p>
                </div>
              ))}
            </div>

            <Button to={routes.resources} tone="ghost" className="mt-8">
              Ver recursos antes de reservar
            </Button>
          </div>
        </Reveal>
      </section>
    </PageTransition>
  );
}
