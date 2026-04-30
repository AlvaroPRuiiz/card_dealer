import { CircuitBoard, Play, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/Button";
import { HardwareShowcase } from "../components/HardwareShowcase";
import { routes } from "../data/site";

export function Hero() {
  return (
    <section className="mx-auto grid min-h-[calc(100svh-5rem)] w-[min(1180px,calc(100%-28px))] items-center gap-12 py-16 lg:grid-cols-[0.92fr_1.08fr] lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="mb-7 inline-flex rounded-full border border-casino-gold/30 bg-casino-gold/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
          Casino-tech prototype
        </p>
        <h1 className="text-6xl font-black leading-[0.86] tracking-tight text-casino-ivory sm:text-7xl lg:text-8xl">
          ELCO<span className="text-casino-gold">-</span>
          <br />
          DEALER
        </h1>
        <p className="mt-8 max-w-2xl text-3xl font-black leading-tight text-casino-ivory md:text-4xl">
          Sistema automático de reparto de cartas.
        </p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-casino-muted">
          Un prototipo funcional que combina mecánica, sensores, motores y una FSM robusta
          para repartir cartas con una cadencia limpia y repetible.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/#demo">
            <Play size={17} aria-hidden="true" />
            Ver demo
          </Button>
          <Button to={routes.purchase} tone="ghost">
            <ShoppingBag size={17} aria-hidden="true" />
            Comprar / Reservar
          </Button>
          <Button href="/#engineering" tone="dark">
            <CircuitBoard size={17} aria-hidden="true" />
            Explorar ingeniería
          </Button>
        </div>

        <dl className="mt-10 grid max-w-xl grid-cols-3 gap-3">
          {[
            ["Jugadores", "2-6"],
            ["Cartas", "1-10"],
            ["Control", "FSM"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-casino-gold/20 bg-white/[0.03] p-4"
            >
              <dt className="text-xs text-casino-muted">{label}</dt>
              <dd className="mt-1 font-mono text-lg font-black text-casino-amber">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <HardwareShowcase />
      </motion.div>
    </section>
  );
}
