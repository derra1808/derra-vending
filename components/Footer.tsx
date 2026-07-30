import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { COMPANY, SOCIAL_LINKS } from "@/lib/data";
const FOOTER_LINKS = [
  { href: "#solutions", label: "Solutions" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#process", label: "Processus" },
  { href: "#contact", label: "Contact" },
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/politique-confidentialite", label: "Confidentialité" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
              Installation gratuite de distributeurs automatiques à Genève.
              Café, boissons fraîches et snacks — maintenance et
              approvisionnement inclus.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={COMPANY.emailHref}
                className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href={COMPANY.phoneHref}
                className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                aria-label="Téléphone"
              >
                <Phone className="h-4 w-4" />
              </a>
              {SOCIAL_LINKS.linkedin ? (
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              ) : null}
              {SOCIAL_LINKS.instagram ? (
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              ) : null}
              {SOCIAL_LINKS.facebook ? (
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              ) : null}
              {SOCIAL_LINKS.whatsapp ? (
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-gold/30 hover:text-gold"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gold">
              Coordonnées
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/50">
              <li>{COMPANY.fullAddress}</li>
              <li>
                <a href={COMPANY.phoneHref} className="hover:text-cream">
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={COMPANY.emailHref} className="hover:text-cream">
                  {COMPANY.email}
                </a>
              </li>
              <li>UID {COMPANY.uid}</li>
              <li>Fondateur : {COMPANY.founder}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-white/35 md:flex-row">
          <p>© {new Date().getFullYear()} Derra Vending. Tous droits réservés.</p>
          <p>
            Entreprise individuelle inscrite au registre du commerce du canton de
            Genève
          </p>
        </div>
      </div>
    </footer>
  );
}
