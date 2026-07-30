import { CLIENT_TYPES, FAKE_LOGOS } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

export function Clients() {
  return (
    <section className="border-y border-white/5 bg-ink py-24 md:py-32" id="clients">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Nos clients"
          title="Ils nous font confiance"
          subtitle="Entreprises, chantiers, commerces, tabacs, centres médicaux et administrations — déjà équipés à Genève et environs."
        />

        <Reveal>
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            {CLIENT_TYPES.map((type) => (
              <span
                key={type}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70"
              >
                {type}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {FAKE_LOGOS.map((logo) => (
              <div
                key={logo}
                className="flex h-20 items-center justify-center rounded-xl border border-white/5 bg-ink-muted px-4"
              >
                <span className="text-center text-xs font-semibold uppercase tracking-wider text-white/30">
                  {logo}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-white/35">
            Logos partenaires à venir — remplacez par vos références clients réelles.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
