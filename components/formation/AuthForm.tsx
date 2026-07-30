"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { isSupabaseConfiguredClient } from "@/lib/formation/config-client";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
  redirectTo?: string;
}

export function AuthForm({ mode, redirectTo = "/formation/membre" }: AuthFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isSupabaseConfiguredClient()) {
      setError(
        "Supabase n'est pas configuré. Collez vos clés dans .env.local (lignes NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY), puis redémarrez npm run dev."
      );
      setLoading(false);
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      setError("Impossible de se connecter à Supabase. Vérifiez .env.local.");
      setLoading(false);
      return;
    }
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName,
            address: address.trim(),
          },
        },
      });

      if (signUpError) {
        const msg = signUpError.message.toLowerCase();
        if (msg.includes("rate limit")) {
          setError(
            "Trop de tentatives d'inscription. Attends 1 heure, ou va sur Supabase → Authentication → Providers → Email et désactive « Confirm email ». Si tu as déjà un compte, connecte-toi."
          );
        } else if (msg.includes("already registered")) {
          setError("Cet email existe déjà. Utilise « Se connecter » ci-dessous.");
        } else {
          setError(signUpError.message);
        }
      } else if (data.user) {
        await supabase
          .from("profiles")
          .update({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: fullName,
            address: address.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id);

        setMessage("Compte créé. Vous pouvez vous connecter.");
        router.push(redirectTo);
        router.refresh();
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {mode === "signup" && (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="lastName" className="formation-label">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="formation-input mt-2"
              />
            </div>
            <div>
              <label htmlFor="firstName" className="formation-label">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="formation-input mt-2"
              />
            </div>
          </div>
          <div>
            <label htmlFor="address" className="formation-label">
              Adresse complète
            </label>
            <input
              id="address"
              type="text"
              required
              autoComplete="street-address"
              placeholder="Rue, numéro, NPA, ville"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="formation-input mt-2"
            />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="formation-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="formation-input mt-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="formation-label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="formation-input mt-2"
        />
      </div>

      {error && (
        <p className="text-sm font-medium" style={{ color: "var(--d-cream)" }}>
          {error}
        </p>
      )}
      {message && <p className="formation-accent text-sm">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="formation-btn-primary flex w-full items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>

      <p className="formation-body text-center text-[13px]">
        {mode === "login" ? (
          <>
            Pas de compte ?{" "}
            <Link href="/formation/signup" className="formation-link">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href="/formation/login" className="formation-link">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
