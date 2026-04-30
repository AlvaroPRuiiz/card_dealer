import { VideoFrame } from "../components/VideoFrame";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";

export function DemoSection() {
  return (
    <section id="demo" className="border-t border-white/10 py-24">
      <div className="mx-auto w-[min(1180px,calc(100%-28px))]">
        <Reveal>
          <SectionHeading
            eyebrow="Demo"
            title="La mecánica es el momento."
            text="La sección queda lista para alojar la demo final del reparto, sin autoplay y con una presentación sobria de producto premium."
            align="center"
          />
        </Reveal>
        <Reveal className="mt-12">
          <VideoFrame />
        </Reveal>
      </div>
    </section>
  );
}
