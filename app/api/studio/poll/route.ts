import { assertStudioAdminApi } from "@/lib/studio/auth";
import { pollPendingRenders } from "@/lib/studio/pipeline";

export const maxDuration = 300;

/** En local le webhook Shotstack n'atteint pas localhost — on poll manuellement. */
export async function POST() {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const polled = await pollPendingRenders();
    return Response.json({
      ok: true,
      polled,
      message:
        polled > 0
          ? `${polled} vidéo(s) mise(s) à jour.`
          : "Aucun rendu terminé pour l’instant — réessaie dans 30 s.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
