/** Grille tarifaire Derra Formation */
export const FORMATION = {
  title: "Le Café en Dépôt Gratuit",
  subtitle:
    "Tu poses une machine chez un commerçant. Il ne paie rien. Toi, tu gagnes sur chaque tasse.",
  tagline: "MÉTHODE TERRAIN · EUROPE · 40 MACHINES",
  /** Formation café */
  ebookPrice: 47,
  ebookOriginalPrice: 150,
  snackPrice: 150,
  snackOriginalPrice: 297,
  packPrice: 250,
  packOriginalPrice: 300,
  currency: "CHF",
  coachingCallPrice: 100,
  coachingFullPrice: 300,
} as const;

export const FORMATION_PRODUCTS = [
  {
    id: "cafe",
    name: "Formation café",
    price: FORMATION.ebookPrice,
    originalPrice: FORMATION.ebookOriginalPrice,
    role: "Méthode seule",
    badge: "Dispo maintenant",
    hook: "La méthode terrain — accès immédiat",
    description: "Le Café en Dépôt Gratuit — ebook, bonus, audio, vidéos.",
    features: [
      "Méthode dépôt gratuit café",
      "Bonus PDF + 50 Q/R terrain + audio + vidéos",
      "Où trouver tes machines (occasion)",
      "Accès espace membre",
    ],
    cta: "Commencer — 47 CHF",
    product: "ebook" as const,
    available: true,
    highlight: false,
    featured: true,
  },
  {
    id: "snack",
    name: "Formation snack",
    price: FORMATION.snackPrice,
    originalPrice: FORMATION.snackOriginalPrice,
    role: "Méthode seule",
    badge: "Bientôt",
    hook: "Même modèle, autre produit",
    description: "Distributeurs snack — même logique, autre produit.",
    features: [
      "Méthode snack en dépôt / emplacement",
      "Assortiment & marges",
      "Prospection & gestion",
      "Accès espace membre snack",
    ],
    cta: "Me prévenir à la sortie",
    product: "snack" as const,
    available: false,
    highlight: false,
    featured: false,
  },
  {
    id: "pack",
    name: "Pack café + snack",
    price: FORMATION.packPrice,
    originalPrice: FORMATION.packOriginalPrice,
    role: "Les 2 formations",
    badge: "−50 CHF",
    hook: "Les deux métiers, un seul prix",
    description: "Café + snack ensemble — tu économises 50 CHF.",
    features: [
      "Formation café complète",
      "Formation snack complète",
      "Tous les bonus",
      "Un seul accès membre",
    ],
    cta: "Réserver le pack — bientôt",
    product: "pack" as const,
    available: false,
    highlight: true,
    featured: false,
  },
  {
    id: "call",
    name: "Appel Q&R (1h)",
    price: FORMATION.coachingCallPrice,
    originalPrice: null,
    role: "Questions + mes fournisseurs",
    badge: "Fournisseurs inclus",
    hook: "1h avec moi + mes contacts",
    description:
      "1 heure en visio : on règle ta situation, et tu repars avec mes contacts fournisseurs.",
    features: [
      "Accès à mes fournisseurs (machines & consommables)",
      "Réponses sur ton projet concret",
      "Plan d’action personnalisé",
      "Café et/ou snack",
    ],
    cta: "Réserver l’appel — 100 CHF",
    product: "coaching_call" as const,
    available: true,
    highlight: true,
    featured: false,
  },
] as const;

export const FOUNDER_STORY = {
  intro: "Maçon CFC à Genève. 6'700 CHF brut. Puis 5 machines et moins de 500 CHF/mois. Aujourd'hui : 40 machines.",
  before: {
    job: "Maçon CFC",
    salary: "6'700 CHF brut",
    experience: "8 ans",
  },
  transition: "6 mois en parallèle, puis démission. 5 machines. Moins de 500 CHF/mois.",
  today: {
    machines: 40,
    coffeeMachines: 30,
    snackMachines: 10,
    timeline: "2,5 ans",
    status: "Je vis de cette activité.",
  },
  quote:
    "Ce guide, c'est la feuille de route que j'aurais voulu avoir le premier jour.",
} as const;

export const LANDING_BENEFITS = [
  "Le modèle exact : 0,85 CHF/tasse, marges, contrat",
  "Comment trouver et convaincre les commerçants",
  "Où trouver tes machines (Leboncoin, Marketplace…) + stock & tournée",
  "Bonus : contrat, scripts, checklist, calculateur, 50 Q/R",
  "Espace vidéo membre + lecture audio",
] as const;

export const MODULES = [
  {
    id: 1,
    title: "Le business model",
    description: "Dépôt gratuit, marges, contrat.",
    lessons: ["0,85 CHF/tasse", "Pourquoi ça marche"],
  },
  {
    id: 2,
    title: "Trouver les commerçants",
    description: "Entourage, porte-à-porte, scripts.",
    lessons: ["Messages prêts", "Objections"],
  },
  {
    id: 3,
    title: "Machines & stock",
    description: "Occasion, Leboncoin, Marketplace, Gaggia.",
    lessons: ["Leboncoin / Marketplace", "Profital"],
  },
  {
    id: 4,
    title: "Gestion quotidienne",
    description: "Rinçage, tournée, entretien.",
    lessons: ["4 paquets gobelets", "Stock mensuel"],
  },
  {
    id: 5,
    title: "Les chiffres",
    description: "Volumes, point mort, parc.",
    lessons: ["250–800 tasses", "Projection"],
  },
] as const;

export const TESTIMONIALS_FORMATION = [
  {
    quote:
      "Grâce aux conseils d'Ibrahim, j'ai posé ma première machine en 3 semaines. Le dépôt gratuit, personne ne m'en avait parlé avant.",
    author: "Karim B.",
    role: "Nouveau vendeur — Genève",
  },
  {
    quote:
      "Contenu concret, pas de blabla. Les chiffres réels et la checklist m'ont fait gagner des semaines.",
    author: "Lucas M.",
    role: "Entrepreneur — Meyrin",
  },
  {
    quote:
      "L'accompagnement m'a évité des erreurs qui m'auraient coûté des milliers de francs. Investissement rentabilisé en 1 mois.",
    author: "Sophie T.",
    role: "Indépendante — Carouge",
  },
] as const;

/** @deprecated utiliser FORMATION_PRODUCTS — gardé pour compat */
export const COACHING_OPTIONS = [
  {
    id: "call",
    name: "Appel Q&R + fournisseurs",
    price: FORMATION.coachingCallPrice,
    description:
      "1 heure en visio : on règle ta situation, et tu repars avec mes contacts fournisseurs (machines + consommables) — ceux que j’utilise.",
    features: [
      "Accès à mes fournisseurs (machines & consommables)",
      "Réponses sur ton projet concret",
      "Plan d’action personnalisé",
      "Analyse de ta situation (café / snack)",
    ],
    stripePriceEnv: "STRIPE_PRICE_COACHING_CALL",
    popular: true,
  },
] as const;

/** Contenu ebook — voir ebook-content.ts */
export { EBOOK_PARTS } from "./ebook-content";
