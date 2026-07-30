import { TESTIMONIALS_FORMATION } from "@/lib/formation/content";

/** Une seule ligne de preuves — court */
export function TestimonialsSection() {
  return (
    <section id="temoignages" className="section-night px-6 py-14 md:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="formation-label text-center">Ils ont commencé</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS_FORMATION.map((t) => (
            <blockquote key={t.author}>
              <p className="formation-body text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="formation-label mt-4 text-[10px]">
                {t.author} · {t.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
