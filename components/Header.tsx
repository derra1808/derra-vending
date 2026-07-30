"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { COMPANY } from "@/lib/data";

const NAV = [
  { href: "#solutions", label: "Solutions" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#process", label: "Processus" },
  { href: "#temoignages", label: "Témoignages" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-ink/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/70 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={COMPANY.phoneHref}
            className="flex items-center gap-2 text-sm text-white/70 transition hover:text-cream"
          >
            <Phone className="h-4 w-4 text-gold" />
            {COMPANY.phone}
          </a>
          <Link
            href="#contact"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-light"
          >
            Visite gratuite
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-cream lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-white/5 bg-ink-soft lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-white/80 hover:bg-white/5"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={COMPANY.phoneHref}
                className="mt-4 flex items-center gap-2 px-4 py-3 text-gold"
              >
                <Phone className="h-4 w-4" />
                {COMPANY.phone}
              </a>
              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-full bg-gold px-4 py-3 text-center font-semibold text-ink"
              >
                Demander une visite gratuite
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
