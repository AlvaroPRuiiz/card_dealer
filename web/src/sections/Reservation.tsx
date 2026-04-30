import { ArrowRight, Mail, ShoppingBag } from "lucide-react";
import { Button } from "../components/Button";
import { Reveal } from "../components/Reveal";
import { routes } from "../data/site";

export function Reservation() {
  return (
    <section id="reserva" className="border-t border-white/10 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <Reveal>
          <div className="grid gap-10 overflow-hidden rounded-[2rem] border border-casino-gold/30 bg-[radial-gradient(circle_at_85%_12%,rgba(214,169,79,0.16),transparent_20rem),linear-gradient(135deg,#171316,#09090b_54%,#5b101b)] p-8 shadow-premium lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-casino-gold">
                Reserva / Compra
              </p>
              <h2 className="max-w-2xl text-4xl font-black leading-none text-casino-ivory md:text-6xl">
                Un concepto listo para enseñar, reservar y evolucionar.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-casino-muted">
                La compra real no está conectada a pagos. Esta ruta deja preparada una
                experiencia coherente para integrar la web de compra dentro del mismo lenguaje
                visual.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button to={routes.purchase}>
                  <ShoppingBag size={17} aria-hidden="true" />
                  Comprar / Reservar
                </Button>
                <Button to={routes.contact} tone="ghost">
                  <Mail size={17} aria-hidden="true" />
                  Hablar con soporte
                </Button>
              </div>
            </div>

            <div className="premium-panel rounded-3xl border p-6">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                Prototype Access
              </p>
              <h3 className="mt-4 text-3xl font-black text-casino-ivory">
                Reserva conceptual ELCO-DEALER
              </h3>
              <ul className="mt-6 grid gap-4 text-casino-muted">
                <li>Producto universitario funcional, no ecommerce activo.</li>
                <li>Diseño visual preparado para campaña y demo pública.</li>
                <li>Integración futura con compra externa o formulario real.</li>
              </ul>
              <Button to={routes.purchase} tone="dark" className="mt-7 w-full">
                Abrir página de compra
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
