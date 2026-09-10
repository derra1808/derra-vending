"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FORMATION } from "@/lib/formation/content";
import { createClient } from "@/lib/supabase/client";
import { FormationLogo } from "./FormationLogo";

export function FormationHeader({
  signedIn = false,
  hasPaid = false,
}: {
  signedIn?: boolean;
  hasPaid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState({ signedIn, hasPaid });

  useEffect(() => {
    setSession({ signedIn, hasPaid });
  }, [signedIn, hasPaid]);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return;
      let paid = user.user_metadata?.has_paid === true;
      if (!paid) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_paid")
          .eq("id", user.id)
          .maybeSingle();
        paid = Boolean(profile?.has_paid);
      }
      setSession({ signedIn: true, hasPaid: paid });
    })();
  }, []);

  const links = session.hasPaid
    ? [
        { href: "/formation/membre", label: "Espace membre" },
        { href: "/formation#faq", label: "FAQ" },
        { href: "/formation/logout?next=/formation", label: "Déconnexion" },
      ]
    : session.signedIn
      ? [
          { href: "/formation#tarifs", label: "Offre" },
          { href: "/formation#faq", label: "FAQ" },
          { href: "/formation/logout?next=/formation", label: "Déconnexion" },
        ]
      : [
          { href: "/formation#tarifs", label: "Offre" },
          { href: "/formation#faq", label: "FAQ" },
          { href: "/formation/login", label: "Connexion" },
        ];

  return (
    <header className="formation-header sticky top-0">
      <div className="mx-auto flex w-full max-w-none items-center justify-between px-4 py-4 md:px-6">
        <FormationLogo size={42} />

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="formation-nav-link">
              {l.label}
            </Link>
          ))}
          {session.hasPaid ? (
            <Link href="/formation/membre" className="formation-btn-primary px-5 py-2.5 text-[10px]">
              Formation
            </Link>
          ) : (
            <Link href="/formation#tarifs" className="formation-btn-primary px-5 py-2.5 text-[10px]">
              Accéder — {FORMATION.ebookPrice} CHF
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden"
          style={{ color: "var(--d-cream)" }}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div
          className="px-6 py-5 md:hidden"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--d-gold) 30%, transparent)" }}
        >
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="formation-nav-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {session.hasPaid ? (
              <Link
                href="/formation/membre"
                className="formation-btn-primary mt-2 text-center text-[10px]"
                onClick={() => setOpen(false)}
              >
                Formation
              </Link>
            ) : (
              <Link href="/formation#tarifs" className="formation-btn-primary mt-2 text-center text-[10px]">
                Accéder — {FORMATION.ebookPrice} CHF
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
