import {
  Banknote,
  CreditCard,
  Package,
  Smartphone,
  Truck,
  Wrench,
} from "lucide-react";
import { WHY_CHOOSE } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

const ICONS = {
  install: Truck,
  invest: Banknote,
  maintain: Wrench,
  stock: Package,
  payment: CreditCard,
  speed: Smartphone,
} as const;

export function WhyChoose() {
  return (
    <section className="bg-ink-soft py-24 md:py-32" id="avantages">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Pourquoi nous"
          title="Pourquoi choisir Derra Vending"
          subtitle="Une solution complète, sans investissement de votre part. Nous prenons en charge l'installation, l'exploitation et la maintenance."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE.map((item, i) => {
            const Icon = ICONS[item.icon as keyof typeof ICONS];
            return (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-white/5 bg-ink-muted p-8 transition hover:border-gold/20 hover:shadow-gold">
                  <div className="mb-5 inline-flex rounded-xl bg-gold/10 p-3 text-gold transition group-hover:bg-gold/20">
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-cream">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/55">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
