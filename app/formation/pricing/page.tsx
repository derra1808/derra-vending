import { CheckoutButton } from "@/components/formation/CheckoutButton";
import { SectionHeading } from "@/components/formation/SectionHeading";
import { SetupNotice } from "@/components/formation/SetupNotice";
import {
  COACHING_OPTIONS,
  FORMATION,
  MODULES,
} from "@/lib/formation/content";
import {
  FAQ_ITEMS,
  FORMATION_OFFER,
  VALUE_STACK,
} from "@/lib/formation/offer";
import { getSetupStatus } from "@/lib/formation/config";

export default function PricingPage() {
  const setup = getSetupStatus();
  const stackTotal = VALUE_STACK.reduce((s, i) => s + i.value, 0);

  return (
    <div className="section-cream px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Offre"
          title="Pack formation — 50 CHF"
          description="Ebook + contrat + scripts + checklist + calculateur + espace vidéo. Accès immédiat."
        />

        {!setup.ready && <SetupNotice setup={setup} />}

        <div className="mx-auto mt-16 max-w-xl">
          <div className="formation-card p-8 md:p-10">
            <p className="formation-label">Pack complet</p>
            <h2 className="formation-title mt-4 text-3xl">{FORMATION.title}</h2>

            <div className="mt-8 flex items-end gap-3">
              <span className="formation-title formation-accent text-5xl">
                {FORMATION.ebookPrice}
              </span>
              <span className="formation-body mb-2 text-lg">{FORMATION.currency}</span>
              <span className="formation-body mb-2 ml-2 text-sm line-through">
                {FORMATION.ebookOriginalPrice} {FORMATION.currency}
              </span>
            </div>
            <p className="formation-body mt-2 text-xs">
              Valeur perçue du pack : {stackTotal} {FORMATION.currency}
            </p>

            <ul
              className="formation-body mt-8 space-y-3 pt-6 text-sm"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--d-night) 12%, transparent)" }}
            >
              {VALUE_STACK.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    <span className="formation-accent">—</span> {item.name}
                    <span className="mt-0.5 block text-xs opacity-70">{item.description}</span>
                  </span>
                  <span className="shrink-0 text-xs line-through opacity-50">
                    {item.value} CHF
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <p className="formation-label mb-3">Au programme</p>
              <ul className="formation-body space-y-2 text-sm">
                {MODULES.map((m) => (
                  <li key={m.id}>
                    <span className="formation-accent">0{m.id}</span>
                    {" — "}
                    {m.title}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              <CheckoutButton
                product="ebook"
                label={`Accéder au pack — ${FORMATION.ebookPrice} CHF`}
                className="formation-btn-primary flex w-full items-center justify-center disabled:opacity-60"
              />
            </div>

            <p className="formation-body mt-6 text-center text-xs leading-relaxed">
              {FORMATION_OFFER.guaranteeText}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-2xl">
          <SectionHeading label="FAQ" title="Questions fréquentes" />
          <div className="mt-12 space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="formation-card p-6">
                <h3 className="formation-title text-lg">{item.q}</h3>
                <p className="formation-body mt-3 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-28">
          <SectionHeading
            label="Coaching"
            title="Accompagnement personnalisé"
            description="Pour aller plus loin : suivi direct et contacts fournisseurs."
          />

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {COACHING_OPTIONS.map((opt) => (
              <div key={opt.id} className="formation-card p-10">
                <p className="formation-label">{opt.name}</p>
                <p className="formation-title formation-accent mt-4 text-4xl">
                  {opt.price}{" "}
                  <span className="formation-body text-xl">{FORMATION.currency}</span>
                </p>
                <p className="formation-body mt-4 text-sm">{opt.description}</p>
                <ul className="formation-body mt-8 space-y-2 text-sm">
                  {opt.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="formation-accent">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <CheckoutButton
                    product={opt.id === "call" ? "coaching_call" : "coaching_full"}
                    label={`Réserver — ${opt.price} CHF`}
                    className="formation-btn-ghost-dark flex w-full items-center justify-center disabled:opacity-60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
