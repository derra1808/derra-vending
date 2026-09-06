import { CheckoutButton } from "@/components/formation/CheckoutButton";
import { OfferCard } from "@/components/formation/OffersStrip";
import { SectionHeading } from "@/components/formation/SectionHeading";
import { SetupNotice } from "@/components/formation/SetupNotice";
import {
  FORMATION,
  FORMATION_PRODUCTS,
  MODULES,
} from "@/lib/formation/content";
import { FAQ_ITEMS, FORMATION_OFFER, VALUE_STACK } from "@/lib/formation/offer";
import { getSetupStatus } from "@/lib/formation/config";

export default function PricingPage() {
  const setup = getSetupStatus();
  const stackTotal = VALUE_STACK.reduce((s, i) => s + i.value, 0);
  const cafe = FORMATION_PRODUCTS.find((p) => p.id === "cafe")!;
  const call = FORMATION_PRODUCTS.find((p) => p.id === "call")!;

  return (
    <div className="section-cream px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          label="Offre"
          title="Tarifs formation"
          description="Pack méthode maintenant, ou appel 1h avec mes fournisseurs."
        />

        {!setup.ready && <SetupNotice setup={setup} />}

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {FORMATION_PRODUCTS.map((p) => (
            <OfferCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-xl" id="cafe">
          <div className="formation-card p-8 md:p-10">
            <p className="formation-label">Détail — formation café</p>
            <h2 className="formation-title mt-4 text-3xl">{FORMATION.title}</h2>
            <div className="mt-6 flex items-end gap-3">
              <span className="formation-title formation-accent text-5xl">{cafe.price}</span>
              <span className="formation-body mb-2 text-lg">{FORMATION.currency}</span>
              {cafe.originalPrice && (
                <span className="formation-body mb-2 ml-2 text-sm line-through opacity-50">
                  {cafe.originalPrice} {FORMATION.currency}
                </span>
              )}
            </div>
            <p className="formation-body mt-2 text-xs">
              Valeur perçue : {stackTotal} {FORMATION.currency}
            </p>
            <ul
              className="formation-body mt-8 space-y-3 pt-6 text-sm"
              style={{
                borderTop: "1px solid color-mix(in srgb, var(--d-night) 12%, transparent)",
              }}
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
                label={`Accéder — ${cafe.price} CHF`}
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

        <div className="mt-28" id="appel">
          <SectionHeading
            label="Appel"
            title="Appel Q&R + mes fournisseurs"
            description="1 heure avec Ibrahim. Tu poses tes questions — et tu repars avec ses contacts fournisseurs."
          />
          <div className="mx-auto mt-16 max-w-xl">
            <div
              className="formation-card p-10"
              style={{ borderColor: "color-mix(in srgb, var(--d-gold) 50%, transparent)" }}
            >
              <p className="formation-label">{call.name}</p>
              <p className="formation-title formation-accent mt-4 text-4xl">
                {call.price}{" "}
                <span className="formation-body text-xl">{FORMATION.currency}</span>
              </p>
              <p className="formation-body mt-4 text-sm">{call.description}</p>
              <ul className="formation-body mt-8 space-y-2 text-sm">
                {call.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span className="formation-accent">—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <CheckoutButton
                  product="coaching_call"
                  label={`Réserver — ${call.price} CHF`}
                  className="formation-btn-primary flex w-full items-center justify-center disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
