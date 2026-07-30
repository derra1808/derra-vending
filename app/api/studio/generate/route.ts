import {
  assertCronSecret,
  assertStudioAdminApi,
} from "@/lib/studio/auth";
import { runGeneratePipeline } from "@/lib/studio/pipeline";

export const maxDuration = 300;

export async function POST(request: Request) {
  const isCron = assertCronSecret(request);
  if (!isCron) {
    const auth = await assertStudioAdminApi();
    if (!auth.ok) return auth.response;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      themeId?: string;
      customThemeText?: string;
      force?: boolean;
    };

    const result = await runGeneratePipeline({
      themeId: body.themeId,
      customThemeText: body.customThemeText,
      force: Boolean(body.force) || isCron,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 400 });
  }
}
