"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Briefcase,
  Activity,
  Lightbulb,
  Moon,
  ArrowUp,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { HoroscopeReport as Report, TimelineSection } from "@/lib/horoscope/types";
import {
  ZODIAC_LABELS,
  NUMBER_SYMBOLS,
  ELEMENT_LABELS,
  ZODIAC_PROFILES,
  NUMBER_PROFILES,
} from "@/lib/horoscope/report";
import { ZodiacIcon } from "./ZodiacIcon";
import { PersonalityTreeDisplay } from "./PersonalityTree";
import { LifePlanDisplay } from "./LifePlan";
import { OwnerExclusivePanel } from "./OwnerExclusivePanel";
import { ReportTabs, SectionBlock, StatCard, type ReportTab } from "./ReportTabs";
import { hz } from "./theme";
import type { HoroscopeStats } from "@/lib/horoscope-store";

interface HoroscopeReportProps {
  report: Report;
  onReset: () => void;
  isOwner?: boolean;
  ownerStats?: HoroscopeStats | null;
  onRefreshOwnerStats?: () => void;
  refreshingOwnerStats?: boolean;
}

function TimelineCard({ section }: { section: TimelineSection }) {
  const items = [
    { icon: Heart, label: "Amour", text: section.love },
    { icon: Briefcase, label: "Carrière", text: section.career },
    { icon: Activity, label: "Santé", text: section.health },
    { icon: Lightbulb, label: "Conseil", text: section.advice },
  ];

  return (
    <article className={`p-6 md:p-8 ${hz.card}`}>
      <div className="mb-4">
        <h3 className={`font-display text-xl font-semibold ${hz.title}`}>{section.title}</h3>
        <p className={`mt-1 text-sm ${hz.period}`}>{section.period}</p>
      </div>
      <p className={`mb-6 text-base leading-relaxed ${hz.text}`}>{section.summary}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, text }) => (
          <div key={label} className={`p-4 ${hz.cardInner}`}>
            <div className={`mb-2 flex items-center gap-2 ${hz.accent}`}>
              <Icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{label}</span>
            </div>
            <p className={`text-sm leading-relaxed ${hz.muted}`}>{text}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function HoroscopeReportDisplay({
  report,
  onReset,
  isOwner = false,
  ownerStats = null,
  onRefreshOwnerStats,
  refreshingOwnerStats = false,
}: HoroscopeReportProps) {
  const [tab, setTab] = useState<ReportTab>("resume");

  useEffect(() => {
    if (isOwner) setTab("exclusif");
  }, [isOwner]);
  const { astrology, numerology } = report;
  const zodiac = ZODIAC_PROFILES[astrology.sunSign];
  const lifePath = NUMBER_PROFILES[numerology.lifePath];
  const symbol = NUMBER_SYMBOLS[numerology.lifePath];
  const temporal = numerology.strategique.currentTemporal;
  const currentYear = new Date().getFullYear();

  const timelines = [report.past, report.present, report.nextYear, report.inFiveYears, report.inTenYears];

  return (
    <div className="space-y-6">
      <header className={`p-6 text-center md:p-8 ${hz.cardHero}`}>
        <p className={`text-xs font-semibold uppercase tracking-widest ${hz.accentSoft}`}>Votre bilan</p>
        <h2 className={`mt-2 font-display text-3xl font-bold md:text-4xl ${hz.title}`}>{report.fullName}</h2>
        <p className={`mt-2 text-sm ${hz.muted}`}>
          {report.birthDateFormatted} · {report.birthTimeFormatted} · {report.age} ans
        </p>
        <button onClick={onReset} className={`mt-5 inline-flex items-center gap-2 ${hz.btnGhost}`}>
          <RotateCcw className="h-3.5 w-3.5" />
          Nouvelle consultation
        </button>
      </header>

      <ReportTabs active={tab} onChange={setTab} showOwnerTab={isOwner} />

      {tab === "resume" && (
        <div className="space-y-6">
          <SectionBlock title="En bref" subtitle="Les informations les plus importantes">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <StatCard label="Signe solaire" value={ZODIAC_LABELS[astrology.sunSign]} hint={ELEMENT_LABELS[astrology.element]} />
              <StatCard label="Chemin de vie" value={numerology.lifePath} hint={lifePath.title} />
              <StatCard label="Dynamique de vie" value={numerology.lifeDynamicDisplay} hint="Nombre maître possible" highlight={[11, 22, 33].includes(numerology.lifeDynamic)} />
              <StatCard label={`Année ${currentYear}`} value={temporal.personalYear} hint={`Objectif : ${temporal.yearObjective}`} />
            </div>
          </SectionBlock>
          <SectionBlock title="Votre profil" subtitle="Synthèse personnalisée">
            <p className={`text-base leading-relaxed ${hz.text}`}>{report.synthesis}</p>
          </SectionBlock>
          <SectionBlock title="Points clés numérologiques">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Expression" value={numerology.expression} />
              <StatCard label="Nombre intime" value={numerology.soulUrge} />
              <StatCard label="Personnalité" value={numerology.personality} />
              <StatCard label="Objectif de vie (tronc)" value={numerology.trunk} />
              <StatCard label="Ascendant" value={ZODIAC_LABELS[astrology.risingSign]} />
              <StatCard label="Signe chinois" value={astrology.chineseSign} />
            </div>
          </SectionBlock>
        </div>
      )}

      {tab === "astro" && (
        <SectionBlock title="Astrologie" subtitle="Votre carte du ciel">
          <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className={`flex h-28 w-28 shrink-0 items-center justify-center ${hz.iconBox}`}>
              <ZodiacIcon sign={astrology.sunSign} size={64} />
            </div>
            <div className="text-center sm:text-left">
              <p className={`text-sm ${hz.muted}`}>Signe solaire</p>
              <p className={`font-display text-4xl font-bold ${hz.accentSoft}`}>{ZODIAC_LABELS[astrology.sunSign]}</p>
              <p className={`mt-1 text-sm ${hz.muted}`}>
                {ELEMENT_LABELS[astrology.element]} · Signe {astrology.modality} · {astrology.rulingPlanet}
              </p>
            </div>
          </div>
          <p className={`mb-8 text-base leading-relaxed ${hz.text}`}>{zodiac.essence}</p>
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: ArrowUp, label: "Ascendant", value: ZODIAC_LABELS[astrology.risingSign] },
              { icon: Moon, label: "Signe lunaire", value: ZODIAC_LABELS[astrology.moonSign] },
              { icon: Sparkles, label: "Signe chinois", value: `${astrology.chineseSign} (${astrology.chineseElement})` },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className={`p-4 text-center ${hz.cardInner}`}>
                <Icon className={`mx-auto mb-2 h-5 w-5 ${hz.accent}`} />
                <p className={`text-xs ${hz.muted}`}>{label}</p>
                <p className={`mt-1 text-sm font-semibold ${hz.title}`}>{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className={`mb-3 text-sm font-semibold ${hz.accentSoft}`}>Vos forces</p>
              <ul className="space-y-2">
                {zodiac.strengths.map((s) => (
                  <li key={s} className={`flex items-start gap-2 text-sm ${hz.text}`}>
                    <span className={`mt-1.5 ${hz.dot}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={`mb-3 text-sm font-semibold ${hz.muted}`}>Ombres à intégrer</p>
              <ul className="space-y-2">
                {zodiac.shadows.map((s) => (
                  <li key={s} className={`flex items-start gap-2 text-sm ${hz.muted}`}>
                    <span className={`mt-1.5 ${hz.dotMuted}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionBlock>
      )}

      {tab === "numero" && (
        <div className="space-y-6">
          <SectionBlock title="Numérologie" subtitle="Vos nombres fondamentaux">
            <div className="mb-6 flex items-center gap-5">
              <div className={`flex h-20 w-20 flex-col items-center justify-center ${hz.iconBox}`}>
                <span className="text-2xl">{symbol.symbol}</span>
                <span className={`text-xl font-bold ${hz.number}`}>{numerology.lifePath}</span>
              </div>
              <div>
                <p className={`font-display text-xl font-semibold ${hz.accentSoft}`}>{lifePath.title}</p>
                <p className={`text-sm ${hz.muted}`}>{symbol.name}</p>
              </div>
            </div>
            <p className={`mb-6 text-base leading-relaxed ${hz.text}`}>{lifePath.essence}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Expression" value={numerology.expression} hint="1ère racine" />
              <StatCard label="Chemin de vie" value={numerology.lifePath} hint="2ème racine" />
              <StatCard label="Tronc" value={numerology.trunk} hint="Objectif de vie" />
              <StatCard label="Intime" value={numerology.soulUrge} hint="Feuilles" />
              <StatCard label="Personnalité" value={numerology.personality} hint="Écorce" />
              <StatCard label="Dynamique de vie" value={numerology.lifeDynamicDisplay} highlight />
            </div>
          </SectionBlock>
          <SectionBlock title="Arbre de personnalité" subtitle="Méthode Numérologie Stratégique — 7 clés">
            <PersonalityTreeDisplay
              tree={numerology.strategique.tree}
              inclusion={numerology.strategique.inclusion}
              challenges={numerology.strategique.challenges}
              nameEnergies={numerology.strategique.nameEnergies}
            />
          </SectionBlock>
        </div>
      )}

      {tab === "plan" && (
        <SectionBlock title="Plan de vie" subtitle="Cycles, saisons et temporalité">
          <LifePlanDisplay
            current={numerology.strategique.currentTemporal}
            previous={numerology.strategique.previousTemporal}
            next={numerology.strategique.nextTemporal}
            periods={numerology.strategique.lifePlanPeriods}
            years={numerology.strategique.lifePlanYears}
          />
        </SectionBlock>
      )}

      {tab === "futur" && (
        <div className="space-y-6">
          <p className={`text-center text-sm ${hz.muted}`}>
            Votre parcours — passé, présent, et horizons à 1, 5 et 10 ans.
          </p>
          {timelines.map((section) => (
            <TimelineCard key={section.title} section={section} />
          ))}
        </div>
      )}

      {tab === "exclusif" && isOwner && (
        <OwnerExclusivePanel
          report={report}
          stats={ownerStats}
          onRefresh={onRefreshOwnerStats}
          refreshing={refreshingOwnerStats}
        />
      )}
    </div>
  );
}
