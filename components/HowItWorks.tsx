import { PROCESS_STEPS } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

export function HowItWorks() {
  return (
    <section className="bg-ink-soft py-24 md:py-32" id="process">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Processus"
          title="Comment ça fonctionne"
          subtitle="Un accompagnement simple et transparent, de l'étude initiale au suivi permanent."
        />

        <div className="relative">
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent md:left-1/2 md:block" />

          <div className="space-y-12 md:space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div
                  className={`relative flex flex-col gap-6 md:flex-row md:items-center ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div className="absolute left-8 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 border-gold bg-ink md:left-1/2 md:block" />
                  <div
                    className={`md:w-1/2 ${
                      i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"
                    }`}
                  >
                    <div className="ml-16 rounded-2xl border border-white/5 bg-ink-muted p-8 md:ml-0">
                      <span className="font-display text-3xl font-bold text-gold/30">
                        {step.step}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-semibold text-cream">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/55">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
