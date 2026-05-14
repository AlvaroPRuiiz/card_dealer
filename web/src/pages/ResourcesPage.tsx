import { Code2, Download, FileText, Sparkles, Video } from "lucide-react";
import { Button } from "../components/Button";
import { DealSimulator } from "../components/DealSimulator";
import { PageTransition } from "../components/PageTransition";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { assetPaths } from "../data/site";

const prototypeVideos = [
  {
    src: assetPaths.platformVideo,
    poster: assetPaths.prototype,
    title: "Movimiento de la plataforma",
    description:
      "Prueba real del sistema de giro y validación del movimiento de la base rotatoria.",
  },
  {
    src: assetPaths.cardFeedVideo,
    poster: assetPaths.productHero,
    title: "Paso de carta",
    description: "Prueba del mecanismo de reparto y arrastre individual de carta.",
  },
];

export function ResourcesPage() {
  return (
    <PageTransition>
      <section className="mx-auto w-[min(1180px,calc(100%-28px))] py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Recursos"
            title="Pruebas reales, manual y simulación en un único espacio."
            text="Materiales disponibles para conocer las pruebas realizadas, la evolución del sistema y la base técnica del prototipo."
          />
        </Reveal>

        <Reveal className="mt-12">
          <section className="rounded-[2rem] border border-casino-gold/25 bg-[radial-gradient(circle_at_82%_10%,rgba(214,169,79,0.12),transparent_20rem),rgba(255,255,255,0.02)] p-5 shadow-premium md:p-7">
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                  Pruebas del prototipo
                </p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-casino-ivory md:text-5xl">
                  Validación de subsistemas.
                </h2>
              </div>
              <p className="max-w-xl leading-8 text-casino-muted">
                Los vídeos disponibles muestran pruebas reales de subsistemas del prototipo,
                como el giro de plataforma y el avance de cartas. Se presentan como evidencias
                parciales de validación, no como demostración final de extremo a extremo.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {prototypeVideos.map((video) => (
                <article
                  key={video.src}
                  className="premium-panel overflow-hidden rounded-[1.6rem] border"
                >
                  <div className="relative bg-casino-black">
                    <video
                      className="aspect-video w-full bg-casino-black object-contain"
                      src={video.src}
                      poster={video.poster}
                      controls
                      preload="auto"
                      playsInline
                      aria-label={video.title}
                    />
                    <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
                  </div>
                  <div className="p-6">
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
                      <Video size={18} aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-casino-ivory">{video.title}</h3>
                    <p className="mt-3 leading-7 text-casino-muted">{video.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <article className="premium-panel h-full rounded-[2rem] border p-7">
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
                <FileText aria-hidden="true" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                Manual de usuario
              </p>
              <h2 className="mt-4 text-3xl font-black text-casino-ivory">
                Montaje, uso, mantenimiento e incidencias.
              </h2>
              <p className="mt-5 leading-8 text-casino-muted">
                El PDF recoge el uso del prototipo, la puesta en marcha y las comprobaciones
                necesarias antes de operar el sistema físico.
              </p>
              <Button href={assetPaths.manual} download className="mt-8">
                <Download size={17} aria-hidden="true" />
                Descargar manual
              </Button>
            </article>
          </Reveal>

          <Reveal delay={0.05}>
            <article className="premium-panel h-full rounded-[2rem] border p-7">
              <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
                <Code2 aria-hidden="true" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                Guía de software
              </p>
              <h2 className="mt-4 text-3xl font-black text-casino-ivory">
                Arquitectura, FSM, sensores y calibración.
              </h2>
              <p className="mt-5 leading-8 text-casino-muted">
                Documento técnico con la organización del firmware, control por estados,
                diagnóstico, mapa de pines y criterios de calibración.
              </p>
              <Button href={assetPaths.softwareGuide} download className="mt-8">
                <Download size={17} aria-hidden="true" />
                Descargar guía
              </Button>
            </article>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
              <Sparkles aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-casino-gold">
                Simulación
              </p>
              <h2 className="text-3xl font-black text-casino-ivory">
                Reparto lógico con slots y jugadores.
              </h2>
            </div>
          </div>
          <DealSimulator />
        </Reveal>
      </section>
    </PageTransition>
  );
}
