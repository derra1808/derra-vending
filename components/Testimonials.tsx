import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

export function Testimonials() {
  return (
    <section className="bg-ink py-24 md:py-32" id="temoignages">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Témoignages"
          title="Ce que disent nos partenaires"
          subtitle="La confiance de nos clients est notre meilleure référence."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.1}>
              <blockquote className="flex h-full flex-col rounded-2xl border border-white/5 bg-ink-muted p-8">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-gold text-gold"
                    />
                  ))}
                </div>
                <p className="flex-1 text-base leading-relaxed text-white/70">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-6 border-t border-white/5 pt-6">
                  <cite className="not-italic">
                    <span className="font-semibold text-cream">{t.author}</span>
                    <span className="mt-1 block text-sm text-white/45">
                      {t.role}
                    </span>
                  </cite>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
