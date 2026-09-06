import Link from "next/link";
import { FormationHero } from "@/components/formation/FormationHero";
import {
  ModulesSection,
  VideoSection,
} from "@/components/formation/ModulesSection";
import { StorySection } from "@/components/formation/StorySection";
import { TestimonialsSection } from "@/components/formation/TestimonialsSection";
import { FaqSection } from "@/components/formation/FaqSection";
import { OffersStrip } from "@/components/formation/OffersStrip";
import { FORMATION } from "@/lib/formation/content";

export default function FormationPage() {
  return (
    <>
      <FormationHero />
      <StorySection />
      <VideoSection />
      <ModulesSection />
      <OffersStrip />
      <TestimonialsSection />
      <FaqSection />

      <section className="section-night px-6 py-16 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="formation-title text-3xl md:text-4xl">Prêt à démarrer ?</h2>
          <p className="formation-body mt-4 text-sm">
            Pack {FORMATION.ebookPrice} CHF · Appel {FORMATION.coachingCallPrice} CHF
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/formation/pricing" className="formation-btn-primary inline-flex">
              Formation café — {FORMATION.ebookPrice} CHF
            </Link>
            <Link href="/formation/pricing#appel" className="formation-btn-ghost inline-flex">
              Appel — {FORMATION.coachingCallPrice} CHF
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
