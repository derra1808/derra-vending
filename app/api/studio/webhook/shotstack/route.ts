import { finalizeRenderAndPublish } from "@/lib/studio/pipeline";

/** Webhook Shotstack — pas d'auth session (callback externe) */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      id?: string;
      status?: string;
      url?: string;
      error?: string;
      response?: {
        id?: string;
        status?: string;
        url?: string;
        error?: string;
      };
    };

    const renderId = body.response?.id || body.id;
    const status = body.response?.status || body.status;
    const url = body.response?.url || body.url;
    const error = body.response?.error || body.error;

    if (!renderId) {
      return Response.json({ error: "id manquant" }, { status: 400 });
    }

    if (status === "failed") {
      await finalizeRenderAndPublish({ renderId, error: error || "failed" });
      return Response.json({ ok: true, status: "failed" });
    }

    if (status === "done" && url) {
      const result = await finalizeRenderAndPublish({
        renderId,
        videoUrl: url,
      });
      return Response.json({ ok: true, ...result });
    }

    return Response.json({ ok: true, ignored: status });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
