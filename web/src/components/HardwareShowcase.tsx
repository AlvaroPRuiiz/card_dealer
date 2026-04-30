import { CircuitBoard, Sparkles } from "lucide-react";
import { assetPaths } from "../data/site";
import { useAssetAvailability } from "./AssetAwareMedia";

export function HardwareShowcase() {
  const availability = useAssetAvailability(assetPaths.hardware);

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-casino-gold/10 blur-3xl" />
      <div className="premium-panel relative overflow-hidden rounded-[2rem] border gold-line">
        <div className="absolute right-6 top-6 z-10 rounded-full border border-casino-gold/30 bg-casino-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
          Prototype 01
        </div>

        {availability === "available" ? (
          <img
            className="aspect-[4/5] w-full object-cover"
            src={assetPaths.hardware}
            alt="Montaje hardware del prototipo ELCO-DEALER"
          />
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
                Sustituir más adelante con{" "}
                <span className="font-mono text-casino-amber">/assets/montaje_hw.png</span>.
                La composición ya está preparada para imagen de producto.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
