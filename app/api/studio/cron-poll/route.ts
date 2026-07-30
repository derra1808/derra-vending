import { assertCronSecret } from "@/lib/studio/auth";
import { pollPendingRenders } from "@/lib/studio/pipeline";

export const maxDuration = 60;

/** Poll Shotstack uniquement (rapide) — utilisé par studio-auto toutes les ~20 s. */
export async function GET(request: Request) {
  if (!assertCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const polled = await pollPendingRenders();
    return Response.json({ ok: true, polled });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
