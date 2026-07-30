import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="section-night flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="max-w-sm text-center">
        <p className="formation-label">Annulé</p>
        <h1 className="formation-title mt-4 text-3xl">Paiement annulé</h1>
        <p className="formation-body mt-5">
          Aucun montant débité. Vous pouvez réessayer quand vous voulez.
        </p>
        <Link href="/formation/pricing" className="formation-btn-ghost mt-10 inline-flex">
          Retour aux tarifs
        </Link>
      </div>
    </div>
  );
}
