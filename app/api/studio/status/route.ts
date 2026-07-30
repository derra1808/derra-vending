import { assertStudioAdminApi } from "@/lib/studio/auth";
import {
  countVideosCreatedToday,
  countVideosInProgress,
  getStudioSettings,
  listStudioVideos,
} from "@/lib/studio/db";
import {
  currentPublishWindow,
  isInPublishWindow,
  nextPublicationDateTime,
  PUBLISH_WINDOWS,
  SCHEDULE_DAILY_QUOTA,
  scheduleHint,
} from "@/lib/studio/schedule";

export const dynamic = "force-dynamic";

/** Statut live pour voir si le studio travaille. */
export async function GET() {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const [settings, today, inProgress, videos] = await Promise.all([
      getStudioSettings(),
      countVideosCreatedToday(),
      countVideosInProgress(),
      listStudioVideos(8),
    ]);

    const latest = videos[0]
      ? {
          id: videos[0].id,
          title: videos[0].title,
          status: videos[0].status,
          created_at: videos[0].created_at,
          error: videos[0].error,
          video_url: videos[0].video_url,
        }
      : null;

    const quota = SCHEDULE_DAILY_QUOTA;
    const win = currentPublishWindow();
    const next = nextPublicationDateTime();
    const inWindow = isInPublishWindow();

    return Response.json({
      ok: true,
      now: new Date().toISOString(),
      auto_publish: settings.auto_publish !== false,
      quota,
      today,
      remaining: Math.max(0, quota - today),
      inProgress,
      working: inProgress > 0,
      inWindow,
      window: win,
      nextSlot: next.dateTime,
      windows: PUBLISH_WINDOWS,
      latest,
      hint:
        inProgress > 0
          ? "Une vidéo est en cours (montage ou publication)."
          : today >= quota
            ? "Quota du jour atteint (10/jour) — reprise demain."
            : scheduleHint(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
