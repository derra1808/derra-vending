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
  const folder = await sb.storage.from(BUCKET).list(kind, {
    search: filename,
    limit: 20,
  });
  if (folder.error || !folder.data?.some((f) => f.name === filename && (f.metadata?.size ?? 1) > 0)) {
    return null;
  }
  const { data, error } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 60 * 6);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}

export { BUCKET as FORMATION_MEDIA_BUCKET };
