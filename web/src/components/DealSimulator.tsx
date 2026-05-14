import { RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetPaths } from "../data/site";

const slotCount = 6;
const rotateMs = 280;
const cardIntervalMs = 920;
const cardFlightMs = 660;

type DealtCard = {
  player: number;
  order: number;
  targetSlot: number;
};

type DealCardProps = {
  card: DealtCard;
  className?: string;
  style?: CSSProperties;
};

function targetSlot(playerIndex: number, players: number) {
  return Math.floor((playerIndex * slotCount) / players);
}

function slotPosition(slotIndex: number, radiusX = 38, radiusY = 38) {
  const angle = -90 + slotIndex * (360 / slotCount);

  return {
    angle,
    x: 50 + Math.cos((angle * Math.PI) / 180) * radiusX,
    y: 50 + Math.sin((angle * Math.PI) / 180) * radiusY,
  };
}

function cardRank(order: number) {
  const ranks = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5"];
  return ranks[(order - 1) % ranks.length];
}

function DealCard({ card, className = "", style }: DealCardProps) {
  const isRed = card.order % 2 === 1;

  return (
    <span className={`sim-card ${className}`} style={style}>
      <span className="sim-card__inner">
        <span className="sim-card__side sim-card__back" aria-hidden="true">
          <span />
        </span>
        <span className={`sim-card__side sim-card__front ${isRed ? "is-red" : "is-black"}`}>
          <span className="sim-card__corner">{cardRank(card.order)}</span>
          <span className="sim-card__rank">{cardRank(card.order)}</span>
          <span className="sim-card__meta">J{card.player}</span>
        </span>
      </span>
    </span>
  );
}

