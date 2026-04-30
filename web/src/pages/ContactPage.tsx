import { Clock, Mail, Phone, ShieldCheck } from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { contactInfo } from "../data/site";

export function ContactPage() {
  return (
    <PageTransition>
      <section className="mx-auto w-[min(1180px,calc(100%-28px))] py-16 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="Contacto"
            title="Soporte ficticio con tono de producto real."
            text="Página preparada para presentar atención al cliente, soporte y contacto comercial sin activar backend ni formularios reales."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <article className="premium-panel rounded-[2rem] border p-8">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-casino-gold/35 bg-casino-gold/10 text-casino-gold">
                <ShieldCheck aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-black text-casino-ivory">
                Atención ELCO-DEALER
              </h2>
              <p className="mt-5 leading-8 text-casino-muted">
                Para consultas sobre demo, integración, reserva conceptual o documentación
                técnica del prototipo, estos canales mantienen la identidad de marca pública.
              </p>
            </article>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: Phone,
                title: "Teléfono",
                value: contactInfo.phone,
                text: "Línea ficticia de atención comercial.",
              },
              {
                icon: Mail,
                title: "Soporte",
                value: contactInfo.supportEmail,
                text: "Consultas técnicas y seguimiento.",
              },
              {
                icon: Mail,
                title: "General",
                value: contactInfo.helloEmail,
                text: "Contacto para colaboraciones y demo.",
              },
              {
                icon: Clock,
                title: "Horario",
                value: contactInfo.schedule,
                text: "Respuesta prioritaria en días lectivos.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.04}>
                  <article className="premium-panel h-full rounded-3xl border p-6">
                    <Icon className="text-casino-gold" aria-hidden="true" />
                    <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-casino-gold">
                      {item.title}
                    </p>
                    <h3 className="mt-3 break-words text-xl font-black text-casino-ivory">
                      {item.value}
                    </h3>
                    <p className="mt-3 leading-7 text-casino-muted">{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
