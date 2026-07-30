import type { StudioPlatform } from "./types";
import { getBrandLogoUrl } from "./render";

const NETWORK_MAP: Record<StudioPlatform, string> = {
  youtube: "youtube",
  tiktok: "tiktok",
  instagram: "instagram",
  facebook: "facebook",
};

const DEFAULT_HASHTAGS = [
  "histoireducafe",
  "vending",
  "distributeurautomatique",
  "cafe",
  "machineacafe",
  "geneve",
  "derravending",
  "espresso",
  "suisse",
];

function metricoolAuth() {
  const token = process.env.METRICOOL_API_TOKEN || process.env.METRICOOL_API_KEY;
  const userId = process.env.METRICOOL_USER_ID;
  const blogId = process.env.METRICOOL_BLOG_ID;
  if (!token) {
    throw new Error(
      "METRICOOL_API_TOKEN manquant — Account Settings → API dans Metricool"
    );
  }
  if (!userId || !blogId) {
    throw new Error(
      "METRICOOL_USER_ID et METRICOOL_BLOG_ID requis — dans l’URL Metricool : …?blogId=XXX&userId=YYY"
    );
  }
  return { token, userId, blogId };
}

function qs(userId: string, blogId: string) {
  return `userId=${encodeURIComponent(userId)}&blogId=${encodeURIComponent(blogId)}`;
}

async function readBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return { empty: true, status: res.status, statusText: res.statusText };
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500), status: res.status };
  }
}

function localDateTime(timezone: string, minutesAhead = 3): string {
  const when = new Date(Date.now() + minutesAhead * 60 * 1000);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(when);
  const get = (type: string) => parts.find((p) => p.type === type)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}`;
}

export function buildPublishTitle(raw: string | null | undefined): string {
  const t = (raw || "Derra Vending — Distributeur automatique Genève")
    .replace(/\s+/g, " ")
    .trim();
  return t.slice(0, 95);
}

export function buildPublishHashtags(
  incoming: string[] | null | undefined
): string[] {
  const cleaned = (incoming || [])
    .map((h) =>
      String(h)
        .replace(/^#/, "")
        .replace(/[^a-zA-Z0-9àâäéèêëïîôùûüç_]/gi, "")
        .trim()
    )
    .filter(Boolean);
  const merged = [...cleaned, ...DEFAULT_HASHTAGS];
  const uniq: string[] = [];
  for (const t of merged) {
    const lower = t.toLowerCase();
    if (!uniq.some((u) => u.toLowerCase() === lower)) uniq.push(t);
    if (uniq.length >= 20) break;
  }
  return uniq;
}

export function buildPublishText(opts: {
  title: string;
  caption: string;
  hashtags: string[];
}): string {
  const title = buildPublishTitle(opts.title);
  const caption = (opts.caption || title).trim();
  const tagsLine = opts.hashtags.map((t) => `#${t}`).join(" ");

  const body = caption.toLowerCase().startsWith(title.toLowerCase().slice(0, 20))
    ? caption
    : `${title}\n\n${caption}`;

  return `${body}\n\n${tagsLine}`.trim().slice(0, 2200);
}

async function normalizeMedia(mediaUrl: string): Promise<string> {
  const { token, userId, blogId } = metricoolAuth();
  const endpoint = new URL(
    "https://app.metricool.com/api/actions/normalize/image/url"
  );
  endpoint.searchParams.set("url", mediaUrl);
  endpoint.searchParams.set("userId", userId);
  endpoint.searchParams.set("blogId", blogId);

  const res = await fetch(endpoint.toString(), {
    method: "GET",
    headers: {
      "X-Mc-Auth": token,
      Accept: "text/plain, */*",
    },
  });

  const text = (await res.text()).trim();
  if (!res.ok) {
    throw new Error(
      `Metricool normalize ${res.status}: ${text.slice(0, 400) || res.statusText}`
    );
  }

  const url = text.replace(/^"|"$/g, "").trim();
  if (!url.startsWith("http")) {
    throw new Error(
      `Metricool normalize: réponse inattendue « ${text.slice(0, 200)} »`
    );
  }
  return url;
}

/**
 * Publie via Metricool — titre, hashtags, logo miniature, TikTok inclus.
 */
