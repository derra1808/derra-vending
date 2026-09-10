import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const BUCKET = "formation-media";

export function wantsSignedSrc(request: Request) {
  return new URL(request.url).searchParams.get("src") === "1";
}

export function signedSrcResponse(url: string) {
  return NextResponse.json(
    { url },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

function mediaAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function getFormationMediaSignedUrl(
  kind: "audio" | "video",
  filename: string
): Promise<string | null> {
  const sb = mediaAdmin();
  if (!sb) return null;
  const path = `${kind}/${filename}`;
  const { data, error } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 6);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export async function signFormationMediaMap(
  items: { id: string; kind: "audio" | "video"; filename: string }[]
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    items.map(async (item) => {
      const url = await getFormationMediaSignedUrl(item.kind, item.filename);
      return url ? ([item.id, url] as const) : null;
    })
  );
  return Object.fromEntries(entries.filter(Boolean) as [string, string][]);
}

export { BUCKET as FORMATION_MEDIA_BUCKET };
