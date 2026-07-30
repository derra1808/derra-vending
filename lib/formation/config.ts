export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("VOTRE_PROJECT")
  );
}

export function isStripeConfigured() {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  return Boolean(
    (key.startsWith("sk_test_") || key.startsWith("sk_live_")) &&
      process.env.STRIPE_PRICE_EBOOK?.startsWith("price_")
  );
}

export function isStripeEbookReady() {
  return isStripeConfigured();
}

export function getSetupStatus() {
  return {
    supabase: isSupabaseConfigured(),
    stripe: isStripeConfigured(),
    ready: isSupabaseConfigured() && isStripeConfigured(),
  };
}

/** Accès formation sans paiement (preview / dev) — FORMATION_FREE_ACCESS=true */
export function isFormationFreeAccess() {
  return process.env.FORMATION_FREE_ACCESS === "true";
}
