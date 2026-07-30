import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { COMPANY } from "@/lib/data";

export const metadata = {
  title: "Mentions légales",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="bg-ink pt-28">
        <article className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Link href="/" className="text-sm text-gold hover:underline">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="mt-6 font-display text-4xl font-semibold text-cream">
            Mentions légales
          </h1>

          <div className="prose prose-invert mt-10 space-y-8 text-white/65">
            <section>
              <h2 className="font-display text-xl text-cream">Éditeur du site</h2>
              <p>
                {COMPANY.name}
                <br />
                Entreprise individuelle
                <br />
                Titulaire : {COMPANY.founder}
                <br />
                {COMPANY.fullAddress}
                <br />
                Téléphone : {COMPANY.phone}
                <br />
                Email : {COMPANY.email}
                <br />
                UID : {COMPANY.uid}
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Activité</h2>
              <p>
                Installation, exploitation et approvisionnement de distributeurs
                automatiques de boissons chaudes, froides et snacks pour
                entreprises, chantiers, commerces et institutions à Genève et
                environs.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Hébergement</h2>
              <p>
                Ce site est hébergé par le prestataire choisi lors de la mise en
                production. Les informations d&apos;hébergement seront complétées
                lors du déploiement définitif.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">
                Propriété intellectuelle
              </h2>
              <p>
                L&apos;ensemble du contenu de ce site (textes, images, logos,
                graphismes) est la propriété de {COMPANY.name}, sauf mention
                contraire. Toute reproduction est interdite sans autorisation
                écrite préalable.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-cream">Responsabilité</h2>
              <p>
                {COMPANY.name} s&apos;efforce d&apos;assurer l&apos;exactitude des
                informations publiées. Toutefois, elle ne saurait être tenue
                responsable des omissions ou inexactitudes.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
