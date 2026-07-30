import Link from "next/link";
import { FormationHero } from "@/components/formation/FormationHero";
import {
  ModulesSection,
  VideoSection,
} from "@/components/formation/ModulesSection";
import { StorySection } from "@/components/formation/StorySection";
import { TestimonialsSection } from "@/components/formation/TestimonialsSection";
import { FaqSection } from "@/components/formation/FaqSection";
import { FORMATION } from "@/lib/formation/content";

export default function FormationPage() {
  return (
    <>
      <FormationHero />
      <StorySection />
      <VideoSection />
      <ModulesSection />
      <TestimonialsSection />
      <FaqSection />

      <section className="section-night px-6 py-16 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="formation-title text-3xl md:text-4xl">Prêt à démarrer ?</h2>
          <p className="formation-body mt-4 text-sm">
            Pack complet · accès immédiat · {FORMATION.ebookPrice} CHF
          </p>
          <Link href="/formation/pricing" className="formation-btn-primary mt-8 inline-flex">
            Obtenir le pack — {FORMATION.ebookPrice} CHF
          </Link>
        </div>
      </section>
    </>
  );
}
