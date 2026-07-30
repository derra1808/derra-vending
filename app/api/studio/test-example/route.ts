import {
  assertCronSecret,
  assertStudioAdminApi,
} from "@/lib/studio/auth";
import { runCarouselExamplePipeline } from "@/lib/studio/pipeline";

export const maxDuration = 300;

/**
 * Génère l’exemple TikTok Photo + musique (slides hardcodés, sans TTS).
 * Auth : session admin OU Bearer CRON_SECRET.
 */
export async function POST(request: Request) {
  const isCron = assertCronSecret(request);
  if (!isCron) {
    const auth = await assertStudioAdminApi();
    if (!auth.ok) return auth.response;
  }

  try {
    const result = await runCarouselExamplePipeline({ publish: false });
    return Response.json({
      ...result,
      message:
        "Exemple TikTok lancé (photos gallery + textes FR + musique libre). Attends 1–3 min puis « Rafraîchir statut ».",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 400 });
  }
}
