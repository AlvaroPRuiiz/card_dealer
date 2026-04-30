import { Code2, Download, FileText, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { DealSimulator } from "../components/DealSimulator";
import { PageTransition } from "../components/PageTransition";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { VideoFrame } from "../components/VideoFrame";
import { assetPaths } from "../data/site";

export function ResourcesPage() {
  return (
    <PageTransition>
      <section className="mx-auto w-[min(1180px,calc(100%-28px))] py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Recursos"
            title="Manual, demo y simulación en un único espacio."
            text="Una página preparada para enseñar el proyecto sin dispersar documentación ni recursos clave."
          />
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

        <Reveal className="mt-10">
          <VideoFrame large />
        </Reveal>

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
