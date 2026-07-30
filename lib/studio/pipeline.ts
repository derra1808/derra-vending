import { getStudioSetupStatus } from "./config";
import {
  countVideosCreatedToday,
  countVideosInProgress,
  createStudioVideo,
  getStudioSettings,
  getStudioVideo,
  listRecentThemeIds,
  updateStudioSettings,
  updateStudioVideo,
} from "./db";
import { publishToSocials } from "./publish";
import {
  CAROUSEL_EXAMPLE,
  getCarouselMusicUrl,
} from "./carousel-example";
import {
  getShotstackRenderStatus,
  startCarouselPhotoRender,
} from "./render";
import { generateCarouselFromTheme } from "./script";
import { getThemeById, pickTheme } from "./themes";
import { synthesizeSpeech } from "./tts";
import type { StudioTheme } from "./types";
import { fetchPexelsPhotos, resolveCarouselSlideImages } from "./visuals";

export function resolveActiveTheme(opts?: {
  themeId?: string | null;
  customThemeText?: string | null;
}): StudioTheme {
  const custom = opts?.customThemeText?.trim();
  if (custom) {
    return {
      id: "custom",
      label: custom.slice(0, 80),
      angle: custom,
      keywords: ["vending", "Genève", "Derra Vending"],
      visualQuery: "vending machine coffee office",
    };
  }

  if (opts?.themeId) {
    const found = getThemeById(opts.themeId);
    if (found) return found;
  }

  return pickTheme();
}

function siteBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

function scaleSlideDurations<
  T extends { durationSec: number; spoken: string },
>(slides: T[], voiceDurationSec: number): T[] {
  const weights = slides.map((s) => Math.max(s.spoken.split(/\s+/).length, 4));
  const sum = weights.reduce((a, b) => a + b, 0);
  const total = Math.max(voiceDurationSec, 20);
  return slides.map((s, i) => ({
    ...s,
    durationSec: Number(((weights[i]! / sum) * total).toFixed(2)),
  }));
}

/**
 * Pipeline : thème → Claude (slides uniques) → voix = texte à l'écran
 * → photos + musique basse → Shotstack → Metricool
 */
