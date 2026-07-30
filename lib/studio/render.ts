import { readFile } from "fs/promises";
import path from "path";
import { COMPANY } from "@/lib/data";
import type { VisualAsset } from "./visuals";

type MergeField = { find: string; replace: string | number };

function shotstackBaseUrl(): string {
  const env = (process.env.SHOTSTACK_ENV || "stage").toLowerCase();
  const version =
    env === "v1" || env === "prod" || env === "production" ? "v1" : "stage";
  // Edit API (templates + render). Legacy host without /edit still works for some routes.
  return `https://api.shotstack.io/edit/${version}`;
}

function getApiKey(): string {
  const key = process.env.SHOTSTACK_API_KEY;
  if (!key) {
    throw new Error(
      "SHOTSTACK_API_KEY manquant — crée un compte sur shotstack.io"
    );
  }
  return key;
}

/** URL publique du logo — jamais localhost (Shotstack / Metricool ne peuvent pas le lire). */
export function getBrandLogoUrl(): string {
  if (process.env.STUDIO_LOGO_URL) {
    const url = process.env.STUDIO_LOGO_URL.replace(/\/$/, "");
    if (!/localhost|127\.0\.0\.1/i.test(url)) return url;
  }
  return "https://derra-vending.ch/brand/logo.png";
}

