import { assertStudioAdminApi } from "@/lib/studio/auth";
import { publishVideoById } from "@/lib/studio/pipeline";

export async function POST(request: Request) {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as { videoId?: string };
    if (!body.videoId) {
      return Response.json({ error: "videoId requis" }, { status: 400 });
    }
    const result = await publishVideoById(body.videoId);
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 400 });
  }
}
