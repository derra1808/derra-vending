import type { StudioTheme } from "./types";

/**
 * Banque de sujets passionnants — histoire du vending, café, machines.
 * Style : vraies histoires qui donnent envie d’écouter jusqu’à la fin.
 */
export const STUDIO_THEMES: StudioTheme[] = [
  {
    id: "horn-vending-1880",
    label: "La première machine à pièces",
    angle:
      "Raconter l’histoire de la première distributeuse à pièces (fin XIXe) comme une scène vivante : qui l’a inventée, ce qu’elle vendait, pourquoi ça a choqué l’époque. Teaser final vers le vending d’aujourd’hui.",
    keywords: ["histoire vending", "distributeur", "invention", "café"],
    visualQuery: "antique vintage coin machine museum",
  },
  {
    id: "cafe-ethiopie",
    label: "Le café est né en Éthiopie",
    angle:
      "Légende de Kaldi et des chèvres qui dansent : une histoire vraie-mythe du café, puis le voyage jusqu’à nos tasses et nos distributeurs. Donner envie d’écouter la chute.",
    keywords: ["histoire café", "Éthiopie", "Kaldi", "origine café"],
    visualQuery: "ethiopia coffee plantation hills beans",
  },
  {
    id: "espresso-milan",
    label: "L’espresso est né à Milan",
    angle:
      "Comment l’Italie a inventé l’espresso sous pression — une révolution en quelques secondes. Lien avec les machines bean-to-cup d’aujourd’hui en entreprise.",
    keywords: ["espresso", "Italie", "machine café", "histoire"],
    visualQuery: "italian espresso machine barista steam",
  },
  {
    id: "guerre-distributeurs-usa",
    label: "L’Amérique et l’âge d’or des distributeurs",
    angle:
      "Années 50–70 aux USA : Coca, snacks, cigarettes — le vending partout. Une anecdote précise, un chiffre fou, une chute sur pourquoi l’Europe a suivi autrement.",
    keywords: ["vending USA", "années 50", "distributeur automatique"],
    visualQuery: "1950s american diner soda vending machine",
  },
  {
    id: "japon-vending-folie",
    label: "Le Japon, roi mondial du vending",
    angle:
      "Pourquoi le Japon a plus de distributeurs que d’habitants dans certaines villes : œufs, parapluies, café chaud… Une histoire ultra concrète qui surprend jusqu’à la fin.",
    keywords: ["Japon", "distributeur", "vending culture", "café"],
    visualQuery: "japan tokyo street vending machines night",
  },
  {
    id: "twint-revolution",
    label: "Du jeton au Twint",
    angle:
      "Petite histoire du paiement dans le vending : pièces, jetons, cartes, puis Twint. Une scène concrète “avant/après” qui parle aux gens en Suisse.",
    keywords: ["Twint", "paiement", "distributeur", "Suisse"],
    visualQuery: "mobile payment phone coffee machine",
  },
  {
    id: "bean-to-cup",
    label: "Bean-to-cup : la machine qui change tout",
    angle:
      "Expliquer comme une histoire : grain entier → mouture → espresso en 30 secondes. Pourquoi ça a rendu le café de bureau enfin buvable (et désirable).",
    keywords: ["bean to cup", "machine café", "espresso bureau"],
    visualQuery: "bean to cup coffee machine grinding beans",
  },
  {
    id: "necta-chantier",
    label: "Le café sur les chantiers",
    angle:
      "Histoire vraie du terrain : ouvriers, 6h du matin, froid, besoin d’un vrai café. Comment une machine robuste devient le “cœur” du chantier. Ton humain, pas catalogue.",
    keywords: ["chantier", "café", "BTP", "distributeur"],
    visualQuery: "construction site workers coffee break morning",
  },
  {
    id: "arabica-robusta",
    label: "Arabica vs Robusta : la guerre des grains",
    angle:
      "Deux personnages : Arabica (arômes) vs Robusta (corps, caféine). Une rivalité racontée comme un duel, puis ce que ça change dans une tasse de distributeur.",
    keywords: ["arabica", "robusta", "café", "grains"],
    visualQuery: "coffee beans arabica robusta close up",
  },
  {
    id: "premiere-pause-cafe",
    label: "D’où vient la pause café ?",
    angle:
      "Comment la pause café est devenue un rituel social au travail — histoire courte, chute sur pourquoi un distributeur bien placé change l’ambiance d’une boîte.",
    keywords: ["pause café", "bureau", "histoire", "travail"],
    visualQuery: "office coffee break colleagues talking",
  },
  {
    id: "machine-casse-mythe",
    label: "Le mythe de la “mauvaise machine à café”",
    angle:
      "Pourquoi tant de machines d’entreprise font un café médiocre (entretien, eau, grains, négligence) — puis la révélation : une bonne machine bien gérée change tout. Hook fort.",
    keywords: ["machine café", "qualité", "entretien", "bureau"],
    visualQuery: "dirty office coffee machine neglected",
  },
  {
    id: "suisse-cafe-culture",
    label: "La Suisse et le café",
    angle:
      "Anecdote suisse : densité de cafés, qualité, attentes élevées. Pourquoi un distributeur à Genève ne peut pas “tricher” sur le goût. Histoire locale crédible.",
    keywords: ["Suisse", "Genève", "café", "qualité"],
    visualQuery: "geneva cafe terrace switzerland coffee",
  },
  {
    id: "inventeur-oublie",
    label: "L’inventeur oublié du vending",
    angle:
      "Raconter un inventeur / une invention méconnue du distributeur automatique comme un mini-documentaire en 40 secondes, avec une chute surprenante.",
    keywords: ["invention", "histoire", "distributeur", "anecdote"],
    visualQuery: "vintage inventor workshop sketch patent",
  },
  {
    id: "cafe-espace",
    label: "Le café… dans l’espace ?",
    angle:
      "Anecdote vraie ou documentée sur le café / boissons chaudes hors du quotidien (avion, espace, extrême). Relier à l’obsession humaine pour le café, puis au distributeur du quotidien.",
    keywords: ["café", "anecdote", "espace", "curiosité"],
    visualQuery: "astronaut space station coffee floating",
  },
  {
    id: "cappuccino-mousse",
    label: "La science de la mousse de lait",
    angle:
      "Petite histoire sensorielle : pourquoi la mousse change tout (température, protéines, texture). Rendre ça captivant jusqu’à la dernière phrase, puis lien machine pro.",
    keywords: ["cappuccino", "mousse lait", "barista", "machine"],
    visualQuery: "cappuccino milk foam latte art close",
  },
  {
    id: "nuit-des-machines",
    label: "Ce que fait une machine à 3h du matin",
    angle:
      "Scène nocturne : hôpital, entrepôt, station — quelqu’un glisse une carte, un café tombe. Poétique + concret. Pourquoi le vending ne dort jamais.",
    keywords: ["24h", "nuit", "distributeur", "café"],
    visualQuery: "night empty hallway vending machine light",
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
