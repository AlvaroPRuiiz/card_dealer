import { RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const slotCount = 6;

type DealtCard = {
  player: number;
  order: number;
};

function targetSlot(playerIndex: number, players: number) {
  return Math.floor((playerIndex * slotCount) / players);
}

export function DealSimulator() {
  const [players, setPlayers] = useState(6);
  const [cards, setCards] = useState(3);
  const [dealt, setDealt] = useState<DealtCard[]>([]);
  const [slot, setSlot] = useState(0);
  const [phase, setPhase] = useState("READY");

  const totalCards = players * cards;
  const hands = useMemo(
    () =>
      Array.from({ length: players }, (_, index) => ({
        player: index + 1,
        slot: targetSlot(index, players),
        cards: dealt.filter((card) => card.player === index + 1),
      })),
    [dealt, players],
  );

  const runSimulation = () => {
    const sequence: DealtCard[] = [];
    for (let order = 0; order < totalCards; order += 1) {
      sequence.push({ player: (order % players) + 1, order: order + 1 });
    }

    setPhase("AUTO_INIT");
    setDealt([]);
    setSlot(0);

    sequence.forEach((card, index) => {
      window.setTimeout(() => {
        const nextSlot = targetSlot(card.player - 1, players);
        setPhase(index % 2 === 0 ? "ROTATE_AUTO" : "PUSH_AUTO");
        setSlot(nextSlot);
        setDealt((current) => [...current, card]);
      }, index * 180);
    });

    window.setTimeout(() => {
      setSlot(0);
      setPhase("READY");
    }, sequence.length * 180 + 260);
  };

  const reset = () => {
    setDealt([]);
    setSlot(0);
    setPhase("READY");
  };

  return (
    <div className="premium-panel overflow-hidden rounded-[2rem] border gold-line">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="relative min-h-[520px] overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(24,86,67,0.78),#07100d_70%)] p-5">
          <div className="absolute inset-[8%] rounded-full border border-casino-gold/30" />
          <div className="absolute inset-[24%] rounded-full border border-dashed border-white/15" />

          {Array.from({ length: slotCount }, (_, index) => {
            const angle = -90 + index * (360 / slotCount);
            const x = 50 + Math.cos((angle * Math.PI) / 180) * 38;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * 35;
            return (
              <span
                key={index}
                className={`absolute grid h-8 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[10px] font-black uppercase tracking-wider ${
                  slot === index
                    ? "border-casino-amber bg-casino-gold/20 text-casino-amber shadow-glow"
                    : "border-white/15 bg-casino-black/50 text-casino-muted"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {index === 0 ? "HOME" : `S${index}`}
              </span>
            );
          })}

          <div className="absolute left-1/2 top-1/2 grid h-44 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/10 bg-casino-black/80 shadow-premium">
            <div className="absolute left-3 top-3 rounded-lg border border-casino-gold/30 bg-black/70 px-3 py-2 font-mono text-[10px] font-black text-casino-amber">
              {phase}
            </div>
            <div className="h-24 w-16 rotate-[-7deg] rounded-lg border-2 border-casino-ivory bg-casino-ivory text-center font-display text-3xl font-black leading-[6rem] text-casino-red shadow-xl">
              A
            </div>
            <div className="absolute bottom-0 h-1.5 w-20 rounded-t-full bg-casino-gold" />
          </div>

          {hands.map((hand) => {
            const angle = -90 + hand.slot * (360 / slotCount);
            const x = 50 + Math.cos((angle * Math.PI) / 180) * 38;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * 35;
            return (
              <article
                key={hand.player}
                className="absolute min-h-24 w-28 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-casino-gold/25 bg-casino-black/80 p-3 shadow-xl"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex items-center justify-between text-[10px] font-black uppercase text-casino-amber">
                  <span>J{hand.player}</span>
                  <span>
                    {hand.cards.length}/{cards}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {hand.cards.length ? (
                    hand.cards.slice(-5).map((card) => (
                      <span
                        key={card.order}
                        className="grid h-8 w-6 place-items-center rounded border border-casino-ivory bg-casino-ivory text-[10px] font-black text-casino-red"
                      >
                        {card.order}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-casino-muted">Esperando</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="grid content-center gap-6 border-t border-casino-gold/20 bg-casino-black/70 p-6 lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
              Simulación lógica
            </p>
            <h3 className="mt-3 text-2xl font-black text-casino-ivory">
              Slots, jugadores y progreso de reparto.
            </h3>
          </div>

          <label className="grid gap-3">
            <span className="flex justify-between text-sm font-bold text-casino-muted">
              Jugadores <strong className="text-casino-amber">{players}</strong>
            </span>
            <input
              type="range"
              min="2"
              max="6"
              value={players}
              onChange={(event) => {
                setPlayers(Number(event.target.value));
                reset();
              }}
            />
          </label>

          <label className="grid gap-3">
            <span className="flex justify-between text-sm font-bold text-casino-muted">
              Cartas por jugador <strong className="text-casino-amber">{cards}</strong>
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={cards}
              onChange={(event) => {
                setCards(Number(event.target.value));
                reset();
              }}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-casino-gold bg-casino-gold px-4 font-black text-casino-black transition hover:bg-casino-amber"
              type="button"
              onClick={runSimulation}
            >
              <Sparkles size={17} aria-hidden="true" />
              Repartir
            </button>
            <button
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 font-black text-casino-ivory transition hover:border-casino-gold/40"
              type="button"
              onClick={reset}
            >
              <RotateCcw size={17} aria-hidden="true" />
              Inicio
            </button>
          </div>

          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-casino-black/60 px-4 text-sm font-black text-casino-muted transition hover:text-casino-ivory"
            type="button"
            onClick={() => {
              setDealt([]);
              setPhase("INIT");
              window.setTimeout(() => setPhase("READY"), 300);
            }}
          >
            <Shuffle size={16} aria-hidden="true" />
            Reiniciar baraja lógica
          </button>
        </aside>
      </div>
    </div>
  );
}
