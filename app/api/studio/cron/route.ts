import { assertCronSecret } from "@/lib/studio/auth";
import { runStudioAutoCron } from "@/lib/studio/pipeline";

export const maxDuration = 300;

/**
 * Vercel Cron : 1×/jour (Hobby).
 * Lance jusqu’à 5 histoires café/vending → Shotstack → Metricool (webhook).
 */
export async function GET(request: Request) {
  if (!assertCronSecret(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runStudioAutoCron();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