export function DealSimulator() {
  const [players, setPlayers] = useState(6);
  const [cards, setCards] = useState(3);
  const [dealt, setDealt] = useState<DealtCard[]>([]);
  const [flyingCard, setFlyingCard] = useState<DealtCard | null>(null);
  const [slot, setSlot] = useState(0);
  const [phase, setPhase] = useState("READY");
  const timers = useRef<number[]>([]);

  const totalCards = players * cards;
  const platformAngle = slot * (360 / slotCount);
  const hands = useMemo(
    () =>
      Array.from({ length: players }, (_, index) => ({
        player: index + 1,
        slot: targetSlot(index, players),
        cards: dealt.filter((card) => card.player === index + 1),
      })),
    [dealt, players],
  );

  const slotMarkers = useMemo(
    () =>
      Array.from({ length: slotCount }, (_, index) => ({
        index,
        position: slotPosition(index, 38, 39),
      })),
    [],
  );

  const clearScheduledTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  const scheduleTimer = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current = timers.current.filter((current) => current !== timer);
      callback();
    }, delay);

    timers.current.push(timer);
  }, []);

  const reset = useCallback(() => {
    clearScheduledTimers();
    setDealt([]);
    setFlyingCard(null);
    setSlot(0);
    setPhase("READY");
  }, [clearScheduledTimers]);

  useEffect(() => {
    return () => clearScheduledTimers();
  }, [clearScheduledTimers]);

  const runSimulation = useCallback(() => {
    clearScheduledTimers();

    const sequence: DealtCard[] = [];
    for (let order = 0; order < totalCards; order += 1) {
      const player = (order % players) + 1;
      sequence.push({
        player,
        order: order + 1,
        targetSlot: targetSlot(player - 1, players),
      });
    }

    setPhase("AUTO_INIT");
    setDealt([]);
    setFlyingCard(null);
    setSlot(0);

    sequence.forEach((card, index) => {
      const startAt = index * cardIntervalMs + 180;

      scheduleTimer(() => {
        setPhase("ROTATE_AUTO");
        setSlot(card.targetSlot);
        setFlyingCard(null);
      }, startAt);

      scheduleTimer(() => {
        setPhase("PUSH_AUTO");
        setFlyingCard(card);
      }, startAt + rotateMs);

      scheduleTimer(() => {
        setDealt((current) => [...current, card]);
        setFlyingCard(null);
      }, startAt + rotateMs + cardFlightMs);
    });

    scheduleTimer(() => {
      setSlot(0);
      setFlyingCard(null);
      setPhase("READY");
    }, sequence.length * cardIntervalMs + rotateMs + cardFlightMs + 260);
  }, [clearScheduledTimers, players, scheduleTimer, totalCards]);

  const activeTarget = flyingCard ? slotPosition(flyingCard.targetSlot, 37, 38) : null;
  const flightStyle =
    flyingCard && activeTarget
      ? ({
          "--card-target-x": `${activeTarget.x}%`,
          "--card-target-y": `${activeTarget.y}%`,
          "--card-target-rotate": `${activeTarget.angle + 90}deg`,
          "--card-flight-ms": `${cardFlightMs}ms`,
        } as CSSProperties)
      : undefined;

  return (
    <div className="premium-panel overflow-hidden rounded-[2rem] border gold-line">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="logic-table relative min-h-[650px] overflow-hidden p-4 sm:min-h-[650px] sm:p-5">
          <div className="absolute inset-[6%] rounded-full border border-casino-gold/35 shadow-[inset_0_0_80px_rgba(214,169,79,0.08)]" />
          <div className="absolute inset-[20%] rounded-full border border-dashed border-white/15" />
          <div className="absolute inset-[33%] rounded-full border border-white/10" />

          {slotMarkers.map(({ index, position }) => (
            <span
              key={index}
              className={`slot-marker ${slot === index ? "is-active" : ""}`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              {index === 0 ? "HOME" : `S${index}`}
            </span>
          ))}

          <div
            className="dealer-platform"
            style={{ "--platform-angle": `${platformAngle}deg` } as CSSProperties}
          >
            <div className="dealer-platform__shadow" />
            <img
              alt="Montaje real ELCO Dealer con fondo transparente"
              className="dealer-platform__image"
              draggable="false"
              src={assetPaths.prototype}
            />
            <span className="dealer-platform__deck" aria-hidden="true">
              <span />
            </span>
          </div>

          {flyingCard && flightStyle ? (
            <DealCard
              key={flyingCard.order}
              card={flyingCard}
              className="sim-card--flying"
              style={flightStyle}
            />
          ) : null}

          <div className="absolute left-4 top-4 z-30 rounded-xl border border-casino-gold/25 bg-casino-black/65 px-3 py-2 font-mono text-[10px] font-black uppercase text-casino-amber shadow-xl backdrop-blur">
            {dealt.length}/{totalCards} cartas
          </div>

          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 translate-y-[7.2rem] rounded-full border border-casino-gold/35 bg-casino-black/75 px-5 py-2 font-mono text-[10px] font-black uppercase tracking-wider text-casino-amber shadow-xl backdrop-blur">
            {phase}
          </div>

          {hands.map((hand) => {
            const position = slotPosition(hand.slot, 37, 38);

            return (
              <article
                key={hand.player}
                className={`slot-hand ${slot === hand.slot ? "is-active" : ""}`}
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <div className="slot-hand__label">
                  <span>J{hand.player}</span>
                  <span>
                    {hand.cards.length}/{cards}
                  </span>
                </div>
                <div className="slot-hand__cards">
                  {hand.cards.slice(-4).map((card, index) => (
                    <DealCard
                      key={card.order}
                      card={card}
                      className="sim-card--dealt"
                      style={
                        {
                          "--dealt-offset": `${index * 0.48}rem`,
                          "--dealt-rotate": `${index * 4 - 5}deg`,
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <aside className="grid content-center gap-6 border-t border-casino-gold/20 bg-casino-black/70 p-6 lg:border-l lg:border-t-0">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
              Simulaci&oacute;n l&oacute;gica
            </p>
            <h3 className="mt-3 text-2xl font-black text-casino-ivory">
              Reparto f&iacute;sico simulado con giro, empuje y llegada al slot.
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
              reset();
              setPhase("INIT");
              scheduleTimer(() => setPhase("READY"), 300);
            }}
          >
            <Shuffle size={16} aria-hidden="true" />
            Reiniciar baraja l&oacute;gica
          </button>
        </aside>
      </div>
    </div>
  );
}
