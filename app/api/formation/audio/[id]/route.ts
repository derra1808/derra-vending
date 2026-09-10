import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync, readFileSync } from "fs";
import { resolve } from "path";
import { Readable } from "stream";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess, getSetupStatus } from "@/lib/formation/config";
import { FORMATION_AUDIO_TRACKS } from "@/lib/formation/audio-tracks";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";
import { hasLifetimeFormationAccess } from "@/lib/formation/access";
import {
  getFormationMediaSignedUrl,
  signedSrcResponse,
  wantsSignedSrc,
} from "@/lib/formation/media";

type BlobMeta = {
  pathname?: string;
  url?: string;
};

function getBlobMeta(trackId: string): BlobMeta | null {
  try {
    const path = resolve(process.cwd(), "lib/formation/audio-blob-urls.json");
    if (!existsSync(path)) return null;
    const data = JSON.parse(readFileSync(path, "utf8")) as Record<string, BlobMeta>;
    return data[trackId] ?? null;
  } catch {
    return null;
  }
}

async function signedBlobUrl(pathname: string): Promise<string | null> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  try {
    const { issueSignedToken, presignUrl } = await import("@vercel/blob");
    const validUntil = Date.now() + 1000 * 60 * 60 * 6; // 6h
    const signed = await issueSignedToken({
      pathname,
      operations: ["get"],
      validUntil,
      token,
    });
    const { presignedUrl } = await (presignUrl as Function)(signed, {
      access: "private",
      operation: "get",
      pathname,
      validUntil,
      token,
    });
    return typeof presignedUrl === "string" ? presignedUrl : null;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const track = FORMATION_AUDIO_TRACKS.find((t) => t.id === id);
  if (!track) {
    return NextResponse.json({ error: "Piste introuvable" }, { status: 404 });
  }

  const { user, profile } = await getProfile();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let access = hasLifetimeFormationAccess(user, profile) || isFormationFreeAccess();
  if (!access && getSetupStatus().stripe) {
    const synced = await syncPaidAccessForUser(user.id, user.email);
    if (synced.ok) access = true;
  }
  if (!access) {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  const supabaseUrl = await getFormationMediaSignedUrl("audio", track.filename);
  if (supabaseUrl) {
    if (wantsSignedSrc(request)) return signedSrcResponse(supabaseUrl);
    return NextResponse.redirect(supabaseUrl, 302);
  }

  const localPath = resolve(process.cwd(), "private/formation/audio", track.filename);
  if (existsSync(localPath)) {
    if (wantsSignedSrc(request)) {
      return signedSrcResponse(`/api/formation/audio/${id}`);
    }
    const stat = statSync(localPath);
    const stream = createReadStream(localPath);
    const webStream = Readable.toWeb(stream) as ReadableStream;
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(stat.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, no-store",
      },
    });
  }

  const meta = getBlobMeta(id);
  if (meta?.pathname) {
    const signed = await signedBlobUrl(meta.pathname);
    if (signed) {
      if (wantsSignedSrc(request)) return signedSrcResponse(signed);
      return NextResponse.redirect(signed, 302);
    }
  }

  return NextResponse.json(
    {
      error: "Audio pas encore disponible",
      hint: `Place ${track.filename} dans private/formation/audio/`,
    },
    { status: 404 }
  );
}
