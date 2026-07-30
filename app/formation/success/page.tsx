import Link from "next/link";
import { confirmCheckoutSession } from "@/lib/stripe-confirm";
import { getSetupStatus } from "@/lib/formation/config";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const setup = getSetupStatus();

  let activated = false;
  let error: string | null = null;

  if (params.session_id && setup.stripe) {
    const result = await confirmCheckoutSession(params.session_id);
    if (result.ok) {
      activated = true;
    } else {
      error = result.reason;
    }
  } else if (!params.session_id) {
    error = "Identifiant de session manquant. Reviens depuis la page de paiement Stripe.";
  }

  return (
    <div className="section-night flex min-h-[60vh] items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        {activated ? (
          <>
            <p className="formation-label">Confirmé</p>
            <h1 className="formation-title mt-4 text-3xl">Paiement réussi</h1>
            <p className="formation-body mt-5">
              Ton accès à la formation est activé. Retrouve les 5 modules dans ton espace
              membre.
            </p>
            <Link href="/formation/membre" className="formation-btn-primary mt-10 inline-flex">
              Accéder à la formation
            </Link>
          </>
        ) : (
          <>
            <p className="formation-label">Activation</p>
            <h1 className="formation-title mt-4 text-3xl">Paiement reçu</h1>
            <p className="formation-body mt-5">
              {error ??
                "L'accès n'a pas pu être activé automatiquement. Va sur l'espace membre — une resynchronisation sera tentée."}
            </p>
            <Link href="/formation/membre" className="formation-btn-primary mt-10 inline-flex">
              Espace membre
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
