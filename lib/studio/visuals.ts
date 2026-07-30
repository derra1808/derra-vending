import {
  galleryPublicUrl,
  type CarouselSlide,
} from "./carousel-example";

export interface VisualAsset {
  url: string;
  /** Preview/still (utile pour templates Shotstack image-based) */
  imageUrl?: string;
  photographer?: string;
}

/**
 * Résout les images d’un carousel : gallery Derra (URL publique) puis Pexels.
 */
export async function resolveCarouselSlideImages(
  slides: ReadonlyArray<CarouselSlide>
): Promise<
  Array<{
    imageUrl: string;
    top: string;
    bottom: string;
    durationSec: number;
  }>
> {
  const out: Array<{
    imageUrl: string;
    top: string;
    bottom: string;
    durationSec: number;
  }> = [];

  for (const slide of slides) {
    let imageUrl: string | null = null;

    if (slide.galleryPath) {
      const candidate = galleryPublicUrl(slide.galleryPath);
      try {
        const head = await fetch(candidate, { method: "HEAD" });
        if (head.ok) imageUrl = candidate;
      } catch {
        // fallback Pexels ci-dessous
      }
    }

    if (!imageUrl) {
      const photos = await fetchPexelsPhotos(slide.photoQuery, 1);
      imageUrl = photos[0]!.imageUrl || photos[0]!.url;
    }

    out.push({
      imageUrl,
      top: slide.top,
      bottom: slide.bottom,
      durationSec: slide.durationSec,
    });
  }

  return out;
}

/** Photos Pexels (style TikTok Photo carousel) */
export async function fetchPexelsPhotos(
  query: string,
  count = 1
): Promise<VisualAsset[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error(
      "PEXELS_API_KEY manquant — crée une clé sur pexels.com/api"
    );
  }

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.max(count, 3)));
  url.searchParams.set("orientation", "portrait");

  const res = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pexels photos ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    photos?: Array<{
      src?: { large2x?: string; large?: string; portrait?: string };
      photographer?: string;
    }>;
  };

  const assets: VisualAsset[] = [];
  for (const photo of data.photos || []) {
    const src =
      photo.src?.portrait || photo.src?.large2x || photo.src?.large;
    if (src) {
      assets.push({
        url: src,
        imageUrl: src,
        photographer: photo.photographer,
      });
    }
    if (assets.length >= count) break;
  }

  if (assets.length === 0) {
    throw new Error(`Aucune photo Pexels pour « ${query} »`);
  }
  return assets;
}

export async function fetchPexelsVideos(
  query: string,
  count = 4
): Promise<VisualAsset[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) {
    throw new Error(
      "PEXELS_API_KEY manquant — crée une clé sur pexels.com/api"
    );
  }

  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(Math.max(count, 6)));
  url.searchParams.set("orientation", "portrait");

  const res = await fetch(url, {
    headers: { Authorization: key },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pexels erreur ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    videos?: Array<{
      image?: string;
      user?: { name?: string };
      video_files?: Array<{
        link: string;
        width: number;
        height: number;
        quality?: string;
      }>;
    }>;
  };

  const assets: VisualAsset[] = [];
  for (const video of data.videos || []) {
    const files = [...(video.video_files || [])].sort(
      (a, b) => Math.abs(a.height - 1920) - Math.abs(b.height - 1920)
    );
    const portrait =
      files.find((f) => f.height >= f.width && f.height >= 720) ||
      files.find((f) => f.height >= 720) ||
      files[0];
    if (portrait?.link) {
      assets.push({
        url: portrait.link,
        imageUrl: video.image,
        photographer: video.user?.name,
      });
    }
    if (assets.length >= count) break;
  }

  if (assets.length === 0) {
    // Fallback paysage si portrait rare
    const fallback = new URL("https://api.pexels.com/videos/search");
    fallback.searchParams.set("query", query);
    fallback.searchParams.set("per_page", "8");
    const res2 = await fetch(fallback, { headers: { Authorization: key } });
    if (res2.ok) {
      const data2 = (await res2.json()) as typeof data;
      for (const video of data2.videos || []) {
        const file = video.video_files
          ?.slice()
          .sort((a, b) => b.height - a.height)[0];
        if (file?.link) {
          assets.push({
            url: file.link,
            imageUrl: video.image,
            photographer: video.user?.name,
          });
        }
        if (assets.length >= count) break;
      }
    }
  }

  if (assets.length === 0) {
    throw new Error(`Aucun clip Pexels pour « ${query} »`);
  }

  return assets;
}
