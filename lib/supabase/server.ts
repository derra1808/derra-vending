import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function supabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function createClient() {
  const env = supabasePublicEnv();
  if (!env) {
    throw new Error(
      "Supabase non configuré (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    );
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll appelé depuis un Server Component — ignoré si middleware gère la session
        }
      },
    },
  });
}

export async function getProfile() {
  const env = supabasePublicEnv();
  if (!env) return { user: null, profile: null };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const paidFromAuth = user.user_metadata?.has_paid === true;
    const { data: profile } = await supabase
      .from("profiles")
      .select(
        "id, email, first_name, last_name, full_name, address, has_paid, created_at"
      )
      .eq("id", user.id)
      .single();

    return {
      user,
      profile: {
        id: profile?.id ?? user.id,
        email: profile?.email ?? user.email ?? null,
        first_name:
          profile?.first_name ?? user.user_metadata?.first_name ?? null,
        last_name: profile?.last_name ?? user.user_metadata?.last_name ?? null,
        full_name: profile?.full_name ?? user.user_metadata?.full_name ?? null,
        address: profile?.address ?? user.user_metadata?.address ?? null,
        has_paid: Boolean(profile?.has_paid) || paidFromAuth,
        created_at: profile?.created_at ?? user.created_at,
      },
    };
  } catch {
    return { user: null, profile: null };
  }
}
