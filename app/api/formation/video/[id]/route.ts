import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync, readFileSync } from "fs";
import { resolve } from "path";
import { Readable } from "stream";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess, getSetupStatus } from "@/lib/formation/config";
import { MEMBER_VIDEOS } from "@/lib/formation/offer";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";

type BlobMeta = {
  pathname?: string;
  url?: string;
};

function getBlobMeta(videoId: string): BlobMeta | null {
  try {
    const path = resolve(process.cwd(), "lib/formation/video-blob-urls.json");
    if (!existsSync(path)) return null;
    const data = JSON.parse(readFileSync(path, "utf8")) as Record<string, BlobMeta>;
    return data[videoId] ?? null;
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
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const video = MEMBER_VIDEOS.find((v) => v.id === id);
  if (!video) {
    return NextResponse.json({ error: "Vidéo introuvable" }, { status: 404 });
  }

  const { user, profile } = await getProfile();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  let access = (profile?.has_paid ?? false) || isFormationFreeAccess();
  if (!access && getSetupStatus().stripe) {
    const synced = await syncPaidAccessForUser(user.id);
    if (synced.ok) access = true;
  }
  if (!access) {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  const localPath = resolve(process.cwd(), "private/formation/videos", video.filename);
  if (existsSync(localPath)) {
    const stat = statSync(localPath);
    const stream = createReadStream(localPath);
    const webStream = Readable.toWeb(stream) as ReadableStream;
    return new NextResponse(webStream, {
      headers: {
        "Content-Type": "video/mp4",
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
      return NextResponse.redirect(signed, 302);
    }
  }

  return NextResponse.json(
    {
      error: "Vidéo pas encore uploadée",
      hint: `Place ${video.filename} dans private/formation/videos/`,
    },
    { status: 404 }
  );
}
