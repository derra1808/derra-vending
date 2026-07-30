import type { HoroscopeReport } from "./types";

export function buildOwnerExclusiveSections(report: HoroscopeReport) {
  const { numerology, astrology } = report;
  const ns = numerology.strategique;
  const currentYear = new Date().getFullYear();

  return {
    title: "Espace Derra — accès fondateur",
    subtitle: "Réservé à Ibrahim Derra · 18 août 1997 · 03h00",
    sections: [
      {
        heading: "Signature NUMSTRAT",
        body: `Votre dynamique de vie ${numerology.lifeDynamicDisplay} et votre tronc ${numerology.trunk} forment l'axe directeur de votre arbre. En ${currentYear}, l'année personnelle ${ns.currentTemporal.personalYear} (objectif ${ns.currentTemporal.yearObjective}) active votre ${ns.currentTemporal.yearObjective === 22 || ns.currentTemporal.yearObjective === 4 ? "nombre maître bâtisseur" : "cycle de structuration"}. Le Lion solaire (${astrology.decan}e décan) porté à l'aube (03h00) révèle une personnalité solaire intérieure forte, avec un ascendant ${astrology.risingSign} qui modère votre rayonnement public.`,
      },
      {
        heading: "Forces stratégiques",
        bullets: [
          `Expression ${numerology.expression} + chemin de vie ${numerology.lifePath} : capacité à fédérer et concrétiser`,
          `Racines ${ns.tree.root1.display} / ${ns.tree.root2.display} : double ancrage identitaire`,
          `Mémoire familiale positions ${ns.tree.familyMemoryPositions.join(", ") || "—"} : héritages à transmuter`,
          `Planète horaire ${astrology.birthHourPlanet} : tempo émotionnel nocturne, intuition affûtée`,
        ],
      },
      {
        heading: "Horizon 2026–2036",
        body: `Les cinq prochaines années consolident votre réputation (Lion + année personnelle ${report.numerology.personalYearFiveYears}). À dix ans, le chemin ${numerology.lifePath} entre dans une phase de transmission : enseigner ce que vous avez bâti devient aussi important que bâtir. Surveillez les périodes formatives ${ns.lifePlanPeriods.slice(0, 3).map((p) => `${p.ageFrom}-${p.ageTo} ans (clé ${p.key})`).join(" · ")}.`,
      },
      {
        heading: "Note privée",
        body: "Cette section n'apparaît que lorsque vos coordonnées exactes sont reconnues. Les autres visiteurs reçoivent le bilan standard sans accès à cet espace ni à la liste des consultations.",
      },
    ],
  };
}
