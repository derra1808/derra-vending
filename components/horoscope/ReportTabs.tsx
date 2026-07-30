"use client";

import { Lock } from "lucide-react";
import { hz } from "./theme";

export type ReportTab = "resume" | "astro" | "numero" | "plan" | "futur" | "exclusif";

const BASE_TABS: { id: ReportTab; label: string; description: string; ownerOnly?: boolean }[] = [
  { id: "resume", label: "Résumé", description: "L'essentiel en un coup d'œil" },
  { id: "astro", label: "Astrologie", description: "Signes et planètes" },
  { id: "numero", label: "Numérologie", description: "Arbre et nombres clés" },
  { id: "plan", label: "Plan de vie", description: "Années et cycles" },
  { id: "futur", label: "Prévisions", description: "Passé, présent et futur" },
  { id: "exclusif", label: "Exclusif", description: "Espace Derra privé", ownerOnly: true },
];

interface ReportTabsProps {
  active: ReportTab;
  onChange: (tab: ReportTab) => void;
  showOwnerTab?: boolean;
}

export function ReportTabs({ active, onChange, showOwnerTab = false }: ReportTabsProps) {
  const tabs = BASE_TABS.filter((tab) => !tab.ownerOnly || showOwnerTab);

  return (
    <nav className={`-mx-4 px-4 py-3 md:-mx-0 md:px-2 ${hz.nav}`} aria-label="Sections du bilan">
      <div
        className={`flex gap-1 overflow-x-auto pb-1 scrollbar-none md:grid md:overflow-visible md:pb-0 ${
          showOwnerTab ? "md:grid-cols-6" : "md:grid-cols-5"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-left transition md:px-3 md:py-3 ${
              active === tab.id ? hz.tabActive : hz.tabInactive
            } ${tab.ownerOnly ? "border border-peace-lavender-deep/30 bg-peace-lavender/30" : ""}`}
          >
            <span className="flex items-center gap-1.5 text-sm font-semibold">
              {tab.ownerOnly && <Lock className="h-3 w-3" />}
              {tab.label}
            </span>
            <span className={`hidden text-[11px] md:block ${hz.muted}`}>{tab.description}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function SectionBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`p-6 md:p-8 ${hz.card}`}>
      <header className={`mb-6 border-b pb-4 ${hz.divider}`}>
        <h3 className={`font-display text-xl md:text-2xl ${hz.title} font-semibold`}>{title}</h3>
        {subtitle && <p className={`mt-1 text-sm ${hz.muted}`}>{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  highlight,
}: {
  label: string;
  value: string | number;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 text-center ${highlight ? hz.cardHighlight : hz.cardInner}`}>
      <p className={`text-2xl md:text-3xl ${hz.number}`}>{value}</p>
      <p className={`mt-1 text-sm font-medium ${hz.title}`}>{label}</p>
      {hint && <p className={`mt-0.5 text-xs ${hz.muted}`}>{hint}</p>}
    </div>
  );
}
