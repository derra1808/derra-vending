import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

async function grantEbookAccess(userId: string, email?: string | null) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      ...(email ? { email } : {}),
      has_paid: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (error) {
    return { ok: false as const, reason: error.message };
  }

  return { ok: true as const };
}

export async function confirmCheckoutSession(sessionId: string) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { ok: false as const, reason: "Paiement non confirmé" };
  }

  const userId = session.metadata?.user_id || session.client_reference_id;
  const product = session.metadata?.product;

  if (!userId || product !== "ebook") {
    return { ok: false as const, reason: "Session de paiement invalide" };
  }

  return grantEbookAccess(userId, session.customer_email);
}

/** Retrouve un paiement ebook récent Stripe et active l'accès si besoin */
export async function syncPaidAccessForUser(userId: string) {
  const stripe = getStripe();
  const sessions = await stripe.checkout.sessions.list({
    limit: 20,
    status: "complete",
  });

  const paidEbook = sessions.data.find(
    (session) =>
      session.payment_status === "paid" &&
      session.metadata?.product === "ebook" &&
      (session.metadata?.user_id === userId ||
        session.client_reference_id === userId)
  );

  if (!paidEbook) {
    return { ok: false as const, reason: "Aucun paiement ebook trouvé" };
  }

  return grantEbookAccess(userId, paidEbook.customer_email);
}
