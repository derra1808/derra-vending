export const FORMATION = {
  title: "Le Café en Dépôt Gratuit",
  subtitle:
    "Tu poses une machine chez un commerçant. Il ne paie rien. Toi, tu gagnes sur chaque tasse.",
  tagline: "MÉTHODE TERRAIN · EUROPE · 40 MACHINES",
  ebookPrice: 50,
  ebookOriginalPrice: 147,
  currency: "CHF",
  coachingCallPrice: 150,
  coachingFullPrice: 490,
} as const;

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
  "Machines, stock, tournée — le quotidien sans surprise",
  "Bonus : contrat, scripts, checklist, calculateur",
  "Espace vidéo membre",
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
    description: "Occasion, Gaggia, consommables.",
    lessons: ["Où acheter", "Profital"],
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

export const COACHING_OPTIONS = [
  {
    id: "call",
    name: "Appel Q&R",
    price: 150,
    description: "1 heure en visio pour répondre à toutes vos questions sur votre projet vending.",
    features: ["Analyse de votre situation", "Réponses directes et concrètes", "Plan d'action personnalisé"],
    stripePriceEnv: "STRIPE_PRICE_COACHING_CALL",
  },
  {
    id: "full",
    name: "Accompagnement complet",
    price: 490,
    description: "Suivi sur 30 jours : de l'idée à votre première machine installée.",
    features: [
      "4 sessions de coaching",
      "Aide à la prospection d'emplacements",
      "Revue de vos contrats",
      "Support WhatsApp prioritaire",
    ],
    stripePriceEnv: "STRIPE_PRICE_COACHING_FULL",
    popular: true,
  },
] as const;

/** Contenu ebook — voir ebook-content.ts */
export { EBOOK_PARTS } from "./ebook-content";
