import type { ZodiacSign, Element, CoreNumber } from "./types";

export const ZODIAC_ORDER: ZodiacSign[] = [
  "belier",
  "taureau",
  "gemeaux",
  "cancer",
  "lion",
  "vierge",
  "balance",
  "scorpion",
  "sagittaire",
  "capricorne",
  "verseau",
  "poissons",
];

export const ZODIAC_LABELS: Record<ZodiacSign, string> = {
  belier: "Bélier",
  taureau: "Taureau",
  gemeaux: "Gémeaux",
  cancer: "Cancer",
  lion: "Lion",
  vierge: "Vierge",
  balance: "Balance",
  scorpion: "Scorpion",
  sagittaire: "Sagittaire",
  capricorne: "Capricorne",
  verseau: "Verseau",
  poissons: "Poissons",
};

export const ZODIAC_DATES: Record<ZodiacSign, { start: [number, number]; end: [number, number] }> = {
  belier: { start: [3, 21], end: [4, 19] },
  taureau: { start: [4, 20], end: [5, 20] },
  gemeaux: { start: [5, 21], end: [6, 20] },
  cancer: { start: [6, 21], end: [7, 22] },
  lion: { start: [7, 23], end: [8, 22] },
  vierge: { start: [8, 23], end: [9, 22] },
  balance: { start: [9, 23], end: [10, 22] },
  scorpion: { start: [10, 23], end: [11, 21] },
  sagittaire: { start: [11, 22], end: [12, 21] },
  capricorne: { start: [12, 22], end: [1, 19] },
  verseau: { start: [1, 20], end: [2, 18] },
  poissons: { start: [2, 19], end: [3, 20] },
};

export const ZODIAC_ELEMENTS: Record<ZodiacSign, Element> = {
  belier: "feu",
  taureau: "terre",
  gemeaux: "air",
  cancer: "eau",
  lion: "feu",
  vierge: "terre",
  balance: "air",
  scorpion: "eau",
  sagittaire: "feu",
  capricorne: "terre",
  verseau: "air",
  poissons: "eau",
};

export const ZODIAC_MODALITIES: Record<ZodiacSign, "cardinal" | "fixe" | "mutable"> = {
  belier: "cardinal",
  taureau: "fixe",
  gemeaux: "mutable",
  cancer: "cardinal",
  lion: "fixe",
  vierge: "mutable",
  balance: "cardinal",
  scorpion: "fixe",
  sagittaire: "mutable",
  capricorne: "cardinal",
  verseau: "fixe",
  poissons: "mutable",
};

export const ZODIAC_PLANETS: Record<ZodiacSign, string> = {
  belier: "Mars",
  taureau: "Vénus",
  gemeaux: "Mercure",
  cancer: "Lune",
  lion: "Soleil",
  vierge: "Mercure",
  balance: "Vénus",
  scorpion: "Pluton",
  sagittaire: "Jupiter",
  capricorne: "Saturne",
  verseau: "Uranus",
  poissons: "Neptune",
};

export const ELEMENT_LABELS: Record<Element, string> = {
  feu: "Feu",
  terre: "Terre",
  air: "Air",
  eau: "Eau",
};

export const CHINESE_SIGNS = [
  "Rat",
  "Bœuf",
  "Tigre",
  "Lapin",
  "Dragon",
  "Serpent",
  "Cheval",
  "Chèvre",
  "Singe",
  "Coq",
  "Chien",
  "Cochon",
] as const;

export const CHINESE_ELEMENTS = ["Bois", "Feu", "Terre", "Métal", "Eau"] as const;

export const LETTER_VALUES: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
};

export const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

export const MASTER_NUMBERS = new Set([11, 22, 33]);

export const NUMBER_SYMBOLS: Record<
  CoreNumber,
  { name: string; symbol: string; trait: string }
> = {
  1: { name: "Le Soleil Intérieur", symbol: "☉", trait: "Leadership et initiative" },
  2: { name: "La Lune Diplomate", symbol: "☽", trait: "Sensibilité et coopération" },
  3: { name: "La Trinité Créative", symbol: "✦", trait: "Expression et joie de vivre" },
  4: { name: "Le Cube Fondamental", symbol: "⬛", trait: "Structure et persévérance" },
  5: { name: "L'Étoile du Voyageur", symbol: "✶", trait: "Liberté et transformation" },
  6: { name: "Le Cœur Protecteur", symbol: "♡", trait: "Amour et responsabilité" },
  7: { name: "L'Œil Mystique", symbol: "👁", trait: "Intuition et quête de vérité" },
  8: { name: "L'Infini du Pouvoir", symbol: "∞", trait: "Ambition et réussite matérielle" },
  9: { name: "Le Globe Humaniste", symbol: "🌍", trait: "Altruisme et sagesse universelle" },
  11: { name: "La Flèche Intuitive", symbol: "⚡", trait: "Inspiration et vision spirituelle" },
  22: { name: "Le Maître Bâtisseur", symbol: "△", trait: "Grands projets et impact durable" },
  33: { name: "Le Lotus Enseignant", symbol: "✿", trait: "Guérison et service élevé" },
};
