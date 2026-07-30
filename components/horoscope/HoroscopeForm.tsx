"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import type { BirthData } from "@/lib/horoscope/types";
import { hz } from "./theme";

interface HoroscopeFormProps {
  onSubmit: (data: BirthData) => void;
  loading?: boolean;
}

export function HoroscopeForm({ onSubmit, loading }: HoroscopeFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("12:00");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !birthDate) return;
    onSubmit({ firstName: firstName.trim(), lastName: lastName.trim(), birthDate, birthTime });
  }

  return (
    <form onSubmit={handleSubmit} className={`mx-auto max-w-lg p-6 md:p-8 ${hz.card}`}>
      <div className="mb-8">
        <h2 className={`font-display text-2xl font-semibold ${hz.title}`}>Vos informations</h2>
        <p className={`mt-2 text-sm leading-relaxed ${hz.muted}`}>
          Prenez un instant pour vous — entrez vos données et laissez-vous guider.
        </p>
      </div>

      <div className="space-y-6">
        <fieldset className="space-y-4">
          <legend className={`mb-1 ${hz.legend}`}>Identité</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={`mb-2 block ${hz.label}`}>Prénom</span>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Ex. Marie" className={hz.input} />
            </label>
            <label className="block">
              <span className={`mb-2 block ${hz.label}`}>Nom</span>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Ex. Dupont" className={hz.input} />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className={`mb-1 ${hz.legend}`}>Naissance</legend>
          <label className="block">
            <span className={`mb-2 block ${hz.label}`}>Date de naissance</span>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className={hz.input} />
          </label>
          <label className="block">
            <span className={`mb-2 block ${hz.label}`}>Heure de naissance</span>
            <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} required className={hz.input} />
            <span className={`mt-2 block text-xs leading-relaxed ${hz.muted}`}>
              Pour calculer votre ascendant et votre planète horaire.
            </span>
          </label>
        </fieldset>
      </div>

      <button type="submit" disabled={loading} className={`mt-8 flex w-full items-center justify-center gap-2 ${hz.btnPrimary}`}>
        <Sparkles className="h-5 w-5" />
        {loading ? "Consultation en cours…" : "Découvrir mon bilan"}
      </button>
    </form>
  );
}
