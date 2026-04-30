import { PageTransition } from "../components/PageTransition";
import { DemoSection } from "../sections/DemoSection";
import { Engineering } from "../sections/Engineering";
import { Hero } from "../sections/Hero";
import { Highlights } from "../sections/Highlights";
import { Reservation } from "../sections/Reservation";

export function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <Highlights />
      <DemoSection />
      <Engineering />
      <Reservation />
    </PageTransition>
  );
}
