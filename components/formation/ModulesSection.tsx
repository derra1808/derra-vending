import Link from "next/link";
import { LANDING_BENEFITS, MODULES, FORMATION } from "@/lib/formation/content";
import { SectionHeading } from "./SectionHeading";

export function VideoSection() {
  return (
    <section id="video" className="section-night px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading label="60 secondes" title="Comment ça marche" />
        <div
          className="mt-10 overflow-hidden"
          style={{ border: "1px solid color-mix(in srgb, var(--d-gold) 35%, transparent)" }}
        >
          <video
            className="aspect-video w-full object-cover"
            style={{ backgroundColor: "var(--d-night)" }}
            controls
            poster="/gallery/realisation-06.png"
          >
            <source src="/formation/presentation.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  );
}

export function ModulesSection() {
  return (
    <section id="contenu" className="section-cream py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading
          label="Le pack"
          title="Ce que tu reçois"
          description="Tout pour démarrer. Pas de blabla."
        />

        <ul className="formation-body mt-12 space-y-4 text-sm md:text-base">
          {LANDING_BENEFITS.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="formation-accent shrink-0">—</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-3 sm:grid-cols-5">
          {MODULES.map((m) => (
            <div key={m.id} className="formation-card p-4 text-center">
              <p className="formation-accent text-lg font-semibold">0{m.id}</p>
              <p className="formation-title mt-2 text-sm leading-snug">{m.title}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/formation/pricing" className="formation-btn-primary inline-flex">
            Obtenir le pack — {FORMATION.ebookPrice} CHF
          </Link>
        </div>
      </div>
    </section>
  );
}
