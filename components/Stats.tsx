import { STATS } from "@/lib/data";
import { Counter, Reveal, SectionHeader } from "./ui/motion";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-ink-soft py-24 md:py-32" id="chiffres">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,98,0.08),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Chiffres clés"
          title="Une présence solide à Genève"
          subtitle="Des résultats concrets qui témoignent de notre engagement et de notre réactivité."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="rounded-2xl border border-gold/10 bg-ink p-8 text-center">
                <p className="font-display text-5xl font-semibold text-gold md:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-sm font-medium text-white/60">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
