"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Lock, RefreshCw, Users } from "lucide-react";
import type { HoroscopeReport } from "@/lib/horoscope/types";
import type { HoroscopeConsultation, HoroscopeStats } from "@/lib/horoscope-store";
import { isOwnerProfile } from "@/lib/horoscope/owner";
import { buildOwnerExclusiveSections } from "@/lib/horoscope/owner-content";
import { SectionBlock } from "./ReportTabs";
import { hz } from "./theme";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBirthDate(d: string) {
  const [y, m, day] = d.split("-");
  return day && m && y ? `${day}/${m}/${y}` : d;
}

function isOwnerConsultation(c: HoroscopeConsultation) {
  return isOwnerProfile({
    firstName: c.firstName,
    lastName: c.lastName,
    birthDate: c.birthDate,
    birthTime: c.birthTime,
  });
}

function VisitorBilanCard({ consultation }: { consultation: HoroscopeConsultation }) {
  const [open, setOpen] = useState(false);
  const bilan = consultation.bilan;

  return (
    <article className={`overflow-hidden ${hz.cardInner}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div>
          <p className={`font-semibold ${hz.title}`}>
            {consultation.firstName} {consultation.lastName}
          </p>
          <p className={`mt-1 text-xs ${hz.muted}`}>
            {formatBirthDate(consultation.birthDate)} · {consultation.birthTime} · consulté le{" "}
            {formatDate(consultation.at)}
          </p>
          {bilan && (
            <p className={`mt-2 text-xs ${hz.accentSoft}`}>
              {bilan.sunSign} · chemin {bilan.lifePath} · année perso {bilan.personalYear}
            </p>
          )}
        </div>
        {open ? (
          <ChevronUp className={`mt-1 h-4 w-4 shrink-0 ${hz.muted}`} />
        ) : (
          <ChevronDown className={`mt-1 h-4 w-4 shrink-0 ${hz.muted}`} />
        )}
      </button>

      {open && (
        <div className={`space-y-4 border-t px-4 pb-4 pt-3 ${hz.divider}`}>
          {!bilan ? (
            <p className={`text-sm ${hz.muted}`}>
              Bilan non enregistré (consultation avant la mise à jour du suivi).
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  ["Signe", bilan.sunSign],
                  ["Ascendant", bilan.risingSign],
                  ["Chemin de vie", bilan.lifePath],
                  ["Expression", bilan.expression],
                ].map(([label, value]) => (
                  <div key={label} className={`rounded-lg p-2 text-center ${hz.cardHighlight}`}>
                    <p className={`text-lg font-bold ${hz.number}`}>{value}</p>
                    <p className={`text-[10px] uppercase ${hz.muted}`}>{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className={`mb-1 text-sm font-semibold ${hz.accentSoft}`}>Synthèse</p>
                <p className={`text-sm leading-relaxed ${hz.text}`}>{bilan.synthesis}</p>
              </div>

              <div>
                <p className={`mb-1 text-sm font-semibold ${hz.accentSoft}`}>{bilan.present.title}</p>
                <p className={`mb-2 text-xs ${hz.muted}`}>{bilan.present.period}</p>
                <p className={`text-sm leading-relaxed ${hz.text}`}>{bilan.present.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Amour", bilan.present.love],
                  ["Carrière", bilan.present.career],
                  ["Santé", bilan.present.health],
                  ["Conseil", bilan.present.advice],
                ].map(([label, text]) => (
                  <div key={label} className={`rounded-lg p-3 ${hz.card}`}>
                    <p className={`mb-1 text-xs font-semibold ${hz.accent}`}>{label}</p>
                    <p className={`text-xs leading-relaxed ${hz.muted}`}>{text}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className={`mb-1 text-sm font-semibold ${hz.accentSoft}`}>{bilan.past.title}</p>
                <p className={`text-sm leading-relaxed ${hz.text}`}>{bilan.past.summary}</p>
              </div>

              <div>
                <p className={`mb-1 text-sm font-semibold ${hz.accentSoft}`}>{bilan.nextYear.title}</p>
                <p className={`text-sm leading-relaxed ${hz.text}`}>{bilan.nextYear.summary}</p>
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

interface OwnerExclusivePanelProps {
  report: HoroscopeReport;
  stats: HoroscopeStats | null;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function OwnerExclusivePanel({ report, stats, onRefresh, refreshing }: OwnerExclusivePanelProps) {
  const content = buildOwnerExclusiveSections(report);
  const visitors = stats?.consultations.filter((c) => !isOwnerConsultation(c)) ?? [];

  return (
    <div className="space-y-6">
      <div className={`p-6 text-center md:p-8 ${hz.cardLavender}`}>
        <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-peace-sage/15 ${hz.accent}`}>
          <Lock className="h-5 w-5" />
        </div>
        <h3 className={`font-display text-2xl font-semibold ${hz.title}`}>{content.title}</h3>
        <p className={`mt-2 text-sm ${hz.muted}`}>{content.subtitle}</p>
      </div>

      {content.sections.map((section) => (
        <SectionBlock key={section.heading} title={section.heading}>
          {"body" in section && section.body ? (
            <p className={`text-base leading-relaxed ${hz.text}`}>{section.body}</p>
          ) : null}
          {"bullets" in section && section.bullets ? (
            <ul className="space-y-2">
              {section.bullets.map((item) => (
                <li key={item} className={`flex items-start gap-2 text-sm ${hz.text}`}>
                  <span className={`mt-1.5 ${hz.dot}`} />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </SectionBlock>
      ))}

      <SectionBlock
        title="Bilans des visiteurs"
        subtitle="Cliquez sur un nom pour lire le test complet qu'ils ont reçu"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className={`flex items-center gap-2 ${hz.accentSoft}`}>
            <Users className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {visitors.length} visiteur{visitors.length !== 1 ? "s" : ""}
              {stats ? ` · ${stats.total} consultation${stats.total !== 1 ? "s" : ""} au total` : ""}
            </span>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className={`inline-flex items-center gap-2 ${hz.btnGhost}`}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </button>
          )}
        </div>

        {!stats || visitors.length === 0 ? (
          <p className={`text-sm ${hz.muted}`}>
            Aucun visiteur pour l&apos;instant. Dès qu&apos;une personne fait son bilan, vous pourrez le lire ici.
          </p>
        ) : (
          <div className="space-y-3">
            {visitors.map((c, i) => (
              <VisitorBilanCard key={`${c.at}-${i}`} consultation={c} />
            ))}
          </div>
        )}
      </SectionBlock>
    </div>
  );
}
