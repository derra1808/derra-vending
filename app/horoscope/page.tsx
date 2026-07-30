"use client";

import { useCallback, useState } from "react";
import { HoroscopeForm } from "@/components/horoscope/HoroscopeForm";
import { HoroscopeReportDisplay } from "@/components/horoscope/HoroscopeReport";
import { DerraSiteHeader } from "@/components/horoscope/DerraSiteHeader";
import { generateHoroscopeReport } from "@/lib/horoscope/report";
import { isOwnerProfile } from "@/lib/horoscope/owner";
import type { BirthData, HoroscopeReport } from "@/lib/horoscope/types";
import type { HoroscopeStats } from "@/lib/horoscope-store";

async function fetchOwnerStats(data: BirthData): Promise<HoroscopeStats | null> {
  const res = await fetch("/api/horoscope/owner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) return null;
  const payload = await res.json();
  return payload?.stats ?? null;
}

export default function HoroscopePage() {
  const [report, setReport] = useState<HoroscopeReport | null>(null);
  const [ownerData, setOwnerData] = useState<BirthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerStats, setOwnerStats] = useState<HoroscopeStats | null>(null);
  const [refreshingStats, setRefreshingStats] = useState(false);

  const refreshOwnerStats = useCallback(async () => {
    if (!ownerData) return;
    setRefreshingStats(true);
    try {
      const stats = await fetchOwnerStats(ownerData);
      setOwnerStats(stats);
    } finally {
      setRefreshingStats(false);
    }
  }, [ownerData]);

  function handleSubmit(data: BirthData) {
    setLoading(true);
    const owner = isOwnerProfile(data);

    fetch("/api/horoscope", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});

    if (owner) {
      setOwnerData(data);
      fetchOwnerStats(data)
        .then(setOwnerStats)
        .catch(() => setOwnerStats(null));
    } else {
      setOwnerData(null);
      setOwnerStats(null);
    }

    setTimeout(() => {
      setReport(generateHoroscopeReport(data));
      setIsOwner(owner);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 800);
  }

  function handleReset() {
    setReport(null);
    setOwnerData(null);
    setIsOwner(false);
    setOwnerStats(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <DerraSiteHeader />

      {!report && (
        <header className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-peace-sage-dark">
            Astrologie & Numérologie
          </p>
          <h1 className="font-display text-3xl font-bold text-peace-text md:text-5xl">
            Votre bilan cosmique
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-peace-muted">
            Un espace calme pour découvrir votre profil astrologique et numérologique — passé,
            présent et futur.
          </p>
        </header>
      )}

      {!report ? (
        <HoroscopeForm onSubmit={handleSubmit} loading={loading} />
      ) : (
        <HoroscopeReportDisplay
          report={report}
          onReset={handleReset}
          isOwner={isOwner}
          ownerStats={ownerStats}
          onRefreshOwnerStats={isOwner ? refreshOwnerStats : undefined}
          refreshingOwnerStats={refreshingStats}
        />
      )}

      <footer className="mt-12 text-center text-xs leading-relaxed text-peace-muted/70">
        Derra · Bilan symbolique à visée récréative. Ne remplace pas un avis professionnel.
      </footer>
    </main>
  );
}
