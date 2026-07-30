"use client";

import type { YearTemporal, LifePlanRow, LifePlanYearRow } from "@/lib/horoscope/numerology-strategique";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { hz } from "./theme";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

interface LifePlanDisplayProps {
  current: YearTemporal;
  previous: YearTemporal;
  next: YearTemporal;
  periods: LifePlanRow[];
  years: LifePlanYearRow[];
}

export function LifePlanDisplay({ current, previous, next, periods, years }: LifePlanDisplayProps) {
  const [showFullPlan, setShowFullPlan] = useState(false);
  const currentYear = current.year;
  const nowMonth = new Date().getMonth() + 1;

  const visibleYears = useMemo(() => {
    if (showFullPlan) return years;
    return years.filter((y) => y.year >= currentYear - 3 && y.year <= currentYear + 10);
  }, [years, currentYear, showFullPlan]);

  return (
    <div className="space-y-8">
      <div className={`p-5 md:p-6 ${hz.cardHero}`}>
        <p className={`text-sm font-semibold ${hz.accentSoft}`}>
          Année {current.year} — vous avez {current.age} ans
        </p>
        <div className="mt-4 grid grid-cols-3 gap-4">
          {[
            { label: "Année personnelle", value: current.personalYear },
            { label: "Année universelle", value: current.universalYear },
            { label: "Objectif de l'année", value: current.yearObjective },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className={`text-3xl ${hz.number}`}>{value}</p>
              <p className={`mt-1 text-xs ${hz.muted}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`mb-3 text-sm font-semibold ${hz.title}`}>Trimestres personnels {current.year}</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {current.personalQuarters.map((q, i) => (
            <div key={i} className={`p-4 text-center ${hz.cardInner}`}>
              <p className={`text-2xl ${hz.number}`}>{q}</p>
              <p className={`mt-1 text-xs ${hz.muted}`}>
                {i === 0 ? "Jan – Mar" : i === 1 ? "Avr – Jun" : i === 2 ? "Jul – Sep" : "Oct – Déc"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`mb-3 text-sm font-semibold ${hz.title}`}>Mois personnels {current.year}</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {current.personalMonths.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 text-center ${
                i + 1 === nowMonth && current.year === new Date().getFullYear()
                  ? hz.cardHighlight
                  : hz.cardInner
              }`}
            >
              <p className={`text-[11px] ${hz.muted}`}>{MONTHS[i]}</p>
              <p className={`text-lg ${hz.number}`}>{m}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className={`mb-3 text-sm font-semibold ${hz.title}`}>Saisons de vie</p>
        <div className="space-y-2">
          {periods.map((p, i) => {
            const isActive = current.age >= p.ageFrom && current.age <= p.ageTo;
            return (
              <div
                key={i}
                className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${
                  isActive ? hz.cardHighlight : hz.cardInner
                }`}
              >
                <div>
                  <p className={`text-sm font-medium ${hz.title}`}>
                    {p.ageFrom === 0 ? "Naissance" : `${p.ageFrom} ans`} →{" "}
                    {p.ageTo === 99 ? "fin de vie" : `${p.ageTo} ans`}
                    {isActive && <span className={`ml-2 ${hz.badge}`}>Vous êtes ici</span>}
                  </p>
                  <p className={`mt-0.5 text-xs ${hz.muted}`}>Période formative : {p.formativePeriod}</p>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <p className={`text-xs ${hz.muted}`}>Vibrations</p>
                    <p className={hz.number}>{p.vibration1} · {p.vibration2}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${hz.muted}`}>Clé</p>
                    <p className={`font-bold ${hz.title}`}>{p.key}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className={`mb-3 text-sm font-semibold ${hz.title}`}>Comparaison des années</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[previous, current, next].map((yt) => (
            <div key={yt.year} className={`p-4 ${yt.year === current.year ? hz.cardHighlight : hz.cardInner}`}>
              <p className={`font-semibold ${hz.title}`}>{yt.year}</p>
              <dl className="mt-2 space-y-1 text-sm">
                {[
                  ["Année perso", yt.personalYear],
                  ["Année univ.", yt.universalYear],
                  ["Objectif", yt.yearObjective],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between">
                    <dt className={hz.muted}>{label}</dt>
                    <dd className={hz.number}>{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowFullPlan(!showFullPlan)}
          className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium ${hz.btnGhost}`}
        >
          <span>{showFullPlan ? "Masquer le plan complet" : "Afficher le plan de vie complet (0–99 ans)"}</span>
          {showFullPlan ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {showFullPlan && (
          <div className="mt-3 max-h-80 overflow-auto rounded-xl border border-peace-200 bg-white/90">
            <table className="w-full min-w-[640px] text-sm">
              <thead className={`sticky top-0 ${hz.tableHead}`}>
                <tr className={`border-b ${hz.divider} text-left text-xs`}>
                  <th className="px-3 py-2.5">Année</th>
                  <th className="px-3 py-2.5">Âge</th>
                  <th className="px-3 py-2.5">Formative</th>
                  <th className="px-3 py-2.5">Saisons</th>
                  <th className="px-3 py-2.5">Clé</th>
                  <th className="px-3 py-2.5">Année perso</th>
                  <th className="px-3 py-2.5">Influence 12</th>
                </tr>
              </thead>
              <tbody>
                {visibleYears.map((row) => (
                  <tr key={row.year} className={`border-b border-peace-150/50 ${row.year === currentYear ? hz.tableRowActive : ""}`}>
                    <td className={`px-3 py-2 font-medium ${hz.title}`}>{row.year}</td>
                    <td className={`px-3 py-2 ${hz.muted}`}>{row.age} ans</td>
                    <td className={`px-3 py-2 ${hz.text}`}>{row.formativePeriod}</td>
                    <td className={`px-3 py-2 ${hz.number}`}>{row.vibration1} · {row.vibration2}</td>
                    <td className={`px-3 py-2 ${hz.text}`}>{row.key}</td>
                    <td className={`px-3 py-2 font-semibold ${hz.number}`}>{row.personalYear}</td>
                    <td className={`px-3 py-2 ${hz.warnNumber}`}>{row.hasInfluence12 ? "12" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
