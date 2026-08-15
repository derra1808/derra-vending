/** Offre pack formation — stack, FAQ, garantie, bonus, vidéos */
export const FORMATION_OFFER = {
  ebookPrice: 150,
  ebookOriginalPrice: 297,
  snackPrice: 150,
  packPrice: 250,
  callPrice: 300,
  currency: "CHF",
  guaranteeDays: 14,
  guaranteeText:
    "Garantie 14 jours : si le guide ne te convient pas, écris-nous et on trouve une solution (remboursement ou appel de clarification). Produit numérique — accès immédiat.",
} as const;

export const VALUE_STACK = [
  {
    id: "ebook",
    name: "Ebook — Le Café en Dépôt Gratuit",
    description: "5 parties, méthode terrain testée à Genève — applicable en Europe.",
    value: 47,
  },
  {
    id: "contrat",
    name: "Bonus — Contrat type dépôt gratuit",
    description: "Modèle à adapter pour ton commerçant (Suisse & Europe).",
    value: 39,
  },
  {
    id: "scripts",
    name: "Bonus — Scripts prospection",
    description: "WhatsApp, porte-à-porte, appels et gestion des « non ».",
    value: 29,
  },
  {
    id: "checklist",
    name: "Bonus — Checklist 1ère machine",
    description: "De la prospection à la première facture, étape par étape.",
    value: 19,
  },
  {
    id: "calculator",
    name: "Bonus — Calculateur de marges",
    description: "PDF : marge, point mort, projection parc — à annoter.",
    value: 29,
  },
  {
    id: "videos",
    name: "Espace vidéo membre",
    description: "Modules vidéo à regarder dans ton espace (mises à jour).",
    value: 37,
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "C’est quoi exactement le café en dépôt gratuit ?",
    a: "Tu installes une machine à café chez un commerçant, gratuitement pour lui. Il vend le café à ses clients. Toi, tu factures chaque tasse consommée (ex. 0,85 CHF). Pas de loyer, pas de vente de machine.",
  },
  {
    q: "C’est pour qui ?",
    a: "Pour toute personne en Europe qui veut démarrer le café en dépôt gratuit — en parallèle d’un emploi ou déjà sur le terrain. La méthode vient du terrain genevois, les principes marchent partout (France, Belgique, Suisse, etc.).",
  },
  {
    q: "Ça marche seulement en Suisse ?",
    a: "Non. Ibrahim a construit son parc à Genève, mais le modèle (machine en dépôt, facturation à la tasse, prospection) s’applique dans toute l’Europe. Adapte juste prix/tasse, fournisseurs et contrat à ton pays.",
  },
  {
    q: "Combien faut-il pour démarrer ?",
    a: "Souvent une machine d’occasion + un peu de stock. L’ebook donne les ordres de grandeur (exemples en CHF) ; le calculateur t’aide à convertir dans ta devise.",
  },
  {
    q: "Est-ce que je dois quitter mon travail ?",
    a: "Non. Ibrahim a commencé en parallèle pendant 6 mois. Tu peux tester avec 1–2 machines le soir et le week-end.",
  },
  {
    q: "Les commerçants vont-ils vraiment accepter ?",
    a: "Oui, si tu enlèves tous les freins : zéro frais pour eux, zéro engagement long, tu fournis et tu entretiens. Le pack inclut les scripts et le contrat type à adapter à ton pays.",
  },
  {
    q: "Combien je peux gagner par machine ?",
    a: "Ça dépend de l’emplacement. Sur le terrain genevois : environ 250 à 800 tasses/mois. Avec ~0,73 CHF de marge/tasse en exemple — tu ajustes le prix/tasse à ton marché (EUR, etc.).",
  },
  {
    q: "Est-ce que j’ai les contacts fournisseurs ?",
    a: "Dans la formation : où chercher (Facebook Marketplace, Leboncoin, Anibis…). Les contacts fournisseurs négociés d’Ibrahim sont dans l’appel Q&R.",
  },
  {
    q: "Combien de temps pour lire et appliquer ?",
    a: "Lecture en une soirée. Les bonus se mettent en pratique dès le lendemain (message WhatsApp, checklist, contrat).",
  },
  {
    q: "Y a-t-il des vidéos ?",
    a: "Oui — espace vidéo dans ton espace membre (présentation, prospection, machines, tournée…). Mis à jour au fur et à mesure.",
  },
  {
    q: "Et si ça ne me convient pas ?",
    a: "Garantie 14 jours : contacte-nous avec ton email d’achat. Produit numérique, accès immédiat.",
  },
  {
    q: "Différence avec l’appel ?",
    a: "Formation café ou snack (150 CHF) = méthode seule. Pack 250 = les 2. Appel 300 CHF = 1h avec Ibrahim + accès à ses fournisseurs.",
  },
  {
    q: "Et le cadre légal ?",
    a: "Le modèle est simple partout en Europe, mais le statut (auto-entrepreneur, entreprise individuelle, etc.) dépend de ton pays. L’ebook donne le cadre de base ; fais valider contrat et statut localement si besoin.",
  },
] as const;

