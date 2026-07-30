import { assertStudioAdminApi } from "@/lib/studio/auth";
import { getStudioSettings, updateStudioSettings } from "@/lib/studio/db";
import type { StudioPlatform } from "@/lib/studio/types";

export async function GET() {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;
  try {
    const settings = await getStudioSettings();
    return Response.json({ settings });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await assertStudioAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = (await request.json()) as {
      auto_publish?: boolean;
      daily_quota?: number;
      platforms?: StudioPlatform[];
      voice_id?: string | null;
      cta_url?: string | null;
      publish_hour_cet?: number;
      active_theme_id?: string | null;
      custom_theme_text?: string | null;
    };

    const settings = await updateStudioSettings(body);
    return Response.json({ settings });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 400 });
  }
}
