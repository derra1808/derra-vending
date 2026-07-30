import { FOUNDER_STORY } from "@/lib/formation/content";

/** Histoire courte — 3 chiffres, une phrase */
export function StorySection() {
  return (
    <section id="histoire" className="section-cream py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="formation-label">En vrai</p>
        <h2 className="formation-title mt-3 text-3xl md:text-4xl">
          De 5 machines à 40
        </h2>
        <p className="formation-body mx-auto mt-4 max-w-xl text-sm md:text-base">
          {FOUNDER_STORY.intro}
        </p>

        <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
          <div>
            <p className="formation-title formation-accent text-3xl md:text-4xl">5</p>
            <p className="formation-body mt-2 text-xs md:text-sm">machines au départ</p>
          </div>
          <div>
            <p className="formation-title formation-accent text-3xl md:text-4xl">&lt;500</p>
            <p className="formation-body mt-2 text-xs md:text-sm">CHF / mois</p>
          </div>
          <div>
            <p className="formation-title formation-accent text-3xl md:text-4xl">
              {FOUNDER_STORY.today.machines}
            </p>
            <p className="formation-body mt-2 text-xs md:text-sm">machines aujourd&apos;hui</p>
          </div>
        </div>

        <p className="formation-body mt-10 text-sm italic opacity-80">
          &ldquo;{FOUNDER_STORY.quote}&rdquo; — Ibrahim
        </p>
      </div>
    </section>
  );
}