export const BUSINESS_GOLD_RULE =
  "Dans le business, ton client doit avoir l’impression de gagner. Toujours. Un commerçant content pousse le café, reste des années, et te recommande. Vaut mieux gagner un peu, longtemps, que beaucoup, une fois.";

export const MEMBER_VIDEOS = [
  {
    id: "presentation",
    title: "Présentation — la méthode en 90 secondes",
    description: "Qui je suis, le modèle dépôt gratuit, ce que tu vas apprendre.",
    filename: "01-presentation.mp4",
    duration: "≈ 2 min",
  },
  {
    id: "part-1",
    title: "Partie 1 — Le business model (avatar HeyGen)",
    description: "Ibrahim t’explique le dépôt gratuit, les marges et la règle d’or.",
    filename: "part-1-heygen.mp4",
    duration: "≈ 2 min",
  },
  {
    id: "part-2",
    title: "Partie 2 — Prospection (avatar HeyGen)",
    description: "Entourage, porte-à-porte, réseaux, effet boule de neige.",
    filename: "part-2-heygen.mp4",
    duration: "COMPLETE",
  },
  {
    id: "business-model",
    title: "Partie 1 — Le business model",
    description: "0,85 CHF, marges, contrat, pourquoi le commerçant dit oui.",
    filename: "02-business-model.mp4",
    duration: "À venir",
  },
  {
    id: "prospection",
    title: "Partie 2 — Prospection",
    description: "Entourage, porte-à-porte, scripts et effet boule de neige.",
    filename: "03-prospection.mp4",
    duration: "À venir",
  },
  {
    id: "machines",
    title: "Partie 3 — Machines & fournisseurs",
    description: "Occasion vs neuf, Gaggia, consommables, Profital.",
    filename: "04-machines.mp4",
    duration: "À venir",
  },
  {
    id: "gestion",
    title: "Partie 4 — Gestion au quotidien",
    description: "Rinçage, tournée mensuelle, stock, entretien.",
    filename: "05-gestion.mp4",
    duration: "À venir",
  },
  {
    id: "chiffres",
    title: "Partie 5 — Les chiffres réels",
    description: "Volumes, point mort, projection sur un parc.",
    filename: "06-chiffres.mp4",
    duration: "À venir",
  },
] as const;

/** Vidéo avatar HeyGen par partie (si le fichier existe) */
export const PART_AVATAR_VIDEO: Partial<
  Record<number, { id: string; filename: string }>
> = {
  1: { id: "part-1", filename: "part-1-heygen.mp4" },
  2: { id: "part-2", filename: "part-2-heygen.mp4" },
};

export const MEMBER_DOWNLOADS = [
  {
    id: "ebook",
    label: "Ebook — Le Café en Dépôt Gratuit",
    description: "La méthode complète en PDF",
    file: "ebook.pdf",
    type: "pdf" as const,
  },
  {
    id: "contrat",
    label: "Contrat type — dépôt gratuit",
    description: "Modèle prêt à remplir et à adapter à ton pays",
    file: "contrat-depot-gratuit.pdf",
    type: "pdf" as const,
  },
  {
    id: "scripts",
    label: "Scripts prospection",
    description: "WhatsApp, porte-à-porte, appel et objections",
    file: "scripts-prospection.pdf",
    type: "pdf" as const,
  },
  {
    id: "checklist",
    label: "Checklist 1ère machine",
    description: "15 étapes expliquées simplement — de zéro à la 1ère machine",
    file: "checklist-premiere-machine.pdf",
    type: "pdf" as const,
  },
  {
    id: "calculator",
    label: "Calculateur de marges",
    description: "Tableau marges, point mort et parc — à annoter",
    file: "calculateur-marges.pdf",
    type: "pdf" as const,
  },
] as const;
