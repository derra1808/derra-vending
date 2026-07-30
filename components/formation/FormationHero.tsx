import Link from "next/link";
import Image from "next/image";
import { FORMATION } from "@/lib/formation/content";

export function FormationHero() {
  return (
    <section className="section-night relative px-6 pb-20 pt-14 md:pb-28 md:pt-20">
      <div className="relative mx-auto max-w-2xl text-center">
        <div className="relative mx-auto mb-7 h-20 w-20 overflow-hidden rounded-full">
          <Image
            src="/brand/logo.png"
            alt="Derra Vending"
            fill
            className="object-cover object-center"
            sizes="80px"
            priority
          />
        </div>

        <p className="formation-label">Derra Vending · Europe</p>

        <h1 className="formation-title mt-5 text-4xl leading-[1.05] md:text-6xl">
          {FORMATION.title}
        </h1>

        <p className="formation-body mx-auto mt-6 max-w-lg text-base md:text-lg">
          {FORMATION.subtitle}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/formation/pricing" className="formation-btn-primary w-full sm:w-auto">
            Obtenir le pack — {FORMATION.ebookPrice} CHF
          </Link>
          <a href="#contenu" className="formation-btn-ghost w-full sm:w-auto">
            Voir ce qu&apos;il y a dedans
          </a>
        </div>

        <p className="formation-body mt-8 text-sm" style={{ opacity: 0.75 }}>
          <span className="formation-key font-semibold">
            {FORMATION.ebookPrice} CHF
          </span>
          <span className="ml-2 line-through opacity-50">
            {FORMATION.ebookOriginalPrice} CHF
          </span>
          {" · Accès immédiat"}
        </p>
      </div>
    </section>
  );
}
