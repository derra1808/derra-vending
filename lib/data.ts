export const COMPANY = {
  name: "Derra Vending",
  founder: "Ibrahim Derra",
  address: "Rue de la Golette 15G",
  city: "1217 Meyrin",
  country: "Suisse",
  fullAddress: "Rue de la Golette 15G, 1217 Meyrin, Suisse",
  phone: "+41 79 757 08 97",
  phoneHref: "tel:+41797570897",
  email: "derra_vending@hotmail.com",
  emailHref: "mailto:derra_vending@hotmail.com",
  uid: "CHE-322.659.692",
  region: "Genève et environs",
} as const;

/** Réseaux sociaux — mettre "" pour masquer une icône */
export const SOCIAL_LINKS = {
  whatsapp: "https://wa.me/41797570897?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20Derra%20Vending.",
  instagram: "https://www.instagram.com/derra_vending?igsh=MzhlaXhtN2cwcnh6",
  facebook: "https://www.facebook.com/share/1b1Z38FgjW/",
  linkedin: "https://www.linkedin.com/in/derra-vending-001963296",
  tiktok: "https://vm.tiktok.com/ZNRKdkuLA/",
} as const;

export const SEO_KEYWORDS = [
  "distributeur automatique Genève",
  "machine à café entreprise Genève",
  "distributeur snacks Genève",
  "vending Genève",
  "distributeur automatique Meyrin",
  "machine à café professionnelle Genève",
  "vending entreprise Suisse",
] as const;

export const STATS = [
  { value: 40, suffix: "+", label: "Machines installées" },
  { value: 24, suffix: "/7", label: "Disponibilité du service" },
  { value: 48, suffix: "h", label: "Interventions rapides" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
] as const;

export const WHY_CHOOSE = [
  {
    title: "Installation gratuite",
    description: "Nous installons vos distributeurs sans frais. Zéro investissement initial de votre part.",
    icon: "install",
  },
  {
    title: "Aucun investissement",
    description: "Pas d'achat de machine, pas de contrat lourd. Nous prenons en charge le matériel.",
    icon: "invest",
  },
  {
    title: "Entretien inclus",
    description: "Maintenance préventive et curative. Vos machines restent opérationnelles en permanence.",
    icon: "maintain",
  },
  {
    title: "Réapprovisionnement assuré",
    description: "Boissons, café et snacks réapprovisionnés régulièrement selon votre consommation.",
    icon: "stock",
  },
  {
    title: "Paiement moderne",
    description: "Carte bancaire, smartphone et espèces. Solutions adaptées à tous vos utilisateurs.",
    icon: "payment",
  },
  {
    title: "Service rapide local",
    description: "Basés à Meyrin, nous intervenons rapidement sur Genève et tout le canton.",
    icon: "speed",
  },
] as const;

export const SOLUTIONS = [
  {
    title: "Machine à café professionnelle",
    description:
      "De la capsule compacte Necta au distributeur haute capacité pour entreprises et chantiers. Café, cappuccino, chocolat chaud.",
    tag: "Café",
    icon: "coffee",
  },
  {
    title: "Distributeur boissons fraîches",
    description:
      "Eau, sodas, jus et boissons énergisantes. Réfrigération optimale pour un service continu.",
    tag: "Frais",
    icon: "drinks",
  },
  {
    title: "Distributeur snacks",
    description:
      "Chips, barres, biscuits et confiseries. Sélection adaptée à votre public et à votre emplacement.",
    tag: "Snacks",
    icon: "snacks",
  },
  {
    title: "Solutions sur mesure",
    description:
      "Combinaisons café + snacks, configurations chantier, commerces et centres médicaux. Étude personnalisée.",
    tag: "Sur mesure",
    icon: "custom",
  },
] as const;

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Étude gratuite",
    description: "Analyse de votre espace, de votre flux et de vos besoins en consommation.",
  },
  {
    step: "02",
    title: "Installation",
    description: "Mise en place professionnelle, raccordements et tests. Sans frais pour vous.",
  },
  {
    step: "03",
    title: "Approvisionnement",
    description: "Premier remplissage et planning de réapprovisionnement adapté.",
  },
  {
    step: "04",
    title: "Maintenance",
    description: "Entretien régulier, interventions rapides et remplacement si nécessaire.",
  },
  {
    step: "05",
    title: "Suivi permanent",
    description: "Optimisation des emplacements, ajustement des produits et reporting.",
  },
] as const;

