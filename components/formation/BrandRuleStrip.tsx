import { BUSINESS_GOLD_RULE } from "@/lib/formation/offer";

export function BrandRuleStrip() {
  return (
    <section className="formation-rule px-6">
      <p className="formation-label">La règle d&apos;or</p>
      <p className="formation-body mt-4 text-sm md:text-base">{BUSINESS_GOLD_RULE}</p>
      <p className="formation-label mt-6 text-[10px]">Derra Vending — Méthode Genève · Europe</p>
    </section>
  );
}
