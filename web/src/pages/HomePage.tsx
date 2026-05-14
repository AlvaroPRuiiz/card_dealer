import { PageTransition } from "../components/PageTransition";
import { Engineering } from "../sections/Engineering";
import { Hero } from "../sections/Hero";
import { Highlights } from "../sections/Highlights";
import { PrototypeTestsSection } from "../sections/PrototypeTestsSection";
import { Reservation } from "../sections/Reservation";

export function HomePage() {
  return (
    <PageTransition>
      <Hero />
      <Highlights />
      <PrototypeTestsSection />
      <Engineering />
      <Reservation />
    </PageTransition>
  );
}
