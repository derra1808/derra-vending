import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { COMPANY } from "@/lib/data";

export const metadata = {
  title: "Politique de confidentialité",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-ink pt-28">
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Link href="/" className="text-sm text-gold hover:underline">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold text-cream">
            Politique de confidentialité
          </h1>

          <div className="mt-10 space-y-8 text-white/65">
            <section>
              <h2 className="font-display text-xl text-cream">
                Responsable du traitement
              </h2>
              <p className="mt-3">
                {COMPANY.name} — {COMPANY.founder}
                <br />
                {COMPANY.email}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">
                Données collectées
              </h2>
              <p className="mt-3">
                Via le formulaire de contact, nous collectons : nom, email,
                téléphone, entreprise et message. Ces données servent uniquement à
                répondre à votre demande de devis ou de visite.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Finalité</h2>
              <p className="mt-3">
                Traitement de vos demandes commerciales, prise de contact et
                suivi de la relation client. Aucune revente de données à des
                tiers.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Conservation</h2>
              <p className="mt-3">
                Les données sont conservées le temps nécessaire au traitement de
                votre demande et au suivi commercial, conformément à la
                réglementation suisse (LPD).
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Vos droits</h2>
              <p className="mt-3">
                Vous pouvez demander l&apos;accès, la rectification ou la
                suppression de vos données en écrivant à {COMPANY.email}.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Cookies</h2>
              <p className="mt-3">
                Ce site peut utiliser des cookies techniques nécessaires à son
                fonctionnement. Aucun cookie publicitaire n&apos;est déployé sans
                votre consentement.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
