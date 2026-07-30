import { assertStudioAdminApi } from "@/lib/studio/auth";
import { runStudioAutoCron } from "@/lib/studio/pipeline";

export const maxDuration = 300;

/** Lance 1 tour auto tout de suite (admin connecté). */
export async function POST() {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const result = await runStudioAutoCron({ ignoreQuota: true });
    return Response.json({
      ok: true,
      ...result,
      message: result.generated?.length
        ? `Nouvelle vidéo lancée (${result.themes?.join(", ") || ""})`
        : result.skipped || "Tour terminé",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
