/** Vérification côté client (variables NEXT_PUBLIC_*) */
export function isSupabaseConfiguredClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return Boolean(url.length > 10 && key.length > 20 && !url.includes("VOTRE"));
}
