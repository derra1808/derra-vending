/** Exemple style TikTok Photo + textes + musique (comme tes screenshots) */

export interface CarouselSlide {
  top: string;
  bottom: string;
  /** Chemin relatif sous public/ (prioritaire) */
  galleryPath?: string;
  /** Requête Pexels si galleryPath absente / indisponible */
  photoQuery: string;
  durationSec: number;
}

/**
 * Script hardcodé « Comment installer ton premier distributeur »
 * Ton éducatif TikTok Photo (bulles blanches + musique).
 */
export const CAROUSEL_EXAMPLE = {
  themeId: "installer-premier-distributeur",
  themeLabel: "Installer ton premier distributeur",
  title: "Comment installer ton premier distributeur automatique 🔑",
  hook: "Comment lancer un distributeur en 2026",
  caption:
    "Comment installer ton premier distributeur automatique 🔑 #distributeur #distributeurautomatique #vending #geneve #derravending",
  hashtags: [
    "distributeur",
    "distributeurautomatique",
    "vending",
    "geneve",
    "derravending",
    "entrepreneur",
  ],
  /** TTS désactivé pour ce test — musique seule (style disque qui tourne) */
  tts: false as const,
  slides: [
    {
      top: "Comment lancer un distributeur en 2026",
      bottom: "Je t'explique chaque étape ➡️",
      galleryPath: "/gallery/realisation-06.png",
      photoQuery: "vending machine snacks drinks",
      durationSec: 3.5,
    },
    {
      top: "Pour les produits inspire-toi de ceux que tu vois déjà autour de toi !",
      bottom: "Et achète chez un grossiste pour maximiser tes marges",
      galleryPath: "/gallery/realisation-12.png",
      photoQuery: "vending machine chips candy",
      durationSec: 4,
    },
    {
      top: "(Concentre-toi sur les boissons classiques)",
      bottom: "Café, eau, softs = rotation rapide",
      galleryPath: "/gallery/realisation-18.png",
      photoQuery: "vending machine beverages bottles",
      durationSec: 3.5,
    },
    {
      top: "Étape 3 : Le déplacer jusqu'à ton emplacement",
      bottom: "Loue un camion à hayon, et sangle bien le distributeur !!",
      galleryPath: "/gallery/chantier-03.png",
      photoQuery: "moving truck loading warehouse",
      durationSec: 4,
    },
    {
      top: "Étape 4 : Réapprovisionne toutes les semaines et récupère tes bénéfices !",
      bottom: "Des questions ? Abonne-toi 🗳️",
      galleryPath: "/gallery/realisation-28.png",
      photoQuery: "vending machine restocking snacks",
      durationSec: 4,
    },
  ] satisfies CarouselSlide[],
} as const;

/**
 * Musique royalty-free Unminus (CDN Shotstack) — PAS de hits TikTok copyrightés.
 * Override : STUDIO_BG_MUSIC_URL=
 */
export function getCarouselMusicUrl(): string {
  return (
    process.env.STUDIO_BG_MUSIC_URL ||
    "https://shotstack-assets.s3.amazonaws.com/music/unminus/ambition.mp3"
  );
}

export function carouselTotalDuration(
  slides: ReadonlyArray<{ durationSec: number }> = CAROUSEL_EXAMPLE.slides
): number {
  return slides.reduce((sum, s) => sum + s.durationSec, 0);
}

/** Base URL publique pour assets locaux (Shotstack ne peut pas lire localhost). */
export function getPublicAssetBaseUrl(): string {
  const fromEnv = process.env.STUDIO_PUBLIC_ASSET_BASE?.replace(/\/$/, "");
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site && !/localhost|127\.0\.0\.1/i.test(site)) return site;

  // Domaine custom pas toujours résolu en local — Vercel est public et stable
  return "https://derra-vending.vercel.app";
}

export function galleryPublicUrl(galleryPath: string): string {
  const path = galleryPath.startsWith("/") ? galleryPath : `/${galleryPath}`;
  return `${getPublicAssetBaseUrl()}${path}`;
}
