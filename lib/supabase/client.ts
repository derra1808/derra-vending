import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfiguredClient } from "@/lib/formation/config-client";

export function createClient() {
  if (!isSupabaseConfiguredClient()) {
    return null;
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