export const CLIENT_TYPES = [
  "Entreprises",
  "Chantiers",
  "Commerces",
  "Tabacs & kiosques",
  "Centres médicaux",
  "Administrations",
  "Salles de sport",
  "Associations",
] as const;

export const FAKE_LOGOS = [
  "Alpine Build",
  "Geneva Med",
  "Swiss Office",
  "Léman Sport",
  "Meyrin Commerce",
  "Canton Services",
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Installation rapide et sans frais. Nos équipes sur chantier ont enfin un vrai point café. Service réactif quand une machine a besoin d'attention.",
    author: "Marc L.",
    role: "Responsable chantier, entreprise BTP — Genève",
    rating: 5,
  },
  {
    quote:
      "Derra Vending gère tout de A à Z. On n'a rien à s'occuper : remplissage, entretien, paiement par carte. Exactement ce qu'on cherchait pour notre commerce.",
    author: "Sophie R.",
    role: "Gérante, commerce de proximité — Meyrin",
    rating: 5,
  },
  {
    quote:
      "Professionnel, ponctuel et transparent. La machine Necta dans notre espace d'accueil fait très bonne impression auprès de nos clients.",
    author: "Dr. Ahmed K.",
    role: "Centre médical — Carouge",
    rating: 5,
  },
  {
    quote:
      "Plus de 40 machines gérées, ça se sent. Ils connaissent Genève, les bons emplacements et les bons produits. Partenaire fiable sur le long terme.",
    author: "Thomas B.",
    role: "Facility Manager — Vernier",
    rating: 5,
  },
] as const;

export type RealizationCategory = "entreprise" | "chantier" | "commerce" | "all";

export interface Realization {
  src: string;
  alt: string;
  category: RealizationCategory;
  caption: string;
}

function buildRealizations(): Realization[] {
  const captions: Record<RealizationCategory, string[]> = {
    entreprise: [
      "Distributeur combo café & snacks — entreprise",
      "Machine haute capacité — espace professionnel",
      "Installation premium — bureau Genève",
      "Point pause entreprise — boissons & snacks",
      "Solution vending complète — open space",
      "Machine à café professionnelle — showroom",
      "Espace détente entreprise — Genève",
      "Distributeur moderne — grande consommation",
      "Installation clé en main — entreprise",
      "Combo café & confiseries — site industriel",
    ],
    chantier: [
      "Installation chantier — combo café & snacks",
      "Distributeurs sur site BTP — Genève",
      "Point pause chantier — boissons chaudes",
      "Machine haute capacité — chantier actif",
      "Espace ouvrier — vending complet",
      "Installation en cours — site construction",
      "Distributeur chantier — maintenance incluse",
      "Pause café sur chantier — Suisse",
    ],
    commerce: [
      "Machine Necta — tabac & commerce Meyrin",
      "Café professionnel — kiosque Genève",
      "Installation compacte — commerce de proximité",
      "Point café Jura — espace accueil",
      "Machine Saeco — tabac local",
      "Solution Necta — commerce partenaire",
      "Self-service café — 2.50 CHF",
      "Organisation gobelets & condiments — Derra",
      "Machine compacte — boutique",
      "Installation kiosque — boissons chaudes",
    ],
    all: [],
  };

  const categories: RealizationCategory[] = [
    "entreprise",
    "chantier",
    "commerce",
    "entreprise",
    "chantier",
    "commerce",
  ];

  return Array.from({ length: 54 }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    const category = categories[i % categories.length];
    const pool = captions[category];
    const caption = pool[i % pool.length];
    return {
      src: `/gallery/realisation-${num}.png`,
      alt: caption,
      category,
      caption,
    };
  });
}

export const REALIZATIONS = buildRealizations();

export const GALLERY_FEATURED = REALIZATIONS.filter((_, i) =>
  [0, 5, 8, 12, 18, 22, 28, 35, 42, 48].includes(i)
);
