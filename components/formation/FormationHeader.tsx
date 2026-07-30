"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { FormationLogo } from "./FormationLogo";

export function FormationHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/formation#histoire", label: "Histoire" },
    { href: "/formation#contenu", label: "Le pack" },
    { href: "/formation#faq", label: "FAQ" },
    { href: "/formation/pricing", label: "Tarifs" },
  ];

  return (
    <header className="formation-header sticky top-0">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <FormationLogo size={42} />

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="formation-nav-link">
              {l.label}
            </Link>
          ))}
          <Link href="/formation/login" className="formation-nav-link">
            Connexion
          </Link>
          <Link href="/formation/pricing" className="formation-btn-primary px-5 py-2.5 text-[10px]">
            Accéder
          </Link>
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
            <Link href="/formation/login" className="formation-nav-link">
              Connexion
            </Link>
            <Link href="/formation/pricing" className="formation-btn-primary mt-2 text-center text-[10px]">
              Accéder
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
