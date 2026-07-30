import type { StudioTheme } from "./types";

/**
 * Banque de CONSEILS vending — style TikTok éducatif
 * (vraies photos machines Derra en montage, pas de stock Pexels).
 */
export const STUDIO_THEMES: StudioTheme[] = [
  {
    id: "conseil-emplacement",
    label: "Choisir le bon emplacement",
    angle:
      "5 conseils concrets pour placer un distributeur là où les gens passent vraiment (flux, pause, concurrence). Ton coach terrain, pas théorie.",
    keywords: ["emplacement", "conseil vending", "distributeur"],
    visualQuery: "chantier",
  },
  {
    id: "conseil-produits",
    label: "Quoi mettre dans la machine",
    angle:
      "Conseils assortiment : boissons classiques, snacks qui tournent, erreurs de débutant. Style liste actionnable.",
    keywords: ["produits", "assortiment", "marges", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-premier-distributeur",
    label: "Ton premier distributeur",
    angle:
      "Les étapes pour lancer un premier distributeur en 2026 : choisir, déplacer, brancher, réapprovisionner. Conseils pratiques une étape = une slide.",
    keywords: ["premier distributeur", "débutant", "étapes"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-cafe-bureau",
    label: "Café au bureau qui plaît vraiment",
    angle:
      "Conseils pour un café d’entreprise que les gens boivent : grains, entretien, bean-to-cup, erreurs classiques des mauvaises machines.",
    keywords: ["café bureau", "bean to cup", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-chantier",
    label: "Installer sur un chantier",
    angle:
      "Conseils concrets pour un distributeur / café sur chantier BTP : robustesse, horaires, paiement, réassort.",
    keywords: ["chantier", "BTP", "café", "conseil"],
    visualQuery: "chantier",
  },
  {
    id: "conseil-marges",
    label: "Comprendre tes marges",
    angle:
      "Conseils simples sur le prix de la tasse, le coût produit, et pourquoi 0,85 CHF peut être ultra rentable. Chiffres concrets, ton clair.",
    keywords: ["marges", "prix", "rentabilité", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-reassort",
    label: "Réapprovisionner sans stress",
    angle:
      "Routine de réassort : fréquence, quoi prioriser, signes qu’une référence ne tourne pas. Conseils de pro terrain.",
    keywords: ["réassort", "stock", "conseil vending"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-paiement",
    label: "Twint, carte, espèces",
    angle:
      "Conseils paiement : pourquoi proposer Twint + carte change les ventes en Suisse. Simple et concret.",
    keywords: ["Twint", "paiement", "Suisse", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-entretien",
    label: "Entretenir la machine",
    angle:
      "Conseils hygiène et revue rapide : ce qui fait fuir les clients (sale, en panne) et comment rester pro.",
    keywords: ["entretien", "hygiène", "machine", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-pme",
    label: "Proposer à une PME",
    angle:
      "Conseils pour convaincre une entreprise : installation gratuite, zéro prise de tête, service inclus. Phrases utiles.",
    keywords: ["PME", "entreprise", "argumentaire", "conseil"],
    visualQuery: "realisation",
  },
  {
    id: "conseil-erreurs",
    label: "Erreurs à éviter",
    angle:
      "3–5 erreurs de débutant en vending (mauvais lieu, mauvais mix, négliger le service) + le bon réflexe à la place.",
    keywords: ["erreurs", "débutant", "conseil"],
    visualQuery: "chantier",
  },
  {
    id: "conseil-service",
    label: "Le service qui fidélise",
    angle:
      "Conseils service client vending : délais d’intervention, communication, pourquoi ça fait rester le client.",
    keywords: ["service", "fidélisation", "conseil"],
    visualQuery: "realisation",
  },
];

export function pickTheme(excludeIds: string[] = []): StudioTheme {
  const pool = STUDIO_THEMES.filter((t) => !excludeIds.includes(t.id));
  const list = pool.length > 0 ? pool : STUDIO_THEMES;
  return list[Math.floor(Math.random() * list.length)]!;
}

export function getThemeById(id: string): StudioTheme | undefined {
  return STUDIO_THEMES.find((t) => t.id === id);
}