export async function runGeneratePipeline(opts?: {
  themeId?: string | null;
  customThemeText?: string | null;
  force?: boolean;
}): Promise<{ videoId: string; status: string; renderId?: string }> {
  const setup = getStudioSetupStatus();
  if (!setup.readyToGenerate) {
    throw new Error(
      "Configuration incomplète (Claude, ElevenLabs, Shotstack, Pexels, Blob, Supabase)."
    );
  }

  const settings = await getStudioSettings();
  if (!opts?.force) {
    const today = await countVideosCreatedToday();
    if (today >= settings.daily_quota) {
      throw new Error(
        `Quota journalier atteint (${settings.daily_quota}/jour).`
      );
    }
  }

  const theme = resolveActiveTheme({
    themeId:
      opts && "themeId" in opts ? opts.themeId : settings.active_theme_id,
    customThemeText:
      opts && "customThemeText" in opts
        ? opts.customThemeText
        : settings.custom_theme_text,
  });

  const generated = await generateCarouselFromTheme(theme);

  const video = await createStudioVideo({
    theme_id: theme.id,
    theme_label: theme.label,
    title: generated.title,
    hook: generated.hook,
    script: generated.narration,
    caption: generated.caption,
    hashtags: generated.hashtags,
    status: "generating",
    platforms: settings.platforms,
  });

  try {
    const { audioUrl, durationEstimateSec } = await synthesizeSpeech(
      generated.narration,
      settings.voice_id
    );
    await updateStudioVideo(video.id, { audio_url: audioUrl });

    const timedSlides = scaleSlideDurations(
      generated.slides,
      durationEstimateSec
    );

    const slidesWithImages = [];
    for (const slide of timedSlides) {
      const photos = await fetchPexelsPhotos(slide.photoQuery, 1);
      slidesWithImages.push({
        imageUrl: photos[0]!.imageUrl || photos[0]!.url,
        top: slide.top,
        bottom: slide.bottom,
        durationSec: slide.durationSec,
      });
    }

    await updateStudioVideo(video.id, { status: "rendering" });

    const { renderId } = await startCarouselPhotoRender({
      musicUrl: getCarouselMusicUrl(),
      voiceUrl: audioUrl,
      slides: slidesWithImages,
      webhookUrl: `${siteBaseUrl()}/api/studio/webhook/shotstack`,
    });

    await updateStudioVideo(video.id, {
      shotstack_id: renderId,
      status: "rendering",
    });

    return { videoId: video.id, status: "rendering", renderId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateStudioVideo(video.id, { status: "failed", error: message });
    throw err;
  }
}

/**
 * Bouton « Générer exemple TikTok » — slides hardcodés + photos gallery
 * + musique royalty-free. Pas de Claude / TTS (musique seule).
 */
export async function runCarouselExamplePipeline(opts?: {
  publish?: boolean;
}): Promise<{ videoId: string; status: string; renderId: string }> {
  const setup = getStudioSetupStatus();
  if (!setup.shotstack || !setup.supabase) {
    throw new Error(
      "SHOTSTACK_API_KEY + Supabase requis pour l’exemple TikTok."
    );
  }

  const settings = await getStudioSettings();
  const ex = CAROUSEL_EXAMPLE;
  const scriptText = ex.slides
    .map((s) => `${s.top}. ${s.bottom}`)
    .join(" ");

  const video = await createStudioVideo({
    theme_id: ex.themeId,
    theme_label: ex.themeLabel,
    title: ex.title,
    hook: ex.hook,
    script: scriptText,
    caption: ex.caption,
    hashtags: [...ex.hashtags],
    status: "generating",
    platforms: settings.platforms,
  });

  try {
    const slides = await resolveCarouselSlideImages(ex.slides);
    await updateStudioVideo(video.id, { status: "rendering" });

    const { renderId } = await startCarouselPhotoRender({
      musicUrl: getCarouselMusicUrl(),
      // TTS off pour ce test — musique au premier plan
      slides,
      webhookUrl: `${siteBaseUrl()}/api/studio/webhook/shotstack`,
    });

    await updateStudioVideo(video.id, {
      shotstack_id: renderId,
      status: "rendering",
    });

    // publish=false : on laisse le webhook/poll + auto_publish settings
    void opts?.publish;

    return { videoId: video.id, status: "rendering", renderId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await updateStudioVideo(video.id, { status: "failed", error: message });
    throw err;
  }
}

/** Appelé quand Shotstack a fini (webhook ou poll) — publie auto si auto_publish */
export async function finalizeRenderAndPublish(opts: {
  videoId?: string;
  renderId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}): Promise<{ videoId: string; status: string }> {
  let video = opts.videoId ? await getStudioVideo(opts.videoId) : null;

  if (!video && opts.renderId) {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("studio_videos")
      .select("*")
      .eq("shotstack_id", opts.renderId)
      .maybeSingle();
    video = data;
  }

  if (!video) {
    throw new Error("Vidéo introuvable pour finalisation");
  }

  if (opts.error) {
    await updateStudioVideo(video.id, {
      status: "failed",
      error: opts.error,
    });
    return { videoId: video.id, status: "failed" };
  }

  let videoUrl = opts.videoUrl;
  let posterUrl: string | undefined = opts.thumbnailUrl;
  if (!videoUrl && video.shotstack_id) {
    const status = await getShotstackRenderStatus(video.shotstack_id);
    if (status.status === "done" && status.url) {
      videoUrl = status.url;
      posterUrl = posterUrl || status.poster || status.thumbnail;
    } else if (status.status === "failed") {
      await updateStudioVideo(video.id, {
        status: "failed",
        error: status.error || "Shotstack failed",
      });
      return { videoId: video.id, status: "failed" };
    } else {
      return { videoId: video.id, status: "rendering" };
    }
  } else if (!posterUrl && video.shotstack_id) {
    try {
      const status = await getShotstackRenderStatus(video.shotstack_id);
      posterUrl = status.poster || status.thumbnail;
    } catch {
      // ignore
    }
  }

  if (!videoUrl) {
    throw new Error("URL vidéo manquante après rendu");
  }

  await updateStudioVideo(video.id, {
    video_url: videoUrl,
    ...(posterUrl ? { thumbnail_url: posterUrl } : {}),
    status: "publishing",
    error: null,
  });

  const settings = await getStudioSettings();
  if (settings.auto_publish === false) {
    await updateStudioVideo(video.id, {
      video_url: videoUrl,
      status: "publishing",
      error: "auto_publish désactivé — utilise Publier",
    });
    return { videoId: video.id, status: "publishing" };
  }

  return publishVideoById(video.id);
}

export async function publishVideoById(videoId: string): Promise<{
  videoId: string;
  status: string;
  publishError?: string;
}> {
  const setup = getStudioSetupStatus();
  if (!setup.readyToPublish) {
    throw new Error("Metricool non configuré — impossible de publier");
  }

  const video = await getStudioVideo(videoId);
  if (!video?.video_url) {
    throw new Error("Vidéo sans fichier à publier");
  }

  const settings = await getStudioSettings();
  const platforms = video.platforms?.length
    ? video.platforms
    : settings.platforms;

  await updateStudioVideo(videoId, { status: "publishing", error: null });

  try {
    const results = await publishToSocials({
      videoUrl: video.video_url,
      title: video.title,
      caption: video.caption || video.title,
      hashtags: video.hashtags || [],
      platforms,
    });

    await updateStudioVideo(videoId, {
      status: "published",
      publish_results: results,
      published_at: new Date().toISOString(),
      error: null,
    });

    return { videoId, status: "published" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Vidéo OK mais pub refusée (ex. Ayrshare Free = pas de vidéo) — on garde le fichier
    await updateStudioVideo(videoId, {
      status: "failed",
      error: `Vidéo prête — publication échouée: ${message}`,
      publish_results: { error: message },
    });
    // Ne pas throw : le fichier reste accessible via video_url
    return { videoId, status: "failed", publishError: message };
  }
}

export async function runDailyCron(): Promise<{
  generated?: string[];
  skipped?: string;
  polled?: number;
  themes?: string[];
}> {
  return runStudioAutoCron();
}

/**
 * Cron (Vercel Hobby = 1×/jour natif) :
 * 1) finalise les rendus → publie Metricool
 * 2) génère 1 histoire café/vending si quota (<5/jour) pas atteint
 *
 * Pour viser 5/jour sur Hobby : appelle cette route ~5×/jour
 * (cron-job.org) avec Authorization: Bearer CRON_SECRET.
 */
export async function runStudioAutoCron(): Promise<{
  generated?: string[];
  skipped?: string;
  polled?: number;
  themes?: string[];
}> {
  const polled = await pollPendingRenders();
  const settings = await getStudioSettings();

  if (settings.auto_publish === false) {
    return {
      polled,
      skipped: "auto_publish désactivé dans /studio",
    };
  }

  let quota = settings.daily_quota;
  if (quota < 5 || quota > 12) {
    await updateStudioSettings({ daily_quota: 5 });
    quota = 5;
  }

  const today = await countVideosCreatedToday();
  if (today >= quota) {
    return { polled, skipped: `quota atteint ${today}/${quota}` };
  }

  const inProgress = await countVideosInProgress();
  if (inProgress > 0) {
    return {
      polled,
      skipped: `${inProgress} déjà en cours — retry plus tard`,
    };
  }

  const excludeIds = await listRecentThemeIds(24);
  const theme = pickTheme(excludeIds);

  try {
    const result = await runGeneratePipeline({
      themeId: theme.id,
      customThemeText: null,
      force: true,
    });
    return {
      polled,
      generated: [result.videoId],
      themes: [theme.label],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { polled, skipped: message };
  }
}

export async function pollPendingRenders(): Promise<number> {
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("studio_videos")
    .select("id, shotstack_id")
    .eq("status", "rendering")
    .not("shotstack_id", "is", null)
    .limit(10);

  let done = 0;
  for (const row of data || []) {
    if (!row.shotstack_id) continue;
    try {
      const status = await getShotstackRenderStatus(row.shotstack_id);
      if (status.status === "done" && status.url) {
        await finalizeRenderAndPublish({
          videoId: row.id,
          videoUrl: status.url,
          thumbnailUrl: status.poster || status.thumbnail,
        });
        done += 1;
      } else if (status.status === "failed") {
        await updateStudioVideo(row.id, {
          status: "failed",
          error: status.error || "Shotstack failed",
        });
        done += 1;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[studio] poll ${row.id}: ${message}`);
    }
  }
  return done;
}
