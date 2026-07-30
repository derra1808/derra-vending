import { Coffee, CupSoda, Layers, Package } from "lucide-react";
import { SOLUTIONS } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

const ICONS = {
  coffee: Coffee,
  drinks: CupSoda,
  snacks: Package,
  custom: Layers,
} as const;

export function Solutions() {
  return (
    <section className="bg-ink py-24 md:py-32" id="solutions">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Nos solutions"
          title="Des distributeurs adaptés à chaque besoin"
          subtitle="Machines haute capacité pour entreprises et chantiers, solutions compactes Necta et Jura pour commerces et kiosques."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {SOLUTIONS.map((item, i) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <Reveal key={item.title} delay={i * 0.1}>
                <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-ink-muted to-ink p-8 transition hover:border-gold/25">
                  <div className="absolute right-6 top-6 rounded-full border border-gold/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gold">
                    {item.tag}
                  </div>
                  <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-4 text-gold">
                    <Icon className="h-7 w-7" strokeWidth={1.25} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
                    {item.description}
                  </p>
                  <div className="mt-6 h-px w-12 bg-gold/40 transition group-hover:w-24" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
