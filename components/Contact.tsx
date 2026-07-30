"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { COMPANY } from "@/lib/data";
import { Reveal, SectionHeader } from "./ui/motion";

type FormType = "visit" | "callback";

export function Contact() {
  const [formType, setFormType] = useState<FormType>("visit");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const subject = encodeURIComponent(
      formType === "visit"
        ? "Demande de visite gratuite — Derra Vending"
        : "Demande de rappel — Derra Vending"
    );
    const body = encodeURIComponent(
      [
        `Type: ${formType === "visit" ? "Visite gratuite" : "Être rappelé"}`,
        `Nom: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Téléphone: ${data.get("phone")}`,
        `Entreprise / Lieu: ${data.get("company")}`,
        `Message: ${data.get("message")}`,
      ].join("\n")
    );
    window.location.href = `mailto:${COMPANY.email}?subject=${subject}&body=${body}`;
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <section className="bg-ink-soft py-24 md:py-32" id="contact">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeader
          tag="Contact"
          title="Demandez votre étude gratuite"
          subtitle="Visite sur site, devis personnalisé et réponse sous 24 heures."
        />

        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="space-y-6">
              <a
                href={COMPANY.phoneHref}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink p-6 transition hover:border-gold/20"
              >
                <div className="rounded-xl bg-gold/10 p-3 text-gold">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Téléphone</p>
                  <p className="mt-1 font-semibold text-cream">{COMPANY.phone}</p>
                </div>
              </a>

              <a
                href={COMPANY.emailHref}
                className="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink p-6 transition hover:border-gold/20"
              >
                <div className="rounded-xl bg-gold/10 p-3 text-gold">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Email</p>
                  <p className="mt-1 font-semibold text-cream">{COMPANY.email}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink p-6">
                <div className="rounded-xl bg-gold/10 p-3 text-gold">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Adresse</p>
                  <p className="mt-1 font-semibold text-cream">{COMPANY.address}</p>
                  <p className="text-white/60">
                    {COMPANY.city}, {COMPANY.country}
                  </p>
                  <p className="mt-2 text-xs text-white/40">UID {COMPANY.uid}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/5">
              <iframe
                title="Derra Vending — Meyrin"
                src="https://maps.google.com/maps?q=Rue+de+la+Golette+15G,+1217+Meyrin,+Suisse&output=embed"
                className="h-64 w-full grayscale transition hover:grayscale-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/5 bg-ink p-8 md:p-10"
            >
              <div className="mb-8 flex gap-2 rounded-full border border-white/10 bg-ink-muted p-1">
                {(
                  [
                    { id: "visit" as const, label: "Visite gratuite" },
                    { id: "callback" as const, label: "Être rappelé" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFormType(opt.id)}
                    className={`flex-1 rounded-full py-2.5 text-sm font-medium transition ${
                      formType === opt.id
                        ? "bg-gold text-ink"
                        : "text-white/60 hover:text-cream"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-white/50">
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-white/10 bg-ink-muted px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm text-white/50">
                    Téléphone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full rounded-xl border border-white/10 bg-ink-muted px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                    placeholder="+41 79 000 00 00"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="email" className="mb-2 block text-sm text-white/50">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-ink-muted px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                  placeholder="vous@entreprise.ch"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="company" className="mb-2 block text-sm text-white/50">
                  Entreprise / Lieu
                </label>
                <input
                  id="company"
                  name="company"
                  className="w-full rounded-xl border border-white/10 bg-ink-muted px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                  placeholder="Nom de l'entreprise ou adresse du site"
                />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="mb-2 block text-sm text-white/50">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-ink-muted px-4 py-3 text-cream outline-none transition focus:border-gold/50"
                  placeholder="Décrivez votre espace, le nombre de personnes, vos besoins..."
                />
              </div>

              <button
                type="submit"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-semibold text-ink transition hover:bg-gold-light"
              >
                <Send className="h-4 w-4" />
                Envoyer ma demande
              </button>

              {sent && (
                <p className="mt-4 text-center text-sm text-emerald-400">
                  Votre client email va s&apos;ouvrir — envoyez le message pour
                  finaliser votre demande.
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