export async function publishToSocials(opts: {
  videoUrl: string;
  title: string;
  caption: string;
  hashtags: string[];
  platforms: StudioPlatform[];
}): Promise<Record<string, unknown>> {
  const { token, userId, blogId } = metricoolAuth();
  const timezone = process.env.METRICOOL_TIMEZONE || "Europe/Zurich";

  const title = buildPublishTitle(opts.title);
  const hashtags = buildPublishHashtags(opts.hashtags);
  const text = buildPublishText({
    title,
    caption: opts.caption || title,
    hashtags,
  });

  // Toujours inclure TikTok si demandé dans settings (défaut)
  const networks = opts.platforms.map((p) => NETWORK_MAP[p]).filter(Boolean);
  // Si platforms vide / mal enregistré → publier sur les 4 réseaux
  if (networks.length === 0) {
    networks.push("youtube", "tiktok", "instagram", "facebook");
  }

  const providers = networks.map((network) => ({ network }));
  const mediaUrl = await normalizeMedia(opts.videoUrl);

  // Logo miniature Metricool — uniquement si URL publique (pas localhost)
  let logoThumbUrl: string | undefined;
  const logoCandidate = getBrandLogoUrl();
  if (!/localhost|127\.0\.0\.1/i.test(logoCandidate)) {
    try {
      logoThumbUrl = await normalizeMedia(logoCandidate);
    } catch {
      logoThumbUrl = undefined;
    }
  }

  const body: Record<string, unknown> = {
    text,
    title,
    firstCommentText: hashtags
      .slice(0, 8)
      .map((t) => `#${t}`)
      .join(" "),
    providers,
    autoPublish: true,
    saveExternalMediaFiles: true,
    shortener: false,
    draft: false,
    // Format string = le plus fiable ; objet = miniature logo si dispo
    media: logoThumbUrl
      ? [
          {
            url: mediaUrl,
            position: 0,
            videoThumbnailUrl: logoThumbUrl,
            videoCoverMilliseconds: 1000,
            altText: title,
          },
        ]
      : [mediaUrl],
    publicationDate: {
      dateTime: localDateTime(timezone, 3),
      timezone,
    },
    creatorUserId: Number(userId),
  };

  if (networks.includes("facebook")) {
    body.facebookData = {
      type: "REEL",
      title,
    };
  }
  if (networks.includes("instagram")) {
    body.instagramData = {
      autoPublish: true,
      type: "REEL",
    };
  }
  if (networks.includes("youtube")) {
    body.youtubeData = {
      title,
      type: "SHORT",
      description: text.slice(0, 4000),
      tags: hashtags.slice(0, 15),
      privacy: "public",
      ...(logoThumbUrl ? { thumbnail: logoThumbUrl } : {}),
    };
  }
  if (networks.includes("tiktok")) {
    // privacyOption obligatoire — sinon Metricool / TikTok ignore souvent le post
    body.tiktokData = {
      title: title.slice(0, 150),
      disableComment: false,
      disableDuet: false,
      disableStitch: false,
      privacyOption: "PUBLIC_TO_EVERYONE",
      commercialContentOwnBrand: true,
      commercialContentThirdParty: false,
      autoAddMusic: false,
    };
  }

  const res = await fetch(
    `https://app.metricool.com/api/v2/scheduler/posts?${qs(userId, blogId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mc-Auth": token,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await readBody(res);
  if (!res.ok) {
    // Fallback: si media objet échoue, réessayer avec URL simple + tiktokData
    if (res.status === 400 || res.status === 500) {
      const fallback = await publishFallbackSimpleMedia({
        token,
        userId,
        blogId,
        text,
        title,
        hashtags,
        networks,
        mediaUrl,
        logoThumbUrl,
        timezone,
      });
      if (fallback) return fallback;
    }
    if (res.status === 400 || res.status === 403) {
      const swapped = await trySwapIds(body, token);
      if (swapped) return swapped;
    }
    throw new Error(
      `Metricool ${res.status}: ${JSON.stringify(data).slice(0, 600)}`
    );
  }

  return {
    provider: "metricool",
    mediaUrl,
    logoThumbUrl,
    title,
    hashtags,
    networks,
    post: data,
  };
}

async function publishFallbackSimpleMedia(opts: {
  token: string;
  userId: string;
  blogId: string;
  text: string;
  title: string;
  hashtags: string[];
  networks: string[];
  mediaUrl: string;
  logoThumbUrl?: string;
  timezone: string;
}): Promise<Record<string, unknown> | null> {
  const body: Record<string, unknown> = {
    text: opts.text,
    title: opts.title,
    providers: opts.networks.map((network) => ({ network })),
    autoPublish: true,
    draft: false,
    media: [opts.mediaUrl],
    publicationDate: {
      dateTime: localDateTime(opts.timezone, 3),
      timezone: opts.timezone,
    },
    creatorUserId: Number(opts.userId),
    tiktokData: {
      title: opts.title.slice(0, 150),
      privacyOption: "PUBLIC_TO_EVERYONE",
      commercialContentOwnBrand: true,
      commercialContentThirdParty: false,
      disableComment: false,
      disableDuet: false,
      disableStitch: false,
      autoAddMusic: false,
    },
    youtubeData: {
      title: opts.title,
      type: "SHORT",
      tags: opts.hashtags.slice(0, 15),
      privacy: "public",
    },
    facebookData: { type: "REEL", title: opts.title },
    instagramData: { autoPublish: true, type: "REEL" },
  };

  const res = await fetch(
    `https://app.metricool.com/api/v2/scheduler/posts?${qs(opts.userId, opts.blogId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mc-Auth": opts.token,
      },
      body: JSON.stringify(body),
    }
  );
  const data = await readBody(res);
  if (!res.ok) return null;
  return {
    provider: "metricool",
    mode: "fallback-simple-media",
    logoThumbUrl: opts.logoThumbUrl,
    post: data,
  };
}

async function trySwapIds(
  body: Record<string, unknown>,
  token: string
): Promise<Record<string, unknown> | null> {
  const userId = process.env.METRICOOL_USER_ID!;
  const blogId = process.env.METRICOOL_BLOG_ID!;
  const res = await fetch(
    `https://app.metricool.com/api/v2/scheduler/posts?${qs(blogId, userId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mc-Auth": token,
      },
      body: JSON.stringify({
        ...body,
        creatorUserId: Number(blogId),
      }),
    }
  );
  const data = await readBody(res);
  if (!res.ok) return null;
  return {
    provider: "metricool",
    note: "IDs inversés ont fonctionné — inverse METRICOOL_USER_ID et METRICOOL_BLOG_ID dans .env.local",
    post: data,
  };
}
