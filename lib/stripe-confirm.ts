import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

async function grantEbookAccess(userId: string, email?: string | null) {
  const supabase = createAdminClient();

  const existing = await supabase.auth.admin.getUserById(userId);
  const { error: metaError } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...(existing.data.user?.user_metadata || {}),
      has_paid: true,
      access: "lifetime",
    },
  });

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      ...(email ? { email } : {}),
      has_paid: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (metaError && profileError) {
    return {
      ok: false as const,
      reason: metaError.message || profileError.message,
    };
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

/** Retrouve n’importe quel paiement ebook (peu importe le montant) et active l’accès à vie. */
export async function syncPaidAccessForUser(
  userId: string,
  email?: string | null
) {
  const stripe = getStripe();
  const needle = (email || "").trim().toLowerCase();
  let startingAfter: string | undefined;

  for (let page = 0; page < 8; page += 1) {
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });

    const paidEbook = sessions.data.find((session) => {
      if (session.payment_status !== "paid") return false;
      if (session.metadata?.product !== "ebook") return false;
      const sessionEmail = (
        session.customer_email ||
        session.customer_details?.email ||
        ""
      ).toLowerCase();
      return (
        session.metadata?.user_id === userId ||
        session.client_reference_id === userId ||
        (needle && sessionEmail === needle)
      );
    });

    if (paidEbook) {
      return grantEbookAccess(userId, paidEbook.customer_email || email);
    }

    if (!sessions.has_more || sessions.data.length === 0) break;
    startingAfter = sessions.data[sessions.data.length - 1]?.id;
  }

  return { ok: false as const, reason: "Aucun paiement ebook trouvé" };
}
