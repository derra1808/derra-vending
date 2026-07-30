import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { resolve } from "path";
import { Readable } from "stream";
import { getProfile } from "@/lib/supabase/server";
import { isFormationFreeAccess, getSetupStatus } from "@/lib/formation/config";
import { MEMBER_VIDEOS } from "@/lib/formation/offer";
import { syncPaidAccessForUser } from "@/lib/stripe-confirm";

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

  const path = resolve(process.cwd(), "private/formation/videos", video.filename);
  if (!existsSync(path)) {
    return NextResponse.json(
      {
        error: "Vidéo pas encore uploadée",
        hint: `Place ${video.filename} dans private/formation/videos/`,
      },
      { status: 404 }
    );
  }

  const stat = statSync(path);
  const stream = createReadStream(path);
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