/** Lit le logo local en data-URI (Shotstack accepte ça dans un asset HTML). */
async function loadLogoDataUri(): Promise<string | null> {
  try {
    const filePath = path.join(process.cwd(), "public", "brand", "logo.png");
    const buf = await readFile(filePath);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch (err) {
    console.warn(
      "[studio] lecture logo local échouée:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/**
 * Logo Derra uniquement à la FIN du montage (carte après le contenu).
 * Embarqué en data-URI (pas d’URL localhost pour Shotstack).
 */
async function buildLogoEndClip(
  contentDuration: number,
  endLength = 2.8
): Promise<Record<string, unknown> | null> {
  const dataUri = await loadLogoDataUri();
  if (!dataUri) return null;

  const start = Number(contentDuration.toFixed(2));
  const length = Number(endLength.toFixed(2));

  return {
    asset: {
      type: "html",
      html: `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,#1a1a1c 0%,#0A0A0B 70%);box-sizing:border-box;padding:40px;">
        <img src="${dataUri}" alt="" style="width:280px;height:280px;object-fit:contain;border-radius:50%;box-shadow:0 12px 40px rgba(0,0,0,0.55);" />
        <p style="margin:28px 0 0;font-family:'Montserrat',Arial,sans-serif;font-weight:800;font-size:42px;color:#F5F0E8;letter-spacing:0.04em;text-align:center;">Derra Vending</p>
        <p style="margin:10px 0 0;font-family:'Montserrat',Arial,sans-serif;font-weight:600;font-size:22px;color:#C9A227;text-align:center;">Genève · Distributeurs automatiques</p>
      </div>`,
      width: 1080,
      height: 1920,
      background: "#0A0A0B",
    },
    start,
    length,
    fit: "cover",
    position: "center",
    transition: { in: "fade", out: "fade" },
    opacity: 1,
  };
}

function splitCaptions(script: string, totalDuration: number) {
  const sentences = script
    .split(/(?<=[.!?…])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks = sentences.length > 0 ? sentences : [script];
  const weights = chunks.map((c) => Math.max(c.split(/\s+/).length, 3));
  const sum = weights.reduce((a, b) => a + b, 0);
  let cursor = 0;
  return chunks.map((text, i) => {
    const length = (weights[i]! / sum) * totalDuration;
    const start = cursor;
    cursor += length;
    return { text, start: Number(start.toFixed(2)), length: Number(length.toFixed(2)) };
  });
}

function visualImageUrl(clip: VisualAsset | undefined, fallback: string): string {
  if (!clip) return fallback;
  return clip.imageUrl || clip.url || fallback;
}

/**
 * Merge fields for the configured Shotstack template.
 * Template ebfd5599… is Shotstack’s “Real Estate Slideshow with Overlays”
 * (ADDRESS, IMAGE_1…5, AGENT_*, etc.). We also send Derra aliases
 * (TITLE, HOOK, SCRIPT, …) so a future custom template can use them.
 */
export function buildTemplateMergeFields(opts: {
  audioUrl: string;
  clips: VisualAsset[];
  script: string;
  title: string;
  hook?: string;
  caption?: string;
  durationSec: number;
}): MergeField[] {
  const logo = getBrandLogoUrl();
  const images = [0, 1, 2, 3, 4].map((i) =>
    visualImageUrl(opts.clips[i] || opts.clips[i % Math.max(opts.clips.length, 1)], logo)
  );

  const cityParts = COMPANY.city.split(/\s+/);
  const postcode = cityParts[0] || "1217";
  const suburb = cityParts.slice(1).join(" ") || "Meyrin";

  return [
    // --- Champs du template immobilier actuel ---
    { find: "ADDRESS", replace: opts.title.slice(0, 80) },
    { find: "SUBURB", replace: suburb.toUpperCase() },
    { find: "STATE", replace: "GE" },
    { find: "POSTCODE", replace: postcode },
    { find: "TYPE", replace: (opts.hook || opts.title).slice(0, 40).toUpperCase() },
    { find: "BEDROOMS", replace: "40" },
    { find: "BATHROOMS", replace: "24" },
    { find: "CARPORTS", replace: "7" },
    { find: "IMAGE_1", replace: images[0]! },
    { find: "IMAGE_2", replace: images[1]! },
    { find: "IMAGE_3", replace: images[2]! },
    { find: "IMAGE_4", replace: images[3]! },
    { find: "IMAGE_5", replace: images[4]! },
    { find: "AGENT_NAME", replace: COMPANY.founder.toUpperCase() },
    { find: "AGENT_EMAIL", replace: COMPANY.email },
    { find: "AGENT_PICTURE", replace: logo },
    { find: "AGENCY_LOGO", replace: logo },

    // --- Alias pour un futur template Derra (9:16 short-form) ---
    { find: "TITLE", replace: opts.title },
    { find: "HOOK", replace: opts.hook || opts.title },
    { find: "SCRIPT", replace: opts.script },
    { find: "CAPTION", replace: opts.caption || opts.title },
    { find: "AUDIO_URL", replace: opts.audioUrl },
    { find: "DURATION", replace: Math.max(28, Math.min(58, opts.durationSec)) },
  ];
}

async function startTemplateRender(opts: {
  audioUrl: string;
  clips: VisualAsset[];
  script: string;
  title: string;
  hook?: string;
  caption?: string;
  durationSec: number;
  webhookUrl?: string;
  templateId: string;
}): Promise<{ renderId: string }> {
  const key = getApiKey();
  const body: Record<string, unknown> = {
    id: opts.templateId,
    merge: buildTemplateMergeFields(opts),
  };
  if (opts.webhookUrl) {
    body.callback = opts.webhookUrl;
  }

  const res = await fetch(`${shotstackBaseUrl()}/templates/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(
      `Shotstack template render ${res.status}: ${err.slice(0, 400)}`
    );
  }

  const data = (await res.json()) as {
    response?: { id?: string };
    id?: string;
  };
  const renderId = data.response?.id || data.id;
  if (!renderId) throw new Error("Shotstack: id de rendu manquant (template)");
  return { renderId };
}

async function startEditJsonRender(opts: {
  audioUrl: string;
  clips: VisualAsset[];
  script: string;
  title: string;
  durationSec: number;
  webhookUrl?: string;
}): Promise<{ renderId: string }> {
  const key = getApiKey();

  const duration = Math.max(28, Math.min(58, opts.durationSec));
  const clipCount = Math.max(opts.clips.length, 1);
  const clipLen = duration / clipCount;

  const videoClips = opts.clips.map((clip, i) => ({
    asset: {
      type: "video",
      src: clip.url,
      volume: 0,
    },
    start: Number((i * clipLen).toFixed(2)),
    length: Number(clipLen.toFixed(2)),
    fit: "cover",
    transition: { in: "fade", out: "fade" },
  }));

  const captionClips = splitCaptions(opts.script, duration).map((c) => ({
    asset: {
      type: "html",
      html: `<p style="font-family: 'Montserrat', Arial, sans-serif; font-weight: 700; font-size: 42px; color: #ffffff; text-align: center; text-shadow: 0 2px 12px rgba(0,0,0,0.85); line-height: 1.25; padding: 0 28px;">${escapeHtml(c.text)}</p>`,
      width: 980,
      height: 420,
      background: "transparent",
      position: "bottom",
    },
    start: c.start,
    length: c.length,
    position: "bottom",
    offset: { y: 0.08 },
  }));

  const titleClip = {
    asset: {
      type: "html",
      html: `<p style="font-family: 'Montserrat', Arial, sans-serif; font-weight: 800; font-size: 48px; color: #E0C98A; text-align: center; text-shadow: 0 2px 16px rgba(0,0,0,0.9); padding: 0 32px;">${escapeHtml(opts.title)}</p>`,
      width: 1000,
      height: 220,
      background: "transparent",
    },
    start: 0,
    length: Math.min(3.5, duration * 0.12),
    position: "top",
    offset: { y: -0.05 },
  };

  const timeline = {
    soundtrack: {
      src: opts.audioUrl,
      effect: "fadeOut",
      volume: 1,
    },
    background: "#0A0A0B",
    tracks: [
      { clips: captionClips },
      { clips: [titleClip] },
      { clips: videoClips },
    ],
  };

  const body: Record<string, unknown> = {
    timeline,
    output: {
      format: "mp4",
      resolution: "1080",
      aspectRatio: "9:16",
      fps: 30,
      quality: "high",
    },
  };

  if (opts.webhookUrl) {
    body.callback = opts.webhookUrl;
  }

  const res = await fetch(`${shotstackBaseUrl()}/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shotstack render ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    response?: { id?: string };
    id?: string;
  };
  const renderId = data.response?.id || data.id;
  if (!renderId) throw new Error("Shotstack: id de rendu manquant");
  return { renderId };
}

/** Carousel photo TikTok : images + bulles + VOIX (texte à l'écran) + musique basse */
export async function startCarouselPhotoRender(opts: {
  musicUrl: string;
  /** Voix ElevenLabs qui lit le texte affiché */
  voiceUrl?: string;
  slides: Array<{
    imageUrl: string;
    top: string;
    bottom: string;
    durationSec: number;
  }>;
  webhookUrl?: string;
}): Promise<{ renderId: string }> {
  const key = getApiKey();
  let cursor = 0;

  const imageClips = opts.slides.map((slide) => {
    const start = cursor;
    cursor += slide.durationSec;
    return {
      asset: {
        type: "image",
        src: slide.imageUrl,
      },
      start: Number(start.toFixed(2)),
      length: slide.durationSec,
      fit: "cover",
      scale: 1,
      effect: "zoomIn",
      transition: { in: "fade", out: "fade" },
    };
  });

  cursor = 0;
  const textClips = opts.slides.flatMap((slide) => {
    const start = cursor;
    cursor += slide.durationSec;
    const top = {
      asset: {
        type: "html",
        html: `<div style="background:#ffffff;border-radius:18px;padding:18px 22px;box-shadow:0 8px 28px rgba(0,0,0,0.35);"><p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-weight:800;font-size:36px;color:#111;text-align:center;line-height:1.25;">${escapeHtml(slide.top)}</p></div>`,
        width: 920,
        height: 280,
        background: "transparent",
      },
      start: Number(start.toFixed(2)),
      length: slide.durationSec,
      position: "top",
      offset: { y: -0.12 },
    };
    const bottom = {
      asset: {
        type: "html",
        html: `<div style="background:#ffffff;border-radius:18px;padding:16px 20px;box-shadow:0 8px 28px rgba(0,0,0,0.35);"><p style="margin:0;font-family:'Montserrat',Arial,sans-serif;font-weight:700;font-size:32px;color:#111;text-align:center;line-height:1.25;">${escapeHtml(slide.bottom)}</p></div>`,
        width: 920,
        height: 240,
        background: "transparent",
      },
      start: Number(start.toFixed(2)),
      length: slide.durationSec,
      position: "bottom",
      offset: { y: 0.12 },
    };
    return [top, bottom];
  });

  const contentDuration = opts.slides.reduce((s, x) => s + x.durationSec, 0);
  const endLength = 2.8;
  const totalDuration = Number((contentDuration + endLength).toFixed(2));
  const logoClip = await buildLogoEndClip(contentDuration, endLength);

  // Voix = piste principale ; musique = fond bas
  const voiceUrl = opts.voiceUrl;
  const tracks: unknown[] = [];
  if (logoClip) tracks.push({ clips: [logoClip] });
  tracks.push({ clips: textClips });
  tracks.push({ clips: imageClips });

  const timeline: Record<string, unknown> = {
    background: "#0A0A0B",
    tracks,
  };

  if (voiceUrl) {
    timeline.soundtrack = {
      src: voiceUrl,
      effect: "fadeOut",
      volume: 1,
    };
    // Musique en fond pendant le contenu + fin logo
    (timeline.tracks as unknown[]).push({
      clips: [
        {
          asset: {
            type: "audio",
            src: opts.musicUrl,
            volume: 0.18,
            effect: "fadeOut",
          },
          start: 0,
          length: totalDuration,
        },
      ],
    });
  } else {
    // Mode photo-story / test : musique au premier plan (style TikTok Photo)
    timeline.soundtrack = {
      src: opts.musicUrl,
      effect: "fadeInFadeOut",
      volume: 0.85,
    };
  }

  const body: Record<string, unknown> = {
    timeline,
    output: {
      format: "mp4",
      resolution: "1080",
      aspectRatio: "9:16",
      fps: 30,
      quality: "high",
      // Cover = fin du montage (carte logo)
      poster: {
        capture: Number((contentDuration + endLength * 0.45).toFixed(2)),
      },
      thumbnail: {
        capture: Number((contentDuration + endLength * 0.45).toFixed(2)),
        scale: 0.5,
      },
    },
  };
  if (opts.webhookUrl) body.callback = opts.webhookUrl;

  const res = await fetch(`${shotstackBaseUrl()}/render`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shotstack carousel ${res.status}: ${err.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    response?: { id?: string };
    id?: string;
  };
  const renderId = data.response?.id || data.id;
  if (!renderId) throw new Error("Shotstack: id de rendu manquant (carousel)");
  return { renderId };
}

export async function startShotstackRender(opts: {
  audioUrl: string;
  clips: VisualAsset[];
  script: string;
  title: string;
  hook?: string;
  caption?: string;
  durationSec: number;
  webhookUrl?: string;
}): Promise<{ renderId: string; mode: "template" | "edit" }> {
  const templateId = process.env.SHOTSTACK_TEMPLATE_ID?.trim();
  if (templateId) {
    try {
      const result = await startTemplateRender({ ...opts, templateId });
      return { ...result, mode: "template" };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(
        `[studio] Template Shotstack échoué (${message.slice(0, 160)}) — fallback edit JSON`
      );
    }
  }

  const result = await startEditJsonRender(opts);
  return { ...result, mode: "edit" };
}

export async function getShotstackRenderStatus(renderId: string): Promise<{
  status: string;
  url?: string;
  poster?: string;
  thumbnail?: string;
  error?: string;
}> {
  const key = getApiKey();

  const res = await fetch(`${shotstackBaseUrl()}/render/${renderId}`, {
    headers: { "x-api-key": key },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shotstack status ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    response?: {
      status?: string;
      url?: string;
      poster?: string | null;
      thumbnail?: string | null;
      error?: string;
    };
  };
  return {
    status: data.response?.status || "unknown",
    url: data.response?.url,
    poster: data.response?.poster || undefined,
    thumbnail: data.response?.thumbnail || undefined,
    error: data.response?.error,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
