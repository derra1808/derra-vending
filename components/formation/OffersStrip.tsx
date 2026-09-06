import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FORMATION, FORMATION_PRODUCTS } from "@/lib/formation/content";

type Product = (typeof FORMATION_PRODUCTS)[number];

function offerHref(p: Product) {
  if (p.id === "call") return "/formation/pricing#appel";
  return "/formation/pricing#cafe";
}

export function OfferCard({
  product: p,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  const isNight = p.id === "call";
  const href = offerHref(p);

  return (
    <Link
      href={href}
      className={`formation-offer group flex flex-col ${isNight ? "formation-offer--night" : ""} ${
        p.featured ? "formation-offer--featured" : ""
      } ${compact ? "p-6" : "p-7 md:p-8"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="formation-label">{p.name}</p>
        <span className="formation-offer-badge">{p.badge}</span>
      </div>

      <p
        className={`formation-title mt-5 ${compact ? "text-3xl" : "text-4xl"}`}
        style={{ color: isNight ? "var(--d-gold)" : "var(--d-night)" }}
      >
        {p.price}{" "}
        <span className="text-lg font-normal opacity-70">{FORMATION.currency}</span>
      </p>

      {p.originalPrice ? (
        <p className="mt-1 text-xs line-through opacity-45">
          {p.originalPrice} {FORMATION.currency}
        </p>
      ) : null}

      <p
        className="mt-4 text-sm font-medium leading-snug"
        style={{ color: isNight ? "var(--d-cream)" : "var(--d-night)" }}
      >
        {p.hook}
      </p>
      <p className="formation-body mt-2 text-xs opacity-75">{p.role}</p>

      <ul className="formation-body mt-6 flex-1 space-y-2.5 text-sm">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <span className="formation-accent shrink-0">—</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <span
        className="formation-btn-primary mt-8 inline-flex w-full items-center justify-center gap-2"
      >
        {p.cta}
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function OffersStrip() {
  return (
    <section id="tarifs" className="section-cream px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="formation-label text-center">Tarifs</p>
        <h2 className="formation-title mt-4 text-center text-3xl md:text-5xl">
          Choisis ton offre
        </h2>
        <p className="formation-body mx-auto mt-4 max-w-lg text-center text-sm md:text-base">
          Deux choix. La méthode maintenant, ou l’appel avec mes fournisseurs.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FORMATION_PRODUCTS.map((p) => (
            <OfferCard key={p.id} product={p} />
          ))}
        </div>

        <p className="formation-body mx-auto mt-10 max-w-md text-center text-xs opacity-70">
          Accès immédiat au pack. L’appel, c’est 1h + mes contacts fournisseurs.
        </p>
      </div>
    </section>
  );
}
