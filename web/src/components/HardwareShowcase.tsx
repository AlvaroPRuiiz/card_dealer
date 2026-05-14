import { CircuitBoard, Sparkles } from "lucide-react";
import { useState } from "react";
import { assetPaths } from "../data/site";

export function HardwareShowcase() {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-casino-gold/10 blur-3xl" />
      <div className="premium-panel relative overflow-hidden rounded-[2rem] border gold-line">
        <div className="absolute right-6 top-6 z-10 rounded-full border border-casino-gold/30 bg-casino-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
          Prototype 01
        </div>

        {!hasImageError ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_50%_55%,rgba(214,169,79,0.2),transparent_22rem),linear-gradient(145deg,#070707_0%,#15100c_48%,#070707_100%)] p-3 sm:p-4">
            <div className="absolute inset-x-6 bottom-6 top-1/2 rounded-full bg-casino-gold/15 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,239,228,0.06),transparent_30%,rgba(148,27,44,0.14)_78%,transparent)]" />
            <img
              className="relative h-full w-full rounded-[1.45rem] border border-casino-gold/20 bg-[#f4f3f1] object-cover object-center shadow-[0_34px_90px_rgba(0,0,0,0.62)]"
              src={assetPaths.productHero}
              alt="Maqueta hardware ELCO-DEALER preparada para demostración"
              onError={() => setHasImageError(true)}
            />
            <div className="pointer-events-none absolute inset-4 rounded-[1.45rem] ring-1 ring-white/10" />
          </div>
        ) : (
          <div className="grid aspect-[4/5] place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(214,169,79,0.18),transparent_18rem),linear-gradient(145deg,#191316,#08080a_60%,#50101a)] p-8">
            <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-casino-black/70 p-6 shadow-premium">
              <div className="mb-6 flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-casino-gold/40 bg-casino-gold/10 text-casino-gold">
                  <CircuitBoard aria-hidden="true" />
                </div>
                <Sparkles className="text-casino-gold" aria-hidden="true" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-casino-gold">
                Hardware visual pending
              </p>
              <h3 className="mt-4 text-3xl font-black leading-none text-casino-ivory">
                Espacio reservado para el montaje real.
              </h3>
              <p className="mt-5 text-sm leading-7 text-casino-muted">
                Sustituir más adelante con una imagen final del prototipo.
                La composición ya está preparada para imagen del prototipo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
